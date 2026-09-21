import { cx } from "./cx";

export function Bar({
  value,
  tone,
  className,
}: {
  value: number;
  tone?: "green" | "amber";
  className?: string;
}) {
  const w = Math.max(2, Math.min(100, value));
  return (
    <div
      className={cx(
        "bar",
        tone === "green" && "bar-green",
        tone === "amber" && "bar-amber",
        className,
      )}
    >
      <span style={{ width: `${w}%` }} />
    </div>
  );
}
