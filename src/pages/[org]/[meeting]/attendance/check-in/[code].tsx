import { CustomNextPage } from "@/types/next-page";
import { LinkRedeemView } from "@/ui/meetings/attendance/link-redeem-view";
import { MeetingShell } from "@/ui/meetings/meeting-shell";

const MeetingCheckIn: CustomNextPage = () => {
  return <LinkRedeemView action="CHECKIN" />;
};

MeetingCheckIn.auth = true;

MeetingCheckIn.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingCheckIn;
