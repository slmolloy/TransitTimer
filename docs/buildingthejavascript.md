#The JavaScript
I am not including the JavaScript as it is a bit long and can be downloaded
from the demo site or the Git repository.

Instead I'll describe the key bits with some documentation.

##Some Useful Variables
```javascript
var map;
var infoWindow;
var portland = {lat: 45.519, lng: -122.679};
var radius = 1000;
```
These are some variables used throughout the app and defined with global scope
to make life easy. The ```map``` is where the map is drawn and the ```infoWindow```
is where the pop-up content is displayed.

There are also a few useful objects defined within the main ```initMap``` method.
```javascript
  var nearbySearchOptions = {
    location: portland,
    radius: radius,
    type: ['transit_station'],
    keyword: 'max'
  };
```
The one of most interest pertaining to the Google Places API is the
```nearbySearchOptions```. This uses the variables defined above and specifies
the search criteria for the API.

##Entry Point
So there are some useful variables defined, but how does everything get started.
The trick to this lies in the ```index.html``` file where the Google API script
is included. In the src of the script there is a query parameter of ```callback```
equal to ```initMap```. Additionally the script tag contains ```async defer```.
All of this combined will cause the ```initMap``` method to be called after the
script has been successfully loaded.

So what does ```initMap``` have? The biggest responsibility is to trigger the
search of transit stops. The search API takes a callback method and from there
the app uses a series of callback methods to fetch data and update the DOM.

Here are the guts of ```initMap```:
```javascript
// Setup the mapDiv and map object
var mapDiv = document.getElementById('map-canvas');
    map = new google.maps.Map(mapDiv, {
    center: portland,
    zoom: 17
});

// Initialize the infoWindow where results will go
infoWindow = new google.maps.InfoWindow();

// Setup the PlacesService with the map object
var service = new google.maps.places.PlacesService(map);

// And the first API call to Google Places. The options are defined above and
// the processing of the response will be done in the callback.
service.nearbySearch(nearbySearchOptions, nearbySearchCallback);
```

##Creating Markers
The ```nearbySearchCallback``` will provide the data needed to draw markers on
the map for each max stop found in the search. The callback simply checks the
status then loops through the results using a helper method to create markers.
```javascript
function nearbySearchCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
```
The ```createMaker``` method was left separate so potentially other search
features could use the same method to create marker points. Creating a marker
simply involves calling a Google API providing a marker object and a callback
for the click event.
```javascript
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    showArrivals(place, map, marker);
  });
}
```
This will get the markers to display and the page is now ready for user
interaction. When the user clicks on a marker the showArrivals callback is used
to show the pop-up.

##Showing Arrival Times
When a user clicks on a marker the app will fetch the current arrivals time and
display this info in the ```infoWindow```. Note that in my current
implementation the stops API is called first to retrieve stop information then
when the correct locID is identified from the stops, the arrivals API is called.
This results in two API calls needing to be made before the user can see arrival
times. It would be better to fetch the stop information and possibly even the
arrivals time asynchronously after the initial search is completed.

The ```showArrivals``` method receives the places, map and markers object and
starts the API calls to get arrival time information. Here is the slimmed down
verion of the method.
```javascript
function showArrivals(place, map, marker) {
  var req = new XMLHttpRequest();
  req.open('GET', buildStopsUrl(lat, lng, stopSearchRadius), true);

  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var locationDesc;
      var locations = response.resultSet.location;
      for (var i = 0; i < locations.length; i++) {
        if (locations[i].desc.includes(place.name)) {
          locationDesc = '<b>' + stop.desc + '</b>';
          getArrivals(locations[i], map, marker);
          break;
        }
      }
      infoWindow.setContent(locationDesc);
      infoWindow.open(map, marker);
      return locationDesc;
    }
  });
  req.send(null);

  return place.name;
}
```
This is where we initiate a REST API call as we did in class. The ```buildStopUrl```
method is a helper than generates a URL to be used for the request. The request
is async and a callback listener is setup to handle the response. During the
handling of the response a call to ```getArrivals``` is made where the final
arrivals information will be gathered and displayed. The ```getArrivals```
method will asynchronously call the arrivals API so it the data for that may
not show up right away. In the mean time the ```infoWindow``` is updated with
the current information about the location and displayed on the screen.

The final step in showing the arrival times is to fetch and display the times
from Trimet's Arrivals API. The load event handler in the ```showArrivals```
method will provide the ```getArrivals``` method with the stop information
needed for making this final API call.
```javascript
function getArrivals(stop, map, marker) {
  var req = new XMLHttpRequest();
  req.open('GET', buildArrivalsUrl(stop.locid, arrivalCount), true);

  req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        var arrivals = response.resultSet.arrival;
        var nowTime = new Date().getTime();
        var locationDesc = '';
        var arrivalMap = {};
        for (var i = 0; i < arrivals.length; i++) {
          if (!(arrivals[i].shortSign in arrivalMap)) {
            arrivalMap[arrivals[i].shortSign] = [];
          }
          if (arrivalMap[arrivals[i].shortSign].length < arrivalCount) {
            arrivalMap[arrivals[i].shortSign].push(getTimeDisplay(
                nowTime, arrivals[i].scheduled, minuteDisplayThreshold));
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
```
Like the previous ```showArrivals``` method, the ```getArrivals``` method calls
an external REST API asynchronously using the techniques used in class. The
callback setup to handle the response does two things. First it iterates over
the arrivals data recieved by the API. During development I noticed that
sometimes more data came in the response than expected, even with the
appropriate query parameters set. This is a beta API according to Trimet
documentation. To prevent too much data from getting displayed I have a check
to only add more arrival information if I haven't reached the limit yet. As
I iterate over the list of arrivals the times are added to a map based on the
```shortSign``` value from the response data. This ```shortSign``` value
provides the route name and direction which is the basic information needed
for uses to identify which train is coming. In the current implementation a max
of 3 arrival times for each ```shortSign``` value will be presented. The second
for loop here builds the 3 arrival times for each ```shortSign``` into a string
that can be displayed in the ```infoWindow```. The ```infoWindow``` should
already be open at this point, but just in case, the open method is called
again.