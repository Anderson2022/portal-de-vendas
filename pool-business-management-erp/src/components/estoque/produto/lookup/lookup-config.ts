import type { LookupConfig, LookupKind, LookupRecord } from "./lookup-types";

export const lookupConfig: Record<LookupKind, LookupConfig> = {
  category: { remote: true }, supplier: { remote: true }, unit: { code: true, remote: true }, type: { code: true, remote: true },
  brand: { remote: true }, warehouse: { remote: true }, manufacturer: { remote: true }, model: { remote: true }, material: { remote: true }, finish: { remote: true },
  warranty: { numeric: true, min: 0, step: 1 },
  packageQuantity: { numeric: true, min: 0.001, step: 0.001 },
};

export const defaultUnits: LookupRecord[] = [
  ["UN", "Unidade"], ["KG", "Quilograma"], ["G", "Grama"], ["L", "Litro"],
  ["ML", "Mililitro"], ["M", "Metro"], ["M2", "Metro quadrado"], ["CX", "Caixa"], ["PCT", "Pacote"],
].map(([value, name]) => ({ id: value, name, value, persisted: false }));

export const normalizeLookup = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");

export function filterLookup(records: LookupRecord[], query: string) {
  const normalized = normalizeLookup(query);
  return records.filter((record) => normalizeLookup(`${record.name} ${record.value}`).includes(normalized));
}
