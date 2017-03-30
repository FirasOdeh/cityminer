/**
 * Created by zekri on 26/02/17.
 */
jQuery(document).ready(function($){
    var country = "";
    var city = "";
    var lat = "";
    var lng = "";

    var adminmap = L.map('adminmap').setView([45.754, 4.842], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(adminmap);

    function initializeAutocomplete(id) {
        var element = document.getElementById(id);
        if (element) {
            var autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });
            google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
        }
    }

    function onPlaceChanged() {
        country = "";
        city = "";
        var place = this.getPlace();
        for (var i in place.address_components) {
            var component = place.address_components[i];
            for (var j in component.types) {  // Some types are ["country", "political"]
                if(component.types[j] == "country"){
                    country = component.long_name;
                }
                if(component.types[j] == "locality"){
                    city = component.long_name;
                }

                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();

                adminmap.setView([lat, lng], 11.5);
                $("#scope_input").trigger("change");
            }
        }
    }

    google.maps.event.addDomListener(window, 'load', function() {
        initializeAutocomplete('autocomplete-input');
    });

    $(".delete-city-btn").click(function () {
        var self = this;
        $.ajax({
            url: "admin/deleteCity?city_id=" + $(this).data("city_id"),
            type: "GET",
            success: function (response) {
                $(self).closest("tr")[0].remove();
            }
        });
    });

    $("#scope_input").change(function () {
        clearMap();
        scope = $(this).val();
        var points = [
            [lat - (scope / 111.7), lng + (scope / 85.26)],
            [lat + (scope / 111.7), lng + (scope / 85.26)],
            [lat + (scope / 111.7), lng - (scope / 85.26)],
            [lat - (scope / 111.7), lng - (scope / 85.26)]
        ];
        L.polygon(points, {
            color: '#00ad45',
            fillColor: '#34bf49',
            weight: 2,
            fillOpacity: 0.3
        }).addTo(adminmap);
    });

    function clearMap() {
        for(i in adminmap._layers) {
            if(adminmap._layers[i]._path != undefined) {
                try {
                    adminmap.removeLayer(adminmap._layers[i]);
                }
                catch(e) {
                    console.log("problem with " + e + adminmap._layers[i]);
                }
            }
        }
    }

});