import { createForm } from "@/utils/create-form";
import { Dialog } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { z } from "zod";
import { Button } from "../system/button";
import { DialogWrapper } from "../system/dialog";
import { Heading } from "../system/heading";

interface Props {
  confirmationText: string;
  loading: boolean;
  onConfirm: () => void;
  buttonElement?: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
}

const _form = (confirmation: string) =>
  createForm(
    z.object({
      confirmation: z.literal(confirmation),
    })
  );

export const DeleteButton: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useMemo(
    () => _form(props.confirmationText),
    [props.confirmationText]
  );

  const methods = form.useForm({
    defaultValues: {
      confirmation: "",
    },
  });

  return (
    <>
      {typeof props.buttonElement === "function" ? (
        props.buttonElement(setIsOpen)
      ) : (
        <Button
          variant="danger"
          icon={<FaTrash />}
          className="w-min"
          onClick={() => setIsOpen(true)}
        >
          Delete
        </Button>
      )}
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
            onSubmit={methods.handleSubmit(async () => {
              props.onConfirm();
            })}
          >
            <form.InputField
              fieldName="confirmation"
              label={`Please enter ${props.confirmationText} to confirm this deletion.`}
            />
            <form.SubmitButton
              className="mt-4"
              variant="danger"
              loading={props.loading}
            >
              Confirm Delete
            </form.SubmitButton>
          </form.Wrapper>
        </div>
      </DialogWrapper>
    </>
  );
};
