import React from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber } from "~/components/ui";

export const PumpControl: React.FC = () => {
  const { pump, updatePump } = useHPLCStore();

  return (
    <div className="space-y-3 sm:space-y-4">
      <InputNumber
        label="Flow Rate (mL/min)"
        value={pump.flowRate}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 0.1 && value <= 5.0) {
            updatePump({ flowRate: value });
          }
        }}
        min={0.1}
        max={5.0}
        step={0.1}
        helperText="Range: 0.1 - 5.0 mL/min"
        allowDecimal
      />
      
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Pressure (bar)
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-10 px-3 py-2 bg-gray-100 rounded-md border border-gray-300 flex items-center">
            <span className="text-sm font-mono text-gray-700">
              {pump.pressure.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {pump.pressure > 350 ? "⚠️ High" : pump.pressure > 200 ? "Normal" : "Low"}
          </div>
        </div>
        <p className="mt-1.5 text-sm text-gray-500">Calculated pressure</p>
      </div>
    </div>
  );
};
