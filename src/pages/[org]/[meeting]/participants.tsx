import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { CustomNextPage } from "@/types/next-page";
import { EditParticipantsModal } from "@/ui/meetings/edit-participant";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { ParticipantList } from "@/ui/meetings/participant-list";
import { ParticipantShell } from "@/ui/meetings/participant-shell";
import { trpc } from "@/utils/trpc";

const MeetingParticipants: CustomNextPage = () => {
  const meeting = useMeeting();

  const ctx = trpc.useContext();
  const toggleAccess = trpc.meeting.toggleAccess.useMutation();

  return (
    <SectionWrapper>
      <Card className="flex flex-col gap-4">
        <div>
          <Heading level="h4">Participant Options</Heading>
          <p className="opacity-75">Manage member access</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              Member Access: {meeting.isPublic ? "Public" : "Private"}
            </p>
            <Button
              onClick={() =>
                toggleAccess
                  .mutateAsync({
                    meetingId: meeting.id,
                    orgId: meeting.organizationSlug,
                  })
                  .then(() => ctx.meeting.get.invalidate())
              }
            >
              Make {meeting.isPublic ? "Private" : "Public"}
            </Button>
          </div>
          {meeting.isPublic && (
            <div className="flex items-center justify-between">
              <p className="font-medium">Maximum Participants</p>
              <Input type="number" className="w-min" />
            </div>
          )}
        </div>
      </Card>
    </SectionWrapper>
  );
};

MeetingParticipants.auth = true;

MeetingParticipants.getLayout = (page) => (
  <ParticipantShell
    heading="Participants"
    sub="Manage participant options for this meeting"
  >
    {page}
  </ParticipantShell>
);

export default MeetingParticipants;
