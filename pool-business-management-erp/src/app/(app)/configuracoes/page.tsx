import { Building2, Users, ShieldCheck } from "lucide-react";
import { Card, Badge, PageIntro, SectionTitle, Avatar } from "@/components/ui";
import { usersList, suppliersList } from "@/lib/queries";
import { company, session } from "@/lib/backend/client";
import { roleMap } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function ConfiguracoesPage() {
  const [users, suppliers, business, user] = await Promise.all([
    usersList(),
    suppliersList(),
    company(),
    session(),
  ]);
  return (
    <div className="mx-auto max-w-[1460px]">
      <PageIntro
        crumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Configurações" },
        ]}
        title="Configurações"
        subtitle="Empresa, usuários e acesso à operação."
      />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <SectionTitle icon={<Building2 size={17} />} title="Minha empresa" />
          <h2 className="mt-4 font-bold">
            {business.tradeName || business.legalName}
          </h2>
          <p className="mt-2 text-sm">{business.legalName}</p>
          <p className="text-sm">CNPJ: {business.cnpj || "Não informado"}</p>
          <p className="mt-2 text-sm">
            {business.email || "E-mail não informado"}
          </p>
          <p className="text-sm">
            {business.phone || "Telefone não informado"}
          </p>
          <p className="mt-4 text-sm">
            Fornecedores cadastrados: {suppliers.length}
          </p>
        </Card>
        <Card className="p-6">
          <SectionTitle icon={<ShieldCheck size={17} />} title="Meu acesso" />
          <p className="mt-4 font-bold">{user.name}</p>
          <p className="text-sm">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge key={role} tone="blue">
                {roleMap[role]?.label || role}
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-500">
            As permissões do seu perfil são verificadas pelo servidor em cada
            operação.
          </p>
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer">
              Permissões concedidas ({user.permissions.length})
            </summary>
            <ul className="mt-3 space-y-1 break-words">
              {user.permissions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </details>
        </Card>
      </div>
      <Card className="mt-5 p-6">
        <SectionTitle
          icon={<Users size={17} />}
          title={"Usuários do sistema (" + users.length + ")"}
        />
        <div className="mt-4 divide-y divide-black/5">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar name={u.name} size={34} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{u.name}</p>
                <p className="break-all text-sm text-ink-500">{u.email}</p>
              </div>
              <Badge tone="blue">{roleMap[u.role]?.label || u.role}</Badge>
              <Badge tone={u.active ? "green" : "red"}>
                {u.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          ))}
        </div>
        {!users.length && (
          <p className="mt-4 text-sm text-ink-500">
            Nenhum usuário disponível para o seu acesso.
          </p>
        )}
      </Card>
    </div>
  );
}
