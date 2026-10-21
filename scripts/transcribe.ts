/**
 * 설교 영상 전사 → 요약·인사이트 생성 파이프라인
 *   Discover(영상 찾기) → Verify(채널·날짜 대조) → Transcribe(자막) → Analyze(Claude) → Validate → Write
 *
 * 사용
 *   npm run transcribe                         # 노트가 없는 게시 확인 설교 전부
 *   npm run transcribe -- --id=2026-10-20-kim-barnabas --url=https://youtu.be/...
 *   npm run transcribe -- --id=... --transcript=./my.txt   # 자막 대신 직접 준비한 전사문
 *   npm run transcribe -- --id=... --force                 # 기존 노트 덮어쓰기
 *
 * 필요: yt-dlp(자막·검색), ANTHROPIC_API_KEY 또는 다른 Anthropic 인증 수단.
 * 원칙: 전사 원문은 data/transcripts/(gitignore)에만 둔다. 노트에는 직접 인용 대신 요약과 타임스탬프만 담는다.
 */
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod/v4";
import { speakerById } from "../content/event";
import { sermons } from "../content/sermons";
import { sermonNotes } from "../content/sermon-notes";
import { SermonNote } from "../lib/schema";
import type { Sermon } from "../lib/schema";

const MODEL = "claude-opus-5-5";
const TRANSCRIPT_DIR = "data/transcripts";
const NOTES_DIR = "content/sermon-notes";
const EVENT_FROM = "20261019";
const EVENT_TO = "20261025";
const CHANNEL_HINTS = ["사랑의교회", "sarang", "SaRang"];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : "true"];
  }),
);

/* ── yt-dlp ─────────────────────────────────────────────────────── */
function ytdlp(argv: string[]): string {
  const extra = process.env.YTDLP_COOKIES_FILE ? ["--cookies", process.env.YTDLP_COOKIES_FILE] : [];
  return execFileSync("yt-dlp", [...extra, "--no-warnings", ...argv], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const norm = (s: string) => s.replace(/[\s!?.,·'"“”‘’()[\]-]/g, "").toLowerCase();

type VideoMeta = { id: string; url: string; title: string; channel: string; uploadDate?: string; duration: number };

function readMeta(url: string): VideoMeta {
  const [id, title, channel, upload, duration, webpage] = ytdlp([
    "--skip-download",
    "--print",
    "%(id)s\t%(title)s\t%(channel)s\t%(upload_date)s\t%(duration)s\t%(webpage_url)s",
    url,
  ])
    .trim()
    .split("\t");
  const uploadDate = /^\d{8}$/.test(upload) ? `${upload.slice(0, 4)}-${upload.slice(4, 6)}-${upload.slice(6)}` : undefined;
  return { id, title, channel, uploadDate, duration: Number(duration) || 0, url: webpage || url };
}

/** 제목·강사로 공식 채널 영상을 찾는다. 확신할 수 없으면 후보를 보여 주고 멈춘다. */
function discover(s: Sermon): string {
  const speaker = speakerById(s.speakerId)?.name ?? "";
  const out = ytdlp(["--flat-playlist", "--print", "%(id)s\t%(title)s\t%(channel)s", `ytsearch10:${s.title} ${speaker} 사랑의교회`]);
  const rows = out.trim().split("\n").map((l) => l.split("\t"));
  const hit = rows.find(
    ([, title, channel]) => norm(title ?? "").includes(norm(s.title)) && CHANNEL_HINTS.some((h) => (channel ?? "").includes(h)),
  );
  if (!hit) {
    const list = rows.map(([id, t, c]) => `  - ${t} / ${c} / https://youtu.be/${id}`).join("\n");
    throw new Error(`공식 영상을 확정하지 못했습니다. --url로 지정하세요.\n후보:\n${list}`);
  }
  return `https://www.youtube.com/watch?v=${hit[0]}`;
}

/* ── 자막 → 타임스탬프 전사문 ──────────────────────────────────── */
type Json3 = { events?: { tStartMs?: number; segs?: { utf8?: string }[] }[] };

const clock = (ms: number) => {
  const t = Math.floor(ms / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

function captionsToText(json: Json3, bucketMs = 20_000): string {
  const lines: string[] = [];
  let bucket = -1;
  let buf = "";
  for (const ev of json.events ?? []) {
    const text = (ev.segs ?? []).map((x) => x.utf8 ?? "").join("").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const b = Math.floor((ev.tStartMs ?? 0) / bucketMs);
    if (b !== bucket) {
      if (buf) lines.push(buf.trim());
      bucket = b;
      buf = `[${clock(b * bucketMs)}] `;
    }
    buf += `${text} `;
  }
  if (buf) lines.push(buf.trim());
  return lines.join("\n");
}

function fetchCaptions(meta: VideoMeta): { text: string; source: SermonNote["transcript"]["source"] } {
  mkdirSync(TRANSCRIPT_DIR, { recursive: true });
  ytdlp([
    "--skip-download",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs",
    "ko.*,ko",
    "--sub-format",
    "json3",
    "-o",
    join(TRANSCRIPT_DIR, "%(id)s.%(ext)s"),
    meta.url,
  ]);
  const files = readdirSync(TRANSCRIPT_DIR).filter((f) => f.startsWith(`${meta.id}.`) && f.endsWith(".json3"));
  if (files.length === 0) throw new Error("한국어 자막이 없습니다. --transcript로 전사문을 직접 지정하세요.");
  // 업로더 자막(ko.json3)을 자동 자막(ko-orig 등)보다 우선
  const pick = files.find((f) => f === `${meta.id}.ko.json3`) ?? files[0];
  const json = JSON.parse(readFileSync(join(TRANSCRIPT_DIR, pick), "utf8")) as Json3;
  return { text: captionsToText(json), source: pick.endsWith(".ko.json3") ? "youtube-captions" : "youtube-auto-captions" };
}

/* ── Claude 분석 ───────────────────────────────────────────────── */
const ts = z.string().describe("전사문에 실제로 있는 타임스탬프, 예: 12:40 또는 1:02:15");

const NoteOutput = z.object({
  summary: z.array(z.string()).length(3).describe("설교 전체를 세 문장으로. 각 문장 80자 이내."),
  outline: z
    .array(z.object({ at: ts, heading: z.string().describe("12자 안팎의 소제목"), point: z.string().describe("그 대목의 핵심 주장 한두 문장") }))
    .min(4)
    .max(8),
  insights: z
    .array(z.object({ title: z.string(), body: z.string().describe("설교와 본문을 잇는 편집자 통찰, 2~4문장"), at: ts.optional() }))
    .min(3)
    .max(4),
  crossReferences: z.array(z.object({ ref: z.string().describe("설교에서 실제로 언급된 성경 장절"), note: z.string() })).max(6),
  applications: z.array(z.string()).min(2).max(3),
  prayer: z.string().describe("설교 내용에 근거한 3~4문장의 기도문"),
  caveats: z.array(z.string()).describe("자동 자막 오류로 불확실한 부분, 확인이 필요한 고유명사 등. 없으면 빈 배열."),
});

const SYSTEM = `당신은 한국 개신교 설교를 정리하는 신중한 성경 연구 편집자입니다.
입력은 유튜브 자막에서 얻은 설교 전사문이며, 각 줄 앞에 [분:초] 타임스탬프가 있습니다. 자동 자막이라 오탈자와 잘못 인식된 단어가 섞여 있을 수 있습니다.

원칙:
- 설교자가 실제로 말한 내용만 요약하십시오. 전사문에 없는 주장, 예화, 인용을 만들지 마십시오.
- 직접 인용은 하지 말고 자연스러운 한국어로 바꿔 쓰십시오(저작권 보호). 고유한 표현이 꼭 필요하면 12자 이내로만 쓰십시오.
- outline과 insights의 at에는 전사문에 실제로 존재하는 타임스탬프만 쓰십시오.
- insights는 설교 요약이 아니라, 설교의 논지가 성경 본문의 맥락·신학과 어떻게 연결되는지를 보여 주는 편집자의 통찰입니다. 설교자의 견해와 편집자의 해석을 섞지 마십시오.
- 설교 중 언급된 일반 성도나 사적 개인의 실명, 개인 사정은 옮기지 마십시오.
- 자막 오류로 확신할 수 없는 고유명사나 성경 장절은 caveats에 적으십시오.
- 문체: 담백하고 정확한 한국어, 경어체 평서문. 과장된 수식어를 쓰지 마십시오.`;

async function analyze(s: Sermon, transcript: string) {
  const client = new Anthropic();
  const speaker = speakerById(s.speakerId)?.name ?? "";
  const ref = `${s.passage.book} ${s.passage.chapter}:${s.passage.from}${s.passage.to !== s.passage.from ? `–${s.passage.to}` : ""}`;
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: { effort: "high", format: betaZodOutputFormat(NoteOutput) },
    messages: [
      {
        role: "user",
        content: `설교 정보\n- 제목: ${s.title}\n- 설교자: ${speaker}\n- 본문: ${ref}\n- 일자: ${s.date} (사랑의교회 제24차 가을 글로벌 특별새벽부흥회)\n\n<transcript>\n${transcript}\n</transcript>`,
      },
    ],
  });
  if (response.stop_reason === "refusal") throw new Error(`모델이 요청을 거절했습니다: ${response.stop_details?.category ?? "unknown"}`);
  if (response.stop_reason === "max_tokens") throw new Error("출력이 max_tokens에서 잘렸습니다.");
  if (!response.parsed_output) throw new Error("구조화 출력 파싱에 실패했습니다.");
  return { out: response.parsed_output, model: response.model };
}

/* ── 검증 · 기록 ───────────────────────────────────────────────── */
const toSec = (t: string) => t.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);

function writeIndex() {
  const ids = readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  const imports = ids.map((id, i) => `import n${i} from "./${id}.json";`).join("\n");
  const entries = ids.map((id, i) => `  "${id}": n${i} as SermonNote,`).join("\n");
  writeFileSync(
    join(NOTES_DIR, "index.ts"),
    `// 이 파일은 scripts/transcribe.ts가 생성한다. 직접 수정하지 말 것.\nimport type { SermonNote } from "@/lib/schema";\n${imports}\n\nexport const sermonNotes: Record<string, SermonNote> = {\n${entries}\n};\n`,
  );
}

async function processSermon(s: Sermon) {
  const existing = sermonNotes[s.id];
  const url = args.url ?? existing?.video.url ?? (args.transcript ? undefined : discover(s));

  let meta: VideoMeta | undefined;
  if (url) {
    meta = readMeta(url);
    const ok = CHANNEL_HINTS.some((h) => meta!.channel.includes(h));
    const inEvent = meta.uploadDate ? meta.uploadDate.replace(/-/g, "") >= EVENT_FROM && meta.uploadDate.replace(/-/g, "") <= EVENT_TO : false;
    if ((!ok || !inEvent) && args.force !== "true")
      throw new Error(`영상 검증 실패 — 채널 "${meta.channel}", 업로드 ${meta.uploadDate ?? "?"}. 확실하면 --force`);
  }
  if (!meta) throw new Error("--transcript를 쓸 때도 원본 영상 주소(--url)가 필요합니다.");

  const { text, source } = args.transcript
    ? { text: readFileSync(args.transcript, "utf8"), source: "manual" as const }
    : fetchCaptions(meta);
  mkdirSync(TRANSCRIPT_DIR, { recursive: true });
  writeFileSync(join(TRANSCRIPT_DIR, `${s.id}.txt`), text);
  console.log(`  전사 ${text.length.toLocaleString()}자 (${source})`);

  const { out, model } = await analyze(s, text);

  // 타임스탬프는 전사문 안에, 영상 길이 안에 있어야 한다
  const present = new Set(Array.from(text.matchAll(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g), (m) => m[1]));
  const valid = (t: string) =>
    (!present.size || present.has(t)) && Number(t.split(":").at(-1)) < 60 && (!meta?.duration || toSec(t) <= meta.duration);
  const dropped = out.outline.filter((o) => !valid(o.at));
  if (dropped.length && out.outline.length - dropped.length >= 3) out.outline = out.outline.filter((o) => valid(o.at));
  else if (dropped.length) out.caveats.push(`검증되지 않은 타임스탬프: ${dropped.map((o) => o.at).join(", ")}`);
  for (const i of out.insights) if (i.at && !valid(i.at)) delete i.at;

  const note: SermonNote = SermonNote.parse({
    sermonId: s.id,
    review: "draft",
    video: { url: meta.url, id: meta.id, title: meta.title, channel: meta.channel, uploadDate: meta.uploadDate },
    transcript: { source, chars: text.length, transcribedAt: new Date().toISOString() },
    model,
    ...out,
  });
  mkdirSync(NOTES_DIR, { recursive: true });
  writeFileSync(join(NOTES_DIR, `${s.id}.json`), JSON.stringify(note, null, 2) + "\n");
  console.log(`  노트 작성: ${NOTES_DIR}/${s.id}.json`);
}

async function main() {
  const ids = args.id?.split(",");
  // 선포일이 지난 설교만 대상으로 한다(예정 공지였던 설교도 당일 이후엔 영상이 올라온다)
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  const targets = sermons.filter((s) =>
    ids ? ids.includes(s.id) : s.status !== "pending" && s.date <= today && (!sermonNotes[s.id] || args.force === "true"),
  );
  if (targets.length === 0) return console.log("처리할 설교가 없습니다.");
  let failed = 0;
  for (const s of targets) {
    console.log(`▶ ${s.id} — ${s.title}`);
    try {
      await processSermon(s);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${e instanceof Error ? e.message : e}`);
    }
  }
  if (existsSync(NOTES_DIR)) writeIndex();
  if (failed) process.exitCode = 1;
}

main();
