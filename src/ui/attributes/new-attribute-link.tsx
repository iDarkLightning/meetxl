import { createAttributeLinkShema } from "@/lib/schemas/link-schemas";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { AttributeModifierAction } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";

const form = createForm(createAttributeLinkShema.omit({ attributeName: true }));

export const NewAttributeLink: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const org = useOrg();
  const ctx = trpc.useContext();
  const createLink = trpc.organization.attribute.links.create.useMutation();
  const methods = form.useForm({
    defaultValues: {
      name: "",
      value: "0",
      action: AttributeModifierAction.INCREMENT,
    },
  });

  return (
    <>
      <Button
        className="w-full md:w-min"
        onClick={() => setIsOpen(true)}
        icon={<FaPlus size="0.75rem" />}
      >
        New
      </Button>
      <DialogWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Title as={Heading} level="h3">
          New Link
        </Dialog.Title>
        <div className="mt-3 md:w-96">
          <form.Wrapper
            methods={methods}
            className="flex flex-col items-end gap-2"
            onSubmit={methods.handleSubmit(async (values) => {
              await createLink
                .mutateAsync({
                  orgId: org.id,
                  value: values.value,
                  name: values.name,
                  action: values.action,
                  attributeName: router.query.name as string,
                })
                .catch(() => 0);
              ctx.organization.attribute.links.list.invalidate();
              setIsOpen(false);
            })}
          >
            <div className="flex w-full flex-col">
              <form.InputField fieldName="name" />
              <form.InputField fieldName="value" type="number" />
              <form.SelectField
                fieldName="action"
                options={Object.keys(AttributeModifierAction)}
              />
            </div>
            <form.SubmitButton className="mt-4">Create</form.SubmitButton>
          </form.Wrapper>
        </div>
      </DialogWrapper>
    </>
  );
};
