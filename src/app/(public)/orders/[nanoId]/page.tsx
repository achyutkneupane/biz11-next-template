import { _OrderDetail } from "@biz11/app/(public)/orders/[nanoId]/_OrderDetail";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ nanoId: string }>;
}) {
  const { nanoId } = await params;
  return <_OrderDetail nanoId={nanoId} />;
}
