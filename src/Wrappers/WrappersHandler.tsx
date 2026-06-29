import type { LayoutProps } from "@biz11/Types/types";
import TSQWrapper from "@biz11/Wrappers/TSQWrapper";
import { BusinessBootstrap } from "@biz11/Wrappers/BusinessBootstrap";
import { ToastProvider } from "@biz11/Wrappers/ToastProvider";

export default function WrappersHandler({ children }: LayoutProps) {
  return (
    <TSQWrapper>
      <BusinessBootstrap>
        <ToastProvider>{children}</ToastProvider>
      </BusinessBootstrap>
    </TSQWrapper>
  );
}
