import { useZodForm } from "@/lib/hooks/use-zod-form";
import { Button, ButtonProps } from "@/shared-components/system/button";
import React, {
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

type LabelProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

type ErrorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

type FieldProps<T> = {
  fieldName: T;
  label?: string;
  labelProps?: LabelProps;
  errorProps?: ErrorProps;
};

const Label: React.FC<
  React.PropsWithChildren<{ fieldName: string } & LabelProps>
> = (props) => {
  return (
    <label htmlFor={props.fieldName} className="text-gray-400" {...props}>
      {props.children ??
        props.fieldName.substring(0, 1).toUpperCase() +
          props.fieldName.substring(1)}
    </label>
  );
};

const ErrorMessage: React.FC<React.PropsWithChildren<ErrorProps>> = (props) => {
  return (
    <p className="text-red-500" {...props}>
      {props.children}
    </p>
  );
};

export const createForm = <T extends z.ZodType>(schema: T) => {
  type FieldValues = T["_output"];

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

    Label: (
      props: {
        fieldName: keyof FieldValues;
        children?: React.ReactNode;
      } & LabelProps
    ) => {
      return (
        <Label fieldName={props.fieldName as string}>{props.children}</Label>
      );
    },

    ErrorMessage: (props: { fieldName: keyof FieldValues } & ErrorProps) => {
      const methods = useFormContext<FieldValues>();
      const message = methods.formState.errors[props.fieldName]?.message;

      if (!message) {
        return null;
      }

      return <ErrorMessage {...props}>{message as string}</ErrorMessage>;
    },

    Input: (props: { fieldName: keyof FieldValues } & InputProps) => {
      const methods = useFormContext<FieldValues>();

      return (
        <Input
          {...methods.register(props.fieldName as Path<FieldValues>)}
          {...props}
        />
      );
    },

    InputField: (props: FieldProps<keyof FieldValues> & InputProps) => {
      const methods = useFormContext<FieldValues>();

      const fieldName = props.fieldName as Path<FieldValues>;

      return (
        <div className="flex flex-col gap-2">
          <Label fieldName={fieldName as string} {...props.labelProps}>
            {props.label}
          </Label>
          <Input {...methods.register(fieldName)} {...props} />
          {methods.formState.errors[fieldName]?.message && (
            <ErrorMessage {...props.errorProps}>
              {methods.formState.errors[fieldName]?.message as string}
            </ErrorMessage>
          )}
        </div>
      );
    },

    SelectField: (props: FieldProps<keyof FieldValues> & SelectProps) => {
      const methods = useFormContext<FieldValues>();

      const fieldName = props.fieldName as Path<FieldValues>;

      return (
        <div className="flex flex-col gap-3">
          <Label fieldName={fieldName as string} {...props.labelProps}>
            {props.label}
          </Label>
          <Select {...methods.register(fieldName)} {...props} />
          {methods.formState.errors[fieldName]?.message && (
            <ErrorMessage {...props.errorProps}>
              {methods.formState.errors[fieldName]?.message as string}
            </ErrorMessage>
          )}
        </div>
      );
    },

    SubmitButton: (props: ButtonProps) => {
      return <Button type="submit" {...props} />;
    },
  };
};
