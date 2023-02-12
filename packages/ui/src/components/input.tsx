import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { Button } from "./button";
import { Trash } from "lucide-react";
import React from "react";

const getElementVariant = (
  leftElement: React.ReactNode,
  rightElement: React.ReactNode
) => {
  if (leftElement && rightElement) return "both" as const;
  if (leftElement) return "left" as const;
  if (rightElement) return "right" as const;
  return "none" as const;
};

const inputStyles = cva(
  cn(
    "bg-neutral z-10 border-neutral-stroke border-[0.025rem] rounded-md",
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-disco focus-visible:ring-opacity-40",
    "autofill:bg-neutral"
  ),
  {
    variants: {
      size: {
        sm: "py-1 px-3 placeholder:text-sm",
        md: "py-2 px-4",
      },
      element: {
        right: "rounded-r-none border-r-0 rounded-l-md",
        left: "rounded-l-none border-l-0 rounded-r-md",
        both: "rounded-none border-r-0 border-l-0",
        none: "",
      },
      isDisabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      isDisabled: false,
      element: "none",
    },
  }
);

const AdjacentElement: React.FC<
  React.PropsWithChildren<{ orientation: "right" | "left" }>
> = (props) => (
  <span
    className={cn(
      "flex items-center justify-center border-[0.025rem] border-neutral-stroke bg-neutral-900 px-3 text-neutral-400",
      props.orientation === "right" ? "rounded-r-md" : "rounded-l-md"
    )}
  >
    {props.children}
  </span>
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: VariantProps<typeof inputStyles>["size"];
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = (props) => {
  const { size, disabled, leftElement, rightElement, ...rest } = props;

  return (
    <div
      className={cn(
        "flex",
        props.disabled ? "cursor-not-allowed opacity-80" : ""
      )}
    >
      {leftElement && (
        <AdjacentElement orientation="left">{leftElement}</AdjacentElement>
      )}
      <input
        disabled={disabled}
        autoComplete="off"
        className={inputStyles({
          size: size,
          element: getElementVariant(leftElement, rightElement),
          isDisabled: disabled,
        })}
        {...rest}
      />
      {rightElement && (
        <AdjacentElement orientation="right">{rightElement}</AdjacentElement>
      )}
    </div>
  );
};
