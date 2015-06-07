var _ = require('lodash');
var d3 = require('d3');
window.d3 = d3;  // DEBUG


var width, height, svg, svgPlot;


function plot(data) {
  width = $('#timeline').width();
  height = $('#timeline').height();

  var yearRange = d3.extent(data, (d) => d[0]);
  var xScale = d3.scale.linear().domain(yearRange).range([0, width]);

  var xAxis = d3.svg.axis().orient('bottom')
    .scale(xScale)
    .tickFormat((x) => x)

  var timeline = d3.select('#timeline');

  if (!svgPlot) {
    svg = d3.select('#timeline')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewbox', '0 0 ${width} 100')
      .attr('preserveAspectRatio', 'xMinYMin meet');

    svgPlot = svg.append('g').attr('class', 'plot')
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - 20})`)
      .call(xAxis);
  } else {
    svg.select('.x.axis')
      .transition().duration(1000).call(xAxis)
  }

  var plotItems = svgPlot.selectAll('rect').data(data);
  plotItems
    .enter()
      .append('rect')
      .style()
      .attr('width', 10)
      .attr('height', (d) => d[1].length * 10)
      .attr('transform',
        (d) => `translate(${xScale(d[0])}, 20)`);
  plotItems
    .exit().remove();

  // timeline.selectAll('div')
  //   .data(timelineData)
  //   .enter()
  //     .append('div.year')
  //     .attr('class', 'year')
  //     .style('left', (d) => xScale(d[0]) + '%')
  //     .style('left', (d) => xScale(d[0]) + '%')
  //     .text((d) => d[0])
  //     .selectAll('div.marker')
  //     .data((d) => d[1])
  //       .enter()
  //       .append('div')
  //       .attr('class', 'marker')
  //       .text((d) => d.indexname);

}

function init(data) {
  var yearBuckets = {};
  _.each(data.hits.hits, function (hit) {
    console.log(hit._source.indexname, hit._source.years);
    _.each(hit._source.years, function (year) {
      if (!yearBuckets[year]) {
        yearBuckets[year] = [];
      }
      yearBuckets[year].push(hit._source);
    });
  });

  var timelineData = _.pairs(yearBuckets);
  plot(timelineData);
}

module.exports.init = init;
