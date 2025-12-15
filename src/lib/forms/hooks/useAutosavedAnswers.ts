"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormAnswers } from "@/lib/forms/schema";
import { loadDraft, saveDraft, clearDraft } from "@/lib/forms/draft";

export function useAutosavedAnswers(formId: string) {
  const initial = useMemo(() => loadDraft(formId), [formId]);
  const [answers, setAnswers] = useState<FormAnswers>(initial);

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveDraft(formId, answers), 150);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [answers, formId]);

  const clear = () => {
    setAnswers({});
    clearDraft(formId);
  };

  return { answers, setAnswers, clear };
}