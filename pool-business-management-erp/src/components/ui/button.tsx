import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

type StyleProps = {
  variant?: "primary" | "secondary" | "danger" | "unstyled";
  className?: string;
  children: ReactNode;
};
const styles = (
  variant: StyleProps["variant"] = "secondary",
  className?: string,
) =>
  variant === "unstyled"
    ? className
    : cx(
        "btn disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" ? "btn-primary" : "btn-neu",
        variant === "danger" && "!text-coral-500",
        className,
      );
export function Button({
  variant,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button type={type} className={styles(variant, className)} {...props} />
  );
}
export function ButtonLink({
  variant,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={styles(variant, className)} {...props} />;
}
