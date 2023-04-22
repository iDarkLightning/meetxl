import React from "react";
import { Toaster as ToasterPrimitive } from "sonner";
import useWindowSize from "../hooks/use-window-size";

export const Toaster: React.FC<
  React.ComponentProps<typeof ToasterPrimitive>
> = (props) => {
  const { isMobile } = useWindowSize();

  return (
    <ToasterPrimitive
      {...props}
      position={isMobile ? "bottom-center" : "bottom-right"}
      theme="dark"
      toastOptions={{
        className: "!bg-neutral !border-[0.025rem] !border-neutral-stroke",
      }}
    />
  );
};

export { toast } from "sonner";
