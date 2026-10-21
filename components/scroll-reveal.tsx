"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STEP_MS = 140;
const MAX_STAGGER_MS = 1100;

/**
 * [data-reveal] 요소가 화면에 들어올 때 빛이 번지듯 드러나게 한다.
 * 같은 순간에 들어온 요소들은 위에서 아래, 왼쪽에서 오른쪽 순서로 하나씩 떠오른다.
 * 숨김 상태는 html.js 아래에서만 적용되므로 스크립트가 실패해도 콘텐츠는 보인다.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target as HTMLElement, rect: e.boundingClientRect }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
        entering.forEach(({ el }, i) => {
          const delay = Math.min(i * STEP_MS, MAX_STAGGER_MS);
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.setAttribute("data-revealed", "");
          io.unobserve(el);
          // 드러난 뒤에는 지연을 지워 hover 등 이후 전환이 늦지 않게 한다
          window.setTimeout(() => el.style.removeProperty("--reveal-delay"), delay + 1800);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
