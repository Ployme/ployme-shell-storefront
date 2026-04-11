import Link from "next/link";
import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { SignInForm } from "./form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  const customer = await integrations.auth.getCurrentCustomer();
  if (customer) redirect(redirectTo ?? "/account");

  return (
    <div className="mx-auto max-w-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Sign in
      </h1>

      <div className="mt-8">
        <SignInForm redirectTo={redirectTo ?? "/account"} />
      </div>

      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        <p>
          <Link
            href="/account/forgot-password"
            className="text-olive underline underline-offset-2"
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          New here?{" "}
          <Link
            href={
              redirectTo
                ? `/account/signup?redirect=${encodeURIComponent(redirectTo)}`
                : "/account/signup"
            }
            className="text-olive underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
