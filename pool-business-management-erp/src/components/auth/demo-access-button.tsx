"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startDemoSession } from "@/lib/demonstracao/demo-storage";

export function DemoAccessButton() {
  const [error, setError] = useState("");
  return (
    <div className="mt-5 border-t border-white/60 pt-5">
      <Button
        className="w-full"
        onClick={() => {
          try {
            startDemoSession();
            window.location.assign("/demonstracao");
          } catch {
            setError(
              "Permita o armazenamento do navegador para abrir a demonstração.",
            );
          }
        }}
      >
        Experimentar demonstração
      </Button>
      <p className="mt-2 text-center text-xs text-ink-500">
        Dados de exemplo. As alterações são apagadas ao sair.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-xs text-coral-500">
          {error}
        </p>
      )}
    </div>
  );
}
