"use client";

import type { Dispatch, SetStateAction } from "react";
import type { LookupKind } from "../../produto/lookup/lookup-types";
import { DropdownMenu } from "./dropdown-menu";
import {
  ITEM_CLASS,
  TECHNICAL_OPTIONS,
} from "../constants/reference-menu-options";

type Props = {
  openMenu: string | null;
  setOpenMenu: Dispatch<SetStateAction<string | null>>;
  onSelect: (value: { kind: LookupKind; label: string }) => void;
};

export function TechnicalMenu({
  openMenu,
  setOpenMenu,
  onSelect,
}: Props) {
  const label = "Ficha técnica";

  return (
    <DropdownMenu
      label={label}
      open={openMenu === label}
      onToggle={() => setOpenMenu(openMenu === label ? null : label)}
    >
      {TECHNICAL_OPTIONS.map((value) => (
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
