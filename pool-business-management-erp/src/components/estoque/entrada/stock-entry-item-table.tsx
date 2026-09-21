"use client";

import { Trash2 } from "lucide-react";

import type { StockEntryItem } from "./stock-entry-types";

type Props = {
  items: StockEntryItem[];
  onRemove: (id: string) => void;
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function StockEntryItemTable({ items, onRemove }: Props) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/70 bg-white/70 shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="text-[14px] font-extrabold text-ink-900">
          Produtos da entrada
        </h3>
      </div>

      <div className="max-h-[280px] overflow-auto">
        <table className="w-full text-left text-[12px]">
          <thead className="sticky top-0 bg-slate-50/95 text-ink-400 backdrop-blur">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Un.</th>
              <th className="px-4 py-3 text-right">Qtde</th>
              <th className="px-4 py-3 text-right">Custo Unit.</th>
              <th className="px-4 py-3 text-right">Preço Venda</th>
              <th className="px-4 py-3 text-right">Desconto</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Lote / Serial</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-ink-300"
                >
                  Nenhum item incluído.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-black/[0.045] text-ink-700"
                >
                  <td className="px-4 py-3 font-bold">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3">{item.unit}</td>
                  <td className="px-4 py-3 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {money.format(item.unitCost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {money.format(item.salePrice)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {money.format(item.discount)}
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold">
                    {money.format(item.total)}
                  </td>
                  <td className="px-4 py-3 text-ink-400">
                    {[item.batchNumber, item.serialNumber]
                      .filter(Boolean)
                      .join(" / ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="flex size-8 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t px-5 py-3 text-[11px] font-semibold text-ink-400">
        Registros: {items.length} • Itens:{" "}
        {items.reduce((sum, item) => sum + item.quantity, 0)}
      </div>
    </section>
  );
}
