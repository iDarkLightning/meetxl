import { useZodForm } from "@/lib/hooks/use-zod-form";
import { updateParticipantLimitSchema } from "@/lib/schemas/meeting-schemas";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { CustomNextPage } from "@/types/next-page";
import { AttendanceChecking } from "@/ui/meetings/attendance/checking-options";
import { useMeeting } from "@/ui/meetings/meeting-shell";
import { ParticipantShell } from "@/ui/meetings/participant-shell";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

const LimitForm: React.FC = () => {
  const meeting = useMeeting();
  const ctx = trpc.useContext();
  const updateLimit = trpc.meeting.participant.updateLimit.useMutation();

  const methods = useZodForm({
    schema: updateParticipantLimitSchema,
    defaultValues: {
      limit: meeting.maxParticipants?.toString(),
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-2"
      autoComplete="off"
      onSubmit={methods.handleSubmit(async (values) => {
        await updateLimit
          .mutateAsync({
            limit: values.limit,
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
          <Input {...methods.register("limit")} type="number" />
        </div>
        {methods.formState.errors.limit?.message && (
          <p className="text-accent-danger">
            {methods.formState.errors.limit?.message}
          </p>
        )}
      </div>
    </form>
  );
};

const MeetingAttendance = () => {
  const meeting = useMeeting();

  return (
    <Tab.Group
      defaultIndex={
        meeting.requireCheckIn ||
        (!meeting.requireCheckIn && !meeting.requireCheckOut)
          ? 0
          : 1
      }
    >
      <Tab.List className="flex gap-4">
        {["Check In", "Check Out"].map((item, idx) => (
          <Tab
            key={idx}
            className={({ selected }) =>
              clsx(
                "flex-1 rounded-md py-3 transition-colors",
                selected &&
                  "border-[0.0125rem] border-accent-stroke bg-accent-secondary",
                !selected && "border-2 border-accent-secondary"
              )
            }
          >
            {item}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="flex flex-col gap-6">
          <AttendanceChecking action="CHECKIN" />
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-4">
          <AttendanceChecking action="CHECKOUT" />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
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
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <Heading level="h4">Member Access</Heading>
            <p className="opacity-75">Manage who can join this meeting</p>
          </div>
          <Button
            className="w-full md:w-min"
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
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <Heading level="h4">Registration Limit</Heading>
              <p className="opacity-75">
                Manage how many people can join this meeting
              </p>
            </div>
            <Button
              className="w-full md:w-min"
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
      <MeetingAttendance />
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
