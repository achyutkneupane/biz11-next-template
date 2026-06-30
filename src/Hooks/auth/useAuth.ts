import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, logout as logoutApi, register as registerApi } from "@biz11/lib/api-client";
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

export function useRegister() {
  const setToken = useStore((s) => s.setToken);

  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      registerApi(name, email, password),
    onSuccess: (data) => {
      setToken(data.data.token);
      toast.success(`Account created! Welcome, ${data.data.user.name}`);
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
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
