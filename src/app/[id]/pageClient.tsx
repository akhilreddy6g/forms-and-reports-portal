"use client";

import useSWR from "swr";
import type { FormSchema } from "@/lib/forms/schema";
import { FormWizard } from "@/components/forms/FormWizard";

const fetcher = async (url: string): Promise<FormSchema> => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
};

export default function FormPageClient({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR<FormSchema>(
    `/api/forms/${encodeURIComponent(id)}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <main className="mx-auto flex max-w-4xl flex-col bg-app-bg px-6 py-10">
      {isLoading ? <p className="text-sm text-app-muted">Loading form…</p> : null}
      {error ? <p className="text-sm text-app-muted">Failed to load form.</p> : null}
      {data ? <FormWizard form={data} /> : null}
    </main>
  );
}