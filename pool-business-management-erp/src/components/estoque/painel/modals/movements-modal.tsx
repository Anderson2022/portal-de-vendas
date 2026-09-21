"use client";

import { Modal } from "@/components/ui/modal";
import { StockMovements } from "../stock-movements";
import type { StockOverviewData } from "../stock-overview-types";

type Props = {
  s: StockOverviewData;
  onClose: () => void;
};

export function MovementsModal({ s, onClose }: Props) {
  return (
    <Modal
      open
      title="Últimas movimentações"
      width="max-w-5xl"
      onClose={onClose}
    >
      <StockMovements s={s} />
    </Modal>
  );
}
