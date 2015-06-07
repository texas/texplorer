var _ = require('lodash');
var timeline = require('./timeline');
var search = require('./search');
var center = [30.2225, -97.7426];
var map = L.map('map', {
    center: center,
    zoom: 12,
    zoomControl: false
  });
  window.map = map;  // DEBUG

  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
   maxZoom: 18,
   attribution: 'map',
}).addTo(map);
var markersLayer = new L.LayerGroup();
map.addLayer(markersLayer);

var buildMarker = function(data, group) {
  var html = `<h2>${data.title}</h2><p>${data.markertext}</p>`;

  return L.marker([data.location.lat, data.location.lon])
    .bindPopup(html, {autoPan: false})
    .addTo(markersLayer);
}

map.locate({setView: true, maxZoom: 13});


function _gotResults(data) {
  markersLayer.clearLayers();
  var currentMarkers = _.map(data.hits.hits, function(element) {
    return buildMarker(element._source, markersLayer);
  });
  timeline.init(data);
}

map.on('locationfound', function(loc) {
  search([loc.latitude, loc.longitude])
    .then(_gotResults);
});

map.on('moveend', function(result) {
  search([map.getCenter().lat, map.getCenter().lng])
    .then(_gotResults);
});

// initial load
search([map.getCenter().lat, map.getCenter().lng])
  .then(_gotResults);

$('#timeline').on('ufoClick', function (e, a) {
  console.log(e, a)
});
