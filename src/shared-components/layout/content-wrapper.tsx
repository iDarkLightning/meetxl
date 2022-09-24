import clsx from "clsx";
import React from "react";

export const ContentWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "max-w-[100rem] py-6 px-4 md:mx-auto md:w-[80%] lg:w-[85%] 2xl:w-[90%]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
