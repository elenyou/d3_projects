const m = { left: 40, right: 40, top: 20, bottom: 60 };

const w = 800 - m.left - m.right;
const h = 400 - m.top - m.bottom;

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
  .attr("text-anchor", "start")
  .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (h / 2))
  .attr("y", 20)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Gross Domestic Product");

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(function(dataset) {
    let data = dataset.data;

    const x = d3
      .scaleTime()
      .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])])
      .range([0, w]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([h, 0]);

    const xAxisCall = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y).ticks(10);
    g.append("g")
      .attr("id", "y-axis")
      .call(yAxisCall);

    //Tooltip
    const tip = d3
      .tip()
      .attr("id", "tooltip")
      .attr('class', 'd3-tip')
      .attr("data-date", (d, i) => data[i][0])
      .attr("data-gdp", (d, i) => data[i][1])
      .html(function(d) {
        let currentDateTime = new Date(d[0]);
        let text =
          "<strong>GDP: </strong><span style='color:red'>" +
          d[1]+
          "</span><br>";
        text +=
          "<strong>DATE: </strong><span style='color:red;text-transform:capitalize'>" +
          currentDateTime.getFullYear() +
          "</span><br>";
        return text;
      });
    g.call(tip);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(new Date(d[0])))
      .attr("y", d => y(d[1]))
      .attr("width", 2)
      .attr("height", (d, i) => h - y(d[1]))
      .style("fill", "blue")
      .attr("data-date", (d, i) => data[i][0])
      .attr("data-gdp", (d, i) => data[i][1])
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
  })

  .catch(e => {
    console.log(e);
  });
