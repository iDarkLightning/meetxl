import clsx from "clsx";
import React from "react";

export const SectionWrapper: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = (props) => (
  <section className={clsx("flex flex-col gap-6", props.className)}>
    {props.children}
  </section>
);
