"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductSection } from "../product-section";
import { useProductLookup } from "../lookup/product-lookup-provider";

export function MediaSection() {
  const lookup = useProductLookup();
  const [image, setImage] = useState(() => lookup.initial("imageDataUrl"));
  const [error, setError] = useState("");
  return (
    <ProductSection icon={<ImagePlus size={17} />} title="Imagem e observações" description="A imagem é incluída na ficha exportada. Não é enviada ao cadastro atual.">
      <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink-300 bg-white/50">
          {image ? (
            // Local data URL: no image hosting or optimization service is involved.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Prévia do produto" className="h-40 w-full object-contain" />
          ) : <ImagePlus size={36} className="text-ink-300" />}
        </div>
        <div className="space-y-3">
          <Field label="Imagem do produto" hint="PNG, JPEG ou WebP, até 2 MB.">
            <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
                setError("Escolha uma imagem PNG, JPEG ou WebP de até 2 MB.");
                event.target.value = "";
                return;
              }
              setError("");
              const reader = new FileReader();
              reader.onload = () => setImage(String(reader.result));
              reader.onerror = () => setError("Não foi possível ler a imagem.");
              reader.readAsDataURL(file);
            }} />
          </Field>
          <Input type="hidden" name="imageDataUrl" value={image} />
          {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}
          {image && <Button onClick={() => setImage("")}>Remover imagem</Button>}
        </div>
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
          <Field label="Observações internas"><Textarea name="internalNotes" rows={4} maxLength={5000} /></Field>
          <Field label="Orientações para venda e instalação"><Textarea name="salesNotes" rows={4} maxLength={5000} /></Field>
        </div>
      </div>
    </ProductSection>
  );
}
