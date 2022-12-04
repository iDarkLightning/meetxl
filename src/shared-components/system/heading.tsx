import clsx from "clsx";
import { forwardRef } from "react";

const levels = {
  h1: "text-3xl font-medium",
  h2: "text-2xl font-medium",
  h3: "text-xl font-medium",
  h4: "text-lg font-medium",
  h5: "text-base font-medium",
  h6: "text-sm font-medium",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The heading level.
   * @default "h2"
   */
  level?: keyof typeof levels;
}

const defaultProps = {
  level: "h2",
} as const;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (p, ref) => {
    const props = { ...defaultProps, ...p };

    return (
      <props.level
        ref={ref}
        className={clsx(levels[props.level], props.className)}
      >
        {props.children}
      </props.level>
    );
  }
);

Heading.displayName = "Heading";
