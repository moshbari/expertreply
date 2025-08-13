import * as React from "react";
import { cn } from "@/lib/utils";

export interface MaterialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  supportingText?: string;
  error?: boolean;
  filled?: boolean;
}

const MaterialInput = React.forwardRef<HTMLInputElement, MaterialInputProps>(
  ({ className, type, label, supportingText, error, filled = true, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative rounded-t-xl transition-all duration-200",
            filled
              ? cn(
                  "bg-surface-container border-b-2",
                  focused || hasValue
                    ? "border-primary"
                    : error
                    ? "border-destructive"
                    : "border-outline"
                )
              : cn(
                  "border-2 rounded-xl",
                  focused
                    ? "border-primary"
                    : error
                    ? "border-destructive"
                    : "border-outline"
                )
          )}
        >
          {label && (
            <label
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none",
                focused || hasValue
                  ? "top-2 text-xs text-primary"
                  : "top-4 text-base text-on-surface-variant"
              )}
            >
              {label}
            </label>
          )}
          <input
            type={type}
            className={cn(
              "w-full bg-transparent px-4 text-on-surface placeholder:text-transparent focus:outline-none",
              label ? (focused || hasValue ? "pt-6 pb-2" : "pt-4 pb-4") : "py-4",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            {...props}
          />
        </div>
        {supportingText && (
          <p
            className={cn(
              "mt-1 px-4 text-xs",
              error ? "text-destructive" : "text-on-surface-variant"
            )}
          >
            {supportingText}
          </p>
        )}
      </div>
    );
  }
);
MaterialInput.displayName = "MaterialInput";

export { MaterialInput };