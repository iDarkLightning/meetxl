import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

export const Checkbox: React.FC<CheckboxProps> = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>((props, ref) => {
  return (
    <>
      <CheckboxPrimitive.Root
        ref={ref}
        className="peer h-5 w-5 shrink-0 rounded-sm border-[0.025rem] border-neutral-stroke bg-neutral transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-disco focus:ring-opacity-40 disabled:cursor-not-allowed disabled:opacity-80 data-[state=checked]:bg-primary"
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
