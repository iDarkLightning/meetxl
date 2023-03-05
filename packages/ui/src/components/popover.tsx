import * as PopoverPrimitive from "@radix-ui/react-popover";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, PanInfo, useAnimation } from "framer-motion";
import { Avatar } from "./avatar";
import useWindowSize from "../hooks/use-window-size";
import { DragHandle } from "../utils/drag-handle";
import { Slot } from "@radix-ui/react-slot";
import { Primitive } from "@radix-ui/react-primitive";
import { RemoveScroll } from "react-remove-scroll";
import type * as Radix from "@radix-ui/react-primitive";

export const Popover = PopoverPrimitive.Root;

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
  if (props.isOpen) {
    return (
      <RemoveScroll as={Slot} allowPinchZoom>
        <Primitive.div
          {...props}
          ref={forwardedRef}
          style={{
            pointerEvents: "auto",
            ...props.style,
          }}
        />
      </RemoveScroll>
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
          className="group z-50 m-2 w-max overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-secondary p-6"
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
          className="group z-50 w-screen overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-secondary p-6"
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

export const PopoverTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useWindowSize();

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <Avatar src="https://i.pravatar.cc/300" name="NN" size="lg" />
        </PopoverTrigger>
        {isMobile && (
          <PopoverPrimitive.Anchor className="absolute bottom-0 left-0 right-0" />
        )}
        <AnimatePresence>
          {isOpen && (
            <>
              <PopoverContent setIsOpen={setIsOpen}>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-medium">Nirjhor Nath</h1>
                  <p className="max-w-md text-neutral-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Debitis harum, earum laboriosam accusamus vitae distinctio
                    officia alias, corrupti aperiam necessitatibus quisquam
                    repellat quo ipsam est reiciendis maxime inventore rerum!
                    Optio?
                  </p>
                </div>
              </PopoverContent>
              {isMobile && <PopoverOverlay isOpen={isOpen} />}
            </>
          )}
        </AnimatePresence>
      </Popover>
    </>
  );
};
