import { HiChartBar } from "react-icons/hi";
import { useHPLCStore } from "~/store/hplcStore";
import { ChromatogramChart } from "~/components/chart/ChromatogramChart";
import { Table, type TableColumn } from "~/components/ui";
import type { Peak } from "~/types/hplc";

export const ResultPage = () => {
  const { sample, detector, chromatogramData } = useHPLCStore();

  const peakTableColumns: TableColumn<Peak & { index: number }>[] = [
    {
      key: "index",
      header: "Peak",
      render: (item) => item.index + 1,
      className: "font-medium text-gray-900",
    },
    {
      key: "retentionTime",
      header: "RT (min)",
      render: (item) => item.retentionTime.toFixed(3),
      className: "text-gray-700",
      headerClassName: "whitespace-nowrap",
    },
    {
      key: "height",
      header: "Height",
      render: (item) => item.height.toFixed(2),
      className: "text-gray-700",
    },
    {
      key: "area",
      header: "Area",
      render: (item) => item.area.toFixed(2),
      className: "text-gray-700",
    },
    {
      key: "width",
      header: "Width",
      render: (item) => item.width.toFixed(3),
      className: "text-gray-700",
    },
    {
      key: "asymmetry",
      header: "Asym.",
      render: (item) => item.asymmetry.toFixed(2),
      className: "text-gray-700",
      headerClassName: "whitespace-nowrap",
    },
    {
      key: "resolution",
      header: "Rs",
      render: (item) => (item.resolution ? item.resolution.toFixed(2) : "—"),
      className: "text-gray-700",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Chromatogram</h2>
        {sample && (
          <p className="text-xs text-gray-600 mt-1">
            Sample: {sample.components.length} compound(s) | {detector.type} Detector @ {detector.wavelength} nm
          </p>
        )}
      </div>

      {chromatogramData ? (
        <>
          <div className="overflow-x-auto -mx-3 px-3">
            <ChromatogramChart data={chromatogramData} height={300} width={Math.max(window.innerWidth * 1.5, 600)} />
          </div>

          {chromatogramData.peaks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Peak Analysis</h3>
              <Table
                data={chromatogramData.peaks.map((peak, index) => ({ ...peak, index }))}
                columns={peakTableColumns}
                compact
                hover
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center px-4">
            <HiChartBar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-base font-medium">No chromatogram data</p>
            <p className="text-xs mt-1">Select compounds and run simulation to see results</p>
          </div>
        </div>
      )}
    </div>
  );
};
