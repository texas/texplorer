var _ = require('lodash');
var d3 = require('d3');


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
  window.timelineData = timelineData;
  window.d3 = d3;
  var yearRange = d3.extent(timelineData, (d) => d[0]);
  var xScale = d3.scale.linear().domain(yearRange).range([0, 100]);
  window.zz = xScale


  var timeline = d3.select('#timeline');
  timeline.selectAll('div')
    .data(timelineData)
    .enter()
      .append('div.year')
      .attr('class', 'year')
      .style('left', (d) => xScale(d[0]) + '%')
      .style('left', (d) => xScale(d[0]) + '%')
      .text((d) => d[0])
      .selectAll('div.marker')
      .data((d) => d[1])
        .enter()
        .append('div')
        .attr('class', 'marker')
        .text((d) => d.indexname);

}

module.exports.init = init;
