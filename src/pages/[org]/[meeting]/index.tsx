import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { CustomNextPage } from "@/types/next-page";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { MeetingTicket } from "@/ui/meetings/ticket";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";

const ParticipantIndex: React.FC = () => {
  const org = useOrg();
  const meeting = useMeeting();
  const register = trpc.meeting.participant.register.useMutation();
  const ctx = trpc.useContext();

  if (!meeting.participant) {
    return (
      <div className="flex flex-col items-center md:flex-row">
        <div className="flex w-full justify-center">
          <Button
            variant="primary"
            onClick={() =>
              register
                .mutateAsync({ meetingId: meeting.id, orgId: org.id })
                .then(() => ctx.meeting.get.invalidate())
                .catch(() => 0)
            }
          >
            Register
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex w-full justify-center">
        <MeetingTicket
          ticketNumber="00001"
          eventHost={org.name}
          eventName={meeting.name}
          confirmationCode={meeting.participant.code}
        />
      </div>
    </div>
  );
};

const MeetingIndex: CustomNextPage = () => {
  const org = useOrg();
  const meeting = useMeeting();

  if (org.member.role === "MEMBER") {
    return <ParticipantIndex />;
  }

  return (
    <SectionWrapper>
      <SectionHeading
        heading={meeting.name}
        sub="Manage settings for this meeting"
      />
      <Card>
        <Heading level="h4">Meeting Details</Heading>
      </Card>
    </SectionWrapper>
  );
};

MeetingIndex.auth = true;

MeetingIndex.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingIndex;
