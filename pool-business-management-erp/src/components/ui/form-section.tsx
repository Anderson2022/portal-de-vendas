import { Card } from "./card";
export function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="neu flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
          {step}
        </span>
        <div>
          <h2 className="font-extrabold">{title}</h2>
          <p className="mt-1 text-xs text-ink-500">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}
