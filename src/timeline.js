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
  var xScale = d3.scale.linear().domain(yearRange).range(0, 100);
}

module.exports.init = init;
