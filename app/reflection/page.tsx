import type { Metadata } from "next";
import Link from "next/link";
import { Journal } from "@/components/journal";
import { SectionHead } from "@/components/ui";
import { days, formatDate, resolveFocusDay, sermonsByDate } from "@/lib/content";

export const metadata: Metadata = { title: "기도와 묵상" };

type Props = { searchParams: Promise<{ date?: string }> };

export default async function ReflectionPage({ searchParams }: Props) {
  const requested = (await searchParams).date;
  const day = days.find((d) => d.date === requested) ?? resolveFocusDay().day;
  const practice = sermonsByDate(day.date).find((s) => s.study)?.study?.practice;

  return (
    <div className="wrap pt-16 md:pt-24">
      <SectionHead
        eyebrow="Prayer & Reflection"
        title="말씀 앞에 머무는 시간"
        lede="여기 적은 내용은 서버로 전송되지 않고, 지금 사용하는 이 브라우저에만 저장됩니다. 기기를 바꾸면 보이지 않으니 필요하면 텍스트로 내려받아 두십시오."
      />

      <nav aria-label="날짜 선택" className="mt-14 md:ml-[25%]">
        <ul className="flex gap-1 overflow-x-auto border-b border-rule pb-px">
          {days.map((d) => {
            const active = d.date === day.date;
            return (
              <li key={d.date} className="shrink-0">
                <Link
                  href={`/reflection?date=${d.date}`}
                  aria-current={active ? "date" : undefined}
                  className={`block min-h-11 px-4 py-3 text-sm transition-colors duration-150 ${
                    active ? "border-b-2 border-burgundy text-ink" : "text-stone-deep hover:text-ink"
                  }`}
                >
                  <span className="numeral mr-2">{String(d.index).padStart(2, "0")}</span>
                  {d.theme}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-12 md:ml-[25%]">
        <Journal
          date={day.date}
          dayLabel={`DAY ${String(day.index).padStart(2, "0")} · ${formatDate(day.date, { withWeekday: true })} · ${day.theme}`}
          suggestedPractice={practice}
        />
      </div>
    </div>
  );
}
