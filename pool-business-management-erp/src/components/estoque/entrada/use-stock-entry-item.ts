"use client";

import { useMemo, useState } from "react";
import type { Option, StockEntryItem } from "./stock-entry-types";

export function useStockEntryItem({ products, onAdd }: { products: Option[]; onAdd: (item: StockEntryItem) => void }) {
  const [productId, setProductId] = useState("");
  const [unit, setUnit] = useState("UN");
  const [quantity, setQuantity] = useState("1");
  const [unitCost, setUnitCost] = useState("0");
  const [salePrice, setSalePrice] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [notes, setNotes] = useState("");

  const total = useMemo(() => {
    const qty = Number(quantity) || 0;
    const cost = Number(unitCost) || 0;
    const disc = Number(discount) || 0;
    return Math.max(0, qty * cost - disc);
  }, [quantity, unitCost, discount]);

  function addItem() {
    if (!productId) return;

    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const qty = Number(quantity) || 0;
    if (qty <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      productId,
      productName: product.name,
      unit,
      quantity: qty,
      unitCost: Number(unitCost) || 0,
      salePrice: Number(salePrice) || 0,
      discount: Number(discount) || 0,
      total,
      batchNumber: batchNumber || undefined,
      expirationDate: expirationDate || undefined,
      serialNumber: serialNumber || undefined,
      notes: notes || undefined,
    });

    setProductId("");
    setUnit("UN");
    setQuantity("1");
    setUnitCost("0");
    setSalePrice("0");
    setDiscount("0");
    setBatchNumber("");
    setExpirationDate("");
    setSerialNumber("");
    setNotes("");
  }

  return { productId, setProductId, unit, setUnit, quantity, setQuantity, unitCost, setUnitCost, salePrice, setSalePrice, discount, setDiscount, batchNumber, setBatchNumber, expirationDate, setExpirationDate, serialNumber, setSerialNumber, notes, setNotes, total, addItem };
}

export type StockEntryItemState = ReturnType<typeof useStockEntryItem>;
