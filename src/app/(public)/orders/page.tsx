import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { _OrdersList } from "@biz11/app/(public)/orders/_OrdersList";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders" },
        ]}
      />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Order history
        </span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
          My Orders
        </h1>
      </div>

      <_OrdersList />
    </div>
  );
}
