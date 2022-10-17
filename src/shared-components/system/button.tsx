import React, { forwardRef, Fragment } from "react";
import NextLink from "next/link";
import { Url } from "url";
import clsx from "clsx";
import { Spinner } from "../util/spinner";

const sizes = {
  sm: "py-1 px-2 rounded-md",
  md: "py-2 px-4 rounded-md",
  lg: "py-3 px-6 rounded-md",
};

const variants = {
  primary: "bg-accent-primary hover:bg-opacity-80 text-background-secondary",
  secondary:
    "border-solid border-[0.0125rem] border-accent-stroke bg-accent-secondary text-white hover:bg-opacity-60",
  "outline-primary":
    "border-solid border-[0.0125rem] border-accent-primary hover:bg-accent-primary hover:text-background-primary",
  "outline-secondary":
    "border-solid border-[0.0125rem] border-accent-stroke hover:bg-accent-secondary hover:text-white",
  ghost: "",
  danger:
    "bg-accent-secondary text-accent-danger border-[0.0125rem] hover:bg-accent-danger hover:text-accent-secondary border-accent-danger",
  unstyled: "",
};

const variantHover = {
  primary: "hover:bg-opacity-80",
  secondary: "hover:bg-opacity-60",
  "outline-primary": "hover:bg-accent-primary hover:text-background-primary",
  "outline-secondary": "hover:bg-accent-secondary hover:text-white",
  ghost: "hover:bg-accent-secondary",
  danger: "hover:bg-opacity-90",
  unstyled: "",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size of the button.
   * @default "md"
   */
  size?: keyof typeof sizes;
  /**
   * Variant of the button.
   * @default "secondary"
   */
  variant?: keyof typeof variants;
  /**
   * The URL to link to, via `NextLink`
   */
  href?: Partial<Url> | string;
  /**
   * Left positioned Icon
   */
  icon?: JSX.Element;
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the button is loading
   * @default false
   */
  loading?: boolean;
}

const defaultProps = {
  size: "sm",
  variant: "secondary",
  disabled: false,
  loading: false,
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    // spread default props, since {} is truthy
    const { size, variant, href, icon, disabled, loading, className, ...rest } =
      {
        ...defaultProps,
        ...props,
      };

    // wrap the component in a NextLink if the href is provided
    const WrapperComponent = href ? NextLink : Fragment;

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <WrapperComponent {...(href ? { href } : ({} as any))}>
        <button
          ref={ref}
          className={clsx(
            `flex items-center justify-center truncate font-medium transition-colors`,
            sizes[size],
            variants[variant],
            !disabled && !loading && `${variantHover[variant]} active:scale-95`,
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          aria-disabled={disabled}
          role={href ? "link" : "button"}
          {...rest}
        >
          <span>
            {!loading && icon}
            {loading && <Spinner />}
          </span>
          <span
            className={clsx(
              (icon || loading) && rest.children && "ml-2",
              "text-center"
            )}
          >
            {props.children}
          </span>
        </button>
      </WrapperComponent>
    );
  }
);

Button.displayName = "Button";
