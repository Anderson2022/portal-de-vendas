import type { UtilityProps } from "./utility-props";
import { UtilityProvider } from "./utility-context";
import { UtilityContent } from "./utility-content";
export function UtilityPage(props: UtilityProps) {
  return (
    <UtilityProvider {...props}>
      <UtilityContent />
    </UtilityProvider>
  );
}
