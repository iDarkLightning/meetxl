import clsx from "clsx";
import { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

const sizes = {};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  sizes?: keyof typeof sizes;
  imageProps?: AvatarPrimitive.AvatarImageProps &
    React.ImgHTMLAttributes<HTMLImageElement>;
  fallbackProps?: AvatarPrimitive.AvatarFallbackProps &
    React.HTMLAttributes<HTMLSpanElement>;
}

const defaultProps = {
  sizes: "md",
} as const;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((p, ref) => {
  // spread default props, since {} is truthy
  const props = {
    ...defaultProps,
    ...p,
  };

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clsx(
        "inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle",
        props.className
      )}
    >
      <AvatarPrimitive.Image
        {...props.imageProps}
        className={clsx(
          "h-full w-full rounded-[inherit] object-cover",
          props.imageProps?.className
        )}
      />
      <AvatarPrimitive.Fallback
        {...props.fallbackProps}
        className={clsx(
          "flex h-full w-full items-center justify-center bg-purple-800 text-sm font-bold",
          props.fallbackProps?.className
        )}
      />
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = "Avatar";
