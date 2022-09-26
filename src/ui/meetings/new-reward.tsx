import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { Select } from "@/shared-components/system/select";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { MeetingRewardAction } from "@prisma/client";
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
  const createMeeting = trpc.meeting.reward.create.useMutation();
  const methods = useZodForm({
    schema: z.object({
      key: z.string().min(1),
      value: z.string(),
      action: z.nativeEnum(MeetingRewardAction),
    }),
    defaultValues: {
      key: "",
      value: "0",
      action: MeetingRewardAction.INCREMENT,
    },
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
        <div className="mt-3 w-96">
          <form
            className="flex flex-col items-end gap-2"
            autoComplete="off"
            onSubmit={methods.handleSubmit(async (values) => {
              await createMeeting.mutateAsync({
                orgId: org.id,
                meetingId: meeting.id,
                value: parseInt(values.value),
                key: values.key,
                action: values.action,
              });
              ctx.meeting.reward.list.invalidate();
              setIsOpen(false);
            })}
          >
            <div className="w-full">
              <label htmlFor="name" className="text-gray-400">
                Key
              </label>
              <Input {...methods.register("key")} className="mt-2" />
              {methods.formState.errors.key?.message && (
                <p className="text-red-500">
                  {methods.formState.errors.key?.message}
                </p>
              )}
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
                <option value={MeetingRewardAction.INCREMENT}>Increment</option>
                <option value={MeetingRewardAction.DECREMENT}>Decrement</option>
                <option value={MeetingRewardAction.SET}>Set</option>
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
