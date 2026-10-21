import { z } from "zod";

/**
 * 콘텐츠 계층의 단일 진실 원천(Single Source of Truth) 스키마.
 * 공식 데이터(Source Layer)와 편집 해설(Content Layer)을 타입 수준에서 분리한다.
 */

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const isoDateTime = z.string().datetime({ offset: true });

/** 공식 데이터의 확인 상태 */
export const VerificationStatus = z.enum([
  "verified", // 공식 출처 또는 그 색인에서 직접 대조 완료
  "newsletter", // 공식 뉴스레터 기준 — 웹 게시본과 재대조 대기
  "scheduled", // 예정 공지 — 실제 선포 후 확인 필요
  "changed", // 공식 출처에서 변경 감지 — 재검토 필요
  "pending", // 공식 업데이트 대기 (정보 없음)
]);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

/** 편집 해설의 검수 상태 — 사람의 검수 없이 'reviewed'가 될 수 없다 */
export const ReviewStatus = z.enum(["draft", "needs-review", "reviewed"]);
export type ReviewStatus = z.infer<typeof ReviewStatus>;

export const TrustTier = z.enum(["A", "B", "C"]);
export type TrustTier = z.infer<typeof TrustTier>;

export const Source = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  kind: z.enum(["site", "page", "sermon-index", "newsletter", "video", "bible", "press"]),
  publisher: z.string(),
  tier: TrustTier,
  /** 실제 발행일 (알 수 있는 경우) */
  publishedOn: isoDate.optional(),
  /** 마지막으로 내용을 대조한 시각 */
  checkedAt: isoDateTime,
  /** 대조 방법 — 직접 열람, 검색 색인, 사용자 제공 등 */
  method: z.enum(["direct", "search-index", "user-supplied", "not-yet"]),
  note: z.string().optional(),
});
export type Source = z.infer<typeof Source>;

export const Speaker = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().optional(),
  /** 공식 출처에서 확인된 소속만 기재. 미확인이면 생략 */
  affiliation: z.string().optional(),
  /** 현장 / 영상 — 공식 확인 전에는 unknown */
  delivery: z.enum(["onsite", "video", "unknown"]),
});
export type Speaker = z.infer<typeof Speaker>;

export const PassageRef = z.object({
  book: z.string(), // 한글 책 이름
  bookCode: z.string(), // 대한성서공회 온라인 성경 코드
  chapter: z.number().int().positive(),
  from: z.number().int().positive(),
  to: z.number().int().positive(),
});
export type PassageRef = z.infer<typeof PassageRef>;

/** 시각화 노드 — 논증 지도/주제 진행/장면 순서 공통 */
export const FlowNode = z.object({
  verses: z.string(),
  label: z.string(),
  detail: z.string(),
  /** 다음 노드로 이어지는 관계어 (그러므로, 그러나, 왜냐하면 …) */
  link: z.string().optional(),
  /** 선택 본문 밖의 문맥 노드 */
  context: z.boolean().optional(),
});

export const Visual = z.object({
  kind: z.enum(["argument-map", "thematic-progression", "narrative-sequence", "literary-structure"]),
  title: z.string(),
  caption: z.string(),
  nodes: z.array(FlowNode).min(2),
});

export const RecallItem = z.object({
  prompt: z.string(),
  answer: z.string(),
});

export const DistinguishItem = z.object({
  statement: z.string(),
  kind: z.enum(["text", "interpretation"]),
  why: z.string(),
});

export const Study = z.object({
  review: ReviewStatus,
  /** 핵심 구절 1절 인용 (개역개정). 전문 재배포 금지 원칙에 따라 1절 이내 */
  keyVerse: z.object({ ref: z.string(), text: z.string() }).optional(),
  plain: z.array(z.string()).min(1),
  context: z.array(z.object({ label: z.string(), body: z.string() })).min(1),
  theology: z.array(z.object({ label: z.string(), body: z.string() })).min(1),
  visual: Visual,
  recall: z.array(RecallItem).min(1),
  distinguish: z.array(DistinguishItem).min(2),
  prayer: z.string(),
  practice: z.string(),
});
export type Study = z.infer<typeof Study>;

export const Sermon = z.object({
  id: z.string(),
  date: isoDate,
  order: z.number().int().positive(),
  speakerId: z.string(),
  title: z.string(),
  passage: PassageRef,
  status: VerificationStatus,
  sourceIds: z.array(z.string()).min(1),
  officialUrl: z.string().url().optional(),
  /** 공식 설교 원문/영상 확인 후에만 채운다 */
  editorSummary: z
    .object({ lines: z.array(z.string()).length(3), basis: z.string(), review: ReviewStatus })
    .optional(),
  study: Study.optional(),
});
export type Sermon = z.infer<typeof Sermon>;

export const Day = z.object({
  date: isoDate,
  index: z.number().int().min(1).max(6),
  weekday: z.string(),
  theme: z.string(),
  themeStatus: VerificationStatus,
  motif: z.string(),
  motifEn: z.string(),
  startsAt: z.string(),
  prayerTopics: z.array(z.string()),
  hymns: z.array(z.object({ title: z.string(), number: z.number().optional() })),
  insight: z
    .object({
      concept: z.string(),
      conceptEn: z.string(),
      definition: z.string(),
      links: z.array(z.object({ sermonId: z.string(), body: z.string() })),
      review: ReviewStatus,
    })
    .optional(),
  sourceIds: z.array(z.string()),
});
export type Day = z.infer<typeof Day>;

export const Event = z.object({
  id: z.string(),
  title: z.string(),
  titleEn: z.string(),
  edition: z.number().int(),
  season: z.enum(["spring", "fall"]),
  year: z.number().int(),
  start: isoDate,
  end: isoDate,
  venue: z.string(),
  timezone: z.literal("Asia/Seoul"),
  sourceIds: z.array(z.string()),
});
export type Event = z.infer<typeof Event>;

/**
 * 설교 노트 — 공식 설교 영상의 자막을 전사해 AI가 정리한 요약·인사이트.
 * 전사 원문은 저장소와 사이트에 올리지 않는다(저작권). 이 노트는 원본 영상 타임스탬프와 함께만 게시한다.
 */
const timestamp = z.string().regex(/^\d{1,2}:\d{2}(:\d{2})?$/);

export const SermonNote = z.object({
  sermonId: z.string(),
  review: ReviewStatus,
  video: z.object({
    url: z.string().url(),
    id: z.string(),
    title: z.string(),
    channel: z.string(),
    uploadDate: isoDate.optional(),
  }),
  transcript: z.object({
    source: z.enum(["youtube-captions", "youtube-auto-captions", "manual"]),
    chars: z.number().int().positive(),
    transcribedAt: isoDateTime,
  }),
  model: z.string(),
  summary: z.array(z.string()).length(3),
  outline: z.array(z.object({ at: timestamp, heading: z.string(), point: z.string() })).min(3),
  insights: z.array(z.object({ title: z.string(), body: z.string(), at: timestamp.optional() })).min(2),
  crossReferences: z.array(z.object({ ref: z.string(), note: z.string() })),
  applications: z.array(z.string()).min(1),
  prayer: z.string(),
  caveats: z.array(z.string()),
});
export type SermonNote = z.infer<typeof SermonNote>;
