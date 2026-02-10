import React, { useState } from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { Button, InputNumber, Select, Table, type TableColumn } from "~/components/ui";
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

  const tableColumns: TableColumn<GradientStep & { index: number }>[] = [
    {
      key: "time",
      header: "Time (min)",
      render: (item) => item.time.toFixed(1),
      className: "whitespace-nowrap",
    },
    {
      key: "percentB",
      header: "% B",
      render: (item) => item.percentB.toFixed(1),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => <span className="capitalize">{item.type}</span>,
    },
    {
      key: "action",
      header: "Action",
      render: (item) => (
        <Button
          size="xs"
          variant="destructive"
          onClick={() => removeStep(item.index)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const tableData = steps.map((step, index) => ({ ...step, index }));

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gradient Programming</h3>
        {steps.length > 0 && (
          <Button onClick={clearAll} size="xs" variant="outline">
            Clear All
          </Button>
        )}
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() => createPreset("linear")}
        >
          Linear
        </Button>
        <Button
          size="xs"
          variant="outline"
          onClick={() => createPreset("fast")}
        >
          Fast
        </Button>
        <Button
          size="xs"
          variant="outline"
          onClick={() => createPreset("shallow")}
        >
          Shallow
        </Button>
      </div>

      {/* Gradient Profile */}
      {steps.length > 0 && (
        <div className="bg-gray-50 rounded border border-gray-200 p-3">
          <div className="h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={generateGradientProfile(mobilePhase.percentB, steps)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0 min</span>
            <span>{Math.max(...steps.map(s => s.time)).toFixed(1)} min</span>
          </div>
        </div>
      )}

      {/* Steps Table */}
      {steps.length > 0 && (
        <div className="overflow-x-auto">
          <Table
            data={tableData}
            columns={tableColumns}
            compact
          />
        </div>
      )}

      {/* Add Step Form */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <InputNumber
            label="Time (min)"
            value={newStep.time ?? 0}
            onChange={(e) => setNewStep({ ...newStep, time: parseFloat(e.target.value) || 0 })}
            allowDecimal
            allowNegative={false}
            size="sm"
          />
          <InputNumber
            label="% B"
            value={newStep.percentB ?? 50}
            onChange={(e) => setNewStep({ ...newStep, percentB: parseFloat(e.target.value) || 50 })}
            allowDecimal
            allowNegative={false}
            size="sm"
          />
          <Select
            label="Type"
            value={newStep.type || "linear"}
            onChange={(e) => setNewStep({ ...newStep, type: e.target.value as GradientStepType })}
            options={[
              { value: "linear", label: "Linear" },
              { value: "step", label: "Step" },
              { value: "curve", label: "Curve" },
            ]}
            size="sm"
          />
          <div className="flex items-end">
            <Button onClick={addStep} size="sm" className="w-full">
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* System Parameters */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          System Parameters
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <InputNumber
            label="Delay Volume (mL)"
            value={mobilePhase.gradientDelayVolume ?? 1.0}
            onChange={(e) =>
              updateMobilePhase({
                ...mobilePhase,
                gradientDelayVolume: parseFloat(e.target.value) || 1.0,
              })
            }
            allowDecimal
            allowNegative={false}
          />
          <InputNumber
            label="Re-equilibration (min)"
            value={mobilePhase.reEquilibrationTime ?? 5}
            onChange={(e) =>
              updateMobilePhase({
                ...mobilePhase,
                reEquilibrationTime: parseFloat(e.target.value) || 5,
              })
            }
            allowDecimal
            allowNegative={false}
          />
        </div>
      </details>
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
