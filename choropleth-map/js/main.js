const colors = ['#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
  margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 1000,
  height = 600;

const tooltip = d3.select('body')
                  .append('div')
                  .attr('id', 'tooltip');

const choropleth = d3.select('body')
                    .append('svg')
                    .attr('id', 'choropleth')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const path = d3.geoPath();

choropleth.append('text')
            .attr('transform', `translate(${width / 2},${margin.top - 140})`)
            .attr('id', 'title')
            .text('United States Educational Attainment');

choropleth.append('text')
          .attr('transform', `translate(${width / 2},${margin.top - 105})`)
          .attr('id', 'sub-title')
          .text('Percentage of Adults aged 25 and older with a bachelor\'s degree or higher 2010-2014');

d3.queue()
  .defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
  .defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
  .await((error, map, data) => {

    const idLookup = map.objects.counties.geometries.reduce((result, county) => {
      const copy = Object.assign({}, data.find(searchedCounty => county.id === searchedCounty.fips));
      result[copy.fips] = copy;
      return result;
    }, {});

    const colorScale = d3.scaleQuantize().
      domain([10, 70]).
      range(colors);

    choropleth.append('g').
      selectAll('path').
      data(topojson.feature(map, map.objects.counties).features).
      enter().append('path').
      attr('fill', d => colorScale(idLookup[d.id].bachelorsOrHigher)).
      attr('d', d3.geoPath()).
      on('mousemove', d => {
        tooltip.transition().
          duration(100).
          style('opacity', .9);
        tooltip.text(`${idLookup[d.id].area_name}, ${idLookup[d.id].state}: ${idLookup[d.id].bachelorsOrHigher}%`).
          style('left', `${d3.event.pageX + 15}px`).
          style('top', `${d3.event.pageY - 10}px`);
      }).
      on('mouseout', () => {
        tooltip.transition().
          duration(400).
          style('opacity', 0);
      });

    choropleth.append('g').
      append('path').
      attr('d', path(topojson.feature(map, map.objects.states))).
      attr('fill', 'none').
      attr('stroke', 'white');
  });

const gradientScale = d3.scaleLinear().
  range(colors);

const linearGradient = choropleth.append('linearGradient').
  attr('id', 'linear-gradient');

linearGradient.selectAll('stop').
  data(gradientScale.range()).
  enter().append('stop').
  attr('offset', (d, i) => i / (gradientScale.range().length - 1)).
  attr('stop-color', d => d);

choropleth.append('rect').
  attr('width', 300).
  attr('height', 20).
  style('fill', 'url(#linear-gradient)').
  attr('transform', 'translate(900,550) rotate(-90)');

choropleth.append('g').
  selectAll('text').
  data([1, 2, 3, 4, 5, 6]).
  enter().append('text').
  attr('x', '925').
  attr('y', d => `${162 + (Math.ceil(300 / 6) + d * 55)}`).
  text((d, i) => `${Math.abs(i - 6) * 10}%`);