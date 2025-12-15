import { PDFDocument, StandardFonts } from "pdf-lib";
import type { Field, FormAnswers, FormSchema } from "@/lib/forms/schema";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function formatPrimitive(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v.trim() ? v.trim() : "—";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function toSentenceCase(key: string): string {
    const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

function stringifyAnswer(field: Field, value: unknown): string {
  if (value == null || value === "") return "—";

  switch (field.type) {
    case "boolean":
      return value === true ? "Yes" : "No";

    case "yesNo":
    case "triState":
      return formatPrimitive(value);

    case "multiText":
      return Array.isArray(value)
        ? (value as unknown[])
            .map((v) => (typeof v === "string" ? v.trim() : String(v)))
            .filter((v) => typeof v === "string" && v.length > 0)
            .join(", ") || "—"
        : "—";

    case "auditFinding": {
      const v = (value ?? {}) as { finding?: string; evidenceText?: string };
      const f = (v.finding ?? "").trim();
      const e = (v.evidenceText ?? "").trim();
      if (!f && !e) return "—";
      return e ? `${f || "—"} — Evidence: ${e}` : f || "—";
    }

    case "table": {
      const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      if (!rows.length) return "—";

      // Print every row + every column, regardless of value type
      return rows
        .map((row, i) => {
          const parts = field.columns.map((col) => {
            const cell = row[col.id];

            let cellStr = "—";
            if (col.type === "multiText") {
              cellStr = Array.isArray(cell)
                ? (cell as unknown[])
                    .map((x) => (typeof x === "string" ? x.trim() : String(x)))
                    .filter((s) => s.length > 0)
                    .join(", ") || "—"
                : "—";
            } else {
              cellStr = formatPrimitive(cell);
            }

            return `${col.label}: ${cellStr}`;
          });

          return `Row ${i + 1}: ${parts.join(" | ")}`;
        })
        .join("\n");
    }

    case "object": {
        const obj =
          typeof value === "object" && value ? (value as Record<string, unknown>) : {};
      
        const lines = Object.entries(obj)
          .map(([k, v]) => {
            const label = toSentenceCase(k);
      
            if (Array.isArray(v)) {
              const arr = v
                .map((x) => (typeof x === "string" ? x.trim() : String(x)))
                .filter((s) => s.length > 0);
      
              return arr.length ? `${label}: ${arr.join(", ")}` : "";
            }
      
            if (typeof v === "string") {
              const s = v.trim();
              return s ? `${label}: ${s}` : "";
            }
      
            if (typeof v === "number" && Number.isFinite(v)) return `${label}: ${v}`;
            if (typeof v === "boolean") return `${label}: ${v ? "Yes" : "No"}`;
            if (v == null) return "";
      
            return `${label}: ${String(v)}`;
          })
          .filter((s) => s.length > 0);
      
        return lines.length ? lines.join("\n") : "—";
      }

    default:
      return formatPrimitive(value);
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

function drawTable(opts: {
    page: any;
    ensureSpace: (needed: number) => void;
    margin: number;
    yRef: { y: number };
    maxW: number;
    font: any;
    bold: any;
    fontSize: number;
    headers: string[];
    rows: string[][];
  }) {
    const {
      page,
      ensureSpace,
      margin,
      yRef,
      maxW,
      font,
      bold,
      fontSize,
      headers,
      rows,
    } = opts;
  
    const padX = 6;
    const padY = 5;
    const lineH = fontSize + 5;
  
    const colCount = Math.max(1, headers.length);
    const colW = Math.floor(maxW / colCount);
  
    const rowHeightFor = (cells: string[]) => {
      const linesPerCell = cells.map((cell) => {
        const lines = wrap(cell || "—", colW - padX * 2, font, fontSize);
        return Math.max(1, lines.length);
      });
      const maxLines = Math.max(...linesPerCell);
      return padY * 2 + maxLines * lineH;
    };
  
    const drawRow = (cells: string[], isHeader: boolean) => {
      const rowH = rowHeightFor(cells);
      ensureSpace(rowH + 8);
  
      const yTop = yRef.y;
      const yBottom = yTop - rowH;
  
      for (let c = 0; c < colCount; c++) {
        const x = margin + c * colW;
  
        // cell border
        page.drawRectangle({
          x,
          y: yBottom,
          width: colW,
          height: rowH,
          borderWidth: 1,
          borderColor: undefined,
        });
  
        const text = cells[c] ?? "—";
        const lines = wrap(text || "—", colW - padX * 2, isHeader ? bold : font, fontSize);
  
        let ty = yTop - padY - fontSize;
        for (const ln of lines) {
          page.drawText(ln, {
            x: x + padX,
            y: ty,
            size: fontSize,
            font: isHeader ? bold : font,
          });
          ty -= lineH;
        }
      }
  
      yRef.y = yBottom;
    };
  
    // header
    drawRow(headers, true);
  
    // rows
    for (const r of rows) drawRow(r, false);
  
    // small spacing after table
    yRef.y -= 8;
  }

function blockHeight(lines: string[], lineStep = 14, extraAfter = 6) {
  return lines.length * lineStep + extraAfter;
}

export async function buildReportPdf(form: FormSchema, answers: FormAnswers): Promise<Uint8Array> {
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
        const qLines = wrap(q, maxW, bold, 11);
        
        if (field.type === "table") {
          ensureSpace(blockHeight(qLines));
        
          for (const ln of qLines) {
            page.drawText(ln, { x: margin, y, size: 11, font: bold });
            y -= 14;
          }
        
          const rawRows = Array.isArray(answers[field.id])
            ? (answers[field.id] as Record<string, unknown>[])
            : [];
        
          const headers = field.columns.map((c) => c.label);
        
          const rows = rawRows.map((row) =>
            field.columns.map((c) => {
              const cell = row[c.id];
              if (c.type === "multiText") {
                return Array.isArray(cell)
                  ? (cell as unknown[])
                      .map((x) => (typeof x === "string" ? x.trim() : String(x)))
                      .filter((s) => s.length > 0)
                      .join(", ") || "—"
                  : "—";
              }
              if (cell == null) return "—";
              if (typeof cell === "string") return cell.trim() || "—";
              if (typeof cell === "number") return Number.isFinite(cell) ? String(cell) : "—";
              if (typeof cell === "boolean") return cell ? "Yes" : "No";
              return String(cell);
            })
          );
        
          const yRef = { y };
          drawTable({
            page,
            ensureSpace,
            margin,
            yRef,
            maxW,
            font: regular,
            bold,
            fontSize: 10,
            headers,
            rows: rows.length ? rows : [], 
          });
          y = yRef.y;
        } else {
          const a = stringifyAnswer(field, answers[field.id]);
          const aLines = a.split("\n").flatMap((line) => wrap(line, maxW, regular, 11));
        
          ensureSpace(blockHeight(qLines) + blockHeight(aLines));
        
          for (const ln of qLines) {
            page.drawText(ln, { x: margin, y, size: 11, font: bold });
            y -= 14;
          }
        
          for (const ln of aLines) {
            page.drawText(ln, { x: margin, y, size: 11, font: regular });
            y -= 14;
          }
        
          y -= 6;
        }
        qNum += 1;    
    }
    y -= 8;
  }

  return pdf.save();
}