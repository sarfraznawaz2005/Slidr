/*
 * slidr v1.0.0
 * Copyright (c) 2014 Sarfraz Ahmed (sarfraznawaz2005@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function ($) {

    jQuery.fn.extend({
        slidr: function (options) {

            var defaults = {
				"fontsize" : "1.1em",
				"background" : "#fff"
			};
			
            // override custom options with default ones
            var o = $.extend(defaults, options);

            var $this = $(this);			
			var totalSlides = $this.length;

            // get current supplied selector
            var identifier = $this.selector;

            var slideContainerClass = 'slidr_container';

            // class applied to each slide
            var slideClass = 'slidr_slide';
			
			// class for nested slides - fragments
			var slideFragmentClass = 'slide_fragment';
			
			// class for visible fragments
			var slideFragmentShownClass = '__fragment_shown__';

            // current slide class
            var currentClass = '__slidrCurrentSlideItem__';

            var $body = $('body');

            this.each(function () {
                $(this).css({
					"overflow": "auto",
                    "background": o.background,
                    "height": $(window).height()
                });
            });

			$('.' + slideContainerClass).css('font-size', o.fontsize);
			
            // apply background color to body as well
            $body.css({
				"overflow": "auto",
				"background": o.background,
				"padding" : 0,
				"margin" : 0
			});
			
            // hide all slides initially
            $this.hide();
			
			// hide all slide fragments initially
			$('.' + slideFragmentClass).hide();

            // show the first slide only initially
            var $firstSlide = $(this[0]);
            $firstSlide.show();
            $firstSlide.addClass(currentClass);
            $firstSlide.addClass(slideClass);
			
			// create slide counter element
			var $counter = $('<div>')
			.css({
				"background" : "#eee",
				"color" : "#666",
				"padding" : "0 6px",
				"text-align" : "center",
				"font-size" : "1.5em",
				"border" : "1px solid #ccc",
				"position" : "fixed",
				"bottom" : "5px",
				"right" : "5px"
			});
			
			$body.append($counter);
			
			var $self = this;
			
			$self.showPrevSlide = function () {
				showSlide('prev');
			};

			$self.showNextSlide = function () {
				showSlide('next');
			};		
			
			var showSlide = function (direction) {
				var $currentSlide = $('.' + currentClass);
				var totalFragments = $currentSlide.find('.' + slideFragmentClass).length;
				var shownFragments = $('.' + slideFragmentShownClass).length;				
				
				if (totalFragments && (totalFragments !== shownFragments) && direction === 'next') {
					var $fragment = $currentSlide.find('.' + slideFragmentClass).eq(shownFragments);
					$fragment.addClass(slideFragmentShownClass);
					$fragment.fadeIn();
				}
				else {
					var $slide = $currentSlide[direction](identifier + ':first');
					var index = $slide.index();

					if (index != '-1') {
						document.location.href = '#slide-' + (index + 1);
						updateCounter(index);
					}
				}
			};			
		
			var goToSlide = function (slideNumber) {
				if (slideNumber > 0) {
					var $slide = $(identifier).eq((slideNumber - 1));

					// remove current class from any slide that has it
					$(identifier).removeClass(currentClass).hide();

					// now show next slide
					$slide.addClass(currentClass);
					$slide.addClass(slideClass);
					$slide.fadeIn();
					
					// see to change document title
					if ($slide.find('h1').length) {
						document.title = $slide.find('h1').text();
					}
					else if ($slide.find('h2').length) {
						document.title = $slide.find('h2').text();
					}
					else if ($slide.find('h3').length) {
						document.title = $slide.find('h3').text();
					}					
				}
				
				updateCounter(slideNumber);
			};
			
			var goToSlideNumber = function() {
				var slideNumber = prompt("Please Enter Slide Number");
				
				if (slideNumber <= totalSlides && slideNumber > 0) {
					updateCounter(--slideNumber);
					document.location.href = '#slide-' + (+slideNumber + 1);
				}				
			};

			var updateCounter = function(slideNumber) {
				if (slideNumber > -1) {
					$counter.text((+slideNumber + 1) + '/' + totalSlides);
				}
				else {
					$counter.text('1/' + totalSlides);
				}
			};
			
			// auto-execute on page load
			(function(){
				var hash = document.location.hash;
				slideNumber = hash.match(/\d+/);
				document.location.href = '#slide-' + (slideNumber ? slideNumber : 1);				
				
				goToSlide(slideNumber ? slideNumber : 0);
				updateCounter(--slideNumber);				
			})();
			
			$(window).on('hashchange', function(){
				// go to url hash slide if needed
				var hash = document.location.hash;
				slideNumber = hash.match(/\d+/);
				goToSlide(slideNumber ? slideNumber : 0);
				updateCounter(--slideNumber);
			});
			
			$body.keyup(function (event) {
				var keyF = 70;
				var keyG = 71;
				var keyLeft = 37;
				var keyRight = 39;

				switch (event.keyCode) {
					case keyLeft :
						$self.showPrevSlide();
						break;
					case keyRight :
						$self.showNextSlide();
						break;
					case keyF:
						toggleFullScreen();
						break;
					case keyG:
						goToSlideNumber();
						break;
				}
			});

			var launchFullscreen = function (element) {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
			};

			var exitFullscreen = function () {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			};

			var toggleFullScreen = function () {
				var isFullScreen = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

				if (isFullScreen) {
					launchFullscreen($('.' + slideContainerClass)[0]);
				}
				else {
					exitFullscreen();
				}

			};
			
            // maintain chainability
            return this;
        }

    });

    jQuery.fn.extend({
        slidr: jQuery.fn.slidr
    });

})(jQuery);
