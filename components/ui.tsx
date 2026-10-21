import Link from "next/link";
import type { ReactNode } from "react";
import { reviewLabel, sourceById, verificationLabel } from "@/lib/content";
import type { ReviewStatus, VerificationStatus } from "@/lib/schema";

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  id,
  tone = "light",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-sand/75" : "text-stone-deep";
  return (
    <header className="grid gap-6 md:grid-cols-12">
      <div data-reveal className="md:col-span-3">
        <p className={`eyebrow ${tone === "dark" ? "text-gold" : "text-burgundy"}`}>
          {index && <span className="mr-3 numeral tracking-normal">{index}</span>}
          {eyebrow}
        </p>
      </div>
      <div data-reveal className="md:col-span-8">
        <h2 id={id} className="display-ko text-[length:var(--text-h2)]">
          {title}
        </h2>
        {lede && <p className={`mt-5 measure ${muted}`}>{lede}</p>}
      </div>
    </header>
  );
}

const vTone: Record<VerificationStatus, "solid" | "accent" | undefined> = {
  verified: "solid",
  newsletter: undefined,
  scheduled: undefined,
  changed: "accent",
  pending: undefined,
};

export function VStatus({ status, className = "" }: { status: VerificationStatus; className?: string }) {
  return (
    <span className={`status ${className}`} data-tone={vTone[status]}>
      {verificationLabel[status]}
    </span>
  );
}

export function RStatus({ status }: { status: ReviewStatus }) {
  return (
    <span className="status" data-tone={status === "reviewed" ? "solid" : "accent"}>
      {reviewLabel[status]}
    </span>
  );
}

export function SourceNote({ ids, className = "" }: { ids: string[]; className?: string }) {
  const list = ids.map(sourceById).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <p className={`caption ${className}`}>
      출처{" "}
      {list.map((s, i) => (
        <span key={s!.id}>
          {i > 0 && " · "}
          <a className="link-quiet" href={s!.url} target="_blank" rel="noopener">
            {s!.title}
          </a>
        </span>
      ))}
    </p>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  const cls = `inline-flex items-center gap-2 text-[0.9375rem] font-medium link-quiet ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {children} <span aria-hidden>↗</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children} <span aria-hidden className="arrow">→</span>
    </Link>
  );
}

/** 공식 정보가 없을 때 — 임의 생성 대신 대기 상태를 명시한다 */
export function Awaiting({ children = "공식 업데이트 대기" }: { children?: ReactNode }) {
  return <p className="caption italic">— {children}</p>;
}
