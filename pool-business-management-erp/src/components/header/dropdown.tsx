"use client";
import { Card } from "../ui/card";
export function Dropdown({
  children, onClose, className,
}: {
  children: React.ReactNode; onClose: () => void; className?: string;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[70]" onClick={onClose} />
      <div className={`card fade-up absolute top-[calc(100%+10px)] z-[80] p-2 !rounded-3xl ${className ?? ""}`}>
        {children}
      </div>
    </>
  );
}
