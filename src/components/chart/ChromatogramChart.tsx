import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { cn } from "~/lib/utils";
import type { ChromatogramData } from "~/types/hplc";

export interface ChromatogramChartProps {
  data: ChromatogramData;
  width?: number;
  height?: number;
  className?: string;
}

export const ChromatogramChart: React.FC<ChromatogramChartProps> = ({
  data,
  width,
  height = 400,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPeak, setHoveredPeak] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(width || 800);

  // Handle responsive width
  useEffect(() => {
    if (!containerRef.current || width) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [width]);

  useEffect(() => {
    if (!svgRef.current || !data || data.time.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const effectiveWidth = width || containerWidth;
    const innerWidth = effectiveWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", effectiveWidth)
      .attr("height", height);

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate optimal x-axis range based on data
    const maxTime = d3.max(data.time) || 20;
    
    // If we have peaks, focus on the range that includes them with some padding
    let xMin = 0;
    let xMax = maxTime;
    
    if (data.peaks.length > 0) {
      const lastPeakTime = Math.max(...data.peaks.map(p => p.retentionTime));
      const firstPeakTime = Math.min(...data.peaks.map(p => p.retentionTime));
      const peakRange = lastPeakTime - firstPeakTime;
      
      // Add 10% padding on each side
      const padding = Math.max(peakRange * 0.1, 0.5);
      xMin = Math.max(0, firstPeakTime - padding);
      xMax = lastPeakTime + padding;
      
      // Ensure we show at least a reasonable time range
      if (xMax - xMin < 2) {
        xMax = xMin + 2;
      }
    }

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth]);

    const maxSignal = d3.max(data.signal) || 100;
    const minSignal = d3.min(data.signal) || 0;
    
    // Add some padding to y-axis (5% on top, keep 0 at bottom)
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(0, minSignal), maxSignal * 1.05])
      .range([innerHeight, 0]);

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );

    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      );

    // Create line generator
    const line = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Prepare data for line
    const lineData: [number, number][] = data.time.map((t, i) => [
      t,
      data.signal[i],
    ]);

    // Add the chromatogram line
    g.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Add peak markers and labels
    data.peaks.forEach((peak, idx) => {
      const x = xScale(peak.retentionTime);
      
      // Find the actual signal value at the retention time
      const closestIndex = data.time.findIndex((t) => Math.abs(t - peak.retentionTime) < 0.005) || 
                           data.time.reduce((closest, t, i) => 
                             Math.abs(t - peak.retentionTime) < Math.abs(data.time[closest] - peak.retentionTime) ? i : closest, 0);
      const signalValue = data.signal[closestIndex];
      const y = yScale(signalValue);

      // Peak marker
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", "#ef4444")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseenter", function () {
          d3.select(this).attr("r", 6);
          setHoveredPeak(idx);
        })
        .on("mouseleave", function () {
          d3.select(this).attr("r", 4);
          setHoveredPeak(null);
        });

      // Peak label
      g.append("text")
        .attr("x", x)
        .attr("y", y - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#374151")
        .attr("font-weight", "500")
        .text(`${peak.retentionTime.toFixed(2)} min`);
    });

    // Add X axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(10));

    xAxis.selectAll("text").style("font-size", "12px");

    // Add Y axis
    const yAxis = g.append("g").call(d3.axisLeft(yScale).ticks(8));

    yAxis.selectAll("text").style("font-size", "12px");

    // Add X axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Time (min)");

    // Add Y axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Absorbance (mAU)");
  }, [data, width, containerWidth, height]);

  return (
    <div ref={containerRef} className={cn("relative w-full", width && "min-w-fit", className)} style={width ? { width: `${width}px` } : undefined}>
      <svg ref={svgRef} className="border border-gray-200 rounded-lg bg-white" />
      
      {/* Peak info tooltip */}
      {hoveredPeak !== null && data.peaks[hoveredPeak] && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
          <div className="font-semibold text-gray-800 mb-2">Peak {hoveredPeak + 1}</div>
          <div className="space-y-1 text-gray-600">
            <div>RT: {data.peaks[hoveredPeak].retentionTime.toFixed(3)} min</div>
            <div>Height: {data.peaks[hoveredPeak].height.toFixed(2)} mAU</div>
            <div>Area: {data.peaks[hoveredPeak].area.toFixed(2)}</div>
            <div>Width: {data.peaks[hoveredPeak].width.toFixed(3)} min</div>
            <div>Asymmetry: {data.peaks[hoveredPeak].asymmetry.toFixed(2)}</div>
            {data.peaks[hoveredPeak].resolution !== undefined && (
              <div>Resolution: {data.peaks[hoveredPeak].resolution!.toFixed(2)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
