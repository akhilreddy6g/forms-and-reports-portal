import FormPageClient from "./pageClient";

export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormPageClient id={id} />;
}