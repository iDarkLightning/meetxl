import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Input } from "@/shared-components/system/input";
import { trpc } from "@/utils/trpc";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { z } from "zod";

const CreateOrganization: React.FC = () => {
  const ctx = trpc.useContext();
  const create = trpc.organization.create.useMutation();

  const methods = useZodForm({
    schema: z.object({
      name: z.string().min(1),
    }),
    defaultValues: {
      name: "",
    },
  });

  return (
    <div className="mt-6 flex w-96 flex-col gap-4">
      <form
        autoComplete="off"
        onSubmit={methods.handleSubmit(async (values) => {
          await create.mutateAsync(values).catch(() => 0);
          ctx.organization.list.invalidate();
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

  const methods = useZodForm({
    schema: z.object({
      code: z.string().min(1),
    }),
    defaultValues: {
      code: "",
    },
  });

  return (
    <div className="mt-6 flex w-96 flex-col gap-4">
      <form
        autoComplete="off"
        onSubmit={methods.handleSubmit(async (values) => {
          await join.mutateAsync(values).catch(() => 0);
          ctx.organization.list.invalidate();
        })}
      >
        <label htmlFor="name" className="text-gray-400">
          Code
        </label>
        <Input {...methods.register("code")} className="mt-2" />
        {methods.formState.errors.code?.message && (
          <p className="text-red-500">
            {methods.formState.errors.code?.message}
          </p>
        )}
        <Button type="submit" className="mt-4" loading={join.isLoading}>
          Join
        </Button>
      </form>
    </div>
  );
};

export const NewOrganizationModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const [mode, setMode] = useState<"unselected" | "join" | "create">(
    "unselected"
  );

  return (
    <DialogWrapper
      isOpen={props.isOpen}
      onClose={() => {
        props.setIsOpen(false);
        setTimeout(() => {
          setMode("unselected");
        }, 250);
      }}
    >
      <Dialog.Title as={Heading} level="h3">
        New Organization
      </Dialog.Title>
      {mode === "unselected" && (
        <div className="mt-4 flex flex-col gap-4">
          <Button
            className="h-16 w-96 flex-row-reverse justify-between"
            icon={<FaChevronRight />}
            onClick={() => setMode("join")}
          >
            Join a New Organization
          </Button>
          <Button
            className="h-16 w-96 flex-row-reverse justify-between"
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
  );
};
