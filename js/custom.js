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




});