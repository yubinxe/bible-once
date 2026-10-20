# ARCHITECTURE

```
Source Layer        content/sources.ts  ←  scripts/sync-sources.ts  ←  .github/workflows/sync-sources.yml
   (출처·메타)                               Discovery→Fetch→Parse→Normalize→Validate→(사람)Publish
Content Layer       content/event.ts · content/sermons.ts   ⇐ lib/schema.ts (zod)   ⇐ scripts/validate-content.ts
   (검증된 데이터·해설)
Presentation Layer  app/ (Next.js App Router, RSC)  ·  components/  ·  lib/content.ts(조회·포맷)
   (홈·여정·본문 연구·묵상)                     client: chapel-gate, site-header, recall, journal, reading-progress
```

- **Stack**: Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4(`@theme` 토큰) · zod · Playwright. 외부 UI 라이브러리 없음(shadcn/ui·Motion은 필요해질 때 도입 — DECISIONS 참조).
- **렌더링**: 일·설교 페이지 SSG, 홈·여정 ISR 30분(‘오늘’ 판정, Asia/Seoul), `/reflection`은 searchParams로 동적.
- **상태**: 서버 DB 없음. 개인 기록은 `localStorage`(`dawn:journal:<date>`, `dawn:sentence:<sermonId>`), 입장 여부 `sessionStorage`(`dawn:entered`). Supabase는 계정·동기화가 필요해질 때 도입.
- **변경 이력**: 콘텐츠는 Git이 이력이다. 출처 변경은 sync 보고서 → PR로 반영. 공식 값 변경 시 `changed` + 해설 `needs-review`.
- **품질 게이트(CI)**: typecheck → lint → validate:content → build → e2e(1440·390).
