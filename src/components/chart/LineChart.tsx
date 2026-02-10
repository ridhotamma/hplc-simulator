import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "~/lib/utils";

export interface DataPoint {
  x: number;
  y: number;
}

export interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  className?: string;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  lineColor?: string;
  showGrid?: boolean;
  showDots?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 400,
  className,
  xLabel = "X Axis",
  yLabel = "Y Axis",
  title,
  lineColor = "#3b82f6",
  showGrid = true,
  showDots = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions and margins
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.x) || 0, d3.max(data, (d) => d.x) || 0])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y) || 0, d3.max(data, (d) => d.y) || 0])
      .range([innerHeight, 0])
      .nice();

    // Add grid lines if enabled
    if (showGrid) {
      // X-axis grid
      g.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(innerHeight)
            .tickFormat(() => ""),
        );

      // Y-axis grid
      g.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => ""),
        );
    }

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Add the line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots if enabled
    if (showDots) {
      g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 4)
        .attr("fill", lineColor)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseenter", function (_, d) {
          d3.select(this).attr("r", 6);

          // Show tooltip
          const tooltip = g
            .append("g")
            .attr("class", "tooltip")
            .attr("transform", `translate(${xScale(d.x)},${yScale(d.y) - 20})`);

          tooltip
            .append("rect")
            .attr("x", -40)
            .attr("y", -25)
            .attr("width", 80)
            .attr("height", 20)
            .attr("fill", "rgba(0, 0, 0, 0.8)")
            .attr("rx", 4);

          tooltip
            .append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", 12)
            .text(`(${d.x.toFixed(2)}, ${d.y.toFixed(2)})`);
        })
        .on("mouseleave", function () {
          d3.select(this).attr("r", 4);
          g.selectAll(".tooltip").remove();
        });
    }

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add X axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 45)
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text(xLabel);

    // Add Y axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text(yLabel);

    // Add title if provided
    if (title) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text(title);
    }
  }, [
    data,
    width,
    height,
    xLabel,
    yLabel,
    title,
    lineColor,
    showGrid,
    showDots,
  ]);

  return (
    <div ref={containerRef} className={cn("inline-block", className)}>
      <svg ref={svgRef} className="overflow-visible" />
    </div>
  );
};
