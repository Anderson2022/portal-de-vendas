import type { ReactNode } from "react";
import { Card } from "./card";
import { IconTile } from "./icon-tile";
import { Trend } from "./trend";

export function Stat({
  icon,
  label,
  value,
  trend,
  accent,
  delay = 0,
  compact = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: { value: string; text: string; negative?: boolean };
  accent?: ReactNode;
  delay?: number;
  compact?: boolean;
}) {
  return (
    <Card hover className={`fade-up ${compact ? "p-3.5" : "p-5"}`}>
      <div
        className="flex items-start justify-between gap-3"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
          <IconTile>{icon}</IconTile>
          <div>
            <div className="text-[13px] font-semibold text-ink-500">
              {label}
            </div>
            <div className="mt-0.5 text-[22px] font-extrabold tracking-tight text-ink-900 tabular-nums">
              {value}
            </div>
            {trend && <Trend {...trend} />}
            {accent}
          </div>
        </div>
      </div>
    </Card>
  );
}
