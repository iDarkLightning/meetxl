import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import useWindowSize from "../../hooks/use-window-size";
import {
  PopoverAnchor,
  PopoverContent,
  PopoverOverlay,
  PopoverTrigger,
  PopoverWrapper,
} from "./popover-impl";

type PopoverInput = {
  trigger: React.ReactNode;
};

export const usePopover = (input: PopoverInput) => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    ...input,
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export const Popover: React.FC<
  React.PropsWithChildren<{
    config: ReturnType<typeof usePopover>;
  }>
> = (props) => {
  const { isMobile } = useWindowSize();

  return (
    <>
      <PopoverWrapper
        open={props.config.isOpen}
        onOpenChange={props.config.setIsOpen}
      >
        <PopoverTrigger>{props.config.trigger}</PopoverTrigger>
        {isMobile && (
          <PopoverAnchor className="fixed left-0 right-0 bottom-0" />
        )}
        <AnimatePresence>
          {props.config.isOpen && (
            <>
              <PopoverContent setIsOpen={props.config.setIsOpen}>
                {props.children}
              </PopoverContent>
              {isMobile && <PopoverOverlay isOpen={props.config.isOpen} />}
            </>
          )}
        </AnimatePresence>
      </PopoverWrapper>
    </>
  );
};
