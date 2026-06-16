import { PublicNavbar } from "@biz11/components/layout/PublicNavbar";
import { Footer } from "@biz11/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
