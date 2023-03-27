eqUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
  
    // Create a baseMaps object to hold the streetmap & topomap layer.
    var baseMaps = {
      "Street Map": streetmap,
      "Topography": topo
    };
  
    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    var map = L.map("map", {
      center: [40.73, -74.0059],
      zoom: 2,
      layers: [streetmap, topo, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }


  function createMarkers(response) {

    // Pull the "stations" property from response.data.
    var features = response.features;
    // var lat = d.features[0].geometry.coordinates[0];
    // var long = d.features[0].geometry.coordinates[1];
    // var depth = d.features[0].geometry.coordinates[2];
    // var magn = d.features[0].properties.mag;

  
    // Initialize an array to hold bike markers.
    var eqMarkers = [];
  
    // Loop through the stations array.
    for (var i = 0; i < features.length; i++) {
    var eq = features[i];
    var lat = eq.geometry.coordinates[1];
    var long = eq.geometry.coordinates[0];
    var depth = eq.geometry.coordinates[2];
    var magn = eq.properties.mag;
  
      // For each station, create a marker, and bind a popup with the station's name.
      var eqMarker = L.marker([lat, long])
        .bindPopup("<h3>" + eq.properties.place + "<h3><h3>Magnitude: " + magn + "</h3>");
  
      // Add the marker to the bikeMarkers array.
      eqMarkers.push(eqMarker);
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(eqMarkers));
  }

d3.json(eqUrl).then(createMarkers);
