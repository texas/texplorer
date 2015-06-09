var DEFAULT_ES_URL = 'https://ik44vn6o9c:q2jynmlzrj@texplorer-4276945103.us-west-2.bonsai.io';
var ES_URL = process.env.ELASTICSEARCH_URL || DEFAULT_ES_URL

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
