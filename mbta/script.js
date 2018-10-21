var SouthStation = { position: {lat: 42.352271, lng:-71.05524200000001}, 'stop_id': "place-sstat" };
var Andrew = { position: {lat: 42.330154, lng:-71.057655}, 'stop_id': "place-andrw" };
var PorterSquare = { position: {lat: 42.3884, lng:-71.11914899999999}, 'stop_id': "place-portr" };
var HarvardSquare = { position: {lat: 42.373362, lng:-71.118956}, 'stop_id': "place-harsq" };
var JFKUmass = { position: {lat: 42.320685, lng:-71.052391}, 'stop_id': "place-jfk" };
var SavinHill = { position: {lat: 42.31129, lng:-71.053331}, 'stop_id': "place-shmnl" };
var ParkStreet = { position: {lat: 42.35639457, lng:-71.0624242}, 'stop_id': "place-pktrm" };
var Broadway = { position: {lat: 42.342622, lng:-71.056967}, 'stop_id': "place-brdwy" };
var NorthQuincy = { position: {lat: 42.275275, lng:-71.029583}, 'stop_id': "place-nqncy" };
var Shawmut = { position: {lat: 42.29312583, lng:-71.06573796000001} , 'stop_id': "place-smmnl" };
var Davis = { position: {lat: 42.39674, lng:-71.121815}, 'stop_id': "place-davis"};
var Alewife = { position: {lat: 42.395428, lng:-71.142483}, 'stop_id': "place-alfcl"};
var KendallMIT = { position: {lat: 42.36249079, lng:-71.08617653}, 'stop_id': "place-knncl"};
var CharlesMGH = { position: {lat: 42.361166, lng:-71.070628}, 'stop_id': "place-chmnl"};
var DtownCross = { position: {lat: 42.355518, lng:-71.060225}, 'stop_id': "place-dwnxg"};
var QuincyC = { position: {lat: 42.251809, lng:-71.005409}, 'stop_id': "place-qnctr"};
var QuincyA = { position: {lat: 42.233391, lng:-71.007153}, 'stop_id': "place-qamnl"};
var Ashmont = { position: {lat: 42.284652, lng:-71.06448899999999}, 'stop_id': "place-asmnl"};
var Wollaston = { position: {lat: 42.2665139, lng:-71.0203369}, 'stop_id': "place-wlsta"};
var FieldsCorner = { position: {lat: 42.300093, lng:-71.061667}, 'stop_id': "place-fldcr"};
var CentralSq = { position: {lat: 42.365486, lng:-71.103802}, 'stop_id': "place-cntsq"};
var Braintree = { position: {lat: 42.2078543, lng:-71.0011385}, 'stop_id': "place-brntn"};

var places = [ SouthStation, Andrew, PorterSquare, HarvardSquare,
               JFKUmass, SavinHill, ParkStreet, Broadway, NorthQuincy,
               Shawmut, Davis, Alewife, KendallMIT, CharlesMGH, DtownCross,
               QuincyC, QuincyA, Ashmont, Wollaston, FieldsCorner,
               CentralSq, Braintree ];

var map, userWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: SouthStation.position,
    zoom: 11
  });
  userWindow = new google.maps.InfoWindow;
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      map.setZoom(13);
      userWindow.setPosition(pos);
      var closestStation = findDistance(pos);
      userWindow.setContent('Closest station is ' + closestStation.stop.stop_id + ' and it is ' + closestStation.dist + ' miles away.' );
      var userMarker = new google.maps.Marker({position: pos, map: map});
      var userToStation = [
        pos, closestStation.stop.position
      ];
      var lineToStation = new google.maps.Polyline({
            path: userToStation,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
      lineToStation.setMap(map);
      userMarker.addListener('click', function() {
        userWindow.open(map);
      });
    }, function() {
      handleLocationError(true, userWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, userWindow, map.getCenter());
  }

   var icon = 'http://maps.google.com/mapfiles/kml/pal5/icon19.png';
   places.forEach(function(place) {
      var marker = new google.maps.Marker({
        position: place.position,
        icon: icon,
        map: map
      });
    });
    var redline = [
      Alewife.position, Davis.position, PorterSquare.position,
      HarvardSquare.position, CentralSq.position, KendallMIT.position,
      CharlesMGH.position, ParkStreet.position, DtownCross.position,
      SouthStation.position, Broadway.position, Andrew.position, JFKUmass.position
    ];
    var rbranch1 = [
      JFKUmass.position, NorthQuincy.position, Wollaston.position, QuincyC.position,
      QuincyA.position, Braintree.position
    ];
    var rbranch2 = [
      JFKUmass.position, SavinHill.position, FieldsCorner.position,
      Shawmut.position, Ashmont.position
    ]
    var r1 = new google.maps.Polyline({
          path: redline,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    var r2 = new google.maps.Polyline({
          path: rbranch1,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    var r3 = new google.maps.Polyline({
          path: rbranch2,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
    r1.setMap(map);
    r2.setMap(map);
    r3.setMap(map);

}

function findDistance(userLocation){
  var current;
  var smallestdist = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(userLocation.lat, userLocation.lng), new google.maps.LatLng(SouthStation.position.lat, SouthStation.position.lng));
  var closest = { dist: smallestdist, stop: SouthStation };
  places.forEach(function(place) {
    current = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(userLocation.lat, userLocation.lng), new google.maps.LatLng(place.position.lat, place.position.lng));
    if (current < smallestdist) {
      closest.stop = place;
      smallestdist = current;
    }
  });
  closest.dist = metersToMiles(smallestdist);
  return closest;
}

function metersToMiles(meters) {
  return meters/1609.344;
}

function handleLocationError (browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
