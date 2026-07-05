import type { LayoutProps } from "@biz11/Types/types";
import TSQWrapper from "@biz11/Wrappers/TSQWrapper";
import { BusinessBootstrap } from "@biz11/Wrappers/BusinessBootstrap";
import { ToastProvider } from "@biz11/Wrappers/ToastProvider";
import { SanctumProvider } from "next-sanctum";

const sanctumConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost",
  mode: "cookie" as const,
  endpoints: {
    user: "/v1/auth/me",
    login: "/v1/auth/login",
    logout: "/v1/auth/logout",
    register: "/v1/auth/register",
  },
  initialRequest: false,
};

export default function WrappersHandler({ children }: LayoutProps) {
  return (
    <TSQWrapper>
      <SanctumProvider config={sanctumConfig}>
        <BusinessBootstrap>
          <ToastProvider>{children}</ToastProvider>
        </BusinessBootstrap>
      </SanctumProvider>
    </TSQWrapper>
  );
}

