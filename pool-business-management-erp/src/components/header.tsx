"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Bell, ChevronDown, LogOut, UserRound, Building2, Settings2, KeyRound } from "lucide-react";
import { logout } from "@/lib/auth/logout";
import { Button } from "./ui/button";
import { Logo } from "./header/logo";
import { Palette } from "./header/search-palette";
import { AvatarMini } from "./header/avatar-mini";
import { Dropdown } from "./header/dropdown";
import { MenuItem } from "./header/menu-item";
export default function Header({
  userName, company, initialsName, alertCount, alerts,
}: {
  userName: string;
  company: string;
  initialsName?: string;
  alertCount: number;
  alerts: { title: string; desc: string; tone: string }[];
}) {
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState<"none" | "bell" | "user">("none");

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const toggle = (m: "bell" | "user") => setMenu((v) => (v === m ? "none" : m));

  return (
    <>
      <header
        className="sticky top-0 z-[60] flex h-[70px] items-center gap-4 border-b border-white/70 px-4 sm:px-6"
        style={{
          background: "#dedee1",
          backdropFilter: "blur(18px) saturate(1.5)",
          WebkitBackdropFilter: "blur(18px) saturate(1.5)",
          boxShadow: "0 8px 18px #bdbdc2, 0 -5px 15px #ffffff",
        }}
      >
        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <Button variant="unstyled" type="submit"
            onClick={() => setPalette(true)}
            className="inset-soft group flex w-full max-w-[560px] items-center gap-3 rounded-full px-4 py-2.5 text-left transition hover:shadow-[inset_0_2px_10px_rgba(17,58,94,0.14)]"
          >
            <Search size={16} className="text-ink-300 transition group-hover:text-water-600" />
            <span className="flex-1 text-[13.5px] font-medium text-ink-300">
              Buscar clientes, pedidos, produtos, OS...
            </span>
            <kbd className="neu rounded-lg px-2.5 py-1 text-[10.5px] font-extrabold text-ink-500">⌘ K</kbd>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <Button variant="unstyled" type="submit"
            onClick={() => setPalette(true)}
            className="neu flex h-10 w-10 items-center justify-center rounded-full text-ink-500 md:hidden"
            aria-label="Buscar"
          >
            <Search size={17} />
          </Button>

          <div className="relative">
            <Button variant="unstyled" type="submit"
              onClick={() => toggle("bell")}
              className="neu relative flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition hover:text-water-600"
              aria-label="Notificações"
            >
              <Bell size={17} strokeWidth={2.2} />
              {alertCount > 0 && (
                <span className="pulse-dot absolute right-2 top-2 h-2 w-2 rounded-full bg-coral-500" />
              )}
            </Button>
            {menu === "bell" && (
              <Dropdown onClose={() => setMenu("none")} className="right-0 w-[340px]">
                <div className="divider-label mb-1 px-3 pt-1">Notificações</div>
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-water-50">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.tone === "red" ? "bg-coral-500" : "bg-sun-500"}`} />
                    <div>
                      <div className="text-[13px] font-bold text-ink-900">{a.title}</div>
                      <div className="text-[12px] font-medium text-ink-300">{a.desc}</div>
                    </div>
                  </div>
                ))}
                <Link href="/estoque" onClick={() => setMenu("none")} className="mt-1 block rounded-2xl bg-water-50 px-3 py-2.5 text-center text-[12.5px] font-bold text-water-700">
                  Ver estoque crítico
                </Link>
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <Button variant="unstyled" type="submit"
              onClick={() => toggle("user")}
              className="neu flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 transition"
            >
              <AvatarMini name={initialsName ?? userName} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="flex items-center gap-1 text-[13.5px] font-extrabold text-ink-950">
                  {userName}
                  <ChevronDown size={13} className="text-ink-300" />
                </span>
                <span className="text-[11px] font-semibold text-ink-300">{company}</span>
              </span>
              <ChevronDown size={14} className="text-ink-300 sm:hidden" />
            </Button>
            {menu === "user" && (
              <Dropdown onClose={() => setMenu("none")} className="right-0 w-[230px]">
                <MenuItem icon={<UserRound size={15} />} label="Meu perfil" href="/configuracoes" onClick={() => setMenu("none")} />
                <MenuItem icon={<Building2 size={15} />} label="Minha empresa" href="/configuracoes" onClick={() => setMenu("none")} />
                <MenuItem icon={<Settings2 size={15} />} label="Preferências" href="/configuracoes" onClick={() => setMenu("none")} />
                <MenuItem icon={<KeyRound size={15} />} label="Alterar senha" href="/configuracoes" onClick={() => setMenu("none")} />
                <div className="my-1.5 h-px bg-ink-100/70" />
                <form action={logout}>
                  <Button variant="unstyled" type="submit" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-coral-500 transition hover:bg-coral-100/60">
                    <LogOut size={15} />
                    Sair
                  </Button>
                </form>
              </Dropdown>
            )}
          </div>
        </div>
      </header>
      {palette && <Palette open onClose={() => setPalette(false)} />}
    </>
  );
}
