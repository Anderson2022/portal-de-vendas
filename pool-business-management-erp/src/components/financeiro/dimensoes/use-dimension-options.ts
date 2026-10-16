"use client";
import { useEffect, useState } from "react";
import { getDimensionOptions } from "@/lib/financeiro/dimensoes/get-options";
import type { DimensionOptions } from "@/lib/financeiro/dimensoes/types";
export function useDimensionOptions() {
  const [options, setOptions] = useState<DimensionOptions | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    getDimensionOptions()
      .then((data) => {
        if (alive) setOptions(data);
      })
      .catch(() => {
        if (alive)
          setError(
            "Não foi possível carregar os cadastros financeiros. Reabra o formulário para tentar novamente.",
          );
      });
    return () => {
      alive = false;
    };
  }, []);
  return { options, error };
}
