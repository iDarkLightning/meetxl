import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const buttonHoverStyles = cva(
  cn(
    "relative m-[-1px] w-max transform-none select-none appearance-none overflow-hidden rounded-lg border-0 p-[1px] text-white will-change-transform",
    "hover:brightness-95 active:scale-95",
    "motion-safe:transition-[color_transform_200ms_cubic-bezier(0.4,0,0.2,1)]"
  ),
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        ghost: "",
        danger:
          "bg-[radial-gradient(200px_circle_at_var(--mouse-x)_var(--mouse-y),#ffa3a3,transparent_40%)]",
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "ghost", "secondary"],
        className:
          "bg-[radial-gradient(200px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(192,192,255,0.6),transparent_40%)]",
      },
    ],
    defaultVariants: {
      variant: "secondary",
    },
  }
);

const buttonContentStyles = cva(
  "relative z-10 inline-flex w-full justify-center rounded-md text-center font-medium transition-colors will-change-transform",
  {
    variants: {
      variant: {
        primary: "bg-accent-primary",
        secondary: "bg-accent-secondary",
        ghost: "bg-background-primary",
        danger: "",
      },
      isBusy: {
        true: "",
        false: "",
      },
      size: {
        sm: "py-2 px-3",
        md: "py-2 px-4",
        lg: "py-3 px-6",
      },
    },
    compoundVariants: [
      {
        isBusy: false,
        variant: "danger",
        className: "text-background-primary bg-accent-danger",
      },
      {
        isBusy: true,
        variant: "danger",
        className: "text-accent-danger bg-background-primary",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "sm",
      isBusy: false,
    },
  }
);

const buttonLoadingStyles = cva(
  cn(
    "absolute w-full before:absolute before:w-full", // disco, disco::before
    "inset-0 top-[50%] h-full translate-y-[-50%] scale-x-[calc(var(--button-aspect-ratio)_*_0.65)] will-change-transform", // disco,
    "before:left-0 before:top-[50%] before:aspect-[1/1] before:min-h-full before:origin-center before:opacity-100", // disco::before
    "motion-reduce:before:translate-y-[-50%] motion-reduce:before:rotate-0", // @media prefers reduced motion
    "motion-safe:before:animate-disco motion-safe:before:transition-[opacity_200ms_cubic-bezier(0.4,0,0.2,1)]" // @media no motion preference
  ),
  {
    variants: {
      variant: {
        primary:
          "before:bg-[conic-gradient(transparent_135deg,#428cee_180deg,transparent_225deg)]",
        secondary: "",
        ghost: "",
        danger:
          "before:bg-[conic-gradient(transparent_135deg,#f33f3f_180deg,transparent_225deg)]",
      },
      isBusy: {
        true: "motion-safe:before:running",
        false: "opacity-0 motion-safe:before:paused",
      },
    },
    compoundVariants: [
      {
        variant: ["secondary", "ghost"],
        className:
          "before:bg-[conic-gradient(transparent_135deg,#3f45c0_180deg,transparent_225deg)]",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      isBusy: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonContentStyles>["variant"];
  size?: VariantProps<typeof buttonContentStyles>["size"];
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const innerRef = useRef<HTMLButtonElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [mouseX, setMouseX] = useState<string | null>(null);
  const [mouseY, setMouseY] = useState<string | null>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);

  useEffect(() => {
    if (innerRef.current) {
      setAspectRatio(
        innerRef.current.clientWidth / innerRef.current.clientHeight
      );
    }
  }, []);

  useEffect(() => {
    if (props.isLoading) {
      setMouseX(null);
      setMouseY(null);
    }
  }, [props.isLoading]);

  return (
    <button
      style={{
        ["--button-aspect-ratio" as string]: aspectRatio,
        ["--mouse-x" as string]: mouseX,
        ["--mouse-y" as string]: mouseY,
      }}
      ref={innerRef}
      onMouseLeave={(...args) => {
        setMouseX(null);
        setMouseY(null);

        if (props.onMouseLeave) props.onMouseLeave(...args);
      }}
      onMouseMove={(e) => {
        if (props.isLoading) return;

        const rect = innerRef.current?.getBoundingClientRect();

        if (!rect?.left || !rect?.top) return;

        setMouseX(e.clientX - rect.left + "px");
        setMouseY(e.clientY - rect.top + "px");

        if (props.onMouseMove) props.onMouseMove(e);
      }}
      className={buttonHoverStyles({
        variant: props.variant,
      })}
      {...props}
    >
      <span
        className={buttonContentStyles({
          variant: props.variant,
          size: props.size,
          isBusy: props.isLoading,
        })}
      >
        <span aria-hidden {...(props.isLoading ? { role: "progressbar" } : {})}>
          {props.children}
        </span>
      </span>
      <span
        aria-hidden
        className={buttonLoadingStyles({
          variant: props.variant,
          isBusy: props.isLoading,
        })}
      />
    </button>
  );
});
