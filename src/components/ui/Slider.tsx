import React from "react";
import { cn } from "~/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      showValue = true,
      valueFormatter,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const displayValue = valueFormatter
      ? valueFormatter(Number(value) || 0)
      : value;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-medium text-gray-900">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type="range"
          value={value}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
            "accent-blue-600",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-blue-600",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-all",
            "[&::-webkit-slider-thumb]:hover:bg-blue-700",
            "[&::-webkit-slider-thumb]:active:scale-125",
            "[&::-moz-range-thumb]:w-4",
            "[&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-blue-600",
            "[&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:cursor-pointer",
            "[&::-moz-range-thumb]:transition-all",
            "[&::-moz-range-thumb]:hover:bg-blue-700",
            "[&::-moz-range-thumb]:active:scale-125",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "accent-red-600",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";
