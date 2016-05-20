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
to make life easy. The ```map``` is where the map lives and the ```infoWindow```
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