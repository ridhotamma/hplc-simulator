import React from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { InputNumber } from "~/components/ui";
import type { DetectorType } from "~/types/hplc";

const detectorTypes: { value: DetectorType; label: string }[] = [
  { value: "UV", label: "UV-Vis" },
  { value: "PDA", label: "PDA (Photodiode Array)" },
  { value: "Fluorescence", label: "Fluorescence" },
  { value: "RI", label: "Refractive Index" },
  { value: "ELSD", label: "ELSD" },
  { value: "MS", label: "Mass Spectrometry" },
];

export const DetectorControl: React.FC = () => {
  const { detector, updateDetector } = useHPLCStore();

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Detector Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Detector Type
        </label>
        <select
          value={detector.type}
          onChange={(e) =>
            updateDetector({ type: e.target.value as DetectorType })
          }
          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {detectorTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-gray-500">
          {getDetectorDescription(detector.type)}
        </p>
      </div>
      
      {/* UV and PDA detectors */}
      {(detector.type === "UV" || detector.type === "PDA") && (
        <>
          <InputNumber
            label="Wavelength (nm)"
            value={detector.wavelength}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 190 && value <= 800) {
                updateDetector({ wavelength: value });
              }
            }}
            min={190}
            max={800}
            step={1}
            helperText="Range: 190 - 800 nm"
            allowDecimal={false}
          />
          
          <InputNumber
            label="Bandwidth (nm)"
            value={detector.bandwidth}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 1 && value <= 10) {
                updateDetector({ bandwidth: value });
              }
            }}
            min={1}
            max={10}
            step={1}
            helperText="Range: 1 - 10 nm"
            allowDecimal={false}
          />

          {detector.type === "PDA" && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">PDA Settings</h4>
              <div className="grid grid-cols-2 gap-3">
                <InputNumber
                  label="Start λ (nm)"
                  value={detector.wavelengthRange?.start || 190}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      updateDetector({
                        wavelengthRange: {
                          start: value,
                          end: detector.wavelengthRange?.end || 800,
                        },
                      });
                    }
                  }}
                  allowDecimal={false}
                />
                <InputNumber
                  label="End λ (nm)"
                  value={detector.wavelengthRange?.end || 800}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      updateDetector({
                        wavelengthRange: {
                          start: detector.wavelengthRange?.start || 190,
                          end: value,
                        },
                      });
                    }
                  }}
                  allowDecimal={false}
                />
              </div>
              <p className="text-xs text-blue-700 mt-2">3D spectra: Time × Wavelength × Absorbance</p>
            </div>
          )}
        </>
      )}

      {/* Fluorescence detector */}
      {detector.type === "Fluorescence" && (
        <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Fluorescence Settings</h4>
          <div className="space-y-3">
            <InputNumber
              label="Excitation Wavelength (nm)"
              value={detector.excitationWavelength || 280}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  updateDetector({ excitationWavelength: value });
                }
              }}
              helperText="Range: 200 - 700 nm"
              allowDecimal={false}
            />
            <InputNumber
              label="Emission Wavelength (nm)"
              value={detector.emissionWavelength || 350}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  updateDetector({ emissionWavelength: value });
                }
              }}
              helperText="Range: 250 - 800 nm"
              allowDecimal={false}
            />
          </div>
        </div>
      )}

      {/* MS detector */}
      {detector.type === "MS" && (
        <div className="p-3 bg-green-50 rounded-md border border-green-200">
          <h4 className="text-sm font-medium text-green-900 mb-2">Mass Spectrometry Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <InputNumber
              label="Mass Range Start (m/z)"
              value={detector.massRange?.start || 50}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  updateDetector({
                    massRange: {
                      start: value,
                      end: detector.massRange?.end || 2000,
                    },
                  });
                }
              }}
              allowDecimal={false}
            />
            <InputNumber
              label="Mass Range End (m/z)"
              value={detector.massRange?.end || 2000}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  updateDetector({
                    massRange: {
                      start: detector.massRange?.start || 50,
                      end: value,
                    },
                  });
                }
              }}
              allowDecimal={false}
            />
          </div>
        </div>
      )}

      {/* RI and ELSD detectors */}
      {(detector.type === "RI" || detector.type === "ELSD") && (
        <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-900">
            {detector.type === "RI" 
              ? "RI detectors measure refractive index changes (universal, non-specific)"
              : "ELSD is a universal detector based on light scattering (evaporative)"}
          </p>
        </div>
      )}
      
      <InputNumber
        label="Sampling Rate (Hz)"
        value={detector.samplingRate}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 1 && value <= 100) {
            updateDetector({ samplingRate: value });
          }
        }}
        min={1}
        max={100}
        step={1}
        helperText="Data acquisition frequency"
        allowDecimal={false}
      />

      <InputNumber
        label="Noise Level"
        value={detector.noiseLevel}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 0 && value <= 10) {
            updateDetector({ noiseLevel: value });
          }
        }}
        min={0}
        max={10}
        step={0.1}
        helperText="Detector baseline noise (0 = none)"
        allowDecimal
      />
    </div>
  );
};

// Helper function for detector descriptions
function getDetectorDescription(type: DetectorType): string {
  const descriptions: Record<DetectorType, string> = {
    UV: "Measures UV absorption at a single wavelength",
    PDA: "Captures full UV-Vis spectrum at each time point (3D data)",
    Fluorescence: "Detects fluorescence emission (high sensitivity)",
    RI: "Universal detector based on refractive index (not gradient compatible)",
    ELSD: "Universal detector via light scattering (mass-sensitive)",
    MS: "Mass spectrometry detection (molecular weight confirmation)",
  };
  return descriptions[type];
}
