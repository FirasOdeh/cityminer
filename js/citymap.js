var mymap = L.map('mainmap').setView([45.754, 4.842], 13);
attribution = mymap.attributionControl;

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.streets'
}).addTo(mymap);
attribution.setPrefix('CityMiner Project © 2017');

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

//mymap.on('click', onMapClick);
jQuery(document).ready(function($){

    var win_h = $(window).height();
    var nav_h = $('#site_nav').height();
    var options_h = $('#site_options').height();
    var map_h = win_h - nav_h - options_h;
    $('#mainmap').css('height', map_h);

    $('button#submitButton').click( function() {
        if($('#city').val()) {
            clearMap();
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                id: 'mapbox.streets'
            }).addTo(mymap);
            $.ajax({
                url: "areas",
                data: {
                    "city": $('#city').val()
                },
                cache: false,
                type: "GET",
                success: function (response) {
                    var g_lat = 0;
                    var g_lng = 0;
                    var num = 0;
                    $.each(response, function (key, value) {
                        var points = [];
                        $.each(value.geo, function (key1, point) {
                            var p = [];
                            p.push(point.lat);
                            p.push(point.lng);
                            g_lat += point.lat;
                            g_lng += point.lng;
                            num++;
                            points.push(p);
                        });
                        L.polygon(points, {
                            color: '#00ad45',
                            fillColor: '#34bf49',
                            weight: 2,
                            fillOpacity: 0.3
                        }).on('click', onMapClick).addTo(mymap);
                    });
                    g_lat = g_lat / num;
                    g_lng = g_lng / num;
                    mymap.setView([g_lat, g_lng], 11.5);
                },
                error: function (xhr) {

                }
            });
        }else{
            Materialize.toast('Please select a City!', 4000) // 4000 is the duration of the toast
        }
    });
});

function clearMap() {
    for(i in mymap._layers) {
        if(mymap._layers[i]._path != undefined) {
            try {
                mymap.removeLayer(mymap._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + mymap._layers[i]);
            }
        }
    }
}