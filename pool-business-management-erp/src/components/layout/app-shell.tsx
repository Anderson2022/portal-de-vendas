"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-40 h-[74px] border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="flex h-full items-center gap-5 px-4 lg:px-6">
          <div className="flex w-[220px] shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#17191d] text-white shadow-soft">
              <span className="text-lg font-black">≋</span>
            </div>
            <div className="leading-none">
              <div className="text-[20px] font-extrabold tracking-tight">Pool<span className="text-sky-500">Control</span></div>
              <div className="mt-1 text-[8px] font-semibold tracking-[0.33em] text-slate-400">GESTÃO QUE FLUI</div>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-[530px] md:block">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-400 shadow-sm">
              <Search className="h-4 w-4" />
              <span className="flex-1">Buscar clientes, pedidos, produtos, OS...</span>
              <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-400">⌘ K</kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">A</div>
              <div className="hidden text-left lg:block">
                <div className="text-sm font-semibold">Administrador</div>
                <div className="text-xs text-slate-400">Piscinas Azul LTDA</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <Sidebar />
      <main className="min-h-screen pt-[74px] lg:pl-[220px]">{children}</main>
    </div>
  );
}
