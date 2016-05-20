#The HTML
The HTML for this page is very simple. The most complex part is the script tag.
```html
<!doctype html>
<html>
<head>
  <title>TransitTimer</title>
  <link rel="stylesheet" href="style.css" type="text/css">
</head>
<body>

  <input id='pac-input' class='controls' type='text' placeholder='Start typing here'>
  <div id='map-canvas'></div>

  <script src='script.js'></script>
  <!-- You will need to replace the key with your own from https://console.developers.google.com/apis -->
  <script src='https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyA1Rl0lvw55lPuNmzh7xeETmc3uvByVXL4&libraries=places' async defer></script>
</body>
</html>
```
That's it. There is a link tag for the css, an input for the search feature,
a div where that is the holder of the map and two script tags for our code as
well as the Google API reference.

##The Google API Script Tag
The script tag that includes the Google API has a lot going on.
1. The part of the path with ```js``` after ```/maps/api``` tells Google we
want to use the JavaScript library.
2. The ```callback=initMap``` combined with the ```async defer``` at the end
will allow our ```initMap``` method to be called asynchronously after the
script has been loaded. This ensures the library is ready for use before an
attempt is made to use it.
3. The key is my personal key and you'll want to get your own and change it.
4. The last url parameter ```libraries=places``` is what instructs Google to
provide us with the Places API. This will cause the library to be downloaded
and loaded into the browser for use in our ```initMap``` method and beyond.