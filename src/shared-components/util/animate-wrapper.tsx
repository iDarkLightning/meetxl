import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

export const AnimateWrapper: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = (props) => {
  const [parent] = useAutoAnimate<HTMLDivElement>({
    duration: 150,
  });

  return (
    <div ref={parent} {...props}>
      {props.children}
    </div>
  );
};
