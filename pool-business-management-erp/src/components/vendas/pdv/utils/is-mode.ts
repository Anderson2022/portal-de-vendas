import type { Section } from "../types/section";
import type { Mode } from "../types/mode";
export const isMode = (section: Section): section is Mode =>
  [
    "home",
    "lancamento",
    "cartao",
    "mesas",
    "supermercado",
    "servicos",
    "delivery",
  ].includes(section);
