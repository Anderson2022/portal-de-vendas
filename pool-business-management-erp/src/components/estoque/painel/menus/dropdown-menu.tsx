"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type DropdownMenuProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function DropdownMenu({
  label,
  open,
  onToggle,
  children,
}: DropdownMenuProps) {
  return (
    <div className="relative">
      <Button onClick={onToggle}>
        {label}
        <ChevronDown size={14} />
      </Button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[100] grid min-w-64 gap-1 rounded-2xl border border-white/80 bg-[#e5e5e8] p-2 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
