import { FileSearch } from "lucide-react";
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-10 text-center">
      <FileSearch className="text-ink-300" size={32} />
      <h3 className="font-bold">{title}</h3>
      <p className="max-w-md text-sm text-ink-500">{description}</p>
    </div>
  );
}
