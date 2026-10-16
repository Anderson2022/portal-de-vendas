import { session, company } from "@/lib/backend/client";
import Header from "@/components/header";
import { getHeaderAlerts } from "@/lib/header/get-header-alerts";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, business] = await Promise.all([session(), company()]);
  const alerts = await getHeaderAlerts(user.permissions);

  return (
    <div className="relative">
      {/* marca d'água de luz na água */}

      <div className="relative z-10">
        <Header
          userName={user.name}
          company={business.tradeName || business.legalName}
          alertCount={alerts.length}
          alerts={alerts}
        />
        <main>{children}</main>
        <footer className="relative z-10 flex flex-col items-center justify-between gap-2 border-t border-white/60 px-6 py-5 text-[11.5px] font-semibold text-ink-300 sm:flex-row">
          <div>
            <span className="font-extrabold text-ink-500">PoolControl</span>
            <span className="mx-1.5">© 2026</span>|
            <span className="ml-1.5">
              Gestão para negócios que constroem bem-estar.
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span>Confiança</span>•<span>Pessoas</span>•<span>Piscinas</span>•
            <span>Um futuro mais azul</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
