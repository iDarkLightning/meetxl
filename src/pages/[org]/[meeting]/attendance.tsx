import { useZodForm } from "@/lib/hooks/use-zod-form";
import { SectionWrapper } from "@/shared-components/layout/section-wrapper";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { CustomNextPage } from "@/types/next-page";
import { useMeeting } from "@/ui/meetings/meeting-shell";
import { ParticipantShell } from "@/ui/meetings/participant-shell";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import { AttendanceLinkAction } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { FaExternalLinkAlt, FaPlus } from "react-icons/fa";
import { z } from "zod";

const CheckingForm: React.FC<{ action: AttendanceLinkAction }> = (props) => {
  const meeting = useMeeting();
  const checkIn = trpc.meeting.attendance.checkIn.useMutation();
  const checkOut = trpc.meeting.attendance.checkOut.useMutation();
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
    <div>
      <form
        className="flex flex-col gap-2"
        autoComplete="off"
        onSubmit={methods.handleSubmit(async (values) => {
          if (props.action === "CHECKIN") {
            await checkIn.mutateAsync({
              code: values.code,
              meetingId: meeting.id,
              orgId: meeting.organizationSlug,
            });
          } else {
            await checkOut.mutateAsync({
              code: values.code,
              meetingId: meeting.id,
              orgId: meeting.organizationSlug,
            });
          }

          await ctx.meeting.participant.list.invalidate();
          methods.reset();
        })}
      >
        <label htmlFor="name" className="opacity-75">
          Registration Code
        </label>
        <div>
          <div className="flex gap-2">
            <Input
              {...methods.register("code")}
              placeholder="Participant's Registration Code"
            />
          </div>
          {methods.formState.errors.code?.message && (
            <p className="text-accent-danger">
              {methods.formState.errors.code?.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

const CheckingLinks: React.FC<{ action: AttendanceLinkAction }> = (props) => {
  const meeting = useMeeting();
  const checkingLinks = trpc.meeting.attendance.links.list.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
    action: props.action,
  });
  const newLink = trpc.meeting.attendance.links.create.useMutation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading level="h4">
          Check {props.action === "CHECKIN" ? "In" : "Out"} Links
        </Heading>
        <Button
          variant="primary"
          icon={<FaPlus size="0.7rem" />}
          onClick={() =>
            newLink
              .mutateAsync({
                action: props.action,
                meetingId: meeting.id,
                orgId: meeting.organizationSlug,
              })
              .then(() => checkingLinks.refetch())
          }
        >
          New
        </Button>
      </div>
      <BaseQueryCell
        query={checkingLinks}
        success={({ data }) => (
          <AnimateWrapper className="mt-4 flex flex-col gap-4">
            {data.map((link) => (
              <Link
                key={link.id}
                href={`/${meeting.organizationSlug}/${
                  meeting.slug
                }/attendance/check-${
                  props.action === "CHECKIN" ? "in" : "out"
                }/${link.code}`}
              >
                <a>
                  <Card className="flex cursor-pointer items-center justify-between gap-4 py-2 transition-colors hover:bg-background-dark">
                    <p className="font-mono text-green-400">{link.code}</p>
                    <FaExternalLinkAlt size="0.75rem" />
                  </Card>
                </a>
              </Link>
            ))}
          </AnimateWrapper>
        )}
      />
    </div>
  );
};

const AttendanceChecking: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const ctx = trpc.useContext();
  const meeting = useMeeting();
  const toggleChecking = trpc.meeting.attendance.toggleChecking.useMutation();

  const enabled =
    (props.action === "CHECKIN" && meeting.requireCheckIn) ||
    (props.action === "CHECKOUT" && meeting.requireCheckOut);

  return (
    <>
      <Card className="hover:bg-opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h4">
              Check {props.action === "CHECKIN" ? "In" : "Out"} Options
            </Heading>
          </div>
          <Button
            variant={enabled ? "danger" : "primary"}
            loading={toggleChecking.isLoading}
            onClick={() =>
              toggleChecking
                .mutateAsync({
                  meetingId: meeting.id,
                  orgId: meeting.organizationSlug,
                  action: props.action,
                })
                .then(() => ctx.meeting.get.invalidate())
            }
          >
            {enabled ? "Disable" : "Enable"}
          </Button>
        </div>
        {enabled && <CheckingForm action={props.action} />}
      </Card>
      {enabled && (
        <Card className="hover:bg-opacity-100">
          <CheckingLinks action={props.action} />
        </Card>
      )}
    </>
  );
};

const MeetingAttendance: CustomNextPage = () => {
  const meeting = useMeeting();

  return (
    <SectionWrapper>
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
          <Tab.Panel className="flex flex-col gap-4">
            <AttendanceChecking action="CHECKIN" />
          </Tab.Panel>
          <Tab.Panel className="flex flex-col gap-4">
            <AttendanceChecking action="CHECKOUT" />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </SectionWrapper>
  );
};

MeetingAttendance.auth = true;

MeetingAttendance.getLayout = (page) => (
  <ParticipantShell
    heading="Attendance"
    sub="Manage attendance for this meeting's participants"
  >
    {page}
  </ParticipantShell>
);

export default MeetingAttendance;
