import { Paperclip } from "lucide-react";

export function AttachmentsTab() {
  return (
    <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/60 p-10 text-center">
      <Paperclip className="mx-auto mb-3 text-slate-500" size={34} />

      <div className="text-[14px] font-extrabold text-ink-900">
        Anexos
      </div>

      <p className="mt-1 text-[12px] text-ink-400">
        XML, PDF da nota fiscal, comprovantes e outros documentos.
      </p>

      <input
        name="attachments"
        type="file"
        multiple
        accept=".xml,.pdf,.jpg,.jpeg,.png"
        className="mt-5 text-[12px]"
      />
    </div>
  );
}
