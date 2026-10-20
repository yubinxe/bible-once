# SOURCE REGISTRY

코드상 원본: `content/sources.ts`. 이 문서는 운영 절차와 현재 확인 현황을 기록한다.

## 신뢰 등급
- **A** 사랑의교회 운영 도메인, 공식 뉴스레터
- **B** 공신력 있는 외부 기관(대한성서공회)
- **C** 사용자 제공·미대조

## 확인 방법(method)
`direct` 원문 직접 열람 · `search-index` 공식 페이지 검색 색인 대조 · `user-supplied` 운영자 제공 · `not-yet` 미열람

## 확인 현황 (2026-10-20 10:40 KST)
| 항목 | 값 | 상태 | 근거 |
| --- | --- | --- | --- |
| 행사 | 제24차 가을 글로벌 특별새벽부흥회 | verified | sarang.org 메인 색인 |
| 기간·시간 | 10.19(월)–24(토), 평일 04:30 · 토 05:30 | verified | sarang.org · revival 색인 |
| 10.19 설교 1 | 김철수(GMS 순회선교사) · 율법이 못하는 것을 하시는 능력의 하나님 · 히 10:10–20 | verified | revival 색인 + 특별집회 설교 목록 |
| 10.19 설교 2 | 오스 기니스 · 우리 세대에 하나님을 잘 섬깁시다 · 행 13:36 | verified | 특별집회 설교 목록 색인 |
| 10.20 설교 1·2 | 김바나바 · 시 142:1–5 / 마이크 리브스 · 시 50:12–15 | newsletter | 10.20 뉴스레터(운영자 제공) |
| 10.21 예정 | 이용규 · 왕하 25:27–30 / 데이비드 가너 · 시 119:169–176 | scheduled | 10.20 뉴스레터(운영자 제공) |
| 일별 주제 6종 | 영적 전쟁 · 은혜 · 신앙 계승 · 치유 · 사명 · 깊은 말씀·높은 찬양 | newsletter | 운영자 제공, 웹 대조 대기 |
| 10.22–24 설교 | — | pending | 공식 업데이트 대기 |
| 공동 기도제목 · 찬양 | — | pending | 공식 업데이트 대기 |
| 강사 소속(김철수 외) · 현장/영상 구분 | — | pending | 공식 확인 전 미기재 |

## 알려진 제약
- 본 개발 환경의 네트워크 정책이 `revival.sarang.org`, `globalrevival.sarang.org`, `www.sarang.org`, `data.godpia.com`을 차단해 **원문 직접 열람을 하지 못했다.** 위 verified는 검색 색인에 노출된 공식 페이지 내용 기준이다.
- 검색 색인에는 2026 봄 특새(제24차 봄, 4월) 일정이 함께 노출된다. 봄 주제(성령·대각성·사명·통일·믿음의 세대 계승 등)와 혼동하지 말 것. `validate:content`는 행사 기간 밖 날짜를 거부한다.

## 갱신 절차
1. **자동 감지** — `Source Sync` 워크플로(특새 기간 하루 2회)가 robots.txt 준수·2초 간격·ETag/Last-Modified/SHA-256으로 변경을 감지하고 보고서를 남긴다. 자동 게시하지 않는다.
2. **수동 실행** — GitHub Actions › Source Sync › Run workflow (`only`에 source id 지정 가능). 로컬: `npm run sync:sources`.
3. **수동 보완** — 크롤링이 불가능한 자료는 원문을 사람이 열람한 뒤 `content/sources.ts`에 URL·`publishedOn`·`checkedAt`·`method`를 기록하고 `content/sermons.ts`·`content/event.ts`의 상태를 올린다.
4. **검증** — `npm run validate:content` 통과 후 PR. 공식 값이 바뀌면 status를 `changed`로 두고 연관 해설의 review를 `needs-review`로 되돌린다.
