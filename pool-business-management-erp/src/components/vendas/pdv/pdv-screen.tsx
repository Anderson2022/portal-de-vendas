"use client";

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";

const PdvInterface = dynamic(
  () => import("./pdv-interface").then((module) => module.PdvInterface),
  {
    ssr: false,
    loading: () => <p role="status">Carregando ponto de venda…</p>,
  },
);

export function PdvScreen() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <PdvInterface key={`${pathname}?${searchParams.toString()}`} />;
}
