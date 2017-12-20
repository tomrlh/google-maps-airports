//Global map variable
var map;

var infoWindow = new google.maps.InfoWindow()

//Function run on DOM load
function loadMap() {
    
    //Set the map options
    var mapOptions = {

        //Zoom on load
        zoom: 11,

        //Map center
        center: new google.maps.LatLng(40.6413111,-73.77813909),
      
        //Set the map style
        styles: shiftWorkerMapStyle 
    };

    //Get the id of the map container div
    var mapId = document.getElementById('map');

    //Create the map
    map = new google.maps.Map(mapId,mapOptions);

    for(var i=0; i<airportData.length; i++) {
        var airport = airportData[i];

        // AVG percentage
        airport.totalper = (airport.aper + airport.dper)/2;
        // Total flight
        airport.totalflights = (airport.aop + airport.dop)

        // Scale
        if(airport.totalflights > 10000)
            airport.iconsize = new google.maps.Size(48, 48)
        else if((1000 <= airport.totalflights) && (airport.totalflights <= 10000))
            airport.iconsize = new google.maps.Size(32, 32)
        else if(airport.totalflights < 1000)
            airport.iconsize = new google.maps.Size(16, 16)

        // Set the icon color
        if(airport.totalper >= 80)
            airport.icon = 'green'
        else if((70 <= airport.totalper) && (airport.totalper < 80))
            airport.icon = 'yellow'
        else if((60 <= airport.totalper) && (airport.totalper < 70))
            airport.icon = 'orange'
        else
            airport.icon = 'red'

        // Set the icon size

        //Marker creation
        var newMarker = this.addMarker(airport)

        newMarker.airport = airport

        addInfoWindow(newMarker)
    }
}

//Add a marker to the map
function addMarker(airport) {
        
    //Create the marker (#MarkerOptions)    
    var marker = new google.maps.Marker({

        // Position of marker
        position: new google.maps.LatLng(airport.lat, airport.lng),

        icon: {
             url: '../img/airplane-' + airport.icon + '.png',
             size: airport.iconsize,
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(16, 32),
             scaledSize: airport.iconsize,
        },

        // Set the animation (BOUNCE or DROP)
        // animation: google.maps.Animation.DROP,

        // Sets whether marker is clickable
        title: airport.airport,
    });
    marker.setMap(map)
    marker.setVisible(true)

    return marker;
}

function addInfoWindow(marker) {

    var details = marker.airport
    // Content string
    var contentString = '<div class="infowindowcontent">' +
        '<div class="row"' +
        '<p class="total '+ details.icon +'bk">' + Math.round(details.totalper * 10) / 10 + '</p>' +
        '<p class="location">' + details.airport.split("(")[0].substring(0, 19) + '</p>' +
        '<p class="code">' + details.code + '</p>' +
        '</div>' +
        '<div class="data">' +
        '<p class="tagbelow">Avg On-Time</p>' +
        '<p class="label">Arrivals</p>' +
        '<p class="details">' + details.aper + '% (' + numberWithCommas(details.aop) + ')</p>' +
        '<p class="label">Departures</p>' +
        '<p class="details">' + details.dper + '% (' + numberWithCommas(details.dop) + ')</p>' +
        '<p class="coords">' + details.lat + ' , ' + details.lng + '</p>' +
        '</div>' +
        '</div>'

    google.maps.event.addListener(marker, 'click',
        function(e) {
            infoWindow.close()
            infoWindow.setContent(contentString)
            infoWindow.open(map, marker)
        }
    )
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

//Load the map
google.maps.event.addDomListener(window, 'load', loadMap());
       



