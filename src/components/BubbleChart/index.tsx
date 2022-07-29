import React, { useRef, useState, useEffect } from "react";
import { select, selectAll, Selection, pointer } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
// import { event } from "d3";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";
import { easeElastic } from "d3-ease";
import * as d3 from "d3";
import { initialData } from "./data";

const BubbleChart = (): JSX.Element => {
  const dimensions = { width: 1200, height: 550 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState(initialData);

  // csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"

  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  // var svg = d3
  //   .select("#my_dataviz")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

  // append the svg object to the body of the page

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
        .attr("cx", function (d: any) {
          return x(d.gdpPercap);
        })
        .attr("cy", function (d: any) {
          return y(d.lifeExp);
        })
        .attr("r", function (d: any) {
          return z(d.pop);
        })
        .style("fill", "#69b3a2")
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
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default BubbleChart;
