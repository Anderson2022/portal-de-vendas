"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LookupKind } from "../../produto/lookup/lookup-types";
import { ActiveField } from "./active-field";
import type {
  ProductReferenceDetails,
  ProductReferenceRules,
  SetProductReferenceDetail,
} from "../types/product-reference-form-types";

type GenericReferenceFieldsProps = {
  kind: LookupKind;
  details: ProductReferenceDetails;
  rules: ProductReferenceRules;
  setDetail: SetProductReferenceDetail;
};

export function GenericReferenceFields({
  kind,
  details,
  rules,
  setDetail,
}: GenericReferenceFieldsProps) {
  return (
    <>
      <Textarea
        className="sm:col-span-2"
        rows={3}
        value={details.description}
        onChange={(event) =>
          setDetail("description", event.target.value)
        }
        placeholder="Descrição completa"
      />

      {kind === "supplier" && (
        <Input
          value={details.documentNumber}
          onChange={(event) =>
            setDetail("documentNumber", event.target.value)
          }
          placeholder="CPF / CNPJ"
        />
      )}

      {rules.hasContact && (
        <Input
          value={details.phone}
          onChange={(event) =>
            setDetail("phone", event.target.value)
          }
          placeholder="Telefone / contato"
        />
      )}

      {rules.hasContact && kind !== "brand" && (
        <Input
          type="email"
          value={details.email}
          onChange={(event) =>
            setDetail("email", event.target.value)
          }
          placeholder="E-mail"
        />
      )}

      {rules.hasAddress && (
        <>
          <Input
            value={details.address}
            onChange={(event) =>
              setDetail("address", event.target.value)
            }
            placeholder="Endereço"
          />
          <Input
            value={details.city}
            onChange={(event) =>
              setDetail("city", event.target.value)
            }
            placeholder="Cidade"
          />
          <Input
            maxLength={2}
            value={details.state}
            onChange={(event) =>
              setDetail("state", event.target.value.toUpperCase())
            }
            placeholder="UF"
          />
        </>
      )}

      {rules.hasWebsite && (
        <Input
          type="url"
          value={details.website}
          onChange={(event) =>
            setDetail("website", event.target.value)
          }
          placeholder="Site"
        />
      )}

      {rules.hasNotes && (
        <Textarea
          className="sm:col-span-2"
          rows={3}
          value={details.notes}
          onChange={(event) =>
            setDetail("notes", event.target.value)
          }
          placeholder="Observações"
        />
      )}

      <ActiveField
        checked={details.active}
        onChange={(value) => setDetail("active", value)}
      />
    </>
  );
}
