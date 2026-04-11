"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateProfileAction,
  updatePasswordAction,
  deleteAccountAction,
} from "../actions";

export function SettingsClient({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      setProfileMsg(result.ok ? "Saved" : result.error);
    });
  }

  function submitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      setPasswordMsg(result.ok ? "Password updated" : result.error);
      if (result.ok) {
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  function submitDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("Really delete your account? This can't be undone.")) return;
    setDeleteMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await deleteAccountAction(formData);
      if (result.ok) {
        window.location.href = "/";
      } else {
        setDeleteMsg(result.error);
      }
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Profile
        </p>
        <form onSubmit={submitProfile} className="mt-4 space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              defaultValue={initialName}
              className="mt-1.5 h-10"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              defaultValue={initialEmail}
              className="mt-1.5 h-10"
            />
          </div>
          {profileMsg && (
            <p
              className={`text-sm ${profileMsg === "Saved" ? "text-olive" : "text-terracotta"}`}
            >
              {profileMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-sm bg-olive px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </button>
        </form>
      </section>

      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Password
        </p>
        <form onSubmit={submitPassword} className="mt-4 space-y-4">
          <div>
            <Label>Current password</Label>
            <Input
              name="currentPassword"
              type="password"
              required
              className="mt-1.5 h-10"
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              name="newPassword"
              type="password"
              minLength={8}
              required
              className="mt-1.5 h-10"
            />
          </div>
          <div>
            <Label>Confirm new password</Label>
            <Input
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              className="mt-1.5 h-10"
            />
          </div>
          {passwordMsg && (
            <p
              className={`text-sm ${passwordMsg === "Password updated" ? "text-olive" : "text-terracotta"}`}
            >
              {passwordMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-sm bg-olive px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </button>
        </form>
      </section>

      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
          Delete account
        </p>
        <form onSubmit={submitDelete} className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Confirm your password to permanently delete your account.
          </p>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="h-10 max-w-sm"
          />
          {deleteMsg && <p className="text-sm text-terracotta">{deleteMsg}</p>}
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 items-center rounded-sm border border-terracotta/60 px-5 text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Delete account"}
          </button>
        </form>
      </section>
    </div>
  );
}
