"use client";
import Link from "next/link";
import { Waves } from "lucide-react";
export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/inicio" className="flex items-center gap-2.5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
        style={{
          background: "linear-gradient(145deg,#363639,#171719)",
          boxShadow: "0 10px 20px -8px rgba(13,132,192,.6), inset 0 1px 0 rgba(255,255,255,.5)",
        }}
      >
        <Waves size={21} strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block text-[19px] font-extrabold tracking-tight text-ink-950">
          Pool<span className="text-water-600">Control</span>
        </span>
        {!compact && (
          <span className="mt-1 block text-[8.5px] font-bold tracking-[0.32em] text-ink-300">
            GESTÃO QUE FLUI
          </span>
        )}
      </span>
    </Link>
  );
}
