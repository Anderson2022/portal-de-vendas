import { ImagePlus } from "lucide-react";

export function ImagesTab() {
  return (
    <div className="rounded-[22px] border border-dashed border-sky-200 bg-sky-50/40 p-10 text-center">
      <ImagePlus className="mx-auto mb-3 text-sky-500" size={34} />

      <div className="text-[14px] font-extrabold text-ink-900">
        Imagens do recebimento
      </div>

      <p className="mt-1 text-[12px] text-ink-400">
        Área preparada para fotos da nota, produtos e conferência física.
      </p>

      <input
        name="images"
        type="file"
        multiple
        accept="image/*"
        className="mt-5 text-[12px]"
      />
    </div>
  );
}
