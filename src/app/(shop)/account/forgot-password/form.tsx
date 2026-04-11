"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "../actions";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await requestPasswordResetAction(formData);
      setSent(true);
    });
  }

  if (sent) {
    return (
      <p className="text-sm text-foreground">
        If an account with that email exists, we&rsquo;ve sent a reset link.
        Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 h-10"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-sm bg-olive text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
      </button>
    </form>
  );
}
