"use client";

export function BooleanFieldView({
  value,
  onChangeAction,
}: {
  value: boolean;
  onChangeAction: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChangeAction(e.target.checked)}
        className="h-4 w-4 accent-brand-primaryBtn"
      />
      <span className="text-sm text-app-text">Yes</span>
    </label>
  );
}