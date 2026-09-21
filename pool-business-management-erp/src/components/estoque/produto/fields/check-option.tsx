type Props = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};

export function CheckOption({
  name,
  label,
  defaultChecked = false,
}: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4"
      />

      <span className="text-[12px] font-bold text-ink-700">
        {label}
      </span>
    </label>
  );
}
