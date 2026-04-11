import { ResetPasswordForm } from "./form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Reset password
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Choose a new one
      </h1>
      <div className="mt-8">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-sm text-terracotta">
            Missing reset token. Please use the link from your email.
          </p>
        )}
      </div>
    </div>
  );
}
