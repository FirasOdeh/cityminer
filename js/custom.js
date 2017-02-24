// jQuery Initialization
jQuery(document).ready(function($){
"use strict"; 

	$('ul.tabs').tabs();
    $(".dropdown-button").dropdown();
    $('select').material_select();
    $('#algo').change(function(){
        var val = $(this).val();
        if(val=="energetics"){
            $('#time_input').hide();
            $('#mincov_input').show();
        }else{
            $('#mincov_input').hide();
            $('#time_input').show( );

        }
    });
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        data: {
            "input": "par",
            "types": "geocode",
            "language": "en",
            "key": "AIzaSyAw_GK4ObIHDD2Es59Qa70vVW-8H8LvMNQ"
        },
        crossDomain:true,
        cache: false,
        type: "GET",
        success: function (response) {
            alert(response);
        },
        error: function (xhr) {

        }
    });
    $('input.autocomplete').autocomplete({
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'http://placehold.it/250x250'
        },
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    });



});