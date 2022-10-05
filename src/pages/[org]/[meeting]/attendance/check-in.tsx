import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { Input } from "@/shared-components/system/input";
import { CustomNextPage } from "@/types/next-page";
import { MeetingShell, useMeeting } from "@/ui/meetings/meeting-shell";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { z } from "zod";

const AttendanceCheckIn: CustomNextPage = () => {
  const meeting = useMeeting();
  const checkIn = trpc.meeting.attendance.checkIn.useMutation();
  const methods = useZodForm({
    schema: z.object({
      code: z.string().min(1),
    }),
    defaultValues: {
      code: "",
    },
  });

  return (
    <div className="mt-6 flex w-96 flex-col gap-4">
      <form
        autoComplete="off"
        onSubmit={methods.handleSubmit(async (values) => {
          checkIn.mutateAsync({
            code: values.code,
            meetingId: meeting.id,
            orgId: meeting.organizationSlug,
          });
        })}
      >
        <label htmlFor="name" className="text-gray-400">
          Code
        </label>
        <Input {...methods.register("code")} className="mt-2" />
        {methods.formState.errors.code?.message && (
          <p className="text-red-500">
            {methods.formState.errors.code?.message}
          </p>
        )}
        <Button type="submit" className="mt-4" loading={checkIn.isLoading}>
          Check In
        </Button>
      </form>
    </div>
  );
};

AttendanceCheckIn.auth = true;

AttendanceCheckIn.getLayout = (page) => <MeetingShell>{page}</MeetingShell>;

export default AttendanceCheckIn;
