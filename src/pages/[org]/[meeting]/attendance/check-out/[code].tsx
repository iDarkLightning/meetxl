import { CustomNextPage } from "@/types/next-page";
import { LinkRedeemView } from "@/ui/meetings/attendance/link-redeem-view";
import { RedeemLayout } from "@/ui/meetings/attendance/redeem-layout";
import { meetingTabs } from "@/ui/meetings/meeting-shell";

const MeetingCheckOut: CustomNextPage = () => {
  return <LinkRedeemView action="CHECKOUT" />;
};

MeetingCheckOut.auth = true;

MeetingCheckOut.getLayout = (page) => (
  <RedeemLayout tabs={meetingTabs} includeMeetingProvider>
    {page}
  </RedeemLayout>
);

export default MeetingCheckOut;
