const m = { left: 60, right: 50, top: 50, bottom: 220 };

const w = 1000 - m.left - m.right;
const h = 600 - m.top - m.bottom;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", w + m.left + m.right)
  .attr("height", h + m.top + m.bottom)
  .append("g")
  .attr("transform", "translate(" + m.left + "," + m.top + ")");

g.append("text")
  .attr("class", "x axis-label")
  .attr("transform", "translate(" + w / 3 + " ," + (h + 50) + ")")
  .attr("font-size", "15px")
  .attr("text-anchor", "center")
  .text("Years");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (h / 2))
  .attr("y", - 50)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Months");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then(function(dataset) {
    const data = dataset.monthlyVariance;
    // console.log(data);

    const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.year),
              d3.max(data, (d) => d.year)+15])
      .range([0, w]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.month-1)])
      .range([h, 0]);

    const xAxisCall = d3.axisBottom(x).tickFormat(d3.format('.0f'));
    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxisCall);

    const month = ["January","February","March","April","May","June","July", "August","September","October","November","December"];

    const yAxisCall = d3.axisLeft(y).tickFormat((d, i) => month[i]);
    g.append("g")
      .attr("id", "y-axis")
      .call(yAxisCall);

    //Tooltip
    const tip = d3
      .tip()
      .attr("id", "tooltip")
      .attr('class', 'd3-tip')
      .attr("data-year", (d, i) => data[i].year)
      .attr("data-month", (d, i) => data[i].month)
      .attr("data-temp", (d, i) => data[i].variance+8.66)
      .html(function(d) {
        let text =
          "<strong>Year: </strong><span>" +
          d.year
          "</span><br>";
        text +=
          "<br><strong>Temperature max: </strong><span text-transform:capitalize'>" +
         (d.variance+8.66).toFixed(1) + "<span>℃</span>"
          "</span><br>";
        text +=
          "<br><strong>Temperature min: </strong><span text-transform:capitalize'>" +
          (d.variance-8.66).toFixed(1) + "<span>℃"
          "</span><br>";
        return text;
      });
    g.call(tip);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.month))
      .attr("width", 2)
      .attr("height", 30)
      .style("fill", (d) => ((d.variance +8.66) <= 3) ? "navy" :
                            ((d.variance +8.66) <= 6) ? "green" :
                            ((d.variance +8.66) <= 9) ? "orange" : "red" )
      .attr("data-year", (d, i) => data[i].year)
      .attr("data-month", (d, i) => data[i].month)
      .attr("data-temp", (d, i) => data[i].variance+8.66)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  const colors = ["navy", "green", "orange", "red"];

    g.selectAll("circle")
      .data(colors)
      .enter()
      .append("circle")
      .attr("class", "legend")
      .attr("cx", w-5)
      .attr("cy", (d, i) => i * 20+5)
      .attr("r", 7)
      .style("fill", d => d)
      .attr("id", "legend");

    g.append("text")
      .attr(
        "transform",
        "translate(" + (w+50) + " ," + 10 + ")"
      )
      .style("text-anchor", "end")
      .text("<= 3℃");

    g.append("text")
      .attr(
        "transform",
        "translate(" + (w+50) + " ," + 30 + ")"
      )
      .style("text-anchor", "end")
      .text("<= 6℃");
    g.append("text")
      .attr(
        "transform",
        "translate(" + (w+50) + " ," + 50 + ")"
      )
      .style("text-anchor", "end")
      .text("<= 9℃");
    g.append("text")
      .attr(
        "transform",
        "translate(" + (w+50) + " ," + 70 + ")"
      )
      .style("text-anchor", "end")
      .text("> 9℃");
  })

  .catch(e => {
    console.log(e);
  });
