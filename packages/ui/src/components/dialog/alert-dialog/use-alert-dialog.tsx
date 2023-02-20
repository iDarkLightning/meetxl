import {} from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../../button";
import {
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogWrapper,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogFooter,
  DialogAction,
} from "../dialog";
import {
  AlertDialogWrapper,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogOverlay,
  AlertDialogPortal,
} from "./alert-dialog";

type AlertDialogContent = {
  header: React.ReactNode;
  description: React.ReactNode;
  actionText: string;
  cancelText?: string;
};

type AlertDialogInput = {
  content: AlertDialogContent;
  actionButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  cancelButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  onAction: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export const useAlertDialog = (input: AlertDialogInput) => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    ...input,
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export const AlertDialog: React.FC<{
  config: ReturnType<typeof useAlertDialog>;
}> = (props) => {
  return (
    <AlertDialogWrapper
      open={props.config.isOpen}
      onOpenChange={(open) => props.config.setIsOpen(open)}
    >
      <AnimatePresence>
        {props.config.isOpen ? (
          <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogContent setIsOpen={props.config.setIsOpen}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {props.config.content.header}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {props.config.content.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={props.config.onCancel}
                  buttonProps={props.config.cancelButtonProps}
                >
                  {props.config.content.cancelText ?? "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async (event) => {
                    event.preventDefault();

                    await props.config.onAction();
                    props.config.close();
                  }}
                  buttonProps={props.config.actionButtonProps}
                >
                  {props.config.content.actionText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogPortal>
        ) : null}
      </AnimatePresence>
    </AlertDialogWrapper>
  );
};
