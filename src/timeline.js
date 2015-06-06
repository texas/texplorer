var _ = require('lodash');


function init(data) {
  _.each(data.hits.hits, function (hit) {
    console.log(hit);
  });
}


module.exports.init = init;
