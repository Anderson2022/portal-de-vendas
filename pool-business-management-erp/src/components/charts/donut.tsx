import { monthLabel, brlCompact } from "@/lib/format";
export function Donut({
  parts, size = 168, centerLabel, centerValue,
}: {
  parts: { label: string; value: number; color: string }[];
  size?: number; centerLabel?: string; centerValue?: string;
}) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const r = 62, cx2 = 84, cy = 84, C = 2 * Math.PI * r;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 168 168" role="img">
        <circle cx={cx2} cy={cy} r={r} fill="none" stroke="rgba(17,58,94,.08)" strokeWidth="17" />
        {parts.map((p, i) => {
          const frac = p.value / total;
          const dash = `${Math.max(0, frac * C - 4)} ${C}`;
          const accumulated = parts.slice(0, i).reduce((sum, part) => sum + part.value, 0) / total;
          const offset = -accumulated * C + C * 0.25;
          return (
            <circle
              key={i} cx={cx2} cy={cy} r={r} fill="none"
              stroke={p.color} strokeWidth="17" strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={offset}
              style={{ transition: "stroke-dasharray .8s ease" }}
            >
              <title>{`${p.label}: ${Math.round(frac * 100)}%`}</title>
            </circle>
          );
        })}
        <text x={cx2} y={cy - 4} textAnchor="middle" fontSize="21" fontWeight="800" fill="#113a5e">{centerValue}</text>
        <text x={cx2} y={cy + 15} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#7c99b5">{centerLabel}</text>
      </svg>
      <div className="space-y-2.5">
        {parts.map((p, i) => (
          <div key={i} className="flex items-center gap-2.5 text-[13px]">
            <span className="h-3 w-3 rounded-full" style={{ background: p.color, boxShadow: `0 2px 6px -1px ${p.color}88` }} />
            <span className="font-semibold text-ink-700">{p.label}</span>
            <span className="font-extrabold text-ink-900 tabular-nums">{Math.round((p.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

