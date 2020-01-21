var map;
var curLat = 11.2588;
var curLon = 75.7804;

var navbarHight = 65;

$(window).on('resize', function () {
    $("#map").height($(window).height() - navbarHight);
    $("#map").width($(window).width());
}).trigger('resize'); //on page load

function initAutocomplete() {
    map = new google
        .maps
        .Map(document.getElementById('map'), {
            center: {
                lat: 20.5937,
                lng: 78.9629
            },
            zoom: 5,
            mapTypeId: 'roadmap'
        });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google
        .maps
        .places
        .SearchBox(input);
    map
        .controls[google.maps.ControlPosition.TOP_LEFT]
        .push(input);

    showDrivers(curLat, curLon);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers
            .forEach(function (marker) {
                marker.setMap(null);
            });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google
            .maps
            .LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google
                    .maps
                    .Size(71, 71),
                origin: new google
                    .maps
                    .Point(0, 0),
                anchor: new google
                    .maps
                    .Point(17, 34),
                scaledSize: new google
                    .maps
                    .Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({map: map, icon: icon, title: place.name, position: place.geometry.location}));

            showDrivers(place.geometry.location.lat(), place.geometry.location.lng());

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

//The showPosition() function outputs the Latitude and Longitude
function showPosition(position) {
   // x.innerHTML = "Latitude: " + position.coords.latitude + 
   // "<br>Longitude: " + position.coords.longitude;

	if(curLat == position.coords.latitude)
	   return;
	else // avoid reloading map if same lattitude
	  curLat = position.coords.latitude;

	map = new google
        .maps
        .Map(document.getElementById('map'), {
            zoom: 15,
            center: new google
                .maps
                .LatLng(position.coords.latitude, position.coords.longitude),
            mapTypeId: 'terrain'
        });

	var newLoc = {lat: position.coords.latitude, lng: position.coords.longitude};


	var markerg =  
               new google.maps.Marker({position:newLoc, map:map, title:"You are here!"}); 
}

function initMap() {
    map = new google
        .maps
        .Map(document.getElementById('map'), {
            zoom: 15,
            center: new google
                .maps
                .LatLng(curLat, curLon),
            mapTypeId: 'terrain'
        });

	if (navigator.geolocation) {
      //the watchposition() method show the position of the user and update it while is moving
        navigator.geolocation.watchPosition(showPosition);
    } 
    //showDrivers();
}

function showDrivers(lat, lon) {
    console.log("showDrivers" + lat);
    var image = {
        url: 'img/ayeauto_marker.png', // image is 512 x 512
        //scaledSize : new google.maps.Size(22, 32)
    };
    $.getJSON('http://aproxy.noip.me/api?latitude=' + lat + '&longitude=' + lon + '&rad=10.0&type=driver', function (autos) {
	//console.log("autos:"+autos);
        for (auto of autos) {
            var latLng = new google
                .maps
                .LatLng(auto.latitude, auto.longitude);
            var marker = new google
                .maps
                .Marker({position: latLng, map: map, icon: image, title: auto.phone});

            var infowindow = new google
                .maps
                .InfoWindow({content: auto.phone});

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        }
    });
}
