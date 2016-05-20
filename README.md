Demo Site: [http://people.oregonstate.edu/~molloys/maps/index.html](http://people.oregonstate.edu/~molloys/maps/index.html)

Google Maps API: [https://developers.google.com/maps/](https://developers.google.com/maps/)

Google Places API: [https://developers.google.com/places/](https://developers.google.com/places/)

Trimet API: [http://developer.trimet.org/](http://developer.trimet.org/)

#TransitTimer
The TransitTimer app is a web front end that displays a map of the Portland
downtown area with markers at Trimet MAX stops. Clicking on the markers will
display train arrival times for the various lines traveling through the stop.

The app is a front end only and pulls data from both Google Map and Places APIs
as well as the Trimet API for stop and arrivals time. No server is needed to
run this code, only a web browser and internet access. You will probably need
to replace a few API keys to get things working correctly.

#Quick Start
If you want to get things up and running quickly.
1. Get a Google Browser API key at: https://console.developers.google.com/apis
    1. Login and navigate to Credentials on the left menu.
    2. Create credentials and select a Browser key (you may need to create a
    project first).
    3. For starters don't setup the filters.
2. Open index.html, down near the bottom in the script tag, provide your new key
3. Get a Trimet API key at: http://developer.trimet.org/
    1. Under there getting started section, click the link to register for an
    AppID.
    2. Wait for the email to arrive, it was quick for me.
4. Open script.js, at the top replace the TRIMET_API_KEY with your new key
5. Open index.html in a web browser and enjoy

I used the latest version of Chrome for development and testing.