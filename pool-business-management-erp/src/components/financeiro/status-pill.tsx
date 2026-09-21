export function StatusPill({ status }: { status: string }) {
  const overdue = status.toLowerCase().includes("vencido");
  return (
    <span className={
      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold " +
      (overdue ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")
    }>
      {status}
    </span>
  );
}
