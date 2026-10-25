# CLAUDE.md — THE DAWN

독립 Scripture Companion for 사랑의교회 제24차 가을 글로벌 특새(2026.10.19–24). 교회 공식 서비스 아님.

## 명령
- `npm run dev` / `npm run build`
- `npm run typecheck` · `npm run lint` · `npm run validate:content` · `npm run test:e2e`
- `npm run sync:sources [-- --only=id1,id2]` — 공식 공개 페이지 변경 감지(보고서만 생성)
- `npm run transcribe [-- --id=… --url=… --force]` — 설교 영상 자막 → Claude 요약·인사이트(`yt-dlp`, `ANTHROPIC_API_KEY` 필요). Actions `Sermon Transcribe`가 특새 기간 하루 2회 자동 실행

## 반드시 지킬 것
- 공식 데이터는 `content/` 에만, 출처(`sourceIds`)와 상태(`status`) 필수. 모르면 `pending` — 임의 생성 금지.
- 설교 노트(`content/sermon-notes/`)는 공식 영상 자막 전사 → `npm run transcribe`로만 만든다. ‘AI 전사 요약 · 검수 전’ 표시와 원본 영상 타임스탬프 없이 게시 금지. 전사 원문은 커밋·게시 금지(`data/transcripts/` gitignore). 본문 연구는 ‘편집 해설’로 표시.
- 해설의 `review`를 사람 검수 없이 `reviewed`로 올리지 않는다.
- 성경 인용은 개역개정 1절 이내. 영상·뉴스레터 전문 재배포 금지.
- 개인 묵상은 localStorage에만. 서버 전송 코드 추가 금지.
- 날짜·시즌 검증: 봄 특새 데이터 혼입 주의.

## 디자인
`docs/DESIGN_SYSTEM.md` 토큰만 사용. 카드 남발·과한 radius·그라디언트·글로우 금지. 작은 텍스트에 gold/stone 금지(stone-deep 사용). UI 변경 후 1440·768·390 렌더 확인.

## 문서
docs/PRODUCT · SOURCE_REGISTRY · DESIGN_SYSTEM · CONTENT_GUIDELINES · ARCHITECTURE · DECISIONS

## 보고 원칙
- 사용자에게 보이는 설명·보고는 한국어. 명령어·경로·코드 식별자·고유명사·링크만 원문.
- 결론 먼저, 기본 5줄 이내. 단계 중계·긴 로그 금지(요청 시에만). 정확성이 간결성보다 우선.
- 최종 보고 형식(해당 없는 항목 생략): 결론(완료·일부 완료·보류) / 검증(통과·미검증) / 위험 / 다음 행동(사용자 몫만) / 링크.
- 명확히 지시된 작업은 자율 구현·검증. 기존 코드 먼저 확인. 추측을 사실로 보고하지 않는다.
- PR 병합·운영 배포: 사용자 상시 승인(2026-10-20). CI 통과 확인 후 묻지 말고 바로 병합한다.

## Vercel 운영 메모
- 프로젝트 `bible-once`(prj_uhpLKOHXkt5I8MfHiYfzFsaoyZZG), 팀 `team_YcEQ5kSM2V6IFnmpMGAz5zd6`. Production 브랜치 `main`, PR마다 Preview 자동 생성.
- Vercel MCP는 `teamId` 없이 호출해야 결과가 나온다(teamId 지정 시 빈 목록). 권한 오류 시 `authorize_team_access` 링크를 사용자에게 전달.
- 이 개발 환경은 `*.vercel.app`·`api.vercel.com` 접속이 막혀 있다. 배포 결과 확인은 PR의 Vercel 체크·봇 댓글로 한다.
- 알림 최소화: `vercel.json`의 `github.silent`로 PR 봇 댓글을 끈다. 예약 워크플로는 시크릿이 없으면 실패 대신 건너뛴다(실패 메일 방지).
- MCP의 배포 파일 내용 조회는 약 3,000자에서 잘린다. 소스 백업·이전에 쓰지 말 것(`VERCEL_TOKEN` + `api.vercel.com` 허용 필요).
