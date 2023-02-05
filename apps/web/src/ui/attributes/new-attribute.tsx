import { createAttributeSchema } from "@meetxl/shared/schemas/org-schemas";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import React from "react";
import { useOrg } from "../org/org-shell";
import { toast } from "react-toastify";
import { Button } from "@/shared-components/system/button";

const form = createForm(createAttributeSchema);

export const NewAttributeModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const org = useOrg();
  const ctx = trpc.useContext();
  const create = trpc.organization.attribute.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;

      toast(() => (
        <div className="flex flex-col gap-2">
          <p>
            Attribute <span className="font-mono">{data.name}</span> created
            succesfully
          </p>
          <Button
            variant="unstyled"
            className="text-blue-500 hover:underline"
            href={`/${org.slug}/attributes/${data.name}`}
          >
            View Attribute
          </Button>
        </div>
      ));
    },
  });

  const methods = form.useForm({
    defaultValues: {
      name: "",
    },
  });

  return (
    <>
      <DialogWrapper
        isOpen={props.isOpen}
        onClose={() => {
          props.setIsOpen(false);
        }}
      >
        <Dialog.Title as={Heading} level="h3">
          New Attribute
        </Dialog.Title>
        <div className="mt-3 md:w-96">
          <form.Wrapper
            className="flex flex-col gap-4"
            methods={methods}
            onSubmit={methods.handleSubmit(async (values) => {
              await create
                .mutateAsync({ orgId: org.id, ...values })
                .catch(() => 0);
              ctx.organization.attribute.list.invalidate();
              props.setIsOpen(false);
            })}
          >
            <form.InputField fieldName="name" />
            <form.SubmitButton loading={create.isLoading}>
              Create
            </form.SubmitButton>
          </form.Wrapper>
        </div>
      </DialogWrapper>
    </>
  );
};
