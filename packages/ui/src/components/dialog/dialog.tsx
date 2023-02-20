import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { Button } from "../button";

import {
  createDialogContent,
  createDialogDescription,
  createDialogOverlay,
  createDialogPortal,
  createDialogTitle,
  SharedDialogFooter,
  SharedDialogHeader,
} from "./dialog-factory";

export const DialogWrapper = DialogPrimitive.Root;
DialogWrapper.displayName = DialogPrimitive.Root.displayName;

export const DialogPortal = createDialogPortal(DialogPrimitive.Portal);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

export const DialogOverlay = createDialogOverlay(DialogPrimitive.Overlay);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = createDialogContent(DialogPrimitive.Content);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = SharedDialogHeader;
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = createDialogTitle(DialogPrimitive.Title);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = createDialogDescription(
  DialogPrimitive.Description
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const DialogFooter = SharedDialogFooter;
DialogFooter.displayName = "DialogFooter";

export const DialogAction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => (
  <Button variant="primary" size="md" fullWidth ref={ref} {...props}>
    {props.children}
  </Button>
));
