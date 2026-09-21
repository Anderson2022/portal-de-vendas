import type { ReactNode } from "react";
import { cx } from "./cx";

export function IconTile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx("icon-tile", className)}>{children}</div>;
}
