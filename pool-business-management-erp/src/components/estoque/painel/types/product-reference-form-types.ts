import type { LookupKind, LookupRecord } from "../../produto/lookup/lookup-types";

export type ProductReferenceDetails = {
  description: string;
  documentNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  website: string;
  notes: string;
  active: boolean;

  parentCategoryId: string;
  seoDescription: string;
  coverImage: string;
  level: string;
  displayOrder: string;
  batchControlled: boolean;
  expirationControlled: boolean;
  serialControlled: boolean;
  allowNegativeStock: boolean;
  defaultMinimumStock: string;
  defaultMaximumStock: string;
  defaultSafetyStock: string;
  defaultIssueMethod: string;
  inactiveDays: string;

  externalCode: string;
  automaticId: boolean;
  requestedId: string;
  automaticCode: boolean;

  shortName: string;
  manufacturerId: string;
  logoUrl: string;

  unitSymbol: string;
  unitType: string;
  decimalPlaces: string;
  baseUnitId: string;
  conversionFactor: string;

  physicalProduct: boolean;
  stockControlled: boolean;
  purchaseAllowed: boolean;
  saleAllowed: boolean;
  batchControl: boolean;
  expirationControl: boolean;
  serialControl: boolean;
  fiscalItemTypeCode: string;
};

export type ProductReferenceDetailKey = keyof ProductReferenceDetails;

export type SetProductReferenceDetail = <K extends ProductReferenceDetailKey>(
  key: K,
  value: ProductReferenceDetails[K],
) => void;

export type ProductReferenceRules = {
  usesCode: boolean;
  hasContact: boolean;
  hasAddress: boolean;
  hasWebsite: boolean;
  hasNotes: boolean;
  isExtended: boolean;
};

export type UseProductReferenceFormParams = {
  kind: LookupKind;
  record?: LookupRecord | null;
  onSaved: () => void;
};
