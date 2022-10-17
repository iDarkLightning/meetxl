import { MainLayout } from "@/shared-components/layout/main-layout";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { NewOrganizationModal } from "@/ui/org/new-org";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Dashboard: CustomNextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const orgsQuery = trpc.organization.list.useQuery();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading level="h3">Your Organizations</Heading>
        <Button
          icon={<FaPlus size="0.75rem" />}
          variant="primary"
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          New
        </Button>
      </div>
      <BaseQueryCell
        query={orgsQuery}
        success={({ data }) => (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {data.map((org) => (
              <li key={org.id}>
                <Link href={`/${org.name}`} passHref>
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
      <NewOrganizationModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

Dashboard.auth = true;

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
