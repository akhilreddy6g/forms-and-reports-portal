"use client";

import type { AuditFindingField, AuditFindingOption } from "@/lib/forms/schema";
import { RadioPills } from "@/components/ui/RadioPills";
import { TextArea } from "@/components/ui/TextArea";

type AuditFindingValue = { finding: AuditFindingOption | ""; evidenceText?: string };

export function AuditFindingFieldView({
  field,
  value,
  onChangeAction,
}: {
  field: AuditFindingField;
  value: { finding?: string; evidenceText?: string };
  onChangeAction: (v: AuditFindingValue) => void;
}) {
  const current: AuditFindingValue = {
    finding: (value.finding ?? "") as AuditFindingOption | "",
    evidenceText: value.evidenceText ?? "",
  };

  return (
    <div className="flex flex-col gap-3">
      <RadioPills
        value={current.finding}
        options={field.findingOptions}
        onChangeAction={(v) => onChangeAction({ ...current, finding: v })}
      />
      <TextArea
        placeholder="Evidence / notes…"
        value={current.evidenceText}
        onChange={(e) => onChangeAction({ ...current, evidenceText: e.target.value })}
      />
    </div>
  );
}