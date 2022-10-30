import { useZodForm } from "@/lib/hooks/use-zod-form";
import { SectionHeading } from "@/shared-components/layout/section-heading";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { EmptyContent } from "@/shared-components/util/empty-content";
import { CustomNextPage } from "@/types/next-page";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { useOrg } from "@/ui/org/org-shell";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { BiExit, BiGift, BiTime } from "react-icons/bi";
import { FaEye, FaTrash } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { IoMdPeople } from "react-icons/io";
import { z } from "zod";

dayjs.extend(relativeTime);

const ApplyLinkForm: React.FC = () => {
  const meeting = useMeeting();
  const applyLink = trpc.meeting.attendance.links.apply.useMutation();
  const ctx = trpc.useContext();

  const methods = useZodForm({
    schema: z.object({
      code: z.string().min(1),
    }),
    defaultValues: {
      code: "",
    },
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <form
        autoComplete="off"
        onSubmit={methods.handleSubmit((values) => {
          applyLink
            .mutateAsync({
              code: values.code,
              meetingId: meeting.id,
              orgId: meeting.organizationSlug,
            })
            .then(() => ctx.meeting.get.invalidate())
            .catch(() => 0);

          methods.reset();
        })}
      >
        <label htmlFor="code" className="text-gray-400">
          Link Code
        </label>
        <div className="mt-2 flex items-center gap-6">
          <div className="w-full">
            <Input {...methods.register("code")} className="w-full" />
            {methods.formState.errors.code?.message && (
              <p className="text-red-500">
                {methods.formState.errors.code?.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="md"
            loading={applyLink.isLoading}
            className="h-full"
          >
            Apply
          </Button>
        </div>
      </form>
    </div>
  );
};

const ParticipantIndex: React.FC = () => {
  const org = useOrg();
  const meeting = useMeeting();
  const register = trpc.meeting.participant.register.useMutation();
  const leave = trpc.meeting.participant.leave.useMutation();
  const ctx = trpc.useContext();

  if (!meeting.participant) {
    return (
      <EmptyContent
        heading="Not registered for the meeting"
        sub="This is a public meeting. You can register for it below."
      >
        <Button
          variant="primary"
          onClick={() =>
            register
              .mutateAsync({ meetingId: meeting.id, orgId: org.id })
              .then(() => ctx.meeting.get.invalidate())
              .catch(() => 0)
          }
        >
          Register
        </Button>
      </EmptyContent>
    );
  }

  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex w-full flex-col justify-center gap-6">
        <Card className="flex flex-col gap-2 hover:bg-opacity-100">
          <ApplyLinkForm />
          <div className="flex flex-col gap-2">
            <Heading level="h5">Attendance Details</Heading>
            <div className="flex justify-between">
              <p className="font-medium">Check Out</p>
              <p className="font-mono text-green-400">
                {meeting.participant.checkedIn
                  ? dayjs(meeting.participant.checkInTime).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : "Not Checked In"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Check Out</p>
              <p className="font-mono text-green-400">
                {meeting.participant.checkedOut
                  ? dayjs(meeting.participant.checkOutTime).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : "Not Checked Out"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="flex w-full flex-col gap-6 border-accent-danger hover:bg-opacity-100">
          <div className="flex flex-col gap-2">
            <Heading level="h5">Leave</Heading>
            <p className="text-sm opacity-75">
              This action is permanent and cannot be reversed. All of your data
              for this meeting will be lost
            </p>
          </div>
          <Button
            variant="danger"
            icon={<FaTrash />}
            className="w-min"
            onClick={() => {
              leave
                .mutateAsync({ meetingId: meeting.id, orgId: org.id })
                .then(() => ctx.meeting.get.invalidate())
                .catch(() => 0);
            }}
          >
            Leave
          </Button>
        </Card>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{
  icon: IconType;
  content: string;
  iconClassName?: string;
}> = (props) => {
  return (
    <Card className="flex h-48 flex-col items-center justify-center gap-3">
      <props.icon
        className={clsx("h-16 w-16 opacity-60", props.iconClassName)}
      />
      <p className="text-center font-semibold">{props.content}</p>
    </Card>
  );
};

const EditMeetingForm: React.FC = () => {
  const meeting = useMeeting();
  const methods = useZodForm({
    schema: z.object({
      name: z.string().min(1),
      startTime: z.string(),
      endTime: z.string(),
      location: z.string(),
    }),
    defaultValues: {
      name: meeting.name,
      location: meeting.location ?? "",
      startTime: dayjs(meeting.startTime).format("YYYY-MM-DDTHH:mm"),
      endTime: dayjs(meeting.endTime).format("YYYY-MM-DDTHH:mm"),
    },
  });
  const update = trpc.meeting.update.useMutation();
  const ctx = trpc.useContext();

  return (
    <form
      autoComplete="off"
      onSubmit={methods.handleSubmit(async (values) => {
        await update
          .mutateAsync({
            orgId: meeting.organizationSlug,
            meetingId: meeting.id,
            ...values,
          })
          .catch(() => 0);

        ctx.meeting.get.invalidate();
      })}
    >
      <label htmlFor="name" className="text-gray-400">
        Name
      </label>
      <Input {...methods.register("name")} className="mt-2" />
      {methods.formState.errors.name?.message && (
        <p className="text-red-500">{methods.formState.errors.name?.message}</p>
      )}
      <label htmlFor="name" className="text-gray-400">
        Location
      </label>
      <Input {...methods.register("location")} className="mt-2" />
      {methods.formState.errors.location?.message && (
        <p className="text-red-500">
          {methods.formState.errors.location?.message}
        </p>
      )}
      <label htmlFor="startTime" className="text-gray-400">
        Start Time
      </label>
      <Input
        {...methods.register("startTime")}
        className="mt-2"
        type="datetime-local"
      />
      {methods.formState.errors.startTime?.message && (
        <p className="text-red-500">
          {methods.formState.errors.startTime?.message}
        </p>
      )}
      <label htmlFor="endTime" className="text-gray-400">
        End Time
      </label>
      <Input
        {...methods.register("endTime")}
        className="mt-2"
        type="datetime-local"
      />
      {methods.formState.errors.endTime?.message && (
        <p className="text-red-500">
          {methods.formState.errors.endTime?.message}
        </p>
      )}
      <Button type="submit" className="mt-4">
        Save
      </Button>
    </form>
  );
};

const MeetingIndex: CustomNextPage = () => {
  const org = useOrg();
  const meeting = useMeeting();
  const deleteMeeting = trpc.meeting.delete.useMutation();
  const router = useRouter();

  return (
    <SectionWrapper>
      <SectionHeading
        heading={meeting.name}
        sub="View and manage settings for this meeting"
      />
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          {org.member.role === "MEMBER" ? (
            <ParticipantIndex />
          ) : (
            <>
              <Card className="flex flex-col gap-2 hover:bg-opacity-100">
                <div className="flex flex-col gap-2">
                  <Heading level="h5">Edit</Heading>
                  <p className="text-sm opacity-75">
                    Edit options for this meeting
                  </p>
                </div>
                <div>
                  <EditMeetingForm />
                </div>
              </Card>
              <Card className="flex flex-col gap-6 border-accent-danger hover:bg-opacity-100">
                <div className="flex flex-col gap-2">
                  <Heading level="h5">Delete</Heading>
                  <p className="text-sm opacity-75">
                    This action is permanent and cannot be reversed. All of the
                    data associated with this meeting will be lost. This will
                    not undo the changes made by rewards for those who have
                    already attended the meeting.
                  </p>
                </div>
                <Button
                  variant="danger"
                  icon={<FaTrash />}
                  className="w-min"
                  onClick={() =>
                    deleteMeeting
                      .mutateAsync({
                        meetingId: meeting.id,
                        orgId: org.id,
                      })
                      .then(() => router.push(`/${org.slug}`))
                      .catch(() => 0)
                  }
                >
                  Delete
                </Button>
              </Card>
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <Card>
            <Heading level="h5">Meeting Details</Heading>
          </Card>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            <InfoCard
              icon={BiTime}
              content={(() => {
                const start = dayjs(meeting.startTime);
                const end = dayjs(meeting.endTime);
                const now = dayjs();

                if (start.isBefore(now) && end.isBefore(now)) {
                  return "Meeting has ended";
                } else if (start.isBefore(now) && end.isAfter(now)) {
                  return `Meeting is in progress, ends in ${end.fromNow()}`;
                } else if (start.isAfter(now)) {
                  if (now.isSame(start, "day")) {
                    return `Meeting starts at ${start.format(
                      "HH:mm"
                    )}. Ends ${end.fromNow()}`;
                  }
                }

                return `${start.format("DD/MM/YYYY HH:mm")} - ${end.format(
                  "DD/MM/YYYY HH:mm"
                )}`;
              })()}
            />
            <InfoCard
              icon={BiExit}
              content={`Check In ${
                meeting.requireCheckIn ? "Required" : "Not Required"
              }. Check Out ${
                meeting.requireCheckOut ? "Required" : "Not Required"
              }.`}
            />
            <InfoCard
              icon={GoLocation}
              content={meeting.location ?? "No Location Specified"}
            />
            <InfoCard
              icon={IoMdPeople}
              content={
                meeting.limitParticipants
                  ? `${meeting._count.participants} / ${meeting.maxParticipants} Participants`
                  : `${meeting._count.participants} Participants`
              }
            />
            <InfoCard
              icon={BiGift}
              content={
                meeting.rewardsEnabled ? "Rewards Enabled" : "Rewards Disabled"
              }
            />
            <InfoCard
              icon={FaEye}
              content={meeting.isPublic ? "Public" : "Private"}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

MeetingIndex.auth = true;

MeetingIndex.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default MeetingIndex;
