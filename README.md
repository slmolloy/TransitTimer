[http://people.oregonstate.edu/~molloys/maps/index.html](http://people.oregonstate.edu/~molloys/maps/index.html)

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
2. Open index.html, down near the bottom in the script tag, provide your new key
3. Get a Trimet API key at: http://developer.trimet.org/
4. Open script.js, at the top replace the TRIMET_API_KEY with your new key
5. Open index.html in a web browser and enjoy

I used the latest version of Chrome.