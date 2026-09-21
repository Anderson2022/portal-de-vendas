import { monthLabel, brlCompact } from "@/lib/format";
export function HBars({
  items,
  format,
  barClass = "bg-gradient-to-r from-water-400 to-water-600",
}: {
  items: { label: string; value: number; sub?: string }[];
  format?: (v: number) => string;
  barClass?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-bold text-ink-900">
                {it.label}
              </div>
              {it.sub && (
                <div className="text-[11.5px] font-medium text-ink-300">
                  {it.sub}
                </div>
              )}
            </div>
            <div className="text-[13px] font-extrabold text-ink-700 tabular-nums">
              {format ? format(it.value) : it.value}
            </div>
          </div>
          <div className="bar">
            <span
              className={barClass}
              style={{ width: `${Math.max(3, (it.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
