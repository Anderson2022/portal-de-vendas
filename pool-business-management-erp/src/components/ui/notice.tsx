export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      role={error ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-coral-100 text-coral-500" : "bg-mint-100 text-mint-600"}`}
    >
      {children}
    </div>
  );
}
