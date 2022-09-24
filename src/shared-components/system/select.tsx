import clsx from "clsx";
import { forwardRef } from "react";

const variants = {
  filled: "rounded-md pl-2 pr-4 py-2",
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: keyof typeof variants;
}

const defaultProps = {
  variant: "filled",
} as const;

export const Select = forwardRef<HTMLSelectElement, SelectProps>((p, ref) => {
  // spread default props, since {} is truthy
  const { className, variant, ...props } = {
    ...defaultProps,
    ...p,
  };

  return (
    <select
      ref={ref}
      className={clsx(variants[variant], className)}
      {...props}
    />
  );
});

Select.displayName = "Select";
