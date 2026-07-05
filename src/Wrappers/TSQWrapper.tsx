"use client";

import { useState, type FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { LayoutProps } from "@biz11/Types/types";

const TSQWrapper: FC<LayoutProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TSQWrapper;
