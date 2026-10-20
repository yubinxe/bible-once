/**
 * Hero 배경 — 새벽의 수평선과 건축적 수직 리듬.
 * 유리 외벽의 멀리언, 곡면 매스, 시계탑과 십자가를 선으로만 추상화한 독창 일러스트레이션.
 * 실제 교회 사진으로 오인되지 않도록 사실적 묘사를 피한다.
 */
export function DawnHorizon() {
  const mullions = Array.from({ length: 34 }, (_, i) => i);
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c27" />
          <stop offset="0.6" stopColor="#1f2b3b" />
          <stop offset="0.9" stopColor="#2e3644" />
          <stop offset="1" stopColor="#5d5550" />
        </linearGradient>
        <radialGradient id="dawn" cx="0.68" cy="1.02" r="0.55">
          <stop offset="0" stopColor="#e9ddcd" stopOpacity="0.42" />
          <stop offset="0.4" stopColor="#b59a72" stopOpacity="0.12" />
          <stop offset="1" stopColor="#b59a72" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="glassMask">
          <rect x="0" y="0" width="1440" height="900" fill="url(#fade)" />
        </mask>
      </defs>

      <rect width="1440" height="900" fill="url(#sky)" />
      <rect width="1440" height="900" fill="url(#dawn)" />

      {/* 곡면 유리 매스 — 수직 멀리언 */}
      <g mask="url(#glassMask)" stroke="#e9ddcd" strokeOpacity="0.14" strokeWidth="1">
        {mullions.map((i) => {
          const x = 760 + i * 20;
          const top = 520 - Math.sin((i / 33) * Math.PI) * 120;
          return <line key={i} x1={x} y1={top} x2={x} y2={900} />;
        })}
        <path d="M760 520 Q 1090 280 1420 520" fill="none" strokeOpacity="0.32" />
        <path d="M760 600 Q 1090 400 1420 600" fill="none" strokeOpacity="0.12" />
        <path d="M760 690 Q 1090 520 1420 690" fill="none" strokeOpacity="0.1" />
      </g>

      {/* 시계탑과 십자가 */}
      <g stroke="#b59a72" fill="none">
        <rect x="1208" y="330" width="56" height="570" strokeOpacity="0.45" />
        <circle cx="1236" cy="388" r="15" strokeOpacity="0.55" />
        <line x1="1236" y1="196" x2="1236" y2="330" strokeOpacity="0.7" strokeWidth="1.5" />
        <line x1="1214" y1="234" x2="1258" y2="234" strokeOpacity="0.7" strokeWidth="1.5" />
      </g>

      {/* 수평선 */}
      <line x1="0" y1="860" x2="1440" y2="860" stroke="#e9ddcd" strokeOpacity="0.22" />
    </svg>
  );
}
