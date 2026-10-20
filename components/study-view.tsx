import { FlowMap } from "@/components/flow-map";
import { Distinguish, OneSentence, RecallList } from "@/components/recall";
import { RStatus, SourceNote, TextLink } from "@/components/ui";
import { bibleUrl, passageLabel } from "@/lib/content";
import type { Sermon, Study } from "@/lib/schema";

export const STUDY_TOC = [
  { id: "scripture", label: "본문" },
  { id: "plain", label: "쉽게 읽기" },
  { id: "context", label: "맥락" },
  { id: "visual", label: "흐름" },
  { id: "theology", label: "신학적 묵상" },
  { id: "recall", label: "기억하기" },
  { id: "prayer", label: "기도" },
] as const;

function Block({ id, n, eyebrow, title, children }: { id: string; n: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} data-reveal aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-rule py-16 md:py-20">
      <p className="eyebrow text-burgundy">
        <span className="numeral mr-3 tracking-normal">{n}</span>
        {eyebrow}
      </p>
      <h2 id={`${id}-h`} className="display-ko mt-4 text-[length:var(--text-h2)]">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function StudyView({ sermon, study }: { sermon: Sermon; study: Study }) {
  return (
    <div>
      <Block id="scripture" n="01" eyebrow="Scripture" title={passageLabel(sermon.passage)}>
        {study.keyVerse ? (
          <figure className="relative">
            <span aria-hidden className="absolute -left-1 -top-10 font-display text-[6rem] leading-none text-gold/50 md:-left-12">
              “
            </span>
            <blockquote className="scripture text-ink">{study.keyVerse.text}</blockquote>
            <figcaption className="caption mt-5">
              {study.keyVerse.ref} · 개역개정 · 핵심 구절 인용(원문 대조 검수 대기)
            </figcaption>
          </figure>
        ) : (
          <p className="text-stone-deep">핵심 구절 인용은 원문 대조 후 게시합니다.</p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[2px] bg-sand/50 px-5 py-4">
          <p className="text-[0.9375rem]">먼저 본문 전체를 소리 내어 한 번 읽어 주십시오.</p>
          <TextLink href={bibleUrl(sermon.passage)}>대한성서공회 개역개정으로 읽기</TextLink>
        </div>
      </Block>

      <Block id="plain" n="02" eyebrow="Layer 1 · Plain Understanding" title="쉬운 말로 다시 읽기">
        <ol className="space-y-6">
          {study.plain.map((p, i) => (
            <li key={p} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="numeral pt-1 text-stone-deep">{i + 1}</span>
              <p className="font-serif text-[1.125rem] leading-[1.9]">{p}</p>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="context" n="03" eyebrow="Layer 2 · Contextual Understanding" title="이 본문이 놓인 자리">
        <dl className="divide-y divide-rule border-y border-rule">
          {study.context.map((c) => (
            <div key={c.label} className="grid gap-2 py-6 md:grid-cols-[10rem_1fr] md:gap-8">
              <dt className="font-serif text-burgundy">{c.label}</dt>
              <dd className="text-[0.9875rem] leading-8">{c.body}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block id="visual" n="04" eyebrow="Visual Sequencing" title="흐름으로 보기">
        <FlowMap visual={study.visual} />
      </Block>

      <Block id="theology" n="05" eyebrow="Layer 3 · Theological Reflection" title="본문에서 신학으로">
        <p className="caption -mt-4 mb-8">아래는 본문 자체가 아니라 본문에 대한 해석입니다.</p>
        <div className="grid gap-10 md:grid-cols-2">
          {study.theology.map((t) => (
            <div key={t.label} className="border-t border-ink pt-5">
              <h3 className="display-ko text-[1.1875rem]">{t.label}</h3>
              <p className="mt-3 text-[0.9875rem] leading-8 text-ink/90">{t.body}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block id="recall" n="06" eyebrow="Active Recall" title="화면을 덮고, 떠올려 보기">
        <RecallList items={study.recall} />
        <h3 className="display-ko mt-16 text-[length:var(--text-h3)]">본문인가, 해석인가</h3>
        <p className="caption mt-2 mb-8">각 문장이 본문이 직접 말하는 것인지, 본문에 대한 해석·적용인지 골라 보십시오.</p>
        <Distinguish items={study.distinguish} />
        <div className="mt-16">
          <OneSentence
            storageKey={`dawn:sentence:${sermon.id}`}
            hint="정답은 없습니다. 내일 아침 이 문장을 다시 떠올려 보는 것이 복습입니다."
          />
        </div>
      </Block>

      <Block id="prayer" n="07" eyebrow="Prayer & Practice" title="말씀을 기도로">
        <p className="scripture max-w-[40rem]">{study.prayer}</p>
        <div className="mt-12 border-l-2 border-burgundy pl-5">
          <p className="eyebrow text-[0.6875rem] text-burgundy">This Week</p>
          <p className="mt-2 text-[1.0625rem] leading-8">{study.practice}</p>
        </div>
      </Block>

      <footer className="border-t border-ink pt-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <RStatus status={study.review} />
          <p className="caption">
            본문 연구는 성경 본문에 대한 편집 해설이며, 설교자의 설교 내용을 요약하거나 대변하지 않습니다.
          </p>
        </div>
        <SourceNote className="mt-4" ids={sermon.sourceIds} />
      </footer>
    </div>
  );
}
