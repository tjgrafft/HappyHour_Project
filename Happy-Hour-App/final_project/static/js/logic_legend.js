//function createMap(layers) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });
  
    var layers = {
    EXPENSIVE: new L.LayerGroup(),
    MODERATE: new L.LayerGroup(),
    CHEAP: new L.LayerGroup()
    };
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
    center: [30.266666, -97.733330],
    zoom: 12,
    layers: [
      layers.EXPENSIVE,
      layers.MODERATE,
      layers.CHEAP,
    ]
    });

    // Add our 'lightmap' tile layer to the map
    lightmap.addTo(map);
    
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "High-end": layers.EXPENSIVE,
      "Moderate": layers.MODERATE,
      "Affordable": layers.CHEAP 
    };

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
    }).addTo(map);

    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
    };
    // Add the info legend to the map
    info.addTo(map);

//}
  
//function createMarkers(response) {
  
// Perform an API call to the Citi Bike Station Information endpoint
d3.json("/specials", function(response) {  
    // Pull the "stations" property off of response.data
    var data = response;


    // Create an object to keep of the number of markers in each layer
    var happyCount = {
        EXPENSIVE: 0,
        MODERATE: 0,
        CHEAP: 0,
    };
  
    // Initialize an array to hold bike markers
    var updatedAt = new Date();
    var happyCode; 

  
      var icons = {
          EXPENSIVE: L.ExtraMarkers.icon({
              icon: "fa-cocktail",
              markerColor: "red",
              shape: "circle",
              prefix: "fas"
          }),
          MODERATE: L.ExtraMarkers.icon({
              icon: "fa-hamburger",
              markerColor: "yellow",
              shape: "square",
              prefix: "fas"
          }),
          CHEAP: L.ExtraMarkers.icon({
              icon: "fa-coffee",
              markerColor: "green",
              shape: "square",
              prefix: "fas"
          })
      };
  
    // Loop through the stations array
    for (var index = 0; index < data.length; index++) {
      var d = data[index];
  
      if (d.price === "$$$$") {
          happyCode = "EXPENSIVE";
      }
        // If a station has no bikes available, it's empty
      else if (d.price === "$$$") {
          happyCode = "EXPENSIVE";
      }
      else if (d.price === "$$") {
          happyCode = "MODERATE";
      }
      else {
          happyCode = "CHEAP"
      }

      // Update the station count
      happyCount[happyCode]++;
      
      // For each station, create a marker and bind a popup with the station's name
        var happyMarker = L.marker([d.latitude, d.longitude], {
            icon: icons[happyCode]
        });

      // Add the new marker to the appropriate layer
        happyMarker.addTo(layers[happyCode]);

        happyMarker.bindPopup("<h3>" + d.name + "<h3>Specials: " + d.description + "<h3><h3>Price: $" + d.price + "<h3>");


        // Create a layer group made from the bike markers array, pass it into the createMap function
        //createMap(layers);
    }  
        // Call the updateLegend function, which will... update the legend!
        updateLegend(updatedAt, happyCount);

      
  
    
});

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, happyCount) {
    document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='expensive'>High-End ($$$+): " + happyCount.EXPENSIVE + "</p>",
    "<p class='moderate'>Moderate ($$): " + happyCount.MODERATE + "</p>",
    "<p class='cheap'>Affordable ($): " + happyCount.CHEAP + "</p>"
    ].join("");
}
  
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
//d3.json("/specials", createMarkers);