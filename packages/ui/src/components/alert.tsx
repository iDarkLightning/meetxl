import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { Info, Check, AlertTriangle, Siren } from "lucide-react";
import { cn } from "../utils";

const icons = {
  info: <Info className="h-4 w-4" />,
  success: <Check className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  destructive: <Siren className="h-4 w-4" />,
} as const;

const alertVariants = cva(
  "relative w-full border-[0.025rem] rounded-lg p-3 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        info: "bg-neutral border-neutral-stroke",
        success: "bg-emerald-400 border-emerald-900 text-emerald-900",
        warning: "bg-amber-400 border-amber-900 text-amber-900",
        destructive: "bg-rose-300 border-red-900 text-red-900",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: NonNullable<VariantProps<typeof alertVariants>["variant"]>;
  }
>(({ className, variant = "info", children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    {icons[variant]}
    {children}
  </div>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
