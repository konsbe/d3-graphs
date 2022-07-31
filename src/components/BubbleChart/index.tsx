import React, { useRef, useState, useEffect } from "react";
import { select, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";
// import { event } from "d3";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";
import { interpolate } from "d3-interpolate";
import { easeElastic, easeExpInOut } from "d3-ease";

import * as d3 from "d3";
import { initialData } from "./countries";
import { countriesOTW } from "./countriesOTW";
import "./BubbleChart.css";

const BubbleChart = (): JSX.Element => {
  const dimensions = { width: 1200, height: 550 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<Array<{}>>(initialData);
  // const [data, setData] = useState<Array<{}>>(countriesOTW);
  const [option, setOption] = useState<string>("initialData");
  const tooltip = select("#tooltip").style("opacity", 0);

  // csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"

  var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

  var showTooltip = function (d: any, selection: any) {
    tooltip.transition().duration(200);
    console.log(d.target.__data__);
    let string: string = d.target.__data__.population
      ? d.target.__data__.country + ": " + d.target.__data__?.population
      : d.target.__data__.country + ": " + d.target.__data__.lifeExp;
    tooltip
      .style("opacity", 1)
      .select("#count")
      .text(string)
      .style(
        "transform",
        `translate(calc(-90px + ${d.clientX}px), calc(${d.clientY}px))`
      );
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
  let y = scaleLinear().domain([0, 90]).range([dimensions.height, 0]);

  // Add a scale for bubble size
  let z = d3.scaleLinear().domain([200000, 1310000000]).range([1, 40]);

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
        .style("opacity", "0.7")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .attr("fill", function (d: any) {
          return colorizedContentents(d);
        })
        .on("mouseover", (d) => showTooltip(d, selection))
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .transition()
        .ease(easeExpInOut)
        .delay((_, i) => i)
        .duration(1000)
        .attr("cx", function (d: any) {
          let xData: number = d.gdpPercap
            ? d.gdpPercap
            : d.areaSqMi / 100 + 200;
          return x(xData);
        })
        .attr("cy", function (d: any) {
          let yData: number = d.lifeExp ? d.lifeExp : d.birthrate * 2;
          return y(yData);
        })
        .attr("r", function (d: any) {
          let zData: number = d.pop ? Number(d.pop) * 2 : d.population * 10;
          return z(zData);
        })
        // .style("opacity", "0.7")
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
  useEffect(() => {
    if (selection) {
      const circles = selection.selectAll(".bubbles").data(data);
      circles
        .transition()
        .delay((_, i) => i)
        .duration(1000)
        .attr("fill", function (d: any) {
          return colorizedContentents(d);
        })
        // .ease(easeElastic)
        .attr("cx", function (d: any) {
          let xData: number =
            option === "initialData"
              ? d.gdpPercap
              : option === "countriesOTW"
              ? d.areaSqMi / 100 + 200
              : d.cropsPerc * 1000 + 200
              ? d.cropsPerc * 1000 + 200
              : 0;

          return x(xData);
        })
        .attr("cy", function (d: any) {
          let yData: number =
            option === "initialData"
              ? d.lifeExp
              : option === "countriesOTW"
              ? d.birthrate * 2
              : d.deathrate * 3
              ? d.deathrate * 3
              : 0;
          return y(yData);
        })
        .attr("r", function (d: any) {
          let zData: number =
            option === "initialData"
              ? Number(d.pop) * 2
              : option === "countriesOTW"
              ? d.population * 10
              : d.industry * 1000000000
              ? d.industry * 1000000000
              : 0;
          return z(zData);
        })

        // .style("opacity", "0.7")
        .attr("stroke", "black");
    }
  }, [option]);

  const changeData = (x: number) => {
    if (x === 1) {
      console.log(x);
      setData(countriesOTW);
      setOption("countriesOTW");
    } else if (x === 2) {
      console.log(x);
      setData(initialData);
      setOption("initialData");
    } else if (x === 3) {
      console.log(x);
      setData(countriesOTW);
      setOption("countriesFTW");
    }
  };

  return (
    <>
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
      <button onClick={() => changeData(1)}>Change 1</button>
      <button onClick={() => changeData(2)}>Change 2</button>
      <button onClick={() => changeData(3)}>Change 3</button>
    </>
  );
};

export default BubbleChart;

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
