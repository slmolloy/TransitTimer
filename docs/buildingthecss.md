#The CSS
The CSS for the app is also fairly simple.
```css
html, body {
    height: 100%;
    margin: 0px;
    padding: 0px;
}

#map-canvas {
    width: 100%;
    height: 100%;
}

#pac-input {
    margin: 10px;
    padding: 8px;
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;
    border-radius: 2px;
    font-family: Roboto, Arial, sans-serif;
    font-size: 11px;
    width: 50%;
}
```
The html and body tags are configured so they can take up the full screen.
With the html and body set properly the map-canvas could then take up all the
screen space. Finally some stuff was added to the input box so that it would
line up nicely with the buttons that the Google Maps API has placed on the
screen.