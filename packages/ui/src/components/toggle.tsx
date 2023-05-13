import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "../utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors data-[state=on]:bg-neutral focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40 disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:bg-neutral",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "bg-transparent border-[0.025rem] border-neutral-stroke hover:bg-neutral",
      },
      size: {
        sm: "h-9 px-2.5",
        md: "h-11 px-3.5",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
