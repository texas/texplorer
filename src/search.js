var ES_URL = 'localhost:9200';

var $ = require('jquery');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: ES_URL,
  //log: 'trace'
});


function search(latLng, distance) {
  latLng = latLng || [30, -97];  // DEBUG
  distance = distance || '16km';  // DEBUG
  return client.search({
    // index: 'thc',
    // type: 'markers',
    body: {
      query:{
        filtered: {
          query: {match_all: {}},
          filter: {
            geo_distance: {
              distance: distance,
              'marker.location': {
                lat: latLng[0],
                lon: latLng[1]
              }
            }
          }
        }
      }
    }
  })
}


module.exports = search;
