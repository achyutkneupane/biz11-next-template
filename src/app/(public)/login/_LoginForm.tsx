"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { useLogin } from "@biz11/Hooks/auth/useAuth";

export function _LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => router.replace("/") });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com…"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password…"
        autoComplete="current-password"
        required
      />
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
