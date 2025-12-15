"use client";

import type { FormMeta } from "@/lib/forms/types";
import { FormCard } from "./FormCard";

export function FormsGrid({ forms }: { forms: FormMeta[] }) {
  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-6">
        {forms.map((f) => (
          <div key={f.id} className="flex w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <FormCard form={f} />
          </div>
        ))}
      </div>
    </section>
  );
}