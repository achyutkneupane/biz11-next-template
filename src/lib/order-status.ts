import type { OrderStatus } from "@biz11/Types/Api";

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary-light/10 text-primary",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};
