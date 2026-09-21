export function formValue(
  fd: FormData,
  key: string
): string {
  return String(fd.get(key) ?? "").trim();
}

export function formNumber(
  fd: FormData,
  key: string
): number {
  const raw = formValue(fd, key)
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formBoolean(
  fd: FormData,
  key: string
): boolean {
  const value = fd.get(key);

  return (
    value === "true" ||
    value === "on" ||
    value === "1"
  );
}

export function formOptional(
  fd: FormData,
  key: string
): string | null {
  const value = formValue(fd, key);

  return value || null;
}