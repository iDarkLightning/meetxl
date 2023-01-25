import clsx from "clsx";
import { forwardRef } from "react";

const variants = {
  filled:
    "w-full rounded-md px-2 py-4 h-10 bg-accent-secondary border-[0.0125rem] border-accent-stroke",
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof variants;
}

const defaultProps = {
  variant: "filled",
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>((p, ref) => {
  // spread default props, since {} is truthy
  const { className, variant, ...props } = {
    ...defaultProps,
    ...p,
  };

  return (
    <input
      ref={ref}
      className={clsx(variants[variant], className)}
      {...props}
    />
  );
});

Input.displayName = "Input";
