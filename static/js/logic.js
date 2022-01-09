// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  console.log(data);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  // Colors for depth
  function color(depth) {
    if (depth>200) {
      return "#FF0D0D";
    }
    else if (depth>100) {
      return "#FF4E11";
    }
    else if (depth>50) {
      return "#FF8E15";
    }
    else if (depth>30) {
     return "#FAB733";
      }
    else if (depth>10) {
      return "#ACB334";
        }  
    else {
      return "#69B34C";
    }
  }; 
  console.log(earthquakeData);
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Style circles for each earthquake.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return new L.circleMarker(latlng, {
        radius: (feature.properties.mag)*4,
        color: color(feature.geometry.coordinates[2]),
        fillOpacity: .5,
        weight: 0.5
      });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
    //  37.09, -35.71
        10,0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Add Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
    var div = L.DomUtil.create('div', 'info legend');

    var colors = ["#69B34C",
                "#ACB334",
                "#FAB733",
                "#FF8E15",
                "#FF4E11",
                "#FF0D0D"];

    var depths = ["0-10",
                "10-30",
                "30-50",
                "50-100",
                "100-200",
                "200+"];

    var labels = [];

    var legendInfo = "<h1>Earthquake Depth</h1>";
        
    div.innerHTML = legendInfo;
 
    for (var i = 0; i < depths.length; i++) {
        labels.push('<li style="background-color:' + colors[i] + '"> <span>' + depths[i] + '</span></li>');
    }

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
    };
  
    legend.addTo(myMap);  
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
