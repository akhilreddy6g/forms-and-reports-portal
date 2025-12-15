import type { ReactNode } from "react";

export function FieldShell({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-semibold text-app-text">{label}</label>
        {required ? <span className="text-xs text-app-muted">(required)</span> : null}
      </div>
      {children}
    </div>
  );
}