"use client";
import { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./button";
export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
  height = "h-fit",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      className={`card fixed inset-0 m-auto ${height} max-h-[90vh] w-[calc(100%-2rem)] ${width} overflow-hidden p-0 open:flex open:flex-col backdrop:bg-black/30 backdrop:backdrop-blur-sm`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 bg-[#dedee1] px-6 pb-5 pt-6">
        <h2 id={titleId} className="font-extrabold">
          {title}
        </h2>
        <Button className="!p-2" onClick={onClose} aria-label="Fechar">
          <X size={16} />
        </Button>
      </div>
      <div className="min-h-0 flex-auto overflow-y-auto px-6 pb-6">
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
