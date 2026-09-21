import { monthLabel, brlCompact } from "@/lib/format";
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function AreaChart({
  data,
  data2,
  id,
  height = 230,
  format,
}: {
  data: number[];
  data2?: number[];
  id: string;
  height?: number;
  format?: (v: number) => string;
}) {
  const W = 760,
    H = height,
    pad = 8;
  const max = Math.max(...data, ...(data2 ?? [0])) * 1.15 || 1;
  const step = (W - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => ({
    x: pad + i * step,
    y: H - 26 - (v / max) * (H - 50),
  }));
  const pts2 = data2?.map((v, i) => ({
    x: pad + i * step,
    y: H - 26 - (v / max) * (H - 50),
  }));
  const line = smoothPath(pts);
  const line2 = pts2 ? smoothPath(pts2) : "";
  const area = `${line} L ${pts[pts.length - 1].x} ${H - 26} L ${pts[0].x} ${H - 26} Z`;
  const labels = data.map((_, i) => i);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159bd8" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#159bd8" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#45bce9" />
          <stop offset="100%" stopColor="#0d84c0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={pad}
          x2={W - pad}
          y1={(H - 26) * f + 6}
          y2={(H - 26) * f + 6}
          stroke="#113a5e"
          strokeOpacity="0.07"
          strokeDasharray="3 5"
        />
      ))}
      <path d={area} fill={`url(#${id}-fill)`} />
      <path
        d={line}
        fill="none"
        stroke={`url(#${id}-line)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {line2 && (
        <path
          d={line2}
          fill="none"
          stroke="#90abc3"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="#fff"
            stroke="#0d84c0"
            strokeWidth="2.5"
          >
            <title>{format ? format(data[i]) : String(data[i])}</title>
          </circle>
        </g>
      ))}
      {labels.map((i) => (
        <text
          key={i}
          x={pts[i].x}
          y={H - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#7c99b5"
        >
          {MONTHS_SHORT[i % MONTHS_SHORT.length]}
        </text>
      ))}
    </svg>
  );
}

const MONTHS_SHORT = [
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
];
