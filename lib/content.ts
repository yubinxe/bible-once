import { days, event, speakerById } from "@/content/event";
import { sermons, sermonsByDate } from "@/content/sermons";
import { sourceById, sources } from "@/content/sources";
import type { Day, PassageRef, ReviewStatus, Sermon, VerificationStatus } from "@/lib/schema";

export { days, event, sermons, sermonsByDate, sourceById, sources, speakerById };

/** Asia/Seoul 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayKST(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type Phase = "before" | "during" | "after";

/** 행사 기간 기준으로 ‘오늘의 날’을 결정한다. 기간 밖이면 가장 가까운 날을 돌려준다. */
export function resolveFocusDay(today = todayKST()): { day: Day; phase: Phase } {
  if (today < event.start) return { day: days[0], phase: "before" };
  if (today > event.end) return { day: days[days.length - 1], phase: "after" };
  return { day: days.find((d) => d.date === today) ?? days[0], phase: "during" };
}

export function dayByDateSafe(date: string): Day {
  const d = days.find((x) => x.date === date);
  if (!d) throw new Error(`Unknown revival date: ${date}`);
  return d;
}

export function previousDay(date: string): Day | undefined {
  const i = days.findIndex((d) => d.date === date);
  return i > 0 ? days[i - 1] : undefined;
}

export function passageLabel(p: PassageRef): string {
  return p.from === p.to
    ? `${p.book} ${p.chapter}:${p.from}`
    : `${p.book} ${p.chapter}:${p.from}–${p.to}`;
}

/** 대한성서공회 온라인 성경(개역개정) 장 단위 링크 */
export function bibleUrl(p: PassageRef): string {
  return `https://www.bskorea.or.kr/bible/korbibReadpage.php?version=GAE&book=${p.bookCode}&chap=${p.chapter}`;
}

export function formatDate(date: string, opts: { withWeekday?: boolean } = {}): string {
  const [, m, d] = date.split("-").map(Number);
  const day = days.find((x) => x.date === date);
  return opts.withWeekday && day ? `${m}월 ${d}일 (${day.weekday})` : `${m}월 ${d}일`;
}

export function formatDot(date: string): string {
  const [, m, d] = date.split("-");
  return `${m}.${d}`;
}

export const verificationLabel: Record<VerificationStatus, string> = {
  verified: "공식 게시 확인",
  newsletter: "뉴스레터 기준",
  scheduled: "예정",
  changed: "변경 감지 · 재검토",
  pending: "공식 업데이트 대기",
};

export const reviewLabel: Record<ReviewStatus, string> = {
  draft: "편집 초안",
  "needs-review": "편집 해설 · 검수 대기",
  reviewed: "편집 해설 · 검수 완료",
};

export type DayState = "published" | "scheduled" | "awaiting";

/** 날짜별 콘텐츠 상태 — 예정 / 공식 자료 게시 / 학습 콘텐츠 준비 중 */
export function dayState(day: Day): { state: DayState; label: string; hasStudy: boolean } {
  const list = sermonsByDate(day.date);
  const hasStudy = list.some((s) => s.study);
  if (list.length === 0) return { state: "awaiting", label: "공식 업데이트 대기", hasStudy };
  if (list.every((s) => s.status === "scheduled")) return { state: "scheduled", label: "설교 예정 공지", hasStudy };
  return { state: "published", label: "공식 자료 게시", hasStudy };
}

export function speakerName(s: Sermon): string {
  return speakerById(s.speakerId)?.name ?? "미확인";
}
