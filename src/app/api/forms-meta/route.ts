import { NextResponse } from "next/server";
import type { FormsMetaResponse } from "@/lib/forms/types";

export const revalidate = 300;

export async function GET() {
  const mod = (await import("@/lib/forms/forms-meta.json")) as {
    default: FormsMetaResponse;
  };

  const data = mod.default; // { forms: FormMeta[] }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
