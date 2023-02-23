import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../utils";
import useWindowSize from "../hooks/use-window-size";
import { motion, useAnimation } from "framer-motion";

const MotionSelectContent = motion(SelectPrimitive.Content);
const MotionViewport = motion(SelectPrimitive.Viewport);

export const Select = SelectPrimitive.Root;

export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex min-w-[8rem] items-center justify-between rounded-md border border-neutral-stroke bg-neutral py-1 px-3 font-medium disabled:cursor-not-allowed disabled:opacity-80",
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
    <SelectPrimitive.Portal className="fixed bottom-0 left-0 right-0 z-50 flex h-full items-center">
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "z-50 h-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral animate-in slide-out-to-bottom-5",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="w-full p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectDesktop = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Portal className="">
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 h-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral animate-in slide-out-to-bottom-5",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="w-full p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>((props, ref) => {
  const { isMobile } = useWindowSize();

  if (isMobile) return <SelectMobile {...props} ref={ref} />;
  return <SelectDesktop {...props} ref={ref} />;
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 pr-2 pl-8 text-sm font-semibold text-neutral-400",
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
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pr-2 pl-8 text-sm font-medium outline-none hover:bg-neutral-700 data-[highlighted]:bg-neutral-700 data-[state=checked]:bg-neutral-700",
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
