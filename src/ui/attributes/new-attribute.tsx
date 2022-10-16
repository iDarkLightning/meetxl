import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";
import { useOrg } from "../org/org-shell";

export const NewAttributeModal: React.FC = () => {
  const org = useOrg();
  const ctx = trpc.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const create = trpc.organization.attribute.create.useMutation();

  const methods = useZodForm({
    schema: z.object({
      name: z.string().min(1),
    }),
    defaultValues: {
      name: "",
    },
  });

  return (
    <>
      <Button
        icon={<FaPlus size="0.75rem" />}
        variant="primary"
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
          New Attribute
        </Dialog.Title>
        <div className="mt-3 w-96">
          <form
            autoComplete="off"
            onSubmit={methods.handleSubmit(async (values) => {
              await create
                .mutateAsync({ orgId: org.id, ...values })
                .catch(() => 0);
              ctx.organization.attribute.list.invalidate();
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
            <Button type="submit" className="mt-4" loading={create.isLoading}>
              Create
            </Button>
          </form>
        </div>
      </DialogWrapper>
    </>
  );
};
