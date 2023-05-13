"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../utils";
import React, { forwardRef } from "react";

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    providerProps?: Omit<
      React.ComponentProps<typeof TooltipProvider>,
      "children"
    >;
  }
> = ({ providerProps = { delayDuration: 100 }, ...props }) => {
  return (
    <TooltipProvider {...providerProps}>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
};

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral px-3 py-1.5 text-sm shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
