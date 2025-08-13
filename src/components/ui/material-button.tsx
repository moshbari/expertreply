import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const materialButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        filled: "bg-primary text-primary-foreground hover:shadow-elevation-2 active:shadow-elevation-1 rounded-full",
        "filled-tonal": "bg-accent-container text-accent-container-foreground hover:shadow-elevation-2 active:shadow-elevation-1 rounded-full",
        outlined: "border border-outline text-primary hover:bg-primary/8 active:bg-primary/12 rounded-full",
        text: "text-primary hover:bg-primary/8 active:bg-primary/12 rounded-full",
        elevated: "bg-surface text-primary shadow-elevation-1 hover:shadow-elevation-2 active:shadow-elevation-1 rounded-full",
        fab: "bg-primary-container text-primary-container-foreground shadow-elevation-3 hover:shadow-elevation-4 active:shadow-elevation-3 rounded-2xl",
      },
      size: {
        default: "h-10 px-6 py-2.5 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        fab: "h-14 w-14",
      },
      state: {
        default: "",
        loading: "pointer-events-none",
      }
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
      state: "default",
    },
  }
);

export interface MaterialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof materialButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const MaterialButton = React.forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ className, variant, size, state, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(materialButtonVariants({ variant, size, state: loading ? "loading" : state, className }))}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        <span className={cn("transition-opacity", loading && "opacity-0")}>
          {children}
        </span>
      </Comp>
    );
  }
);
MaterialButton.displayName = "MaterialButton";

export { MaterialButton, materialButtonVariants };