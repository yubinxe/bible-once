import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead, VStatus } from "@/components/ui";
import { days, passageLabel, sermonsByDate, speakerName } from "@/lib/content";

export const metadata: Metadata = { title: "말씀 깊이 읽기" };

export default function SermonsIndex() {
  return (
    <div className="wrap pt-16 md:pt-24">
      <SectionHead
        eyebrow="Scripture Study"
        title="말씀 깊이 읽기"
        lede="본문 → 역사적 배경 → 논리 구조 → 신학적 의미 → 기억 → 기도. 강사마다 독립된 본문 연구로 엽니다."
      />
      <div className="mt-16 md:ml-[25%]">
        {days.map((d) => {
          const list = sermonsByDate(d.date);
          return (
            <section key={d.date} aria-label={`${d.index}일차`} className="border-t border-ink py-10">
              <p className="flex items-baseline gap-4">
                <span className="numeral text-2xl">{String(d.index).padStart(2, "0")}</span>
                <span className="display-ko text-xl">{d.theme}</span>
                <span className="caption">{d.date.slice(5).replace("-", ".")} {d.weekday}</span>
              </p>
              {list.length === 0 ? (
                <p className="caption mt-6 italic">— 공식 업데이트 대기</p>
              ) : (
                <ul className="mt-6 divide-y divide-rule">
                  {list.map((s) => (
                    <li key={s.id}>
                      <Link href={`/sermons/${s.id}`} className="group grid gap-1 py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6">
                        <span>
                          <span className="display-ko block text-[1.25rem] transition-colors duration-200 group-hover:text-burgundy">{s.title}</span>
                          <span className="mt-1 block text-[0.9375rem] text-stone-deep">
                            {speakerName(s)} · <span className="font-serif">{passageLabel(s.passage)}</span>
                          </span>
                        </span>
                        <VStatus status={s.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
