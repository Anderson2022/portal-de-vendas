import type { FormOptions } from "@/lib/commercial/domain";
import type { CommercialQuote } from "@/lib/commercial/queries";

export type DocumentFormProps = {
  options: FormOptions;
  quote?: CommercialQuote;
  kind?: "quote" | "sale";
};
