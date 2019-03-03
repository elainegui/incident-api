var map, infoWindow, geocoder;
//added 
var markerCurrentPosition;

//added
var groupOfIncidents=null;

//added
//var infowindowMultipleMarker2nd = null;

var incidentIcons = defineIconPaths();

//added
var prevInfowindow =false;

function loadReportIncidentPage() {
    initMap();
    initAutocomplete();
}

function loadIncidentsAroundMapCenter() {
    latitude = map.getCenter().lat();
    longitude = map.getCenter().lng();
    radius = 10000; //in meters
    loadIncidents(latitude, longitude, radius);
}

function initMap() {
    // creating a geocoder instance to perform coordinates conversion into addresses
    geocoder = new google.maps.Geocoder;
    // var currentLatitude = new google.maps.LatLng.position
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

        
            var user_lat_long = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

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
               // content: `<button type="button" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${pos.lat}, ${pos.lng})">Report New Incident on this Location</button>`
               content: `<button type="button" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${pos.lat}, ${pos.lng})">Report New Incident</button>`
                        //`<button type= "button" onclick="reportNewIncidentOnMarker(lat,lng)" `
            });

            //create infowindow to current position
            markerCurrentPosition.addListener('click', function () {
                if( prevInfowindow ) {
                    prevInfowindow.close();
                 }
         
                 prevInfowindow = infoWindow;
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
    //console.log("init autocomplete");
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
    //console.log("place: "+place);

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

function reportNewIncidentOnMarker(latitude, longitude) {
    if(prevInfowindow){
    prevInfowindow.close();
}
// $("div#newIncidentForm").dialog ().prev ().find (".ui-dialog-titlebar-close").css("background-color", "yellow");
// $("div#newIncidentForm").dialog ().prev ().find (".ui-dialog-titlebar-close").addClass("ui-icon-closethick")
$(function () {
         $("#newIncidentForm").dialog({
             modal: true,
             resizable: true,
             show: 'blind',
             hide: 'blind',
/*              width: 370,
             height:430, */
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

//incidents is the data in json format
function plotIncidents(incidents) {
    // dictionary (key, value) where key = incident.latitude + "|" + incident.longitude
    var groupedIncidentsByLatLng = {};
    $.each(incidents, function (index, incident) {
        //the incidents are grouped by lat and lng (function above) using a dictionary
        groupedIncidentsByLatLng = groupIncidentsByLatLng(incidents);
    });

    //groupedIncidentsByLatLng is a dictionary where key is latitude|longitude and value is incident
    for (var key in groupedIncidentsByLatLng) {
        var arrayOfIncidents = groupedIncidentsByLatLng[key];
        //groupOfIncidents = groupedIncidentsByLatLng[key];
        plotGroupOfIncidents(arrayOfIncidents);
    }

}

//dict where key is latitude|longitude and value is incident
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

//group of incidents is an array of incidents (groupedIncidentsByLatLng[key])
//for each key (=lat|lng) where value is an incident
function plotGroupOfIncidents(groupOfIncidents) {
    //console.log("groupOfIncidents"+groupOfIncidents)
    if (groupOfIncidents.length === 1) {
        incident = groupOfIncidents[0];
        plotSingleIncident(incident);
    } else {
        plotSameCoordinatesIncidents(groupOfIncidents);
    }
}

function plotSingleIncident(incident) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(incident.latitude, incident.longitude),
        // icon: incidentIcons[incident.type.id],
        icon: "icons/icons8-marker-30.png",
        map: map
    });
    var infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForIncident(incident)
    });
    marker.addListener('click', function () {
        if( prevInfowindow ) {
            prevInfowindow.close();
         }
 
         prevInfowindow = infoWindow;
        infoWindow.open(map, marker);
    });
}

//added
    //added
    var groupOfInc2=null;

//groupOfIncidents is a dictionary where key is lat/lng and value is an incident
function plotSameCoordinatesIncidents(groupOfIncidents) {
    //console.log("groupOfIncidents"+groupOfIncidents);
    firstIncident = groupOfIncidents[0];

    //for each group of incidents is created a marker
    var markerMultiple = new google.maps.Marker({
        position: new google.maps.LatLng(firstIncident.latitude, firstIncident.longitude),
        //icon: "mapicons/multiple.png",
        icon: "icons/icons8-marker-30.png",
        map: map
    });


    /*  commented to change infowindow layout
    var infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForGroupOfIncidents(groupOfIncidents)
    });
    console.log("new infowindow");
 */
    //added second infowindow
/*     var infowindowMultipleMarker2nd = new google.maps.InfoWindow({
        content: createInfoWindowContentForGroupOfIncidents(groupOfIncidents)
    }); */

    // for each group of incident there is a infowindow
    var infowindowMultipleMarker = new google.maps.InfoWindow({
        content: getMultipleMarkerContentIncidentCount(groupOfIncidents)
    });

   /*  marker.addListener('mouseover', function () {
        infowindowMultipleMarker.open(map, marker);
    }) */

   /*  marker.addListener('mouseout', function () {
        infowindowMultipleMarker.close();
    }) */

    // for each multiple marker there is a listener
    markerMultiple.addListener('click', function () {
        if( prevInfowindow ) {
            prevInfowindow.close();
         }
         prevInfowindow = infowindowMultipleMarker;
        infowindowMultipleMarker.open(map, markerMultiple);

        groupOfInc2 = groupOfIncidents;
         markerCurr=markerMultiple;
        
    });
    
}
//added
markerCurr=null;

function createInfoWindowContentForIncident(incident) {
    // ` denotes JavaScript ECMA 6 template string
    var content =
        `<div id="contentInfowindow" class= "incidentInfoWindow">` +
        `    <div id ="left" >` +
        `       <div>`+
        `           <img id = "imgInfowindow" class="imgModal" src="${incident.image}" width="50px" onclick="openModalBox('${incident.image}')"></img><br/><br/>`+
        `       </div>`+
        `    </div>       ` +
        `    <div id="right">`+
        `        <div id="object3">`+
        `            ${incident.message}` +
        `        </div>`+
        `        <br/>`+
        `        <div>`+
        `            ${formatDate(incident.date)}` +
        `        </div>`+
        `    </div>` +
        `</div>` +

        `<div class= "buttonHolderSingleIncident">`+
        `<button type="button" class ="btn btn-primary btn-sm" style="padding: 6px 70px; font-size: 14px;" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${incident.latitude}, ${incident.longitude})">Report</button>`+
        `</div>`
    return content;
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

function groupIncidentsByType(incidents) {
    // key = type.id
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
//
//groupOfIncidents = null;

function getMultipleMarkerContentIncidentCount(groupOfIncidents){
    //console.log("groupOfIncidents : "+groupOfIncidents);
    //console.log(groupOfIncidentsToPass[]);

    //groupIncidentsByType returns a dict where key is the incident.type.id and the value is an incident
    var groupedByTypeIdIncidents = groupIncidentsByType(groupOfIncidents);
    //console.log("groupedByTypeIdIncidents: "+groupedByTypeIdIncidents);
    
    var content = ``;
    var firstIncident = null;

    for (var key in groupedByTypeIdIncidents) {
        //incidentsByType are the incidents with the same type.id
        var incidentsByType = groupedByTypeIdIncidents[key];
        
        firstIncident = incidentsByType[0];
        content+=`<div style="padding: 2px 0px; font-weight: bold;"><img src="${incidentIcons[firstIncident.type.id]}"/>`;
        content+=`&nbsp ${incidentsByType.length} ${firstIncident.type.description}</div>`;
    } 
    firstIncident = incidentsByType[0];     //onclick="openSecondInfowindowMultipleMarker(${groupOfIncidents})
    var buttons = `<div class="wrapper"><br/><button type="button" class="btn btn-primary btn-sm" style="padding: 6px 15px" id="btnMore" onclick="openSecondInfowindowMultipleMarker(${firstIncident.latitude}, ${firstIncident.longitude})">More</button>`;
    buttons += `&nbsp&nbsp&nbsp<button type="button" class = "btn btn-primary btn-sm" style="padding: 6px 15px" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${firstIncident.latitude}, ${firstIncident.longitude})">Report</button></div>`;
    var htmlReturned = content+buttons;
    
    return htmlReturned
}

function createInfoWindowContentForGroupOfIncidents(groupOfIncidents) {
   // console.log(infowindowMultipleMarker2nd);
    // groupIncidentsByType return a dictionary key:value where key is the type.id and value is incident
    var groupedByTypeIdIncidents = groupIncidentsByType(groupOfIncidents);

    var beginning = '<div class="w-25 p-3" style="background-color: #eee;" id= "incidentInfoWindow" class="container" id="base" style="width: 500px; overflow: auto">\n' +
                    '<div class="panel-group" id="accordion">\n';
                 
    var middle = '';
    var firstIncident = null;
    for (var key in groupedByTypeIdIncidents) {
        var incidentsByType = groupedByTypeIdIncidents[key];
        firstIncident = incidentsByType[0];
        // middle += `<a href="" class="col-md-2">`;
        
        middle += `<div class="panel panel-default" id="incident-panel-div-${firstIncident.id}">`;
        middle += `<div class="panel-heading" id="incident-panel-div-${firstIncident.id}-heading">`;
        middle += `<h4 class="panel-title">`;
        middle += `<a class="accordion-toggle" data-parent="#accordion" data-toggle="collapse" href="#incident-panel-div-${firstIncident.id}-content">`;
        middle += `<img src="${incidentIcons[firstIncident.type.id]}"/>&nbsp`;
        middle += `${incidentsByType.length} ${firstIncident.type.description}`;
        middle += `</a>`;
        middle += `</h4>`;
        middle += `</div>`;
        middle += `<div class="panel-collapse collapse" id="incident-panel-div-${firstIncident.id}-content">`;
        middle += `<div class="panel-body" style="display:block;">`;
        for (var incident of incidentsByType) {
            middle += `<div class= "incidentInfoWindow">` +
        `    <div id ="left" >` +
        `       <div>`+
        `           <img id="imgInfowindow" class="imgModal" src="${incident.image}" width="50px" onclick="openModalBox('${incident.image}')"></img>`+
        `       </div>`+
        `    </div>`+
        `    <div id="right">`+
        `        <div id="object3">`+
        `           ${incident.message}` +
        `        </div>`+
        `        <br/>`+
        `        <div>`+
        `           ${formatDate(incident.date)}</br>` +
        `       </div>`+
        `    </div> `+
        `<br style="clear:both;"/>`+
        //`</div>`+
        //  `</a>`;
        `</div>`;
        }

        middle += "</div></div></div>";
    }

    var ending = '</div>';
    ending += `<button type="button" class ="btn btn-primary btn-block btn-sm" id="newIncidentonMarkerButton" onclick="reportNewIncidentOnMarker(${firstIncident.latitude}, ${firstIncident.longitude})">Report New Incident</button>`;
    ending += '</div>';

    return beginning + middle + ending;
}

//function openSecondInfowindowMultipleMarker(){
function openSecondInfowindowMultipleMarker(lat,lng){




    var positionCurrMarker = new google.maps.LatLng(lat,lng);
    console.log("positionCurrMarker "+positionCurrMarker);
     console.log("lat "+lat);
  prevInfowindow.close();




 var infowindowIncidentsDetails = new google.maps.InfoWindow({
     content:createInfoWindowContentForGroupOfIncidents(groupOfInc2)
     //content:"hiiii"
     
  });

  if( prevInfowindow ) {
    prevInfowindow.close();
 }


 infowindowIncidentsDetails.open(map,markerCurr);
 prevInfowindow = infowindowIncidentsDetails;
 
 
 
 
}

function convertCoordinatesToAddress(latitude, longitude) {
    var latlng = {lat: latitude, lng: longitude};

    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                //return
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}








 /*   //  var prevInfowindow2=false;

        //on content changed
        google.maps.event.addListener(prevInfowindow, "content_changed", function () {
            //prevInfowindow2= prevInfowindow;
            console.log("prev infowindow");
           //   if(prevInfowindow2.close()){
            //prevInfowindow2.setContent(previousContent);
           // }  
        });

    var newInfowindowContent =createInfoWindowContentForGroupOfIncidents(groupOfInc2);
    prevInfowindow.setContent(newInfowindowContent);
    
    //prevInfowindow2= prevInfowindow;


    var previousContent = getMultipleMarkerContentIncidentCount(groupOfInc2);
        
    

    // google.maps.event.addListener(prevInfowindow2, "closeclick", function () {
        google.maps.event.addListener(prevInfowindow, "closeclick", function () {
               // console.log("prev infowindow");
        prevInfowindow.setContent(previousContent);
      //  prevInfowindow = prevInfowindow2;
     });










   // prevInfowindow2

   /*  var previousContent = getMultipleMarkerContentIncidentCount(groupOfInc2);
     google.maps.event.addListener(prevInfowindow, "closeclick", function () {
                console.log("prev infowindow");

        prevInfowindow.setContent(previousContent);
     });
 */
    //   if(prevInfowindow2.close()){
    //     console.log("prev window closed");
    //  } 

 

   // prevInfowindow.close();
//infowindowMultipleMarker2nd.open(map, markerMultiple);


 //   console.log(infowindowMultipleMarker2nd.get);
    //prevInfowindow.setContent(createInfoWindowContentForGroupOfIncidents(groupOfIncidents));
//prevInfowindow.setContent("new Content");


// if(prevInfowindow.close()){
//     console.log("hi 2");
// }
             // prevInfowindow.close();

            //   google.maps.event.addListener(prevInfowindow, "close", function () {
            //     console.log("prev infowindow");
                
            //    });

   // console.log("groupOfIncidents"+groupOfIncidents);

//close curr infowindow
//prevInfowindow.close();
//prevInfowindow.setContent();

// message infowindowMultipleMarker is undefined
//infowindowMultipleMarker.close();


//open other infowindow




    //
   
   
 
    // prevInfowindow.setContent(createInfoWindowContentForGroupOfIncidents(groupOfIncidentsToPass));
    

    
//    google.maps.event.addListener(prevInfowindow, "closeclick", function () {
//        console.log("prev infowindow");
//       
//      });

      //prevInfowindow.close();

 
  
  
  
  
  
    //console.log("infoWindow : ");
/*     google.maps.event.addListener(infoWindow, "closeclick", function () {
        
        //infoWindowVisible(false);
      }); */
 //   console.log("test1");
//    if(prevInfowindow) {
//        console.log("here prev infowindow");
      // prevInfowindow.close();
        //prevInfowindow.setContent("Hi");
        //prevInfowindow.open(map);
       //prevInfowindow.close();
       //prevInfowindow.open(map);

    // }
//var newContent = this.infowindowMultipleMarker.setContent('<p>Hello<p>');
   /*  google.maps.event.addListener(map, 'click', function () {
        reportNewIncidentOnMarker(lat, lng);
    });

  */
    //infowindowMultipleMarker2nd.open(); */

    //var actualInfowindow = this.infoWindow.anchor;
    //actualInfowindow.close();
    //actualInfowindow.setContent("hi");
