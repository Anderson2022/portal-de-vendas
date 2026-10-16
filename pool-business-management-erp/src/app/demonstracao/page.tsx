import { DemoScreen } from "@/components/demonstracao/demo-screen";

export const metadata = {
  title: "Demonstração · PoolControl",
  robots: { index: false, follow: false },
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ iniciar?: string }>;
}) {
  const { iniciar } = await searchParams;
  return <DemoScreen autoStart={iniciar === "1"} />;
}
