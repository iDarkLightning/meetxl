import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { EditParticipantsModal } from "@/ui/meetings/edit-participant";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { trpc } from "@/utils/trpc";

const MeetingParticipants: CustomNextPage = () => {
  const meeting = useMeeting();
  const participantsQuery = trpc.meeting.participant.list.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
  });

  return (
    <SectionWrapper>
      <SectionHeading
        heading="Participants"
        sub="Manage meeting participants"
      />
      <Card className="flex flex-col gap-4">
        <div>
          <Heading level="h4">Participant Options</Heading>
          <p className="opacity-75">
            Manage participant options for this meeting
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">Enable RSVP</p>
            <Button>Enable</Button>
          </div>
          {meeting.canRsvp && (
            <div className="flex items-center justify-between">
              <p className="font-medium">Maximum Participants</p>
              <Input type="number" className="w-min" />
            </div>
          )}
        </div>
      </Card>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Heading level="h5">Participants</Heading>
            <EditParticipantsModal />
          </div>
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <BaseQueryCell
                query={participantsQuery}
                success={({ data }) => (
                  <>
                    {data.map((p) => (
                      <tr
                        key={p.memberUserId}
                        className="transition-colors hover:bg-accent-secondary"
                      >
                        <td>{p.member.user.name}</td>
                        <td>{p.member.user.email}</td>
                        <td>{p.status}</td>
                      </tr>
                    ))}
                  </>
                )}
              />
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  );
};

MeetingParticipants.auth = true;

MeetingParticipants.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingParticipants;
