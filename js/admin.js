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
    var csvFile;

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
        console.log("=========================");
        console.log(SWlat);
        console.log(SWlng);
        console.log(NElat);
        console.log(NElng);

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
        $("#label_input").val(city);
        $("#label_input").parent().find("label").addClass("active");

    });

    $("#start_import_btn").click(function () {
        $(".loader-container").show();
        $("#start_import_btn").hide();
        $(".form-container").hide();
        var label = guid();
        city = $("#label_input").val();
        var level = $("#level_input").val();
        var source = $("#source").val();
        var data = new FormData();
        data.append("source", source);
        data.append("city", city);
        data.append("label", label);
        data.append("level", level);
        if((source === "google") || (source === "foursquare")){
            data.append("ne_lat", NElat);
            data.append("ne_lng", NElng);
            data.append("sw_lat", SWlat);
            data.append("sw_lng", SWlng);
        } else {
            $.each(csvFile, function(key, value)
            {
                data.append(key, value);
            });
        }

        $.ajax({
            url: "admin/import",
            type: "POST",
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
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

    $("#source").change(function () {
        if(($(this).val() === "foursquare") || ($(this).val() === "google")){
            $(".csv-container").hide();
            $(".autocomplete-container").show();
        } else {
            $(".csv-container").show();
            $(".autocomplete-container").hide();
        }
    });


    $("#csv_input").on('change', function(){
        csvFile = event.target.files;
        console.log(csvFile);
    });

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    }
});