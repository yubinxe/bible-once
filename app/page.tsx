import Link from "next/link";
import { ChapelGate } from "@/components/chapel-gate";
import { DawnHorizon } from "@/components/dawn-horizon";
import { HeroAscend } from "@/components/hero-ascend";
import { LightMotes } from "@/components/light-motes";
import { DayTimeline } from "@/components/day-timeline";
import { Awaiting, RStatus, SectionHead, SourceNote, TextLink, VStatus } from "@/components/ui";
import {
  bibleUrl,
  event,
  formatDate,
  passageLabel,
  resolveFocusDay,
  sermonsByDate,
  sources,
  speakerById,
} from "@/lib/content";
import { sermonById } from "@/content/sermons";
import { sermonNotes } from "@/content/sermon-notes";
import { NoteBadge } from "@/components/sermon-note";

export const revalidate = 1800;

export default function Home() {
  const { day, phase } = resolveFocusDay();
  const todays = sermonsByDate(day.date);
  const insight = day.insight;
  const archive = sources.filter((s) => s.tier === "A");

  return (
    <>
      <ChapelGate />

      {/* ── A. Sacred Hero ───────────────────────────────────────── */}
      <HeroAscend labelledBy="hero-title" className="hero relative isolate overflow-hidden bg-night text-paper">
        <DawnHorizon />
        <div aria-hidden className="hero-sunrise" />
        <LightMotes />
        <div className="hero-copy wrap relative flex min-h-[100svh] flex-col justify-end pb-[calc(22vh+1rem)] pt-32">
          <p className="eyebrow rise text-gold">The 24th Global Special Dawn Revival · Autumn 2026</p>
          <h1 id="hero-title" className="display-ko rise rise-2 mt-8 text-[length:var(--text-hero)] leading-[1.22] text-paper">
            새벽을 깨운 말씀,
            <br />
            오늘의 삶을 비춥니다.
          </h1>
          <p className="rise rise-3 mt-8 max-w-[34rem] text-[1.0625rem] leading-8 text-sand/85">
            여섯 날의 말씀과 찬양, 기도의 여정을 따라 오늘 받은 은혜를 깊이 이해하고 오래 간직합니다.
          </p>
          <div className="rise rise-4 mt-10 flex flex-wrap gap-3">
            <Link href={`/revival/${day.date}`} className="btn btn-primary">
              오늘의 말씀 묵상하기 <span aria-hidden className="arrow">→</span>
            </Link>
            <Link href="/revival" className="btn btn-ghost">
              여섯 날의 특새 살펴보기
            </Link>
          </div>

          <div className="mt-16 grid gap-6 border-t border-sand/20 pt-6 text-sm text-sand/80 md:mt-24 md:grid-cols-12">
            <p className="md:col-span-4">
              <span className="numeral text-paper">{phase === "during" ? `DAY ${String(day.index).padStart(2, "0")}` : phase === "before" ? "곧 시작합니다" : "여정을 마쳤습니다"}</span>
              <span className="mx-3 text-sand/40">/</span>
              {formatDate(day.date, { withWeekday: true })} · {day.theme}
            </p>
            <p className="md:col-span-5">
              {todays.length > 0
                ? todays.map((s) => passageLabel(s.passage)).join("  ·  ")
                : "본문 공식 업데이트 대기"}
            </p>
            <p className="md:col-span-3 md:text-right">
              {event.start.slice(5).replace("-", ".")} – {event.end.slice(5).replace("-", ".")} · 평일 04:30 · 토 05:30
            </p>
          </div>
        </div>
      </HeroAscend>

      {/* ── B. Six Days of Revival ───────────────────────────────── */}
      <section aria-labelledby="journey" className="wrap pt-28 md:pt-36">
        <SectionHead
          index="I"
          eyebrow="Six Days"
          id="journey"
          title="여섯 날, 하나의 여정"
          lede="매일의 주제는 앞의 날 위에 쌓입니다. 오늘을 중심으로, 지나온 날과 다가올 날을 한 흐름으로 읽으십시오."
        />
        <div className="mt-14 md:pl-[25%]">
          <DayTimeline focusDate={day.date} />
          <p className="caption mt-5">
            일별 주제와 2–3일차 설교는 공식 뉴스레터 기준이며, 공식 웹 게시본과 재대조 후 상태가 갱신됩니다.
          </p>
        </div>
      </section>

      {/* ── C. Today's Scripture ─────────────────────────────────── */}
      <section aria-labelledby="today" className="mt-28 bg-paper py-24 md:mt-36 md:py-32">
        <div className="wrap">
          <SectionHead
            index="II"
            eyebrow="Today's Scripture"
            id="today"
            title={
              <>
                {formatDate(day.date, { withWeekday: true })}
                <span className="text-stone-deep"> — </span>
                {day.theme}
              </>
            }
          />
          {todays.length === 0 ? (
            <div className="mt-12 md:pl-[25%]">
              <Awaiting>설교 정보는 공식 게시 후 열립니다. 그때까지 오늘의 주제로 기도해 주십시오.</Awaiting>
            </div>
          ) : (
            <div className="mt-14 grid border-t border-rule md:ml-[25%] md:grid-cols-2">
              {todays.map((s) => {
                const sp = speakerById(s.speakerId);
                return (
                  <article key={s.id} data-reveal className="flex flex-col border-b border-rule py-8 md:px-10 md:first:pl-0 md:odd:border-r">
                    <div className="flex items-center justify-between gap-4">
                      <p className="numeral text-stone-deep">Sermon {String(s.order).padStart(2, "0")}</p>
                      <VStatus status={s.status} />
                    </div>
                    <h3 className="display-ko mt-6 text-[length:var(--text-h3)]">{s.title}</h3>
                    <p className="mt-3 text-[0.9375rem]">
                      {sp?.name}
                      {sp?.affiliation && <span className="text-stone-deep"> · {sp.affiliation}</span>}
                    </p>
                    <p className="mt-1 font-serif text-[0.9375rem] text-burgundy">{passageLabel(s.passage)}</p>

                    <div className="mt-8 border-t border-rule pt-6">
                      <p className="eyebrow text-[0.6875rem] text-stone-deep">Summary</p>
                      {sermonNotes[s.id] ? (
                        <>
                          <ul className="mt-3 space-y-2 text-[0.9375rem] leading-7">
                            {sermonNotes[s.id].summary.map((l) => (
                              <li key={l}>{l}</li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <NoteBadge note={sermonNotes[s.id]} />
                          </div>
                        </>
                      ) : s.editorSummary ? (
                        <ul className="mt-3 space-y-2 text-[0.9375rem] leading-7">
                          {s.editorSummary.lines.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-[0.9375rem] leading-7 text-stone-deep">
                          설교 요약은 공식 설교 영상을 전사·정리한 뒤 게시합니다. 지금은 본문 연구를 먼저 열어 두었습니다.
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8">
                      {sermonNotes[s.id] && <TextLink href={`/sermons/${s.id}#notes`}>설교 노트</TextLink>}
                      {s.study && <TextLink href={`/sermons/${s.id}`}>본문 깊이 읽기</TextLink>}
                      {s.officialUrl && <TextLink href={s.officialUrl}>공식 설교</TextLink>}
                      <TextLink href={bibleUrl(s.passage)}>성경 전문</TextLink>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── D. Theological Insight ───────────────────────────────── */}
      {insight && (
        <section aria-labelledby="insight" className="wrap py-28 md:py-36">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-burgundy">
                <span className="mr-3 numeral tracking-normal">III</span>Theological Insight
              </p>
            </div>
            <div className="md:col-span-9">
              <p data-reveal className="font-display text-[clamp(3rem,2rem+5vw,6.5rem)] font-medium italic leading-none text-gold" aria-hidden>
                {insight.conceptEn}
              </p>
              <h2 data-reveal id="insight" className="display-ko mt-4 text-[length:var(--text-h1)]">
                {insight.concept}
              </h2>
              <p data-reveal className="mt-6 max-w-[40rem] font-serif text-[1.1875rem] leading-9">{insight.definition}</p>

              <div className="mt-14 grid gap-10 border-t border-ink pt-10 md:grid-cols-2 md:gap-14">
                {insight.links.map((l) => {
                  const s = sermonById(l.sermonId);
                  return (
                    <div key={l.sermonId} data-reveal>
                      <p className="font-serif text-burgundy">{s ? passageLabel(s.passage) : ""}</p>
                      <p className="mt-3 text-[0.9375rem] leading-8 text-ink/85">{l.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <RStatus status={insight.review} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── E. Prayer & Reflection ───────────────────────────────── */}
      <section aria-labelledby="reflect" className="bg-navy py-24 text-paper md:py-32">
        <div className="wrap">
          <SectionHead
            tone="dark"
            index="IV"
            eyebrow="Prayer & Reflection"
            id="reflect"
            title="말씀 앞에 머무는 네 개의 질문"
            lede="기록은 이 기기에만 저장되며 어디에도 공개되지 않습니다."
          />
          <ol className="mt-14 grid border-t border-sand/15 md:ml-[25%] md:grid-cols-2">
            {["오늘 깨달은 말씀", "나에게 남은 질문", "오늘의 기도", "이번 주 실천"].map((q, i) => (
              <li key={q} data-reveal className="border-b border-sand/15 py-7 md:px-8 md:py-10 md:odd:border-r md:odd:pl-0">
                <span className="numeral text-gold">{String(i + 1).padStart(2, "0")}</span>
                <p className="display-ko mt-3 text-[1.375rem]">{q}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 md:ml-[25%]">
            <Link href={`/reflection?date=${day.date}`} className="btn btn-primary">
              오늘의 묵상 기록하기 <span aria-hidden className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── F. Official Archive ──────────────────────────────────── */}
      <section aria-labelledby="archive" className="wrap pt-28 md:pt-36">
        <SectionHead
          index="V"
          eyebrow="Official Archive"
          id="archive"
          title="원본은 언제나 공식 출처에"
          lede="공식 영상·뉴스레터·설교는 원본으로 연결합니다. 이 사이트의 해설은 원본과 분리해 표시합니다."
        />
        <ul className="mt-14 border-t border-ink md:ml-[25%]">
          {archive.slice(0, 6).map((s) => (
            <li key={s.id} data-reveal className="border-b border-rule">
              <a href={s.url} target="_blank" rel="noopener" className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-5">
                <span>
                  <span className="block text-[1.0625rem] group-hover:text-burgundy transition-colors duration-200">{s.title}</span>
                  <span className="caption">{s.publisher}{s.publishedOn ? ` · ${s.publishedOn}` : ""}</span>
                </span>
                <span aria-hidden className="text-stone">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 md:ml-[25%]">
          <TextLink href="/archive">전체 출처와 확인 상태 보기</TextLink>
          <SourceNote className="mt-6" ids={event.sourceIds} />
        </div>
      </section>
    </>
  );
}
