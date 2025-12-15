import type { FormAnswers } from "@/lib/forms/schema";

const DRAFT_PREFIX = "forms:draft:";
const PDF_PREFIX = "forms:lastPdf:";

const kDraft = (id: string) => `${DRAFT_PREFIX}${id}`;
const kPdf = (id: string) => `${PDF_PREFIX}${id}`;

export function loadDraft(id: string): FormAnswers {
  if (typeof window === "undefined") return {};
  const raw = sessionStorage.getItem(kDraft(id));
  if (!raw) return {};
  try {
    return JSON.parse(raw) as FormAnswers;
  } catch {
    return {};
  }
}

export function saveDraft(id: string, answers: FormAnswers) {
  sessionStorage.setItem(kDraft(id), JSON.stringify(answers));
}

export function clearDraft(id: string) {
  sessionStorage.removeItem(kDraft(id));
}

export function saveLastPdfBase64(id: string, base64: string) {
  sessionStorage.setItem(kPdf(id), base64);
}

export function loadLastPdfBase64(id: string) {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(kPdf(id));
}

export function clearLastPdf(id: string) {
  sessionStorage.removeItem(kPdf(id));
}