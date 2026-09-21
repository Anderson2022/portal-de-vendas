import type { LookupKind } from "../../produto/lookup/lookup-types";
import type { ProductReferenceRules } from "../types/product-reference-form-types";

const CODE_KINDS: LookupKind[] = [
  "category",
  "brand",
  "unit",
  "type",
  "warehouse",
  "manufacturer",
  "model",
  "material",
  "finish",
];

const CONTACT_KINDS: LookupKind[] = [
  "brand",
  "supplier",
  "warehouse",
  "manufacturer",
];

const ADDRESS_KINDS: LookupKind[] = [
  "supplier",
  "warehouse",
  "manufacturer",
];

const WEBSITE_KINDS: LookupKind[] = [
  "brand",
  "supplier",
  "manufacturer",
];

export function getProductReferenceRules(
  kind: LookupKind,
): ProductReferenceRules {
  const hasContact = CONTACT_KINDS.includes(kind);
  const hasAddress = ADDRESS_KINDS.includes(kind);
  const hasWebsite = WEBSITE_KINDS.includes(kind);
  const hasNotes =
    kind !== "category" &&
    kind !== "unit" &&
    kind !== "type";

  return {
    usesCode: CODE_KINDS.includes(kind),
    hasContact,
    hasAddress,
    hasWebsite,
    hasNotes,
    isExtended: hasContact || hasAddress || hasWebsite || hasNotes,
  };
}

export function getProductReferenceFormLayout(kind: LookupKind) {
  const { isExtended } = getProductReferenceRules(kind);

  return {
    width:
      kind === "category"
        ? "max-w-5xl"
        : isExtended
          ? "max-w-4xl"
          : "max-w-2xl",
    height:
      kind === "category"
        ? "h-[90vh]"
        : isExtended
          ? "h-[82vh]"
          : undefined,
  };
}
