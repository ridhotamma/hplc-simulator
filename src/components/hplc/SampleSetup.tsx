import React, { useState } from "react";
import { FaSliders } from "react-icons/fa6";
import { useHPLCStore } from "~/store/hplcStore";
import { compoundLibrary } from "~/data/compounds";
import { Button, InputNumber, Modal } from "~/components/ui";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter compounds based on search query
  const filteredCompounds = compoundLibrary.filter((compound) =>
    compound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    compound.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      {/* Desktop: Title and Button at Top */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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

      {/* Mobile: Title Only */}
      <div className="sm:hidden">
        <h3 className="text-lg font-semibold text-gray-800">
          Sample Composition
        </h3>
      </div>

      {/* Mobile: Search Input First */}
      {isMobile && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search compounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Desktop: Show Selected Compounds */}
      {!isMobile && selectedCompoundIds.size > 0 && (
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

      {/* Compound List */}
      <div className={`space-y-3 overflow-y-auto ${isMobile ? 'flex-1' : 'max-h-64 sm:max-h-96'}`}>
        {isMobile ? (
          // Mobile: Flat list filtered by search
          <div className="space-y-1">
            {filteredCompounds.length > 0 ? (
              filteredCompounds.map((compound) => (
                <label
                  key={compound.id}
                  className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer active:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedCompoundIds.has(compound.id)}
                    onChange={() => toggleCompound(compound.id)}
                    className="mt-1 w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {compound.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {compound.category} • MW: {compound.molecularWeight}
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No compounds found
              </div>
            )}
          </div>
        ) : (
          // Desktop: Grouped by category
          categories.map((category) => {
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
          })
        )}
      </div>

      {/* Mobile: Sticky Footer with Buttons */}
      {isMobile && (
        <div className="sticky bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 -mx-3 -mb-3 shadow-lg">
          <Button
            size="sm"
            onClick={applySample}
            disabled={selectedCompoundIds.size === 0}
            className="flex-1"
          >
            Apply Sample
          </Button>
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              disabled={selectedCompoundIds.size === 0}
              className="px-3"
            >
              <FaSliders size={16} />
            </Button>
            {selectedCompoundIds.size > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                {selectedCompoundIds.size}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Selected Samples Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Selected Compounds (${selectedCompoundIds.size})`}
        size="md"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from(selectedCompoundIds).map((id) => {
            const compound = compoundLibrary.find((c) => c.id === id);
            if (!compound) return null;
            return (
              <div
                key={id}
                className="p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {compound.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {compound.category} • MW: {compound.molecularWeight}
                    </div>
                  </div>
                </div>
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
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    mg/mL
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button
            onClick={() => setIsModalOpen(false)}
            className="w-full"
            size="sm"
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};
