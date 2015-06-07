var _ = require('lodash');
var timeline = require('./timeline');
var search = require('./search');
var colors = require('./colors');
var d3 = require('d3');

var colorScale;
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
    color: d3.rgb(colorScale(data.markernum)).darker(1),
    fillColor: colorScale(data.markernum),
    fillOpacity: 0.8,
    radius: 7
  })
    .bindPopup(html, {autoPan: false})
    .addTo(markersLayer);
  markerLookup[data.markernum] = marker;
}

function _gotResults(data) {
  markersLayer.clearLayers();
  var bounds = map.getBounds();
  var visibleMarkers = _.filter(data.hits.hits,
        (x) => bounds.contains([x._source.location.lat, x._source.location.lon]))
  visibleMarkers = data.hits.hits
  if (!visibleMarkers.length) {
    // bail
    // TODO handle when there's nothing to show
    return;
  }
  colorScale = colors(visibleMarkers);
  _.map(visibleMarkers, (element) => buildMarker(element._source, markersLayer));
  timeline.init(visibleMarkers);
}

function doSearch() {
  var bounds = map.getBounds();
  search(bounds.getNorthWest(), bounds.getSouthEast())
    .then(_gotResults);
}

var debouncedSearch = _.debounce(doSearch, 200)

map.on('locationfound', function(loc) {
  debouncedSearch();
});

map.on('moveend', function(result) {
  debouncedSearch();
});

// initial load
debouncedSearch();

$('#timeline').on('ufoClick', function (e, a) {
  var marker = markerLookup[a.markernum];
  marker && marker.openPopup();
});
