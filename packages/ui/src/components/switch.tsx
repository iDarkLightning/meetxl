import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const switchStyles = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40 disabled:cursor-not-allowed disabled:opacity-80 ",
  {
    variants: {
      variant: {
        primary:
          "data-[state=unchecked]:bg-neutral data-[state=checked]:bg-primary",
        secondary:
          "data-[state=unchecked]:bg-neutral data-[state=checked]:bg-neutral-700",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  variant?: VariantProps<typeof switchStyles>["variant"];
  thumbProps?: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>;
}

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ variant, thumbProps, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      className={switchStyles({ variant })}
      ref={ref}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block h-5 w-5 rounded-full bg-neutral-200 ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        {...thumbProps}
      />
    </SwitchPrimitive.Root>
  );
});
