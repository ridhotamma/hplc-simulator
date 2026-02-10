import { cn } from "~/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn("flex border-b border-gray-200 overflow-x-auto", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === tab.id
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
