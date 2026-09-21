export function exportProductSheet(data: FormData) {
  const fields = Object.fromEntries(Array.from(data.entries()).filter(([, value]) => typeof value === "string"));
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), fields }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `produto-${String(data.get("sku") || "ficha").replace(/[^a-zA-Z0-9_-]/g, "-")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
