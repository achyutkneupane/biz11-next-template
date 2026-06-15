"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { HiOutlineShoppingBag, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { CartDrawer } from "@/components/layout/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export function PublicNavbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            Biz11
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-border-light cursor-pointer"
              aria-label="Open shopping cart"
            >
              <HiOutlineShoppingBag className="h-6 w-6" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-border-light sm:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <HiOutlineXMark className="h-6 w-6" />
              ) : (
                <HiOutlineBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t-2 border-border bg-surface px-4 pb-4 pt-2 sm:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
