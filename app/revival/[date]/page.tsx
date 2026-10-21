import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlowMap } from "@/components/flow-map";
import { Awaiting, RStatus, SourceNote, TextLink, VStatus } from "@/components/ui";
import { sermonById } from "@/content/sermons";
import { sermonNotes } from "@/content/sermon-notes";
import { NoteBadge } from "@/components/sermon-note";
import {
  bibleUrl,
  days,
  dayState,
  formatDate,
  passageLabel,
  previousDay,
  sermonsByDate,
  speakerById,
  verificationLabel,
} from "@/lib/content";

export function generateStaticParams() {
  return days.map((d) => ({ date: d.date }));
}

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const d = days.find((x) => x.date === date);
  return d ? { title: `DAY ${String(d.index).padStart(2, "0")} · ${d.theme}` } : {};
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function Part({ n, title, children, id }: { n: number; title: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="grid gap-8 border-t border-rule py-16 md:grid-cols-12 md:py-20">
      <div data-reveal className="md:col-span-3">
        <p className="flex items-baseline gap-3">
          <span className="numeral text-stone-deep">{String(n).padStart(2, "0")}</span>
          <span id={id} className="display-ko text-[1.25rem]">
            {title}
          </span>
        </p>
      </div>
      <div data-reveal className="md:col-span-9">{children}</div>
    </section>
  );
}

export default async function DayPage({ params }: Props) {
  const { date } = await params;
  const day = days.find((d) => d.date === date);
  if (!day) notFound();
  const list = sermonsByDate(day.date);
  const studies = list.filter((s) => s.study);
  const prev = previousDay(day.date);
  const prevFirst = prev ? sermonsByDate(prev.date).find((s) => s.study) : undefined;
  const st = dayState(day);
  const i = days.indexOf(day);
  const next = days[i + 1];

  return (
    <div>
      {/* 1. Today's Theme */}
      <header className="relative overflow-hidden bg-navy text-paper">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-28 select-none md:-bottom-16 font-display text-[clamp(14rem,30vw,28rem)] font-medium leading-none text-paper/[0.05]"
        >
          {ROMAN[day.index - 1]}
        </span>
        <div className="wrap relative pb-20 pt-20 md:pb-28 md:pt-28">
          <nav aria-label="위치" className="text-sm text-sand/70">
            <Link className="link-quiet" href="/revival">특새 여정</Link>
            <span className="mx-2">/</span>
            DAY {String(day.index).padStart(2, "0")}
          </nav>
          <div className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="numeral text-[3.5rem] leading-none text-gold md:text-[4.5rem]">{String(day.index).padStart(2, "0")}</p>
              <p className="mt-3 text-sm text-sand/80">
                {formatDate(day.date, { withWeekday: true })} <span className="whitespace-nowrap">· 오전 {day.startsAt.replace(/^0/, "")}</span>
              </p>
            </div>
            <div className="md:col-span-9">
              <p className="text-gold"><span className="eyebrow">{day.motifEn}</span><span className="ml-3 font-serif text-sm">{day.motif}</span></p>
              <h1 className="display-ko mt-5 text-[length:var(--text-hero)] leading-[1.15]">{day.theme}</h1>
              <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sand/80">
                <span>주제 · {verificationLabel[day.themeStatus]}</span>
                <span>설교 · {st.label}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        {/* 2. Sermon Overview */}
        <Part n={1} id="p-overview" title="오늘의 설교">
          {list.length === 0 ? (
            <Awaiting>설교 정보는 공식 게시 후 열립니다. 오늘의 주제 ‘{day.theme}’로 먼저 기도해 주십시오.</Awaiting>
          ) : (
            <ol className="grid border-t border-rule md:grid-cols-2">
              {list.map((s) => {
                const sp = speakerById(s.speakerId);
                return (
                  <li key={s.id} className="flex flex-col border-b border-rule py-8 md:px-8 md:first:pl-0 md:odd:border-r">
                    <VStatus status={s.status} />
                    <h2 className="display-ko mt-4 text-[length:var(--text-h3)]">{s.title}</h2>
                    <p className="mt-3 text-[0.9375rem]">
                      {sp?.name}
                      {sp?.affiliation && <span className="text-stone-deep"> · {sp.affiliation}</span>}
                    </p>
                    <p className="font-serif text-burgundy">{passageLabel(s.passage)}</p>
                    {sermonNotes[s.id] && (
                      <div className="mt-6">
                        <ul className="space-y-2 text-[0.9375rem] leading-7">
                          {sermonNotes[s.id].summary.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <NoteBadge note={sermonNotes[s.id]} />
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                      {sermonNotes[s.id] && <TextLink href={`/sermons/${s.id}#notes`}>설교 노트</TextLink>}
                      {s.study && <TextLink href={`/sermons/${s.id}`}>본문 깊이 읽기</TextLink>}
                      {s.officialUrl && <TextLink href={s.officialUrl}>공식 설교</TextLink>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="caption mt-6">두 설교는 서로 다른 본문과 강조를 가진 독립된 설교입니다. 하나로 합쳐 요약하지 않습니다.</p>
        </Part>

        {/* 3. Scripture Reading */}
        <Part n={2} id="p-scripture" title="본문 읽기">
          {studies.length === 0 ? (
            <Awaiting />
          ) : (
            <div className="space-y-14">
              {studies.map((s) => (
                <figure key={s.id}>
                  {s.study!.keyVerse ? (
                    <>
                      <blockquote className="scripture max-w-[40rem]">{s.study!.keyVerse.text}</blockquote>
                      <figcaption className="caption mt-4">{s.study!.keyVerse.ref} · 개역개정 · 핵심 구절</figcaption>
                    </>
                  ) : (
                    <figcaption className="font-serif text-[1.125rem]">{passageLabel(s.passage)}</figcaption>
                  )}
                  <div className="mt-4">
                    <TextLink href={bibleUrl(s.passage)}>{passageLabel(s.passage)} 전문 읽기</TextLink>
                  </div>
                </figure>
              ))}
            </div>
          )}
        </Part>

        {/* 4. Understand the Context */}
        <Part n={3} id="p-context" title="맥락 이해하기">
          {studies.length === 0 ? (
            <Awaiting />
          ) : (
            <div className="grid gap-12 md:grid-cols-2">
              {studies.map((s) => (
                <div key={s.id}>
                  <p className="font-serif text-burgundy">{passageLabel(s.passage)}</p>
                  <dl className="mt-4 space-y-5">
                    {s.study!.context.slice(0, 2).map((c) => (
                      <div key={c.label}>
                        <dt className="text-sm font-medium">{c.label}</dt>
                        <dd className="mt-1 text-[0.9375rem] leading-7 text-ink/85">{c.body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </Part>

        {/* 5. Visual Explanation */}
        <Part n={4} id="p-visual" title="흐름으로 보기">
          {studies.length === 0 ? (
            <Awaiting />
          ) : (
            <div className="space-y-20">
              {studies.map((s) => (
                <div key={s.id}>
                  <FlowMap visual={s.study!.visual} />
                </div>
              ))}
            </div>
          )}
        </Part>

        {/* 6. Theological Reflection */}
        <Part n={5} id="p-theology" title="신학적 묵상">
          {day.insight ? (
            <div>
              <p className="font-display text-[3rem] italic leading-none text-gold" aria-hidden>
                {day.insight.conceptEn}
              </p>
              <p className="display-ko mt-3 text-[length:var(--text-h2)]">{day.insight.concept}</p>
              <p className="mt-5 max-w-[40rem] font-serif text-[1.125rem] leading-9">{day.insight.definition}</p>
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {day.insight.links.map((l) => {
                  const s = sermonById(l.sermonId);
                  return (
                    <div key={l.sermonId} className="border-t border-ink pt-5">
                      <p className="font-serif text-burgundy">{s && passageLabel(s.passage)}</p>
                      <p className="mt-3 text-[0.9375rem] leading-8">{l.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <RStatus status={day.insight.review} />
              </div>
            </div>
          ) : (
            <Awaiting>신학 해설은 설교 본문이 확인된 뒤 준비합니다.</Awaiting>
          )}
        </Part>

        {/* 7. Recall & Meditation */}
        <Part n={6} id="p-recall" title="기억과 묵상">
          {prevFirst?.study && prev && (
            <div className="mb-12 bg-paper px-6 py-7 md:px-8">
              <p className="eyebrow text-[0.6875rem] text-burgundy">Yesterday · 어제의 말씀 회상</p>
              <p className="display-ko mt-3 text-[1.125rem]">{prevFirst.study.recall[0].prompt}</p>
              <p className="caption mt-2">
                DAY {String(prev.index).padStart(2, "0")} · {passageLabel(prevFirst.passage)} — 떠올린 뒤{" "}
                <Link className="link-quiet" href={`/sermons/${prevFirst.id}#recall`}>
                  확인하기
                </Link>
              </p>
            </div>
          )}
          {studies.length === 0 ? (
            <Awaiting />
          ) : (
            <ul className="space-y-6">
              {studies.map((s) => (
                <li key={s.id} className="border-b border-rule pb-6">
                  <p className="caption">{passageLabel(s.passage)}</p>
                  <p className="display-ko mt-2 text-[1.125rem]">{s.study!.recall[0].prompt}</p>
                  <div className="mt-3">
                    <TextLink href={`/sermons/${s.id}#recall`}>기억 인출 전체 열기</TextLink>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Part>

        {/* 8. Prayer */}
        <Part n={7} id="p-prayer" title="기도">
          {day.prayerTopics.length > 0 ? (
            <ol className="mb-12 space-y-3">
              {day.prayerTopics.map((p, k) => (
                <li key={p} className="grid grid-cols-[2rem_1fr]">
                  <span className="numeral text-stone-deep">{k + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          ) : (
            <div className="mb-10">
              <p className="text-sm font-medium">공동 기도제목</p>
              <Awaiting />
            </div>
          )}
          {studies.map((s) => (
            <p key={s.id} className="scripture mb-8 max-w-[40rem] text-[1.1875rem]">
              {s.study!.prayer}
            </p>
          ))}
          <Link href={`/reflection?date=${day.date}`} className="btn btn-ink mt-4">
            나의 묵상 기록하기 <span aria-hidden className="arrow">→</span>
          </Link>
        </Part>

        {/* 9. Official Sources */}
        <Part n={8} id="p-sources" title="공식 자료">
          <ul className="space-y-2">
            {list.filter((s) => s.officialUrl).map((s) => (
              <li key={s.id}>
                <TextLink href={s.officialUrl!}>{s.title} — 공식 설교</TextLink>
              </li>
            ))}
          </ul>
          <SourceNote className="mt-4" ids={day.sourceIds} />
          {day.sourceIds.length === 0 && <Awaiting />}
          <p className="caption mt-3">찬양 · {day.hymns.length ? day.hymns.map((h) => h.title).join(", ") : "공식 업데이트 대기"}</p>
        </Part>

        <nav aria-label="다른 날" className="grid grid-cols-2 border-t border-ink pt-8">
          <div>
            {prev && (
              <Link href={`/revival/${prev.date}`} className="group">
                <span className="caption">← DAY {String(prev.index).padStart(2, "0")}</span>
                <span className="display-ko mt-1 block text-lg group-hover:text-burgundy">{prev.theme}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/revival/${next.date}`} className="group">
                <span className="caption">DAY {String(next.index).padStart(2, "0")} →</span>
                <span className="display-ko mt-1 block text-lg group-hover:text-burgundy">{next.theme}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
