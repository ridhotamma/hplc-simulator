import { useState, useEffect, useCallback } from "react";
import { HiChartBar } from "react-icons/hi";
import { useHPLCStore } from "~/store/hplcStore";
import { simulateChromatogram } from "~/utils/chromatography";
import { PumpControl } from "~/components/hplc/PumpControl";
import { ColumnControl } from "~/components/hplc/ColumnControl";
import { DetectorControl } from "~/components/hplc/DetectorControl";
import { MobilePhaseControl } from "~/components/hplc/MobilePhaseControl";
import { SampleSetup } from "~/components/hplc/SampleSetup";
import { MethodManager } from "~/components/hplc/MethodManager";
import { ChromatogramChart } from "~/components/chart/ChromatogramChart";
import { Button, Tabs } from "~/components/ui";
import type { ChromatogramData } from "~/types/hplc";
import type { TabItem } from "~/components/ui/Tabs";

type ControlTab = "pump" | "column" | "detector" | "mobile";

const controlTabs: TabItem<ControlTab>[] = [
  { id: "pump", label: "Pump" },
  { id: "column", label: "Column" },
  { id: "detector", label: "Detector" },
  { id: "mobile", label: "Mobile Phase" },
];

function App() {
  const {
    pump,
    column,
    detector,
    mobilePhase,
    sample,
    runTime,
    updateRunTime,
    isRunning,
    setIsRunning,
  } = useHPLCStore();

  const [chromatogramData, setChromatogramData] = useState<ChromatogramData | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState<ControlTab>("pump");

  const handleRunSimulation = useCallback(() => {
    if (!sample || sample.components.length === 0) {
      alert("Please select at least one compound in the sample");
      return;
    }

    setIsRunning(true);
    
    // Simulate with a small delay for realism
    setTimeout(() => {
      const data = simulateChromatogram(
        sample.components,
        column,
        mobilePhase,
        detector,
        pump.flowRate,
        runTime
      );
      
      setChromatogramData(data);
      setIsRunning(false);
    }, 500);
  }, [sample, column, mobilePhase, detector, pump.flowRate, runTime, setIsRunning]);

  // Auto-simulate when parameters change
  useEffect(() => {
    if (sample && sample.components.length > 0) {
      handleRunSimulation();
    }
  }, [sample, handleRunSimulation]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                HPLC Simulator
              </h1>
              <p className="text-sm text-gray-600">
                High-Performance Liquid Chromatography Educational Simulator
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
              >
                {showControls ? "Hide" : "Show"} Controls
              </Button>
              <Button
                onClick={handleRunSimulation}
                disabled={isRunning || !sample}
                size="sm"
              >
                {isRunning ? "Running..." : "Run Simulation"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Control Panel */}
          {showControls && (
            <div className="lg:col-span-4 space-y-6">
              {/* Sample Setup */}
              <SampleSetup />

              {/* Tabbed Controls */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <Tabs
                  tabs={controlTabs}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div className="p-4">
                  {activeTab === "pump" && <PumpControl />}
                  {activeTab === "column" && <ColumnControl />}
                  {activeTab === "detector" && <DetectorControl />}
                  {activeTab === "mobile" && <MobilePhaseControl />}
                </div>
              </div>

              {/* Run Time Control */}
              <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
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

              {/* Method Manager */}
              <MethodManager />
            </div>
          )}

          {/* Chromatogram Display */}
          <div className={showControls ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Chromatogram
                </h2>
                {sample && (
                  <p className="text-sm text-gray-600 mt-1">
                    Sample: {sample.components.length} compound(s) | 
                    {detector.type} Detector @ {detector.wavelength} nm
                  </p>
                )}
              </div>

              {chromatogramData ? (
                <>
                  <ChromatogramChart
                    data={chromatogramData}
                    height={500}
                  />

                  {/* Peak Table */}
                  {chromatogramData.peaks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Peak Analysis
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Peak
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                RT (min)
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Height (mAU)
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Area
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Width (min)
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Asymmetry
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">
                                Resolution
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {chromatogramData.peaks.map((peak, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 font-medium">{idx + 1}</td>
                                <td className="px-4 py-2">{peak.retentionTime.toFixed(3)}</td>
                                <td className="px-4 py-2">{peak.height.toFixed(2)}</td>
                                <td className="px-4 py-2">{peak.area.toFixed(2)}</td>
                                <td className="px-4 py-2">{peak.width.toFixed(3)}</td>
                                <td className="px-4 py-2">{peak.asymmetry.toFixed(2)}</td>
                                <td className="px-4 py-2">
                                  {peak.resolution
                                    ? peak.resolution.toFixed(2)
                                    : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <HiChartBar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No chromatogram data</p>
                    <p className="text-sm mt-1">
                      Select compounds and run simulation to see results
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
