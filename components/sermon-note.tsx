import type { SermonNote } from "@/lib/schema";

const toSec = (t: string) => t.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
const at = (note: SermonNote, t: string) => `https://www.youtube.com/watch?v=${note.video.id}&t=${toSec(t)}s`;

export function NoteBadge({ note }: { note: SermonNote }) {
  return (
    <span className="status" data-tone={note.review === "reviewed" ? "solid" : "accent"}>
      {note.review === "reviewed" ? "설교 노트 · 검수 완료" : "AI 전사 요약 · 검수 전"}
    </span>
  );
}

function Stamp({ note, t }: { note: SermonNote; t: string }) {
  return (
    <a
      href={at(note, t)}
      target="_blank"
      rel="noopener"
      className="numeral inline-flex min-h-8 items-center text-[0.9375rem] text-stone-deep link-quiet hover:text-burgundy"
      aria-label={`원본 영상 ${t}부터 보기`}
    >
      {t}
    </a>
  );
}

/**
 * 공식 설교 영상의 자막을 전사해 정리한 노트.
 * 모든 대목은 원본 영상의 해당 시점으로 연결해, 독자가 직접 대조할 수 있게 한다.
 */
export function SermonNoteView({ note }: { note: SermonNote }) {
  return (
    <section id="notes" aria-labelledby="notes-h" className="scroll-mt-28 pb-16">
      <div data-reveal className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow text-burgundy">Sermon Notes</p>
        <NoteBadge note={note} />
      </div>
      <h2 data-reveal id="notes-h" className="display-ko mt-4 text-[length:var(--text-h2)]">
        설교 노트
      </h2>

      <ol className="mt-10 space-y-5">
        {note.summary.map((l, i) => (
          <li key={l} data-reveal className="grid grid-cols-[2rem_1fr] gap-3">
            <span className="numeral pt-1 text-gold">{i + 1}</span>
            <p className="font-serif text-[1.1875rem] leading-[1.85]">{l}</p>
          </li>
        ))}
      </ol>

      <h3 data-reveal className="display-ko mt-16 text-[length:var(--text-h3)]">
        설교의 흐름
      </h3>
      <ol className="mt-6 border-t border-rule">
        {note.outline.map((o) => (
          <li key={o.at + o.heading} data-reveal className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-b border-rule py-5 md:grid-cols-[6rem_1fr]">
            <Stamp note={note} t={o.at} />
            <div>
              <p className="display-ko text-[1.0625rem]">{o.heading}</p>
              <p className="mt-1 text-[0.9375rem] leading-7 text-ink/85">{o.point}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3 data-reveal className="display-ko mt-16 text-[length:var(--text-h3)]">
        인사이트
      </h3>
      <p data-reveal className="caption mt-2">설교의 논지와 본문의 맥락을 잇는 편집 해설입니다. 설교자의 직접 발언이 아닙니다.</p>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {note.insights.map((n) => (
          <div key={n.title} data-reveal className="border-t border-ink pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="display-ko text-[1.125rem]">{n.title}</h4>
              {n.at && <Stamp note={note} t={n.at} />}
            </div>
            <p className="mt-3 text-[0.9875rem] leading-8 text-ink/90">{n.body}</p>
          </div>
        ))}
      </div>

      {note.crossReferences.length > 0 && (
        <div data-reveal className="mt-14">
          <h3 className="text-sm font-medium">설교에 언급된 다른 본문</h3>
          <dl className="mt-4 divide-y divide-rule border-y border-rule">
            {note.crossReferences.map((c) => (
              <div key={c.ref} className="grid gap-1 py-4 md:grid-cols-[10rem_1fr] md:gap-6">
                <dt className="font-serif text-burgundy">{c.ref}</dt>
                <dd className="text-[0.9375rem] leading-7">{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div data-reveal className="mt-14 grid gap-10 md:grid-cols-2">
        <div className="border-l-2 border-burgundy pl-5">
          <p className="eyebrow text-[0.6875rem] text-burgundy">Apply</p>
          <ul className="mt-3 space-y-2 text-[1rem] leading-7">
            {note.applications.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-[0.6875rem] text-stone-deep">Prayer</p>
          <p className="scripture mt-3 text-[1.125rem]">{note.prayer}</p>
        </div>
      </div>

      <footer data-reveal className="mt-14 border-t border-rule pt-5">
        {note.caveats.length > 0 && (
          <ul className="mb-4 space-y-1 text-sm text-burgundy">
            {note.caveats.map((c) => (
              <li key={c}>확인 필요 · {c}</li>
            ))}
          </ul>
        )}
        <p className="caption">
          원본{" "}
          <a className="link-quiet" href={note.video.url} target="_blank" rel="noopener">
            {note.video.title}
          </a>{" "}
          · {note.video.channel}
          {note.video.uploadDate && ` · ${note.video.uploadDate}`}
        </p>
        <p className="caption mt-1">
          {note.transcript.source === "manual" ? "수동 전사" : note.transcript.source === "youtube-captions" ? "업로드 자막" : "자동 자막"} 기반 ·
          전사 원문은 게시하지 않습니다 · 내용은 반드시 원본 영상과 대조해 주십시오.
        </p>
      </footer>
    </section>
  );
}
