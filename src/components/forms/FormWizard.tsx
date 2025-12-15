"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Field, FormAnswers, FormSchema, FormSection } from "@/lib/forms/schema";
import { useAutosavedAnswers } from "@/lib/forms/hooks/useAutosavedAnswers";
import { FieldRenderer } from "@/components/forms/fields/FieldRenderer";
import { SectionTabs } from "@/components/forms/SectionTabs";
import { Button } from "@/components/ui/Button";
import { buildReportPdf } from "@/lib/reports/pdf";
import {
  clearDraft,
  clearLastPdf,
  loadLastPdfBase64,
  saveLastPdfBase64,
} from "@/lib/forms/draft";

function downloadBytes(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes);

  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function bytesToBase64(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function isFilled(field: Field, value: unknown): boolean {
  if (!field.required) return true;

  switch (field.type) {
    case "text":
    case "tel":
    case "date":
    case "textarea":
    case "yesNo":
    case "triState":
      return typeof value === "string" && value.trim().length > 0;

    case "boolean":
      // Required boolean: must be true (most common/expected semantics)
      return value === true;

    case "multiText":
      return (
        Array.isArray(value) &&
        value.some((v) => typeof v === "string" && v.trim().length > 0)
      );

    case "auditFinding": {
      const v = (value ?? {}) as { finding?: string; evidenceText?: string };
      const findingOk = typeof v.finding === "string" && v.finding.trim().length > 0;

      const evidenceRequired = Boolean(field.evidence?.required);
      const evidenceOk = evidenceRequired
        ? typeof v.evidenceText === "string" && v.evidenceText.trim().length > 0
        : true;

      return findingOk && evidenceOk;
    }

    case "object": {
      const obj =
        typeof value === "object" && value ? (value as Record<string, unknown>) : {};
      // Required object: at least one non-empty property
      return Object.values(obj).some((vv) => {
        if (Array.isArray(vv)) return vv.length > 0;
        if (typeof vv === "string") return vv.trim().length > 0;
        return vv != null;
      });
    }

    case "table": {
      const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      if (!rows.length) return false;

      // Required table: each row must satisfy required columns
      return rows.every((row) =>
        field.columns.every((col) => {
          if (!col.required) return true;
          const cell = row[col.id];

          if (col.type === "multiText") return Array.isArray(cell) && cell.length > 0;
          if (col.type === "date" || col.type === "text")
            return typeof cell === "string" && cell.trim().length > 0;

          return true;
        })
      );
    }

    default:
      return true;
  }
}

function isSectionValid(section: FormSection, answers: FormAnswers): boolean {
  return section.fields.every((f) => isFilled(f, answers[f.id]));
}

function isFormValid(sections: FormSection[], answers: FormAnswers): boolean {
  return sections.every((s) => isSectionValid(s, answers));
}

export function FormWizard({ form }: { form: FormSchema }) {
  const router = useRouter();
  const { answers, setAnswers, clear } = useAutosavedAnswers(form.id);

  const [mode, setMode] = useState<"edit" | "done">("edit");
  const [busy, setBusy] = useState(false);

  const firstSectionId = form.sections[0]?.id ?? "meta";
  const [activeSectionId, setActiveSectionId] = useState(firstSectionId);

  const activeSection = useMemo(
    () =>
      form.sections.find((s) => s.id === activeSectionId) ?? form.sections[0],
    [form.sections, activeSectionId]
  );

  const setAnswer = (fieldId: string, v: unknown) =>
    setAnswers((prev) => ({ ...prev, [fieldId]: v }));

  const sectionIdx = form.sections.findIndex((s) => s.id === activeSectionId);
  const prev = sectionIdx > 0 ? form.sections[sectionIdx - 1] : undefined;
  const next =
    sectionIdx >= 0 && sectionIdx < form.sections.length - 1
      ? form.sections[sectionIdx + 1]
      : undefined;

  const lastSectionId = form.sections[form.sections.length - 1]?.id;
  const isLastSection = activeSectionId === lastSectionId;

  const currentSectionValid = activeSection
    ? isSectionValid(activeSection, answers)
    : true;

  const formValid = isFormValid(form.sections, answers);

  const canGoPrev = Boolean(prev);
  const canGoNext = Boolean(next) && currentSectionValid;
  const canGenerate = isLastSection && formValid && !busy;

  const generateReport = async () => {
    if (!canGenerate) return;

    setBusy(true);
    try {
      const bytes = await buildReportPdf(form, answers);
      saveLastPdfBase64(form.id, bytesToBase64(bytes));
      downloadBytes(bytes, `${form.id}.pdf`);
      setMode("done");
    } finally {
      setBusy(false);
    }
  };

  const downloadAgain = () => {
    const b64 = loadLastPdfBase64(form.id);
    if (!b64) return;
    downloadBytes(base64ToBytes(b64), `${form.id}.pdf`);
  };

  const clearAll = () => {
    clear();
    clearDraft(form.id);
    clearLastPdf(form.id);
    setActiveSectionId(firstSectionId);
    setMode("edit");
  };

  if (mode === "done") {
    return (
      <section className="flex flex-col gap-6 rounded-xl border border-app-border bg-app-bg p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-app-text">Report generated</h2>
          <p className="text-sm text-app-muted">Your PDF was downloaded. What next?</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" onClick={() => router.push("/")}>
            Start a new form
          </Button>
          <Button variant="edit" onClick={() => setMode("edit")}>
            Edit current form
          </Button>
          <Button variant="clear" onClick={clearAll}>
            Clear
          </Button>
          <Button variant="primary" onClick={downloadAgain}>
            Download current form
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-app-text">
          {form.title}
        </h1>
        <p className="text-sm text-app-muted">{form.source.evidence}</p>
      </div>

      <SectionTabs
        sections={form.sections}
        activeId={activeSectionId}
        onSelectAction={setActiveSectionId}
      />

      <div className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="flex flex-col gap-5">
          <div className="text-base font-semibold text-app-text">
            {activeSection?.title}
          </div>

          <div className="flex flex-col gap-5">
            {activeSection?.fields.map((f) => (
              <FieldRenderer
                key={f.id}
                field={f}
                answers={answers}
                setAnswerAction={setAnswer}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <Button
              variant="primary"
              type="button"
              disabled={!canGoPrev}
              onClick={() => prev && setActiveSectionId(prev.id)}
            >
              Previous
            </Button>

            <div className="flex flex-1 justify-end gap-3">
              {!isLastSection ? (
                <Button
                  variant="primary"
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => next && setActiveSectionId(next.id)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="button"
                  disabled={!canGenerate}
                  onClick={generateReport}
                >
                  {busy ? "Generating…" : "Generate Report"}
                </Button>
              )}
            </div>
          </div>

          {!isLastSection && !currentSectionValid ? (
            <p className="text-sm text-app-muted">
              Please complete required fields (*) to continue.
            </p>
          ) : null}
          {isLastSection && !formValid ? (
            <p className="text-sm text-app-muted">
              Please complete all required fields (*) before generating the report.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}