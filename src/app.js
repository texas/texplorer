console.log('hi')

$.getJSON('http://localhost:9200/?q=', function (data) {
  console.log(data);
});


$(document).ready(function(){
  var map = L.map('map', {
    center: [30.2225, -97.7426],
    zoom: 13,
    zoomControl: false
    });
    window.map = map;  // DEBUG

    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
     maxZoom: 18,
     attribution: `map`,
  }).addTo(map);
});
