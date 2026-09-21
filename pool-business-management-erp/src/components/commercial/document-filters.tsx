import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
export function DocumentFilters({
  search,
  onSearch,
  status,
  onStatus,
  statuses,
  count,
}: {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  statuses: { value: string; label: string }[];
  count: number;
}) {
  return (
    <div className="mb-6 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_200px_auto]">
      <Field label="Buscar">
        <Input
          type="search"
          className="input"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cliente, número ou projeto..."
        />
      </Field>
      <Field label="Status">
        <Select
          className="input"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>
      <span aria-live="polite" className="pb-3 text-xs text-ink-500">
        {count} resultados
      </span>
    </div>
  );
}
