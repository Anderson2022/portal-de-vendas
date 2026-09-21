"use client";
import Link from "next/link";
export function MenuItem({
  icon, label, href, onClick,
}: {
  icon: React.ReactNode; label: string; href: string; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-ink-700 transition hover:bg-water-50 hover:text-water-700"
    >
      {icon}
      {label}
    </Link>
  );
}
