var _ = require('lodash');
var d3 = require('d3');

var colorScale = d3.scale.category20().domain(d3.range(20));

export default function getColorFromMarker(data) {
  return colorScale(parseInt(data.markernum, 10) % 20);
}
