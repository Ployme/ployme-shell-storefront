import { ForgotPasswordForm } from "./form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-terracotta">
        Forgot password
      </p>
      <h1 className="mt-2 font-display text-[40px] italic leading-[1.05] tracking-tight text-foreground">
        Reset it
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Enter your email and we&rsquo;ll send you a reset link.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
