import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { _LoginForm } from "@biz11/app/(public)/login/_LoginForm";
import { Metadata, ResolvingMetadata } from "next";
import { apiGet } from "@biz11/lib/api-client";
import { generateSeoMetadata } from "@biz11/lib/seo";
import type { StaticPageResource } from "@biz11/Types/Api";

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const response = await apiGet<StaticPageResource>("/v1/pages/login");
    const page = response.data;
    if (page.seo) {
      return generateSeoMetadata(page.seo, await parent);
    }
  } catch (error) {
    // Fallback
  }
  return {
    title: "Login",
  };
}

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
