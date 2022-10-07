import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { CheckingQRCode } from "@/ui/meetings/attendance/checking-qr-code";
import { LinkRedeemList } from "@/ui/meetings/attendance/link-redeem-list";
import { LinkRedeemView } from "@/ui/meetings/attendance/link-redeem-view";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const MeetingCheckOut: CustomNextPage = () => {
  return <LinkRedeemView action="CHECKOUT" />;
};

MeetingCheckOut.auth = true;

MeetingCheckOut.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingCheckOut;
