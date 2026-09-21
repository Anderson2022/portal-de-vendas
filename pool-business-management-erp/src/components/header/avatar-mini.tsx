"use client";

export function AvatarMini({ name }: { name: string }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  const ini = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
      style={{
        background: `linear-gradient(140deg, hsl(${h} 62% 70%), hsl(${h} 68% 44%))`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
      }}
    >
      {ini}
    </span>
  );
}
