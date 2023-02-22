import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, VariantProps } from "class-variance-authority";

const checkboxStyles = cva(
  "peer h-5 w-5 shrink-0 rounded-sm border-[0.025rem] border-neutral-stroke bg-neutral transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-disco focus:ring-opacity-40 disabled:cursor-not-allowed disabled:opacity-80",
  {
    variants: {
      variant: {
        primary: "data-[state=checked]:bg-primary",
        secondary: "data-[state=checked]:bg-neutral-700",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: VariantProps<typeof checkboxStyles>["variant"];
}

export const Checkbox: React.FC<CheckboxProps> = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ variant, ...props }, ref) => {
  return (
    <>
      <CheckboxPrimitive.Root
        ref={ref}
        className={checkboxStyles({ variant })}
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
