import React from "react";
import { cn } from "~/lib/utils";

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      allowDecimal = true,
      allowNegative = true,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const baseStyles =
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const errorStyles = error
      ? "border-red-500 focus-visible:ring-red-500"
      : "";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }

      const char = e.key;
      const currentValue = (e.target as HTMLInputElement).value;

      // Allow decimal point if enabled and not already present
      if (char === "." && allowDecimal && !currentValue.includes(".")) {
        return;
      }

      // Allow minus sign if enabled and at the start
      if (
        char === "-" &&
        allowNegative &&
        (e.target as HTMLInputElement).selectionStart === 0 &&
        !currentValue.includes("-")
      ) {
        return;
      }

      // Prevent non-numeric characters
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          onKeyDown={handleKeyDown}
          className={cn(baseStyles, errorStyles, className)}
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

InputNumber.displayName = "InputNumber";
