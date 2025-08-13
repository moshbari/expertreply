import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-3xl transition-all duration-300 ease-in-out overflow-hidden",
  {
    variants: {
      variant: {
        elevated: "bg-surface shadow-elevation-2 hover:shadow-elevation-3",
        filled: "bg-surface-container",
        outlined: "bg-surface border border-outline-variant",
      },
      interactive: {
        true: "hover:shadow-elevation-4 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]",
        false: "",
      }
    },
    defaultVariants: {
      variant: "elevated",
      interactive: false,
    },
  }
);

export interface MaterialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const MaterialCard = React.forwardRef<HTMLDivElement, MaterialCardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, className }))}
      {...props}
    />
  )
);
MaterialCard.displayName = "MaterialCard";

const MaterialCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
MaterialCardHeader.displayName = "MaterialCardHeader";

const MaterialCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-on-surface",
      className
    )}
    {...props}
  />
));
MaterialCardTitle.displayName = "MaterialCardTitle";

const MaterialCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-on-surface-variant", className)}
    {...props}
  />
));
MaterialCardDescription.displayName = "MaterialCardDescription";

const MaterialCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
MaterialCardContent.displayName = "MaterialCardContent";

const MaterialCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
MaterialCardFooter.displayName = "MaterialCardFooter";

export {
  MaterialCard,
  MaterialCardHeader,
  MaterialCardTitle,
  MaterialCardDescription,
  MaterialCardContent,
  MaterialCardFooter,
};