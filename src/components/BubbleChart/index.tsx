import React, { useRef, useState, useEffect } from "react";
import { select, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";
// import { event } from "d3";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";
import * as d3 from "d3";
import { initialData } from "./countries";
import "./BubbleChart.css";
const BubbleChart = (): JSX.Element => {
  const dimensions = { width: 1200, height: 550 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState(initialData);
  const tooltip = select("#tooltip").style("opacity", 0);

  // csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"

  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  var showTooltip = function (d: any, selection: any) {
    tooltip.transition().duration(200);
    tooltip
      .style("opacity", 1)
      .select("#count")
      .text(d.path[0].__data__.country + ": " + d.path[0].__data__.gdpPercap)
      .style(
        "transform",
        `translate(calc(-90px + ${d.clientX}px), calc(${d.clientY}px))`
      );
    // selection
    //   .append("g")
    //   .append("rect")
    //   .attr("class", "dotted")
    //   .attr("stroke-width", "1px")
    //   .attr("width", ".5px")
    //   .attr("height", dimensions.height - 1000);
  };
  var moveTooltip = function (d: any) {
    tooltip.style(
      "transform",
      `translate(calc(-90px + ${d.clientX}px), calc(${d.clientY}px))`
    );
  };
  var hideTooltip = function (d: any) {
    tooltip.transition().duration(200).style("opacity", 0);
  };
  let x = scaleLinear().domain([0, 10000]).range([0, width]);
  // Add Y axis
  let y = scaleLinear().domain([35, 90]).range([dimensions.height, 0]);
  // svg.append("g").call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear().domain([200000, 1310000000]).range([1, 40]);

  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      selection
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d: any) {
          return x(d.gdpPercap);
        })
        .attr("cy", function (d: any) {
          return y(d.lifeExp);
        })
        .attr("r", function (d: any) {
          return z(Number(d.pop) * 2);
        })
        .attr("fill", function (d: any): any {
          if (d.continent === "Asia") {
            return "#2DD7EB";
          } else if (d.continent === "Europe") {
            return "#3CEB2D";
          } else if (d.continent === "Americas") {
            return "#F55431";
          } else if (d.continent === "Africa") {
            return "#F33485";
          } else if (d.continent === "Oceania") {
            return "#Fff931";
          }
        })
        .on("mouseover", (d) => showTooltip(d, selection))
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .style("opacity", "0.7")
        .attr("stroke", "black");
    }
    // const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const svg = select(svgRef.current)
      .append("g")
      .attr("transform", "translate(" + 20 + "," + margin.top + ")");
    svg
      .append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(axisBottom(x));

    svg.append("g").call(axisLeft(y));
  }, [selection]);

  return (
    <div style={{ marginLeft: "100px" }}>
      <div id="tooltip" className="tooltip" style={{ width: "15%" }}>
        <div className="tooltip-title">
          <span id="title" />
        </div>
        <div className="tooltip-value" style={{ backgroundColor: "black" }}>
          <span id="count" style={{ color: "white", margin: "1rem" }} />
        </div>
      </div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default BubbleChart;
