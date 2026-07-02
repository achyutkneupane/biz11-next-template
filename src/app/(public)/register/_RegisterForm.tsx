"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { useRegister } from "@biz11/Hooks/auth/useAuth";
import Link from "next/link";

export function _RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      {
        name,
        email,
        phone: phone || undefined,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name…"
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
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Your phone number…"
        autoComplete="tel"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Choose a password…"
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        placeholder="Confirm your password…"
        autoComplete="new-password"
        required
      />
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
        disabled={register.isPending}
      >
        {register.isPending ? "Creating account…" : "Register"}
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

