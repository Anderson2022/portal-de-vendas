"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LookupKind } from "../../produto/lookup/lookup-types";
import type { ProductFormProps } from "../../produto/product-types";
import { CreateProductButton } from "../../produto/create-product-button";
import { DropdownMenu } from "./dropdown-menu";
import {
  ITEM_CLASS,
  REGISTRATION_OPTIONS,
} from "../constants/reference-menu-options";

type Props = {
  openMenu: string | null;
  setOpenMenu: Dispatch<SetStateAction<string | null>>;
  productOptions: Pick<
    ProductFormProps,
    "categories" | "brands" | "warehouses" | "suppliers"
  >;
  onSelect: (value: { kind: LookupKind; label: string }) => void;
};

export function RegistrationMenu({
  openMenu,
  setOpenMenu,
  productOptions,
  onSelect,
}: Props) {
  const label = "Cadastros";

  return (
    <DropdownMenu
      label={label}
      open={openMenu === label}
      onToggle={() => setOpenMenu(openMenu === label ? null : label)}
    >
      <CreateProductButton {...productOptions} menuItem />

      {REGISTRATION_OPTIONS.map((value) => (
        <button
          key={value.kind}
          className={ITEM_CLASS}
          onClick={() => onSelect(value)}
        >
          + Cadastrar {value.label}
        </button>
      ))}
    </DropdownMenu>
  );
}
