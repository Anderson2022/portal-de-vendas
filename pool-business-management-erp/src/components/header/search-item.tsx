"use client";
import { Button } from "../ui/button";
export function Item({ title, sub, onClick }: { title: string; sub?: string; onClick: () => void }) {
  return (
    <Button variant="unstyled" type="submit"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-water-50"
    >
      <span className="truncate text-[13.5px] font-bold text-ink-900">{title}</span>
      {sub && <span className="ml-3 shrink-0 text-[12px] font-medium text-ink-300">{sub}</span>}
    </Button>
  );
}
