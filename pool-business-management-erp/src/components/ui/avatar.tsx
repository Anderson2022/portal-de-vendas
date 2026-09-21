import { initials } from "@/lib/format";

export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${h} 65% 72%), hsl(${h} 70% 45%))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.55), 0 6px 14px -6px hsl(${h} 70% 40% / .55)`,
      }}
    >
      {initials(name)}
    </div>
  );
}
