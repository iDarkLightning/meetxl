import { createMeetingRewardSchema } from "@meetxl/shared/schemas/meeting-schemas";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { AttributeModifierAction } from "@prisma/client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOrg } from "../org/org-shell";
import { useMeeting } from "./meeting-shell";

const form = createForm(createMeetingRewardSchema);

export const NewReward: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const org = useOrg();
  const meeting = useMeeting();
  const ctx = trpc.useContext();
  const createReward = trpc.meeting.reward.create.useMutation();
  const methods = form.useForm({
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
                  <form.Wrapper
                    methods={methods}
                    className="flex flex-col items-end gap-2"
                    onSubmit={methods.handleSubmit(async (values) => {
                      await createReward
                        .mutateAsync({
                          orgId: org.id,
                          meetingId: meeting.id,
                          value: values.value,
                          key: values.key,
                          action: values.action,
                        })
                        .catch(() => 0);
                      ctx.meeting.reward.list.invalidate();

                      methods.reset();
                      setIsOpen(false);
                    })}
                  >
                    <div className="flex w-full flex-col gap-2">
                      <form.SelectField
                        fieldName="key"
                        options={data.map((attribute) => attribute.name)}
                      />
                      <form.InputField fieldName="value" type="number" />
                      <form.SelectField
                        fieldName="action"
                        options={Object.keys(AttributeModifierAction)}
                      />
                    </div>
                    <form.SubmitButton
                      className="mt-4"
                      loading={createReward.isLoading}
                    >
                      Create
                    </form.SubmitButton>
                  </form.Wrapper>
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
