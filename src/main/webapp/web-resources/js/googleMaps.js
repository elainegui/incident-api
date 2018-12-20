
function initMap() {
   var location = {lat:53.4239, lng:-7.9407}
    var map = new google.maps.Map(document.getElementById("map"),{
        zoom:16, 
        center: location
    });

    var geocoder = new google.maps.Geocoder();

    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
    

	var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Here!'
    });
     
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }