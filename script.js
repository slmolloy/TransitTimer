function initMap() {

  var mapDiv = document.getElementById('map-canvas');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 45.523, lng: -122.676},
    zoom: 16
  });


  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(45.513, -122.686),
    new google.maps.LatLng(45.533, -122.666));

  var options = {
    bounds: defaultBounds,
    types: ['transit_station']
  };

  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(input, options);
}