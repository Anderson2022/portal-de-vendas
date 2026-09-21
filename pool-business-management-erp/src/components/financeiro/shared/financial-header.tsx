import Link from "next/link";
export function FinancialHeader({ title, description, children }: {
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return <header className="fin-header"><div><nav aria-label="Caminho" className="fin-muted text-xs"><Link href="/inicio">Início</Link> / <Link href="/financeiro">Financeiro</Link></nav><h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1><p className="fin-muted mt-2 max-w-3xl text-sm">{description}</p></div><div className="flex flex-wrap gap-2">{children}</div></header>;
}
