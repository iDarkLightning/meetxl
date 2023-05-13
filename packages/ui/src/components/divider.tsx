import * as DividerPrimitive from "@radix-ui/react-separator";
import { forwardRef } from "react";
import { cn } from "../utils";

export const Divider = forwardRef<
  React.ElementRef<typeof DividerPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DividerPrimitive.Root>
>(({ orientation = "horizontal", className, ...props }, ref) => {
  return (
    <DividerPrimitive.Root
      className={cn(
        "bg-neutral-stroke",
        orientation === "horizontal"
          ? "h-[0.025rem] w-full"
          : "h-full w-[0.025rem]",
        className
      )}
      orientation={orientation}
      ref={ref}
      {...props}
    />
  );
});
