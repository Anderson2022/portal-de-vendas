import type { UtilityProps } from "./utility-props";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle2,
  Clock3,
  ArrowDownRight,
  Bike,
  Package,
} from "lucide-react";
import { money } from "../utils/money";
import { marketProducts } from "../constants/market-products";
import { labels } from "./labels";
import { headers } from "./headers";
export function useUtilityState(props: UtilityProps) {
  const {
    page,
    pageTitle,
    navigate,
    message,
    orders,
    dataFilter,
    setDataFilter,
    newClients,
    setModal,
  } = props;
  const [query, setQuery] = useState("");
  const [check, setCheck] = useState("Todos");
  const metrics: [string, string, string, LucideIcon][] | null =
    page === "relatorios"
      ? [
          ["Vendas hoje", "R$ 8.492,50", "+12,8%", ShoppingCart],
          ["Pedidos", "148", "+8,2%", Receipt],
          ["Ticket médio", "R$ 57,38", "+4,1%", TrendingUp],
          ["Novos clientes", "23", "+15%", Users],
        ]
      : page === "financeiro"
        ? [
            ["Receita", "R$ 18.790,00", "Este mês", Wallet],
            ["Recebido", "R$ 14.530,00", "Conciliado", CheckCircle2],
            ["A receber", "R$ 4.260,00", "Pendente", Clock3],
            ["Despesas", "R$ 6.390,00", "Este mês", ArrowDownRight],
          ]
        : page === "entregas"
          ? [
              ["Em rota", "3", "Entregadores ativos", Bike],
              ["Entregues hoje", "27", "Concluídas", CheckCircle2],
              ["Tempo médio", "32 min", "Estimativa", Clock3],
              ["Aguardando", "4", "Na fila", Package],
            ]
          : null;
  const dataRows =
    page === "pedidos"
      ? orders.map((o) => [
          String("#" + o.id),
          o.customer,
          o.status,
          money(o.total),
          o.payment,
        ])
      : page === "produtos"
        ? marketProducts.map((p) => [
            p.name,
            p.barcode || "",
            p.category,
            money(p.price),
            String(p.stock) + " un.",
          ])
        : page === "clientes"
          ? [
              [
                "João da Silva",
                "(65) 99912-4545",
                "joao@email.com",
                "15 compras",
                "Ativo",
              ],
              [
                "Maria Oliveira",
                "(65) 99945-2020",
                "maria@email.com",
                "8 compras",
                "Ativo",
              ],
              [
                "Carlos Oliveira",
                "(65) 98765-4321",
                "carlos@email.com",
                "12 compras",
                "Ativo",
              ],
              ...newClients.map((n) => [n, "—", "—", "0 compras", "Novo"]),
            ]
          : page === "usuarios"
            ? [
                [
                  "Administrador",
                  "admin@loja.com",
                  "Administrador",
                  "Ativo",
                  "Acesso total",
                ],
                [
                  "Operador Caixa",
                  "caixa@loja.com",
                  "Operador",
                  "Ativo",
                  "Vendas",
                ],
                [
                  "Gerente Loja",
                  "gerente@loja.com",
                  "Gerente",
                  "Ativo",
                  "Gestão",
                ],
              ]
            : page === "financeiro"
              ? [
                  [
                    "#F-3001",
                    "Venda no balcão",
                    "Recebido",
                    "R$ 129,90",
                    "PIX",
                  ],
                  [
                    "#F-3002",
                    "Compra fornecedor",
                    "Pendente",
                    "R$ 280,00",
                    "Boleto",
                  ],
                  [
                    "#F-3003",
                    "Venda delivery",
                    "Recebido",
                    "R$ 97,70",
                    "Cartão",
                  ],
                ]
              : page === "promocoes"
                ? [
                    [
                      "BEMVINDO10",
                      "10% de desconto",
                      "Ativo",
                      "31/12/2026",
                      "Primeira compra",
                    ],
                    [
                      "FRETEGRATIS",
                      "Frete grátis",
                      "Ativo",
                      "31/10/2026",
                      "Acima de R$ 70",
                    ],
                    [
                      "BLACKFRIDAY",
                      "20% de desconto",
                      "Rascunho",
                      "27/11/2026",
                      "Toda loja",
                    ],
                  ]
                : [];
  return {
    ...props,
    query,
    setQuery,
    check,
    setCheck,
    metrics,
    dataRows,
    labels,
    headers,
  };
}
