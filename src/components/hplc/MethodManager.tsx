import React, { useState } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useHPLCStore } from "~/store/hplcStore";
import { Button, InputText } from "~/components/ui";
import { Modal } from "~/components/ui/Modal";

export const MethodManager: React.FC = () => {
  const { savedMethods, saveMethod, loadMethod, deleteMethod } = useHPLCStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [methodDescription, setMethodDescription] = useState("");

  const handleSave = () => {
    if (methodName.trim()) {
      saveMethod(methodName, methodDescription);
      toast.success(`Method "${methodName}" saved successfully`);
      setMethodName("");
      setMethodDescription("");
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (id: string, name: string) => {
    loadMethod(id);
    toast.success(`Method "${name}" loaded`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete method "${name}"?`)) {
      deleteMethod(id);
      toast.success(`Method "${name}" deleted`);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Saved Methods
          </h3>
          <p className="text-xs text-gray-600">
            Store your sample calculation history to reuse later.
          </p>
        </div>
        {savedMethods.length > 0 && (
          <Button size="sm" onClick={() => setShowSaveDialog(true)}>
            Save Current
          </Button>
        )}
      </div>

      <Modal
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        title="Save Method"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Give this setup a name and optional description so you can reuse the calculation later.
          </p>
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
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {savedMethods.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-3">
              <HiOutlineClipboardList size={32} />
            </div>
            <p className="text-base font-medium text-gray-800">
              No saved methods yet
            </p>
            <div className="mt-4">
              <Button size="sm" onClick={() => setShowSaveDialog(true)}>
                <FaPlus className="mr-2" />
                Save Current Method
              </Button>
            </div>
          </div>
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
                  onClick={() => handleLoad(method.id, method.name)}
                >
                  Load
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(method.id, method.name)}
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
