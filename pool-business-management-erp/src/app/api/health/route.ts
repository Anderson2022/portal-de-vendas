import { backendOrigin } from "@/lib/backend/client";
export const dynamic = "force-dynamic";
export async function GET() { try { const response = await fetch(backendOrigin() + "/actuator/health", { cache: "no-store", signal: AbortSignal.timeout(5000) }); const body = await response.json(); const ok = response.ok && body.status === "UP"; return Response.json({ ok, backend: body.status }, { status: ok ? 200 : 503 }); } catch { return Response.json({ ok: false, backend: "unavailable" }, { status: 503 }); } }
