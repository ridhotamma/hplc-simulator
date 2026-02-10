import { useState, useCallback, useEffect } from "react";
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
import { Button, Tabs, Table, SplashScreen, type TabItem, type TableColumn } from "~/components/ui";
import type { ChromatogramData, Peak } from "~/types/hplc";
import { FaPlay } from "react-icons/fa";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

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

  const peakTableColumns: TableColumn<Peak & { index: number }>[] = [
    {
      key: "index",
      header: "Peak",
      render: (item) => item.index + 1,
      className: "font-medium text-gray-900",
    },
    {
      key: "retentionTime",
      header: "RT (min)",
      render: (item) => item.retentionTime.toFixed(3),
      className: "text-gray-700",
      headerClassName: "whitespace-nowrap",
    },
    {
      key: "height",
      header: "Height",
      render: (item) => item.height.toFixed(2),
      className: "text-gray-700",
    },
    {
      key: "area",
      header: "Area",
      render: (item) => item.area.toFixed(2),
      className: "text-gray-700",
    },
    {
      key: "width",
      header: "Width",
      render: (item) => item.width.toFixed(3),
      className: "text-gray-700",
    },
    {
      key: "asymmetry",
      header: "Asym.",
      render: (item) => item.asymmetry.toFixed(2),
      className: "text-gray-700",
      headerClassName: "whitespace-nowrap",
    },
    {
      key: "resolution",
      header: "Rs",
      render: (item) => (item.resolution ? item.resolution.toFixed(2) : "—"),
      className: "text-gray-700",
    },
  ];

  return (
    <>
      {isLoading && (
        <SplashScreen
          onLoadingComplete={() => {
            setIsLoading(false);
            setTimeout(() => setShowContent(true), 50);
          }}
        />
      )}
      <div
        className={`min-h-screen bg-linear-to-br from-blue-50 to-gray-100 transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                HPLC Simulator
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                High-Performance Liquid Chromatography Educational Simulator
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
                className="hidden sm:inline-flex"
              >
                {showControls ? "Hide" : "Show"} Controls
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
                className="sm:hidden"
              >
                {showControls ? "Hide" : "Show"}
              </Button>
              <Button
                onClick={handleRunSimulation}
                disabled={isRunning || !sample}
                size="sm"
              >
                <FaPlay size={10} className="mr-2"/>
                {isRunning ? "Running..." : "Run"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
          {/* Control Panel */}
          {showControls && (
            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              {/* Sample Setup */}
              <SampleSetup />

              {/* Tabbed Controls */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <Tabs
                  tabs={controlTabs}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div className="p-3 sm:p-4">
                  {activeTab === "pump" && <PumpControl />}
                  {activeTab === "column" && <ColumnControl />}
                  {activeTab === "detector" && <DetectorControl />}
                  {activeTab === "mobile" && <MobilePhaseControl />}
                </div>
              </div>

              {/* Run Time Control */}
              <div className="p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Chromatogram
                </h2>
                {sample && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Sample: {sample.components.length} compound(s) | 
                    {detector.type} Detector @ {detector.wavelength} nm
                  </p>
                )}
              </div>

              {chromatogramData ? (
                <>
                  <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                    <ChromatogramChart
                      data={chromatogramData}
                      height={window.innerWidth < 640 ? 300 : 500}
                      width={window.innerWidth < 640 ? Math.max(window.innerWidth * 1.5, 600) : undefined}
                    />
                  </div>

                  {/* Peak Table */}
                  {chromatogramData.peaks.length > 0 && (
                    <div className="mt-4 sm:mt-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                        Peak Analysis
                      </h3>
                      <Table
                        data={chromatogramData.peaks.map((peak, index) => ({ ...peak, index }))}
                        columns={peakTableColumns}
                        compact={window.innerWidth < 640}
                        hover
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 sm:h-96 text-gray-500">
                  <div className="text-center px-4">
                    <HiChartBar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
                    <p className="text-base sm:text-lg font-medium">No chromatogram data</p>
                    <p className="text-xs sm:text-sm mt-1">
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
    </>
  );
}

export default App;
