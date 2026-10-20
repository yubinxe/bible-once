/**
 * Public Source Ingestion Pipeline
 *   Discovery → Fetch → Parse → Normalize → Validate → Publish(사람 검토)
 *
 * 원칙
 * - 공개 페이지만, robots.txt 준수, 요청 간 최소 2초 간격, 동시 요청 없음.
 * - ETag / Last-Modified 조건부 요청 + 본문 SHA-256으로 변경을 감지한다.
 * - 수집 결과는 자동 게시하지 않는다. 변경 보고서(data/sync-report.md)를 만들고,
 *   사람이 확인한 뒤 content/*.ts를 갱신한다.
 * - 개인 기도요청·간증·게시판 글은 수집 대상이 아니다(레지스트리에 등록된 URL만 요청).
 *
 * 사용: npm run sync:sources            (전체)
 *       npm run sync:sources -- --only=revival-home,newsletter-1020
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { sermons } from "../content/sermons";
import { sources } from "../content/sources";
import type { Source } from "../lib/schema";

const UA = "TheDawnScriptureCompanion/0.1 (+independent study project; low-frequency public page check)";
const STATE_PATH = "data/source-state.json";
const REPORT_PATH = "data/sync-report.md";
const MIN_INTERVAL_MS = 2000;
const MAX_RETRY = 3;

type State = Record<
  string,
  { etag?: string; lastModified?: string; sha256?: string; status?: number; fetchedAt?: string; error?: string }
>;

type Outcome = {
  source: Source;
  result: "unchanged" | "changed" | "new" | "blocked" | "error" | "skipped";
  detail: string;
  findings: string[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let lastRequest = 0;

async function politeFetch(url: string, init: RequestInit = {}): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const wait = lastRequest + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "user-agent": UA, accept: "text/html,application/pdf;q=0.9,*/*;q=0.5", ...(init.headers ?? {}) },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRY) {
        await sleep(2000 * 2 ** attempt);
        continue;
      }
      return res;
    } catch (e) {
      if (attempt >= MAX_RETRY) throw e;
      await sleep(2000 * 2 ** attempt);
    }
  }
}

/* ── Discovery: robots.txt ─────────────────────────────────────── */
const robotsCache = new Map<string, string[]>();
async function allowedByRobots(url: string): Promise<boolean> {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    let disallow: string[] = [];
    try {
      const res = await politeFetch(`${u.origin}/robots.txt`);
      if (res.ok) {
        let applies = false;
        for (const raw of (await res.text()).split(/\r?\n/)) {
          const line = raw.replace(/#.*/, "").trim();
          const [k, ...rest] = line.split(":");
          const v = rest.join(":").trim();
          if (/^user-agent$/i.test(k)) applies = v === "*" || UA.toLowerCase().includes(v.toLowerCase());
          else if (applies && /^disallow$/i.test(k) && v) disallow.push(v);
        }
      }
    } catch {
      disallow = [];
    }
    robotsCache.set(u.origin, disallow);
  }
  const path = u.pathname + u.search;
  return !robotsCache.get(u.origin)!.some((rule) => path.startsWith(rule));
}

/* ── Parse: 문자셋 판별 후 텍스트화 ───────────────────────────── */
function decode(buf: ArrayBuffer, contentType: string | null): string {
  const bytes = new Uint8Array(buf);
  let charset = /charset=([\w-]+)/i.exec(contentType ?? "")?.[1];
  if (!charset) {
    const head = new TextDecoder("latin1").decode(bytes.slice(0, 2048));
    charset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1];
  }
  try {
    return new TextDecoder(charset ?? "utf-8").decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Normalize + Validate: 등록된 설교와 대조 ──────────────────── */
function crossCheck(text: string): string[] {
  const findings: string[] = [];
  if (/20\d\d/.test(text) && !text.includes("2026")) findings.push("2026 표기가 없음 — 과거 회차 페이지일 수 있음");
  if (/봄/.test(text) && !/가을/.test(text)) findings.push("‘봄’만 등장 — 시즌 혼입 의심");
  for (const s of sermons) {
    const present = text.includes(s.title);
    if (s.status === "scheduled" && present) findings.push(`예정 설교 「${s.title}」가 게시됨 → status 승격 검토`);
    if (s.status === "verified" && !present && /설교|sermon/i.test(text)) {
      // 페이지 성격에 따라 제목이 없을 수 있으므로 정보성 메모만 남긴다
    }
  }
  const verseRe = /(창세기|출애굽기|열왕기하|시편|사도행전|히브리서|로마서|요한복음|마태복음|누가복음|이사야|예레미야)\s?\d{1,3}\s?[:장]\s?\d{1,3}/g;
  const refs = new Set(text.match(verseRe) ?? []);
  if (refs.size) findings.push(`발견된 본문 표기: ${[...refs].slice(0, 12).join(", ")}`);
  return findings;
}

async function processSource(src: Source, state: State): Promise<Outcome> {
  if (src.kind === "bible") return { source: src, result: "skipped", detail: "성경 본문 열람처 — 수집 대상 아님", findings: [] };
  if (!(await allowedByRobots(src.url))) return { source: src, result: "blocked", detail: "robots.txt가 허용하지 않음", findings: [] };

  const prev = state[src.id] ?? {};
  const headers: Record<string, string> = {};
  if (prev.etag) headers["if-none-match"] = prev.etag;
  if (prev.lastModified) headers["if-modified-since"] = prev.lastModified;

  try {
    const res = await politeFetch(src.url, { headers });
    const now = new Date().toISOString();
    if (res.status === 304) {
      state[src.id] = { ...prev, status: 304, fetchedAt: now, error: undefined };
      return { source: src, result: "unchanged", detail: "304 Not Modified", findings: [] };
    }
    if (!res.ok) {
      state[src.id] = { ...prev, status: res.status, fetchedAt: now, error: `HTTP ${res.status}` };
      return { source: src, result: "error", detail: `HTTP ${res.status}`, findings: [] };
    }
    const buf = await res.arrayBuffer();
    const sha256 = createHash("sha256").update(new Uint8Array(buf)).digest("hex");
    const ct = res.headers.get("content-type");
    const isPdf = (ct ?? "").includes("pdf") || src.url.toLowerCase().endsWith(".pdf");
    const findings = isPdf ? ["PDF — 텍스트 추출은 수동 검토(저작권상 전문 저장 안 함)"] : crossCheck(htmlToText(decode(buf, ct)));
    const result: Outcome["result"] = !prev.sha256 ? "new" : prev.sha256 === sha256 ? "unchanged" : "changed";
    state[src.id] = {
      etag: res.headers.get("etag") ?? undefined,
      lastModified: res.headers.get("last-modified") ?? undefined,
      sha256,
      status: res.status,
      fetchedAt: now,
    };
    return { source: src, result, detail: `${res.status} · ${(buf.byteLength / 1024).toFixed(0)}KB · ${sha256.slice(0, 12)}`, findings };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    state[src.id] = { ...prev, fetchedAt: new Date().toISOString(), error: msg };
    return { source: src, result: "error", detail: msg, findings: [] };
  }
}

async function main() {
  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
  const state: State = existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, "utf8")) : {};
  const targets = sources.filter((s) => !only || only.includes(s.id));

  const outcomes: Outcome[] = [];
  for (const src of targets) {
    const o = await processSource(src, state);
    outcomes.push(o);
    console.log(`${o.result.padEnd(9)} ${src.id} — ${o.detail}`);
  }

  mkdirSync("data", { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");

  const lines = [
    `# Source Sync Report`,
    ``,
    `- 실행: ${new Date().toISOString()}`,
    `- 대상: ${targets.length}개 · 변경 ${outcomes.filter((o) => o.result === "changed").length} · 신규 ${outcomes.filter((o) => o.result === "new").length} · 오류 ${outcomes.filter((o) => o.result === "error").length}`,
    ``,
    `| 결과 | 출처 | 상세 |`,
    `| --- | --- | --- |`,
    ...outcomes.map((o) => `| ${o.result} | [${o.source.title}](${o.source.url}) | ${o.detail.replace(/\|/g, "/")} |`),
    ``,
    `## 검토 필요 항목`,
    ...outcomes.flatMap((o) => (o.findings.length ? [``, `### ${o.source.title}`, ...o.findings.map((f) => `- ${f}`)] : [])),
    ``,
    `> 이 보고서는 자동 게시하지 않는다. 사람이 원문을 확인한 뒤 content/*.ts와 checkedAt·method를 갱신한다.`,
  ];
  writeFileSync(REPORT_PATH, lines.join("\n") + "\n");
  console.log(`\n보고서: ${REPORT_PATH}`);
  if (outcomes.every((o) => o.result === "error" || o.result === "blocked")) process.exitCode = 2;
}

main();
