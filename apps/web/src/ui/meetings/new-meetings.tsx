import { createMeetingSchema } from "@meetxl/shared/schemas/meeting-schemas";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";

const form = createForm(createMeetingSchema);

export const NewMeetingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const org = useOrg();
  const ctx = trpc.useContext();
  const create = trpc.meeting.create.useMutation();

  const methods = form.useForm({
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
          <form.Wrapper
            methods={methods}
            onSubmit={methods.handleSubmit(async (values) => {
              await create
                .mutateAsync({ orgId: org.id, ...values })
                .catch(() => 0);
              ctx.meeting.list.invalidate();
              setIsOpen(false);
            })}
          >
            <form.InputField fieldName="name" />
            <form.InputField fieldName="startTime" type="datetime-local" />
            <form.InputField fieldName="endTime" type="datetime-local" />
            <form.SubmitButton className="mt-4" loading={create.isLoading}>
              Create
            </form.SubmitButton>
          </form.Wrapper>
        </div>
      </DialogWrapper>
    </>
  );
};
