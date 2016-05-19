var map;
var infoWindow;

function initMap() {
  var portland = {lat: 45.519, lng: -122.679};
  var searchBound = .01;
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(portland.lat - searchBound, portland.lng - searchBound),
    new google.maps.LatLng(portland.lat + searchBound, portland.lng + searchBound));
  var searchOptions = {
    bounds: defaultBounds,
    type: 'transit_station'
  };
  var nearbySearchOptions = {
    location: portland,
    radius: 1000,
    type: ['transit_station'],
    keyword: 'max'
  };

  var mapDiv = document.getElementById('map-canvas');
  map = new google.maps.Map(mapDiv, {
    center: portland,
    zoom: 19
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
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  //marker.addListener('click', placeDetailsCallback);
  google.maps.event.addListener(marker, 'click', function() {
    var request = {
      placeId: place.place_id
    };
    var service = new google.maps.places.PlacesService(map);
    //service.getDetails(request, placeDetailsCallback);
    service.getDetails(request, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        infoWindow.setContent(place.name);
        infoWindow.open(map, marker);
      }
    });
  });
}