import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export function Card({
  className,
  children,
  hover,
  as: Tag = "div",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  hover?: boolean;
}) {
  return (
    <Tag className={cx("card", hover && "card-hover", className)} {...props}>
      {children}
    </Tag>
  );
}
