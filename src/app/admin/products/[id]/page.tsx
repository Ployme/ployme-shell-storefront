export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="font-display text-4xl italic tracking-tight">Edit Product {id}</h1>
    </div>
  );
}
