console.log('hi')

$ = require('jquery');

$.getJSON('http://localhost:9200/?q=', function (data) {
  console.log(data);
});
