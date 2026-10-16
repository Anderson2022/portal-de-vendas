"use client";

import type { MouseEvent, ReactNode } from "react";

export function PdvModuleLink({
  href,
  className,
  children,
  onOpen,
}: {
  href: string;
  className: string;
  children: ReactNode;
  onOpen: () => void;
}) {
  function openModule(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onOpen();
  }

  return (
    <a
      href={href}
      className={className}
      onClick={openModule}
      title="Clique: abrir nesta área. Ctrl + clique: nova aba (⌘ + clique no Mac)."
    >
      {children}
    </a>
  );
}
