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
        <div className="flex min-h-screen flex-col">
          <PublicNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </WrappersHandler>
    </>
  );
}
