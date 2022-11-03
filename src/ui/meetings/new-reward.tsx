import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { Select } from "@/shared-components/system/select";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { AttributeModifierAction } from "@prisma/client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";
import { useOrg } from "../org/org-shell";
import { useMeeting } from "./meeting-shell";

export const NewReward: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const org = useOrg();
  const meeting = useMeeting();
  const ctx = trpc.useContext();
  const createReward = trpc.meeting.reward.create.useMutation();
  const methods = useZodForm({
    schema: z.object({
      key: z.string().min(1),
      value: z.string(),
      action: z.nativeEnum(AttributeModifierAction),
    }),
    defaultValues: {
      key: "",
      value: "0",
      action: AttributeModifierAction.INCREMENT,
    },
  });
  const attributes = trpc.organization.attribute.list.useQuery({
    orgId: org.id,
  });

  return (
    <>
      <Button
        className="w-full"
        onClick={() => setIsOpen(true)}
        variant="primary"
        icon={<FaPlus size="0.75rem" />}
      >
        New
      </Button>
      <DialogWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Title as={Heading} level="h3">
          New Reward
        </Dialog.Title>
        <BaseQueryCell
          query={attributes}
          success={({ data }) => (
            <>
              {data.length > 0 && (
                <div className="mt-3 md:w-96">
                  <form
                    className="flex flex-col items-end gap-2"
                    autoComplete="off"
                    onSubmit={methods.handleSubmit(async (values) => {
                      await createReward
                        .mutateAsync({
                          orgId: org.id,
                          meetingId: meeting.id,
                          value: parseInt(values.value),
                          key: values.key,
                          action: values.action,
                        })
                        .catch(() => 0);
                      ctx.meeting.reward.list.invalidate();
                      setIsOpen(false);
                    })}
                  >
                    <div className="flex w-full flex-col">
                      <label htmlFor="name" className="text-gray-400">
                        Key
                      </label>
                      <Select {...methods.register("key")} className="mt-2">
                        {data.map((attribute, idx) => (
                          <option value={attribute.name} key={idx}>
                            {attribute.name}
                          </option>
                        ))}
                      </Select>
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
              )}
              {data.length === 0 && (
                <div className="mt-3">
                  <p className="text-gray-400">
                    You need to create attributes at the organization level
                    before you can create rewards.
                  </p>
                </div>
              )}
            </>
          )}
        />
      </DialogWrapper>
    </>
  );
};
