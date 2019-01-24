var map, infoWindow;
var incidentIcons = defineIconPaths();

function loadReportIncidentPage() {
    initMap();
    initAutocomplete();
}

function initMap() {

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: pos
            });

            //add marker on current position
            var markerCurrentPosition = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'icons/user-pink-32.png'
            });

            initial_latitude = map.getCenter().lat();
            initial_longitude = map.getCenter().lng();
            radius = 200;
            loadIncidents(initial_latitude, initial_longitude, radius);

            var infoWindow = new google.maps.InfoWindow({
                content: `<button type="button" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${pos.lat}, ${pos.lng})">Report New Incident on this Location</button>`
            });

            markerCurrentPosition.addListener('click', function () {
                infoWindow.open(map, markerCurrentPosition);
            });

            google.maps.event.addListener(map, 'click', function (event) {
                reportNewIncidentOnMarker(event.latLng.lat(), event.latLng.lng());
            });


        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });

    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow
            .setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('autocomplete').value;
    if (address) {
        console.log("address: " + address);
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: '
                    + status);
            }
        });
    }
}

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

//added
var place;

function fillInAddress() {
    // Get the place details from the autocomplete object.

    //changed
    place = autocomplete.getPlace();

    for (var component in componentForm) {
        document.getElementById(component).value = '';
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }

    }
    syncMapWithAddress();
}

// Function to use the the browser's 'navigator.geolocation' object to get current location of user
function geolocate() {
    //added
    var currLat, currLng;
    
    if (navigator.geolocation) {

        //added

        navigator.geolocation.getCurrentPosition(function (position) {
            currLat = position.coords.latitude;
            currLng = position.coords.longitude;

            var geolocation = {
                //changed
                lat: currLat,
                lng: currLng
            };

            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

function syncMapWithAddress() {
    if (map) {
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    }
}

function defineIconPaths() {
    var iconBasePath = 'mapicons/';
    return [
        iconBasePath + 'burning-car.png',
        iconBasePath + 'semaphore.png',
        iconBasePath + 'street-light.png',
        iconBasePath + 'theft.png',
        iconBasePath + 'robbery.png',
        iconBasePath + 'road-work.png'
    ];
}

//changed
function plotIncident(incident) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(incident.latitude, incident.longitude),
        icon: incidentIcons[incident.type.id],
        map: map
    });
    var infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForIncident(incident)
    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
    //added
    google.maps.event.addListener(marker, "dblclick", function (e) { 
        console.log("marker db click"); 
     });
}

function plotIncidents(incidents) {
    $.each(incidents, function (index, incident) {
        plotIncident(incident);
    });
}

function createInfoWindowContentForIncident(incident) {
    // ` denotes JavaScript ECMA 6 template string
    var content =
        `<div>` +
        `    <div class= "incidentInfoWindow">` +
        `       ${incident.message}<br/>` +
        `        <img class="imgModal" src="${incident.image}" width="50px" onclick="openModalBox('${incident.image}')"></img>  <br/>` +
        `        ${incident.date}` +
        `    </div>` +
        `</div>` +
        `<button type="button" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${incident.latitude}, ${incident.longitude})">Report New Incident on this Location</button>`;

    return content;
}

function reportNewIncidentOnMarker(latitude, longitude) {
    //TODO close info windows??
    $(function () {
        $("#newIncidentForm").dialog({
            modal: true,
            resizable: true,
            show: 'blind',
            hide: 'blind',
            width: 400,
            dialogClass: 'ui-dialog-osx',
            buttons: {
                "Report": function() {
                    saveIncident(latitude, longitude);
                    $(this).dialog("close");
                },
                "Close": function() {
                    $(this).dialog('close');
                }
            }
        });
    });
}

function openModalBox(image) {
    $('#zoomModal').css("display", "block");
    $('#imgZoomModal').attr("src", image);
}

function closeModalBox() {
    $('#zoomModal').css("display", "none");
    $('#imgZoomModal').attr("src", '');
}



