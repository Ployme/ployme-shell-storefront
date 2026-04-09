"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { Product, ProductVariant, Collection } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { adminCreateProduct, adminUpdateProduct } from "../actions";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TAGS = ["bestseller", "new", "limited", "organic"] as const;

const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  inventory: z.number().min(0, "Inventory cannot be negative"),
});

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  origin: z.string().min(2, "Origin is required"),
  producer: z.string().min(1, "Producer is required"),
  harvest: z
    .string()
    .min(1, "Harvest is required")
    .regex(
      /^[A-Z][a-z]+ \d{4}$/,
      "Use format: Month Year (e.g. November 2025)"
    ),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must be under 200 characters"),
  description: z
    .string()
    .min(50, "Full description must be at least 50 characters"),
  tastingNotes: z.string().min(1, "At least one tasting note is required"),
  pairings: z.string().min(1, "At least one pairing is required"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

type FormErrors = Partial<
  Record<keyof z.infer<typeof productSchema>, string>
> & {
  variants?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[12px] text-terracotta">{message}</p>;
}

type Props = {
  product?: Product;
  collections: Collection[];
};

export function ProductForm({ product, collections }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Basic fields
  const [name, setName] = useState(product?.name ?? "");
  const [collectionId, setCollectionId] = useState(
    product?.collectionId ?? collections[0]?.id ?? ""
  );
  const [origin, setOrigin] = useState(product?.origin ?? "");
  const [producer, setProducer] = useState(product?.producer ?? "");
  const [harvest, setHarvest] = useState(product?.harvest ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [tastingNotes, setTastingNotes] = useState(
    product?.tastingNotes.join(", ") ?? ""
  );
  const [pairings, setPairings] = useState(
    product?.pairings.join(", ") ?? ""
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [tags, setTags] = useState<Set<string>>(
    new Set(product?.tags ?? [])
  );

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants ?? [
      { id: "", size: "500ml", price: 1500, sku: "", inventory: 50 },
    ]
  );

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { id: "", size: "", price: 0, sku: "", inventory: 0 },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleTag(tag: string) {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function validate(): boolean {
    const result = productSchema.safeParse({
      name,
      origin,
      producer,
      harvest,
      shortDescription,
      description,
      tastingNotes,
      pairings,
      variants: variants.map((v) => ({
        size: v.size,
        price: Number(v.price),
        inventory: Number(v.inventory),
      })),
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormErrors;
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSave() {
    if (saving) return;
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    setSaving(true);

    const slug = product?.id ?? slugify(name);
    const builtVariants = variants.map((v, i) => ({
      ...v,
      id: v.id || `${slug}-v${i}`,
      sku:
        v.sku ||
        `${slug.toUpperCase().slice(0, 6)}-${v.size}`.replace(/\s/g, ""),
      price: Number(v.price),
      inventory: Number(v.inventory),
    }));

    const data: Product = {
      id: slug,
      name: name.trim(),
      collectionId,
      origin: origin.trim(),
      producer: producer.trim(),
      harvest: harvest.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      tastingNotes: tastingNotes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      pairings: pairings
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: product?.images ?? [],
      variants: builtVariants,
      tags: [...tags] as Product["tags"],
      featured,
    };

    if (isEdit) {
      await adminUpdateProduct(slug, data);
      toast("Product updated");
    } else {
      await adminCreateProduct(data);
      toast("Product created");
    }

    setSaving(false);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Basic info */}
      <section className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Basic information
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-9"
              disabled={isEdit}
              aria-invalid={!!errors.name}
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <Label htmlFor="collection">Collection</Label>
            <select
              id="collection"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Castelvetrano, Sicily"
              className="mt-1.5 h-9"
              aria-invalid={!!errors.origin}
            />
            <FieldError message={errors.origin} />
          </div>
          <div>
            <Label htmlFor="producer">Producer</Label>
            <Input
              id="producer"
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
              className="mt-1.5 h-9"
              aria-invalid={!!errors.producer}
            />
            <FieldError message={errors.producer} />
          </div>
          <div>
            <Label htmlFor="harvest">Harvest</Label>
            <Input
              id="harvest"
              value={harvest}
              onChange={(e) => setHarvest(e.target.value)}
              placeholder="e.g. November 2025"
              className="mt-1.5 h-9"
              aria-invalid={!!errors.harvest}
            />
            <FieldError message={errors.harvest} />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Description
        </p>
        <div>
          <Label htmlFor="shortDesc">Short description (card copy)</Label>
          <Textarea
            id="shortDesc"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            className="mt-1.5"
            aria-invalid={!!errors.shortDescription}
          />
          <FieldError message={errors.shortDescription} />
        </div>
        <div>
          <Label htmlFor="desc">Full description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1.5"
            aria-invalid={!!errors.description}
          />
          <FieldError message={errors.description} />
        </div>
      </section>

      {/* Tasting & pairings */}
      <section className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Tasting notes & pairings
        </p>
        <div>
          <Label htmlFor="tasting">
            Tasting notes{" "}
            <span className="font-normal text-muted-foreground">
              (comma-separated)
            </span>
          </Label>
          <Input
            id="tasting"
            value={tastingNotes}
            onChange={(e) => setTastingNotes(e.target.value)}
            placeholder="green pepper, artichoke leaf, bitter almond"
            className="mt-1.5 h-9"
            aria-invalid={!!errors.tastingNotes}
          />
          <FieldError message={errors.tastingNotes} />
        </div>
        <div>
          <Label htmlFor="pairings">
            Pairings{" "}
            <span className="font-normal text-muted-foreground">
              (comma-separated)
            </span>
          </Label>
          <Input
            id="pairings"
            value={pairings}
            onChange={(e) => setPairings(e.target.value)}
            placeholder="burrata with tomatoes, grilled swordfish"
            className="mt-1.5 h-9"
            aria-invalid={!!errors.pairings}
          />
          <FieldError message={errors.pairings} />
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Variants
          </p>
          <Button variant="ghost" size="sm" onClick={addVariant}>
            <Plus className="size-3.5" data-icon="inline-start" />
            Add variant
          </Button>
        </div>
        <FieldError message={errors.variants} />

        {variants.map((variant, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 rounded-sm border border-stone/60 p-4"
          >
            <div>
              <Label>Size</Label>
              <Input
                value={variant.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                placeholder="500ml"
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label>Price (pence)</Label>
              <Input
                type="number"
                value={variant.price}
                onChange={(e) =>
                  updateVariant(i, "price", parseInt(e.target.value) || 0)
                }
                className="mt-1 h-8"
              />
            </div>
            <div>
              <Label>Inventory</Label>
              <Input
                type="number"
                value={variant.inventory}
                onChange={(e) =>
                  updateVariant(i, "inventory", parseInt(e.target.value) || 0)
                }
                className="mt-1 h-8"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => removeVariant(i)}
              disabled={variants.length <= 1}
            >
              <Trash2 className="size-3.5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </section>

      {/* Tags & featured */}
      <section className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Tags & visibility
        </p>
        <div className="flex flex-wrap gap-4">
          {TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={tags.has(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={featured}
            onCheckedChange={(v) => setFeatured(!!v)}
          />
          Featured on home page
        </label>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-stone pt-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create product"
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
