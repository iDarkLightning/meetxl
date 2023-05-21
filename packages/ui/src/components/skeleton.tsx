import React, { HTMLAttributes } from "react";
import { cn } from "../utils";

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className="relative w-max overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-neutral-100/10 before:to-transparent">
      <div
        className={cn("rounded-md bg-neutral-secondary", className)}
        {...props}
      />
    </div>
  );
};
