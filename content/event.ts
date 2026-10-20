import type { Day, Event, Speaker } from "@/lib/schema";

export const event: Event = {
  id: "2026-fall",
  title: "제24차 가을 글로벌 특별새벽부흥회",
  titleEn: "The 24th Global Special Dawn Revival · Autumn 2026",
  edition: 24,
  season: "fall",
  year: 2026,
  start: "2026-10-19",
  end: "2026-10-24",
  venue: "사랑의교회 본당 및 각 예배실",
  timezone: "Asia/Seoul",
  sourceIds: ["sarang-home", "revival-home"],
};

export const speakers: Speaker[] = [
  { id: "kim-cheolsu", name: "김철수", affiliation: "GMS 순회선교사", delivery: "unknown" },
  { id: "os-guinness", name: "오스 기니스", nameEn: "Os Guinness", delivery: "unknown" },
  { id: "kim-barnabas", name: "김바나바", delivery: "unknown" },
  { id: "mike-reeves", name: "마이크 리브스", nameEn: "Michael Reeves", delivery: "unknown" },
  { id: "lee-yonggyu", name: "이용규", delivery: "unknown" },
  { id: "david-garner", name: "데이비드 가너", nameEn: "David Garner", delivery: "unknown" },
];

export const speakerById = (id: string) => speakers.find((s) => s.id === id);

/**
 * 일별 주제는 운영자 제공값(뉴스레터 기준)이다.
 * 공식 일정 페이지와 직접 대조되면 themeStatus를 verified로 올린다.
 */
export const days: Day[] = [
  {
    date: "2026-10-19",
    index: 1,
    weekday: "월",
    theme: "영적 전쟁",
    themeStatus: "newsletter",
    motif: "깨어 있음",
    motifEn: "Vigil",
    startsAt: "04:30",
    prayerTopics: [],
    hymns: [],
    insight: {
      concept: "성화",
      conceptEn: "Sanctification",
      definition:
        "하나님께서 죄인을 그리스도와 연합시켜 거룩한 백성으로 구별하시고, 성령으로 그 삶을 실제로 거룩하게 빚어 가시는 일.",
      links: [
        {
          sermonId: "2026-10-19-kim-cheolsu",
          body: "히브리서 10장은 거룩함의 근거를 우리의 반복된 노력이 아니라 그리스도의 ‘단번의’ 제사에 둔다. 10절은 이미 이루어진 신분을 말하고, 14절의 ‘거룩하게 된 자들’은 헬라어 현재분사(ἁγιαζομένους)로서 ‘거룩하게 되어 가는 자들’이라는 진행의 의미도 함께 품는다.",
        },
        {
          sermonId: "2026-10-19-os-guinness",
          body: "사도행전 13:36의 다윗은 ‘자기 세대에’ 하나님의 뜻을 섬긴 사람이다. 성화는 개인의 내면에서 끝나지 않고, 주어진 시대 속의 소명으로 드러난다.",
        },
      ],
      review: "needs-review",
    },
    sourceIds: ["revival-home", "sarang-special-sermons", "newsletter-1019"],
  },
  {
    date: "2026-10-20",
    index: 2,
    weekday: "화",
    theme: "은혜",
    themeStatus: "newsletter",
    motif: "피난처",
    motifEn: "Refuge",
    startsAt: "04:30",
    prayerTopics: [],
    hymns: [],
    insight: {
      concept: "은혜",
      conceptEn: "Grace",
      definition:
        "받을 자격이 없는 자에게 하나님께서 값없이 베푸시는 호의. 성경에서 은혜의 정점은 하나님께서 자기 자신을 주시는 데 있다.",
      links: [
        {
          sermonId: "2026-10-20-kim-barnabas",
          body: "시편 142편의 다윗은 아무도 자신을 알아보지 않는 자리에서 ‘주는 나의 피난처시요 나의 분깃’이라고 고백한다. 은혜는 상황의 변화보다 먼저 하나님 자신을 소유하는 것으로 경험된다.",
        },
        {
          sermonId: "2026-10-20-mike-reeves",
          body: "시편 50편의 하나님은 아무것도 필요로 하지 않으신다. 그러므로 예배는 하나님께 무엇을 보태는 거래가 아니라, 부르짖는 자를 건지시는 은혜에 감사로 응답하는 일이 된다.",
        },
      ],
      review: "needs-review",
    },
    sourceIds: ["newsletter-1020"],
  },
  {
    date: "2026-10-21",
    index: 3,
    weekday: "수",
    theme: "신앙 계승",
    themeStatus: "newsletter",
    motif: "계승",
    motifEn: "Covenant",
    startsAt: "04:30",
    prayerTopics: [],
    hymns: [],
    insight: {
      concept: "언약",
      conceptEn: "Covenant",
      definition:
        "하나님께서 스스로 약속하시고 그 약속에 자신을 매어 두시는 관계. 인간의 실패가 언약의 끝이 되지 못하는 이유가 여기에 있다.",
      links: [
        {
          sermonId: "2026-10-21-lee-yonggyu",
          body: "열왕기하는 예루살렘 멸망 뒤 다윗의 후손 여호야긴이 풀려나는 장면으로 끝난다. 사무엘하 7장의 다윗 언약이 나라의 멸망 속에서도 끊어지지 않았다는 조용한 신호다.",
        },
        {
          sermonId: "2026-10-21-david-garner",
          body: "시편 119편의 마지막 연은 말씀을 사랑하는 자가 ‘잃은 양’처럼 길을 잃었다고 고백하며 끝난다. 언약의 계승은 완벽한 세대가 아니라 말씀을 붙들고 기도하는 세대를 통해 이어진다.",
        },
      ],
      review: "needs-review",
    },
    sourceIds: ["newsletter-1020"],
  },
  {
    date: "2026-10-22",
    index: 4,
    weekday: "목",
    theme: "치유",
    themeStatus: "newsletter",
    motif: "회복",
    motifEn: "Restoration",
    startsAt: "04:30",
    prayerTopics: [],
    hymns: [],
    sourceIds: [],
  },
  {
    date: "2026-10-23",
    index: 5,
    weekday: "금",
    theme: "사명",
    themeStatus: "newsletter",
    motif: "보냄",
    motifEn: "Mission",
    startsAt: "04:30",
    prayerTopics: [],
    hymns: [],
    sourceIds: [],
  },
  {
    date: "2026-10-24",
    index: 6,
    weekday: "토",
    theme: "깊은 말씀·높은 찬양",
    themeStatus: "newsletter",
    motif: "송영",
    motifEn: "Doxology",
    startsAt: "05:30",
    prayerTopics: [],
    hymns: [],
    sourceIds: [],
  },
];

export const dayByDate = (date: string) => days.find((d) => d.date === date);
