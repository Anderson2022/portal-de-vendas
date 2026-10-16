"use client";
import { PdvProvider } from "./pdv-context";
import { PdvWorkspace } from "./pdv-workspace";
export function PdvInterface() {
  return (
    <div className="poolcontrol-pdv">
      <PdvProvider>
        <PdvWorkspace />
      </PdvProvider>
    </div>
  );
}
