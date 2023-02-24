import * as SelectPrimitive from "./select-primitive";
import React, { forwardRef, useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../utils";
import useWindowSize from "../hooks/use-window-size";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Portal as PortalPrimitive } from "@radix-ui/react-portal";
import type { Scope } from "@radix-ui/react-context";
import { DialogPortal } from "@radix-ui/react-dialog";
import { DialogContent, DialogOverlay, DialogWrapper } from "./dialog/dialog";

const MotionSelectContent = motion(SelectPrimitive.Content);
const MotionViewport = motion(SelectPrimitive.Viewport);
const MotionPortal = motion(SelectPrimitive.Portal);

export const Select = SelectPrimitive.Root;

export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = SelectPrimitive.Value;

export const SelectPortal = SelectPrimitive.Portal;

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
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ className, children, isOpen, setIsOpen, ...props }, ref) => {
  return (
    <SelectPortal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 mt-1 h-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral shadow-md",
          className
        )}
        position="popper"
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
          <SelectPrimitive.Viewport className="">
            {children}
          </SelectPrimitive.Viewport>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPortal>
  );
});

export const SelectDesktop = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPortal forceMount>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 mt-1 h-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-neutral shadow-md",
          className
        )}
        position="popper"
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
          <SelectPrimitive.Viewport className="p-1">
            {children}
          </SelectPrimitive.Viewport>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPortal>
  );
});

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
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
      "relative flex cursor-default select-none items-center rounded-md py-1.5 px-8 text-sm font-medium outline-none hover:bg-neutral-700 data-[highlighted]:bg-neutral-700",
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

export const SelectTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <Select
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      value={value}
      onValueChange={(value) => setValue(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Theme">{value}</SelectValue>
      </SelectTrigger>
      <AnimatePresence>
        {isOpen && (
          <SelectContent isOpen={isOpen} setIsOpen={setIsOpen}>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        )}
      </AnimatePresence>
    </Select>
  );
};
