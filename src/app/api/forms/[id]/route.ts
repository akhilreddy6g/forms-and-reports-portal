import { NextResponse } from "next/server";
import type { FormCatalog, FormDefinition } from "@/lib/forms/types";

type RouteParams = { params: { id: string } };

export const dynamic = "force-dynamic";  //To always reflect the latest catalog.

/**
 * GET /api/forms/:id
 * Returns a single form definition from the catalog by id.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: id } = await context.params
  if (!id) {
    return NextResponse.json(
      { error: "Missing form id." },
      { status: 400 }
    );
  }

  const catalogModule = await import("@/lib/forms/catalog.json");
  const catalog = catalogModule.default as FormCatalog;

  const form = catalog.forms.find((f: FormDefinition) => f.id === id);

  if (!form) {
    return NextResponse.json(
      { error: `Form not found: ${id}` },
      { status: 404 }
    );
  }

  // Use s-maxage for CDN caching, if forms change rarely.
  // Set no-store, If forms change often and you want the latest version.
  return NextResponse.json(form, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
    }
  });
}
