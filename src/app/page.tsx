"use client";

import useSWR from "swr";
import type { FormsMetaResponse } from "@/lib/forms/types";
import { FormsGrid } from "@/components/forms/FormsGrid";

const fetcher = async (url: string): Promise<FormsMetaResponse> => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
};

export default function HomePage() {
  const { data, error, isLoading } = useSWR<FormsMetaResponse>(
    "/api/forms-meta",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <main className="mx-auto flex max-w-6xl flex-col px-6 py-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome!
        </h2>
        <p className="text-sm leading-relaxed text-app-muted">
          Select a form below to begin your inspection and generate a report.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-app-muted">Loading forms…</p>
      ) : error ? (
        <p className="text-sm text-app-muted">Failed to load forms.</p>
      ) : (
        <FormsGrid forms={data?.forms ?? []} />
      )}
    </main>
  );
}