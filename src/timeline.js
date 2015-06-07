var _ = require('lodash');
var d3 = require('d3');
window.d3 = d3;  // DEBUG


var width, height, svg, svgPlot;


function plot(data, names) {
  width = $('#timeline').width();
  height = $('#timeline').height();
  var markerHeight = 20;
  var markerWidth= 7;

  var yearRange = d3.extent(data, (d) => d[0]);
  var xScale = d3.scale.linear().domain(yearRange).range([0, width]);
  var colorScale = d3.scale.category20().domain(names)

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

  var plotItems = svgPlot.selectAll('g.year').data(data);
  plotItems
    .enter()
      .append('g')
      .attr('class', 'year')
      .attr('transform', (d) => `translate(${xScale(d[0])}, 0)`)
      .selectAll('rect.marker')
        .data((d) => d[1])
        .enter()
          .append('rect')
          .attr('class', 'market')
          .attr('fill', (d) => colorScale(d.markernum))
          .attr('cursor', 'pointer')
          .attr('width', markerWidth)
          .attr('height', markerHeight)
          .attr('transform', (d, i) => `translate(0, ${markerHeight * i})`)
          .on('click', (d) => $('#timeline').trigger('ufoClick', d))

  plotItems
    .exit().remove();

}

function init(data) {
  var yearBuckets = {};
  var markers = [];
  _.each(data.hits.hits, function (marker) {
    console.log(marker._source.indexname, marker._source.years, marker._source);
    markers.push(marker._source.markernum)
    _.each(marker._source.years, function (year) {
      if (!yearBuckets[year]) {
        yearBuckets[year] = [];
      }
      yearBuckets[year].push(marker._source);
    });
  });

  var timelineData = _.pairs(yearBuckets);
  plot(timelineData, markers);
}

module.exports.init = init;
