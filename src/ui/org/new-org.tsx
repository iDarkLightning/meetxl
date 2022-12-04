import { applyLinkSchema } from "@/lib/schemas/link-schemas";
import { createOrgSchema } from "@/lib/schemas/org-schemas";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { createForm } from "@/utils/create-form";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";

const createOrgForm = createForm(createOrgSchema);
const joinOrgForm = createForm(applyLinkSchema);

const CreateOrganization: React.FC = () => {
  const ctx = trpc.useContext();
  const create = trpc.organization.create.useMutation();

  const methods = createOrgForm.useForm({
    defaultValues: {
      name: "",
    },
  });

  return (
    <div className="mt-6 flex flex-col gap-4">
      <createOrgForm.Wrapper
        methods={methods}
        onSubmit={methods.handleSubmit(async (values) => {
          await create.mutateAsync(values).catch(() => 0);
          ctx.organization.list.invalidate();
        })}
      >
        <createOrgForm.InputField fieldName="name" />
        <createOrgForm.SubmitButton className="mt-4" loading={create.isLoading}>
          Create
        </createOrgForm.SubmitButton>
      </createOrgForm.Wrapper>
    </div>
  );
};

const JoinOrganization: React.FC = () => {
  const router = useRouter();
  const ctx = trpc.useContext();
  const join = trpc.organization.joinCode.accept.useMutation({
    onSuccess(data) {
      router.push(`/${data.slug}`);
    },
  });

  const methods = joinOrgForm.useForm({
    defaultValues: {
      code: "",
    },
  });

  return (
    <div className="mt-6 flex flex-col gap-4">
      <joinOrgForm.Wrapper
        methods={methods}
        onSubmit={methods.handleSubmit(async (values) => {
          await join.mutateAsync(values).catch(() => 0);
          ctx.organization.list.invalidate();
        })}
      >
        <joinOrgForm.InputField fieldName="code" />
        <joinOrgForm.SubmitButton className="mt-4" loading={join.isLoading}>
          Join
        </joinOrgForm.SubmitButton>
      </joinOrgForm.Wrapper>
    </div>
  );
};

export const NewOrganizationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"unselected" | "join" | "create">(
    "unselected"
  );

  return (
    <>
      <Button
        icon={<FaPlus size="0.75rem" />}
        variant="primary"
        size="sm"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        New
      </Button>
      <DialogWrapper
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setTimeout(() => {
            setMode("unselected");
          }, 250);
        }}
      >
        <Dialog.Title as={Heading} level="h3">
          New Organization
        </Dialog.Title>
        {mode === "unselected" && (
          <div className="mt-4 flex flex-col gap-4 md:w-96">
            <Button
              className="h-16 w-full flex-row-reverse justify-between gap-2"
              icon={<FaChevronRight />}
              onClick={() => setMode("join")}
            >
              Join a New Organization
            </Button>
            <Button
              className="h-16 w-full flex-row-reverse justify-between gap-2"
              icon={<FaChevronRight />}
              onClick={() => setMode("create")}
            >
              Create a New Organization
            </Button>
          </div>
        )}
        {mode === "create" && <CreateOrganization />}
        {mode === "join" && <JoinOrganization />}
      </DialogWrapper>
    </>
  );
};
