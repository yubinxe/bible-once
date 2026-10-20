"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Hero를 벗어나는 동안의 진행도(0→1)를 --ascend 변수로 넘긴다.
 * CSS가 이 값으로 문구를 떠오르게 하고 새벽빛을 밝힌다.
 */
export function HeroAscend({ children, className = "", labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
      el.style.setProperty("--ascend", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
