import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";
import useWindowSize from "../../hooks/use-window-size";
import { cn } from "../../utils";
import * as SelectPrimitive from "./select-primitive";

export const Select = SelectPrimitive.Root;

export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = SelectPrimitive.Value;

export const SelectPortal = SelectPrimitive.Portal;

export const SelectOverlay = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Overlay>
>((props, ref) => (
  <SelectPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  </SelectPrimitive.Overlay>
));

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex min-w-[8rem] items-center justify-between rounded-md border border-neutral-stroke bg-neutral py-1.5 px-3 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40 disabled:cursor-not-allowed disabled:opacity-80",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectMobile = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPortal className="fixed bottom-0 left-0 right-0 z-50 flex items-center">
      <SelectPrimitive.Content
        className={cn(
          "z-50 overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-primary py-2",
          className
        )}
        ref={ref}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: "5%" }}
          animate={{ opacity: 1, y: "0" }}
          exit={{ opacity: 0, y: "5%" }}
          transition={{ duration: 0.15 }}
        >
          <SelectPrimitive.Viewport className="w-full">
            {children}
          </SelectPrimitive.Viewport>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPortal>
  );
});

export const SelectDesktop = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    width: string | null;
  }
>(({ className, children, width, ...props }, ref) => {
  return (
    <SelectPortal style={{ ["--width" as string]: width }}>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 mt-1 h-max max-h-48 w-[var(--width)] overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral p-1 shadow-md",
          className
        )}
        position="popper"
        align="end"
        ref={ref}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: "-5%" }}
          animate={{ opacity: 1, y: "0" }}
          exit={{ opacity: 0, y: "-5%" }}
          transition={{ duration: 0.15 }}
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPortal>
  );
});

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    width: string | null;
  }
>((props, ref) => {
  const { isMobile, loading } = useWindowSize();

  if (loading) return null;
  if (isMobile) return <SelectMobile {...props} ref={ref} />;
  return <SelectDesktop {...props} ref={ref} width={props.width} />;
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 px-8 text-sm font-semibold text-neutral-400",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center py-1.5 px-8 text-sm font-medium outline-none hover:bg-neutral-700 data-[highlighted]:bg-neutral-700 sm:rounded-md",
      props.disabled && "opacity-40",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectSeparator = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px w-full bg-neutral-stroke", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
