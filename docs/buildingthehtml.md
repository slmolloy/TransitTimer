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