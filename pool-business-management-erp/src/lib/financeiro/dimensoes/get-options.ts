"use server";
import { api } from "@/lib/backend/client";
import type { DimensionOptions } from "./types";
export async function getDimensionOptions() {
  return api<DimensionOptions>("/financeiro/dimensoes");
}
