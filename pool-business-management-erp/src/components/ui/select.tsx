import type { ComponentProps } from "react";
export function Select({
  className = "input",
  ...props
}: ComponentProps<"select">) {
  return <select className={className} {...props} />;
}
