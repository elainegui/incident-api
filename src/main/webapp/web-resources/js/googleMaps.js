var map, infoWindow;

function loadReportIncidentPage() {
	initMap();
	initAutocomplete();
}

function initMap() {
	var location = {
		lat : 53.4239,
		lng : -7.9407
	};
	map = new google.maps.Map(document.getElementById("map"), {
		zoom : 16,
		center : location
	});
	infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat : position.coords.latitude,
				lng : position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Your Location');
			infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
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
			'address' : address
		}, function(results, status) {
			if (status === 'OK') {
				resultsMap.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map : resultsMap,
					position : results[0].geometry.location
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
	street_number : 'short_name',
	route : 'long_name',
	locality : 'long_name',
	administrative_area_level_1 : 'short_name',
	country : 'long_name',
	postal_code : 'short_name'
};

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
	/** @type {!HTMLInputElement} */
	(document.getElementById('autocomplete')), {
		types : [ 'geocode' ]
	});

	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();

	for ( var component in componentForm) {
		document.getElementById(component).value = '';
		document.getElementById(component).disabled = false;
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
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat : position.coords.latitude,
				lng : position.coords.longitude
			};

			var circle = new google.maps.Circle({
				center : geolocation,
				radius : position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		});
	}
}
/*
function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById('autocomplete').value;
	if (address) {
		console.log("address: " + address);
		geocoder.geocode({
			'address' : address
		}, function(results, status) {
			if (status === 'OK') {
				resultsMap.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map : resultsMap,
					position : results[0].geometry.location
				});
			} else {
				alert('Geocode was not successful for the following reason: '
						+ status);
			}
		});
	}
}

*/
function syncMapWithAddress() {
	if (map) {
		var geocoder = new google.maps.Geocoder();
		geocodeAddress(geocoder, map);
	}
}

