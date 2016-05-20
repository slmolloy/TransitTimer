#API Overview
To make this web client app work, several APIs were needed from two different
sources. The Google Maps and Places APIs were used to generate the map, search
for transit stops and provide the auto complete search feature. Google's
APIs for transit are still under development and were difficult to use and just
as difficult to find documentation on. To get train arrival times, the
latitude and longitude of the transit stop from the Places API was used to
search the Trimet API for locations. A list of locations was often returned
from the Trimet API and the name of the transit stop from the Places API could
be used to identify the correct Trimet location. Once a Trimet location is
identified the location is used to search for arrivals data to be displayed in
the pop up info window.

Lets get started by looking at the minimum input required and a subset of the
response data to see how all of the pieces will fit together.

##Google Places API
Calling the Google Places API can be done with the following:
```javascript
service.nearbySearch({
  location: {lat: 45.519, lng: -122.679},
  radius: 1000,
  type: ['transit_station'],
  keyword: 'max'
}, callback);
```
When the API is done the callback method will be called with results array
and status string passed in.
Here is a sample of what the results array looks like. Several attributes are
removed for brevity and only two records are shown.
 ```json
[
  {
      "geometry": {
        "location": {
          "lat": 45.51991,
          "lng": -122.681919
        }
      },
      "name": "Galleria/SW 10th Ave MAX Station",
      "place_id": "ChIJ53RSvAQKlVQRM5VkPC8d6J4",
      "types": [
        "transit_station",
        "establishment"
      ]
    },
  {
      "geometry": {
        "location": {
          "lat": 45.51916,
          "lng": -122.68162000000001
        }
      },
      "name": "Library/SW 9th Ave",
      "place_id": "ChIJVXfBxQQKlVQRjGxqjrjXbvM",
      "types": [
        "transit_station",
        "establishment"
      ]
    }
]
 ```

##Trimet Stops API
With the above data we can now use the Trimet Stops API to look for the locID
as defined by Trimet for the stop in question.
The following curl command will get us the data we are looking for:
```bash
curl 'https://developer.trimet.org/ws/V1/stops?appID=188EB70D57290068482857DDD&json=true&ll=-122.681919,45.51991&meters=200'
```
Thats a long command. Here are the parts.
1. The hostname: https://developer.trimet.org
2. The API route: ws/V1/stops
3. The APP ID, you'll want to get your own: appID=YOUR_TRIMET_APP_ID
4. The data format of the response: json=true
5. The long/lat location to search (not this is opposite order of Google's
APIS): ll=LONG,LAT
6. The radius in meters to search: meters=RADIUS

This request will result in a json response that look like the following, again
I'm removing some records:
```json
{
    "resultSet": {
        "queryTime": "2016-05-19T22:29:52.038-0700",
        "location": [
            {
                "lng": -122.681918753514,
                "dir": "Westbound",
                "lat": 45.5199099188694,
                "locid": 8384,
                "desc": "Galleria/SW 10th Ave MAX Station"
            },
            {
              "lng": -122.681620407491,
              "dir": "Eastbound",
              "lat": 45.5191601075814,
              "locid": 8333,
              "desc": "Library/SW 9th Ave MAX Station"
            }
        ]
    }
}
```
If you look closely the lat/lng values from the Google Places API don't
match perfectly with the lat/lng values from the Trimet Stops API. In this
specific scenario they are close but in some situations the coordinates were
off by quite a bit. To make sure we find the right stop ID the radius of the
search was increased to include more stops and the names of the stops are
compared.
```javascript
if (locations[i].desc.includes(place.name)) {
  // The Trimet location[].desc and Google API place.name value are similar
}
```
Note that we aren't doing a equals comparison because Google often shortens
the name and is only a subset of the name that Trimet uses. There are some
situations in which the names were completely different but I didn't build in
support for these situations.

##Trimet Arivals API
After selecting a locid provided by the Stops API, the Arrivals API can now
be used to find train arrival times.
The following curl request will get us the arrivals information we need:
```bash
curl 'https://developer.trimet.org/ws/v2/arrivals?appID=188EB70D57290068482857DDD&json=true&locIDs=8384&arrivals=3&begin=2016-05-20T06:00:00&end=2016-05-20T09:00:00'
```
That one is even longer!
1. The hostname: https://developer.trimet.org
2. The API route: ws/v2/arrivals
3. The APP ID, you'll want to get your own: appID=YOUR_TRIMET_APP_ID
4. The data format of the response: json=true
5. The locID to search for: locIDs=8384 (Galleria MAX stop)
6. The number of arrivals to show: arrivals=3
7. The time to start searching (normally this would be the current time):
 begin=2016-05-20T06:00:00
8. The end time for the search (in the app this is longer to catch the scenario
when the max is closed for the night and won't open for several hours):
 end=2016-05-20T09:00:00

The json response for this request includes a fair bit of data, but the most
interesting part is the arrivals array.
```json
{
    "arrival": [
        {
            "scheduled": 1463749950000,
            "shortSign": "Blue to Hillsboro"
        },
        {
            "scheduled": 1463750850000,
            "shortSign": "Blue to Hillsboro"
        },
        {
            "scheduled": 1463750850000,
            "shortSign": "Red to Hillsboro"
        }
    ]
}
```
Again, there is a lot of data around and within the arrival array but I am only
showing what is needed for the app. With the shortSign we can group the
arrivals by train line and then display the time to arrival.
The scheduled time in in seconds since Unix Epoch. The app shows arrival times
in minutes up to 60 minutes then switches to time in HH:MM.