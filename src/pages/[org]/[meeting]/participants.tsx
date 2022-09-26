import { CustomNextPage } from "@/types/next-page";
import { MeetingShell } from "@/ui/meetings/meeting-shell";

const MeetingParticipants: CustomNextPage = () => {
  return <div />;
};

MeetingParticipants.auth = true;

MeetingParticipants.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingParticipants;
