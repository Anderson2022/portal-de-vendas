"use server";
import { unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveQuote, saveSale, convertQuote, setQuoteStatus } from "../backend/commercial";
import type { DocumentInput } from "./domain";
function refresh() {
  revalidatePath("/", "layout");
}
async function result(task: () => Promise<string | void>) {
  try {
    const id = await task();
    refresh();
    return { ok: true as const, id };
  } catch (error) {
    unstable_rethrow(error);
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar. Tente novamente.",
    };
  }
}
export async function submitQuote(input: DocumentInput, id?: string) {
  return result(() => saveQuote(input, id));
}
export async function submitSale(input: DocumentInput) {
  return result(() => saveSale(input));
}
export async function submitConversion(
  id: string,
  payment: { paymentMethod: string; paid: boolean; dueDate: string },
) {
  return result(() => convertQuote(id, payment));
}
export async function updateQuoteStatus(id: string, status: string) {
  return result(() => setQuoteStatus(id, status));
}
