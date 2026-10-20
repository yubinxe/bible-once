import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/reading-progress";
import { STUDY_TOC, StudyView } from "@/components/study-view";
import { Awaiting, TextLink, VStatus } from "@/components/ui";
import { sermonById, sermons } from "@/content/sermons";
import { bibleUrl, dayByDateSafe, formatDate, passageLabel, speakerById } from "@/lib/content";

export function generateStaticParams() {
  return sermons.map((s) => ({ id: s.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = sermonById((await params).id);
  if (!s) return {};
  return { title: `${s.title} — ${passageLabel(s.passage)}`, description: `${formatDate(s.date)} 특새 설교 본문 연구` };
}

export default async function SermonPage({ params }: Props) {
  const sermon = sermonById((await params).id);
  if (!sermon) notFound();
  const sp = speakerById(sermon.speakerId);
  const day = dayByDateSafe(sermon.date);

  return (
    <article>
      <ReadingProgress />
      <header className="wrap pt-16 pb-16 md:pt-24 md:pb-24">
        <nav aria-label="위치" className="caption">
          <Link className="link-quiet" href="/revival">특새 여정</Link>
          <span className="mx-2">/</span>
          <Link className="link-quiet" href={`/revival/${sermon.date}`}>
            DAY {String(day.index).padStart(2, "0")} · {day.theme}
          </Link>
        </nav>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="numeral text-[2.5rem] leading-none md:text-[3.5rem]">{sermon.date.slice(5).replace("-", ".")}</p>
            <p className="caption mt-2">{formatDate(sermon.date, { withWeekday: true })} · 설교 {sermon.order}</p>
          </div>
          <div className="md:col-span-9">
            <VStatus status={sermon.status} />
            <h1 className="display-ko mt-5 text-[length:var(--text-h1)] leading-[1.3]">{sermon.title}</h1>
            <p className="mt-6 font-serif text-[1.25rem] text-burgundy">{passageLabel(sermon.passage)}</p>
            <p className="mt-2 text-[1.0625rem]">
              {sp?.name}
              {sp?.nameEn && <span className="font-display text-[1.125rem] italic text-stone-deep"> {sp.nameEn}</span>}
              {sp?.affiliation && <span className="text-stone-deep"> · {sp.affiliation}</span>}
            </p>
            {sermon.status === "scheduled" && (
              <p className="mt-6 max-w-[40rem] border-l-2 border-gold pl-4 text-[0.9375rem] leading-7 text-stone-deep">
                뉴스레터에 예고된 설교입니다. 실제 선포된 제목·본문은 공식 게시 후 다시 대조합니다.
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2">
              {sermon.officialUrl && <TextLink href={sermon.officialUrl}>공식 설교 영상</TextLink>}
              <TextLink href={bibleUrl(sermon.passage)}>성경 전문</TextLink>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap grid gap-12 md:grid-cols-12">
        <aside className="no-print hidden md:col-span-3 md:block">
          <nav aria-label="이 페이지의 순서" className="sticky top-28">
            <p className="eyebrow text-[0.6875rem] text-stone-deep">Contents</p>
            <ol className="mt-5 space-y-3 text-[0.9375rem]">
              {STUDY_TOC.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="group flex gap-3 text-ink/70 hover:text-ink">
                    <span className="numeral text-stone-deep">{String(i + 1).padStart(2, "0")}</span>
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="md:col-span-9 lg:col-span-8">
          <section aria-labelledby="summary-h" className="pb-16">
            <p id="summary-h" className="eyebrow text-[0.6875rem] text-stone-deep">Editor&apos;s Summary · 설교 요약</p>
            {sermon.editorSummary ? (
              <ul className="mt-4 space-y-3">
                {sermon.editorSummary.lines.map((l) => (
                  <li key={l} className="font-serif text-[1.0625rem] leading-8">{l}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Awaiting>설교 요약은 공식 설교 영상·원문을 확인한 뒤 게시합니다.</Awaiting>
              </div>
            )}
          </section>

          {sermon.study ? (
            <StudyView sermon={sermon} study={sermon.study} />
          ) : (
            <Awaiting>본문 연구 준비 중</Awaiting>
          )}
        </div>
      </div>
    </article>
  );
}
