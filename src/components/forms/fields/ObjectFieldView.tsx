"use client";

import type { ObjectField } from "@/lib/forms/schema";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { MultiTextFieldView } from "./MultiTextFieldView";

export function ObjectFieldView({
  field,
  value,
  onChangeAction,
}: {
  field: ObjectField;
  value: Record<string, unknown>;
  onChangeAction: (v: Record<string, unknown>) => void;
}) {
  const setProp = (k: string, v: unknown) => onChangeAction({ ...value, [k]: v });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-app-border bg-app-surface p-4">
      {Object.entries(field.properties).map(([k, p]) => {
        const v = value[k];
        return (
          <div key={k} className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-app-text">{p.label}</div>

            {p.type === "text" ? (
              <TextInput value={typeof v === "string" ? v : ""} onChange={(e) => setProp(k, e.target.value)} />
            ) : p.type === "textarea" ? (
              <TextArea value={typeof v === "string" ? v : ""} onChange={(e) => setProp(k, e.target.value)} />
            ) : (
              <MultiTextFieldView value={Array.isArray(v) ? (v as string[]) : []} onChangeAction={(arr) => setProp(k, arr)} />
            )}
          </div>
        );
      })}
    </div>
  );
}