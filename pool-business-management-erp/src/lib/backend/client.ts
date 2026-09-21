import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
export const backendOrigin = () =>
  process.env.BACKEND_URL || "http://127.0.0.1:8081";
export class BackendError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get("pool_access_token")?.value;
  if (!token) redirect("/login");
  try {
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    if (
      !/^\d+$/.test(String(claims.sub ?? "")) ||
      !/^\d+$/.test(String(claims.companyId ?? ""))
    )
      redirect("/login?expirada=1");
  } catch {
    redirect("/login?expirada=1");
  }
  const response = await fetch(`${backendOrigin()}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 401) redirect("/login?expirada=1");
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new BackendError(
      body.message ||
        (response.status === 403
          ? "Seu perfil não tem acesso a esta operação."
          : "Não foi possível concluir a operação. Tente novamente."),
      response.status,
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
export const session = cache(async () => {
  const user = await api<{
    userId: string;
    companyId: string;
    email: string;
    roles: string[];
    permissions: string[];
  }>("/auth/me");
  const token = (await cookies()).get("pool_access_token")!.value;
  const claims = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
  );
  return {
    ...user,
    name: String(claims.name || user.email),
    role: user.roles[0] || "",
  };
});
export const company = cache(() =>
  api<{
    id: string;
    legalName: string;
    tradeName: string;
    cnpj: string | null;
    email: string | null;
    phone: string | null;
  }>("/company/me"),
);
