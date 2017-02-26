/**
 * Created by zekri on 26/02/17.
 */
jQuery(document).ready(function($){
    var country = "";
    var city = "";

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
            }
        }
        console.log(city + " "+ country);
    }

    google.maps.event.addDomListener(window, 'load', function() {
        initializeAutocomplete('autocomplete-input');
    });
});