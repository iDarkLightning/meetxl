import { CustomNextPage } from "@/types/next-page";
import { LinkRedeemView } from "@/ui/meetings/attendance/link-redeem-view";
import { MeetingShell } from "@/ui/meetings/meeting-shell";

const MeetingCheckOut: CustomNextPage = () => {
  return <LinkRedeemView action="CHECKOUT" />;
};

MeetingCheckOut.auth = true;

MeetingCheckOut.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingCheckOut;
