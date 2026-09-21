import type { LucideIcon } from "lucide-react";

export function KpiCard({
  title,
  value,
  helper,
  helperClassName,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  helper: string;
  helperClassName?: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white p-4 shadow-soft xl:p-5">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 truncate text-[22px] font-bold tracking-tight text-slate-900">{value}</p>
          <p className={`mt-2 text-xs ${helperClassName ?? "text-slate-500"}`}>{helper}</p>
        </div>
      </div>
    </div>
  );
}
