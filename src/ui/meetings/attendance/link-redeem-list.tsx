import { Avatar } from "@/shared-components/system/avatar";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { trpc } from "@/utils/trpc";
import { useMeeting } from "../meeting-shell";
import { EmptyContent } from "@/shared-components/util/empty-content";

export const LinkRedeemList: React.FC<{ id: string }> = (props) => {
  const meeting = useMeeting();
  const redeemQuery = trpc.meeting.attendance.links.listRedeem.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
    id: props.id,
  });

  return (
    <div>
      <BaseQueryCell
        query={redeemQuery}
        success={({ data }) => (
          <div>
            {data.length === 0 && (
              <EmptyContent
                heading="No one has used this link"
                sub="Share this link with others and monitor uses here."
              />
            )}
            {data.length > 0 &&
              data.map((redeem) => (
                <Card
                  key={redeem.participant.member.user.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      imageProps={{
                        src: redeem.participant.member.user.image as string,
                      }}
                      fallbackProps={{
                        children: getAvatarFallback(
                          redeem.participant.member.user.name
                        ),
                      }}
                    />
                    <div>
                      <Heading level="h4">
                        {redeem.participant.member.user.name}
                      </Heading>
                      <p className="text-sm opacity-80">
                        {redeem.participant.member.user.email}
                      </p>
                    </div>
                  </div>
                  <p className="opacity-80">
                    {redeem.redeemedAt.toLocaleString()}
                  </p>
                </Card>
              ))}
          </div>
        )}
      />
    </div>
  );
};
