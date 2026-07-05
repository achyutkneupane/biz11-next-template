"use client";

import { useMe, useLogout } from "@biz11/Hooks/auth/useAuth";
import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { Button } from "@biz11/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: user } = useMe();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Account
        </span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
          My Profile
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Name</label>
            <p className="text-lg font-bold text-foreground mt-0.5">{user.name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Email</label>
            <p className="text-lg font-medium text-foreground mt-0.5">{user.email}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Phone</label>
            <p className="text-lg font-medium text-foreground mt-0.5">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Role</label>
            <div className="mt-1">
              <span className="text-sm font-semibold inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button
            variant="danger"
            size="lg"
            className="w-full"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Logging out…" : "Log Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
