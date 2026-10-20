import Link from "next/link";
import { dayState, days, formatDot, passageLabel, sermonsByDate, speakerName } from "@/lib/content";

/**
 * 여섯 날의 Chapter Navigation.
 * 오늘은 강조하되, 다른 날을 흐리게 숨기지 않는다.
 */
export function DayTimeline({ focusDate, detailed = false }: { focusDate: string; detailed?: boolean }) {
  return (
    <ol className="border-t border-ink">
      {days.map((day) => {
        const isFocus = day.date === focusDate;
        const st = dayState(day);
        const list = sermonsByDate(day.date);
        return (
          <li key={day.date} className="border-b border-rule">
            <Link
              href={`/revival/${day.date}`}
              aria-current={isFocus ? "date" : undefined}
              className="group relative grid grid-cols-[4.25rem_1fr_auto] items-baseline gap-x-4 py-7 lg:grid-cols-[8rem_10rem_1fr_auto] lg:gap-x-8 md:py-9"
            >
              {isFocus && <span aria-hidden className="absolute -left-3 top-0 bottom-0 w-[2px] bg-burgundy lg:-left-6" />}
              <span className="numeral text-[2rem] leading-none md:text-[3rem]">
                <span className="sr-only">DAY </span>
                {String(day.index).padStart(2, "0")}
              </span>

              <span className="col-start-2 row-start-1">
                <span className="block numeral text-lg text-stone-deep">
                  {formatDot(day.date)} <span className="font-sans text-sm">{day.weekday}</span>
                </span>
                <span className="mt-1 block eyebrow text-[0.6875rem] text-stone-deep">{day.motifEn}</span>
              </span>

              <span className="col-span-2 col-start-2 row-start-2 mt-3 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:mt-0">
                <span className="display-ko block text-[1.5rem] md:text-[1.875rem] transition-colors duration-200 group-hover:text-burgundy">
                  {day.theme}
                </span>
                {detailed && list.length > 0 && (
                  <span className="mt-3 block space-y-1 text-[0.9375rem] text-ink/80">
                    {list.map((s) => (
                      <span key={s.id} className="block">
                        {speakerName(s)} · {s.title}
                        <span className="text-stone-deep"> — {passageLabel(s.passage)}</span>
                      </span>
                    ))}
                  </span>
                )}
                <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {isFocus && (
                    <span className="status" data-tone="accent">
                      오늘
                    </span>
                  )}
                  <span className="status" data-tone={st.state === "published" ? "solid" : undefined}>
                    {st.label}
                  </span>
                  {st.hasStudy ? (
                    <span className="status">본문 연구 열림</span>
                  ) : (
                    <span className="status">학습 콘텐츠 준비 중</span>
                  )}
                </span>
              </span>

              <span aria-hidden className="col-start-3 row-start-1 self-center text-xl text-stone transition-transform duration-200 group-hover:translate-x-1 lg:col-start-4">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
