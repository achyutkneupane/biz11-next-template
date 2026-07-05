import { notFound } from "next/navigation";
import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { StripePaymentPage } from "@biz11/components/checkout/StripePaymentPage";
import { Metadata, ResolvingMetadata } from "next";
import { apiGet } from "@biz11/lib/api-client";
import { generateSeoMetadata } from "@biz11/lib/seo";
import type { StaticPageResource } from "@biz11/Types/Api";

export async function generateMetadata(
  props: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const response = await apiGet<StaticPageResource>("/v1/pages/payment");
    const page = response.data;
    if (page.seo) {
      return generateSeoMetadata(page.seo, await parent);
    }
  } catch (error) {
    // Fallback
  }
  return {
    title: "Payment",
  };
}

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  if (!orderId) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" },
        ]}
      />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Secure payment
        </span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
          Complete Payment
        </h1>
        <p className="mt-1 text-sm text-muted">
          Order #{orderId.slice(0, 8)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <StripePaymentPage orderId={orderId} />
      </div>
    </div>
  );
}
