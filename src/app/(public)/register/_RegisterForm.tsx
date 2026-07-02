"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@biz11/components/ui/Input";
import { Button } from "@biz11/components/ui/Button";
import { useRegister } from "@biz11/Hooks/auth/useAuth";
import { z } from "zod";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export function _RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof registerSchema>, string>>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ name, email, phone, password, passwordConfirmation });
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        name: formattedErrors.name?._errors[0],
        email: formattedErrors.email?._errors[0],
        phone: formattedErrors.phone?._errors[0],
        password: formattedErrors.password?._errors[0],
        passwordConfirmation: formattedErrors.passwordConfirmation?._errors[0],
      });
      return;
    }
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
      <div className="space-y-1">
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name…"
          autoComplete="name"
          required
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
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
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number…"
          autoComplete="tel"
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div className="space-y-1">
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password…"
          autoComplete="new-password"
          required
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>
      <div className="space-y-1">
        <Input
          label="Confirm Password"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirm your password…"
          autoComplete="new-password"
          required
        />
        {errors.passwordConfirmation && <p className="text-xs text-red-500">{errors.passwordConfirmation}</p>}
      </div>
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

