"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { createPayable } from "@/lib/financeiro/services/create-payable";
import { Can } from "../shared/financial-context";
import { PayableForm } from "./payable-form/payable-form";

export function CreatePayableDialog({
  suppliers = [],
}: {
  suppliers?: Array<{ id: string; name: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  const router = useRouter();

  function close() {
    if (!pending) setOpen(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await createPayable(new FormData(event.currentTarget));
      if (result.ok) {
        setOpen(false);
        setMessage(result.message);
        router.refresh();
      } else setError(result.message);
    } catch {
      setError(
        "Conexão interrompida. Consulte a lista antes de repetir o cadastro.",
      );
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  return (
    <Can action="create">
      <button
        className="fin-button fin-primary"
        onClick={() => {
          setError("");
          setMessage("");
          setOpen(true);
        }}
      >
        + Nova conta a pagar
      </button>
      {message && (
        <p role="status" className="fin-notice">
          {message}
        </p>
      )}
      <Modal
        open={open}
        onClose={close}
        title="Nova conta a pagar"
        width="max-w-[1500px]"
        height="h-[min(900px,calc(100vh-2rem))]"
      >
        <div className="-mx-6 -mb-6 flex min-h-full">
          <PayableForm
            suppliers={suppliers}
            pending={pending}
            error={error}
            onCancel={close}
            onSubmit={submit}
          />
        </div>
      </Modal>
    </Can>
  );
}
