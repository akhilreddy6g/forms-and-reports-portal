export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-6 py-10">
      <h2 className="text-xl font-semibold tracking-tight">Form: {id}</h2>
      <p className="mt-2 text-sm text-app-muted">
        Next step: render the form schema, collect answers, and export a report.
      </p>
    </main>
  );
}
