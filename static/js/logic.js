eqUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    // var stamenwc = L.tileLayer.provider('Stamen.Watercolor' {
    // attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    // });


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
        //   center: [34.42, -119.69], // santa barbara coordinates
        center: [25, 0],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Create a legend to display information about our map.
    var info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend".
    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        var legendInfo = ["<h3>Depth of Earthquake</h3>",
        "<p class='shallow' style = background-color: lightgreen> < 10 </p>",
        "<p class='deep' style = background-color: green> 10 - 30</p>",
        "<p class='deeper'style = background-color: cadetblue>30- 50 </p>",
        "<p class='evendeeper'style = background-color: lightred> 50 - 70 </p>",
        "<p class='wowthatsdeep'style = background-color: red> 70-90</p>",
        "<p class='deepest'style = background-color: darkred> 90+ </p>"]
        div.innerHTML = legendInfo;
        return div;
    };
    // Add the info legend to the map.
    info.addTo(map);
}

colorList = ["lightgreen","green","cadetblue","lightred","red","darkred"]
// Write function to handle dynamic coloring of earthquake data
function depthColor(deep) {
    if (deep < 10) {
        return "lightgreen"
    }
    else if (deep < 30) {
        return "green"
    }
    else if (deep < 50) {
        return "cadetblue"
    }
    else if (deep < 70) {
        return "lightred"
    }
    else if (deep < 90) {
        return "red"
    }
    else {
        return "darkred"
    }

};

function createMarkers(response) {

    // Pull the features property from response.
    var features = response.features;
    // var lat = d.features[0].geometry.coordinates[0];
    // var long = d.features[0].geometry.coordinates[1];
    // var depth = d.features[0].geometry.coordinates[2];
    // var magn = d.features[0].properties.mag;


    // Initialize an array to hold markers.
    var eqMarkers = [];

    // Loop through the features array.
    for (var i = 0; i < features.length; i++) {
        var eq = features[i];
        var lat = eq.geometry.coordinates[1];
        var long = eq.geometry.coordinates[0];
        var depth = eq.geometry.coordinates[2];
        var magn = eq.properties.mag;

        // For each earthquake, create a marker, and bind a popup with the earthquakes's data.
        var eqMarker = L.circle([lat, long],
            {
                fillOpacity: 0.5,
                color: depthColor(depth),
                fillColor: depthColor(depth),
                radius: magn * 55000
            }
        )
            .bindPopup("<h3>" + eq.properties.place + "<h3><h3>Magnitude: " + magn + "</h3>");

        // Add the marker to the array.
        eqMarkers.push(eqMarker);
    }

    // Create a layer group that's made from the markers array, and pass it to the createMap function.
    createMap(L.layerGroup(eqMarkers));
}


// Run the call and push the response to the createMarkers function 
d3.json(eqUrl).then(createMarkers);
