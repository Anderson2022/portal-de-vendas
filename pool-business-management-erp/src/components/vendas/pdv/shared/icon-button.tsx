import type { LucideIcon } from "lucide-react";
export function IconButton({
  icon: Icon,
  onClick,
  label,
  className = "",
}: {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      className={`icon-btn ${className}`}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={18} />
    </button>
  );
}
