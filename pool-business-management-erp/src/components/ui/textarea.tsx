import type { ComponentProps } from "react";
export function Textarea({
  className = "input",
  ...props
}: ComponentProps<"textarea">) {
  return <textarea className={className} {...props} />;
}
