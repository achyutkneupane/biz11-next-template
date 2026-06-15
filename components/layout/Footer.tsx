export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Shop</h3>
            <ul className="space-y-2">
              {["All Products", "Electronics", "Clothing", "Home & Garden"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              {["Contact Us", "FAQs", "Shipping", "Returns"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {["About Us", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border-light pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Biz11. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
