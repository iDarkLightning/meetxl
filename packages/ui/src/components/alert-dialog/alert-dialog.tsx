import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import useWindowSize from "../../hooks/use-window-size";

import { cn } from "../../utils";
import { Button } from "../button";

type ContentForwarded = {
  ref: React.ElementRef<typeof AlertDialogPrimitive.Content>;
  props: React.ComponentPropsWithoutRef<typeof MotionDialogContent> & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export const AlertDialogWrapper = AlertDialogPrimitive.Root;
const MotionDialogContent = motion(AlertDialogPrimitive.Content);

export const AlertDialogPortal: React.FC<
  AlertDialogPrimitive.AlertDialogPortalProps
> = (props) => (
  <AlertDialogPrimitive.Portal className={cn(props.className)} {...props}>
    <div className="fixed inset-0 z-50 flex w-screen items-end justify-center sm:items-center">
      {props.children}
    </div>
  </AlertDialogPrimitive.Portal>
);
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

export const AlertDialogOverlay = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>((props, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const DialogContentMobile = forwardRef<
  ContentForwarded["ref"],
  ContentForwarded["props"]
>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
  useEffect(() => {
    controls.start({ y: 0, transition: transitionProps });
  }, []);

  const transitionProps = { type: "spring", stiffness: 500, damping: 30 };
  const { children, setIsOpen, ...rest } = props;

  const handleDragEnd = (info: PanInfo) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = innerRef.current?.getBoundingClientRect().height || 0;

    if (offset > height / 2 || velocity > 800) {
      controls
        .start({ y: "100%", transition: transitionProps })
        .then(() => setIsOpen(false));
    } else {
      controls.start({ y: 0, transition: transitionProps });
    }
  };

  return (
    <MotionDialogContent
      ref={innerRef}
      initial={{ y: "10%" }}
      animate={controls}
      exit={{ y: "100%" }}
      transition={transitionProps}
      drag="y"
      dragDirectionLock
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragEnd={((_: any, info: any) => handleDragEnd(info)) as any}
      dragElastic={{ top: 0, bottom: 1 }}
      dragConstraints={{ top: 0, bottom: 0 }}
      className="group fixed z-50 flex w-screen flex-col gap-6 rounded-md border-[0.025rem] border-neutral-stroke bg-background-primary p-8"
      {...rest}
    >
      <div className={`rounded-t-4xl flex w-full items-center justify-center`}>
        <div className="-mr-1 h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:rotate-12" />
        <div className="h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:-rotate-12" />
      </div>
      {children}
    </MotionDialogContent>
  );
});

const DialogContentDesktop = forwardRef<
  ContentForwarded["ref"],
  ContentForwarded["props"]
>((props, ref) => {
  const { setIsOpen: _, ...rest } = props;

  return (
    <MotionDialogContent
      ref={ref}
      initial={{ y: "-10%" }}
      animate={{ y: "0", transitionTimingFunction: "ease-in-out" }}
      className="fixed z-50 flex max-w-lg flex-col gap-6 rounded-md border-[0.025rem] border-neutral-stroke bg-background-primary p-8"
      {...rest}
    />
  );
});

export const AlertDialogContent = forwardRef<
  ContentForwarded["ref"],
  ContentForwarded["props"]
>((props, ref) => {
  const { isMobile } = useWindowSize();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      {isMobile ? (
        <DialogContentMobile ref={ref} {...props} />
      ) : (
        <DialogContentDesktop ref={ref} {...props} />
      )}
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => <div className="flex flex-col gap-2 text-center" {...props} />;
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>((props, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className="text-lg font-semibold text-neutral-100"
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>((props, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className="text-sm text-neutral-400"
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export const AlertDialogFooter: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => (
  <div className="flex w-full flex-col-reverse gap-2 sm:flex-row" {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogAction = forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  }
>((props, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild className="flex-1" {...props}>
    <span className="w-full">
      <Button variant="primary" size="md" fullWidth {...props.buttonProps}>
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
>((props, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild className="flex-1" {...props}>
    <span className="w-full">
      <Button variant="secondary" size="md" fullWidth {...props.buttonProps}>
        {props.children}
      </Button>
    </span>
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
