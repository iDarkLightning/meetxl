import { applyLinkSchema } from "@meetxl/shared/schemas/link-schemas";
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { AnimateWrapper } from "@/shared-components/util/animate-wrapper";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { useMeeting } from "@/ui/meetings/meeting-shell";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { AttendanceLinkAction } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { FaExternalLinkAlt, FaPlus } from "react-icons/fa";

const form = createForm(applyLinkSchema);

export const CheckingForm: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const meeting = useMeeting();
  const checkIn = trpc.meeting.attendance.checkIn.useMutation();
  const checkOut = trpc.meeting.attendance.checkOut.useMutation();
  const ctx = trpc.useContext();

  const methods = form.useForm({
    defaultValues: {
      code: "",
    },
  });

  return (
    <div>
      <form.Wrapper
        methods={methods}
        className="flex flex-col gap-2"
        onSubmit={methods.handleSubmit(async (values) => {
          if (props.action === "CHECKIN") {
            await checkIn
              .mutateAsync({
                code: values.code,
                meetingId: meeting.id,
                orgId: meeting.organizationSlug,
              })
              .catch(() => 0);
          } else {
            await checkOut
              .mutateAsync({
                code: values.code,
                meetingId: meeting.id,
                orgId: meeting.organizationSlug,
              })
              .catch(() => 0);
          }

          await ctx.meeting.participant.list.invalidate();
          methods.reset();
        })}
      >
        <form.InputField
          fieldName="code"
          placeholder="Participant's Registration Code"
        />
      </form.Wrapper>
    </div>
  );
};

export const CheckingLinks: React.FC<{ action: AttendanceLinkAction }> = (
  props
) => {
  const meeting = useMeeting();
  const checkingLinks = trpc.meeting.attendance.links.list.useQuery({
    meetingId: meeting.id,
    orgId: meeting.organizationSlug,
    action: props.action,
  });
  const newLink = trpc.meeting.attendance.links.create.useMutation();

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <Heading level="h4">
            Check {props.action === "CHECKIN" ? "In" : "Out"} Links
          </Heading>
          <p className="text-sm opacity-75">
            Create links that participants can use to check{" "}
            {props.action === "CHECKIN" ? "in" : "out"}
          </p>
        </div>
        <Button
          icon={<FaPlus size="0.7rem" />}
          loading={newLink.isLoading}
          onClick={() =>
            newLink
              .mutateAsync({
                action: props.action,
                meetingId: meeting.id,
                orgId: meeting.organizationSlug,
              })
              .then(() => checkingLinks.refetch())
              .catch(() => 0)
          }
        >
          New
        </Button>
      </Card>
      <BaseQueryCell
        query={checkingLinks}
        success={({ data }) => (
          <AnimateWrapper
            className={clsx(
              "flex-col gap-4",
              data.length === 0 ? "hidden" : "flex"
            )}
          >
            {data.map((link) => (
              <Link
                key={link.id}
                href={`/${meeting.organizationSlug}/${
                  meeting.slug
                }/participants/check-${
                  props.action === "CHECKIN" ? "in" : "out"
                }/${link.code}`}
              >
                <Card className="flex cursor-pointer items-center justify-between gap-4 py-2 transition-colors hover:bg-background-dark">
                  <p className="font-mono text-green-400">{link.code}</p>
                  <FaExternalLinkAlt size="0.75rem" />
                </Card>
              </Link>
            ))}
          </AnimateWrapper>
        )}
      />
    </div>
  );
};

export const AttendanceChecking: React.FC<{ action: AttendanceLinkAction }> = (
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
            loading={toggleChecking.isLoading}
            onClick={() =>
              toggleChecking
                .mutateAsync({
                  meetingId: meeting.id,
                  orgId: meeting.organizationSlug,
                  action: props.action,
                })
                .then(() => ctx.meeting.get.invalidate())
                .catch(() => 0)
            }
          >
            {enabled ? "Disable" : "Enable"}
          </Button>
        </div>
        {enabled && <CheckingForm action={props.action} />}
      </Card>
      {enabled && (
        // <Card className="hover:bg-opacity-100">
        <CheckingLinks action={props.action} />
        // </Card>
      )}
    </>
  );
};
