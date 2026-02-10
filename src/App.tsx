import { useState, useCallback, useEffect, useRef } from "react";
import { HiChartBar } from "react-icons/hi";
import { FaFlask, FaCog, FaSave } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { useHPLCStore } from "~/store/hplcStore";
import { simulateChromatogram, calculatePumpPressure, calculateDeadVolume } from "~/utils/chromatography";
import { PumpControl } from "~/components/hplc/PumpControl";
import { ColumnControl } from "~/components/hplc/ColumnControl";
import { DetectorControl } from "~/components/hplc/DetectorControl";
import { MobilePhaseControl } from "~/components/hplc/MobilePhaseControl";
import { SampleSetup } from "~/components/hplc/SampleSetup";
import { MethodManager } from "~/components/hplc/MethodManager";
import { ChromatogramChart } from "~/components/chart/ChromatogramChart";
import { Tabs, Table, SplashScreen, type TabItem, type TableColumn } from "~/components/ui";
import type { ChromatogramData, Peak } from "~/types/hplc";

type ControlTab = "pump" | "column" | "detector" | "mobile";

const controlTabs: TabItem<ControlTab>[] = [
  { id: "pump", label: "Pump" },
  { id: "column", label: "Column" },
  { id: "detector", label: "Detector" },
  { id: "mobile", label: "Mobile Phase" },
];

const navItems = [
  { id: "sample", label: "Sample", path: "/sample", icon: FaFlask },
  { id: "settings", label: "Settings", path: "/settings", icon: FaCog },
  { id: "methods", label: "Methods", path: "/methods", icon: FaSave },
  { id: "result", label: "Result", path: "/result", icon: HiChartBar },
];

function App() {
  const {
    pump,
    injection,
    column,
    detector,
    mobilePhase,
    mobilePhaseFlowLinked,
    sample,
    runTime,
    updatePump,
    updateColumn,
    updateMobilePhase,
    updateRunTime,
    setIsRunning,
  } = useHPLCStore();

  const [chromatogramData, setChromatogramData] = useState<ChromatogramData | null>(null);
  const [activeTab, setActiveTab] = useState<ControlTab>("pump");
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const isSimulatingRef = useRef(false);
  const location = useLocation();

  // Calculate and update pressure/dead volume when column or pump settings change
  useEffect(() => {
    const pressure = calculatePumpPressure(
      mobilePhase.flowRate,
      column.length,
      column.internalDiameter,
      column.particleSize
    );
    
    const deadVolume = calculateDeadVolume(column);
    
    // Only update if values actually changed to avoid unnecessary re-renders
    if (pump.pressure !== pressure) {
      updatePump({ pressure });
    }
    if (column.deadVolume !== deadVolume) {
      updateColumn({ deadVolume });
    }
  }, [column, mobilePhase.flowRate, column.length, column.internalDiameter, column.particleSize, column.temperature, column.stationaryPhase, pump.pressure, updatePump, updateColumn, column.deadVolume]);

  // Keep mobile phase flow tied to pump when linking is enabled
  useEffect(() => {
    if (mobilePhaseFlowLinked && mobilePhase.flowRate !== pump.flowRate) {
      updateMobilePhase({ flowRate: pump.flowRate });
    }
  }, [mobilePhaseFlowLinked, pump.flowRate, mobilePhase.flowRate, updateMobilePhase]);

  const handleRunSimulation = useCallback(() => {
    if (!sample || sample.components.length === 0) {
      alert("Please select at least one compound in the sample");
      return;
    }

    if (isSimulatingRef.current) {
      return; // Prevent concurrent simulations
    }

    isSimulatingRef.current = true;
    setIsRunning(true);
    
    // Simulate with a small delay for realism
    setTimeout(() => {
      const data = simulateChromatogram(
        sample.components,
        column,
        mobilePhase,
        detector,
        mobilePhase.flowRate,
        runTime,
        injection.volume
      );
      
      setChromatogramData(data);
      setIsRunning(false);
      isSimulatingRef.current = false;
    }, 500);
  }, [sample, column, mobilePhase, detector, runTime, injection.volume, setIsRunning]);

  // Auto-simulate when sample or parameters change
  useEffect(() => {
    if (sample && sample.components.length > 0 && !isSimulatingRef.current) {
      handleRunSimulation();
    }
  }, [sample, sample?.components.length, handleRunSimulation]);

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

  const renderSettings = () => (
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

  const renderResult = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Chromatogram</h2>
        {sample && (
          <p className="text-xs text-gray-600 mt-1">
            Sample: {sample.components.length} compound(s) | {detector.type} Detector @ {detector.wavelength} nm
          </p>
        )}
      </div>

      {chromatogramData ? (
        <>
          <div className="overflow-x-auto -mx-3 px-3">
            <ChromatogramChart data={chromatogramData} height={300} width={Math.max(window.innerWidth * 1.5, 600)} />
          </div>

          {chromatogramData.peaks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Peak Analysis</h3>
              <Table
                data={chromatogramData.peaks.map((peak, index) => ({ ...peak, index }))}
                columns={peakTableColumns}
                compact
                hover
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center px-4">
            <HiChartBar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-base font-medium">No chromatogram data</p>
            <p className="text-xs mt-1">Select compounds and run simulation to see results</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
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
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-3 py-3">
            <div className="flex items-center justify-center">
              <h1 className="text-lg font-bold text-gray-900 truncate">HPLC Simulator</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-3 py-3 pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/sample" replace />} />
            <Route path="/sample" element={<SampleSetup onClearChromatogram={() => setChromatogramData(null)} />} />
            <Route path="/settings" element={renderSettings()} />
            <Route path="/methods" element={<MethodManager />} />
            <Route path="/result" element={renderResult()} />
            <Route path="*" element={<Navigate to="/sample" replace />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-4 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

export default App;
