import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DemoSectionHeader } from "../shared/demo-section-header";
import { DemoClientForm } from "./demo-client-form";
import { DemoClientsTable } from "./demo-clients-table";
import type { DemoClient } from "@/lib/demonstracao/types/demo-client";

export function DemoClients({
  clients,
  onSave,
  error,
}: {
  clients: DemoClient[];
  error?: string;
  onSave: (client: DemoClient) => boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DemoSectionHeader
        title="Clientes"
        action="Novo cliente"
        onAdd={() => setOpen(true)}
      />
      <DemoClientsTable clients={clients} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo cliente · Demonstração"
      >
        {error && (
          <p role="alert" className="mb-4 text-sm text-coral-500">
            {error}
          </p>
        )}
        <DemoClientForm
          onCancel={() => setOpen(false)}
          onSave={(client) => {
            if (onSave(client)) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
