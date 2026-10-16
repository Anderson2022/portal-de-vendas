import { PdvWorkPanelSalePanel } from "./pdv-work-panel-sale-panel";
import { PdvWorkPanelWorkContent } from "./pdv-work-panel-work-content";
export function PdvPosLayout() {
  return (
    <div className="pos-layout">
      <PdvWorkPanelWorkContent />
      <PdvWorkPanelSalePanel />
    </div>
  );
}
