"use client";

import { useState, useTransition } from "react";
import { Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/app/(shop)/product/[slug]/review-actions";

export function WriteReviewForm({
  productId,
  currentCustomer,
}: {
  productId: string;
  currentCustomer: { name: string; email: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitReview({
        productId,
        rating,
        title,
        body,
        name: currentCustomer ? undefined : name,
        email: currentCustomer ? undefined : email,
      });
      if (result.ok) {
        setDone(true);
        setTitle("");
        setBody("");
      } else {
        setError(result.error);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-sm border border-olive/40 bg-olive/5 p-4">
        <p className="text-sm text-foreground">
          Thanks — your review is awaiting moderation and will appear here once
          approved.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center rounded-sm border border-olive/40 px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-olive"
      >
        Write a review
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-sm border border-stone p-5"
    >
      <p className="font-display text-lg italic text-foreground">
        Share your thoughts
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <Label>Rating</Label>
          <div className="mt-1.5 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                aria-label={`${i + 1} stars`}
              >
                <Star
                  className={`size-6 ${
                    i < rating
                      ? "fill-terracotta text-terracotta"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {!currentCustomer && (
          <>
            <div>
              <Label htmlFor="reviewName">Name</Label>
              <Input
                id="reviewName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <Label htmlFor="reviewEmail">Email</Label>
              <Input
                id="reviewEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 h-10"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="reviewTitle">Title</Label>
          <Input
            id="reviewTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1.5 h-10"
          />
        </div>

        <div>
          <Label htmlFor="reviewBody">Your review</Label>
          <Textarea
            id="reviewBody"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-sm bg-olive px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
