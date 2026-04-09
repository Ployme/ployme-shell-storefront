import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/store/product-store";
import { COLLECTIONS } from "@/lib/data/collections";
import { ProductForm } from "../product-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        Edit product
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-8 max-w-3xl">
        <ProductForm product={product} collections={COLLECTIONS} />
      </div>
    </div>
  );
}
