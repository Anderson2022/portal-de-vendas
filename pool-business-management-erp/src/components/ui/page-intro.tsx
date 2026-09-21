import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageIntro({
  crumbs,
  title,
  subtitle,
  right,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="fade-up">
      <nav className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-300">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-ink-300/70" />}
            {c.href ? (
              <Link href={c.href} className="transition hover:text-water-600">
                {c.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "text-ink-500" : ""}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[42px] leading-[1.05] text-ink-950">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[15px] font-medium text-ink-500">
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
    </div>
  );
}
