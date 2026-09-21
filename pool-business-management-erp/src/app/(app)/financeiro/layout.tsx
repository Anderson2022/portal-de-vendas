import ModuleShell from "@/components/module-shell";
import { session, company } from "@/lib/backend/client";
import { canFinance } from "@/lib/financeiro/permissions";
import { financialNavigation } from "@/lib/financeiro/navigation";
import { FinancialContext } from "@/components/financeiro/shared/financial-context";
import { FinancialState } from "@/components/financeiro/shared/financial-state";
import "./financeiro.css";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, business] = await Promise.all([session(), company()]);
  if (!canFinance(user.permissions, "view"))
    return (
      <div className="financial-workspace p-8">
        <FinancialState
          error
          title="Acesso não autorizado"
          description="Seu perfil não possui permissão para visualizar o Financeiro."
        />
      </div>
    );
  return (
    <ModuleShell
      brand="financeiro"
      moduleName="Financeiro"
      items={financialNavigation}
    >
      <FinancialContext
        permissions={user.permissions}
        business={business.tradeName || business.legalName}
      >
        {children}
      </FinancialContext>
    </ModuleShell>
  );
}
