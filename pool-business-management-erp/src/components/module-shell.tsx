"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  House, LayoutGrid, FileText, ClipboardList, ChartPie, HandCoins, Users,
  ChartColumnBig, Settings, ArrowLeft, Menu, X, ShoppingCart, Boxes,
  Landmark, Waves, Wrench, Sparkles, ChevronDown, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  home: House, grid: LayoutGrid, file: FileText, orders: ClipboardList,
  pie: ChartPie, coins: HandCoins, users: Users, chart: ChartColumnBig,
  settings: Settings, back: ArrowLeft, cart: ShoppingCart, boxes: Boxes,
  bank: Landmark, waves: Waves, wrench: Wrench, sparkles: Sparkles,
};

export type SideItem = { href?: string; label: string; icon: string; children?: Array<{href:string;label:string}> };

export default function ModuleShell({
  brand, moduleName, items, children, sideFooter,
}: {
  brand: string;
  moduleName: string;
  items: SideItem[];
  children: React.ReactNode;
  sideFooter?: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();
  const [open, setOpen] = useState(false);
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});

  const isActive = (href: string) => {
    const hasQuery = href.includes("?");
    if (hasQuery) {
      const [p, q] = href.split("?");
      return pathname === p && currentSearch === q;
    }
    return pathname === href && currentSearch === "";
  };

  const aside = (
    <aside className="flex h-full w-[252px] shrink-0 flex-col gap-1 overflow-y-auto px-4 pb-5 pt-6">
      <Link
        href="/inicio"
        className="side-item mb-1"
        onClick={() => setOpen(false)}
      >
        <House size={17} strokeWidth={2.2} />
        Início
      </Link>

      <div className="divider-label mb-1 mt-3 px-3">{moduleName}</div>
      {items.map((it) => {
        const Icon = ICONS[it.icon] ?? LayoutGrid;
        if(it.children){const childActive=it.children.some(child=>pathname===child.href);const groupOpen=expanded[it.label]??childActive;return <div key={it.label} className="space-y-1"><button type="button" onClick={()=>setExpanded(current=>({...current,[it.label]:!groupOpen}))} className={`side-item w-full ${childActive?"active":""}`}><Icon size={17} strokeWidth={2.2}/><span className="flex-1 text-left">{it.label}</span><ChevronDown size={15} className={`transition-transform ${groupOpen?"rotate-180":""}`}/></button>{groupOpen&&<div className="ml-5 border-l border-ink-200 pl-2">{it.children.map(child=><Link key={child.href} href={child.href} onClick={()=>setOpen(false)} className={`side-item !py-2 text-[13px] ${pathname===child.href?"active":""}`}>{child.label}</Link>)}</div>}</div>}
        if(!it.href)return null;
        const baseHref = it.href.split("?")[0];
        const rootHref = `/${brand}`;
        const active = it.href.includes("?")
          ? isActive(it.href)
          : baseHref === rootHref
            ? pathname === rootHref && currentSearch === ""
            : pathname.startsWith(baseHref) && currentSearch === "";
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className={`side-item ${active ? "active" : ""}`}
          >
            <Icon size={17} strokeWidth={2.2} />
            {it.label}
          </Link>
        );
      })}

      {sideFooter && <div className="mt-5">{sideFooter}</div>}

      <div className="mt-auto space-y-1 pt-6">
        <Link href="/configuracoes" className="side-item" onClick={() => setOpen(false)}>
          <Settings size={17} strokeWidth={2.2} />
          Configurações
        </Link>
        <Link href="/inicio" className="side-item" onClick={() => setOpen(false)}>
          <ArrowLeft size={17} strokeWidth={2.2} />
          Voltar ao início
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-[calc(100vh-70px)]">
      {/* Desktop */}
      <div className="sticky top-[70px] hidden h-[calc(100vh-70px)] lg:block">{aside}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <Card className="card fade-up absolute bottom-0 left-0 top-0 !rounded-none !rounded-r-3xl">
            <Button variant="unstyled" type="submit"
              onClick={() => setOpen(false)}
              className="neu absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-500"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </Button>
            {aside}
          </Card>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Button variant="unstyled" type="submit"
          onClick={() => setOpen(true)}
          className="neu mb-4 mt-4 flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold text-ink-700 lg:hidden"
        >
          <Menu size={16} />
          Menu {moduleName}
        </Button>
        <div className="px-4 pb-16 sm:px-6 lg:px-8 lg:pt-7">{children}</div>
      </div>
    </div>
  );
}
