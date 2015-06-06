var _ = require('lodash');
var search = require('./utils').search;


function init() {
  search().then(function (data) {
    _.each(data.hits.hits, function (hit) {
      console.log(hit);
    });
  });
}


module.exports.init = init;
