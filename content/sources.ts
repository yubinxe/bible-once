import type { Source } from "@/lib/schema";

/**
 * Source Registry — 모든 공식 데이터는 여기 등록된 출처 중 하나 이상을 근거로 한다.
 *
 * tier A  공식 1차 출처 (사랑의교회 운영 도메인, 공식 뉴스레터)
 * tier B  공식 2차 출처·공신력 있는 외부 기관 (대한성서공회 등)
 * tier C  사용자 제공·미대조 자료
 *
 * method
 *   direct         본 저장소의 수집기가 원문을 직접 열람
 *   search-index   검색 색인에 노출된 공식 페이지 내용으로 대조
 *   user-supplied  운영자가 제공한 값 — 공식 원문과 재대조 대기
 *   not-yet        아직 열람하지 못함
 */
const CHECKED = "2026-10-20T10:39:58+09:00";

export const sources: Source[] = [
  {
    id: "revival-home",
    title: "사랑의교회 특별새벽부흥회 — 2026 가을",
    url: "https://revival.sarang.org/index.asp?div=2026_fall",
    kind: "site",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "search-index",
    note: "일정(10.19–24, 평일 04:30 · 토 05:30)과 10월 19일 설교자 김철수 선교사(GMS 순회선교사)를 검색 색인에서 확인.",
  },
  {
    id: "revival-intro",
    title: "특새소개 Introduction",
    url: "https://revival.sarang.org/contents/sub01.asp",
    kind: "page",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "not-yet",
  },
  {
    id: "revival-live",
    title: "집회실황",
    url: "https://revival.sarang.org/contents/sub02.asp",
    kind: "video",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "not-yet",
  },
  {
    id: "revival-schedule",
    title: "일정 및 강사 — 2026 가을",
    url: "https://revival.sarang.org/contents/sub03.asp?div=2026_fall",
    kind: "page",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "not-yet",
    note: "과거 회차(봄 특새) 페이지와 URL 구조가 같으므로 div 파라미터의 연도·시즌을 반드시 확인.",
  },
  {
    id: "global-intro",
    title: "글로벌 특새 소개",
    url: "https://globalrevival.sarang.org/intro/intro.asp",
    kind: "page",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "not-yet",
  },
  {
    id: "global-vision",
    title: "글로벌 특새 비전",
    url: "https://globalrevival.sarang.org/intro/vision.asp",
    kind: "page",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "not-yet",
  },
  {
    id: "sarang-home",
    title: "사랑의교회",
    url: "https://www.sarang.org/",
    kind: "site",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "search-index",
    note: "메인 공지에서 행사명·기간·시간을 확인.",
  },
  {
    id: "sarang-special-sermons",
    title: "특별집회 설교 목록",
    url: "https://www.sarang.org/tv/sermon.asp?sflag=special",
    kind: "sermon-index",
    publisher: "사랑의교회",
    tier: "A",
    checkedAt: CHECKED,
    method: "search-index",
    note: "2026-10-19 김철수 「율법이 못하는 것을 하시는 능력의 하나님」, 오스 기니스 「우리 세대에 하나님을 잘 섬깁시다」 게시 확인.",
  },
  {
    id: "newsletter-1019",
    title: "가을 특새 뉴스레터 — 10월 19일",
    url: "https://data.godpia.com/webfile/gongji/down/1019%20%EA%B0%80%EC%9D%84%EB%A0%88%ED%84%B0%20%EA%B5%AD%EB%AC%B8%20%EB%82%B1%EC%9E%A5.pdf",
    kind: "newsletter",
    publisher: "사랑의교회",
    tier: "A",
    publishedOn: "2026-10-19",
    checkedAt: CHECKED,
    method: "user-supplied",
    note: "원문 PDF 직접 열람 대기. 수록 내용은 운영자 제공값.",
  },
  {
    id: "newsletter-1020",
    title: "가을 특새 뉴스레터 — 10월 20일",
    url: "https://data.godpia.com/webfile/gongji/down/1020%20%EA%B0%80%EC%9D%84%EB%A0%88%ED%84%B0%20%EB%82%B1%EC%9E%A5.pdf",
    kind: "newsletter",
    publisher: "사랑의교회",
    tier: "A",
    publishedOn: "2026-10-20",
    checkedAt: CHECKED,
    method: "user-supplied",
    note: "10월 20일 설교와 10월 21일 예정 설교 수록(운영자 제공값). 원문 PDF 직접 열람 대기.",
  },
  {
    id: "bskorea",
    title: "대한성서공회 온라인 성경 — 개역개정",
    url: "https://www.bskorea.or.kr/bible/korbibReadpage.php",
    kind: "bible",
    publisher: "대한성서공회",
    tier: "B",
    checkedAt: CHECKED,
    method: "not-yet",
    note: "성경 본문 전문은 이 출처로 연결하고, 본 사이트는 핵심 구절 1절 이내만 인용한다.",
  },
];

export const sourceById = (id: string) => sources.find((s) => s.id === id);
