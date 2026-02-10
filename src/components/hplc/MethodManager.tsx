import React, { useState } from "react";
import { useHPLCStore } from "~/store/hplcStore";
import { Button, InputText } from "~/components/ui";

export const MethodManager: React.FC = () => {
  const { savedMethods, saveMethod, loadMethod, deleteMethod } = useHPLCStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [methodDescription, setMethodDescription] = useState("");

  const handleSave = () => {
    if (methodName.trim()) {
      saveMethod(methodName, methodDescription);
      setMethodName("");
      setMethodDescription("");
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Saved Methods</h3>
        <Button size="sm" onClick={() => setShowSaveDialog(true)}>
          Save Current
        </Button>
      </div>

      {showSaveDialog && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <InputText
            label="Method Name"
            value={methodName}
            onChange={(e) => setMethodName(e.target.value)}
            placeholder="e.g., Paracetamol Assay"
          />
          <InputText
            label="Description (optional)"
            value={methodDescription}
            onChange={(e) => setMethodDescription(e.target.value)}
            placeholder="Brief description of the method"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {savedMethods.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No saved methods yet
          </p>
        ) : (
          savedMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{method.name}</div>
                {method.description && (
                  <div className="text-xs text-gray-600 mt-1">
                    {method.description}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Created: {new Date(method.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadMethod(method.id)}
                >
                  Load
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm(`Delete method "${method.name}"?`)
                    ) {
                      deleteMethod(method.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
