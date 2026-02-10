import React from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber } from "~/components/ui";

export const InjectionControl: React.FC = () => {
  const { injection, updateInjection } = useHPLCStore();

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Injection System</h3>
      
      <InputNumber
        label="Injection Volume (μL)"
        value={injection.volume}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 1 && value <= 100) {
            updateInjection({ volume: value });
          }
        }}
        min={1}
        max={100}
        step={1}
        helperText="Range: 1 - 100 μL"
        allowDecimal={false}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Injection Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => updateInjection({ mode: "manual" })}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              injection.mode === "manual"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => updateInjection({ mode: "autosampler" })}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              injection.mode === "autosampler"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Autosampler
          </button>
        </div>
      </div>
    </div>
  );
};
