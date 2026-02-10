import { useState } from "react";
import { PumpControl } from "~/components/hplc/PumpControl";
import { ColumnControl } from "~/components/hplc/ColumnControl";
import { DetectorControl } from "~/components/hplc/DetectorControl";
import { MobilePhaseControl } from "~/components/hplc/MobilePhaseControl";
import { Tabs, type TabItem } from "~/components/ui";
import { useHPLCStore } from "~/store/hplcStore";

type ControlTab = "pump" | "column" | "detector" | "mobile";

const controlTabs: TabItem<ControlTab>[] = [
  { id: "pump", label: "Pump" },
  { id: "column", label: "Column" },
  { id: "detector", label: "Detector" },
  { id: "mobile", label: "Mobile Phase" },
];

export const SettingsPage = () => {
  const { runTime, updateRunTime } = useHPLCStore();
  const [activeTab, setActiveTab] = useState<ControlTab>("pump");

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <Tabs tabs={controlTabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-3">
          {activeTab === "pump" && <PumpControl />}
          {activeTab === "column" && <ColumnControl />}
          {activeTab === "detector" && <DetectorControl />}
          {activeTab === "mobile" && <MobilePhaseControl />}
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Run Time: {runTime} minutes
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={runTime}
          onChange={(e) => updateRunTime(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 min</span>
          <span>30 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>
  );
};
