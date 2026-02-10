import React, { useState } from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber, Tabs } from "~/components/ui";
import type { SolventType } from "~/types/hplc";
import type { TabItem } from "~/components/ui/Tabs";
import { GradientProgrammer } from "./GradientProgrammer";

type MobilePhaseMode = "isocratic" | "gradient";

const solvents: SolventType[] = [
  "Water",
  "Acetonitrile",
  "Methanol",
  "Tetrahydrofuran",
  "Hexane",
  "Isopropanol",
];

const modeTabsData: TabItem<MobilePhaseMode>[] = [
  { id: "isocratic", label: "Isocratic" },
  { id: "gradient", label: "Gradient" },
];

export const MobilePhaseControl: React.FC = () => {
  const { mobilePhase, updateMobilePhase } = useHPLCStore();
  const [activeMode, setActiveMode] = useState<MobilePhaseMode>(mobilePhase.mode || "isocratic");

  const handleModeChange = (mode: MobilePhaseMode) => {
    setActiveMode(mode);
    updateMobilePhase({ ...mobilePhase, mode });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className=" border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Mobile Phase</h3>
        
        {/* Mode Selection */}
        <Tabs
          tabs={modeTabsData}
          activeTab={activeMode}
          onChange={handleModeChange}
          className="mb-4"
        />
        
        <div className="space-y-4">
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
          
          {activeMode === "isocratic" && (
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
          )}

          {activeMode === "isocratic" && (
            <div className="text-sm text-gray-500 italic">
              Initial % B: {mobilePhase.percentB}% (used as starting point for gradient)
            </div>
          )}
          
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
      </div>

      {/* Gradient Programmer (only shown in gradient mode) */}
      {activeMode === "gradient" && <GradientProgrammer />}
    </div>
  );
};
