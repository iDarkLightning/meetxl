import { Card } from "@/shared-components/system/card";
import { CustomNextPage } from "@/types/next-page";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { MeetingTicket } from "@/ui/meetings/ticket";
import { useOrg } from "@/ui/org/org-shell";

const ParticipantIndex: React.FC = () => {
  const org = useOrg();
  const meeting = useMeeting();

  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex w-full justify-center">
        <MeetingTicket
          ticketNumber="00001"
          eventHost={org.name}
          eventName={meeting.name}
          confirmationCode="123456"
        />
      </div>
    </div>
  );
};

const MeetingIndex: CustomNextPage = () => {
  return <ParticipantIndex />;
};

MeetingIndex.auth = true;

MeetingIndex.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingIndex;
