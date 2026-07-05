import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-2 text-7xl font-black text-border-light">404</span>
      <h1 className="mb-3 text-3xl font-black text-primary">Page not found</h1>
      <p className="mb-8 max-w-md text-muted">
        The page you are looking for does not exist or has been removed.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
