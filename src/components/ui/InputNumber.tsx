import React from "react";
import { cn } from "~/lib/utils";

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
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
      size = "md",
      value,
      onChange,
      onBlur,
      min,
      max,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [internalValue, setInternalValue] = React.useState<string>(
      value?.toString() ?? ""
    );

    // Sync internal value when external value changes
    React.useEffect(() => {
      setInternalValue(value?.toString() ?? "");
    }, [value]);

    const baseStyles =
      "flex w-full rounded-md border border-gray-300 bg-white ring-offset-white file:border-0 file:bg-transparent file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const sizes = {
      xs: "h-6 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      
      // Call parent onChange to update state immediately
      if (onChange) {
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let finalValue = internalValue.trim();

      // If empty or invalid, use previous value or min/max/0
      if (finalValue === "" || finalValue === "-" || finalValue === ".") {
        if (min !== undefined) {
          finalValue = min.toString();
        } else if (!allowNegative) {
          finalValue = "0";
        } else {
          finalValue = value?.toString() ?? "0";
        }
      } else {
        const numValue = parseFloat(finalValue);
        
        // Validate against min/max
        if (!isNaN(numValue)) {
          let validatedValue = numValue;
          
          const minNum = min !== undefined ? Number(min) : undefined;
          const maxNum = max !== undefined ? Number(max) : undefined;
          
          if (minNum !== undefined && validatedValue < minNum) {
            validatedValue = minNum;
          }
          if (maxNum !== undefined && validatedValue > maxNum) {
            validatedValue = maxNum;
          }
          
          finalValue = validatedValue.toString();
        }
      }

      setInternalValue(finalValue);

      // Create synthetic event with corrected value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: finalValue,
        },
      } as React.FocusEvent<HTMLInputElement>;

      // Call parent onChange with validated value
      if (onChange) {
        const changeEvent = {
          target: { value: finalValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(changeEvent);
      }

      // Call parent onBlur
      if (onBlur) {
        onBlur(syntheticEvent);
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
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(baseStyles, sizes[size], errorStyles, className)}
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
