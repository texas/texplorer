var timeline = require('./timeline');
var search = require('./search');

var center = [30.2225, -97.7426];
var map = L.map('map', {
    center: center,
    zoom: 13,
    zoomControl: false
  });
  window.map = map;  // DEBUG

  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
   maxZoom: 18,
   attribution: 'map',
}).addTo(map);

map.locate({setView: true, maxZoom: 13});


function _gotResults(data) {
  // draw markers from that data

  // build timeline from that data
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
