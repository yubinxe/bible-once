"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/revival", label: "특새 여정" },
  { href: "/sermons", label: "말씀 깊이 읽기" },
  { href: "/reflection", label: "기도와 묵상" },
  { href: "/archive", label: "공식자료" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 경로가 바뀌면 모바일 메뉴를 닫는다 (렌더 중 상태 조정)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const dark = onHero && !scrolled && !open;

  return (
    <header
      className={[
        "no-print top-0 z-50 transition-colors duration-300",
        onHero ? "fixed inset-x-0" : "sticky",
        dark ? "bg-transparent text-paper" : "bg-canvas/95 text-ink backdrop-blur-sm",
        scrolled ? "shadow-[0_1px_0_var(--color-rule)]" : "",
      ].join(" ")}
    >
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" className="group flex items-baseline gap-3" aria-label="THE DAWN 홈">
          <span className="font-display text-[1.375rem] font-semibold tracking-[0.18em]">THE DAWN</span>
          <span className={`hidden text-[0.75rem] tracking-[0.02em] sm:inline ${dark ? "text-sand/80" : "text-stone-deep"}`}>
            깊은 말씀, 새로운 새벽
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[0.9375rem]">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 transition-opacity duration-200 hover:opacity-100 ${active ? "opacity-100" : "opacity-75"}`}
                  >
                    {n.label}
                    {active && <span className="absolute inset-x-0 -bottom-0.5 h-px bg-current" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
          <span aria-hidden className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-200 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-200 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="모바일 메뉴" className="wrap border-t border-rule pb-8 md:hidden">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.href} className="border-b border-rule">
                <Link href={n.href} className="flex items-baseline gap-4 py-5">
                  <span className="numeral text-stone-deep text-sm">0{i + 1}</span>
                  <span className="display-ko text-xl">{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
