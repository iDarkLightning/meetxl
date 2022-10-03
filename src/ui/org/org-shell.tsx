import { AppRouter } from "@/server/trpc/router";
import { MainLayout } from "@/shared-components/layout/main-layout";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { Tab } from "@/types/tab";
import { trpc } from "@/utils/trpc";
import { MemberRole } from "@prisma/client";
import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/router";
import React, { createContext, useContext } from "react";

const OrgContext = createContext<{
  org: inferProcedureOutput<AppRouter["organization"]["get"]> | null;
}>({ org: null });

const tabs: Tab[] = [
  {
    name: "Meetings",
    route: "/[org]",
  },
  {
    name: "Invites",
    route: "/[org]/invite",
    adminRequired: true,
  },
  {
    name: "Members",
    route: "/[org]/members",
    adminRequired: true,
  },
];

export const useOrg = () => {
  const { org } = useContext(OrgContext);

  if (!org) {
    throw new Error("OrgProvider not found!");
  }

  return org;
};

export const OrgShell: React.FC<
  React.PropsWithChildren<{ tabs?: Tab[]; meeting?: string }>
> = (props) => {
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
        <OrgContext.Provider value={{ org: data }}>
          <MainLayout
            tabs={props.tabs || tabs}
            admin={data.member?.role === MemberRole.ADMIN}
          >
            {props.children}
          </MainLayout>
        </OrgContext.Provider>
      )}
    />
  );
};
