"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { brl, pct } from "@/lib/format";
import { Field } from "../ui/field";
export function CommissionSimulator() {
  const [venda, setVenda] = useState(20000);
  const [custo, setCusto] = useState(14800);
  const margem = venda > 0 ? ((venda - custo) / venda) * 100 : 0;
  const rate = margem < 15 ? 1 : margem <= 25 ? 3 : 5;
  const comissao = (venda * rate) / 100;
  const tone = margem < 15 ? "text-coral-500" : margem <= 25 ? "text-sun-500" : "text-mint-600";
  const barTone = margem < 15 ? "from-coral-500 to-sun-500" : margem <= 25 ? "from-sun-500 to-water-500" : "from-water-500 to-mint-500";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">Valor da venda</span>
          <Input
            type="number" value={venda} min={0}
            onChange={(e) => setVenda(Number(e.target.value))}
            className="input tabular-nums"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">Custo total</span>
          <Input
            type="number" value={custo} min={0}
            onChange={(e) => setCusto(Number(e.target.value))}
            className="input tabular-nums"
          />
        </label>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-[12.5px] font-bold">
          <span className="text-ink-500">Margem atual</span>
          <span className={tone}>{pct(margem)}</span>
        </div>
        <div className="bar">
          <span className={`bg-gradient-to-r ${barTone}`} style={{ width: `${Math.max(2, Math.min(100, margem))}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-[10.5px] font-bold text-ink-300">
          <span>&lt;15% → 1%</span>
          <span>15–25% → 3%</span>
          <span>&gt;25% → 5%</span>
        </div>
      </div>

      <div className="inset-soft flex items-center justify-between rounded-2xl px-5 py-4">
        <div>
          <div className="text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">Comissão do vendedor</div>
          <div className="text-[12px] font-semibold text-ink-300">alíquota aplicada: {rate}%</div>
        </div>
        <div className={`text-[26px] font-extrabold tabular-nums ${tone}`}>{brl(comissao)}</div>
      </div>
      <p className="text-[12px] font-medium leading-relaxed text-ink-300">
        Descontos que derrubam a margem abaixo de 15% reduzem a comissão de 5% para 1% —
        o vendedor passa a proteger a margem, não apenas o fechamento.
      </p>
    </div>
  );
}
