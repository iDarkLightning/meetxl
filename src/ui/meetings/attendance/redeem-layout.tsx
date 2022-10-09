import { MainLayout } from "@/shared-components/layout/main-layout";
import { OrgProvider, useOrg } from "@/ui/org/org-shell";
import React from "react";
import { MeetingProvider, meetingTabs } from "../meeting-shell";

const RedeemLayoutInner: React.FC<React.PropsWithChildren> = (props) => {
  const org = useOrg();

  if (org.member.role === "ADMIN") {
    return (
      <MainLayout tabs={meetingTabs}>
        <MeetingProvider>{props.children}</MeetingProvider>
      </MainLayout>
    );
  }

  return <MeetingProvider>{props.children}</MeetingProvider>;
};

export const RedeemLayout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <OrgProvider>
      <RedeemLayoutInner>{props.children}</RedeemLayoutInner>
    </OrgProvider>
  );
};
