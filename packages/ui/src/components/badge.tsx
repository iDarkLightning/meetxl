import { VariantProps, cva } from "class-variance-authority";
import React, { forwardRef } from "react";

const badgeVariants = cva(
  "py-0.5 px-4 w-min rounded-2xl font-medium inline-flex items-center",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        secondary: "bg-neutral border-[0.025rem] border-neutral-stroke",
        outline: "bg-transparent border-[0.025rem] border-neutral-stroke",
        danger: "bg-red-500",
        custom: "bg-[var(--badge-custom-color)]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export type BadgeProps<
  TVariant = VariantProps<typeof badgeVariants>["variant"]
> = TVariant extends "custom"
  ? {
      variant?: TVariant;
      color: string;
    } & React.HTMLAttributes<HTMLDivElement>
  : { variant?: TVariant } & React.HTMLAttributes<HTMLDivElement>;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ["--badge-custom-color" as string]:
            variant === "custom" ? props.color : undefined,
        }}
      >
        <span className={badgeVariants({ variant: variant })}>
          {props.children}
        </span>
      </div>
    );
  }
);

export type TagProps = BadgeProps;
export const Tag = Badge;
