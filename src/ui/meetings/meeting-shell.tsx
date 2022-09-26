import React from "react";
import { OrgShell } from "../org/org-shell";

const tabs = [
  {
    name: "Overview",
    route: "/[org]/[meeting]",
  },
  {
    name: "Participants",
    route: "/[org]/[meeting]/participants",
  },
];

export const MeetingShell: React.FC<React.PropsWithChildren> = (props) => (
  <OrgShell tabs={tabs}>{props.children}</OrgShell>
);
