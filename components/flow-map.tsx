import type { Study } from "@/lib/schema";

const KIND_LABEL: Record<Study["visual"]["kind"], string> = {
  "argument-map": "Argument Map · 논증 지도",
  "thematic-progression": "Thematic Progression · 주제 진행",
  "narrative-sequence": "Narrative Sequence · 사건 순서",
  "literary-structure": "Literary Structure · 문학 구조",
};

/**
 * 본문의 흐름을 세로 척추(spine) 위에 놓는다.
 * 관계어(그러므로, 그러나 …)를 노드 사이에 적어 논리의 이음새를 드러낸다.
 */
export function FlowMap({ visual }: { visual: Study["visual"] }) {
  return (
    <figure>
      <figcaption className="mb-10 grid gap-2 md:grid-cols-12">
        <span className="eyebrow text-burgundy md:col-span-4">{KIND_LABEL[visual.kind]}</span>
        <span className="md:col-span-8">
          <span className="display-ko block text-[length:var(--text-h3)]">{visual.title}</span>
          <span className="caption mt-2 block">{visual.caption}</span>
        </span>
      </figcaption>

      <ol className="relative">
        {visual.nodes.map((n, i) => {
          const last = i === visual.nodes.length - 1;
          return (
            <li key={n.verses} data-reveal className="relative grid grid-cols-[3.5rem_1fr] gap-x-5 md:grid-cols-[6rem_1fr] md:gap-x-10">
              {/* spine */}
              <div className="relative flex justify-center">
                <span
                  className={`relative z-10 mt-[0.55rem] block h-2.5 w-2.5 rotate-45 ${
                    n.context ? "border border-stone bg-canvas" : "bg-navy"
                  }`}
                />
                {!last && <span className="absolute top-6 bottom-0 w-px bg-rule" aria-hidden />}
              </div>

              <div className={`pb-3 ${n.context ? "opacity-80" : ""}`}>
                <div
                  className={`px-0 py-1 ${
                    n.context ? "border-l border-dashed border-stone pl-4" : ""
                  }`}
                >
                  <p className="numeral text-[0.9375rem] text-stone-deep">
                    {n.verses}절{n.context && <span className="ml-2 font-sans text-xs tracking-normal">· 문맥</span>}
                  </p>
                  <p className="display-ko mt-1 text-[1.1875rem]">{n.label}</p>
                  <p className="mt-2 measure text-[0.9375rem] leading-7 text-ink/85">{n.detail}</p>
                </div>
                {n.link && !last && (
                  <p className="my-6 font-serif text-sm italic text-burgundy" aria-label={`관계: ${n.link}`}>
                    {n.link}
                  </p>
                )}
                {n.link && last && <p className="mt-6 caption italic">{n.link}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
