import React from "react";
import { Toaster as ToasterPrimitive } from "sonner";

export const Toaster: React.FC<
  React.ComponentProps<typeof ToasterPrimitive>
> = (props) => {
  return (
    <ToasterPrimitive
      {...props}
      theme="dark"
      toastOptions={{
        className: "!bg-neutral !border-[0.025rem] !border-neutral-stroke",
      }}
    />
  );
};

export { toast } from "sonner";
