"use server";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { api, session, BackendError } from "@/lib/backend/client";
import { canFinance } from "../permissions";
import { financialEndpoints } from "./endpoints";
import type { ActionResult, FinancialKind } from "../types";
export async function settleTitle(kind: FinancialKind, id: string): Promise<ActionResult> {
    try {
        const user = await session();
        if (!canFinance(user.permissions, "create"))
            return { ok: false, message: "Você não tem permissão para registrar quitações." };
        if (!["payable", "receivable"].includes(kind) || !/^\d+$/.test(id))
            return { ok: false, message: "Título inválido." };
        // Recheck current state; the API does not yet offer idempotency or row versions.
        const titles = await api<Array<{
            id: string | number;
            status: string;
        }>>(financialEndpoints[kind]);
        const title = titles.find(item => String(item.id) === id);
        if (!title || !["PENDING", "OVERDUE"].includes(title.status))
            return { ok: false, message: "Título indisponível para quitação. Atualize a lista." };
        await api(`${financialEndpoints[kind]}/${id}/pay`, { method: "POST" });
        revalidatePath("/financeiro", "layout");
        return { ok: true, message: kind === "payable" ? "Pagamento integral registrado." : "Recebimento integral registrado." };
    }
    catch (error) {
        unstable_rethrow(error);
        return { ok: false, message: error instanceof BackendError ? error.message : "Não foi possível confirmar a operação. Atualize a lista antes de tentar novamente." };
    }
}
