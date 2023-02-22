import { Root as LabelRoot } from "@radix-ui/react-label";
import React, { forwardRef } from "react";

export const Label = forwardRef<
  React.ElementRef<typeof LabelRoot>,
  React.ComponentPropsWithoutRef<typeof LabelRoot>
>((props, ref) => (
  <LabelRoot
    className="text-sm font-medium leading-none text-neutral-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-80"
    {...props}
    ref={ref}
  />
));
