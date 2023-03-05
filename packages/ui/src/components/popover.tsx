import * as PopoverPrimitive from "@radix-ui/react-popover";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo, useAnimation } from "framer-motion";
import { Avatar } from "./avatar";
import useWindowSize from "../hooks/use-window-size";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const MobileContentChild: React.FC<
  React.ComponentPropsWithoutRef<"div"> & {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = (props) => {
  const transitionProps = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    duration: 0.15,
  };

  const [exitY, setExitY] = useState("5%");
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    console.log("are you even being called when that happens?");
    controls.start({ y: "0", opacity: 1, transition: transitionProps });
  }, [props.isOpen]);

  const { children, setIsOpen, ...rest } = props;

  const handleDragEnd = (info: PanInfo) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = ref.current?.getBoundingClientRect().height || 0;

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
    <motion.div
      ref={ref}
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
    >
      <div className={`rounded-t-4xl flex w-full items-center justify-center`}>
        <div className="-mr-1 h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:rotate-12" />
        <div className="h-1 w-6 rounded-full bg-neutral-500 transition-all group-active:-rotate-12" />
      </div>
      {children}
    </motion.div>
  );
};

const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(
  (
    { align = "center", sideOffset = 4, children, isOpen, setIsOpen, ...props },
    ref
  ) => {
    const { isMobile } = useWindowSize();

    return (
      <PopoverPrimitive.Portal
        forceMount
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center"
      >
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={+!isMobile * sideOffset}
          asChild
          className="z-50 w-screen overflow-hidden rounded-md border-[0.025rem] border-neutral-stroke bg-background-secondary p-2 py-2 sm:w-max"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0, y: "5%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "5%" }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);

export const PopoverTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <PopoverTrigger>
          <Avatar src="https://i.pravatar.cc/300" name="NN" size="lg" />
        </PopoverTrigger>
        {isMobile && (
          <PopoverPrimitive.Anchor className="absolute bottom-0 left-0 right-0" />
        )}
        <AnimatePresence>
          {isOpen && (
            <PopoverContent isOpen={isOpen} setIsOpen={setIsOpen}>
              Content
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </>
  );
};
