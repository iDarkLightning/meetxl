import { MainLayout } from "@/shared-components/layout/main-layout";
import { Tab } from "@/types/tab";
import { OrgProvider, useOrg } from "@/ui/org/org-shell";
import React from "react";
import { MeetingProvider } from "../meeting-shell";

interface Props {
  tabs: Tab[];
  includeMeetingProvider?: boolean;
}

const RedeemLayoutInner: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const org = useOrg();

  if (org.member.role === "ADMIN") {
    return (
      <MainLayout tabs={props.tabs}>
        {props.includeMeetingProvider ? (
          <MeetingProvider>{props.children}</MeetingProvider>
        ) : (
          props.children
        )}
      </MainLayout>
    );
  }

  return (
    <>
      {!props.includeMeetingProvider ? (
        props.children
      ) : (
        <MeetingProvider>{props.children}</MeetingProvider>
      )}
    </>
  );
};

export const RedeemLayout: React.FC<React.PropsWithChildren<Props>> = (
  props
) => {
  return (
    <OrgProvider>
      <RedeemLayoutInner
        tabs={props.tabs}
        includeMeetingProvider={props.includeMeetingProvider}
      >
        {props.children}
      </RedeemLayoutInner>
    </OrgProvider>
  );
};
