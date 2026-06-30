import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, logout as logoutApi, getMe } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { toast } from "react-toastify";

export function useMe() {
  const isBizLoaded = useStore(selectIsBizLoaded);

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
    enabled: isBizLoaded,
    select: (result) => result.data,
  });
}

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(`Welcome, ${data.data.user.name}`);
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Logged out");
    },
  });
}
