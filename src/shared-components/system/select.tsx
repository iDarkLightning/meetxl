import clsx from "clsx";
import { forwardRef } from "react";

const variants = {
  filled:
    "rounded-md pl-2 pr-4 py-2 bg-accent-secondary border-[0.0125rem] border-accent-stroke",
};

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: string[];
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
    <select ref={ref} className={clsx(variants[variant], className)} {...props}>
      {props.options.map((opt, idx) => (
        <option value={opt} key={idx}>
          {opt}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";
