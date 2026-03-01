import AdminBusinessPreviewClient from "./AdminBusinessPreviewClient";

export default async function AdminBusinessPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminBusinessPreviewClient id={id} />;
}
