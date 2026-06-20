"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { HiOutlineShoppingBag, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { CartDrawer } from "@biz11/components/layout/CartDrawer";
import { useCart } from "@biz11/Hooks/cart/useCart";
import { useBusiness } from "@biz11/Hooks/useBusiness";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
];

export function PublicNavbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: cartData } = useCart();
  const cartCount = (cartData?.data ?? []).length;
  const business = useBusiness();

  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-accent"
          >
            {business.name}
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-all duration-200 hover:bg-border-light active:scale-95 cursor-pointer"
              aria-label="Open shopping cart"
            >
              <HiOutlineShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors duration-200 hover:bg-border-light sm:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <HiOutlineXMark className="h-5 w-5" />
              ) : (
                <HiOutlineBars3 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-surface px-4 pb-5 pt-3 sm:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-border-light"
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
