const svg1 = d3
  .select("#chart-area-1")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 400);

d3.json("data/pricelist.json")
  .then(function(data) {
    data.map(d => (d.price = +d.price));

    const y = d3.scaleLinear()
      .domain([0, 2000])
      .range([0, 1]);

    const color = d3.scaleOrdinal()
      .domain(data)
      .range(["RED", "BLUE", "ORANGE", "GREEN", "INDIGO", "GREY"]);

    svg1
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * 80 + 25)
      .attr("cy", 150)
      .attr("r", d => y(d.price * 2))
      .style("fill", (d, i) => color(d.name));
  })
  .catch(e => {
    console.log(e);
  });
