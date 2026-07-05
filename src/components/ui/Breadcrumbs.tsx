import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm">
      <ol className="inline-flex items-center">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center">
            {i > 0 && <span className="mx-2 text-muted-light">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="font-medium text-muted transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-primary" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
