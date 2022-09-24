import { MainLayout } from "@/shared-components/layout/main-layout";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import { Organization } from "@prisma/client";
import { useRouter } from "next/router";
import React, { createContext, useContext } from "react";

const OrgContext = createContext<{ org: Organization | null }>({ org: null });

const tabs = [
  {
    name: "Meetings",
    route: "/[org]",
  },
  {
    name: "Members",
    route: "/[org]/members",
  },
];

export const useOrg = () => {
  const { org } = useContext(OrgContext);

  if (!org) {
    throw new Error("OrgProvider not found!");
  }

  return org;
};

export const OrgShell: React.FC<React.PropsWithChildren> = (props) => {
  const router = useRouter();
  const orgQuery = trpc.organization.get.useQuery(
    {
      orgId: router.query.org as string,
    },
    {
      enabled: !!router.query.org,
    }
  );

  return (
    <BaseQueryCell
      query={orgQuery}
      success={({ data }) => (
        <MainLayout heading={data.name} tabs={tabs}>
          <OrgContext.Provider value={{ org: data }}>
            {props.children}
          </OrgContext.Provider>
        </MainLayout>
      )}
    />
  );
};
