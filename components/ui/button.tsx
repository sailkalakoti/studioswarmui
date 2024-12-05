import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Spinner } from '@radix-ui/themes';
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#002856] to-[#1a4c8b] text-white hover:from-[#002856]/90 hover:to-[#1a4c8b]/90 shadow-sm",
        primary: "bg-gradient-to-r from-[#002856] to-[#1a4c8b] text-white hover:from-[#002856]/90 hover:to-[#1a4c8b]/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-[#002856]/10 text-[#002856] hover:bg-[#002856]/20",
        ghost: "hover:bg-[#002856]/10 hover:text-[#002856]",
        link: "text-[#002856] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size, asChild = false, loading = false, onClick, loadingText = "", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={loading ? null : onClick}
        {...props}
      >
        {loading ? <><Spinner loading />{loadingText}</> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
