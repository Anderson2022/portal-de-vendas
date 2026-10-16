import { ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
export function Empty({
  icon: Icon = ShoppingBag,
  title,
  desc,
}: {
  icon?: LucideIcon;
  title: string;
  desc?: string;
}) {
  return (
    <div className="empty">
      <Icon size={40} />
      <strong>{title}</strong>
      {desc && <small>{desc}</small>}
    </div>
  );
}
