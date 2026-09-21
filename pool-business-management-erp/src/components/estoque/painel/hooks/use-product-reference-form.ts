"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createProductReference,
  getProductReference,
  listProductReferences,
  updateProductReference,
} from "@/lib/estoque/product-references";
import type { LookupRecord } from "../../produto/lookup/lookup-types";
import { createEmptyProductReferenceDetails } from "../constants/product-reference-defaults";
import { mapReferenceDataToDetails } from "../utils/product-reference-mappers";
import { getProductReferenceRules } from "../utils/product-reference-rules";
import type {
  ProductReferenceDetails,
  SetProductReferenceDetail,
  UseProductReferenceFormParams,
} from "../types/product-reference-form-types";

export function useProductReferenceForm({
  kind,
  record,
  onSaved,
}: UseProductReferenceFormParams) {
  const [name, setName] = useState(record?.name || "");
  const [code, setCode] = useState(
    record && record.value !== record.name ? record.value : "",
  );
  const [details, setDetails] = useState<ProductReferenceDetails>(
    createEmptyProductReferenceDetails,
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const [categories, setCategories] = useState<LookupRecord[]>([]);
  const [manufacturers, setManufacturers] = useState<LookupRecord[]>([]);
  const [units, setUnits] = useState<LookupRecord[]>([]);

  const rules = useMemo(
    () => getProductReferenceRules(kind),
    [kind],
  );

  const setDetail: SetProductReferenceDetail = (key, value) => {
    setDetails((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (kind === "category") {
      void listProductReferences("category").then(setCategories);
    }

    if (kind === "brand") {
      void listProductReferences("manufacturer").then(setManufacturers);
    }

    if (kind === "unit") {
      void listProductReferences("unit").then(setUnits);
    }

    if (!record) {
      return;
    }

    getProductReference(kind, record.id)
      .then((data) => {
        setName(String(data.name || ""));
        setCode(String(data.code || ""));
        setDetails(
          mapReferenceDataToDetails(
            data as unknown as Record<string, unknown>,
          ),
        );
      })
      .catch(() => {
        setError("Não foi possível carregar o cadastro.");
      });
  }, [kind, record]);

  const saveDisabled =
    pending ||
    !name.trim() ||
    (rules.usesCode &&
      !code.trim() &&
      !(kind === "category" && !record && details.automaticCode)) ||
    (kind === "unit" && !details.unitSymbol.trim()) ||
    (kind === "category" &&
      !record &&
      !details.automaticId &&
      !details.requestedId);

  const save = () => {
    startTransition(async () => {
      try {
        setError("");

        if (record) {
          await updateProductReference(
            kind,
            record.id,
            name,
            code,
            details,
          );
        } else {
          await createProductReference(
            kind,
            name,
            code,
            details,
          );
        }

        onSaved();
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível salvar.",
        );
      }
    });
  };

  return {
    name,
    code,
    details,
    error,
    pending,
    categories,
    manufacturers,
    units,
    rules,
    usesCode: rules.usesCode,
    saveDisabled,

    setName,
    setCode,
    setDetail,
    save,
  };
}
