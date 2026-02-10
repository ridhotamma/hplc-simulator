import React from "react";
import { cn } from "~/lib/utils";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  helperText?: string;
  size?: "sm" | "md";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, label, helperText, size = "md", className, disabled, ...props }, ref) => {
    const sizes = {
      sm: { track: "w-10 h-5", thumb: "w-4 h-4", translate: "translate-x-5" },
      md: { track: "w-12 h-6", thumb: "w-5 h-5", translate: "translate-x-6" },
    };

    const handleToggle = () => {
      if (disabled) return;
      onChange(!checked);
    };

    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          ref={ref}
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
            checked ? "bg-blue-600" : "bg-gray-300",
            sizes[size].track,
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "bg-white rounded-full shadow transform transition-transform",
              sizes[size].thumb,
              checked ? sizes[size].translate : "translate-x-1"
            )}
          />
        </button>
        {(label || helperText) && (
          <div className="text-sm text-gray-700 flex items-center gap-2">
            {label && <span>{label}</span>}
            {helperText && <span className="text-gray-500">{helperText}</span>}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";
