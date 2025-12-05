// src/components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

type Variant = "default" | "primary" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/80 shadow",
  outline: "border border-border bg-transparent text-foreground hover:bg-accent",
  ghost: "bg-transparent text-foreground hover:bg-accent",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
