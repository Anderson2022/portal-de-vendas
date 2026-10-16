"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChartAccountDetail } from "@/lib/financeiro/plano-contas/types";
import { createChartAccount } from "@/lib/financeiro/plano-contas/create-chart-account";
import { chartAccountFormData } from "@/lib/financeiro/plano-contas/chart-account-form-data";
import { updateChartAccount } from "@/lib/financeiro/plano-contas/update-chart-account";
import { deleteChartAccount } from "@/lib/financeiro/plano-contas/delete-chart-account";
export const chartAccountsPath = "/ajustes/financeiro/categoria-plano-contas";
export function useChartAccountForm(account?: ChartAccountDetail) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(
    operation: () => Promise<{ error: string | null }>,
    next = chartAccountsPath,
  ) {
    setPending(true);
    setError(null);
    try {
      const result = await operation();
      if (result.error) {
        setError(result.error);
        return false;
      }
      router.push(next);
      router.refresh();
      return true;
    } catch {
      setError("Não foi possível concluir a operação. Tente novamente.");
      return false;
    } finally {
      setPending(false);
    }
  }
  async function save(data: FormData, saveAndNew = false) {
    const values = chartAccountFormData(data);
    if (!values.groupId || !values.typeId || !values.natureId) {
      setError(
        "Selecione o grupo, o tipo da conta e a natureza em Dados Gerais.",
      );
      return false;
    }
    return run(
      () =>
        account
          ? updateChartAccount(account.id, values)
          : createChartAccount(values),
      saveAndNew ? `${chartAccountsPath}/novo` : chartAccountsPath,
    );
  }
  return {
    pending,
    error,
    save,
    cancel: () => router.push(chartAccountsPath),
    remove: async () => {
      if (account) await run(() => deleteChartAccount(account.id));
    },
  };
}
