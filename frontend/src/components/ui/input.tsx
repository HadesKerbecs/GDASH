// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
export default Input;
