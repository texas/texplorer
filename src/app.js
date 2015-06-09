var _ = require('lodash');
import * as mainMap from './map';
var timeline = require('./timeline');
var search = require('./search');


function _gotResults(data) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`got ${data.hits.hits.length} out of ${data.hits.total}`);
  }
  mainMap.markersLayer.clearLayers();
  var bounds = mainMap.map.getBounds();
  var visibleMarkers = data.hits.hits;
  if (!visibleMarkers.length) {
    // bail
    // TODO handle when there's nothing to show
    return;
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
