import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { _LoginForm } from "@biz11/app/(public)/login/_LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Login" },
        ]}
      />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Account
        </span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
          Sign In
        </h1>
        <p className="mt-1 text-sm text-muted">
          Access your orders and saved addresses
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <_LoginForm />
      </div>
    </div>
  );
}
