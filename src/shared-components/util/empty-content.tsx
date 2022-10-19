import clsx from "clsx";
import React from "react";
import { Card } from "../system/card";
import { Heading } from "../system/heading";

export const EmptyContent: React.FC<
  React.PropsWithChildren<{ heading: string; sub: string; className?: string }>
> = (props) => {
  return (
    <Card
      className={clsx(
        "flex min-h-[15rem] flex-col items-center justify-center gap-4 border-dotted bg-opacity-0 hover:bg-opacity-0",
        props.className
      )}
    >
      <div className="text-center">
        <Heading level="h4">{props.heading}</Heading>
        <p className="text-sm opacity-75">{props.sub}</p>
      </div>
      {props.children}
    </Card>
  );
};
