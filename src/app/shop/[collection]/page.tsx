export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  return (
    <main>
      <h1>Collection: {collection}</h1>
    </main>
  );
}
