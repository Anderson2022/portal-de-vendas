"use client";
import { createContext, useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { canFinance } from "@/lib/financeiro/permissions";
import { useFinancialPreference } from "./use-financial-preference";
const Context = createContext<{
    permissions: string[];
}>({ permissions: [] });
export function Can({ action, children }: {
    action: "view" | "create";
    children: React.ReactNode;
}) {
    return canFinance(useContext(Context).permissions, action) ? children : null;
}
export function FinancialContext({ permissions, business, children }: {
    permissions: string[];
    business: string;
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useFinancialPreference("pool-finance-theme", "light");
    const dark = theme === "dark";
    const toggle = () => setTheme(dark ? "light" : "dark");
    return <Context.Provider value={{ permissions }}><div className="financial-workspace" data-theme={theme}><div className="fin-context"><div><span className="fin-muted text-xs">Empresa da sessão</span><p className="font-semibold">{business}</p></div><span className="fin-muted text-xs">Escopo por empresa · Filiais indisponíveis</span><button className="fin-button" type="button" onClick={toggle} aria-label="Alternar tema claro ou escuro">{dark ? <Sun size={16}/> : <Moon size={16}/>} Tema</button></div>{children}</div></Context.Provider>;
}
