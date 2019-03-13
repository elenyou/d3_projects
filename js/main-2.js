const margin = { left: 100, right: 10, top: 10, bottom: 100 };

const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const g = d3
  .select("#chart-area-2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("The price range for auto");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Price ($)");

d3.json("data/pricelist.json")
  .then(function(data) {
    data.map(d => (d.price = +d.price));

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, height]);

    const color = d3
      .scaleOrdinal()
      .domain(data)
      .range(["RED", "BLUE", "ORANGE", "GREEN", "INDIGO", "GREY"]);

    const xAxisCall = d3.axisBottom(x);
    g.append("g")
      .attr("class", "x-axis")
      .attr("transofm", "translate(0, " + height + ")")
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y)
      .ticks(10)
      .tickFormat(function(d) {
        return d + "$";
      });
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxisCall);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", 20)
      .attr("width", x.bandwidth)
      .attr("height", d => y(d.price))
      .style("fill", (d, i) => color(d.name));
  })
  .catch(e => {
    console.log(e);
  });
