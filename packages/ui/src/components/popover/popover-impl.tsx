import * as PopoverPrimitive from "@radix-ui/react-popover";
import type * as Radix from "@radix-ui/react-primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { PanInfo, motion, useAnimation } from "framer-motion";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useWindowSize from "../../hooks/use-window-size";
import { useScrollBlock } from "../../utils/block-scroll";
import { DragHandle } from "../../utils/drag-handle";

export const PopoverWrapper = PopoverPrimitive.Root;

export const PopoverTrigger = PopoverPrimitive.Trigger;

type ContentForward = {
  ref: React.ElementRef<typeof PopoverPrimitive.Content>;
  props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

type PopoverOverlayImplElement = React.ElementRef<typeof Primitive.div>;
type PopoverOverlayImplProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.div
> & {
  isOpen: boolean;
};

const PopoverOverlayImpl = forwardRef<
  PopoverOverlayImplElement,
  PopoverOverlayImplProps
>((props, forwardedRef) => {
  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    if (props.isOpen) {
      blockScroll();
    } else {
      allowScroll();
    }

    return () => allowScroll();
  }, [props.isOpen]);

  if (props.isOpen) {
    return (
      <Primitive.div
        {...props}
        ref={forwardedRef}
        style={{
          pointerEvents: "auto",
          ...props.style,
        }}
      />
    );
  }

  return null;
});

export const PopoverOverlay = forwardRef<
  React.ElementRef<typeof PopoverOverlayImpl>,
  React.ComponentPropsWithoutRef<typeof PopoverOverlayImpl>
>((props, ref) => (
  <PopoverOverlayImpl
    ref={ref}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm "
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  </PopoverOverlayImpl>
));

const PopoverContentDesktop = forwardRef<
  ContentForward["ref"],
  ContentForward["props"]
>(({ setIsOpen: _, ...props }, ref) => {
  return (
    <PopoverPrimitive.Portal forceMount>
      <PopoverPrimitive.Content
        ref={ref}
        align={props.align ?? "center"}
        sideOffset={props.sideOffset ?? 5}
        asChild
        {...props}
      >
        <motion.div
          initial={{ y: "-5%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            transitionTimingFunction: "ease-out",
          }}
          exit={{ y: "-5%", opacity: 0, transitionTimingFunction: "ease-in" }}
          transition={{ duration: 0.15 }}
          className="group z-50 m-2 w-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-secondary p-4"
        >
          {props.children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

const PopoverContentMobile = forwardRef<
  ContentForward["ref"],
  ContentForward["props"]
>(({ align = "center", children, setIsOpen, ...props }, ref) => {
  const transitionProps = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    duration: 0.15,
  };

  const [exitY, setExitY] = useState("5%");
  const innerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

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
    <PopoverPrimitive.Portal forceMount>
      <PopoverPrimitive.Content ref={ref} align={align} asChild {...props}>
        <motion.div
          initial={{ y: "5%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: exitY, opacity: 0, transitionTimingFunction: "ease-in" }}
          transition={transitionProps}
          drag="y"
          dragDirectionLock
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDragEnd={((_: any, info: any) => handleDragEnd(info)) as any}
          dragElastic={{ top: 0, bottom: 1 }}
          dragConstraints={{ top: 0, bottom: 0 }}
          className="transform-[translate3d(0,500px,0)] group z-50 w-screen overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-secondary p-6"
        >
          <DragHandle />
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

export const PopoverContent = forwardRef<
  ContentForward["ref"],
  ContentForward["props"]
>((props, ref) => {
  const { isMobile } = useWindowSize();

  return isMobile ? (
    <PopoverContentMobile ref={ref} {...props} />
  ) : (
    <PopoverContentDesktop ref={ref} {...props} />
  );
});

export const PopoverAnchor = PopoverPrimitive.Anchor;
