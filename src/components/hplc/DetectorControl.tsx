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
      </div>
      
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
        </>
      )}
      
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
