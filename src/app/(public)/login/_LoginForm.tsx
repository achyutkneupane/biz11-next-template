"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { useLogin } from "@biz11/Hooks/auth/useAuth";
import { z } from "zod";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function _LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      });
      return;
    }

    login.mutate({ email, password }, { onSuccess: () => router.replace("/") });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com…"
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>
      <div className="space-y-1">
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password…"
          autoComplete="current-password"
          required
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in…" : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-accent hover:text-accent-dark">
          Create one
        </Link>
      </p>
    </form>
  );
}
