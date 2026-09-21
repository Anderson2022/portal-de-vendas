"use client";

export function Group({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-ink-300">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
