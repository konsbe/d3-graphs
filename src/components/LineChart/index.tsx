import React, { createRef, useEffect, useState, useRef } from "react";
// import { event } from "d3";\
import { select, selectAll, Selection, pointer } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";

import "d3-transition";
import { easeElastic, easeExpInOut, easeSin, easeLinear } from "d3-ease";

import * as d3 from "d3";
import { initialData } from "../BubbleChart/countries";
import { countriesOTW } from "../BubbleChart/countriesOTW";
import { programmingData } from "./programmingLanguage";
import "../BubbleChart/BubbleChart.css";

import { scaleLinear, scaleBand, scaleTime } from "d3-scale";
import { max } from "d3-array";
import { schemeCategory10 } from "d3";
const defaultColor = schemeCategory10;

interface Dims {
  width: number;
  height: number;
}

interface IProps {
  size?: Dims;
  data: Array<Conf>;
}

type Conf = {
  value: number;
  color?: string;
};

function BarChart() {
  const renderNode = createRef<SVGSVGElement>();
  const [data, setData] = useState(programmingData);
  const [myobj, setMyobj] = useState(initMyData);
  // programmingData.map((d) => {
  // Object.entries(d).forEach((key, value) => {
  // console.log(`${key} ${value}`);
  // });
  // console.log("---------------------end---------------------");
  // });
  const dimensions = { width: 800, height: 550 };
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const svg = select(svgRef.current);
  svg.append("g").call(d3.axisLeft(y));

  let xScale = scaleBand()
    .domain(data.map((d: any) => d.python))
    .range([0, dimensions.width])
    .padding(0.23);

  let yScale = scaleLinear().domain([-10, 100]).range([dimensions.height, 0]);

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
      // const tooltip = select("#tooltip").style("opacity", 0);
      // selection
      //   .selectAll("rect")
      //   .data(data)
      //   .enter()
      //   .append("rect")
      //   .attr("x", (d: any) => xScale(d.python)!)
      //   .attr("y", dimensions.height)
      //   .attr("width", xScale.bandwidth)
      //   .attr("fill", "orange")
      //   .transition()
      //   .duration(100)
      //   .delay((_, i) => i * 10)
      //   .ease(easeElastic)
      //   .attr("height", (d: any) => dimensions.height - 30 - yScale(d.python))
      //   .attr("y", (d: any) => yScale(d.python));
      const line: any = d3
        .line()
        .x((d: any): any => xScale(d.date ? d.python : 0))
        .y((d: any) => yScale(d.python ? d.python : 0))
        .curve(d3.curveMonotoneX);
      const svg = select(svgRef.current)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // svg
      //   .append("g")
      //   .attr("transform", "translate(0," + 500 + ")")
      //   .call(axisBottom(xScale));
      // svg.append("g").call(axisLeft(yScale));
      // const tooltip = select("#tooltip").style("opacity", 0);
      svg
        .datum(data)
        .append("path")
        .transition()
        .ease(easeLinear) // Set Easing option
        .duration(2500)
        // .attr("stroke-dashoffset", 0)
        // .delay((_, i) => i)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
    const svg = select(svgRef.current)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(
        axisBottom(xScale)
          .tickSize(1000)
          // Remove outer tick mark
          .tickSizeOuter(0)
      )
      .selectAll("text")

      .style("text-anchor", "end")
      // .attr("dx", "-.8em")
      // .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");
    svg.append("g").call(axisLeft(yScale));
  }, [selection]);

  return (
    <>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </>
  );
}

export default BarChart;

export const colorizedContentents = (d: any): any => {
  if (d.continent) {
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
  } else {
    // console.log(d.region.includes("ASIA"));
    if (d.region?.includes("ASIA")) {
      return "#2DD7EB";
    } else if (d.region?.includes("EURO")) {
      return "#3CEB2D";
    } else if (d.region?.includes("AMER")) {
      return "#F55431";
    } else if (d.region?.includes("AFRI")) {
      return "#F33485";
    } else if (d.region?.includes("OCEANI")) {
      return "#Fff931";
    }
  }
};
export const initMyData = {
  date: "July 2004",
  adap: "0.33999999999999997",
  ada: "0.36",
  ccpp: "10.08",
  csharp: "4.71",
  cobol: "0.43",
  dart: "0",
  delphiPascal: "2.82",
  go: "0",
  groovy: "0.03",
  haskell: "0.22",
  java: "30.37",
  javascript: "8.649999999999999",
  julia: "0",
  kotlin: "0",
  lua: "0.16",
  matlab: "2.11",
  objectiveC: "0.19",
  perl: "7.380000000000001",
  php: "18.75",
  python: "2.53",
  r: "0.38999999999999996",
  ruby: "0.33",
  rust: "0.08",
  scala: "0.03",
  swift: "0",
  typescript: "0",
  vba: "1.44",
  visualBasic: "8.559999999999999",
};
