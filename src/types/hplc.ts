// Core HPLC System Types

export type StationaryPhaseType =
  | "C18"
  | "C8"
  | "C4"
  | "Phenyl"
  | "Silica"
  | "Amino"
  | "Cyano";

export type DetectorType = "UV" | "PDA" | "DAD" | "Fluorescence" | "RI" | "ELSD" | "MS";

export type SolventType =
  | "Water"
  | "Acetonitrile"
  | "Methanol"
  | "Tetrahydrofuran"
  | "Hexane"
  | "Isopropanol";

export interface PumpSettings {
  flowRate: number; // mL/min (0.1 - 5.0)
  pressure: number; // bar (calculated, 0 - 400)
  mode: "isocratic" | "gradient";
}

export interface InjectionSettings {
  volume: number; // μL (1 - 100)
  mode: "manual" | "autosampler";
}

export interface ColumnSettings {
  length: number; // mm (30 - 300)
  internalDiameter: number; // mm (2.1 - 4.6)
  particleSize: number; // μm (1.8, 3, 5, 10)
  stationaryPhase: StationaryPhaseType;
  temperature: number; // °C (15 - 80)
  deadVolume: number; // mL (calculated)
}

export interface DetectorSettings {
  type: DetectorType;
  wavelength: number; // nm (190 - 800) for UV
  bandwidth: number; // nm
  samplingRate: number; // Hz
  noiseLevel: number; // Arbitrary units
  // PDA specific
  wavelengthRange?: { start: number; end: number };
  // Fluorescence specific
  excitationWavelength?: number;
  emissionWavelength?: number;
  // MS specific
  massRange?: { start: number; end: number };
}

export type GradientStepType = "linear" | "step" | "curve";

export interface GradientStep {
  time: number; // minutes
  percentB: number; // 0 - 100
  flowRate?: number; // mL/min (optional, if different from initial)
  type: GradientStepType;
}

export interface MobilePhase {
  solventA: SolventType;
  solventB?: SolventType;
  percentB: number; // 0 - 100 for isocratic (initial % for gradient)
  pH: number; // 2 - 12
  flowRate: number; // mL/min
  mode: "isocratic" | "gradient";
  gradientSteps?: GradientStep[]; // For gradient mode
  gradientDelayVolume?: number; // mL (system dead volume)
  reEquilibrationTime?: number; // minutes
}

export interface Compound {
  id: string;
  name: string;
  molecularWeight: number;
  pKa: number[];
  logP: number; // Hydrophobicity
  uvAbsorption: { wavelength: number; absorbance: number }[];
  structure?: string; // SMILES or InChI
  category: "pharmaceutical" | "environmental" | "natural" | "biological";
}

export interface SampleComponent {
  compound: Compound;
  concentration: number; // mg/mL or μg/mL
}

export interface Sample {
  id: string;
  name: string;
  components: SampleComponent[];
  matrix?: string;
}

export interface Peak {
  retentionTime: number; // minutes
  height: number; // mAU
  area: number; // mAU*min
  width: number; // minutes
  asymmetry: number;
  resolution?: number;
  compoundId: string;
}

export interface ChromatogramData {
  time: number[]; // minutes
  signal: number[]; // mAU (milli-Absorbance Units)
  peaks: Peak[];
  baseline: number[];
}

export interface HPLCMethod {
  id: string;
  name: string;
  description?: string;
  pump: PumpSettings;
  injection: InjectionSettings;
  column: ColumnSettings;
  detector: DetectorSettings;
  mobilePhase: MobilePhase;
  sample: Sample;
  runTime: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationResult {
  chromatogram: ChromatogramData;
  systemSuitability: {
    resolution: number;
    efficiency: number; // theoretical plates
    asymmetry: number;
    capacityFactor: number;
  };
  warnings: string[];
}
