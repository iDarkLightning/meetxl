import React from "react";

export const SectionWrapper: React.FC<React.PropsWithChildren> = (props) => (
  <section className="flex flex-col gap-6">{props.children}</section>
);
