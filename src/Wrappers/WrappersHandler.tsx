import type { LayoutProps } from "@biz11/Types/types";
import TSQWrapper from "@biz11/Wrappers/TSQWrapper";
import { BusinessBootstrap } from "@biz11/Wrappers/BusinessBootstrap";

export default function WrappersHandler({ children }: LayoutProps) {
  return (
    <TSQWrapper>
      <BusinessBootstrap>{children}</BusinessBootstrap>
    </TSQWrapper>
  );
}
