import { useZodForm } from "@/lib/hooks/use-zod-form";
import { createMeetingSchema } from "@/lib/schemas/meeting-schemas";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";

export const NewMeetingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const org = useOrg();
  const ctx = trpc.useContext();
  const create = trpc.meeting.create.useMutation();

  const methods = useZodForm({
    schema: createMeetingSchema,
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
    },
  });

  return (
    <>
      <Button
        className="w-full md:w-min"
        variant="primary"
        icon={<FaPlus size="0.75rem" />}
        onClick={() => setIsOpen(true)}
      >
        New
      </Button>
      <DialogWrapper
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Dialog.Title as={Heading} level="h3">
          New Meeting
        </Dialog.Title>
        <div className="mt-3 md:w-96">
          <form
            autoComplete="off"
            onSubmit={methods.handleSubmit(async (values) => {
              await create
                .mutateAsync({ orgId: org.id, ...values })
                .catch(() => 0);
              ctx.meeting.list.invalidate();
              setIsOpen(false);
            })}
          >
            <label htmlFor="name" className="text-gray-400">
              Name
            </label>
            <Input {...methods.register("name")} className="mt-2" />
            {methods.formState.errors.name?.message && (
              <p className="text-red-500">
                {methods.formState.errors.name?.message}
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
            <Button type="submit" className="mt-4" loading={create.isLoading}>
              Create
            </Button>
          </form>
        </div>
      </DialogWrapper>
    </>
  );
};
