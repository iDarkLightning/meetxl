import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { NewReward } from "@/ui/meetings/new-reward";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ToggleButton: React.FC<
  React.PropsWithChildren<{ variant: "primary" | "danger" }>
> = (props) => {
  const org = useOrg();
  const ctx = trpc.useContext();
  const toggleRewards = trpc.meeting.reward.toggle.useMutation();
  const meeting = useMeeting();

  if (org.member.role !== "ADMIN") return null;

  return (
    <Button
      className={clsx(props.variant === "danger" && "w-full")}
      variant={props.variant}
      loading={toggleRewards.isLoading}
      onClick={() =>
        toggleRewards
          .mutateAsync({
            meetingId: meeting.id,
            orgId: meeting.organizationSlug,
          })
          .then(() => ctx.meeting.get.invalidate())
      }
    >
      {props.children}
    </Button>
  );
};

const EnableRewards: React.FC = () => {
  const org = useOrg();

  return (
    <Card className="flex min-h-[20rem] flex-col items-center justify-center gap-4 border-dotted bg-background-primary">
      <div className="flex flex-col items-center text-center">
        <Heading level="h4">Rewards are not enabled for this meeting</Heading>
        <p className="text-sm opacity-75">
          {org.member.role === "ADMIN"
            ? "Enabling rewards for this meeting will enable you to modify the user's attributes on attendance"
            : "You will not get any additional rewards for attending this meeting. This meeting might still be mandatory for you."}
        </p>
      </div>
      <ToggleButton variant="primary">Enable</ToggleButton>
    </Card>
  );
};

const RewardList: React.FC = () => {
  const meeting = useMeeting();
  const org = useOrg();
  const ctx = trpc.useContext();
  const rewardsQuery = trpc.meeting.reward.list.useQuery({
    meetingId: meeting.id,
    orgId: org.id,
  });
  const deleteReward = trpc.meeting.reward.delete.useMutation();
  const [parent] = useAutoAnimate<HTMLTableSectionElement>({
    duration: 150,
  });

  return (
    <div>
      <BaseQueryCell
        query={rewardsQuery}
        success={({ data }) => (
          <table className="w-full table-fixed text-left">
            <thead className="rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary">
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Action</th>
                {org.member.role === "ADMIN" && (
                  <th className="text-right">Remove</th>
                )}
              </tr>
            </thead>
            <tbody ref={parent}>
              {data.map((reward) => (
                <tr
                  key={reward.id}
                  className="transition-colors hover:bg-accent-secondary"
                >
                  <td className="font-mono font-medium text-blue-400">
                    {reward.key}
                  </td>
                  <td>{reward.value}</td>
                  <td>{reward.action}</td>
                  {org.member.role === "ADMIN" && (
                    <td className="flex justify-end text-end">
                      <Button
                        onClick={() =>
                          deleteReward
                            .mutateAsync({
                              id: reward.id,
                              meetingId: meeting.id,
                              orgId: org.id,
                            })
                            .then(() => ctx.meeting.reward.list.invalidate())
                        }
                        icon={<AiOutlineClose />}
                        variant="ghost"
                        className="hover:bg-background-dark"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />
    </div>
  );
};

const MeetingRewards: CustomNextPage = () => {
  const meeting = useMeeting();
  const org = useOrg();

  return (
    <SectionWrapper>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <SectionHeading
          heading="Rewards"
          sub="Manage rewards for attending this meeting"
        />
        {meeting.rewardsEnabled && (
          <div className="mt-2 flex gap-4">
            <div className="flex-1">
              <ToggleButton variant="danger">Disable</ToggleButton>
            </div>
            <div className="flex-1">
              {org.member.role === "ADMIN" && <NewReward />}
            </div>
          </div>
        )}
      </div>

      {!meeting.rewardsEnabled ? <EnableRewards /> : <RewardList />}
    </SectionWrapper>
  );
};

MeetingRewards.auth = true;

MeetingRewards.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingRewards;
