import { useZodForm } from "@/lib/hooks/use-zod-form";
import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  HTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import {
  FormProvider,
  Path,
  useFormContext,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { Input, InputProps } from "../shared-components/system/input";
import { Select, SelectProps } from "../shared-components/system/select";

type FieldProps<T> = {
  fieldName: T;
  label?: string;
  labelProps?: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
  errorProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >;
};

export const createForm = <T extends z.ZodType>(schema: T) => {
  return {
    schema,

    useForm: (args: Omit<UseFormProps<T["_input"]>, "resolver">) =>
      useZodForm({ schema, ...args }),

    Wrapper: (
      props: {
        methods: UseFormReturn<T["_input"]>;
        children: React.ReactNode;
      } & DetailedHTMLProps<
        FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >
    ) => {
      const { methods, children, ...rest } = props;

      return (
        <FormProvider {...methods}>
          <form autoComplete="off" {...rest}>
            {children}
          </form>
        </FormProvider>
      );
    },

    InputField: (
      props: FieldProps<keyof z.infer<typeof schema>> & InputProps
    ) => {
      const methods = useFormContext<z.infer<typeof schema>>();

      const fieldName = props.fieldName as Path<z.infer<typeof schema>>;

      return (
        <>
          <label
            htmlFor={fieldName}
            className="text-gray-400"
            {...props.labelProps}
          >
            {props.label ??
              fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1)}
          </label>
          <Input {...methods.register(fieldName)} {...props} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {methods.formState.errors[fieldName as any]?.message && (
            <p className="text-red-500" {...props.errorProps}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {methods.formState.errors[fieldName as any]?.message as string}
            </p>
          )}
        </>
      );
    },

    SelectField: (
      props: FieldProps<keyof z.infer<typeof schema>> & SelectProps
    ) => {
      const methods = useFormContext<z.infer<typeof schema>>();

      const fieldName = props.fieldName as Path<z.infer<typeof schema>>;

      return (
        <>
          <label
            htmlFor={fieldName}
            className="text-gray-400"
            {...props.labelProps}
          >
            {props.label ??
              fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1)}
          </label>
          <Select {...methods.register(fieldName)} {...props} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {methods.formState.errors[fieldName as any]?.message && (
            <p className="text-red-500" {...props.errorProps}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {methods.formState.errors[fieldName as any]?.message as string}
            </p>
          )}
        </>
      );
    },
  };
};
