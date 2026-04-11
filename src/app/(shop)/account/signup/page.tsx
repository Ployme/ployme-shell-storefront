import Link from "next/link";
import { redirect } from "next/navigation";
import { integrations } from "@/lib/integrations";
import { SignUpForm } from "./form";

export default async function SignUpPage({
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
        Create account
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Join us
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Save your details for faster checkout and keep your order history
        in one place.
      </p>

      <div className="mt-8">
        <SignUpForm redirectTo={redirectTo ?? "/account"} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={
            redirectTo
              ? `/account/signin?redirect=${encodeURIComponent(redirectTo)}`
              : "/account/signin"
          }
          className="text-olive underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
