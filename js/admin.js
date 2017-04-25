/**
 * Created by zekri on 26/02/17.
 */
jQuery(document).ready(function($){
    var country = "";
    var city = "";
    var lat = "";
    var lng = "";
    var scope = "";
    $('.modal').modal();

    var adminmap = L.map('adminmap').setView([45.754, 4.842], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(adminmap);

    var areaSelect = L.areaSelect({width:200, height:250});
    areaSelect.on("change", function() {
        var bounds = this.getBounds();
        console.log("--------------------------");
        console.log(bounds.getSouthWest().lat + ", " + bounds.getSouthWest().lng);
        console.log(bounds.getNorthEast().lat + ", " + bounds.getNorthEast().lng);
        console.log("--------------------------");
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
            url: "admin/deleteCity?city_id=" + $(this).data("city_id"),
            type: "GET",
            success: function (response) {
                $(self).closest("tr")[0].remove();
                Materialize.toast('The city have been removed', 4000) ;
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

    $("#import_btn").click(function () {
        $('#modal2').modal('open');
        var bounds = areaSelect.getBounds();

        alert(bounds.getSouthWest().lat + ", " + bounds.getSouthWest().lng + "\n\n" +bounds.getNorthEast().lat + ", " + bounds.getNorthEast().lng);

    });

    $("#start_import_btn").click(function () {
        $(".loader-container").show();
        $("#start_import_btn").hide();
        $(".form-container").hide();
        var label = $("#label_input").val();
        var level = $("#level_input").val();



        $.ajax({
            url: "admin/import?city="+encodeURI(city)+"&label="+label+"&lat="+lat+"&lng="+lng+"&scope="+scope+"&level="+level,
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