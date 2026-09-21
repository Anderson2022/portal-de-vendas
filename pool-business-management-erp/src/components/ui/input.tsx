import type { ComponentProps } from "react";
export function Input({
  className = "input",
  ...props
}: ComponentProps<"input">) {
  return <input className={className} {...props} />;
}
