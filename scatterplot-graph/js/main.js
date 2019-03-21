const m = { left: 60, right: 40, top: 20, bottom: 20 };

const w = 800 - m.left - m.right;
const h = 400 - m.top - m.bottom;

const timeParse = d3.timeParse("%M:%S");

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", w + m.left + m.right)
  .attr("height", h + m.top + m.bottom)
  .append("g")
  .attr("transform", "translate(" + m.left + "," + m.top + ")");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (h / 2))
  .attr("y", -50)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Time in Minutes");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then(function (data) {
    console.log(data);
    data.map(d => d.Doping = +d.Doping);
    const parsedTime = data.map((d) => timeParse(d.Time));

    const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Year) - 1,
      d3.max(data, (d) => d.Year)])
      .range([0, w]);

    const y = d3
      .scaleTime()
      .domain([d3.min(parsedTime, (d) => d),
      d3.max(parsedTime, (d) => d)])
      .range([h, 0])
      .nice();

    const xAxisCall = d3.axisBottom(x).tickFormat(d3.format('.0f'));
    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y)
      .tickFormat(d3.timeFormat("%M:%S"));
    g.append("g")
      .attr("id", "y-axis")
      .call(yAxisCall);

    //Tooltip
    const tip = d3
      .tip()
      .attr("id", "tooltip")
      .attr('class', 'd3-tip')
      .attr("data-year", data.Year)
      .html(function (d) {
        let text =
          "<strong>Year: </strong><span style='color:red'>" +
          d.Year +
          "</span><br>";
        text +=
          "<strong>Time: </strong><span style='color:red;text-transform:capitalize'>" +
          d.Time +
          "</span><br>";
        return text;
      });
    g.call(tip);

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(timeParse(d.Time)))
      .attr("r", 5)
       .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => timeParse(d.Time))
      .attr("fill", (d) => d.Doping == "" ? "navy" : "red")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    const colors = ["red", "navy"];

    g.selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("class", "legend")
      .attr("x", w - 50)
      .attr("y", (d, i) => i * 20 + 250)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", d => d)
      .attr("id", "legend");

    g.append("text")
      .attr(
        "transform",
        "translate(" + (w - 60) + " ," + 265 + ")"
      )
      .style("text-anchor", "end")
      .text("Riders with doping allegations");

    g.append("text")
      .attr(
        "transform",
        "translate(" + (w - 60) + " ," + 285 + ")"
      )
      .style("text-anchor", "end")
      .text("No doping allegations");

  })
  .catch(e => {
    console.log(e);
  });
