import { useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar } from "react-icons/hi";
import { FaFlask, FaCog, FaSave } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { useHPLCStore } from "~/store/hplcStore";
import { simulateChromatogram, calculatePumpPressure, calculateDeadVolume } from "~/utils/chromatography";
import { SplashScreen } from "~/components/ui";
import { SamplePage, SettingsPage, MethodsPage, ResultPage } from "~/pages";

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
    setChromatogramData,
    setIsRunning,
  } = useHPLCStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const isSimulatingRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const pressure = calculatePumpPressure(
      mobilePhase.flowRate,
      column.length,
      column.internalDiameter,
      column.particleSize
    );
    
    const deadVolume = calculateDeadVolume(column);
    
    if (pump.pressure !== pressure) {
      updatePump({ pressure });
    }
    if (column.deadVolume !== deadVolume) {
      updateColumn({ deadVolume });
    }
  }, [column, mobilePhase.flowRate, column.length, column.internalDiameter, column.particleSize, column.temperature, column.stationaryPhase, pump.pressure, updatePump, updateColumn, column.deadVolume]);

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
  }, [sample, column, mobilePhase, detector, runTime, injection.volume, setChromatogramData, setIsRunning]);

  useEffect(() => {
    if (sample && sample.components.length > 0 && !isSimulatingRef.current) {
      handleRunSimulation();
    }
  }, [sample, sample?.components.length, handleRunSimulation]);

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
            <Route path="/sample" element={<SamplePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/methods" element={<MethodsPage />} />
            <Route path="/result" element={<ResultPage />} />
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
