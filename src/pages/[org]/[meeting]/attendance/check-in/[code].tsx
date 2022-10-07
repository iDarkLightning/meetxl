import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { CheckingQRCode } from "@/ui/meetings/attendance/checking-qr-code";
import { LinkRedeemList } from "@/ui/meetings/attendance/link-redeem-list";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const MeetingCheckIn: CustomNextPage = () => {
  const org = useOrg();
  const meeting = useMeeting();
  const router = useRouter();
  const ctx = trpc.useContext();
  const applyLink = trpc.meeting.attendance.links.apply.useMutation();
  const codeQuery = trpc.meeting.attendance.links.get.useQuery({
    orgId: org.id,
    meetingId: meeting.id,
    code: router.query.code as string,
    type: "CHECKIN",
  });

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <SectionHeading
          heading="Check In"
          sub={`Check In Via Code: ${router.query.code}`}
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
                {!meeting.participant?.checkedIn && (
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
                    Check In
                  </Button>
                )}
                {meeting.participant?.checkedIn && (
                  <p>
                    {`You checked in to this meeting at ${meeting.participant.checkInTime?.toLocaleDateString()}`}
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

MeetingCheckIn.auth = true;

MeetingCheckIn.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingCheckIn;
