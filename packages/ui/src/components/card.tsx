import { VariantProps, cva } from "class-variance-authority";
import React from "react";

import Link, { LinkProps } from "next/link";

const cardStyles = cva("p-4", {
  variants: {
    variant: {
      solid: "bg-neutral rounded-md border-[0.025rem] border-neutral-stroke",
      outline: "rounded-md border-[0.025rem] border-neutral-stroke",
    },
    isClicable: {
      true: "hover:bg-gradient-to-br from-neutral-secondary to-neutral cursor-pointer transition-colors !duration-700",
      false: "",
    },
  },
});

type BaseCardProps = {
  variant?: VariantProps<typeof cardStyles>["variant"];
  children: React.ReactNode | undefined;
};

export type CardProps<TCliclable = boolean> = TCliclable extends false
  ? {
      isClickable?: TCliclable;
    } & BaseCardProps
  : {
      isClickable?: TCliclable;
    } & BaseCardProps &
      LinkProps;

export const Card: React.FC<CardProps> = (props) => {
  if (props.isClickable) {
    return (
      <Link
        className={cardStyles({
          variant: props.variant,
          isClicable: props.isClickable,
        })}
        {...props}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <div
      className={cardStyles({
        variant: props.variant,
        isClicable: props.isClickable,
      })}
    >
      {props.children}
    </div>
  );
};
