/**
 * Created by zekri on 26/02/17.
 */
jQuery(document).ready(function($){
    var country = "";
    var city = "";
    var NElat = "";
    var NElng = "";
    var SWlat = "";
    var SWlng = "";
    $('.modal').modal();

    var adminmap = L.map('adminmap').setView([45.754, 4.842], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(adminmap);

    var areaSelect = L.areaSelect({width:200, height:250});
    areaSelect.on("change", function() {
        var bounds = this.getBounds();
        SWlat = bounds.getSouthWest().lat;
        SWlng = bounds.getSouthWest().lng;
        NElat = bounds.getNorthEast().lat;
        NElng = bounds.getNorthEast().lng;

    });



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
                areaSelect.addTo(adminmap);
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
            url: "admin/deleteCity?city_id=" + $(this).data("city_id") + "&label=" + $(this).data("label"),
            type: "GET",
            success: function (response) {
                $(self).closest("tr")[0].remove();
                Materialize.toast('The city have been removed', 4000) ;
            }
        });
    });

    $("#import_btn").click(function () {
        $('#modal2').modal('open');
    });

    $("#start_import_btn").click(function () {
        $(".loader-container").show();
        $("#start_import_btn").hide();
        $(".form-container").hide();
        var label = $("#label_input").val();
        var level = $("#level_input").val();



        $.ajax({
            url: "admin/import?city="+encodeURI(city)+"&label="+label+"&ne_lat="+NElat+"&ne_lng="+NElng+"&sw_lat="+SWlat+"&sw_lng="+SWlng+"&level="+level,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if(response.success === true){
                    Materialize.toast('The city has been added', 4000) ;
                    $('#modal2').modal('close');
                    $(".loader-container").hide();
                    $("#start_import_btn").show();
                    $(".form-container").show();
                    window.location.reload();
                } else {
                    Materialize.toast('Error', 4000) ;
                    $('#modal2').modal('close');
                    $(".loader-container").hide();
                    $("#start_import_btn").show();
                    $(".form-container").show();
                }
            },
            error: function () {
                Materialize.toast('Error', 4000) ;
                $('#modal2').modal('close');
                $(".loader-container").hide();
                $("#start_import_btn").show();
                $(".form-container").show();
            }
        });
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