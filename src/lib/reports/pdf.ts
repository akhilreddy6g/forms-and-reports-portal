import { PDFDocument, StandardFonts } from "pdf-lib";
import type { Field, FormAnswers, FormSchema } from "@/lib/forms/schema";

function stringifyAnswer(field: Field, value: unknown): string {
  if (value == null || value === "") return "—";

  switch (field.type) {
    case "boolean":
      return value ? "Yes" : "No";
    case "yesNo":
    case "triState":
      return String(value);
    case "multiText":
      return Array.isArray(value) ? value.filter(Boolean).join(", ") : "—";
    case "auditFinding": {
      const v = value as { finding?: string; evidenceText?: string };
      const f = (v?.finding ?? "").trim();
      const e = (v?.evidenceText ?? "").trim();
      return e ? `${f} — Evidence: ${e}` : f || "—";
    }
    case "table": {
      const rows = Array.isArray(value) ? value : [];
      return rows.length ? `Table rows: ${rows.length}` : "—";
    }
    case "object": {
      const obj = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
      const pairs = Object.entries(obj)
        .map(([k, v]) => {
          if (Array.isArray(v)) return `${k}: ${v.join(", ")}`;
          return `${k}: ${String(v ?? "").trim()}`;
        })
        .filter((s) => !s.endsWith(": "));
      return pairs.length ? pairs.join(" | ") : "—";
    }
    default:
      return String(value);
  }
}

function wrap(text: string, maxWidth: number, font: any, size: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildReportPdf(form: FormSchema, answers: FormAnswers) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 612;
  const PAGE_H = 792;
  const margin = 48;
  const maxW = PAGE_W - margin * 2;

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - margin;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - margin;
    }
  };

  // Title
  ensureSpace(40);
  page.drawText(form.title, { x: margin, y, size: 16, font: bold });
  y -= 22;

  page.drawText(`Form ID: ${form.id}`, { x: margin, y, size: 10, font: regular });
  y -= 14;

  page.drawText(`Source: ${form.source.name} (${form.source.type})`, {
    x: margin,
    y,
    size: 10,
    font: regular,
  });
  y -= 22;

  let qNum = 1;

  for (const section of form.sections) {
    ensureSpace(22);
    page.drawText(section.title, { x: margin, y, size: 12, font: bold });
    y -= 18;

    for (const field of section.fields) {
      const q = `${qNum}. ${field.label}`;
      const a = stringifyAnswer(field, answers[field.id]);

      const qLines = wrap(q, maxW, bold, 11);
      const aLines = wrap(a, maxW, regular, 11);

      for (const ln of qLines) {
        ensureSpace(16);
        page.drawText(ln, { x: margin, y, size: 11, font: bold });
        y -= 14;
      }
      for (const ln of aLines) {
        ensureSpace(16);
        page.drawText(ln, { x: margin, y, size: 11, font: regular });
        y -= 14;
      }

      y -= 6;
      qNum += 1;
    }

    y -= 8;
  }

  return pdf.save();
}