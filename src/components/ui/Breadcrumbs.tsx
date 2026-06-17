import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-8 text-sm">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2 text-muted-light">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-muted transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
