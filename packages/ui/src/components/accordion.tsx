"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "../utils";

export const AccordionWrapper = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between rounded-md border-[0.025rem] border-neutral-stroke bg-neutral from-neutral-secondary to-neutral p-3 font-medium hover:bg-gradient-to-br hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-sm",
      className
    )}
    {...props}
  >
    <div className="p-3">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

type AccordionItemProps = {
  header: string;
  content: string;
  triggerProps?: React.ComponentPropsWithoutRef<typeof AccordionTrigger>;
  contentProps?: React.ComponentPropsWithoutRef<typeof AccordionContent>;
} & React.ComponentPropsWithoutRef<typeof AccordionItem>;

type AccordionProps = {
  items: AccordionItemProps[];
} & React.ComponentPropsWithoutRef<typeof AccordionWrapper>;

export const Accordion: React.FC<AccordionProps> = (props) => {
  const { items } = props;

  return (
    <AccordionWrapper type="single" collapsible>
      {items.map(
        ({ header, content, triggerProps, contentProps, ...itemProps }) => (
          <AccordionItem key={itemProps.value} {...itemProps}>
            <AccordionTrigger {...triggerProps}>{header}</AccordionTrigger>
            <AccordionContent {...contentProps}>{content}</AccordionContent>
          </AccordionItem>
        )
      )}
    </AccordionWrapper>
  );
};
