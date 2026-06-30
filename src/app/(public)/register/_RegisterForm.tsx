"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { useRegister } from "@biz11/Hooks/auth/useAuth";

export function _RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    register.mutate({ name, email, password }, { onSuccess: () => router.replace("/") });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe…"
        autoComplete="name"
        required
      />
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
        placeholder="At least 8 characters…"
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Re-enter your password…"
        autoComplete="new-password"
        required
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={register.isPending}
      >
        {register.isPending ? "Creating account…" : "Create Account"}
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:text-accent-dark">
          Sign In
        </Link>
      </p>
    </form>
  );
}
