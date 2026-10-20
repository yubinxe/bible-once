# CLAUDE.md — THE DAWN

독립 Scripture Companion for 사랑의교회 제24차 가을 글로벌 특새(2026.10.19–24). 교회 공식 서비스 아님.

## 명령
- `npm run dev` / `npm run build`
- `npm run typecheck` · `npm run lint` · `npm run validate:content` · `npm run test:e2e`
- `npm run sync:sources [-- --only=id1,id2]` — 공식 공개 페이지 변경 감지(보고서만 생성)

## 반드시 지킬 것
- 공식 데이터는 `content/` 에만, 출처(`sourceIds`)와 상태(`status`) 필수. 모르면 `pending` — 임의 생성 금지.
- 설교 요약은 공식 원문 확인 + 사람 검수 후에만. 본문 연구는 ‘편집 해설’로 표시.
- 해설의 `review`를 사람 검수 없이 `reviewed`로 올리지 않는다.
- 성경 인용은 개역개정 1절 이내. 영상·뉴스레터 전문 재배포 금지.
- 개인 묵상은 localStorage에만. 서버 전송 코드 추가 금지.
- 날짜·시즌 검증: 봄 특새 데이터 혼입 주의.

## 디자인
`docs/DESIGN_SYSTEM.md` 토큰만 사용. 카드 남발·과한 radius·그라디언트·글로우 금지. 작은 텍스트에 gold/stone 금지(stone-deep 사용). UI 변경 후 1440·768·390 렌더 확인.

## 문서
docs/PRODUCT · SOURCE_REGISTRY · DESIGN_SYSTEM · CONTENT_GUIDELINES · ARCHITECTURE · DECISIONS
