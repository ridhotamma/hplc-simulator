# HPLC Simulator

An interactive single-page app to explore HPLC method setup and visualize simulated chromatograms. Built with React + TypeScript + Vite.

## What it simulates

- Pump, column, detector, mobile phase (isocratic or gradient), and sample composition
- Gradient programming with delay volume and re-equilibration considerations
- Chromatogram generation with peaks, areas, widths, asymmetry, and resolution
- Pressure estimate as a safety indicator

## How calculations work (plain language)

- **Void/dead volume**: From column length, inner diameter, and a typical porosity (40%).
- **Dead time (t₀)**: Void volume ÷ flow rate.
- **Linear velocity**: Column length ÷ t₀.
- **Plate height & efficiency**: Van Deemter-style curve using particle size and linear velocity; plates = length ÷ plate height (floored to at least 1).
- **Pressure**: Kozeny-Carman/Darcy approximation using flow, column dimensions, particle size, and viscosity; capped for display.
- **Gradient composition**: Point-by-point %B from the programmed steps, with gradient delay volume considered.
- **Retention time**:
  - Isocratic: Linear Solvent Strength (LSS) model using logP-derived logKw, solvent strength S, %B, pH effect, and temperature factor.
  - Gradient: Iterative, time-sliced LSS using the live %B from the gradient profile until convergence, with pH and temperature effects.
- **Peak shape**: Gaussian with width from plates plus extra-column broadening (injection volume scaled by flow).
- **Peak metrics**: Height (concentration × UV absorbance factor), area, asymmetry (simple tailing model), and resolution between neighbors.
- **Noise**: Adds random baseline noise from detector settings.

## Using the app

1. **Pick compounds** in Sample Composition, set concentrations, and apply.
2. **Configure settings** under Pump, Column, Detector, and Mobile Phase. Use gradient presets or add your own steps.
3. **Run** (auto-runs on changes) to see the chromatogram and peak table.
4. **Save/load methods** via Methods tab.

## Key assumptions and limits

- Models are educational approximations, not instrument-specific predictions.
- Viscosity is fixed at ~1 mPa·s (water/ACN at 25 °C).
- pH effects are simplified to the first pKa.
- Detector response is wavelength-matched UV only; no absolute quantitation.
- Pressure is an estimate for trend/safety awareness, not a guarantee.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech stack

- React, TypeScript, Vite
- Zustand for state
- D3 for charts
- Tailwind classes for styling
