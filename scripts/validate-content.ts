/**
 * 콘텐츠 무결성 검사 — CI에서 실행한다.
 * 스키마 + 참조 무결성 + 편집 원칙(검증 없는 확정 표기 금지)을 함께 확인한다.
 */
import { z } from "zod";
import { days, event, speakers } from "../content/event";
import { sermons } from "../content/sermons";
import { sources } from "../content/sources";
import { Day, Event, Sermon, Source, Speaker } from "../lib/schema";

const errors: string[] = [];
const warn: string[] = [];
const err = (m: string) => errors.push(m);

function parse<T>(schema: z.ZodType<T>, value: unknown, label: string) {
  const r = schema.safeParse(value);
  if (!r.success) err(`${label}: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
}

parse(Event, event, "event");
speakers.forEach((s) => parse(Speaker, s, `speaker ${s.id}`));
sources.forEach((s) => parse(Source, s, `source ${s.id}`));
days.forEach((d) => parse(Day, d, `day ${d.date}`));
sermons.forEach((s) => parse(Sermon, s, `sermon ${s.id}`));

const sourceIds = new Set(sources.map((s) => s.id));
const speakerIds = new Set(speakers.map((s) => s.id));
const sermonIds = new Set(sermons.map((s) => s.id));
const dayDates = new Set(days.map((d) => d.date));

const unique = (arr: string[], label: string) => {
  const seen = new Set<string>();
  arr.forEach((x) => (seen.has(x) ? err(`${label} 중복: ${x}`) : seen.add(x)));
};
unique(sources.map((s) => s.id), "source id");
unique(sermons.map((s) => s.id), "sermon id");
unique(days.map((d) => d.date), "day date");

if (days.length !== 6) err(`일정은 6일이어야 한다 (현재 ${days.length})`);
days.forEach((d, i) => {
  if (d.date < event.start || d.date > event.end) err(`day ${d.date}: 행사 기간 밖 — 과거 회차 데이터 혼입 의심`);
  if (d.index !== i + 1) err(`day ${d.date}: index 순서 불일치`);
  const [y, m, dd] = d.date.split("-").map(Number);
  const expected = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(y, m - 1, dd)).getUTCDay()];
  if (d.weekday !== expected) err(`day ${d.date}: 요일 ${d.weekday} ≠ ${expected}`);
  d.sourceIds.forEach((id) => sourceIds.has(id) || err(`day ${d.date}: 알 수 없는 source ${id}`));
  d.insight?.links.forEach((l) => sermonIds.has(l.sermonId) || err(`day ${d.date}: insight가 없는 설교 ${l.sermonId}를 참조`));
});

sermons.forEach((s) => {
  if (!dayDates.has(s.date)) err(`sermon ${s.id}: 일정에 없는 날짜 ${s.date}`);
  if (!speakerIds.has(s.speakerId)) err(`sermon ${s.id}: 알 수 없는 speaker ${s.speakerId}`);
  s.sourceIds.forEach((id) => sourceIds.has(id) || err(`sermon ${s.id}: 알 수 없는 source ${id}`));
  if (!s.id.startsWith(s.date)) err(`sermon ${s.id}: id가 날짜로 시작하지 않음`);
  if (s.passage.from > s.passage.to) err(`sermon ${s.id}: 절 범위 역전`);

  // 'verified'는 tier A 출처를 실제로 대조한 경우에만 허용
  if (s.status === "verified") {
    const ok = s.sourceIds
      .map((id) => sources.find((x) => x.id === id))
      .some((x) => x && x.tier === "A" && (x.method === "direct" || x.method === "search-index"));
    if (!ok) err(`sermon ${s.id}: verified인데 대조된 tier A 출처가 없음`);
  }
  // 설교 요약은 근거와 사람의 검수 없이 게시할 수 없다
  if (s.editorSummary && s.editorSummary.review !== "reviewed") err(`sermon ${s.id}: 검수되지 않은 설교 요약은 게시 불가`);
  // 핵심 구절은 1절 이내
  if (s.study?.keyVerse && /[-–,]/.test(s.study.keyVerse.ref)) err(`sermon ${s.id}: keyVerse는 1절 이내여야 함`);
  if (s.study?.review === "reviewed") warn.push(`sermon ${s.id}: reviewed — 검수자 기록을 DECISIONS.md에 남겼는지 확인`);
});

warn.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.error(`\n콘텐츠 검사 실패: ${errors.length}건`);
  process.exit(1);
}
console.log(`✓ 콘텐츠 검사 통과 — ${days.length}일 · 설교 ${sermons.length} · 출처 ${sources.length}`);
