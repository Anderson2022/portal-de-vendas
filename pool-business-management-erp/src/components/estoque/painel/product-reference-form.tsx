"use client";

import type { LookupKind, LookupRecord } from "../produto/lookup/lookup-types";
import { Button } from "@/components/ui/button";
import { useProductReferenceForm } from "./hooks/use-product-reference-form";
import { BasicFields } from "./sections/basic-fields";
import { ActiveField } from "./sections/active-field";
import { GenericReferenceFields } from "./sections/generic-reference-fields";
import { CategoryForm } from "./forms/category-form";
import { BrandForm } from "./forms/brand-form";
import { UnitForm } from "./forms/unit-form";
import { ProductTypeForm } from "./forms/product-type-form";

type ProductReferenceFormProps = {
  kind: LookupKind;
  record?: LookupRecord | null;
  onSaved: () => void;
};

export function ProductReferenceForm({
  kind,
  record,
  onSaved,
}: ProductReferenceFormProps) {
  const form = useProductReferenceForm({
    kind,
    record,
    onSaved,
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <BasicFields
        kind={kind}
        record={record}
        name={form.name}
        code={form.code}
        details={form.details}
        usesCode={form.usesCode}
        setName={form.setName}
        setCode={form.setCode}
        setDetail={form.setDetail}
      />

      {kind === "category" && (
        <CategoryForm
          record={record}
          details={form.details}
          categories={form.categories}
          setDetail={form.setDetail}
        />
      )}

      {kind === "brand" && (
        <>
          <BrandForm
            details={form.details}
            manufacturers={form.manufacturers}
            setDetail={form.setDetail}
          />
          <GenericReferenceFields
            kind={kind}
            details={form.details}
            rules={form.rules}
            setDetail={form.setDetail}
          />
        </>
      )}

      {kind === "unit" && (
        <>
          <UnitForm
            record={record}
            details={form.details}
            units={form.units}
            setDetail={form.setDetail}
          />
          <ActiveField
            checked={form.details.active}
            onChange={(value) => form.setDetail("active", value)}
          />
        </>
      )}

      {kind === "type" && (
        <>
          <ProductTypeForm
            details={form.details}
            setDetail={form.setDetail}
          />
          <ActiveField
            checked={form.details.active}
            onChange={(value) => form.setDetail("active", value)}
          />
        </>
      )}

      {!["category", "brand", "unit", "type"].includes(kind) && (
        <GenericReferenceFields
          kind={kind}
          details={form.details}
          rules={form.rules}
          setDetail={form.setDetail}
        />
      )}

      {form.error && (
        <p className="text-sm font-semibold text-coral-500 sm:col-span-2">
          {form.error}
        </p>
      )}

      <Button
        className="sticky bottom-0 sm:col-span-2"
        variant="primary"
        disabled={form.saveDisabled}
        onClick={form.save}
      >
        {form.pending
          ? "Salvando..."
          : record
            ? "Salvar alterações"
            : "Cadastrar"}
      </Button>
    </div>
  );
}
