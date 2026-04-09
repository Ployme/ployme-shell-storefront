import { COLLECTIONS } from "@/lib/data/collections";
import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-[32px] italic tracking-tight text-foreground">
        New product
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new oil to the catalogue
      </p>
      <div className="mt-8 max-w-3xl">
        <ProductForm collections={COLLECTIONS} />
      </div>
    </div>
  );
}
