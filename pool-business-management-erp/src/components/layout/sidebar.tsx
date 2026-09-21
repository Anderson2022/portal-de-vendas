"use client";

import {
  ArrowLeft,
  BadgeDollarSign,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BarChart3,
  Boxes,
  Building2,
  CircleDollarSign,
  FileBarChart,
  FileText,
  Gauge,
  Home,
  Landmark,
  ListTree,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

const items = [
  [Gauge, "Visão geral"],
  [BanknoteArrowDown, "Contas a receber"],
  [BanknoteArrowUp, "Contas a pagar"],
  [BarChart3, "Fluxo de caixa"],
  [BadgeDollarSign, "Caixa"],
  [Landmark, "Bancos"],
  [SlidersHorizontal, "Conciliação"],
  [Boxes, "Centros de custo"],
  [ListTree, "Plano de contas"],
  [FileText, "Orçamentos"],
  [CircleDollarSign, "DRE"],
  [FileBarChart, "Relatórios"],
] as const;

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[74px] z-30 hidden w-[220px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
      <div className="px-3 py-5">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
          <Home className="h-4 w-4" /> Início
        </button>
        <p className="mb-2 mt-6 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">FINANCEIRO</p>
        <nav className="space-y-1">
          {items.map(([Icon, label], index) => (
            <button
              key={label}
              className={
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition " +
                (index === 0
                  ? "bg-[#1b1d22] font-medium text-white shadow-lg shadow-slate-900/15"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-3 pb-5">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
          <Settings className="h-4 w-4" /> Configurações
        </button>
        <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </button>
      </div>
    </aside>
  );
}
