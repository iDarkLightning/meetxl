import { useZodForm } from "@/lib/hooks/use-zod-form";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { CustomNextPage } from "@/types/next-page";
import { useMeeting } from "@/ui/meetings/meeting-shell";
import { ParticipantShell } from "@/ui/meetings/participant-shell";
import { trpc } from "@/utils/trpc";
import { z } from "zod";

const LimitForm: React.FC = () => {
  const meeting = useMeeting();
  const ctx = trpc.useContext();
  const updateLimit = trpc.meeting.participant.updateLimit.useMutation();

  const methods = useZodForm({
    schema: z.object({
      value: z.string(),
    }),
    defaultValues: {
      value: meeting.maxParticipants?.toString(),
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-2"
      autoComplete="off"
      onSubmit={methods.handleSubmit(async (values) => {
        await updateLimit
          .mutateAsync({
            limit: parseInt(values.value),
            meetingId: meeting.id,
            orgId: meeting.organizationSlug,
          })
          .catch(() => 0);

        await ctx.meeting.get.invalidate();
        methods.reset(values);
      })}
    >
      <label htmlFor="value" className="opacity-75">
        Limit
      </label>
      <div>
        <div className="flex gap-2">
          <Input {...methods.register("value")} type="number" />
        </div>
        {methods.formState.errors.value?.message && (
          <p className="text-accent-danger">
            {methods.formState.errors.value?.message}
          </p>
        )}
      </div>
    </form>
  );
};

const MeetingParticipants: CustomNextPage = () => {
  const meeting = useMeeting();
  const ctx = trpc.useContext();
  const toggleAccess = trpc.meeting.toggleAccess.useMutation();
  const toggleLimit = trpc.meeting.participant.toggleLimit.useMutation();

  return (
    <SectionWrapper>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h4">Member Access</Heading>
            <p className="opacity-75">Manage who can join this meeting</p>
          </div>
          <Button
            onClick={() =>
              toggleAccess
                .mutateAsync({
                  meetingId: meeting.id,
                  orgId: meeting.organizationSlug,
                })
                .then(() => ctx.meeting.get.invalidate())
                .catch(() => 0)
            }
          >
            Make {meeting.isPublic ? "Private" : "Public"}
          </Button>
        </div>
      </Card>
      {meeting.isPublic && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Heading level="h4">Registration Limit</Heading>
              <p className="opacity-75">
                Manage how many people can join this meeting
              </p>
            </div>
            <Button
              onClick={() =>
                toggleLimit
                  .mutateAsync({
                    meetingId: meeting.id,
                    orgId: meeting.organizationSlug,
                  })
                  .then(() => ctx.meeting.get.invalidate())
                  .catch(() => 0)
              }
            >
              {meeting.limitParticipants ? "Disable" : "Enable"}
            </Button>
          </div>
          {meeting.limitParticipants && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <LimitForm />
              </div>
            </div>
          )}
        </Card>
      )}
    </SectionWrapper>
  );
};

MeetingParticipants.auth = true;

MeetingParticipants.getLayout = (page) => (
  <ParticipantShell
    heading="Participants"
    sub="Manage participant options for this meeting"
  >
    {page}
  </ParticipantShell>
);

export default MeetingParticipants;
