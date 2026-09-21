"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { StockMovementForm } from "./stock-movement-form";
import type { Option } from "./movement-types";

type Props = {
  products: Option[];
  warehouses: Option[];
  suppliers?: Option[];
  menuItem?: boolean;
};

export function StockMovementButton({
  products,
  warehouses,
  suppliers = [],
  menuItem = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setOpen(true)}
        className={menuItem ? "w-full justify-start rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-white/70" : "btn btn-neu"}
      >
        <ArrowRightLeft size={16} />
        {menuItem ? "+ Nova movimentação" : "Nova movimentação"}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova movimentação"
        width="max-w-4xl"
      >
        <StockMovementForm
          products={products}
          warehouses={warehouses}
          suppliers={suppliers}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
