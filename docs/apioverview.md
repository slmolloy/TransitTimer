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

Lets get started by looking at the data.

##Google Places API
