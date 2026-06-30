import { PublicNavbar } from "@biz11/components/layout/PublicNavbar";
import { Footer } from "@biz11/components/layout/Footer";
import WrappersHandler from "@biz11/Wrappers/WrappersHandler";
import { ServerBusinessHydrator } from "@biz11/components/ServerBusinessHydrator";
import { serverFetchBusiness } from "@biz11/lib/server-bootstrap";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await serverFetchBusiness();
  const hasData = "data" in result;

  return (
    <>
      <ServerBusinessHydrator
        data={hasData ? result.data : null}
        visitorId={hasData ? result.visitorId : undefined}
        visitorSignature={hasData ? result.visitorSignature : undefined}
      />
      <WrappersHandler>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <PublicNavbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
      </WrappersHandler>
    </>
  );
}
