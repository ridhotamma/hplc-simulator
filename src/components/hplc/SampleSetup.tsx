import React, { useState } from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { compoundLibrary } from "~/data/compounds";
import { Button, InputNumber } from "~/components/ui";
import type { SampleComponent } from "~/types/hplc";

export const SampleSetup: React.FC = () => {
  const { sample, updateSample } = useHPLCStore();
  const [selectedCompoundIds, setSelectedCompoundIds] = useState<Set<string>>(
    new Set(sample?.components.map((c) => c.compound.id) || []),
  );
  const [concentrations, setConcentrations] = useState<Map<string, number>>(
    new Map(
      sample?.components.map((c) => [c.compound.id, c.concentration]) || [],
    ),
  );

  const toggleCompound = (compoundId: string) => {
    const newSelected = new Set(selectedCompoundIds);
    if (newSelected.has(compoundId)) {
      newSelected.delete(compoundId);
      const newConcentrations = new Map(concentrations);
      newConcentrations.delete(compoundId);
      setConcentrations(newConcentrations);
    } else {
      newSelected.add(compoundId);
      setConcentrations(new Map(concentrations.set(compoundId, 1.0)));
    }
    setSelectedCompoundIds(newSelected);
  };

  const updateConcentration = (compoundId: string, concentration: number) => {
    setConcentrations(new Map(concentrations.set(compoundId, concentration)));
  };

  const applySample = () => {
    const components: SampleComponent[] = Array.from(selectedCompoundIds).map(
      (id) => {
        const compound = compoundLibrary.find((c) => c.id === id)!;
        return {
          compound,
          concentration: concentrations.get(id) || 1.0,
        };
      },
    );

    updateSample({
      id: `sample-${Date.now()}`,
      name: "Custom Sample",
      components,
    });
  };

  const categories = Array.from(
    new Set(compoundLibrary.map((c) => c.category)),
  );

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Sample Composition
        </h3>
        <Button
          size="sm"
          onClick={applySample}
          disabled={selectedCompoundIds.size === 0}
          className="w-full sm:w-auto"
        >
          Apply Sample
        </Button>
      </div>

      {selectedCompoundIds.size > 0 && (
        <div className="bg-blue-50 p-2 sm:p-3 rounded-md border border-blue-200">
          <div className="text-xs sm:text-sm font-medium text-blue-900 mb-2">
            Selected: {selectedCompoundIds.size} compound(s)
          </div>
          <div className="space-y-2">
            {Array.from(selectedCompoundIds).map((id) => {
              const compound = compoundLibrary.find((c) => c.id === id);
              if (!compound) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                >
                  <span
                    className="flex-1 text-gray-700 truncate"
                    title={compound.name}
                  >
                    {compound.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <InputNumber
                      value={concentrations.get(id) || 1.0}
                      onChange={(e) =>
                        updateConcentration(
                          id,
                          parseFloat(e.target.value) || 1.0,
                        )
                      }
                      min={0.1}
                      max={100}
                      allowDecimal
                      allowNegative={false}
                      size="md"
                      className="w-16 sm:w-20"
                    />
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      mg/mL
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
        {categories.map((category) => {
          const compounds = compoundLibrary.filter(
            (c) => c.category === category,
          );
          return (
            <div key={category}>
              <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 capitalize">
                {category}
              </div>
              <div className="space-y-1">
                {compounds.map((compound) => (
                  <label
                    key={compound.id}
                    className="flex items-start gap-2 sm:gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer active:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompoundIds.has(compound.id)}
                      onChange={() => toggleCompound(compound.id)}
                      className="mt-0.5 sm:mt-1 w-4 h-4 accent-blue-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {compound.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        MW: {compound.molecularWeight} | LogP: {compound.logP} |
                        pKa:{" "}
                        {compound.pKa.length > 0
                          ? compound.pKa.join(", ")
                          : "N/A"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
