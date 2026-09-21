import assert from "node:assert/strict";
import { test } from "node:test";
import { cents,validateDocument,type DocumentInput } from "../src/lib/commercial/domain";
test("validação monetária, quantidades, datas e descontos", () => {
  assert.equal(cents("1.234,56"), 123456);
  assert.equal(cents("0.29"), 29);
  assert.equal(cents("1234.56"), 123456);
  const input: DocumentInput = {
    customerId: "11111111-1111-4111-8111-111111111111",
    salespersonId: null,
    project: "Teste",
    validUntil: "2026-09-30",
    notes: "",
    discount: "10",
    items: [
      {
        key: "1",
        description: "Item",
        qty: "2",
        unitPrice: "100.45",
        unitCost: "40",
      },
    ],
  };
  assert.equal(validateDocument(input).total, 19090);
  assert.throws(() => validateDocument({ ...input, discount: "201" }));
  assert.throws(() => validateDocument({ ...input, validUntil: "2026-02-30" }));
  assert.throws(() =>
    validateDocument({ ...input, items: [{ ...input.items[0], qty: "-1" }] }),
  );
  assert.throws(() =>
    validateDocument({ ...input, items: [{ ...input.items[0], qty: "1.5" }] }),
  );
  assert.throws(() =>
    validateDocument({
      ...input,
      items: [{ ...input.items[0], unitPrice: "NaN" }],
    }),
  );
});