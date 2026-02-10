import React from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber } from "~/components/ui";
import type { SolventType } from "~/types/hplc";

const solvents: SolventType[] = [
  "Water",
  "Acetonitrile",
  "Methanol",
  "Tetrahydrofuran",
  "Hexane",
  "Isopropanol",
];

export const MobilePhaseControl: React.FC = () => {
  const { mobilePhase, updateMobilePhase } = useHPLCStore();

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Mobile Phase</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Solvent A
        </label>
        <select
          value={mobilePhase.solventA}
          onChange={(e) =>
            updateMobilePhase({ solventA: e.target.value as SolventType })
          }
          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {solvents.map((solvent) => (
            <option key={solvent} value={solvent}>
              {solvent}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Solvent B
        </label>
        <select
          value={mobilePhase.solventB || "Acetonitrile"}
          onChange={(e) =>
            updateMobilePhase({ solventB: e.target.value as SolventType })
          }
          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {solvents.map((solvent) => (
            <option key={solvent} value={solvent}>
              {solvent}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          % Solvent B: {mobilePhase.percentB}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={mobilePhase.percentB}
          onChange={(e) =>
            updateMobilePhase({ percentB: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <InputNumber
        label="pH"
        value={mobilePhase.pH}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 2 && value <= 12) {
            updateMobilePhase({ pH: value });
          }
        }}
        min={2}
        max={12}
        step={0.1}
        helperText="Range: 2 - 12"
        allowDecimal
      />
    </div>
  );
};
