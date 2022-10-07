import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { AttendanceLinkAction } from "@prisma/client";
import { useRouter } from "next/router";
import { useMeeting } from "../meeting-shell";
import { CheckingQRCode } from "./checking-qr-code";
import { LinkRedeemList } from "./link-redeem-list";

export const LinkRedeemView: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const ctx = trpc.useContext();
  const applyLink = trpc.meeting.attendance.links.apply.useMutation();
  const codeQuery = trpc.meeting.attendance.links.get.useQuery({
    orgId: org.id,
    meetingId: meeting.id,
    code: router.query.code as string,
    type: props.action,
  });

  const heading = props.action === "CHECKIN" ? "Check In" : "Check Out";

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading={heading}
          sub={`${heading} Via Code: ${router.query.code}`}
        />
        {org.member.role === "ADMIN" && <CheckingQRCode />}
      </div>
      <BaseQueryCell
        query={codeQuery}
        success={({ data }) => (
          <>
            {org.member.role === "ADMIN" && <LinkRedeemList id={data.id} />}
            {org.member.role === "MEMBER" && (
              <Card className="flex flex-col items-center justify-center gap-2">
                <Heading>Code: {data.code}</Heading>
                {((!meeting.participant?.checkedIn &&
                  props.action === "CHECKIN") ||
                  (!meeting.participant?.checkedOut &&
                    props.action === "CHECKOUT")) && (
                  <Button
                    onClick={() =>
                      applyLink
                        .mutateAsync({
                          code: router.query.code as string,
                          meetingId: meeting.id,
                          orgId: org.id,
                        })
                        .then(() => ctx.meeting.get.invalidate())
                    }
                  >
                    {heading}
                  </Button>
                )}
                {((meeting.participant?.checkedIn &&
                  props.action === "CHECKIN") ||
                  (meeting.participant?.checkedOut &&
                    props.action === "CHECKOUT")) && (
                  <p>
                    {`You checked ${
                      props.action === "CHECKIN" ? "in to" : "out of"
                    } this meeting at ${meeting.participant[
                      props.action === "CHECKIN"
                        ? "checkInTime"
                        : "checkOutTime"
                    ]?.toLocaleDateString()}`}
                  </p>
                )}
              </Card>
            )}
          </>
        )}
      />
    </SectionWrapper>
  );
};
