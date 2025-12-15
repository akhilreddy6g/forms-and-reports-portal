"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormMeta } from "@/lib/forms/types";

export function FormCard({ form }: { form: FormMeta }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full">
        <Image
          src={form.image.src}
          alt={form.image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>

      <div className="flex flex-1 flex-col bg-brand-cardFooter px-5 py-4">
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="text-base font-semibold leading-snug text-app-text">
            {form.title}
          </h2>

          {form.description ? (
            <p className="text-sm leading-relaxed text-app-muted">
              {form.description}
            </p>
          ) : null}

          <div className="mt-1 flex flex-wrap gap-2">
            {form.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-app-border bg-app-surface/60 px-2.5 py-1 text-xs text-app-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={`/${encodeURIComponent(form.id)}`}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-brand-primaryBtn px-4 py-2 text-sm font-semibold text-app-textOnDark transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-app-border"
          >
            Begin
          </Link>
        </div>
      </div>
    </article>
  );
}