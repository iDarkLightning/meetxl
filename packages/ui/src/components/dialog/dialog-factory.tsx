import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  CustomDomComponent,
  motion,
  PanInfo,
  useAnimation,
} from "framer-motion";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useWindowSize from "../../hooks/use-window-size";
import { cn } from "../../utils";
import { Button } from "../button";

type ContentForwarded<
  T extends CustomDomComponent<
    DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>
  >
> = {
  ref: React.ElementRef<typeof DialogPrimitive.Content>;
  props: React.ComponentPropsWithoutRef<T> & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export const createDialogPortal = (
  Primitive: typeof DialogPrimitive.Portal
): React.FC<DialogPrimitive.DialogPortalProps> => {
  return (props) => (
    <Primitive className={cn(props.className)} {...props} forceMount>
      <div className="fixed inset-0 z-50 flex w-screen items-end justify-center sm:items-center">
        {props.children}
      </div>
    </Primitive>
  );
};

export const createDialogOverlay = (
  Primitive: typeof DialogPrimitive.Overlay
) => {
  const MotionDialogOverlay = motion(Primitive);

  return forwardRef<
    React.ElementRef<typeof Primitive>,
    React.ComponentPropsWithoutRef<typeof MotionDialogOverlay>
  >((props, ref) => (
    <MotionDialogOverlay
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
      {...props}
    />
  ));
};

export const createDialogContent = (
  Primitive: typeof DialogPrimitive.Content
) => {
  const MotionPrimitive = motion(Primitive);

  const DialogContentMobile = forwardRef<
    ContentForwarded<typeof MotionPrimitive>["ref"],
    ContentForwarded<typeof MotionPrimitive>["props"]
  >((props, ref) => {
    const [exitY, setExitY] = useState("5%");
    const innerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
    useEffect(() => {
      controls.start({ y: "0", opacity: 1, transition: transitionProps });
    }, []);

    const transitionProps = {
      type: "spring",
      stiffness: 500,
      damping: 30,
      duration: 0.15,
    };
    const { children, setIsOpen, ...rest } = props;

    const handleDragEnd = (info: PanInfo) => {
      const offset = info.offset.y;
      const velocity = info.velocity.y;
      const height = innerRef.current?.getBoundingClientRect().height || 0;

      if (offset > height / 2 || velocity > 800) {
        controls
          .start({ y: "100%", opacity: 0, transition: transitionProps })
          .then(() => {
            setExitY("100%");
            setIsOpen(false);
          });
      } else {
        controls.start({ y: 0, transition: transitionProps });
      }
    };

    return (
      <MotionPrimitive
        ref={innerRef}
        initial={{ y: "5%", opacity: 0 }}
        animate={controls}
        exit={{ y: exitY, opacity: 0, transitionTimingFunction: "ease-in" }}
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
        <div
          className={`rounded-t-4xl flex w-full items-center justify-center`}
        >
          <div className="-mr-1 h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:rotate-12" />
          <div className="h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:-rotate-12" />
        </div>
        {children}
      </MotionPrimitive>
    );
  });

  const DialogContentDesktop = forwardRef<
    ContentForwarded<typeof MotionPrimitive>["ref"],
    ContentForwarded<typeof MotionPrimitive>["props"]
  >((props, ref) => {
    const { setIsOpen: _, ...rest } = props;

    return (
      <MotionPrimitive
        ref={ref}
        initial={{ y: "-5%", opacity: 0 }}
        animate={{ y: "0", opacity: 1, transitionTimingFunction: "ease-out" }}
        exit={{
          y: "-5%",
          opacity: 0,
          transitionTimingFunction: "ease-in",
        }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 flex max-w-lg flex-col gap-6 rounded-md border-[0.025rem] border-neutral-stroke bg-background-primary p-8"
        {...rest}
      />
    );
  });

  return forwardRef<
    ContentForwarded<typeof MotionPrimitive>["ref"],
    ContentForwarded<typeof MotionPrimitive>["props"]
  >((props, ref) => {
    const { isMobile } = useWindowSize();

    if (isMobile) return <DialogContentMobile {...props} ref={ref} />;
    return <DialogContentDesktop {...props} ref={ref} />;
  });
};

export const SharedDialogHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => <div className="flex flex-col gap-2 text-center" {...props} />;

export const createDialogTitle = (Primitive: typeof DialogPrimitive.Title) => {
  return forwardRef<
    React.ElementRef<typeof Primitive>,
    React.ComponentPropsWithoutRef<typeof Primitive>
  >((props, ref) => (
    <Primitive
      ref={ref}
      className="text-lg font-semibold text-neutral-100"
      {...props}
    />
  ));
};

export const createDialogDescription = (
  Primitive: typeof DialogPrimitive.Description
) => {
  return forwardRef<
    React.ElementRef<typeof Primitive>,
    React.ComponentPropsWithoutRef<typeof Primitive>
  >((props, ref) => (
    <Primitive ref={ref} className="text-sm text-neutral-400" {...props} />
  ));
};

export const SharedDialogFooter: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => (
  <div className="flex w-full flex-col-reverse gap-2 sm:flex-row" {...props} />
);
