// jQuery Initialization
jQuery(document).ready(function($){
"use strict"; 
    
    setTimeout(function() { $('#header-logo').addClass('pix-loaded'); }, 1300);
    $(".form_type_item").click(function(){
        $(this).toggleClass("item_is_active");
        var panel = $(this).attr('data-pix-toggle');
        $('.'+panel).toggleClass("pix_is_active");
        return false;
    });

    $(".button-collapse").sideNav();
	//$('.modal').modal();
	$('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        
        console.log(modal, trigger);
      },
      complete: function() {  } // Callback for Modal close
    }
  );

	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );

	$('ul.tabs').tabs();

    $(".dropdown-button").dropdown();

});