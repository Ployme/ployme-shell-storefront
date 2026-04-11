"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "../actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    setError(null);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result.ok) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground">
          Your password has been updated.
        </p>
        <Link
          href="/account/signin"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-olive px-6 text-[11px] font-medium uppercase tracking-[0.15em] text-cream"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className="mt-1.5 h-10"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={8}
          required
          className="mt-1.5 h-10"
        />
      </div>
      {error && <p className="text-sm text-terracotta">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-sm bg-olive text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Reset password"}
      </button>
    </form>
  );
}
