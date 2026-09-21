"use client";

import { Modal } from "@/components/ui/modal";
import type { Panel } from "../product-reference-menus";

type Props = {
  panel: Extract<Panel, "locations" | "reasons">;
  onClose: () => void;
};

const TITLES: Record<Props["panel"], string> = {
  locations: "Localização",
  reasons: "Motivos de ajuste",
};

export function PendingOperationModal({ panel, onClose }: Props) {
  return (
    <Modal
      open
      title={TITLES[panel]}
      onClose={onClose}
    >
      <p className="text-sm text-ink-500">
        Este módulo ainda não possui operação disponível.
      </p>
    </Modal>
  );
}
