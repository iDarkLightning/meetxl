import { CustomNextPage } from "@/types/next-page";
import { MeetingShell } from "@/ui/meetings/meeting-shell";

const MeetingIndex: CustomNextPage = () => {
  return <div />;
};

MeetingIndex.auth = true;

MeetingIndex.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingIndex;
