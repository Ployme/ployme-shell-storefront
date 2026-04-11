"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "../actions";

export function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result.ok) {
        // Force a full navigation so the layout re-renders with the new
        // session cookie in place (sidebar + header account state).
        window.location.href = redirectTo;
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-1.5 h-10" />
      </div>
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
      <div>
        <Label htmlFor="password">Password</Label>
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
      {error && (
        <p className="text-sm text-terracotta">{error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-sm bg-olive text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </button>
    </form>
  );
}
