var _ = require('lodash');
var d3 = require('d3');
var colors = require('./colors');
window.d3 = d3;  // DEBUG


var width, height, svg, svgEpochs, svgPlot;
var colorScale;
var epochs = [
  {name: 'Pre-History', start: 1000, end: 1619, fill: 'burlywood'},
  {name: 'French Colonization', start: 1680, end: 1690, fill: 'darkblue'},
  {name: 'Spanish Texas', start: 1691, end: 1821, fill: 'chocolate'},
  {name: 'Texas Independence', start: 1835, end: 1845, fill: 'crimson'},
  {name: 'Civil War', start: 1860, end: 1865, fill: 'gray'},
  {name: 'Galveston Hurricane', start: 1906, end: 1906, fill: 'powderblue'},
  {name: 'Civil Rights', start: 1940, end: 1950, fill: 'cadetblue'},
];



function plot(data) {
  width = $('#timeline').width();
  height = $('#timeline').height();
  var markerHeight = 20;
  var markerWidth= 7;

  var yearRange = d3.extent(data, (d) => d[0]);
  var xScale = d3.scale.linear().domain(yearRange).range([0, width - markerWidth]);
  var yearZero = +yearRange[0];

  var xAxis = d3.svg.axis().orient('bottom')
    .scale(xScale)
    .tickFormat((x) => x)

  var timeline = d3.select('#timeline');

  if (!svgPlot) {
    // create
    svg = d3.select('#timeline')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewbox', '0 0 ${width} 100')
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // epochs
    svgEpochs = svg.append('g').attr('class', 'epoch')
    svgEpochs.selectAll('rect.epoch').data(epochs).enter()
      .append('rect')
      .attr('class', 'epoch')
      .attr('width', (d) => xScale(d.end - d.start + yearZero))
      .attr('height', height - 20)
      .attr('fill', (d) => d.fill)
      .attr('opacity', 0.5)
      .attr('transform', (d) => `translate(${xScale(d.start)}, 0)`)
      .append('title')
        .text((d) => d.name)
    // plot
    svgPlot = svg.append('g').attr('class', 'plot');
    // x axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${markerWidth / 2}, ${height - 20})`)
      .call(xAxis);
  } else {
    // updates
    svg.select('.x.axis')
      .transition().duration(1000).call(xAxis)
    svgEpochs.selectAll('rect.epoch').data(epochs)
      .transition().duration(1000)
      .attr('width', (d) => xScale(d.end - d.start + yearZero))
      .attr('transform', (d) => `translate(${xScale(d.start)}, 0)`);
  }

  var plotYears = svgPlot.selectAll('g.year').data(data);
  var plotMarkers = plotYears.selectAll('rect.marker').data((d) => d[1])

  // enter
  plotYears
    .enter()
      .append('g')
      .attr('class', 'year')
      .attr('transform', (d) => `translate(${xScale(d[0])}, 0)`)
      .attr('year', (d) => d[0])  // DEBUG

  var incomingMarkers = plotMarkers.enter().append('rect')
    .attr('class', 'marker')
    .attr('stroke', (d) => d3.rgb(colorScale(d.markernum)).darker(1))
    .attr('fill', (d) => colorScale(d.markernum))
    .attr('cursor', 'pointer')
    .attr('width', 0)
    .attr('height', markerHeight)
    .attr('transform', (d, i) => `translate(0, ${markerHeight * i})`)
    .on('click', (d) => $('#timeline').trigger('ufoClick', d))
  incomingMarkers
    .append('title')
      .text((d) => d.indexname)
  incomingMarkers
    .transition().duration(1000)
      .attr('width', markerWidth)

  // update
  plotYears
    .transition().duration(1000)
    .attr('transform', (d) => `translate(${xScale(d[0])}, 0)`)
  plotMarkers
    .attr('stroke', (d) => d3.rgb(colorScale(d.markernum)).darker(1))
    .attr('fill', (d) => colorScale(d.markernum))
    .on('click', (d) => $('#timeline').trigger('ufoClick', d))
  plotMarkers
    .select('title').text((d) => d.indexname);

  // exit
  plotMarkers
    .exit()
    .transition().duration(1000)
      .attr('transform', (d, i) => `translate(0, ${height})`)
      .remove();

  plotYears
    .exit()
      .transition().duration(1000)
      .attr('opacity', 0)
      .remove()
}

function init(data) {
  var yearBuckets = {};
  colorScale = colors(data);
  _.each(data, (marker) => {
    // console.log(marker._source.indexname, marker._source.years, marker._source);
    _.each(marker._source.years, (year) => {
      if (!yearBuckets[year]) {
        yearBuckets[year] = [];
      }
      yearBuckets[year].push(marker._source);
    });
  });

  var timelineData = _.pairs(yearBuckets);
  plot(timelineData);
}

module.exports.init = init;
