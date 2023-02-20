import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { forwardRef } from "react";

import { Button } from "../../button";
import {
  createDialogContent,
  createDialogDescription,
  createDialogOverlay,
  createDialogPortal,
  createDialogTitle,
  SharedDialogFooter,
  SharedDialogHeader,
} from "../dialog-factory";

export const AlertDialogWrapper = AlertDialogPrimitive.Root;
AlertDialogWrapper.displayName = AlertDialogPrimitive.Root.displayName;

export const AlertDialogPortal = createDialogPortal(
  AlertDialogPrimitive.Portal
);
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

export const AlertDialogOverlay = createDialogOverlay(
  AlertDialogPrimitive.Overlay
);
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export const AlertDialogContent = createDialogContent(
  AlertDialogPrimitive.Content
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader = SharedDialogHeader;
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = createDialogTitle(AlertDialogPrimitive.Title);
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = createDialogDescription(
  AlertDialogPrimitive.Description
);
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export const AlertDialogFooter = SharedDialogFooter;
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogAction = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  }
>(({ buttonProps, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild className="flex-1" {...props}>
    <span className="w-full">
      <Button variant="primary" size="md" fullWidth {...buttonProps}>
        {props.children}
      </Button>
    </span>
  </AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export const AlertDialogCancel = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
    buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  }
>(({ buttonProps, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild className="flex-1" {...props}>
    <span className="w-full">
      <Button variant="secondary" size="md" fullWidth {...buttonProps}>
        {props.children}
      </Button>
    </span>
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
