"use client";

import type { Field, FormAnswers } from "@/lib/forms/schema";
import { FieldShell } from "@/components/ui/FieldShell";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { RadioPills } from "@/components/ui/RadioPills";
import { BooleanFieldView } from "./BooleanFieldView";
import { MultiTextFieldView } from "./MultiTextFieldView";
import { TableFieldView } from "./TableFieldView";
import { ObjectFieldView } from "./ObjectFieldView";
import { AuditFindingFieldView } from "./AuditFindingFieldView";

export function FieldRenderer({
  field,
  answers,
  setAnswerAction,
}: {
  field: Field;
  answers: FormAnswers;
  setAnswerAction: (id: string, v: unknown) => void;
}) {
  const value = answers[field.id];

  switch (field.type) {
    case "text":
    case "tel":
    case "date":
      return (
        <FieldShell label={field.label} required={field.required}>
          <TextInput
            type={field.type === "text" ? "text" : field.type}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setAnswerAction(field.id, e.target.value)}
          />
        </FieldShell>
      );

    case "textarea":
      return (
        <FieldShell label={field.label} required={field.required}>
          <TextArea value={typeof value === "string" ? value : ""} onChange={(e) => setAnswerAction(field.id, e.target.value)} />
        </FieldShell>
      );

    case "yesNo":
    return (
        <FieldShell label={field.label} required={field.required}>
        <RadioPills
            value={(typeof value === "string" ? value : "") as "" | "Yes" | "NO"}
            options={field.options}
            onChangeAction={(v) => setAnswerAction(field.id, v)}
        />
        </FieldShell>
    );
    
    case "triState":
    return (
        <FieldShell label={field.label} required={field.required}>
        <RadioPills
            value={(typeof value === "string" ? value : "") as "" | "Yes" | "NO" | "NA"}
            options={field.options}
            onChangeAction={(v) => setAnswerAction(field.id, v)}
        />
        </FieldShell>
    );

    case "boolean":
      return (
        <BooleanFieldView
        value={Boolean(value)}
        onChangeAction={(v) => setAnswerAction(field.id, v)}
      />
      );

    case "multiText":
      return (
        <FieldShell label={field.label} required={field.required}>
          <MultiTextFieldView value={Array.isArray(value) ? (value as string[]) : []} onChangeAction={(v) => setAnswerAction(field.id, v)} />
        </FieldShell>
      );

    case "table":
      return (
        <FieldShell label={field.label} required={field.required}>
          <TableFieldView field={field} value={Array.isArray(value) ? value : []} onChangeAction={(v) => setAnswerAction(field.id, v)} />
        </FieldShell>
      );

    case "object":
      return (
        <FieldShell label={field.label} required={field.required}>
          <ObjectFieldView
            field={field}
            value={typeof value === "object" && value ? (value as Record<string, unknown>) : {}}
            onChangeAction={(v) => setAnswerAction(field.id, v)}
          />
        </FieldShell>
      );

    case "auditFinding":
      return (
        <FieldShell label={field.label} required={field.required}>
          <AuditFindingFieldView
            field={field}
            value={typeof value === "object" && value ? (value as any) : {}}
            onChangeAction={(v) => setAnswerAction(field.id, v)}
          />
        </FieldShell>
      );

    default:
      return null;
  }
}