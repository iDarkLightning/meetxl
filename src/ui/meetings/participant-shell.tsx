import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import React from "react";
import { EditParticipantsModal } from "./edit-participant";
import { MeetingShell } from "./meeting-shell";
import { ParticipantList } from "./participant-list";

const ShellInner: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="flex-1 md:flex-[0.75]">{props.children}</div>
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <Card className="flex items-center justify-between">
            <Heading level="h5">Participants</Heading>
            <EditParticipantsModal />
          </Card>
          <ParticipantList />
        </div>
      </div>
    </div>
  );
};

export const ParticipantShell: React.FC<
  React.PropsWithChildren<{ heading: string; sub: string }>
> = (props) => {
  return (
    <MeetingShell>
      <SectionWrapper>
        <SectionHeading heading={props.heading} sub={props.sub} />
        <ShellInner>{props.children}</ShellInner>
      </SectionWrapper>
    </MeetingShell>
  );
};
