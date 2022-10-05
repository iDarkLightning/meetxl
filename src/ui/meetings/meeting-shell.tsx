import { AppRouter } from "@/server/trpc/router";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { Tab } from "@/types/tab";
import { trpc } from "@/utils/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/router";
import React, { createContext } from "react";
import { OrgShell, useOrg } from "../org/org-shell";

const tabs: Tab[] = [
  {
    name: "Overview",
    route: "/[org]/[meeting]",
  },
  {
    name: "Rewards",
    route: "/[org]/[meeting]/rewards",
  },
  {
    name: "Participants",
    route: "/[org]/[meeting]/participants",
    adminRequired: true,
  },
  {
    name: "Attendance",
    route: "/[org]/[meeting]/attendance/*",
    adminRequired: true,
  },
];

const MeetingContext = createContext<{
  meeting: inferProcedureOutput<AppRouter["meeting"]["get"]> | null;
}>({
  meeting: null,
});

export const useMeeting = () => {
  const { meeting } = React.useContext(MeetingContext);

  if (!meeting) {
    throw new Error("No MeetingProvider found");
  }

  return meeting;
};

const MeetingInner: React.FC<React.PropsWithChildren> = (props) => {
  const org = useOrg();
  const router = useRouter();

  const meetingQuery = trpc.meeting.get.useQuery(
    {
      orgId: org.id,
      meetingId: router.query.meeting as string,
    },
    {
      enabled: !!router.query.meeting,
    }
  );

  return (
    <BaseQueryCell
      query={meetingQuery}
      success={({ data }) => (
        <MeetingContext.Provider value={{ meeting: data }}>
          {props.children}
        </MeetingContext.Provider>
      )}
    />
  );
};

export const MeetingShell: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <OrgShell tabs={tabs}>
      <MeetingInner>{props.children}</MeetingInner>
    </OrgShell>
  );
};
