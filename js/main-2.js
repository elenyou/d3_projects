const svg2 = d3
  .select("#chart-area-2")
  .append("svg")
  .attr("width", 600)
  .attr("height", 400);

d3.json("data/pricelist.json")
  .then(function(data) {
    data.map(d => (d.price = +d.price));

    const y = d3.scaleLinear()
      .domain([0, 1250000])
      .range([0, 400]);

    const color = d3.scaleOrdinal()
      .domain(data)
      .range(["RED", "BLUE", "ORANGE", "GREEN", "INDIGO", "GREY"]);


    svg2
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => (i*80))
      .attr("y", 20)
      .attr("width", 60)
      .attr("height", d => y(d.price *20))
      .style("fill", (d, i) => color(d.name));
  })
  .catch(e => {
    console.log(e);
  });
