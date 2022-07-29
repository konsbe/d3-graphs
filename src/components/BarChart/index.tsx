import React, { useRef, useState, useEffect } from "react";
import { select, selectAll, Selection, pointer } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
// import { event } from "d3";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";
import { easeElastic } from "d3-ease";
import randomstring from "randomstring";

let initialData = [
  {
    name: "foo",
    units: 32,
  },
  {
    name: "bar",
    units: 67,
  },
  {
    name: "baz",
    units: 81,
  },
  {
    name: "hoge",
    units: 38,
  },
  {
    name: "piyo",
    units: 28,
  },
  {
    name: "hogera",
    units: 59,
  },
];
let newData = [
  {
    name: "foo",
    units: 104,
  },
  {
    name: "bar",
    units: 95,
  },
  {
    name: "baz",
    units: 32,
  },
  {
    name: "hoge",
    units: 64,
  },
  {
    name: "piyo",
    units: 88,
  },
  {
    name: "hogera",
    units: 10,
  },
];
const BarChart: React.FC = () => {
  const dimensions = { width: 800, height: 550 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState(initialData);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  let x = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, dimensions.width])
    .padding(0.23);

  let y = scaleLinear()
    .domain([0, max(data, (d) => d.units)!])
    .range([dimensions.height, 0]);

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
      const tooltip = select("#tooltip").style("opacity", 0);
      selection
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name)!)
        .attr("y", dimensions.height)
        .attr("width", x.bandwidth)
        .attr("fill", "orange")
        .attr("height", -30)
        /**
         * onmouseover with keyword this works perfect
         */
        .on("mouseover", function (d) {
          console.log(d);
          // console.log(d.path[0].__data__);
          select(this).attr("fill", "#00c");
          tooltip.select("#count").text(d.path[0].__data__.units);
          tooltip
            .style(
              "transform",
              `translate(calc( ${d.clientX}px), calc(-100% + ${d.clientY}px))`
            )
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          select(this).attr("fill", "orange");
          tooltip.style("opacity", 0);
        })
        /**
         * Transitions work similar to CSS Transitions
         * From an inital point, to the conlcuded point
         * in which you set the duration, and the ease
         * and a delay if you'd like
         */
        .transition()
        .duration(700)
        .delay((_, i) => i * 100)
        .ease(easeElastic)
        .attr("height", (d) => dimensions.height - 30 - y(d.units))
        // .on("mouseenter", onMouseOver)
        // .on("mouseleave", onMouseOut)
        .attr("y", (d) => y(d.units));
    }
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const svg = select(svgRef.current)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(axisBottom(x));

    svg.append("g").call(axisLeft(y));
  }, [selection]);

  useEffect(() => {
    if (selection) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      x = scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, dimensions.width])
        .padding(0.23);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      y = scaleLinear()
        .domain([0, max(data, (d) => d.units)!])
        .range([dimensions.height, 0]);

      const rects = selection.selectAll("rect").data(data);

      rects
        .exit()
        .transition()
        .ease(easeElastic)
        .duration(400)
        .attr("height", -30)
        .attr("y", dimensions.height)
        .remove();

      /**
       * a delay is added here to aid the transition
       * of removing and adding elements
       * otherwise, it will shift all elements
       * before the add/remove transitions are finished
       */
      rects
        .transition()
        .delay(300)
        .attr("x", (d) => x(d.name)!)
        .attr("y", (d) => y(d.units))
        .attr("width", x.bandwidth)
        .attr("height", (d) => dimensions.height - 30 - y(d.units))
        .attr("fill", "orange");

      rects
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name)!)
        .attr("width", x.bandwidth)
        .attr("height", -30)
        .attr("y", dimensions.height)
        .transition()
        .delay(400)
        .duration(500)
        .ease(easeElastic)
        .attr("height", (d) => dimensions.height - 30 - y(d.units))
        .attr("y", (d) => y(d.units))
        .attr("fill", "orange");
    }
  }, [data]);

  /**
   * functions to help add and remove elements to show transitions
   */

  const removeData = () => {
    if (data.length === 0) {
      return;
    }
    setData([...data.slice(0, data.length - 1)]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setData([
      ...data,
      {
        name: name === "" ? Math.random().toString() : name,
        units: parseInt(unit),
      },
    ]);
  };
  const changeData = (e: React.FormEvent) => {
    e.preventDefault();
    setData(newData);
  };

  return (
    <div>
      <div
        id="tooltip"
        className="tooltip"
        style={{
          backgroundColor: "black",
          border: "1px solid black",
          borderRadius: "13px",
          flexWrap: "wrap",
        }}
      >
        <div className="tooltip-title">
          <span id="title" />
        </div>
        <div
          className="tooltip-value"
          style={{
            display: "inline-block",
            position: "fixed",
            backgroundColor: "black",
          }}
        >
          <span id="count" style={{ color: "white", margin: "1rem" }} />
        </div>
      </div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      <button onClick={removeData}>Remove Data</button>
      <form onSubmit={submit} style={{ paddingTop: "1rem" }}>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
        Units:
        <input value={unit} onChange={(e) => setUnit(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={(e) => changeData(e)}>change Data</button>
      <div>
        <input
          type="radio"
          value="Male"
          name="gender"
          onChange={(e) => setData(newData)}
        />{" "}
        Male
        <input
          type="radio"
          value="Female"
          name="gender"
          onChange={(e) => setData(initialData)}
        />{" "}
        Female
        <input
          type="radio"
          value="Other"
          name="gender"
          onChange={(e) => setData(newData)}
        />{" "}
        Other
      </div>
    </div>
  );
};

export default BarChart;
