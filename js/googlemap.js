var map;
var curLat = 11.2588;
var curLon = 75.7804;
var x = document.getElementById("Test");
var navbarHight = 65;
var jsonArray;

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

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

//The showPosition() function outputs the Latitude and Longitude
function showPosition(position) {
   // x.innerHTML = "Latitude: " + position.coords.latitude + 
   // "<br>Longitude: " + position.coords.longitude;

        debug_mobile = "..."+position.coords.accuracy;
        console.log(debug_mobile);

	var difference = (position.coords.latitude - curLat);
        if(difference < 0)difference=difference*-1;

        if(difference <= 0.0001)
	   return

	if(curLat == position.coords.latitude)
	   return;
	else // avoid reloading map if same lattitude
	  {curLat = position.coords.latitude;curLon=position.coords.longitude; }

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

	var infowindow = new google
                .maps
                .InfoWindow({content:"click"});

showDrivers(curLat,curLon);
beep();      
    console.log("position.coords.accuracy:"+position.coords.accuracy);
	
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}

function initMap() {
//beep();
//	alert("initMap");
    console.log("initMap");
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
    alert(lat);
    var image = {
        url: 'img/ayeauto_marker.png', // image is 512 x 512
        //scaledSize : new google.maps.Size(22, 32)
    };
    var resp = JSON.parse("[{\"app\": \"AyeAuto\", \"userType\": \"driver\", \"online\": true, \"fLon\": \"\", \"id\": 7, \"statistics\": \"count_MainBtnPress:25,count_PhoneBtnPress:0,incomingSearchNotifications:0,lastTimeOfUse:1504254224588\", \"from\": \"\", \"img\": \"http://s3.eu-central-1.amazonaws.com/bubcontacts/thumb_images/profile_sample.jpg\", \"lon\": 75.781433, \"fare_list\": \"\", \"to\": \"\", \"pickup\": false, \"tLon\": \"\", \"booked_status\": \"open\", \"confirm_to\": \"\", \"duration_aprx\": \"\", \"tLat\": \"\", \"db_set_time\": 0, \"pick_from\": \"\", \"distance_aprx\": \"\", \"hk\": \"test000007\", \"bbox\": [75.7828053, 11.2958606, 75.7828053, 11.2958606], \"in_call\": false, \"lat\": 11.2973647, \"number_plate\": \"KL-11-B-764\", \"fLat\": \"\", \"phone\": \"9895925028\", \"place\": \"Regal theater\", \"loc_time\": 1508513310967, \"acu\": 28.1000003815, \"activity\": \"active\", \"gtype\": 1}, {\"loc_time\": 1506958276834, \"statistics\": \"count_MainBtnPress:3,count_PhoneBtnPress:0,incomingSearchNotifications:2,lastTimeOfUse:1505229208635\", \"img\": \"http://s3.eu-central-1.amazonaws.com/bubcontacts/thumb_images/profile_sample.jpg\", \"phone\": \"9895925028\", \"online\": \"offline\", \"app\": \"AyeAuto\", \"in_call\": false, \"lon\": 75.786701, \"fare_list\": \"\", \"id\": 0, \"userType\": \"driver\", \"hk\": \"test000006\", \"booked_status\": \"open\", \"bbox\": [75.7828053, 11.2958579, 75.7828053, 11.2958579], \"acu\": 23.6000003815, \"activity\": \"active\", \"lat\": 11.298416, \"place\": \"Malikadavu\", \"gtype\": 1, \"number_plate\": \"KL-11-BE-1624\", \"confirm_to\": \"test000003\"}, {\"app\": \"AyeAuto\", \"userType\": \"driver\", \"online\": true, \"fLon\": \"\", \"id\": 8, \"statistics\": \"count_MainBtnPress:0,count_PhoneBtnPress:0,incomingSearchNotifications:0,lastTimeOfUse:1501937646640\", \"from\": \"\", \"img\": \"http://s3.eu-central-1.amazonaws.com/bubcontacts/thumb_images/profile_sample.jpg\", \"lon\": 75.7828067, \"fare_list\": \"\", \"to\": \"\", \"pickup\": false, \"tLon\": \"\", \"booked_status\": \"open\", \"confirm_to\": \"\", \"duration_aprx\": \"\", \"tLat\": \"\", \"db_set_time\": 0, \"pick_from\": \"\", \"distance_aprx\": \"\", \"hk\": \"test000001\", \"bbox\": [75.78238166666667, 11.287148333333334, 75.78238166666667, 11.287148333333334], \"in_call\": false, \"lat\": 11.2958647, \"number_plate\": \"KL-11-AD-6585\", \"fLat\": \"\", \"phone\": \"9895925028\", \"place\": \"easthill,kozhikode\", \"loc_time\": 1507795981817, \"acu\": 20, \"activity\": \"active\", \"gtype\": 1}]");
    //$.getJSON('https://ayeauto.live/markerResp1.html', function (autos) {
    //$.getJSON('http://approxy.ddns.net/ws?type=driver&latitude=11.2958647&longitude=75.7828067&rad=1', function (autos) {
	//console.log("autos:"+autos);
        //for (auto of resp) {
          //  var latLng = new google
            //    .maps
              //  .LatLng(auto.lat, auto.lon);
            //var marker = new google
              //  .maps
               // .Marker({position: latLng, map: map, icon: image, title: "auto.phone"});

//            var infowindow = new google
  //              .maps
    //            .InfoWindow({content: "auto.phone"});

      //      marker.addListener('click', function () {
        //        infowindow.open(map, marker);
          //  });
        //}
        //jsonArray=JSON.parse(autos);
	//jsonArray.forEach(markerFunction);
   // });
	/*
	$.ajax({
        url:'approxy.noip.me/ws?type=driver_debug'
        dataType : 'json',
        async : false,
        success : function(autos) { 
                jsonArray=JSON.parse(autos);
		jsonArray.forEach(markerFunction);
            }
	});
	*/
$.getJSON("http://approxy.ddns.net/ws?type=driver&latitude=11.2958647&longitude=75.7828067&rad=1", function(data) {
  alert("success");
  $(".mypanel").html(JSON.stringify(data));
})
.done(function() { alert('getJSON request succeeded!'); })
.fail(function() { alert('getJSON request failed! '); })
.always(function() { alert('getJSON request ended!'); });
}

// $.getJSON('https://ayeauto.live/markerResp1.html', function (autos) {
//	 jsonArray=JSON.parse(autos);
	
//});

function markerFunction2(auto){
var image = {
        url: 'img/ayeauto_marker.png', // image is 512 x 512
        //scaledSize : new google.maps.Size(22, 32)
    };

}

function markerFunction(auto) {
    var image = {
        url: 'img/ayeauto_marker.png', // image is 512 x 512
        //scaledSize : new google.maps.Size(22, 32)
    };
    //debug_mobile = debug_mobile + auto.lat + "<br>";
    
    var coor = auto.location.coordinates; // coor[0] = lon , coor[1]=lattitude
    
    var latLng = new google
                .maps
                .LatLng(coor[1], coor[0]);
    var marker = new google
                .maps
                .Marker({position: latLng, map: map, icon: image, title: "auto.number_plate"});

    var infowindow = new google
                .maps
                .InfoWindow({content: auto.app});

     marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
}

