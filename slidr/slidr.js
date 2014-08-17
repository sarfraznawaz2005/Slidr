/*
 * slidr v1.0.0
 * Copyright (c) 2014 Sarfraz Ahmed (sarfraznawaz2005@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */
 
 // todo keep track of current slide via hash
 
(function($) {

  jQuery.fn.extend({
    slidr: function(options) {
	
      var defaults = {
		"background" : "#eee"
	  };
	  // override custom options with default ones
      var o = $.extend(defaults, options);

	  $this = $(this);
	  
	  // get current supplied selector
	  var identifier = $this.selector;
	  
	  // main slidr container element
	  var slideContainerClass = 'slidr_container';
	  
	  // class applied to each slide
	  var slideClass = 'slidr_slide';
	  
	  // current slide class
	  var currentClass = '__slidrCurrentSlideItem__';
	  
	  // holds first slide
	  var $firstSlide = null;
	  
	  // document width and height
	  var windowW = $('body').innerWidth();
	  var windowH = $('body').innerHeight();
	  	  
      // do it for every element that matches selector
      this.each(function(){	  
		// make slide width and height equal to visible window size
		$(this).css({
			"background" : o.background,
			"position" : "absolute",
			"width" : windowW
		});
	  });
	  
	  // apply background color to body as well
	  $('body').css('background', o.background);
	  
	  // hide all slides initially
	  $this.hide();
	  
	  // show the first slide only initially
	  $firstSlide = $(this[0]);
	  $firstSlide.show();
	  $firstSlide.addClass(currentClass);
	  $firstSlide.addClass(slideClass);
	  
	  this.setupSlides = function() {
		var self = this;
		
		goToSlide = function(slideNumber) {		
		
			if (typeof slideNumber === 'undefined') {
				// go to url hash slide if needed
				var hash = document.location.hash;
				var slideNumber = hash.match(/\d+/);			
			}
		
			if (slideNumber > -1) {
				var $slide = $(identifier).eq(slideNumber);
				
				// remove current class from any slide that has it
				$(identifier).removeClass(currentClass).hide();
				
				// now show next slide
				$slide.addClass(currentClass);
				$slide.addClass(slideClass);
				$slide.fadeIn();
			}
		}();
	  
		showPrevSlide = function() {
			this.showSlide('prev');
		};
		
		showNextSlide = function() {
			this.showSlide('next');
		};
		
		showSlide = function(direction) {
			// get the slide to go to
			var $slide = $(identifier + '.' + currentClass)[direction](identifier + ':first');
			var index = $slide.index();
			
			// append hash to url
			if (index != '-1') {
				document.location.href = '#slide-' + index;
			}
			
			// go to next slide if there is one
			if ($slide.length) {
				// remove current class from any slide that has it
				$(identifier).removeClass(currentClass).hide();
				
				// now show next slide
				$slide.addClass(currentClass);
				$slide.addClass(slideClass);
				$slide.fadeIn();
			}		
		};
	  
		// bind keys strokes to slides
		$('body').keyup(function(event){
			var keyF = 70;
			var keyLeft = 37;
			var keyRight = 39;
			var keyUp = 38;
			var keyDown = 40;
		
			switch(event.keyCode) {
				case keyLeft : self.showPrevSlide();
				break;
				case keyRight : self.showNextSlide();
				break;
				case keyF: toggleFullScreen();
				break;				
			}			
		});
		
		launchFullscreen = function (element) {
		  if(element.requestFullscreen) {
			element.requestFullscreen();
		  } else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		  } else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		  } else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		  }
		  
		  //$(element + '-webkit-full-screen').closest('body').css('background', 'yellow');
		  
		};
		
		exitFullscreen = function () {
		  if(document.exitFullscreen) {
			document.exitFullscreen();
		  } else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		  } else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		  }
		};
		
		toggleFullScreen = function() {
			var isFullScreen = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
			
			if (isFullScreen) {				
				launchFullscreen($('.' + slideContainerClass)[0]);
			}
			else {
				exitFullscreen();
			}
			
		};		
		
	  }();

      // maintain chainability
      return this;
    }
	
  });

  jQuery.fn.extend({
    slidr: jQuery.fn.slidr
  });

})(jQuery);
