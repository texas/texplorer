import L from 'leaflet';
import 'leaflet-hash';
// need to manually specify this
L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images';

var d3 = require('d3');
if (process.env.NODE_ENV === 'development') {
  window.d3 = d3;
}
var colors = require('./colors');

var center = [20.2225, -97.7426];
var southWest = L.latLng(26.603, -106.567);
var northEast = L.latLng(36.927, -93.515);
var bounds = L.latLngBounds(southWest, northEast);

export var map;
export var markersLayer;
export var markerLookup = {};
export var $top = $('<div class="leaflet-control leaflet-bar topbar">loading...</div>');

var TopControl = L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd: (map) => {
    return $top[0];
  }
})

export var buildMarker = function(data, group) {
  var html = `<h4>${data.title}</h4><p>${data.markertext}</p>`;

  var marker = L.circleMarker([data.location.lat, data.location.lon], {
    color: d3.rgb(colors(data)).darker(1),
    fillColor: colors(data),
    fillOpacity: 0.8,
    radius: 7
  })
    .bindPopup(html, {autoPan: false})
    .addTo(markersLayer);
  markerLookup[data.markernum] = marker;
}

export function init() {
  map = L.map('map', {
      center: center,
      zoom: 12,
      minZoom: 6,
      maxBounds: bounds,
      zoomControl: false
    });
  if (process.env.NODE_ENV === 'development') {
    window.map = map;
  }
  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    attribution: 'map',
  }).addTo(map);

  markersLayer = new L.LayerGroup();
  map.addLayer(markersLayer);
  map.addControl(new TopControl());
  if (!document.location.hash) {
    map.locate({setView: true, maxZoom: 13});
  }
  new L.hash(map);
}
