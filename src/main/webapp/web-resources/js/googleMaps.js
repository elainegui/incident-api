var map, infoWindow;
//added 
var markerCurrentPosition;

var incidentIcons = defineIconPaths();

//added
var prev_infowindow =false;

function loadReportIncidentPage() {
    initMap();
    initAutocomplete();
}

function loadIncidentsAroundMapCenter() {
    latitude = map.getCenter().lat();
    longitude = map.getCenter().lng();
    radius = 10000;
    loadIncidents(latitude, longitude, radius);
}

function initMap() {
   // var currentLatitude = new google.maps.LatLng.position
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            //added
            var user_lat_long = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          //  if(user_lat_long.latitude!=position.coords.latitude&&user_lat_long.longitude!=position.coords.longitude){
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
          //  }else{

          //  }
            

            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: pos
            });

            //add marker on current position
            markerCurrentPosition = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'icons/user-pink-32.png'
            });

            var infoWindow = new google.maps.InfoWindow({
                content: `<button type="button" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${pos.lat}, ${pos.lng})">Report New Incident on this Location</button>`
            });

        


            markerCurrentPosition.addListener('click', function () {
                if( prev_infowindow ) {
                    prev_infowindow.close();
                 }
         
                 prev_infowindow = infoWindow;
                 infoWindow.open(map, markerCurrentPosition);
            });

            google.maps.event.addListener(map, 'click', function (event) {
                reportNewIncidentOnMarker(event.latLng.lat(), event.latLng.lng());
            });

            map.addListener('idle', function() {
                loadIncidentsAroundMapCenter();
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

function plotSingleIncident(incident) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(incident.latitude, incident.longitude),
        icon: incidentIcons[incident.type.id],
        map: map
    });
    var infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForIncident(incident)
    });
    marker.addListener('click', function () {
        if( prev_infowindow ) {
            prev_infowindow.close();
         }
 
         prev_infowindow = infoWindow;
        infoWindow.open(map, marker);
    });
}

function createInfoWindowContentForGroupOfIncidents(groupOfIncidents) {
    var groupedByTypeIdIncidents = groupIncidentsByType(groupOfIncidents);

    var beginning = '<div id= "incidentInfoWindow" class="container" id="base" style="width: 500px; overflow: auto">\n' +
                    '<div class="panel-group" id="accordion">\n';

    var middle = '';
    var firstIncident = null;
    for (var key in groupedByTypeIdIncidents) {
        var incidentsByType = groupedByTypeIdIncidents[key];
        firstIncident = incidentsByType[0];
        middle += `<div class="panel panel-default" id="incident-panel-div-${firstIncident.id}">`;
        middle += `<div class="panel-heading" id="incident-panel-div-${firstIncident.id}-heading">`;
        middle += `<h4 class="panel-title">`;
        middle += `<a class="accordion-toggle" data-parent="#accordion" data-toggle="collapse" href="#incident-panel-div-${firstIncident.id}-content">`;
        middle += `<img src="${incidentIcons[firstIncident.type.id]}"/>`;
        middle += `${incidentsByType.length} ${firstIncident.type.description}`;
        middle += `</a>`;
        middle += `</h4>`;
        middle += `</div>`;
        middle += `<div class="panel-collapse collapse" id="incident-panel-div-${firstIncident.id}-content">`;
        middle += `<div class="panel-body" style="display:block;">`;
        for (var incident of incidentsByType) {
            middle += `<div class= "incidentInfoWindow">` +
        `       <span>`+

        `           <img class="imgModal" src="${incident.image}" width="50px" onclick="openModalBox('${incident.image}')"></img>`+
        `       </span>`+
        `       <span>`+
        `           ${incident.message}` +
        `           ${formatDate(incident.date)}</br>` +
        `       </span>`+
        `       `+
       
        `       ` +
        `    </div> `;
        }

        middle += "</div></div></div>";
    }

    var ending = '</div>';
    ending += `<button type="button" class ="btn btn-primary btn-block btn-sm" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${firstIncident.latitude}, ${firstIncident.longitude})">Report New Incident on this Location</button>`;
    ending += '</div>';

    return beginning + middle + ending;
}

function plotSameCoordinatesIncidents(groupOfIncidents) {
    firstIncident = groupOfIncidents[0];
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(firstIncident.latitude, firstIncident.longitude),
        //icon: "mapicons/multiple.png",
        icon: "https://maps.gstatic.com/mapfiles/ms2/micons/purple-dot.png",
        map: map
    });
    var infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForGroupOfIncidents(groupOfIncidents)
    });
    console.log("new infowindow");
    marker.addListener('click', function () {
        if( prev_infowindow ) {
            prev_infowindow.close();
         }
 
         prev_infowindow = infoWindow;
        infoWindow.open(map, marker);
    });

    //added infowindow on mouse over through a multiple marker
     var infowindowMultipleMarker = new google.maps.InfoWindow({
            content: getMultipleMarkerContentIncidentCount(groupOfIncidents)
        });

    marker.addListener('mouseover', function(){
        infowindowMultipleMarker.open(map, marker);
    })

    marker.addListener('mouseout', function(){
        infowindowMultipleMarker.close();
    })

}
//group of incidents is an array of incidents (groupedIncidentsByLatLng[key])
function plotGroupOfIncidents(groupOfIncidents) {
    if (groupOfIncidents.length === 1) {
        incident = groupOfIncidents[0];
        plotSingleIncident(incident);
    } else {
        plotSameCoordinatesIncidents(groupOfIncidents);
    }
}

function groupIncidentsByType(incidents) {
    // key = type_id (integer)
    var dict = {};
    $.each(incidents, function (index, incident) {
        var key = incident.type.id;
        if (!(key in dict)) {
            dict[key] = new Array();
        }
        dict[key].push(incident);
    });
    return dict;
}

function groupIncidentsByLatLng(incidents) {
     key = latitude + "|" + longitude
    var dict = {};
    $.each(incidents, function (index, incident) {
        var key = incident.latitude + "|" + incident.longitude;
        if (!(key in dict)) {
            dict[key] = new Array();
        }
        dict[key].push(incident);
    });
    return dict;
}

//incidents is the data in json format
function plotIncidents(incidents) {
    // dictionary (key, value) where key = incident.latitude + "|" + incident.longitude
    var groupedIncidentsByLatLng = {};
    $.each(incidents, function (index, incident) {
        //the incidents are grouped by lat and lng (function above) using a dictionary
        groupedIncidentsByLatLng = groupIncidentsByLatLng(incidents);
    });

    for (var key in groupedIncidentsByLatLng) {
        var arrayOfIncidents = groupedIncidentsByLatLng[key];
        plotGroupOfIncidents(arrayOfIncidents);
    }

}

function createInfoWindowContentForIncident(incident) {
    // ` denotes JavaScript ECMA 6 template string
    var content =
        `<div>` +
        `    <div class= "incidentInfoWindow">` +
        `           <img class="imgModal" src="${incident.image}" width="50px" onclick="openModalBox('${incident.image}')"></img><br/><br/>`+
        `       ` +
        `       <span>`+
        `           ${incident.message}<br/>` +
        `           ${formatDate(incident.date)}` +
        `       </span>`+
        `       `+

        `    </div>` +
        `</div>` +
        `<button type="button" class ="btn btn-primary btn-block btn-sm" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${incident.latitude}, ${incident.longitude})">Report New Incident on this Location</button>`;

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

function getMultipleMarkerContentIncidentCount(groupOfIncidents){
    var groupedByTypeIdIncidents = groupIncidentsByType(groupOfIncidents);
    var content = ``;
    var firstIncident = null;
    for (var key in groupedByTypeIdIncidents) {
        var incidentsByType = groupedByTypeIdIncidents[key];
        firstIncident = incidentsByType[0];
        content+=`<div><a><img src="${incidentIcons[firstIncident.type.id]}"/>`;
        content+=`${incidentsByType.length} ${firstIncident.type.description}</a></div>`;
    } 
    return content
}


