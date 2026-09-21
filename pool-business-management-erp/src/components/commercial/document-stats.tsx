import { Card } from "@/components/ui/card";
export function DocumentStats({
  items,
}: {
  items: { label: string; value: string; hint: string }[];
}) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className="p-5">
          <p className="text-xs font-bold text-ink-500">{i.label}</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums">{i.value}</p>
          <p className="mt-2 text-xs text-ink-500">{i.hint}</p>
        </Card>
      ))}
    </div>
  );
}
