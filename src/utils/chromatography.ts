import type {
  ColumnSettings,
  MobilePhase,
  Compound,
  Peak,
  ChromatogramData,
  SampleComponent,
} from "~/types/hplc";

/**
 * Calculate dead volume (void volume) of the column
 * V0 = π * r² * L * ε
 * where ε is the interparticle porosity (~0.4 for packed columns)
 */
export function calculateDeadVolume(column: ColumnSettings): number {
  const radius = column.internalDiameter / 2; // mm
  const length = column.length; // mm
  const porosity = 0.4; // typical for packed columns
  
  // Volume in mm³, convert to mL (1 mL = 1000 mm³)
  const volume = Math.PI * radius * radius * length * porosity / 1000;
  return Number(volume.toFixed(4));
}

/**
 * Calculate dead time (t0) - time for unretained compound to elute
 * t0 = V0 / F
 * where F is flow rate
 */
export function calculateDeadTime(
  deadVolume: number,
  flowRate: number
): number {
  return Number((deadVolume / flowRate).toFixed(3));
}

/**
 * Van Deemter equation: H = A + B/u + C*u
 * H = plate height
 * u = linear velocity
 * A = eddy diffusion (multiple flow paths)
 * B = longitudinal diffusion
 * C = mass transfer resistance
 */
export function calculatePlateHeight(
  particleSize: number,
  linearVelocity: number
): number {
  // Empirical coefficients
  const A = 2 * particleSize; // Eddy diffusion
  const B = 0.01; // Longitudinal diffusion coefficient
  const C = 0.05 * particleSize; // Mass transfer coefficient
  
  const H = A + B / linearVelocity + C * linearVelocity;
  return H;
}

/**
 * Calculate linear velocity
 * u = L / t0
 */
export function calculateLinearVelocity(
  columnLength: number,
  deadTime: number
): number {
  return columnLength / deadTime; // mm/min
}

/**
 * Calculate theoretical plates (column efficiency)
 * N = L / H
 */
export function calculateTheoreticalPlates(
  columnLength: number,
  plateHeight: number
): number {
  return Math.floor(columnLength / plateHeight);
}

/**
 * Calculate retention factor (capacity factor)
 * k' = (tR - t0) / t0
 */
export function calculateRetentionFactor(
  retentionTime: number,
  deadTime: number
): number {
  return Number(((retentionTime - deadTime) / deadTime).toFixed(3));
}

/**
 * Calculate selectivity factor
 * α = k2' / k1'
 */
export function calculateSelectivity(k1: number, k2: number): number {
  return Number((k2 / k1).toFixed(3));
}

/**
 * Calculate resolution between two peaks
 * Rs = 2 * (tR2 - tR1) / (w1 + w2)
 */
export function calculateResolution(
  tR1: number,
  tR2: number,
  w1: number,
  w2: number
): number {
  return Number((2 * (tR2 - tR1) / (w1 + w2)).toFixed(2));
}

/**
 * Predict retention time based on compound properties
 * Simplified LSS (Linear Solvent Strength) model for reversed-phase
 * log k' = log k'w - S * φ
 */
export function predictRetentionTime(
  compound: Compound,
  column: ColumnSettings,
  mobilePhase: MobilePhase,
  deadTime: number
): number {
  // Base retention (log k'w) correlates with hydrophobicity (logP)
  const logKw = 0.5 * compound.logP + 0.5;
  
  // Solvent strength parameter (φ is organic modifier fraction)
  const phi = mobilePhase.percentB / 100;
  const S = 4.0; // Typical S value for small molecules
  
  // Calculate retention factor
  const logK = logKw - S * phi;
  const k = Math.pow(10, logK);
  
  // Retention time: tR = t0 * (1 + k')
  let retentionTime = deadTime * (1 + k);
  
  // pH effect on ionizable compounds
  if (compound.pKa.length > 0) {
    const pKa = compound.pKa[0];
    const pH = mobilePhase.pH;
    const ionizationFactor = 1 / (1 + Math.pow(10, pKa - pH));
    retentionTime *= (1 - 0.5 * ionizationFactor); // Ionized form elutes faster
  }
  
  // Temperature effect (higher T = faster elution)
  const tempFactor = 1 - (column.temperature - 25) * 0.02;
  retentionTime *= Math.max(0.5, tempFactor);
  
  return Number(retentionTime.toFixed(3));
}

/**
 * Generate Gaussian peak
 * y = A * exp(-0.5 * ((x - μ) / σ)²)
 */
function gaussianPeak(
  x: number,
  mean: number,
  sigma: number,
  amplitude: number
): number {
  const exponent = -0.5 * Math.pow((x - mean) / sigma, 2);
  return amplitude * Math.exp(exponent);
}

/**
 * Calculate peak width at base (4σ for Gaussian)
 */
export function calculatePeakWidth(
  retentionTime: number,
  theoreticalPlates: number
): number {
  // w = 4σ = 4 * tR / √N
  const width = (4 * retentionTime) / Math.sqrt(theoreticalPlates);
  return Number(width.toFixed(4));
}

/**
 * Calculate peak asymmetry factor
 * As = b / a (at 10% of peak height)
 * For Gaussian peaks, As ≈ 1.0
 * Tailing: As > 1.2
 */
export function calculateAsymmetry(
  stationaryPhase: string,
  compound: Compound
): number {
  // Simple model: polar compounds tail more on reversed-phase
  let asymmetry = 1.0;
  
  if (stationaryPhase.startsWith("C") && compound.logP < 0) {
    asymmetry = 1.1 + Math.abs(compound.logP) * 0.1;
  }
  
  // Ionizable compounds can show tailing
  if (compound.pKa.length > 0) {
    asymmetry += 0.15;
  }
  
  return Number(Math.min(asymmetry, 2.5).toFixed(2));
}

/**
 * Simulate full chromatogram from sample components
 */
export function simulateChromatogram(
  components: SampleComponent[],
  column: ColumnSettings,
  mobilePhase: MobilePhase,
  detector: { wavelength: number; noiseLevel: number },
  flowRate: number,
  runTime: number
): ChromatogramData {
  // Calculate dead volume and time
  const deadVolume = calculateDeadVolume(column);
  const deadTime = calculateDeadTime(deadVolume, flowRate);
  
  // Calculate linear velocity and plate height
  const linearVelocity = calculateLinearVelocity(column.length, deadTime);
  const plateHeight = calculatePlateHeight(column.particleSize, linearVelocity);
  const theoreticalPlates = calculateTheoreticalPlates(column.length, plateHeight);
  
  // Generate time array (data points every 0.01 min)
  const timePoints = Math.floor(runTime / 0.01);
  const time: number[] = [];
  const signal: number[] = [];
  const baseline: number[] = [];
  
  for (let i = 0; i < timePoints; i++) {
    time.push(i * 0.01);
    signal.push(0);
    baseline.push(0);
  }
  
  // Generate peaks for each component
  const peaks: Peak[] = [];
  
  components.forEach((component) => {
    const compound = component.compound;
    
    // Predict retention time
    const retentionTime = predictRetentionTime(
      compound,
      column,
      mobilePhase,
      deadTime
    );
    
    // Skip if elutes after run time
    if (retentionTime > runTime) return;
    
    // Calculate peak properties
    const peakWidth = calculatePeakWidth(retentionTime, theoreticalPlates);
    const sigma = peakWidth / 4;
    
    // Peak height proportional to concentration and UV absorption
    const uvAbs = compound.uvAbsorption.find(
      (abs) => Math.abs(abs.wavelength - detector.wavelength) < 20
    );
    const absorptionFactor = uvAbs ? uvAbs.absorbance : 0.1;
    const peakHeight = component.concentration * absorptionFactor * 100;
    
    // Generate peak shape
    time.forEach((t, i) => {
      const intensity = gaussianPeak(t, retentionTime, sigma, peakHeight);
      signal[i] += intensity;
    });
    
    // Calculate peak area
    const peakArea = peakHeight * sigma * Math.sqrt(2 * Math.PI);
    
    // Calculate asymmetry
    const asymmetry = calculateAsymmetry(column.stationaryPhase, compound);
    
    peaks.push({
      retentionTime,
      height: Number(peakHeight.toFixed(2)),
      area: Number(peakArea.toFixed(2)),
      width: peakWidth,
      asymmetry,
      compoundId: compound.id,
    });
  });
  
  // Sort peaks by retention time
  peaks.sort((a, b) => a.retentionTime - b.retentionTime);
  
  // Calculate resolution between adjacent peaks
  for (let i = 0; i < peaks.length - 1; i++) {
    const resolution = calculateResolution(
      peaks[i].retentionTime,
      peaks[i + 1].retentionTime,
      peaks[i].width,
      peaks[i + 1].width
    );
    peaks[i].resolution = resolution;
  }
  
  // Add detector noise
  signal.forEach((s, i) => {
    const noise = (Math.random() - 0.5) * detector.noiseLevel;
    signal[i] = Number((s + noise).toFixed(3));
  });
  
  return {
    time,
    signal,
    peaks,
    baseline,
  };
}
