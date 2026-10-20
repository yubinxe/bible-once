"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * [data-reveal] 요소가 화면에 들어올 때 빛이 번지듯 드러나게 한다.
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
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
