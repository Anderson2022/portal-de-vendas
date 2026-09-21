export function PeriodChip({ label }: { label: string }) {
  return (
    <div className="neu flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12.5px] font-bold text-ink-700">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="text-water-600"
      >
        <rect x="3" y="4" width="18" height="18" rx="4" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      {label}
    </div>
  );
}
