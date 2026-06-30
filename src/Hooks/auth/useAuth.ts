import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, logout as logoutApi } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { toast } from "react-toastify";

export function useLogin() {
  const setToken = useStore((s) => s.setToken);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      setToken(data.data.token);
      toast.success(`Welcome, ${data.data.user.name}`);
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const clearAuth = useStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearAuth();
      qc.invalidateQueries();
      toast.success("Logged out");
    },
  });
}
