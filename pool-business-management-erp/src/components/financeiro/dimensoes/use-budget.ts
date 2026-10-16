import { useEffect, useState } from "react";
import type { BudgetRow } from "@/lib/financeiro/dimensoes/budget-types";
export function useBudget(
  id: string,
  load: (id: string) => Promise<BudgetRow[]>,
) {
  const [rows, setRows] = useState<BudgetRow[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    let alive = true;
    load(id)
      .then((result) => {
        if (alive) setRows(result);
      })
      .catch(() => {
        if (alive) setError("Não foi possível carregar o orçamento.");
      });
    return () => {
      alive = false;
    };
  }, [id, load]);
  async function save(action: () => Promise<{ error: string | null }>) {
    setPending(true);
    setError("");
    try {
      const result = await action();
      if (result.error) setError(result.error);
      else setRows(await load(id));
    } catch {
      setError("Não foi possível salvar o orçamento.");
    } finally {
      setPending(false);
    }
  }
  return { rows, error, pending, save };
}
