import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

const avatarStyles = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const avatarFallbackStyles = cva(
  "flex h-full w-full items-center justify-center rounded-full border-[0.025rem] border-neutral-stroke bg-neutral-secondary text-md",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-base",
        lg: "text-base",
      },
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src: string;
  name: string;
  size?: VariantProps<typeof avatarStyles>["size"];
  imageProps?: Omit<AvatarPrimitive.AvatarImageProps, "className" | "src">;
  fallbackProps?: Omit<
    AvatarPrimitive.AvatarFallbackProps,
    "className" | "children"
  >;
}

export const Avatar: React.FC<AvatarProps> = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ size, src, imageProps, fallbackProps, name, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={avatarStyles({ size: size })}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        className="aspect-square h-full w-full"
        {...imageProps}
      />
      <AvatarPrimitive.Fallback
        className={avatarFallbackStyles({ size: size })}
        {...fallbackProps}
      >
        {name}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});
