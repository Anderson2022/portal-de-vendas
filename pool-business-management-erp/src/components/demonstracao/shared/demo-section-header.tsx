import { PageIntro } from "@/components/ui/page-intro";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DemoSectionHeader({
  title,
  action,
  onAdd,
}: {
  title: string;
  action: string;
  onAdd: () => void;
}) {
  return (
    <PageIntro
      crumbs={[{ label: "Demonstração" }, { label: title }]}
      title={title}
      right={
        <Button variant="primary" onClick={onAdd}>
          <Plus size={16} />
          {action}
        </Button>
      }
    />
  );
}
