"use client";

import { useState } from "react";
import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StockEntryModal } from "./stock-entry-modal";
import type { Option } from "./stock-entry-types";

type Props = {
  products: Option[];
  suppliers: Option[];
  warehouses: Option[];
  costCenters?: Option[];
  onSubmit?: Parameters<typeof StockEntryModal>[0]["onSubmit"];
};

export function StockEntryButton({
  products,
  suppliers,
  warehouses,
  costCenters = [],
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary"
      >
        <PackagePlus size={16} />
        Nova entrada
      </Button>

      <StockEntryModal
        open={open}
        onClose={() => setOpen(false)}
        products={products}
        suppliers={suppliers}
        warehouses={warehouses}
        costCenters={costCenters}
        onSubmit={onSubmit}
      />
    </>
  );
}
