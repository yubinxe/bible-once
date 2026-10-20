import type { Metadata } from "next";
import { DayTimeline } from "@/components/day-timeline";
import { SectionHead, SourceNote } from "@/components/ui";
import { event, resolveFocusDay } from "@/lib/content";

export const metadata: Metadata = { title: "특새 여정" };
export const revalidate = 1800;

export default function RevivalPage() {
  const { day } = resolveFocusDay();
  return (
    <div className="wrap pt-16 md:pt-24">
      <SectionHead
        eyebrow="Six-Day Journey"
        title={event.title}
        lede={`2026년 10월 19일(월)부터 24일(토)까지 · 평일 오전 4시 30분, 토요일 오전 5시 30분 · ${event.venue}`}
      />
      <div className="mt-16 md:ml-[25%]">
        <DayTimeline focusDate={day.date} detailed />
        <dl className="mt-10 grid gap-6 text-sm md:grid-cols-3">
          <div>
            <dt className="font-medium">공식 자료 게시</dt>
            <dd className="caption mt-1">공식 사이트·설교 목록 또는 당일 뉴스레터에 설교가 게시된 날.</dd>
          </div>
          <div>
            <dt className="font-medium">설교 예정 공지</dt>
            <dd className="caption mt-1">전날 뉴스레터에 예고만 된 날. 실제 선포 후 다시 대조합니다.</dd>
          </div>
          <div>
            <dt className="font-medium">공식 업데이트 대기</dt>
            <dd className="caption mt-1">아직 확인된 설교 정보가 없는 날. 임의로 채우지 않습니다.</dd>
          </div>
        </dl>
        <SourceNote className="mt-10" ids={event.sourceIds} />
      </div>
    </div>
  );
}
