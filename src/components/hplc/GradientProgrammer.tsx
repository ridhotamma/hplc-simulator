import React, { useState } from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { Button, InputNumber } from "~/components/ui";
import type { GradientStep, GradientStepType } from "~/types/hplc";

export const GradientProgrammer: React.FC = () => {
  const { mobilePhase, updateMobilePhase } = useHPLCStore();
  const [newStep, setNewStep] = useState<Partial<GradientStep>>({
    time: 0,
    percentB: 50,
    type: "linear",
  });

  const steps = mobilePhase.gradientSteps || [];

  const addStep = () => {
    if (newStep.time !== undefined && newStep.percentB !== undefined && newStep.type) {
      const updatedSteps = [...steps, newStep as GradientStep].sort((a, b) => a.time - b.time);
      updateMobilePhase({
        ...mobilePhase,
        gradientSteps: updatedSteps,
      });
      setNewStep({ time: 0, percentB: 50, type: "linear" });
    }
  };

  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    updateMobilePhase({
      ...mobilePhase,
      gradientSteps: updatedSteps,
    });
  };

  const clearAll = () => {
    updateMobilePhase({
      ...mobilePhase,
      gradientSteps: [],
    });
  };

  const createPreset = (presetType: "linear" | "fast" | "shallow") => {
    let presetSteps: GradientStep[] = [];
    
    switch (presetType) {
      case "linear":
        presetSteps = [
          { time: 0, percentB: 5, type: "linear" },
          { time: 20, percentB: 95, type: "linear" },
          { time: 22, percentB: 95, type: "step" },
          { time: 22.1, percentB: 5, type: "step" },
        ];
        break;
      case "fast":
        presetSteps = [
          { time: 0, percentB: 20, type: "linear" },
          { time: 8, percentB: 80, type: "linear" },
          { time: 10, percentB: 80, type: "step" },
          { time: 10.1, percentB: 20, type: "step" },
        ];
        break;
      case "shallow":
        presetSteps = [
          { time: 0, percentB: 40, type: "linear" },
          { time: 5, percentB: 50, type: "linear" },
          { time: 15, percentB: 60, type: "linear" },
          { time: 25, percentB: 70, type: "linear" },
          { time: 27, percentB: 70, type: "step" },
          { time: 27.1, percentB: 40, type: "step" },
        ];
        break;
    }
    
    updateMobilePhase({
      ...mobilePhase,
      gradientSteps: presetSteps,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Gradient Programming</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => createPreset("linear")}
          >
            Linear
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => createPreset("fast")}
          >
            Fast
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => createPreset("shallow")}
          >
            Shallow
          </Button>
        </div>
      </div>

      {/* Gradient Steps Table */}
      {steps.length > 0 && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Time (min)</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">% B</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {steps.map((step, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{step.time.toFixed(1)}</td>
                  <td className="px-3 py-2">{step.percentB.toFixed(1)}</td>
                  <td className="px-3 py-2 capitalize">{step.type}</td>
                  <td className="px-3 py-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeStep(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Step */}
      <div className="p-3 bg-gray-50 rounded-md space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Add Gradient Step</h4>
        <div className="grid grid-cols-3 gap-3">
          <InputNumber
            label="Time (min)"
            value={newStep.time ?? 0}
            onChange={(e) => setNewStep({ ...newStep, time: parseFloat(e.target.value) || 0 })}
            allowDecimal
            allowNegative={false}
          />
          <InputNumber
            label="% B"
            value={newStep.percentB ?? 50}
            onChange={(e) => setNewStep({ ...newStep, percentB: parseFloat(e.target.value) || 50 })}
            allowDecimal
            allowNegative={false}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type
            </label>
            <select
              value={newStep.type || "linear"}
              onChange={(e) => setNewStep({ ...newStep, type: e.target.value as GradientStepType })}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="linear">Linear</option>
              <option value="step">Step</option>
              <option value="curve">Curve</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={addStep} size="sm">
            Add Step
          </Button>
          {steps.length > 0 && (
            <Button onClick={clearAll} size="sm" variant="destructive">
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* System Parameters */}
      <div className="grid grid-cols-2 gap-4">
        <InputNumber
          label="Gradient Delay Volume (mL)"
          value={mobilePhase.gradientDelayVolume ?? 1.0}
          onChange={(e) =>
            updateMobilePhase({
              ...mobilePhase,
              gradientDelayVolume: parseFloat(e.target.value) || 1.0,
            })
          }
          helperText="System dead volume before column"
          allowDecimal
          allowNegative={false}
        />
        <InputNumber
          label="Re-equilibration Time (min)"
          value={mobilePhase.reEquilibrationTime ?? 5}
          onChange={(e) =>
            updateMobilePhase({
              ...mobilePhase,
              reEquilibrationTime: parseFloat(e.target.value) || 5,
            })
          }
          helperText="Time to re-equilibrate column"
          allowDecimal
          allowNegative={false}
        />
      </div>

      {/* Gradient Profile Visualization */}
      {steps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Gradient Profile Preview</h4>
          <div className="h-32 bg-linear-to-r from-blue-100 to-blue-600 rounded-md relative overflow-hidden">
            <svg className="w-full h-full">
              <polyline
                points={generateGradientProfile(mobilePhase.percentB, steps)}
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate SVG points for gradient profile
function generateGradientProfile(initialPercent: number, steps: GradientStep[]): string {
  if (steps.length === 0) return "";
  
  const maxTime = Math.max(...steps.map(s => s.time), 30);
  const width = 100; // percentage
  const height = 100; // percentage
  
  const points: string[] = [];
  
  // Start point
  points.push(`0,${height - initialPercent}`);
  
  // Add all steps
  let currentPercent = initialPercent;
  for (const step of steps) {
    const x = (step.time / maxTime) * width;
    const y = height - step.percentB;
    
    if (step.type === "step") {
      // Add intermediate point for step
      points.push(`${x},${height - currentPercent}`);
    }
    
    points.push(`${x},${y}`);
    currentPercent = step.percentB;
  }
  
  // End point
  points.push(`${width},${height - currentPercent}`);
  
  return points.join(" ");
}
