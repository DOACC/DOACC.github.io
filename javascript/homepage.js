/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */


$(document)
  .ready(function() {

    


    $('.dropdown.myaccount')
      .dropdown({
        on: 'click'
      })
    ;
	 
	
	//$('#purposediv > div').live('click', function (e) {
	 //alert($(this).attr('data-value') + ' was clicked');
	  //$("#testnew").val($(this).attr('data-value'));
	 // $("#purpose").val($(this).attr('data-value'));
	//});
	
	
	//$(".dropdown.purpose").dropdown("set selected", $("input.test").val());
    //$(".dropdown.purpose").dropdown("set value", $("#testnew").val());
    //$(".field.MDP .dropdown").dropdown("set selected", $("#form_complession input.mdp").val());
   
   //$('.dropdown.purpose').dropdown('setting', 'onChange', function(){ alert('hi babe');});
	
	/* if enabled will not work in IE
    $('.masthead .information')
      .transition('scale in')
    ;
	*/
    /* sidebar */
	$('.overlay.sidebar')
	.sidebar({
		overlay: true
	  })
	
	;
	
	$( ".ShowCategories" ).click(function() {
	  //alert( "Handler for .click() called." );
	  $('.ShowCategories.sidebar')
	  .sidebar('toggle')
		;
	});
	/* Initialise popup*/
	$('.ui.popup')
	  .popup()
	;
	$('.showcatpopup')
	  .popup({
		position : 'bottom right',
		title    : 'Click To Browse Categories',
		content  : 'Once clicked, categories will appear at the left panel. Clicking this button again will close the categories'
	  })
	;
	/* Initialise popup ends*/

	/*
	function onFormSubmitted(response) {
			// Do something with response ...
			alert('response');
	   }
	 */
	/* common function used in contact form & register*/
	

  })
;