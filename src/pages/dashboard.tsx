import { MainLayout } from "@/shared-components/layout/main-layout";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { NewOrganizationModal } from "@/ui/org/new-org";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

const Dashboard: CustomNextPage = () => {
  const orgsQuery = trpc.organization.list.useQuery();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading level="h3">Your Organizations</Heading>
        <NewOrganizationModal />
      </div>
      <BaseQueryCell
        query={orgsQuery}
        success={({ data }) => (
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.map((org) => (
              <li key={org.id}>
                <Link href={`/${org.slug}`} passHref>
                  <a>
                    <Card>
                      <Heading>{org.name}</Heading>
                    </Card>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      />
    </>
  );
};

Dashboard.auth = true;

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
