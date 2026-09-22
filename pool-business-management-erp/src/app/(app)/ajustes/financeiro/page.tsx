import { PageIntro } from "@/components/ui";
import { FinancialSettings } from "@/components/financeiro/settings/financial-settings";

export default function FinancialSettingsPage() {
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Configurações", href: "/ajustes" },
          { label: "Financeiro" },
        ]}
        title="Cadastros financeiros"
        subtitle="Configure as opções usadas nos lançamentos, pagamentos e relatórios."
      />
      <div className="mt-6">
        <FinancialSettings />
      </div>
    </div>
  );
}
