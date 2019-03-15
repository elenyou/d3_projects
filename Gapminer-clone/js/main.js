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

let time = 0;
let interval;
let formattedData;

//Tooltip
const tip = d3.tip().attr('class', 'd3-tip')
  .html(function(d) {
    let text = "<strong>Country:</strong><span style='color:red'>" + d.country + "</span><br>";
    text += "<strong>Continent:</strong><span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
    text += "<strong>Lifr Expectancy:</strong><span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
    text += "<strong>GPD Per Capita:</strong><span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
    text += "<strong>Population:</strong><span style='color:red'>" + d.population + "</span><br>";
    return text;
  });
g.call(tip);

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

const continents = ['europe', 'asia', 'americas', 'africa'];

const legend = g.append('g')
  .attr("transform", "translate(" + (width -10) + "," + (height - 125) + ")");

continents.forEach(function(continent, i) {
  let legendRow = legend.append('g')
    .attr("transform", "translate(0, " + (i *20) + ")");

    legendRow.append('rect')
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(continent));

    legendRow.append('text')
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text(continent);
});

d3.json("data/data.json").then(function(data) {
   formattedData = data.map(function(year) {
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

  update(formattedData[0]);

})

$('#play-button')
  .on("click", function(){
    var button = $(this);
    if(button.text() === "Play") {
      button.text("Pause");
      interval = setInterval(step, 100);
    } else {
      button.text("Play");
      clearInterval(interval);
    }
  })

$('#reset-button')
  .on("click", function(){
    time = 0;
    update(formattedData[0]);
})

$("#continent-select")
  .on("change", function(){
    update(formattedData[time]);
  })

$("#date-slider").slider({
  max: 2014,
  min: 1800,
  step: 1,
  slide: function(event, ui) {
    time = ui.value -1800;
    update(formattedData[time]);
  }
})

function step() {
  time = time < 214 ? time + 1 : 0
  update(formattedData[time]);
}

function update(data) {
  const t = d3.transition().duration(100);

  var continent = $("#continent-select").val();

  var data = data.filter( function(d) {
    if (continent === 'all') {return true;}
    else {
      return d.continent == continent;
    }
})

  const circles = g.selectAll("circle")
  	.data(data, (d) => d.country);

  circles.exit().attr("class", "exit").remove();

  circles.enter()
	.append("circle")
	.attr("class", "enter")
  .attr("fill", (d) => color(d.continent))
  .on("mouseover", tip.show)
  .on("mouseout", tip.hide)
	.merge(circles)
    .transition(t)
		.attr("cy", (d) => y(d.life_exp))
		.attr("cx",  (d) => x(d.income))
		.attr("r",  (d) => Math.sqrt(area(d.population) / Math.PI) );

  timeLabel.text(+(time + 1800))
  $("#year")[0].innerHTML = +(time +1800)

  $("#date-slider").slider("value", +(time +1800))
}
