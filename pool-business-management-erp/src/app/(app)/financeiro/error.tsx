"use client";
import { FinancialState } from "@/components/financeiro/shared/financial-state";
export default function ErrorState({ reset }: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    return <div><FinancialState error title="Não foi possível carregar o Financeiro" description="Verifique sua conexão e tente novamente. Nenhum valor fictício será exibido."/><button onClick={reset} className="fin-button fin-primary mt-4">Tentar novamente</button></div>;
}
