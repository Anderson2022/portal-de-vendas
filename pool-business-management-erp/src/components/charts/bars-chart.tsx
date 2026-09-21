const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export function BarsChart({
  data, labels, format, id,
}: {
  data: { a: number; b?: number }[]; labels?: string[]; format?: (v: number) => string; id: string;
}) {
  const W = 760, H = 230, padX = 14;
  const max = Math.max(...data.map((d) => Math.max(d.a, d.b ?? 0))) * 1.15 || 1;
  const group = (W - padX * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0d84c0" />
          <stop offset="100%" stopColor="#45bce9" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#12804f" />
          <stop offset="100%" stopColor="#3fd696" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padX} x2={W - padX} y1={(H - 30) * f + 8} y2={(H - 30) * f + 8} stroke="#113a5e" strokeOpacity="0.07" strokeDasharray="3 5" />
      ))}
      {data.map((d, i) => {
        const hA = (d.a / max) * (H - 58);
        const hB = d.b != null ? (d.b / max) * (H - 58) : 0;
        const bw = d.b != null ? group * 0.28 : group * 0.42;
        const cx = padX + i * group + group / 2;
        return (
          <g key={i}>
            <rect x={cx - (d.b != null ? bw + 3 : bw / 2)} y={H - 30 - hA} width={bw} height={hA} rx="6" fill={`url(#${id}-a)`}>
              <title>{format ? format(d.a) : d.a}</title>
            </rect>
            {d.b != null && (
              <rect x={cx + 3} y={H - 30 - hB} width={bw} height={hB} rx="6" fill={`url(#${id}-b)`}>
                <title>{format ? format(d.b) : d.b}</title>
              </rect>
            )}
            <text x={cx} y={H - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c99b5">
              {labels?.[i] ?? MONTHS_SHORT[i % MONTHS_SHORT.length]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
