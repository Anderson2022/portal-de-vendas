export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Carregando financeiro"
      className="space-y-5 animate-pulse"
    >
      <div className="fin-subtle h-20 rounded-xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="fin-subtle h-28 rounded-xl" />
        ))}
      </div>
      <div className="fin-subtle h-80 rounded-xl" />
      <span className="sr-only">Carregando dados financeiros…</span>
    </div>
  );
}
