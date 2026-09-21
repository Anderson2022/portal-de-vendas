"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createProductReference, listProductReferences } from "@/lib/estoque/product-references";
import { defaultUnits, lookupConfig, normalizeLookup } from "./lookup-config";
import type { LookupInput, LookupKind, LookupRecord, LookupSeeds } from "./lookup-types";

type LookupContextValue = {
  records: (kind: LookupKind) => LookupRecord[];
  create: (kind: LookupKind, input: LookupInput) => Promise<LookupRecord>;
  refresh: (kind: LookupKind) => Promise<void>;
  initial: (name: string) => string;
};
const LookupContext = createContext<LookupContextValue | null>(null);

export function ProductLookupProvider({ children, initialValues = {}, ...seeds }: LookupSeeds & { children: ReactNode; initialValues?: Record<string, string> }) {
  const [added, setAdded] = useState<Partial<Record<LookupKind, LookupRecord[]>>>({});

  function records(kind: LookupKind) {
    const options = kind === "category" ? seeds.categories : kind === "brand" ? seeds.brands
      : kind === "warehouse" ? seeds.warehouses : kind === "supplier" ? seeds.suppliers || [] : [];
    const initial: LookupRecord[] = kind === "unit" ? defaultUnits : options.map((option) => ({ ...option, value: option.name, persisted: true }));
    return [...new Map([...initial, ...(added[kind] || [])].map((record) => [record.id, record])).values()];
  }

  async function create(kind: LookupKind, input: LookupInput) {
    const config = lookupConfig[kind];
    const name = input.name.trim();
    const value = config.code ? (input.code || "").trim().toUpperCase() : config.numeric ? String(Number(name)) : name;
    if (!name || !value) throw new Error("Preencha os dados do cadastro.");
    if (config.numeric && (!Number.isFinite(Number(name)) || Number(name) < (config.min || 0) || (config.step === 1 && !Number.isInteger(Number(name))))) {
      throw new Error("Informe um valor numérico válido.");
    }
    const existing = records(kind).find((record) => normalizeLookup(record.value) === normalizeLookup(value) || (!config.code && normalizeLookup(record.name) === normalizeLookup(name)));
    if (existing) return existing;
    const saved = await createProductReference(kind, name, input.code);
    const record: LookupRecord = { id: saved?.id || crypto.randomUUID(), name: saved?.name || name, value, persisted: Boolean(saved) };
    setAdded((current) => ({ ...current, [kind]: [...(current[kind] || []), record] }));
    return record;
  }

  async function refresh(kind: LookupKind) {
    const rows = await listProductReferences(kind);
    setAdded((current) => ({ ...current, [kind]: rows }));
  }

  return <LookupContext.Provider value={{ records, create, refresh, initial: (name) => initialValues[name] || "" }}>{children}</LookupContext.Provider>;
}

export function useProductLookup() {
  const context = useContext(LookupContext);
  if (!context) throw new Error("ProductLookupProvider não encontrado.");
  return context;
}
