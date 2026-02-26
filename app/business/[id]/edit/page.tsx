import Navbar from "@/components/Navbar";
import EditBusinessClient from "@/components/EditBusinessClient";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl p-4 md:p-8">
        <h1 className="mb-4 text-2xl font-bold">Edit Business</h1>
        <EditBusinessClient id={id} />
      </main>
    </>
  );
}
