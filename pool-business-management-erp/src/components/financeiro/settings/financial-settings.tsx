import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const financialRegisters = [
  [
    "categoria-plano-contas",
    "Categoria / plano de contas",
    "Estruture receitas, despesas e contas da DRE.",
  ],
  [
    "centros-custo",
    "Centro de custo",
    "Organize os gastos por área ou operação.",
  ],
  [
    "projetos-unidades",
    "Projeto / unidade",
    "Relacione o lançamento à unidade responsável.",
  ],
  [
    "naturezas-financeiras",
    "Natureza financeira",
    "Defina a finalidade financeira do lançamento.",
  ],
  [
    "contas-previstas",
    "Conta prevista",
    "Cadastre bancos, caixas e carteiras.",
  ],
  [
    "formas-pagamento",
    "Forma de pagamento",
    "Configure PIX, boleto, transferência e outros meios.",
  ],
  [
    "favorecidos-pix",
    "Favorecido / chave PIX",
    "Mantenha favorecidos e dados para pagamento.",
  ],
] as const;
export function FinancialSettings() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {financialRegisters.map(([slug, title, description]) => (
        <Link
          key={slug}
          href={`/ajustes/financeiro/${slug}`}
          className="group flex min-h-36 flex-col justify-between rounded-2xl bg-[#1b1d22] p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-extrabold">{title}</h2>
              <p className="mt-2 text-sm text-white/60">{description}</p>
            </div>
            <ArrowUpRight size={19} />
          </div>
          <span className="mt-5 text-sm font-bold text-white/80">
            Abrir cadastro →
          </span>
        </Link>
      ))}
    </div>
  );
}
