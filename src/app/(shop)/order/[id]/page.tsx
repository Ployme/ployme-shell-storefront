export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl italic tracking-tight">
        Order {id}
      </h1>
    </main>
  );
}
