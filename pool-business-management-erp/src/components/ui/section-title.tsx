import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "./cx";

export function SectionTitle({
  icon,
  title,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cx("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-water-600">{icon}</span>}
        <h3 className="text-[15px] font-extrabold tracking-tight text-ink-900">
          {title}
        </h3>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-[13px] font-bold text-water-600 transition hover:text-water-700"
        >
          {action.label}
          <ChevronRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
