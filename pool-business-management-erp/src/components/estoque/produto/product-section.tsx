import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ProductSection({
  icon,
  title,
  description,
  children,
}: Props) {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/60 p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        {icon && (
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-inner">
            {icon}
          </div>
        )}

        <div>
          <h3 className="text-[14px] font-extrabold text-ink-900">
            {title}
          </h3>

          {description && (
            <p className="text-[12px] text-ink-300">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
