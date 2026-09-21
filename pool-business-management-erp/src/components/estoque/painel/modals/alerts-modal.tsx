"use client";

import { Modal } from "@/components/ui/modal";
import { StockAlerts } from "../stock-alerts";
import type { StockOverviewData } from "../stock-overview-types";

type Props = {
  s: StockOverviewData;
  onClose: () => void;
};

export function AlertsModal({ s, onClose }: Props) {
  return (
    <Modal
      open
      title="Reposição necessária"
      width="max-w-5xl"
      onClose={onClose}
    >
      <StockAlerts
        alerts={s.rows.filter((row) => row.status !== "OK")}
      />
    </Modal>
  );
}
