import { createEmptyProductReferenceDetails } from "../constants/product-reference-defaults";
import type { ProductReferenceDetails } from "../types/product-reference-form-types";

type ReferenceData = Record<string, unknown>;

export function mapReferenceDataToDetails(
  data: ReferenceData,
): ProductReferenceDetails {
  return {
    ...createEmptyProductReferenceDetails(),

    description: String(data.description || ""),
    documentNumber: String(data.document_number || ""),
    phone: String(data.phone || ""),
    email: String(data.email || ""),
    address: String(data.address || ""),
    city: String(data.city || ""),
    state: String(data.state || ""),
    website: String(data.website || ""),
    notes: String(data.notes || ""),
    active: data.active !== false,

    parentCategoryId: String(data.parent_category_id || ""),
    seoDescription: String(data.seo_description || ""),
    coverImage: String(data.cover_image || ""),
    level: String(data.nivel || 1),
    displayOrder: String(data.ordem_exibicao || ""),
    batchControlled: data.controla_lote === true,
    expirationControlled: data.controla_validade === true,
    serialControlled: data.controla_serie === true,
    allowNegativeStock: data.permite_estoque_negativo === true,
    defaultMinimumStock: String(data.estoque_minimo_padrao || ""),
    defaultMaximumStock: String(data.estoque_maximo_padrao || ""),
    defaultSafetyStock: String(data.estoque_seguranca_padrao || ""),
    defaultIssueMethod: String(data.metodo_saida_padrao || ""),
    inactiveDays: String(data.dias_sem_movimento || ""),

    externalCode: String(data.external_code || data.codigo_externo || ""),
    shortName: String(data.short_name || ""),
    manufacturerId: String(data.manufacturer_id || ""),
    logoUrl: String(data.logo_url || ""),

    unitSymbol: String(data.unit_symbol || ""),
    unitType: String(data.unit_type || "OUTRO"),
    decimalPlaces: String(data.decimal_places ?? 0),
    baseUnitId: String(data.base_unit_id || ""),
    conversionFactor: String(data.conversion_factor || "1.000000"),

    physicalProduct: data.physical_product !== false,
    stockControlled: data.stock_controlled !== false,
    purchaseAllowed: data.purchase_allowed !== false,
    saleAllowed: data.sale_allowed !== false,
    batchControl: data.batch_control === true,
    expirationControl: data.expiration_control === true,
    serialControl: data.serial_control === true,
    fiscalItemTypeCode: String(data.fiscal_item_type_code || ""),
  };
}
