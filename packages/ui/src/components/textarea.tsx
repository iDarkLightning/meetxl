import * as React from "react";

import { cn } from "../utils";
import { VariantProps, cva } from "class-variance-authority";

const textareaVariants = cva(
  cn(
    "z-10 border-neutral-stroke border-[0.025rem] rounded-md text-neutral-300 placeholder:text-neutral-300 p-2",
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40",
    "autofill:bg-neutral"
  ),
  {
    variants: {
      variant: {
        default: "bg-neutral",
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
