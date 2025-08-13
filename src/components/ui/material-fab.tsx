import * as React from "react";
import { cn } from "@/lib/utils";
import { MaterialButton } from "./material-button";
import { Sparkles } from "lucide-react";

interface MaterialFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  extended?: boolean;
  loading?: boolean;
}

const MaterialFab = React.forwardRef<HTMLButtonElement, MaterialFabProps>(
  ({ className, children, icon, extended = false, loading, ...props }, ref) => {
    return (
      <MaterialButton
        ref={ref}
        variant="fab"
        size={extended ? "default" : "fab"}
        loading={loading}
        className={cn(
          "fixed bottom-6 right-6 z-50 animate-scale-in",
          extended ? "h-14 px-6 rounded-2xl min-w-[56px]" : "h-14 w-14 rounded-2xl",
          className
        )}
        {...props}
      >
        {icon || <Sparkles className="h-6 w-6" />}
        {extended && children && <span className="ml-2">{children}</span>}
      </MaterialButton>
    );
  }
);
MaterialFab.displayName = "MaterialFab";

export { MaterialFab };