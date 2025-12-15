import { getFormsMeta } from "@/lib/forms/api";
import { FormsGrid } from "@/components/forms/FormsGrid";

export default async function HomePage() {
  const { forms } = await getFormsMeta();

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

      <FormsGrid forms={forms} />
    </main>
  );
}