import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const VARIANT_OPTIONS = {
  primary: "",
  secondary: "",
  ghost: "",
  danger: "",
} as const;

const BOOLEAN_OPTIONS = {
  true: "",
  false: "",
};

const buttonHoverStyles = cva(
  cn(
    "min-w-min relative m-[-1px] w-max transform-none select-none appearance-none overflow-hidden rounded-lg border-0 p-[1px] text-white will-change-transform h-max",
    "motion-safe:transition-[color_transform_200ms_cubic-bezier(0.4,0,0.2,1)]"
  ),
  {
    variants: {
      variant: VARIANT_OPTIONS,
      isDisabled: BOOLEAN_OPTIONS,
      isBusy: BOOLEAN_OPTIONS,
    },
    compoundVariants: [
      {
        isBusy: true,
        variant: ["primary", "ghost", "secondary", "danger"],
        className: "hover:cursor-wait",
      },
      {
        isDisabled: true,
        variant: ["primary", "ghost", "secondary", "danger"],
        className: "opacity-80 hover:cursor-not-allowed",
      },
      {
        isDisabled: false,
        variant: ["primary", "ghost", "secondary"],
        className:
          "bg-[radial-gradient(100px_circle_at_var(--mouse-x)_var(--mouse-y),var(--color-neutral-disco),transparent_40%)]",
      },
      {
        isDisabled: false,
        variant: "danger",
        className:
          "bg-[radial-gradient(200px_circle_at_var(--mouse-x)_var(--mouse-y),var(--color-danger),transparent_40%)]",
      },
      {
        isDisabled: false,
        isBusy: false,
        className: "hover:brightness-95 active:scale-95",
      },
    ],
    defaultVariants: {
      variant: "secondary",
    },
  }
);

const buttonContentStyles = cva(
  "whitespace-nowrap relative z-10 inline-flex w-full justify-center rounded-md text-center font-medium transition-all will-change-transform border-[0.025rem]",
  {
    variants: {
      variant: {
        primary: "bg-primary border-transparent",
        secondary: "bg-neutral",
        ghost: "bg-background-primary border-transparent",
        danger: "text-danger bg-background-primary",
      },
      isBusy: BOOLEAN_OPTIONS,
      isDisabled: BOOLEAN_OPTIONS,
      size: {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4",
        lg: "py-3 px-6 text-lg",
      },
    },
    compoundVariants: [
      {
        isBusy: true,
        variant: ["danger", "secondary"],
        className: "border-transparent",
      },
      {
        isDisabled: false,
        variant: ["danger", "secondary"],
        className: "hover:border-transparent",
      },
      {
        isBusy: false,
        variant: "danger",
        className: "border-danger",
      },
      {
        isBusy: false,
        variant: "secondary",
        className: "border-neutral-stroke",
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
    "inset-0 top-1/2 h-full translate-y-[-50%] scale-x-[calc(var(--button-aspect-ratio)_*_0.65)] will-change-transform", // disco,
    "before:left-0 before:top-1/2 before:aspect-square before:min-h-full before:origin-center before:opacity-100", // disco::before
    "motion-reduce:before:translate-y-[-50%] motion-reduce:before:rotate-0", // @media prefers reduced motion
    "motion-safe:before:animate-disco motion-safe:before:transition-[opacity_200ms_cubic-bezier(0.4,0,0.2,1)]" // @media no motion preference
  ),
  {
    variants: {
      variant: {
        ...VARIANT_OPTIONS,
        danger:
          "before:bg-[conic-gradient(transparent_135deg,var(--color-danger)_180deg,transparent_225deg)]",
      },
      isBusy: {
        true: "motion-safe:before:running",
        false: "opacity-0 motion-safe:before:paused",
      },
    },
    compoundVariants: [
      {
        variant: ["secondary", "ghost", "primary"],
        className:
          "before:bg-[conic-gradient(transparent_135deg,var(--color-neutral-disco)_180deg,transparent_225deg)]",
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
  prefixEl?: React.ReactNode;
  suffixEl?: React.ReactNode;
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

  const { variant, size, isLoading, prefixEl, suffixEl, ...rest } = props;

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
        variant: variant,
        isBusy: props.isLoading,
        isDisabled: !!props.disabled,
      })}
      disabled={props.isLoading ?? rest.disabled}
      {...rest}
    >
      <span
        className={buttonContentStyles({
          variant: variant,
          size: size,
          isBusy: isLoading,
          isDisabled: !!props.disabled,
        })}
      >
        <span
          aria-hidden
          {...(props.isLoading ? { role: "progressbar" } : {})}
          className="flex max-w-max items-center gap-2"
        >
          {prefixEl}
          {props.children}
          {suffixEl}
        </span>
      </span>
      <span
        aria-hidden
        className={buttonLoadingStyles({
          variant: variant,
          isBusy: isLoading,
        })}
      />
    </button>
  );
});
