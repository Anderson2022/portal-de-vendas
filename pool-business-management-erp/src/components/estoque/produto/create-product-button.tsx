"use client";

import { useState } from "react";
import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { ProductForm } from "./product-form";
import type { Option } from "./product-types";

type Props = {
  categories: Option[];
  brands: Option[];
  warehouses: Option[];
  suppliers?: Option[];
  menuItem?: boolean;
};

export function CreateProductButton({
  categories,
  brands,
  warehouses,
  suppliers = [],
  menuItem = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setOpen(true)}
        className={menuItem ? "w-full justify-start rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-white/70" : "btn btn-primary"}
      >
        <PackagePlus size={16} />
        {menuItem ? "+ Cadastrar produto" : "Cadastrar Produto"}
      </Button>

      <Modal
        open={open}
        onClose={() => { if (!pending) setOpen(false); }}
        title="Cadastrar Produto"
        width="max-w-6xl"
        height="h-[90vh]"
      >
        <ProductForm
          categories={categories}
          brands={brands}
          warehouses={warehouses}
          suppliers={suppliers}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          onPendingChange={setPending}
        />
      </Modal>
    </>
  );
}
