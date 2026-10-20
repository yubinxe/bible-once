# DESIGN SYSTEM — Sacred Editorial

Sacred Minimalism · Quiet Reverence · Editorial Modernism · Architectural Restraint · Cinematic Dawn.
토큰 원본: `app/globals.css` `@theme`.

## Color (프로젝트 제안 팔레트 — 교회 공식 컬러 아님)
| 토큰 | 값 | 용도 | 대비 |
| --- | --- | --- | --- |
| canvas | #F7F4EE | 기본 배경 | — |
| paper | #FFFDF9 | 읽기 면 | — |
| navy | #1F2B3B | 집중·정숙 섹션 | — |
| night | #141C27 | Hero 상단 | — |
| ink | #282727 | 본문 | 13.6:1 on canvas |
| burgundy | #783B49 | 경건한 강조·관계어 | 7.6:1 |
| gold | #B59A72 | 장식·어두운 면 위 eyebrow | 5.3:1 on navy · **2.4:1 on canvas → 장식 전용** |
| sand | #E9DDCD | 어두운 면 위 텍스트·하이라이트 | 10.7:1 on navy |
| stone | #8D8982 | 화살표 등 비텍스트 | 3.2:1 → 텍스트 금지 |
| stone-deep | #66625B | 캡션·메타 | 5.5:1 |
그라디언트는 Hero의 새벽 수평선 하나만 허용. 네온·글로우·글래스 금지. Gold와 Burgundy를 한 요소에 병용하지 않는다.

## Typography
- 한글 Display: Noto Serif KR 600 (본문 인용 400) · 영문 Display: Cormorant Garamond 500–600 · 본문: Pretendard Variable. 모두 SIL OFL.
- Scale(clamp, mobile→desktop): Hero 36→72 · H1 32→48 · H2 28→36 · H3 22→26 · Body 16→17 · Scripture 20→23 · Caption 13.
- Line-height: 본문 1.7 · 성경 1.85. Measure 62–72ch(`.measure` 68ch).
- 자간: 한글은 기본값(−0.015em 이내). 넓은 트래킹은 영문 eyebrow에만.
- `word-break: keep-all`로 한글 어절 단위 줄바꿈.

## Layout
- 12-col · max 1240 · gutter 20(모바일)/40(데스크톱) · 섹션 간격 112–144.
- 섹션 패턴: 좌측 3열 eyebrow / 우측 8–9열 본문(`md:ml-[25%]`).
- 카드 대신 괘선(rule)·여백·타이포로 위계를 만든다. radius는 2px(hair) 하나.

## Motion
- Hover 150–200ms · 전환 250–400ms · `--ease-reverent`.
- Chapel Gate: 0.2s 캡션 → 0.95s 문 열림(1.9s) → 2.35s 포털 확대 → 3.0s 페이드. 순수 CSS, 세션당 1회, `prefers-reduced-motion` 시 생략.
- Ascent(사용자 요청, 2026-10-20): 스크롤할수록 어둠에서 빛으로 오른다.
  - 관성 스크롤 `lenis`(lerp 0.075, 터치는 네이티브).
  - Hero: `--ascend`(0→1)로 문구가 떠오르며 옅어지고 새벽빛이 밝아짐, 하단 22vh가 canvas로 녹아듦, 빛 입자(canvas, 화면 밖·숨김 탭에서 정지).
  - 섹션: `[data-reveal]` — opacity·translate 28px·blur 6px → 선명(1.2–1.4s). 그리드 컨테이너 단위로만 적용.
  - `.celestial`: 고정 배경의 옅은 빛줄기 3개, 38s/53s로 ±4° 흔들림.
  - 모두 `prefers-reduced-motion`에서 해제. 바운스 없음. 읽기 화면에는 플로팅 CTA 없음, 2px 진행선만.

## Components
`SectionHead` · `DayTimeline` · `FlowMap`(argument-map / thematic-progression / narrative-sequence / literary-structure) · `RecallList` · `Distinguish` · `OneSentence` · `Journal` · `VStatus`/`RStatus`(기호+글자로 상태 구분, 색은 보조).
