const margin = { left: 80, right: 20, top: 20, bottom: 100 };

const width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var time = 0;

//Scales
const x = d3
  .scaleLog()
  .base(10)
  .range([0, width])
  .domain([142, 150000]);

const y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 90]);

const area = d3.scaleLinear()
  .range([25*Math.PI, 1500*Math.PI])
  .domain([2000, 1400000000]);

const color = d3.scaleOrdinal(d3.schemePastel1);

//Axis
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$"));
g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisCall);

const yAxisCall = d3.axisLeft(y).tickFormat(d => +d);
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall);

//Labels
const xLabel = g
  .append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

const yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

const timeLabel = g
  .append("text")
  .attr("y", height - 10)
  .attr("x", width - 40)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800");

d3.json("data/data.json").then(function(data) {

  const formattedData = data.map(function(year) {
    return year["countries"]
      .filter(function(country) {
        var dataExists = country.income && country.life_exp;
        return dataExists;
      })
      .map(function(country) {
        country.income = +country.income;
        country.life_exp = +country.life_exp;
        return country;
      })
  });

  d3.interval(function() {
    time = time < 214 ? time + 1 : 0
    update(formattedData[time]);
  }, 100);

  update(formattedData[0]);
})

function update(data) {
  const t = d3.transition().duration(100);

  const circles = g.selectAll("circle")
  	.data(data, (d) => d.country);

  circles.exit().attr("class", "exit").remove();

  circles
    .enter()
	.append("circle")
	.attr("class", "enter")
	.attr("fill", (d) => color(d.continent))
	.merge(circles)
    .transition(t)
		.attr("cy", (d) => y(d.life_exp))
		.attr("cx",  (d) => x(d.income))
		.attr("r",  (d) => Math.sqrt(area(d.population) / Math.PI) );

	timeLabel.text(+(time + 1800))
}
