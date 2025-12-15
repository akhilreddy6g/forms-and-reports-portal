import "server-only";
import type { FormsMetaResponse } from "./types";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function getFormsMeta(): Promise<FormsMetaResponse> {
  const res = await fetch(`${getBaseUrl()}/api/forms-meta`, {
    // Next.js Data Cache: avoids refetching on every request.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch forms meta: ${res.status}`);
  }

  return (await res.json()) as FormsMetaResponse;
}