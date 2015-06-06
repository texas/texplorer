var _ = require('lodash');


function init(data) {
  _.each(data.hits.hits, function (hit) {
    console.log(hit._source.indexname, hit._source.years);
  });
}


module.exports.init = init;
