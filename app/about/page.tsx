import type { Metadata } from "next";
import { SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "프로젝트 소개 · 고지" };

const ITEMS = [
  {
    t: "무엇인가",
    b: "THE DAWN은 사랑의교회 제24차 가을 글로벌 특별새벽부흥회(2026.10.19–24)에서 선포되는 말씀을 이해하고 묵상하며 삶에 새기도록 돕는 독립 성경 학습 동반자입니다.",
  },
  {
    t: "공식 서비스가 아닙니다",
    b: "이 사이트는 사랑의교회의 공식 홈페이지를 대체하지 않으며, 교회의 운영·후원·승인을 받지 않았습니다. 일정·설교·영상 등 공식 정보의 최종 기준은 언제나 사랑의교회 공식 사이트입니다.",
  },
  {
    t: "원본과 해설의 구분",
    b: "설교 제목·본문·강사 등 공식 정보에는 출처와 확인 상태를 함께 표시합니다. ‘본문 연구’는 성경 본문에 대한 편집 해설로, 설교자의 설교 내용을 요약하거나 대변하지 않습니다. 설교 요약은 공식 영상·원문을 확인한 뒤에만 게시합니다.",
  },
  {
    t: "검수",
    b: "모든 편집 해설은 ‘검수 대기’ 상태로 시작하며, 사람이 성경 원문과 신학적 타당성을 검토한 뒤에만 ‘검수 완료’로 바뀝니다. AI의 도움을 받아 작성된 초안도 이 절차를 거치지 않고는 확정되지 않습니다.",
  },
  {
    t: "저작권",
    b: "성경 인용은 개역개정판 핵심 구절 1절 이내로 제한하고 전문은 대한성서공회 온라인 성경으로 연결합니다. 설교 영상·음원·뉴스레터·사진은 재배포하지 않고 공식 출처로 연결합니다. 이 사이트의 그림은 실제 교회 사진이 아닌 독창적 일러스트레이션입니다.",
  },
  {
    t: "개인정보",
    b: "묵상과 기도 기록은 사용자의 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다. 회원가입, 추적 쿠키, 광고가 없습니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="wrap pt-16 md:pt-24">
      <SectionHead eyebrow="About · Disclaimer" title="Design for Reverence. Engineer for Clarity." />
      <dl className="mt-16 divide-y divide-rule border-y border-rule md:ml-[25%]">
        {ITEMS.map((i) => (
          <div key={i.t} className="grid gap-3 py-8 md:grid-cols-[12rem_1fr] md:gap-10">
            <dt className="display-ko text-[1.125rem]">{i.t}</dt>
            <dd className="measure text-[0.9875rem] leading-8">{i.b}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
