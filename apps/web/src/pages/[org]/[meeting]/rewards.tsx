import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { DeleteButton } from "@/shared-components/util/delete-button";
import { EmptyContent } from "@/shared-components/util/empty-content";
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
          .catch(() => 0)
      }
    >
      {props.children}
    </Button>
  );
};

const EnableRewards: React.FC = () => {
  const org = useOrg();

  return (
    <EmptyContent
      heading="Rewards are not enabled for this meeting"
      sub={
        org.member.role === "ADMIN"
          ? "Enabling rewards for this meeting will enable you to modify the user's attributes on attendance"
          : "You will not get any additional rewards for attending this meeting. This meeting might still be mandatory for you."
      }
    >
      <ToggleButton variant="primary">Enable</ToggleButton>
    </EmptyContent>
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
          <table className="w-full text-left">
            <thead className="border-accent-stroke rounded-md border-[0.025rem] bg-background-secondary">
              <tr className="bordered">
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
                <tr key={reward.id}>
                  <td className="font-mono font-medium text-green-400">
                    {reward.attributeName}
                  </td>
                  <td>{reward.value}</td>
                  <td>{reward.action}</td>
                  {org.member.role === "ADMIN" && (
                    <td className="flex justify-end text-end">
                      <DeleteButton
                        confirmationText={reward.attributeName}
                        loading={deleteReward.isLoading}
                        onConfirm={() =>
                          deleteReward
                            .mutateAsync({
                              id: reward.id,
                              meetingId: meeting.id,
                              orgId: org.id,
                            })
                            .then(() => ctx.meeting.reward.list.invalidate())
                            .catch(() => 0)
                        }
                        buttonElement={(setIsOpen) => (
                          <Button
                            onClick={() => setIsOpen(true)}
                            icon={<AiOutlineClose />}
                            variant="ghost"
                            className="hover:bg-background-dark"
                          />
                        )}
                      />
                      {/*  */}
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
          sub={`${
            org.member.role === "ADMIN" ? "Manage" : "View"
          } rewards for attending this meeting`}
        />
        {meeting.rewardsEnabled && (
          <div className="mt-2 flex gap-4">
            <div className="flex-1">
              {org.member.role === "ADMIN" && <NewReward />}
            </div>
            <div className="flex-1">
              <ToggleButton variant="danger">Disable</ToggleButton>
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
