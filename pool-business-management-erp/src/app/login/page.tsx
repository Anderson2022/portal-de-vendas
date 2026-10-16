import { Card } from "@/components/ui/card";
import { Waves } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { DemoAccessButton } from "@/components/auth/demo-access-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* fundo: piscina infinity */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-pool.jpg)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(233,244,251,.97) 0%, rgba(233,244,251,.88) 34%, rgba(215,239,252,.35) 62%, rgba(13,132,192,.12) 100%)",
        }}
      />

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_380px]">
        <div className="fade-up hidden lg:block">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{
                background: "linear-gradient(150deg,#45bce9,#0d84c0)",
                boxShadow:
                  "0 12px 24px -8px rgba(13,132,192,.6), inset 0 1px 0 rgba(255,255,255,.5)",
              }}
            >
              <Waves size={24} strokeWidth={2.4} />
            </span>
            <div className="leading-none">
              <div className="text-[24px] font-extrabold tracking-tight text-ink-950">
                Pool<span className="text-water-600">Control</span>
              </div>
              <div className="mt-1 text-[9px] font-bold tracking-[0.34em] text-ink-300">
                GESTÃO QUE FLUI
              </div>
            </div>
          </div>
          <h1 className="font-display mt-10 max-w-md text-[64px] leading-[1.02] text-ink-950">
            O lucro da sua empresa, <em className="text-water-600">claro</em>{" "}
            como a água.
          </h1>
          <p className="mt-5 max-w-sm text-[15.5px] font-medium leading-relaxed text-ink-500">
            Vendas com margem real, comissões automáticas, estoque, financeiro e
            ordens de serviço — tudo fluindo em um só lugar.
          </p>
        </div>

        <Card
          className="card fade-up !rounded-[28px] p-8"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="text-[22px] font-extrabold tracking-tight text-ink-950">
            Entrar no sistema
          </h2>
          <p className="mt-1 text-[13px] font-medium text-ink-300">
            Acesse com o e-mail e a senha da sua equipe.
          </p>

          {erro && (
            <div className="mt-4 rounded-2xl bg-coral-100 px-4 py-3 text-[12.5px] font-bold text-coral-500">
              {erro === "conexao"
                ? "Não foi possível conectar ao servidor. Tente novamente."
                : "E-mail ou senha inválidos. Tente novamente."}
            </div>
          )}

          <LoginForm />
          <DemoAccessButton />

          <p className="mt-5 text-center text-xs text-ink-500">
            Use as credenciais fornecidas pelo administrador da sua empresa.
          </p>
        </Card>
      </div>
    </div>
  );
}
