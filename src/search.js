var ES_URL = 'localhost:9200';
var ES_URL = '45.55.233.185:9200';

var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: ES_URL,
  //log: 'trace'
});


function search(latLng, distance) {
  latLng = latLng || [30, -97];  // DEBUG
  distance = distance || '16km';  // DEBUG
  console.log(latLng, distance)
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
    // index: 'thc',
    // type: 'markers',
    body: {
      query:{
        filtered: {
          query: {match_all: {}},
          filter: filter
        }
      }
    }
  })
}


module.exports = search;
