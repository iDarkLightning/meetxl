import {} from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../button";
import {
  DialogAction,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogWrapper,
} from "./dialog";

type DialogContent = {
  header: React.ReactNode;
  description: React.ReactNode;
  cancelText?: string;
};

type DialogInput = {
  content: DialogContent;
  cancelButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  actionElement: React.ReactNode;
  onCancel?: () => void | Promise<void>;
};

export const useDialog = (input: DialogInput) => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    ...input,
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export const Dialog: React.FC<
  React.PropsWithChildren<{
    config: ReturnType<typeof useDialog>;
  }>
> = (props) => {
  return (
    <DialogWrapper
      open={props.config.isOpen}
      onOpenChange={(open) => props.config.setIsOpen(open)}
    >
      <AnimatePresence>
        {props.config.isOpen ? (
          <DialogPortal>
            <DialogOverlay />
            <DialogContent setIsOpen={props.config.setIsOpen}>
              <DialogHeader>
                <DialogTitle>{props.config.content.header}</DialogTitle>
                <DialogDescription>
                  {props.config.content.description}
                </DialogDescription>
              </DialogHeader>
              {props.children}
              <DialogFooter>
                <DialogAction
                  onClick={async () => {
                    await props.config.onCancel?.();
                    props.config.close();
                  }}
                  {...props.config.cancelButtonProps}
                >
                  {props.config.content.cancelText ?? "Cancel"}
                </DialogAction>
                {props.config.actionElement}
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        ) : null}
      </AnimatePresence>
    </DialogWrapper>
  );
};
