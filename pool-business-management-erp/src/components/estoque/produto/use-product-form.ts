"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/estoque/create-product";
import { exportProductSheet } from "@/lib/estoque/export-product-sheet";
import type { ProductFormProps, ProductTab, ProductType } from "./product-types";

export function useProductForm({ onPendingChange, product }: Pick<ProductFormProps, "onPendingChange" | "product">) {
  const [tab, setTab] = useState<ProductTab>("basic");
  const [productType, setProductType] = useState<ProductType>((product?.values.productType as ProductType) || "STANDARD");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [savedProductId, setSavedProductId] = useState("");
  const [warning, setWarning] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef<FormData | null>(null);
  const router = useRouter();

  useEffect(() => { onPendingChange?.(pending); }, [pending, onPendingChange]);
  useEffect(() => {
    const form = formRef.current;
    if (!form || !product) return;
    Object.entries(product.values).forEach(([name, value]) => {
      const fields = form.elements.namedItem(name);
      const field = fields instanceof RadioNodeList ? fields[0] : fields;
      if (field instanceof HTMLInputElement) {
        if (field.type === "checkbox") field.checked = value === "true";
        else field.value = value;
      } else if (field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) field.value = value;
    });
  }, [product]);

  function snapshot(form: HTMLFormElement) {
    const data = new FormData(form);
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name]').forEach((input) => {
      data.set(input.name, String(input.checked));
    });
    return data;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || done) return;
    const form = event.currentTarget;
    const invalid = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input:invalid, select:invalid, textarea:invalid");
    if (invalid) {
      const panel = invalid.closest<HTMLElement>("[data-product-tab]");
      if (panel) setTab(panel.dataset.productTab as ProductTab);
      requestAnimationFrame(() => { invalid.focus(); invalid.reportValidity(); });
      return;
    }
    const data = snapshot(form);
    setError("");
    startTransition(async () => {
      try {
        const result = await createProduct(data, product?.id || savedProductId || undefined);
        setSavedProductId(result.id);
        submitted.current = data;
        setWarning(result.warning || "");
        setDone(true);
        router.refresh();
        window.setTimeout(() => setDone(false), 1400);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Não foi possível cadastrar o produto. Tente novamente.");
      }
    });
  }

  function exportSheet() {
    const data = submitted.current || (formRef.current ? snapshot(formRef.current) : null);
    if (data) exportProductSheet(data);
  }

  return { tab, setTab, productType, setProductType, error, done, warning, pending, formRef, submit, exportSheet };
}
