/**
A simple jQuery plugin that changes the opacity of the items in a list (doesn't matter what they are)
to give them impression of a cross-fading slide show. If opacity is not supported, display hidden is used for
a somewhat graceful degredation of function. 

To set up, position all of the slides absolutely within
their container. Create a class ("trans-spec" by default) that contains the transition styles. These will be
applied to the slides after initialization takes place (otherwise the initial setup looks funky). 

Then call shiner like:
 
> $('.myslides').shiner();


Shiner will also take options like: 

> $('.myslides').shiner({ transClass: 'fast', delay: 1000});


Shiner will also take the commands "stop" and "go" like:
 
> $('.myslides').shiner("stop")
> $('.myslides').shiner("go");


One of the nice things about using this technique is that all of the slides can be placed behind 
another element (see example.html) allowing you to "frame" a slideshow. Also, styles like max-width
can be used for images and overflow hidden can be used for the container. This makes it easy to show
slides of different sizes and slightly different aspect ratios.

Shiner works in modern browsers and in ie 7/8. It also works very well on android devices despite 
their limited processing power (unlike other slide show tools I've tried).
 */
(function($) {
	
	var defaults = {
			transClass: "trans-spec",		/* The class to apply to set the transition properties */
			delay: 5000 					/* The delay between the changes in slides */
	};
	
	var slideSetInformation = {};
	
	var cssTransitionSupport = (function(){

            // body element
        var body = document.body || document.documentElement,

            // transition events with names
            transEndEvents = {
                'transition'      : 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition'   : 'transitionend',
                'MsTransition'    : 'MSTransitionEnd',
                'OTransition'     : 'oTransitionEnd otransitionend'
            }, name;

        // check for each transition type
        for (name in transEndEvents){

            // if transition type is supported
            if (body.style[name] !== undefined) {

                // return transition end event name
                return transEndEvents[name];
            }
        }

        // css transitions are not supported
        return false;

    })();
	
	/**
	 * make the slide visible either by making it opaque if that's supported in the browser or
	 * making it not hidden
	 */
	function makeVisible(slide) {
		if(cssTransitionSupport) {
			slide.css('opacity', 1);
		}
		else {
			var oldvalue = $.data(slide, 'old-display');
			if(!oldvalue) {
				oldvalue = 'block';
			}
			slide.css('display', oldvalue);
		}
		
	}
	
	/**
	 * make the slide invisible either by making it transparent if that's supported in the browser or
	 * making it hidden
	 */
	function makeInvisible(slide) {
		if(cssTransitionSupport) {
			slide.css('opacity', 0);
		}
		else {
			var oldvalue = slide.css('display');
			if(oldvalue != 'none') {
				$.data(slide, 'old-display', oldvalue);
			}
			slide.css('display', 'none');
		}
	}
	
	/**
	 * Returns true if the slide is opaque (if that's supported by the browser) or not hidden if 
	 * opacity is not supported.
	 */
	function isVisible(slide) {
		if(cssTransitionSupport) {
			return slide.css('opacity') == 1;
		}
		else {
			return slide.css('display') != 'none';
		}
	}
	
	/**
	 * Makes the currently visible slide invisible and makes the next slide in the sequence visible
	 */
	function goToNext(slidesSelector) {
		var last = false;
		var slides = $(slidesSelector);
		slides.each(function() {
			var slide = $(this);
			if(isVisible(slide)) {
				makeInvisible(slide);
				last = true;
			}
			else {
				if(last == true) {
					last = false;
					makeVisible(slide);
				}
			}
			
		});
		
		if(last) {
			// meaning the one we made transparent was the last one
			makeVisible(slides.first());
		}
	}
	
	/**
	 * Starts the slide show by setting up a timer to change the slides
	 */
	function shineOn(slidesSelector) {
		shineOff(slidesSelector);
		slideSetInformation[slidesSelector].intervalId = setInterval(function() { goToNext(slidesSelector) }, slideSetInformation[slidesSelector].delay);
	}
	
	/**
	 * Stops the timer and thus the slide show
	 */
	function shineOff(slidesSelector) {
		if(slideSetInformation[slidesSelector].intervalId) {
			clearInterval(slideSetInformation[slidesSelector].intervalId);
		}
		
		slideSetInformation[slidesSelector].intervalId = null;
	}
	
	/**
	 * sets up the slides by making them all invisible and then making the first one visible.
	 */
	function initShine(slidesSelector, options) {
		var slides = $(slidesSelector);
		
		slideSetInformation[slidesSelector] = $.extend({}, defaults, options);
		
		slides.each(function() { makeInvisible($(this)); } );
		makeVisible(slides.first());
		
		setTimeout(function() {
			slides.addClass(slideSetInformation[slidesSelector].transClass);
			shineOn(slidesSelector);
		}, 100);

	}
	
	$.fn.shiner = function(options) {
		
		var theselector = this.selector;
		
		if(!options) {
			initShine(theselector);
		}
		else if(typeof options === 'string') {
			if (options === 'stop') {
				shineOff(theselector);
			}
			else if (options === 'go') {
				shineOn(theselector);
			}
		}
		else if(typeof options === 'object') {
			initShine(theselector, options);
		}
	}
}
)(jQuery);
