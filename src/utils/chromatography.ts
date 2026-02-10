import type {
  ColumnSettings,
  MobilePhase,
  Compound,
  Peak,
  ChromatogramData,
  SampleComponent,
} from "~/types/hplc";

/**
 * Calculate mobile phase composition at a given time for gradient elution
 * Returns the % B at the specified time
 */
export function calculateGradientComposition(
  mobilePhase: MobilePhase,
  time: number
): number {
  if (mobilePhase.mode === "isocratic" || !mobilePhase.gradientSteps || mobilePhase.gradientSteps.length === 0) {
    return mobilePhase.percentB;
  }

  const steps = [...mobilePhase.gradientSteps].sort((a, b) => a.time - b.time);
  const effectiveFlow = Math.max(mobilePhase.flowRate, 0.01);
  
  // Account for gradient delay volume
  const delayTime = mobilePhase.gradientDelayVolume
    ? mobilePhase.gradientDelayVolume / effectiveFlow
    : 0;
  const adjustedTime = time - delayTime;
  
  if (adjustedTime <= 0) {
    return mobilePhase.percentB; // Initial composition during delay
  }

  // Find the relevant gradient segment
  let prevPercentB = mobilePhase.percentB;
  let prevTime = 0;
  
  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    
    if (adjustedTime <= currentStep.time) {
      // Interpolate between previous and current step
      if (currentStep.type === "step") {
        // Step change - return previous value until exactly at step time
        return adjustedTime < currentStep.time ? prevPercentB : currentStep.percentB;
      } else if (currentStep.type === "linear") {
        // Linear interpolation
        const timeDiff = currentStep.time - prevTime;
        const percentDiff = currentStep.percentB - prevPercentB;
        const fraction = (adjustedTime - prevTime) / timeDiff;
        return prevPercentB + fraction * percentDiff;
      } else if (currentStep.type === "curve") {
        // Curved gradient (simplified as exponential)
        const timeDiff = currentStep.time - prevTime;
        const percentDiff = currentStep.percentB - prevPercentB;
        const fraction = (adjustedTime - prevTime) / timeDiff;
        const curvedFraction = Math.pow(fraction, 1.5); // Exponential curve
        return prevPercentB + curvedFraction * percentDiff;
      }
    }
    
    prevPercentB = currentStep.percentB;
    prevTime = currentStep.time;
  }
  
  // After last step, maintain final composition
  return prevPercentB;
}

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
  const effectiveFlow = Math.max(flowRate, 0.01);
  return Number((deadVolume / effectiveFlow).toFixed(3));
}

/**
 * Van Deemter equation: H = A + B/u + C*u
 * H = plate height (μm)
 * u = linear velocity (mm/min)
 * A = eddy diffusion (multiple flow paths)
 * B = longitudinal diffusion
 * C = mass transfer resistance
 */
export function calculatePlateHeight(
  particleSize: number,
  linearVelocity: number
): number {
  // Empirical coefficients based on particle size
  const A = 2 * particleSize; // Eddy diffusion (typically 1-2 × dp)
  const B = 20; // Longitudinal diffusion coefficient (μm²/min)
  const C = 0.01 * particleSize; // Mass transfer coefficient
  
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
 * Calculate pump pressure using empirical HPLC equation
 * Based on Darcy's law and Kozeny-Carman equation
 * ΔP ≈ (φ × η × u × L) / dp²
 * where:
 * - ΔP = pressure drop (bar)
 * - φ = flow resistance parameter (~1000 for packed columns)
 * - η = viscosity (mPa·s, ~1 for water/ACN mixtures)
 * - u = linear velocity (mm/s)
 * - L = column length (mm)
 * - dp = particle size (μm)
 */
export function calculatePumpPressure(
  flowRate: number,
  columnLength: number,
  columnDiameter: number,
  particleSize: number
): number {
  // Physically grounded Kozeny-Carman / Darcy approximation
  const viscosityPaS = 0.001; // 1 mPa·s typical for water/ACN at 25 °C
  const epsilon = 0.4; // bed porosity
  const kcFactor = (180 * Math.pow(1 - epsilon, 2)) / Math.pow(epsilon, 3);

  // Unit conversions
  const flowM3s = (flowRate * 1e-6) / 60; // m^3/s
  const lengthM = columnLength / 1000; // mm -> m
  const diameterM = columnDiameter / 1000; // mm -> m
  const particleM = particleSize * 1e-6; // μm -> m

  // Interstitial velocity
  const area = Math.PI * Math.pow(diameterM / 2, 2);
  const velocity = flowM3s / area; // m/s

  // Pressure drop (Pa) then convert to bar
  const deltaP_Pa = kcFactor * viscosityPaS * lengthM * velocity / Math.pow(particleM, 2);
  const deltaP_bar = deltaP_Pa / 1e5;

  // Cap at 1000 bar for safety display
  return Number(Math.min(deltaP_bar, 1000).toFixed(1));
}

/**
 * Calculate theoretical plates (column efficiency)
 * N = L / H
 */
export function calculateTheoreticalPlates(
  columnLength: number,
  plateHeight: number
): number {
  const plates = columnLength / plateHeight;
  return Math.max(1, Math.floor(plates));
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
 * 
 * For gradient elution, uses simplified gradient retention equation
 */
export function predictRetentionTime(
  compound: Compound,
  column: ColumnSettings,
  mobilePhase: MobilePhase,
  deadTime: number
): number {
  // Base retention (log k'w) correlates with hydrophobicity (logP)
  const logKw = 0.5 * compound.logP + 0.5;
  
  // Solvent strength parameter
  const S = 4.0; // Typical S value for small molecules
  
  // Temperature effect (higher T = faster elution)
  const tempFactor = 1 - (column.temperature - 25) * 0.02;
  
  if (mobilePhase.mode === "gradient" && mobilePhase.gradientSteps && mobilePhase.gradientSteps.length > 0) {
    const retentionTime = estimateGradientRetentionTime(
      compound,
      logKw,
      S,
      mobilePhase,
      deadTime,
      tempFactor
    );
    return Number(retentionTime.toFixed(3));
  } else {
    // Isocratic elution
    const phi = mobilePhase.percentB / 100;
    
    // Calculate retention factor
    const logK = logKw - S * phi;
    const k = Math.pow(10, logK);
    
    // Retention time: tR = t0 * (1 + k')
    let retentionTime = deadTime * (1 + k);
    
    // pH effect on ionizable compounds
    if (compound.pKa.length > 0) {
      const pKa = compound.pKa[0];
      const pH = mobilePhase.pH;
      
      // Henderson-Hasselbalch equation
      let ionizationFactor: number;
      if (compound.logP > 0) {
        // Acidic compound
        ionizationFactor = 1 / (1 + Math.pow(10, pKa - pH));
      } else {
        // Basic compound  
        ionizationFactor = 1 / (1 + Math.pow(10, pH - pKa));
      }
      retentionTime *= (1 - 0.5 * ionizationFactor); // Ionized form elutes faster
    }
    
    retentionTime *= Math.max(0.5, tempFactor);
    return Number(retentionTime.toFixed(3));
  }
}

// Iteratively estimate gradient retention time by sampling the programmed profile
function estimateGradientRetentionTime(
  compound: Compound,
  logKw: number,
  solventStrength: number,
  mobilePhase: MobilePhase,
  deadTime: number,
  tempFactor: number
): number {
  const dt = 0.01; // minutes
  const maxIterations = 10;

  // pH-dependent adjustment applied to k at each time slice
  let ionizationScale = 1;
  if (compound.pKa.length > 0) {
    const pKa = compound.pKa[0];
    const pH = mobilePhase.pH;
    if (compound.logP > 0) {
      // Acidic
      ionizationScale = 1 - 0.4 * (1 / (1 + Math.pow(10, pKa - pH)));
    } else {
      // Basic
      ionizationScale = 1 - 0.4 * (1 / (1 + Math.pow(10, pH - pKa)));
    }
  }

  let tR = deadTime * (1 + Math.pow(10, logKw - solventStrength * (mobilePhase.percentB / 100)));

  for (let iter = 0; iter < maxIterations; iter++) {
    let totalK = 0;
    let steps = 0;

    for (let t = 0; t <= tR; t += dt) {
      const phi = calculateGradientComposition(mobilePhase, t) / 100;
      const k = Math.pow(10, logKw - solventStrength * phi) * ionizationScale;
      totalK += k;
      steps += 1;
    }

    const kAvg = steps > 0 ? totalK / steps : 0;
    const newTR = deadTime * (1 + kAvg);

    if (Math.abs(newTR - tR) < 0.001) {
      tR = newTR;
      break;
    }
    tR = newTR;
  }

  // Apply temperature scaling (min 50% to avoid negative times)
  return Math.max(deadTime, tR * Math.max(0.5, tempFactor));
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
 * Includes extra-column band broadening
 */
export function calculatePeakWidth(
  retentionTime: number,
  theoreticalPlates: number,
  injectionVolume: number = 10,
  flowRate: number = 1
): number {
  // Column contribution: σ_col² = tR² / N
  const sigmaCol = retentionTime / Math.sqrt(theoreticalPlates);
  
  // Extra-column band broadening (injection, tubing, detector)
  // Convert injection volume to a time-domain variance using flow rate (t = V/F)
  const extraTime = (injectionVolume / 1000) / Math.max(flowRate, 0.01); // minutes
  const extraColumnVariance = Math.pow(extraTime, 2);
  
  // Total variance: σ_total² = σ_col² + σ_extra²
  const sigmaTotalSquared = Math.pow(sigmaCol, 2) + extraColumnVariance;
  const sigmaTotal = Math.sqrt(sigmaTotalSquared);
  
  // Peak width at base: w = 4σ
  const width = 4 * sigmaTotal;
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
  runTime: number,
  injectionVolume: number = 10
): ChromatogramData {
  // Calculate dead volume and time
  const deadVolume = calculateDeadVolume(column);
  const deadTime = calculateDeadTime(deadVolume, flowRate);
  
  // Calculate linear velocity and plate height
  const linearVelocity = calculateLinearVelocity(column.length, deadTime);
  const plateHeight = calculatePlateHeight(column.particleSize, linearVelocity);
  const theoreticalPlates = calculateTheoreticalPlates(column.length, plateHeight);
  
  // Generate time array (data points every 0.01 min)
  const timePoints = Math.floor(runTime / 0.01) + 1;
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
    const peakWidth = calculatePeakWidth(retentionTime, theoreticalPlates, injectionVolume, flowRate);
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
