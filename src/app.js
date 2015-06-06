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


var center = [30.2225, -97.7426];
// center the map on the point

// pull data for that point
search(center)
  .then(function (data) {
    // draw markers from that data

    // build timeline from that data
    timeline.init(data);
  });


