"use client";

import { useEffect, useRef } from "react";

/** 첨두 아치 — objectBoundingBox 좌표 (0–1) */
const ARCH = "M0,1 L0,0.4 C0,0.19 0.2,0.045 0.5,0 C0.8,0.045 1,0.19 1,0.4 L1,1 Z";

/**
 * 첫 입장 시 예배당 문이 열리는 장면.
 * 애니메이션은 CSS가 스스로 재생하고(JS 비활성에도 동작), 여기서는
 * 세션 기억 · 건너뛰기 · 포커스 관리만 맡는다.
 */
export function ChapelGate() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => {
      try {
        sessionStorage.setItem("dawn:entered", "1");
      } catch {}
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === el && e.animationName === "gate-out") {
        done();
        el.setAttribute("hidden", "");
      }
    };
    el.addEventListener("animationend", onEnd);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) done();
    return () => el.removeEventListener("animationend", onEnd);
  }, []);

  const skip = () => {
    try {
      sessionStorage.setItem("dawn:entered", "1");
    } catch {}
    document.documentElement.dataset.entered = "1";
  };

  return (
    <div ref={ref} className="gate no-print" role="presentation" onClick={skip}>
      <svg width="0" height="0" aria-hidden className="absolute">
        <clipPath id="gate-arch" clipPathUnits="objectBoundingBox">
          <path d={ARCH} />
        </clipPath>
      </svg>

      <div className="gate-portal" aria-hidden>
        <div className="gate-opening">
          <div className="gate-leaf gate-leaf--l" />
          <div className="gate-leaf gate-leaf--r" />
        </div>
        {/* 석조 문틀 — 두 겹의 가는 선 */}
        <svg className="gate-frame" viewBox="0 0 1 1" preserveAspectRatio="none">
          <path d={ARCH} fill="none" stroke="#9c8562" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          <path
            d={ARCH}
            fill="none"
            stroke="#4a4136"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            transform="translate(-0.035 -0.025) scale(1.07 1.05)"
          />
        </svg>
      </div>

      <div className="gate-caption" aria-hidden>
        <p className="font-display text-[0.8125rem] tracking-[0.42em]">THE DAWN</p>
        <p className="mt-3 font-serif text-[0.9375rem] tracking-[0.04em] text-sand/80">깊은 말씀, 새로운 새벽</p>
      </div>

      <button type="button" className="gate-skip" onClick={skip}>
        바로 입장
      </button>
    </div>
  );
}
