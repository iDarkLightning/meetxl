import { CustomNextPage } from "@/types/next-page";
import { MeetingShell } from "@/ui/meetings/meeting-shell";

const MeetingAttendance: CustomNextPage = () => {
  return <div />;
};

MeetingAttendance.auth = true;

MeetingAttendance.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingAttendance;
