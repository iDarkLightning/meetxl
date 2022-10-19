import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { Select } from "@/shared-components/system/select";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { AttributeModifierAction } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";
import { useOrg } from "../org/org-shell";

export const NewAttributeLink: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const org = useOrg();
  const ctx = trpc.useContext();
  const createLink = trpc.organization.attribute.links.create.useMutation();
  const methods = useZodForm({
    schema: z.object({
      name: z.string().min(1),
      value: z.string(),
      action: z.nativeEnum(AttributeModifierAction),
    }),
    defaultValues: {
      name: "",
      value: "0",
      action: AttributeModifierAction.INCREMENT,
    },
  });

  return (
    <>
      <Button
        className="w-min"
        onClick={() => setIsOpen(true)}
        variant="primary"
        icon={<FaPlus size="0.75rem" />}
      >
        New
      </Button>
      <DialogWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Title as={Heading} level="h3">
          New Link
        </Dialog.Title>
        <div className="mt-3 w-96">
          <form
            className="flex flex-col items-end gap-2"
            autoComplete="off"
            onSubmit={methods.handleSubmit(async (values) => {
              await createLink
                .mutateAsync({
                  orgId: org.id,
                  value: parseInt(values.value),
                  name: values.name,
                  action: values.action,
                  attributeName: router.query.name as string,
                })
                .catch(() => 0);
              ctx.meeting.reward.list.invalidate();
              setIsOpen(false);
            })}
          >
            <div className="flex w-full flex-col">
              <label htmlFor="name" className="text-gray-400">
                Name
              </label>
              <Input {...methods.register("name")} className="mt-2" />
            </div>
            <div className="w-full">
              <label htmlFor="value" className="text-gray-400">
                Value
              </label>
              <Input
                {...methods.register("value")}
                className="mt-2"
                type="number"
              />
            </div>
            <div className="flex w-full flex-col">
              <label htmlFor="value" className="text-gray-400">
                Action
              </label>
              <Select {...methods.register("action")} className="mt-2">
                <option value={AttributeModifierAction.INCREMENT}>
                  Increment
                </option>
                <option value={AttributeModifierAction.DECREMENT}>
                  Decrement
                </option>
                <option value={AttributeModifierAction.SET}>Set</option>
              </Select>
            </div>
            <Button type="submit" className="mt-4">
              Create
            </Button>
          </form>
        </div>
      </DialogWrapper>
    </>
  );
};
