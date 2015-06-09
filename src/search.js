var ES_URL = 'localhost:9200';
if (process.env.ELASTICSEARCH_URL) {
  ES_URL = process.env.ELASTICSEARCH_URL;
}

var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: ES_URL,
  //log: 'trace'
});


function search(latLng, distance) {
  var filter;
  if (_.isObject(distance)) {
    filter = {
      geo_bounding_box: {
        'marker.location': {
          top_left: {
            lat: latLng.lat,
            lon: latLng.lng
          },
          bottom_right: {
            lat: distance.lat,
            lon: distance.lng
          }
        }
      }
    };
  } else {
    filter = {
      geo_distance: {
        distance: distance,
        'marker.location': {
          lat: latLng.lat,
          lon: latLng.lng
        }
      }
    };
  }
  return client.search({
    index: 'thc',
    // type: 'markers',
    body: {
      query:{
        filtered: {
          query: {match_all: {}},
          filter: filter
        },
      },
      size: 100
    }
  })
}


module.exports = search;
