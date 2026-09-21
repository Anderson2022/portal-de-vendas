import type { ProductReferenceDetails } from "../types/product-reference-form-types";

export const EMPTY_PRODUCT_REFERENCE_DETAILS: ProductReferenceDetails = {
  description: "",
  documentNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  website: "",
  notes: "",
  active: true,

  parentCategoryId: "",
  seoDescription: "",
  coverImage: "",
  level: "1",
  displayOrder: "",
  batchControlled: false,
  expirationControlled: false,
  serialControlled: false,
  allowNegativeStock: false,
  defaultMinimumStock: "",
  defaultMaximumStock: "",
  defaultSafetyStock: "",
  defaultIssueMethod: "",
  inactiveDays: "",

  externalCode: "",
  automaticId: true,
  requestedId: "",
  automaticCode: true,

  shortName: "",
  manufacturerId: "",
  logoUrl: "",

  unitSymbol: "",
  unitType: "OUTRO",
  decimalPlaces: "0",
  baseUnitId: "",
  conversionFactor: "1.000000",

  physicalProduct: true,
  stockControlled: true,
  purchaseAllowed: true,
  saleAllowed: true,
  batchControl: false,
  expirationControl: false,
  serialControl: false,
  fiscalItemTypeCode: "",
};

export function createEmptyProductReferenceDetails(): ProductReferenceDetails {
  return { ...EMPTY_PRODUCT_REFERENCE_DETAILS };
}
