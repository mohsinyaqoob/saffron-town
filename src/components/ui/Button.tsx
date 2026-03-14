import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-95 font-body cursor-pointer",
          {
            "bg-primary text-white hover:bg-primary/90": variant === "primary",
            "bg-background-alt text-primary hover:bg-surface-muted": variant === "secondary",
            "border border-secondary-border text-secondary hover:bg-surface-muted": variant === "outline",
          },
          {
            "px-6 py-2.5 text-sm rounded-lg": size === "sm",
            "px-8 py-3.5 text-base rounded-xl": size === "md",
            "px-10 py-4.5 text-lg rounded-2xl": size === "lg",
            "px-12 py-5.5 text-xl rounded-full": size === "xl",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
