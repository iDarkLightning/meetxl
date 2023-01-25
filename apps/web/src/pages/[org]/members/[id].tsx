import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { CustomNextPage } from "@/types/next-page";
import { MeetingCard } from "@/ui/meetings/meeting-card";
import { OrgShell, useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const MemberDetailsPage: CustomNextPage = () => {
  const org = useOrg();
  const router = useRouter();
  const insights = trpc.organization.members.getInsightsFor.useQuery({
    orgId: org.id,
    memberId: router.query.id as string,
  });
  const kickMember = trpc.organization.members.kick.useMutation();

  return (
    <SectionWrapper>
      <BaseQueryCell
        query={insights}
        success={({ data }) => (
          <>
            <div className="flex items-center justify-between">
              <SectionHeading
                heading="Member Details"
                sub="Details for member"
              />
              {data.member?.role === "MEMBER" && (
                <Button
                  size="sm"
                  variant="danger"
                  className="text-red-600"
                  onClick={() =>
                    kickMember
                      .mutateAsync({
                        memberId: data.member?.userId as string,
                        orgId: org.id,
                      })
                      .then(() => router.push(`/${org.slug}/members`))
                      .catch(() => 0)
                  }
                >
                  Kick
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Heading level="h4">Redeemed Attendance Links</Heading>
                  {data.redeemedAttendanceLinks.length === 0 && (
                    <EmptyContent
                      heading="This user has not redeemed any attendance links"
                      sub="Send them a link for them to redeem"
                    />
                  )}
                  {data.redeemedAttendanceLinks.length > 0 &&
                    data.redeemedAttendanceLinks.map((item) => (
                      <Card
                        key={item.linkId}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p>
                            {item.link.meeting.name} - {item.link.code}
                          </p>
                          <p className="font-mono text-green-400">
                            {item.link.action}
                          </p>
                        </div>
                        <p className="text-sm opacity-75">
                          {item.redeemedAt.toLocaleString()}
                        </p>
                      </Card>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Heading level="h4">Redeemed Attribute Links</Heading>
                  {data.redeemedAttributeLinks.length === 0 && (
                    <EmptyContent
                      heading="This user has not redeemed any attribute links"
                      sub="Send them a link for them to redeem"
                    />
                  )}
                  {data.redeemedAttributeLinks.map((item) => (
                    <Card
                      key={item.linkId}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p>
                          {item.link.name} - {item.link.code}
                        </p>
                        <p className="font-mono text-green-400">
                          {item.link.action}
                        </p>
                      </div>
                      <p className="text-sm opacity-75">
                        {item.redeemedAt.toLocaleString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Heading level="h4">Attended Meetings</Heading>
                {data.attendedMeetings.length === 0 && (
                  <EmptyContent
                    heading="This user has not attended any meetings"
                    sub="When they attend meetings, it will show up here!"
                  />
                )}
                {data.attendedMeetings.map((item) => (
                  <MeetingCard key={item.meetingId} meeting={item.meeting} />
                ))}
              </div>
            </div>
          </>
        )}
      />
    </SectionWrapper>
  );
};

MemberDetailsPage.auth = true;

MemberDetailsPage.getLayout = (page) => <OrgShell>{page}</OrgShell>;

export default MemberDetailsPage;
