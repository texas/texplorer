var _ = require('lodash');
var d3 = require('d3');

module.exports = function (data) {
  var markers = _.map(data.hits.hits, (x) => x._source.markernum);
  console.log(markers);
  return d3.scale.category20().domain(markers);
}
