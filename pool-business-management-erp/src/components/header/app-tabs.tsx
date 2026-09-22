"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
type Tab = { href: string; label: string };
const labels: Record<string, string> = {
  "categoria-plano-contas": "Categoria / plano",
  "centros-custo": "Centro de custo",
  "projetos-unidades": "Projeto / unidade",
  "naturezas-financeiras": "Natureza financeira",
  "contas-previstas": "Conta prevista",
  "formas-pagamento": "Forma de pagamento",
  "favorecidos-pix": "Favorecido / PIX",
};
export function AppTabs() {
  const pathname = usePathname(),
    [tabs, setTabs] = useState<Tab[]>([]);
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("poolcontrol:app-tabs") || "[]",
    ) as Tab[];
    const slug = pathname.match(/^\/ajustes\/financeiro\/([^/]+)$/)?.[1];
    const current = slug
      ? { href: pathname, label: labels[slug] || slug }
      : null;
    const next = current
      ? [...new Map([...saved, current].map((tab) => [tab.href, tab])).values()]
      : saved;
    setTabs(next);
    localStorage.setItem("poolcontrol:app-tabs", JSON.stringify(next));
  }, [pathname]);
  if (!tabs.length) return null;
  function close(href: string) {
    const next = tabs.filter((tab) => tab.href !== href);
    setTabs(next);
    localStorage.setItem("poolcontrol:app-tabs", JSON.stringify(next));
  }
  return (
    <nav className="hidden max-w-[520px] flex-1 gap-1 overflow-x-auto lg:flex">
      {tabs.map((tab) => (
        <div
          key={tab.href}
          className={`flex min-w-32 items-center rounded-t-xl px-3 py-2 text-xs font-bold ${pathname === tab.href ? "bg-[#1b1d22] text-white" : "bg-slate-300 text-slate-700"}`}
        >
          <Link href={tab.href} className="min-w-0 flex-1 truncate">
            {tab.label}
          </Link>
          <button
            type="button"
            className="ml-2"
            onClick={() => close(tab.href)}
            aria-label={`Fechar ${tab.label}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </nav>
  );
}
