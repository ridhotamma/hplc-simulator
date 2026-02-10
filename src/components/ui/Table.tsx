import React from "react";
import { cn } from "~/lib/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  responsive?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  responsive = true,
  striped = false,
  hover = true,
  compact = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  const table = (
    <table className={cn("w-full", className)}>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                "text-left font-medium text-gray-700",
                compact ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm",
                column.headerClassName
              )}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr
            key={index}
            className={cn(
              striped && index % 2 === 0 && "bg-gray-50",
              hover && "hover:bg-gray-100 transition-colors"
            )}
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className={cn(
                  "text-gray-900",
                  compact ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm",
                  column.className
                )}
              >
                {column.render ? column.render(item, index) : String(item[column.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (responsive) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {table}
      </div>
    );
  }

  return table;
}
