// Replace this with your own app id
// http://developer.trimet.org/
TRIMET_APP_ID = '188EB70D57290068482857DDD';

var map;
var infoWindow;
var portland = {lat: 45.519, lng: -122.679};
var searchBound = .01;
var radius = 1000;

function initMap() {
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(portland.lat - searchBound, portland.lng - searchBound),
    new google.maps.LatLng(portland.lat + searchBound, portland.lng + searchBound));
  var searchOptions = {
    bounds: defaultBounds,
    type: 'transit_station'
  };
  var nearbySearchOptions = {
    location: portland,
    radius: radius,
    type: ['transit_station'],
    keyword: 'max'
  };

  var mapDiv = document.getElementById('map-canvas');
  map = new google.maps.Map(mapDiv, {
    center: portland,
    zoom: 17
  });

  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(input, searchOptions);

  infoWindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(nearbySearchOptions, nearbySearchCallback);

  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
}

function nearbySearchCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  } else {
    console.log("Error");
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    var request = {
      placeId: place.place_id
    };
    var service = new google.maps.places.PlacesService(map);

    service.getDetails(request, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        showArrivals(place, map, marker);
      }
    });
  });
}

function showArrivals(place, map, marker) {
  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();
  var stopSearchRadius = 200;

  // Make call to trimet API with something like:
  // https://developer.trimet.org/ws/V1/stops?appID=188EB70D57290068482857DDD&ll=-122.679475,45.519253&meters=1000&json=true
  // Search results for resultSet.location[].desc = place.name
  // Get locid from the location.
  var req = new XMLHttpRequest();
  req.open('GET', buildStopsUrl(lat, lng, stopSearchRadius), true);

  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var locationDesc;
      for (var i = 0; i < response.resultSet.location.length; i++) {
        if (response.resultSet.location[i].desc.includes(place.name)) {
          var stop = response.resultSet.location[i];
          locationDesc = '<b>' + stop.desc + '</b>';
          locationDesc += '<br>locID=' + stop.locid;
          locationDesc += '<br>lat=' + lat;
          locationDesc += '<br>lng=' + lng;
          getArrivals(stop, map, marker);
        }
      }
      if (locationDesc === undefined) {
        locationDesc = 'Oops! Couldn\'t find information for this stop';
      }
      infoWindow.setContent(locationDesc);
      infoWindow.open(map, marker);
      return locationDesc;
    }
  });
  req.send(null);

  return place.name + '<br>Lat:' + lat + '<br>Lng:' + lng;
}

function getArrivals(stop, map, marker) {
  var arrivalCount = 3;
  var minuteDisplayThreshold = 60;
  var req = new XMLHttpRequest();

  // Using locid query for arrivals at the stop id using something like:
  // https://developer.trimet.org/ws/v2/arrivals?appID=188EB70D57290068482857DDD&locIDs=7777&arrivals=5&json=true&begin=2016-05-19T06:00:00&end=2016-05-19T09:00:00
  // The results will be in the resultSet.arrival[]. Group results by shortSign and convert scheduled time in ms since epoch to time format.
  // When quering this api, arrivals will be number of arrival times for each type of route. begin and end time should be set to now and sometime 12 or more hours out to ensure data always comes back.
  // If end time is left out, it will auto set to 1 hour after begin.
  req.open('GET', buildArrivalsUrl(stop.locid, arrivalCount), true);

  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var arrivals = response.resultSet.arrival;
      var nowTime = new Date().getTime();
      var timeDiff;
      var locationDesc = '';
      var arrivalMap = {};
      for (var i = 0; i < arrivals.length; i++) {
        if (!(arrivals[i].shortSign in arrivalMap)) {
          arrivalMap[arrivals[i].shortSign] = [];
        }
        if (arrivalMap[arrivals[i].shortSign].length < arrivalCount) {
          timeDiff = arrivals[i].scheduled - nowTime;
          timeDiff = Math.floor(timeDiff / 1000 / 60);
          if (timeDiff <= minuteDisplayThreshold) {
            arrivalMap[arrivals[i].shortSign].push(timeDiff + ' minutes');
          } else {
            var d = new Date(0);
            d.setUTCMilliseconds(arrivals[i].scheduled);
            arrivalMap[arrivals[i].shortSign].push(padNum(d.getHours(), 2) + ':' + padNum(d.getMinutes(), 2));
          }
        }
      }
      for (var key in arrivalMap) {
        locationDesc += '<br><b>' + key + '</b>';
        for (var i = 0; i < arrivalMap[key].length; i++) {
          locationDesc += '<br>' + arrivalMap[key][i];
        }
      }
      infoWindow.setContent(infoWindow.getContent() + '<br>' + locationDesc);
      infoWindow.open(map, marker);
    }
  });
  req.send(null);
}

function buildStopsUrl(lat, lng, stopSearchRadius) {
  var url = 'https://developer.trimet.org/ws/V1/stops?';
  url += trimetParams();
  url += '&ll=' + lng + ',' + lat;
  url += '&meters=' + stopSearchRadius;
  return url;
}

function buildArrivalsUrl(locid, numResults) {
  var begin = Math.floor(((new Date().getTime()) / 1000));
  var url = 'https://developer.trimet.org/ws/v2/arrivals?';
  url += trimetParams();
  url += '&locIDs=' + locid;
  url += '&arrivals=' + numResults;
  url += '&begin=' + begin;
  url += '&end=' + begin + (60 * 60 * 8);
  return url;
}

function trimetParams() {
  return 'appID=' + TRIMET_APP_ID + '&json=true';
}

function padNum(value, totalSize) {
  var result = value + '';
  while (result.length < totalSize) {
    result = '0' + result;
  }
  return result;
}