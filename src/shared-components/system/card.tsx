import clsx from "clsx";
import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary p-4 transition-colors hover:bg-opacity-80",
        props.className
      )}
    >
      {props.children}
    </div>
  );
});

Card.displayName = "Card";
