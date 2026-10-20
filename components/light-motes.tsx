"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; vy: number; phase: number; sway: number; a: number };

/**
 * 새벽빛 속을 천천히 떠오르는 빛의 입자.
 * 화면 밖이거나 탭이 숨겨지면 멈추고, 움직임 줄이기 설정에서는 그리지 않는다.
 */
export function LightMotes({ count = 42 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;

    const seed = (m: Partial<Mote> = {}): Mote => ({
      x: Math.random() * w,
      y: h * (0.35 + Math.random() * 0.75),
      r: 0.5 + Math.random() * 1.5,
      vy: 0.06 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      sway: 0.15 + Math.random() * 0.35,
      a: 0.25 + Math.random() * 0.5,
      ...m,
    });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(count * Math.min(1, w / 1200 + 0.35));
      motes = Array.from({ length: n }, () => seed());
    };

    const frame = (t: number) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.x += Math.sin(t / 2400 + m.phase) * m.sway * 0.2;
        if (m.y < -8) Object.assign(m, seed({ y: h + 8 }));
        // 위로 오를수록 옅어지고, 천천히 반짝인다
        const life = Math.min(1, m.y / (h * 0.6));
        const twinkle = 0.65 + 0.35 * Math.sin(t / 900 + m.phase * 3);
        const alpha = m.a * life * twinkle;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(255, 246, 228, ${alpha})`);
        g.addColorStop(1, "rgba(233, 221, 205, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    start();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
