"use client";

import { useId, useState } from "react";
import type { Study } from "@/lib/schema";
import { useLocal } from "@/lib/local-store";

/** 기억 인출 — 먼저 떠올리고, 그다음 확인한다. 점수는 매기지 않는다. */
export function RecallList({ items }: { items: Study["recall"] }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {items.map((item, i) => (
        <RecallRow key={item.prompt} index={i + 1} {...item} />
      ))}
    </ol>
  );
}

function RecallRow({ index, prompt, answer }: { index: number; prompt: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-7 md:grid-cols-[4rem_1fr]">
      <span className="numeral pt-0.5 text-lg text-stone-deep">{String(index).padStart(2, "0")}</span>
      <div>
        <p className="display-ko text-[1.125rem] leading-8">{prompt}</p>
        <p className="caption mt-2">먼저 화면을 보지 않고 소리 내어, 또는 마음속으로 답해 보십시오.</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 min-h-11 text-sm font-medium text-burgundy link-quiet"
        >
          {open ? "확인 접기" : "떠올렸다면, 확인하기"}
        </button>
        <div id={id} hidden={!open} className="mt-3 measure border-l border-gold pl-4 text-[0.9375rem] leading-7">
          {answer}
        </div>
      </div>
    </li>
  );
}

/** 본문과 해석 구별하기 */
export function Distinguish({ items }: { items: Study["distinguish"] }) {
  return (
    <ul className="grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2">
      {items.map((item) => (
        <DistinguishCard key={item.statement} {...item} />
      ))}
    </ul>
  );
}

function DistinguishCard({ statement, kind, why }: Study["distinguish"][number]) {
  const [pick, setPick] = useState<null | "text" | "interpretation">(null);
  const correct = pick === kind;
  const label = kind === "text" ? "본문이 직접 말함" : "해석·적용";
  return (
    <li className="flex flex-col bg-paper p-6 md:p-8">
      <p className="font-serif text-[1.0625rem] leading-8">“{statement}”</p>
      <div className="mt-auto pt-6" role="group" aria-label="본문인지 해석인지 고르기">
        <div className="flex gap-2">
          {(["text", "interpretation"] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={pick === k}
              onClick={() => setPick(k)}
              className={`min-h-11 flex-1 border px-3 text-sm transition-colors duration-150 ${
                pick === k ? "border-navy bg-navy text-paper" : "border-rule hover:border-ink"
              }`}
            >
              {k === "text" ? "본문" : "해석"}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-[3.5rem] text-sm leading-6">
          {pick && (
            <>
              <span className={correct ? "text-navy font-medium" : "text-burgundy font-medium"}>
                {correct ? "맞습니다" : "다시 보십시오"} · {label}
              </span>
              <span className="block text-stone-deep">{why}</span>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

/** 오늘의 말씀 한 문장 — 자기 언어로 설명하기 */
export function OneSentence({ storageKey, hint }: { storageKey: string; hint: string }) {
  const { value, setValue, save, ready, persisted } = useLocal<string>(storageKey, "");
  const [saved, setSaved] = useState(false);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="display-ko block text-[1.125rem]">
        오늘의 말씀을 한 문장으로 설명한다면
      </label>
      <p className="caption mt-2">{hint}</p>
      <textarea
        id={id}
        rows={3}
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        className="mt-4 w-full resize-y border-0 border-b border-ink/40 bg-transparent py-3 font-serif text-[1.125rem] leading-8 outline-none focus:border-ink focus-visible:outline-none"
        placeholder="나의 언어로 적어 보십시오."
      />
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          className="min-h-11 text-sm font-medium link-quiet"
          onClick={() => {
            save(value.trim() ? value : null);
            setSaved(true);
          }}
        >
          이 기기에 저장
        </button>
        <span aria-live="polite" className="caption">
          {saved && (persisted ? "저장했습니다." : "이 브라우저에서는 저장할 수 없습니다.")}
        </span>
      </div>
    </div>
  );
}
