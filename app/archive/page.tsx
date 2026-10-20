import type { Metadata } from "next";
import { SectionHead } from "@/components/ui";
import { sources } from "@/lib/content";
import type { Source } from "@/lib/schema";

export const metadata: Metadata = { title: "공식자료" };

const METHOD: Record<Source["method"], string> = {
  direct: "원문 직접 대조",
  "search-index": "공식 페이지 색인 대조",
  "user-supplied": "운영자 제공 · 원문 대조 대기",
  "not-yet": "미열람",
};

const KIND: Record<Source["kind"], string> = {
  site: "사이트",
  page: "안내 페이지",
  "sermon-index": "설교 목록",
  newsletter: "뉴스레터",
  video: "영상",
  bible: "성경",
  press: "보도",
};

export default function ArchivePage() {
  const groups: { tier: Source["tier"]; title: string; desc: string }[] = [
    { tier: "A", title: "공식 1차 출처", desc: "사랑의교회가 운영하는 사이트와 공식 뉴스레터" },
    { tier: "B", title: "공신력 있는 외부 기관", desc: "성경 본문 등 원문 열람처" },
    { tier: "C", title: "미대조 자료", desc: "공식 원문과 대조되지 않은 자료" },
  ];
  return (
    <div className="wrap pt-16 md:pt-24">
      <SectionHead
        eyebrow="Official Archive · Source Registry"
        title="출처와 확인 상태"
        lede="이 사이트의 모든 공식 정보는 아래 출처 중 하나 이상에 근거합니다. 원본 콘텐츠는 각 출처에서 직접 보십시오. 이 사이트의 해설은 원본과 분리해 ‘편집 해설’로 표시합니다."
      />

      {groups.map((g) => {
        const list = sources.filter((s) => s.tier === g.tier);
        if (list.length === 0) return null;
        return (
          <section key={g.tier} aria-label={g.title} className="mt-16 md:ml-[25%]">
            <div className="flex items-baseline gap-4 border-b border-ink pb-4">
              <span className="numeral text-2xl">{g.tier}</span>
              <h2 className="display-ko text-xl">{g.title}</h2>
              <span className="caption hidden sm:inline">{g.desc}</span>
            </div>
            <ul className="divide-y divide-rule">
              {list.map((s) => (
                <li key={s.id} className="grid gap-2 py-6 md:grid-cols-[1fr_14rem] md:gap-8">
                  <div>
                    <a href={s.url} target="_blank" rel="noopener" className="text-[1.0625rem] link-quiet">
                      {s.title} <span aria-hidden className="text-stone">↗</span>
                    </a>
                    <p className="caption mt-1 break-all">{decodeURI(s.url)}</p>
                    {s.note && <p className="mt-3 text-[0.9375rem] leading-7 text-ink/80">{s.note}</p>}
                  </div>
                  <dl className="grid grid-cols-[4.5rem_1fr] gap-y-1 text-[0.8125rem] text-stone-deep">
                    <dt>유형</dt>
                    <dd className="text-ink">{KIND[s.kind]}</dd>
                    <dt>확인</dt>
                    <dd className="text-ink">{METHOD[s.method]}</dd>
                    {s.publishedOn && (
                      <>
                        <dt>발행</dt>
                        <dd className="text-ink">{s.publishedOn}</dd>
                      </>
                    )}
                    <dt>대조 시각</dt>
                    <dd className="text-ink">{s.checkedAt.slice(0, 16).replace("T", " ")}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section aria-label="수집 원칙" className="mt-20 bg-paper px-6 py-10 md:ml-[25%] md:px-10">
        <h2 className="display-ko text-xl">수집과 게시의 원칙</h2>
        <ul className="mt-6 space-y-3 text-[0.9375rem] leading-7">
          <li>공개된 페이지만, robots.txt와 이용조건을 지키며, 낮은 빈도로 수집합니다.</li>
          <li>설교 영상·음원·뉴스레터의 전문은 재게시하지 않고 원본으로 연결합니다.</li>
          <li>성경 본문은 핵심 구절 1절 이내만 인용하고, 전문은 대한성서공회 온라인 성경으로 연결합니다.</li>
          <li>개인 기도요청, 실명 간증, 성도의 게시글은 수집하지 않습니다.</li>
          <li>정보가 없으면 만들어 채우지 않고 ‘공식 업데이트 대기’로 표기합니다.</li>
        </ul>
      </section>
    </div>
  );
}
