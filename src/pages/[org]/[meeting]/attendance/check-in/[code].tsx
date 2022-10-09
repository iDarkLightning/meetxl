import { CustomNextPage } from "@/types/next-page";
import { LinkRedeemView } from "@/ui/meetings/attendance/link-redeem-view";
import { RedeemLayout } from "@/ui/meetings/attendance/redeem-layout";

const MeetingCheckIn: CustomNextPage = () => {
  return <LinkRedeemView action="CHECKIN" />;
};

MeetingCheckIn.auth = true;

MeetingCheckIn.getLayout = (page) => <RedeemLayout>{page}</RedeemLayout>;

export default MeetingCheckIn;
