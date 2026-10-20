import Link from "next/link";
import { event } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="no-print mt-32 bg-navy text-sand">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-2xl tracking-[0.18em] text-paper">THE DAWN</p>
          <p className="mt-2 text-sm text-sand/80">2026 SaRang Revival Scripture Companion</p>
          <p className="mt-8 max-w-[44ch] text-sm leading-7 text-sand/80">
            {event.title}의 말씀을 이해하고 묵상하도록 돕는 <strong className="font-medium text-paper">독립 학습 프로젝트</strong>입니다.
            사랑의교회의 공식 서비스가 아니며, 교회의 후원이나 승인을 받지 않았습니다.
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <p className="eyebrow text-gold">Navigate</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="link-quiet" href="/revival">특새 여정</Link></li>
            <li><Link className="link-quiet" href="/sermons">말씀 깊이 읽기</Link></li>
            <li><Link className="link-quiet" href="/reflection">기도와 묵상</Link></li>
            <li><Link className="link-quiet" href="/archive">공식자료</Link></li>
            <li><Link className="link-quiet" href="/about">프로젝트 소개 · 고지</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow text-gold">Official</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><a className="link-quiet" href="https://revival.sarang.org/" rel="noopener" target="_blank">사랑의교회 특별새벽부흥회 ↗</a></li>
            <li><a className="link-quiet" href="https://globalrevival.sarang.org/" rel="noopener" target="_blank">글로벌 특새 ↗</a></li>
            <li><a className="link-quiet" href="https://www.sarang.org/" rel="noopener" target="_blank">사랑의교회 ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-sand/15 py-6 text-xs text-sand/60 sm:flex-row sm:justify-between">
        <p>성경 인용: 개역개정판 핵심 구절 1절 이내 · 전문은 대한성서공회 온라인 성경으로 연결합니다.</p>
        <p>개인 묵상 기록은 이 기기에만 저장됩니다.</p>
      </div>
    </footer>
  );
}
