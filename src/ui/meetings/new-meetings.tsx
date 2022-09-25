import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { z } from "zod";
import { useOrg } from "../org/org-shell";

export const NewMeetingsModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const org = useOrg();
  const ctx = trpc.useContext();
  const create = trpc.meeting.create.useMutation();

  const methods = useZodForm({
    schema: z.object({
      name: z.string().min(1),
    }),
    defaultValues: {
      name: "",
    },
  });

  return (
    <DialogWrapper
      isOpen={props.isOpen}
      onClose={() => {
        props.setIsOpen(false);
      }}
    >
      <Dialog.Title as={Heading} level="h3">
        New Meeting
      </Dialog.Title>
      <div className="mt-3 w-96">
        <form
          autoComplete="off"
          onSubmit={methods.handleSubmit(async (values) => {
            await create.mutateAsync({ orgId: org.id, ...values });
            ctx.meeting.list.invalidate();
            props.setIsOpen(false);
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
          <Button type="submit" className="mt-4" loading={create.isLoading}>
            Create
          </Button>
        </form>
      </div>
    </DialogWrapper>
  );
};
