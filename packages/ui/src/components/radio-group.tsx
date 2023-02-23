import React, { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../utils";

export const RadioGroupWrapper = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>((props, ref) => {
  return <RadioGroupPrimitive.Root {...props} className="flex" ref={ref} />;
});

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    isFirst?: boolean;
    isLast?: boolean;
  }
>((props, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      {...props}
      className={cn(
        "focus:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40",
        "border-[0.025rem] border-neutral-stroke bg-neutral py-1 px-4 text-sm font-medium transition-[background-color] disabled:cursor-not-allowed disabled:opacity-80 data-[state=checked]:bg-neutral-700",
        !props.isFirst && !props.isLast && "border-r-0",
        props.isFirst && "rounded-l-md border-r-0",
        props.isLast && "rounded-r-md"
      )}
    />
  );
});

export type RadioItems = { value: string; display: string }[];

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    options: RadioItems;
  }
>((props, ref) => {
  return (
    <RadioGroupWrapper ref={ref} {...props}>
      {props.options.map((option, index) => (
        <RadioGroupItem
          key={index}
          value={option.value}
          isFirst={index === 0}
          isLast={index === props.options.length - 1}
        >
          {option.display}
        </RadioGroupItem>
      ))}
    </RadioGroupWrapper>
  );
});
