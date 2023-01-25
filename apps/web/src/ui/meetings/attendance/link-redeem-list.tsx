import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { RedeemCard } from "@/ui/org/redeem-card";
import { trpc } from "@/utils/trpc";
import { useMeeting } from "../meeting-shell";

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
                <RedeemCard
                  key={redeem.participant.memberUserId}
                  user={redeem.participant.member.user}
                  redeemedAt={redeem.redeemedAt}
                />
              ))}
          </div>
        )}
      />
    </div>
  );
};
