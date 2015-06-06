console.log('hi')

$.getJSON('http://localhost:9200/?q=', function (data) {
  console.log(data);
});


$(document).ready(function(){
  var map = L.map('map').setView([30.22922, -97.756140], 13);
});
