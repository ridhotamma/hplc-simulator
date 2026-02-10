import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  HPLCMethod,
  PumpSettings,
  InjectionSettings,
  ColumnSettings,
  DetectorSettings,
  MobilePhase,
  Sample,
  SimulationResult,
} from "~/types/hplc";

interface HPLCStore {
  // Current method settings
  pump: PumpSettings;
  injection: InjectionSettings;
  column: ColumnSettings;
  detector: DetectorSettings;
  mobilePhase: MobilePhase;
  mobilePhaseFlowLinked: boolean;
  sample: Sample | null;
  runTime: number;

  // Simulation results
  simulationResult: SimulationResult | null;
  isRunning: boolean;

  // Saved methods
  savedMethods: HPLCMethod[];

  // Actions
  updatePump: (pump: Partial<PumpSettings>) => void;
  updateInjection: (injection: Partial<InjectionSettings>) => void;
  updateColumn: (column: Partial<ColumnSettings>) => void;
  updateDetector: (detector: Partial<DetectorSettings>) => void;
  updateMobilePhase: (mobilePhase: Partial<MobilePhase>) => void;
  setMobilePhaseFlowLinked: (linked: boolean) => void;
  updateSample: (sample: Sample | null) => void;
  updateRunTime: (runTime: number) => void;

  setSimulationResult: (result: SimulationResult | null) => void;
  setIsRunning: (isRunning: boolean) => void;

  saveMethod: (name: string, description?: string) => void;
  loadMethod: (methodId: string) => void;
  deleteMethod: (methodId: string) => void;
  
  resetToDefaults: () => void;
}

// Default settings
const defaultPump: PumpSettings = {
  flowRate: 1.0,
  pressure: 0,
  mode: "isocratic",
};

const defaultInjection: InjectionSettings = {
  volume: 10,
  mode: "autosampler",
};

const defaultColumn: ColumnSettings = {
  length: 150,
  internalDiameter: 4.6,
  particleSize: 5,
  stationaryPhase: "C18",
  temperature: 25,
  deadVolume: 0,
};

const defaultDetector: DetectorSettings = {
  type: "UV",
  wavelength: 254,
  bandwidth: 4,
  samplingRate: 10,
  noiseLevel: 0.5,
  wavelengthRange: { start: 190, end: 800 },
  excitationWavelength: 280,
  emissionWavelength: 350,
  massRange: { start: 50, end: 2000 },
};

const defaultMobilePhase: MobilePhase = {
  solventA: "Water",
  solventB: "Acetonitrile",
  percentB: 50,
  pH: 7,
  flowRate: 1.0,
  mode: "isocratic",
  gradientSteps: [],
  gradientDelayVolume: 1.0,
  reEquilibrationTime: 5,
};

export const useHPLCStore = create<HPLCStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pump: defaultPump,
      injection: defaultInjection,
      column: defaultColumn,
      detector: defaultDetector,
      mobilePhase: defaultMobilePhase,
      mobilePhaseFlowLinked: true,
      sample: null,
      runTime: 20,
      simulationResult: null,
      isRunning: false,
      savedMethods: [],

      // Actions
      updatePump: (pump) =>
        set((state) => ({ pump: { ...state.pump, ...pump } })),

      updateInjection: (injection) =>
        set((state) => ({ injection: { ...state.injection, ...injection } })),

      updateColumn: (column) =>
        set((state) => ({ column: { ...state.column, ...column } })),

      updateDetector: (detector) =>
        set((state) => ({ detector: { ...state.detector, ...detector } })),

      updateMobilePhase: (mobilePhase) =>
        set((state) => ({
          mobilePhase: { ...state.mobilePhase, ...mobilePhase },
        })),

      setMobilePhaseFlowLinked: (linked) => set({ mobilePhaseFlowLinked: linked }),

      updateSample: (sample) => set({ sample }),

      updateRunTime: (runTime) => set({ runTime }),

      setSimulationResult: (simulationResult) => set({ simulationResult }),

      setIsRunning: (isRunning) => set({ isRunning }),

      saveMethod: (name, description) => {
        const state = get();
        const newMethod: HPLCMethod = {
          id: `method-${Date.now()}`,
          name,
          description,
          pump: state.pump,
          injection: state.injection,
          column: state.column,
          detector: state.detector,
          mobilePhase: state.mobilePhase,
          sample: state.sample!,
          runTime: state.runTime,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          savedMethods: [...state.savedMethods, newMethod],
        }));
      },

      loadMethod: (methodId) => {
        const method = get().savedMethods.find((m) => m.id === methodId);
        if (method) {
          set({
            pump: method.pump,
            injection: method.injection,
            column: method.column,
            detector: method.detector,
            mobilePhase: method.mobilePhase,
            sample: method.sample,
            runTime: method.runTime,
          });
        }
      },

      deleteMethod: (methodId) =>
        set((state) => ({
          savedMethods: state.savedMethods.filter((m) => m.id !== methodId),
        })),

      resetToDefaults: () =>
        set({
          pump: defaultPump,
          injection: defaultInjection,
          column: defaultColumn,
          detector: defaultDetector,
          mobilePhase: defaultMobilePhase,
          mobilePhaseFlowLinked: true,
          sample: null,
          runTime: 20,
          simulationResult: null,
          isRunning: false,
        }),
    }),
    {
      name: "hplc-storage",
      partialize: (state) => ({
        savedMethods: state.savedMethods,
        mobilePhaseFlowLinked: state.mobilePhaseFlowLinked,
      }),
    }
  )
);
