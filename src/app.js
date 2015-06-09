var _ = require('lodash');
import * as mainMap from './map';
var timeline = require('./timeline');
var search = require('./search');


function _gotResults(data) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`got ${data.hits.hits.length} out of ${data.hits.total}`);
  }
  mainMap.$top.text('');
  mainMap.markersLayer.clearLayers();
  var bounds = mainMap.map.getBounds();
  var visibleMarkers = data.hits.hits;
  if (!visibleMarkers.length) {
    // bail
    mainMap.$top.text('No markers at this zoom, try zooming out');
    return;
  } else if (data.hits.hits.length < data.hits.total) {
    mainMap.$top.html(`Displaying <strong>${data.hits.hits.length}</strong> out of
                       <strong>${data.hits.total}</strong> markers,
                       zoom in to see more.`);
  } else {
    mainMap.$top.html(`Displaying <strong>${data.hits.hits.length}</strong> markers.`);
  }
  _.map(visibleMarkers, (element) => mainMap.buildMarker(element._source, mainMap.markersLayer));
  timeline.init(visibleMarkers);
}

function doSearch() {
  var bounds = mainMap.map.getBounds();
  search(bounds.getNorthWest(), bounds.getSouthEast())
    .then(_gotResults);
}

var debouncedSearch = _.debounce(doSearch, 200)

mainMap.init();
mainMap.map.on('locationfound', debouncedSearch);
mainMap.map.on('moveend', debouncedSearch);
// initial load
doSearch();

$('#timeline').on('ufoClick', function (e, extraData) {
  var marker = mainMap.markerLookup[extraData.markernum];
  marker && marker.openPopup();
});
