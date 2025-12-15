"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormSchema } from "@/lib/forms/schema";
import { useAutosavedAnswers } from "@/lib/forms/hooks/useAutosavedAnswers";
import { FieldRenderer } from "@/components/forms/fields/FieldRenderer";
import { SectionTabs } from "@/components/forms/SectionTabs";
import { Button } from "@/components/ui/Button";
import { buildReportPdf } from "@/lib/reports/pdf";
import { clearDraft, clearLastPdf, loadLastPdfBase64, saveLastPdfBase64 } from "@/lib/forms/draft";

function downloadBytes(bytes: Uint8Array, filename: string) {
    // Force a normal ArrayBuffer-backed copy (avoids SharedArrayBuffer typing)
    const copy = new Uint8Array(bytes); // copies data into a new ArrayBuffer
  
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

export function FormWizard({ form }: { form: FormSchema }) {
  const router = useRouter();
  const { answers, setAnswers, clear } = useAutosavedAnswers(form.id);

  const [mode, setMode] = useState<"edit" | "done">("edit");
  const [busy, setBusy] = useState(false);

  const firstSectionId = form.sections[0]?.id ?? "meta";
  const [activeSectionId, setActiveSectionId] = useState(firstSectionId);

  const activeSection = useMemo(
    () => form.sections.find((s) => s.id === activeSectionId) ?? form.sections[0],
    [form.sections, activeSectionId]
  );

  const setAnswer = (fieldId: string, v: unknown) => setAnswers((prev) => ({ ...prev, [fieldId]: v }));

  const generateReport = async () => {
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

  const idx = form.sections.findIndex((s) => s.id === activeSectionId);
  const prev = form.sections[idx - 1];
  const next = form.sections[idx + 1];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-app-text">{form.title}</h1>
        <p className="text-sm text-app-muted">{form.source.evidence}</p>
      </div>

      <SectionTabs sections={form.sections} activeId={activeSectionId} onSelectAction={setActiveSectionId} />

      <div className="rounded-xl border border-app-border bg-app-surface p-6">
        <div className="flex flex-col gap-5">
          <div className="text-base font-semibold text-app-text">{activeSection.title}</div>

          <div className="flex flex-col gap-5">
            {activeSection.fields.map((f) => (
              <FieldRenderer key={f.id} field={f} answers={answers} setAnswerAction={setAnswer} />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <Button variant="secondary" type="button" onClick={() => prev && setActiveSectionId(prev.id)} disabled={!prev}>
              Previous
            </Button>

            <div className="flex flex-1 justify-end gap-3">
              <Button variant="secondary" type="button" onClick={() => next && setActiveSectionId(next.id)} disabled={!next}>
                Next
              </Button>
              <Button variant="primary" type="button" onClick={generateReport} disabled={busy}>
                {busy ? "Generating…" : "Generate Report"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}