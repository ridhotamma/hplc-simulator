import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "~/lib/utils";

export interface BarData {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  className?: string;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  barColor?: string;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  className,
  xLabel = "Categories",
  yLabel = "Values",
  title,
  barColor = "#3b82f6",
  showValues = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

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
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([innerHeight, 0])
      .nice();

    // Add Y axis grid
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );

    // Add bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label) || 0)
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", barColor)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseenter", function () {
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 1);
      })
      .transition()
      .duration(800)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => innerHeight - yScale(d.value));

    // Add values on top of bars if enabled
    if (showValues) {
      g.selectAll(".value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
        .attr("y", innerHeight)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("opacity", 0)
        .text((d) => d.value.toFixed(1))
        .transition()
        .duration(800)
        .attr("y", (d) => yScale(d.value) - 8)
        .style("opacity", 1);
    }

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add X axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 50)
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
  }, [data, width, height, xLabel, yLabel, title, barColor, showValues]);

  return (
    <div className={cn("inline-block", className)}>
      <svg ref={svgRef} className="overflow-visible" />
    </div>
  );
};
