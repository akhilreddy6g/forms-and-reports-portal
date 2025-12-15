"use client";

export function RadioPills<T extends string>({
  value,
  options,
  onChangeAction,
}: {
  value: T | "";
  options: readonly T[];
  onChangeAction: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChangeAction(opt)}
            className={[
              "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
              active
                ? "bg-brand-primaryBtn text-app-textOnDark"
                : "bg-app-surface text-app-text border border-app-border",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}