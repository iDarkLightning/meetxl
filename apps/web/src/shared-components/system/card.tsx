import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        "rounded-md border-[0.025rem] border-accent-stroke bg-background-secondary p-4 transition-colors",
        props.className
      )}
    >
      {props.children}
    </div>
  );
});

Card.displayName = "Card";
