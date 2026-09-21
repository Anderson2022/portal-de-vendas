"use server";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { api, session, BackendError } from "@/lib/backend/client";
import { canFinance } from "../permissions";
import { parseMoneyInput } from "../money";
import { validDate } from "../dates";
import { financialEndpoints } from "./endpoints";
import type { ActionResult } from "../types";
export async function createPayable(form: FormData): Promise<ActionResult> {
    try {
        const user = await session();
        if (!canFinance(user.permissions, "create"))
            return { ok: false, message: "Você não tem permissão para criar títulos." };
        const description = String(form.get("description") || "").trim();
        const dueDate = String(form.get("dueDate") || "");
        if (!description || description.length > 220)
            return { ok: false, message: "Informe uma descrição de até 220 caracteres." };
        if (!validDate(dueDate))
            return { ok: false, message: "Informe um vencimento válido." };
        const supplierId = String(form.get("supplierId") || "");
        if (supplierId) {
            if (!/^\d+$/.test(supplierId) || !user.permissions.includes("SUPPLIER_VIEW"))
                return { ok: false, message: "Fornecedor inválido ou sem permissão de consulta." };
            const suppliers = await api<Array<{
                id: string | number;
            }>>("/suppliers");
            if (!suppliers.some(supplier => String(supplier.id) === supplierId))
                return { ok: false, message: "Fornecedor não pertence à empresa atual." };
        }
        let amount: string;
        try {
            amount = parseMoneyInput(String(form.get("amount") || ""));
        }
        catch (error) {
            return { ok: false, message: (error as Error).message };
        }
        await api(financialEndpoints.payable, { method: "POST", body: JSON.stringify({ description, dueDate, amount, supplierId: supplierId || null }) });
        revalidatePath("/financeiro", "layout");
        return { ok: true, message: "Conta a pagar cadastrada com sucesso." };
    }
    catch (error) {
        unstable_rethrow(error);
        return { ok: false, message: error instanceof BackendError ? error.message : "Não foi possível confirmar o cadastro. Consulte a lista antes de tentar novamente." };
    }
}
