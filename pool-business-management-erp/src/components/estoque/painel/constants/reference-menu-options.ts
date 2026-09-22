import type { LookupKind } from "../../produto/lookup/lookup-types";

type ReferenceMenuOption = {
  kind: LookupKind;
  label: string;
};

export const REGISTRATION_OPTIONS: ReferenceMenuOption[] = [
  { kind: "category", label: "Categoria" },
  { kind: "brand", label: "Marca" },
  { kind: "unit", label: "Unidade" },
  { kind: "type", label: "Tipo de produto" },
];

export const TECHNICAL_OPTIONS: ReferenceMenuOption[] = [
  { kind: "manufacturer", label: "Fabricante" },
  { kind: "model", label: "Modelo / linha" },
  { kind: "material", label: "Material" },
  { kind: "finish", label: "Acabamento / cor" },
];

export const ITEM_CLASS =
  "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-white/70";
