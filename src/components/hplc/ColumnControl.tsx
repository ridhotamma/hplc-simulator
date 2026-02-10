import React from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber } from "~/components/ui";
import type { StationaryPhaseType } from "~/types/hplc";

const stationaryPhases: StationaryPhaseType[] = ["C18", "C8", "C4", "Phenyl", "Silica", "Amino", "Cyano"];
const particleSizes = [1.8, 3, 5, 10];

export const ColumnControl: React.FC = () => {
  const { column, updateColumn } = useHPLCStore();

  return (
    <div className="space-y-3 sm:space-y-4">
      <InputNumber
        label="Length (mm)"
        value={column.length}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 30 && value <= 300) {
            updateColumn({ length: value });
          }
        }}
        min={30}
        max={300}
        step={10}
        helperText="Range: 30 - 300 mm"
        allowDecimal={false}
      />
      
      <InputNumber
        label="Internal Diameter (mm)"
        value={column.internalDiameter}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 2.1 && value <= 4.6) {
            updateColumn({ internalDiameter: value });
          }
        }}
        min={2.1}
        max={4.6}
        step={0.1}
        helperText="Range: 2.1 - 4.6 mm"
        allowDecimal
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Particle Size (μm)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {particleSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateColumn({ particleSize: size })}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                column.particleSize === size
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Stationary Phase
        </label>
        <select
          value={column.stationaryPhase}
          onChange={(e) =>
            updateColumn({ stationaryPhase: e.target.value as StationaryPhaseType })
          }
          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {stationaryPhases.map((phase) => (
            <option key={phase} value={phase}>
              {phase}
            </option>
          ))}
        </select>
      </div>
      
      <InputNumber
        label="Temperature (°C)"
        value={column.temperature}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 15 && value <= 80) {
            updateColumn({ temperature: value });
          }
        }}
        min={15}
        max={80}
        step={5}
        helperText="Range: 15 - 80 °C"
        allowDecimal={false}
      />
    </div>
  );
};
