import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Featured", href: "#" },
      { label: "New Arrivals", href: "#" },
      { label: "Sale", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Shipping & Returns", href: "#" },
      { label: "Size Guide", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Biz11. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
