var _ = require('lodash');
var timeline = require('./timeline');
var search = require('./search');
var colorsScale = require('./colors');
var d3 = require('d3');

var colors;
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
map.locate({setView: true, maxZoom: 13});

var markerLookup = {};
var buildMarker = function(data, group) {
  var html = `<h2>${data.title}</h2><p>${data.markertext}</p>`;

  var marker =  L.circleMarker([data.location.lat, data.location.lon], {
    color: d3.rgb(colors(data.markernum)).darker(1),
    fillColor: colors(data.markernum),
    fillOpacity: 0.8,
    radius: 7
  })
    .bindPopup(html, {autoPan: false})
    .addTo(markersLayer);
  markerLookup[data.markernum] = marker;
}

function _gotResults(data) {
  markersLayer.clearLayers();
  colors = colorsScale(data);
  _.map(data.hits.hits, function(element) {
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
  var marker = markerLookup[a.markernum];
  marker && marker.openPopup();
});
