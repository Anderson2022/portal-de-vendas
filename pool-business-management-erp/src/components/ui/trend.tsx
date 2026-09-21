import { TrendingUp, TrendingDown } from "lucide-react";

export function Trend({
  value,
  text,
  negative,
}: {
  value: string;
  text: string;
  negative?: boolean;
}) {
  const Icon = negative ? TrendingDown : TrendingUp;
  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
      <span
        className={`flex items-center gap-1 font-bold ${negative ? "text-coral-500" : "text-mint-600"}`}
      >
        <Icon size={13} strokeWidth={2.6} />
        {value}
      </span>
      <span className="text-ink-300">{text}</span>
    </div>
  );
}
