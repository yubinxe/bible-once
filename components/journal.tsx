"use client";

import { useEffect, useId, useState } from "react";
import { readLocal, writeLocal } from "@/lib/local-store";

export type JournalEntry = {
  insight: string;
  question: string;
  prayer: string;
  practice: string;
  updatedAt?: string;
};

const EMPTY: JournalEntry = { insight: "", question: "", prayer: "", practice: "" };

const FIELDS: { key: keyof Omit<JournalEntry, "updatedAt">; label: string; hint: string; rows: number }[] = [
  { key: "insight", label: "오늘 깨달은 말씀", hint: "마음에 남은 구절이나 깨달음 하나.", rows: 3 },
  { key: "question", label: "나에게 남은 질문", hint: "아직 풀리지 않은 것, 더 알고 싶은 것.", rows: 2 },
  { key: "prayer", label: "오늘의 기도", hint: "말씀을 나의 언어로 하나님께 돌려드립니다.", rows: 5 },
  { key: "practice", label: "이번 주 실천", hint: "작고 구체적인 한 가지.", rows: 2 },
];

export const journalKey = (date: string) => `dawn:journal:${date}`;

export function Journal({ date, dayLabel, suggestedPractice }: { date: string; dayLabel: string; suggestedPractice?: string }) {
  const [entry, setEntry] = useState<JournalEntry>(EMPTY);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const base = useId();

  useEffect(() => {
    // 날짜가 바뀌면 그 날의 기록을 이 기기에서 불러온다
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntry(readLocal<JournalEntry>(journalKey(date)) ?? EMPTY);
    setReady(true);
    setNotice("");
  }, [date]);

  const save = () => {
    const next = { ...entry, updatedAt: new Date().toISOString() };
    const ok = writeLocal(journalKey(date), next);
    setEntry(next);
    setNotice(ok ? "이 기기에 저장했습니다." : "이 브라우저에서는 저장할 수 없습니다. 내려받기를 이용해 주십시오.");
  };

  const remove = () => {
    if (!window.confirm("이 날의 묵상 기록을 이 기기에서 지울까요?")) return;
    writeLocal(journalKey(date), null);
    setEntry(EMPTY);
    setNotice("기록을 지웠습니다.");
  };

  const download = () => {
    const body = [
      `THE DAWN · ${dayLabel}`,
      "",
      ...FIELDS.flatMap((f) => [`■ ${f.label}`, entry[f.key] || "-", ""]),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `the-dawn-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const empty = FIELDS.every((f) => !entry[f.key].trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="paper-grain border border-rule px-6 py-10 md:px-14 md:py-14"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-5">
        <p className="display-ko text-[length:var(--text-h3)]">{dayLabel}</p>
        <p className="caption">비공개 · 이 기기에만 저장</p>
      </div>

      <div className="divide-y divide-rule">
        {FIELDS.map((f, i) => {
          const id = `${base}-${f.key}`;
          return (
            <div key={f.key} className="grid gap-3 py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <label htmlFor={id} className="flex items-baseline gap-3">
                  <span className="numeral text-stone-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display-ko text-[1.125rem]">{f.label}</span>
                </label>
                <p className="caption mt-1 pl-8">
                  {f.key === "practice" && suggestedPractice ? `제안 — ${suggestedPractice}` : f.hint}
                </p>
              </div>
              <textarea
                id={id}
                rows={f.rows}
                disabled={!ready}
                value={entry[f.key]}
                onChange={(e) => setEntry((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="md:col-span-8 w-full resize-y border-0 border-b border-ink/30 bg-transparent py-2 font-serif text-[1.0625rem] leading-8 outline-none focus:border-ink focus-visible:outline-none"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" className="btn btn-ink">저장</button>
        <button type="button" onClick={download} disabled={empty} className="min-h-11 text-sm link-quiet disabled:opacity-40">
          텍스트로 내려받기
        </button>
        <button type="button" onClick={remove} disabled={empty} className="min-h-11 text-sm text-burgundy link-quiet disabled:opacity-40">
          기록 지우기
        </button>
        <span aria-live="polite" className="caption">{notice}</span>
      </div>
      {entry.updatedAt && (
        <p className="caption mt-4">
          마지막 저장 {new Date(entry.updatedAt).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      )}
    </form>
  );
}
