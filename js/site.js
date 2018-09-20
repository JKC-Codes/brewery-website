/*
==========
Site navigation menu
==========
*/
var siteNav = {
	initialise: function() {
		// Define DOM objects
		siteNav.element = document.querySelector('#site-nav');
		siteNav.button = document.querySelector('#site-nav-button');
		siteNav._buttonText = document.querySelector('#menu-state-text');
		siteNav.links = document.querySelector('#site-nav-links');

		// Toggle site navigation menu on click
		siteNav.button.addEventListener('click', siteNav.toggle);

		// Show nav on wide screens
		let mediaQuery = window.matchMedia("(max-width: 33rem)");
		mediaQuery.addListener(siteNav.showOnWideScreens);
		siteNav.showOnWideScreens(mediaQuery);

		// Remove fallback
		siteNav.links.classList.remove('noscript');
	},

	// Set and return whether menu is open
	_open: false,
	get open() {
		return siteNav._open;
	},

	set open(boolean) {
		siteNav.element.setAttribute('data-open', boolean);
		siteNav._open = boolean;
	},

	// Set menu text
	set buttonText(text) {
		siteNav._buttonText.textContent = text;
	},

	// Toggle menu opening and closing
	toggle: function() {
		siteNav.links.removeAttribute('style');
		setTimeout(function() {
			if(siteNav.open) {
				siteNav.open = false;
				siteNav.buttonText = 'Open';
				siteNav.element.addEventListener('transitionend', function() {
					if(siteNav.open) return;
					siteNav.links.style.display = 'none';
				},{once:true});
			} else {
				siteNav.open = true;
				siteNav.buttonText = 'Close';
			}
		}, 10);
	},

	// Show nav on wide screens
	showOnWideScreens: function(mq) {
		if(mq.matches && !siteNav.open) {
			// Prevent animation and tabbing on narrow page load
			siteNav.links.style.display = 'none';
		} else {
			// Remove display:none on wide screens
			siteNav.links.removeAttribute('style');
		}
	}
}


/*
==========
Beer Carousel
==========
*/
var carousel = {
	initialise: function() {
		// Define DOM objects
		carousel.element = document.querySelector('#beer-images');
		carousel.beers = carousel.element.querySelectorAll('figure');
		carousel.buttonLeft = document.querySelector('#carousel-left');
		carousel.buttonRight = document.querySelector('#carousel-right');

		// Remove scrollbar
		carousel.element.style.overflowX = "hidden";
		carousel.element.setAttribute('tabindex', '-1');

		// Show fade
		carousel.element.classList.remove('noscript');

		// Highlight middle beer
		carousel.setInitialSpotlight();

		// Scroll beer carousel on button click
		carousel.buttonLeft.addEventListener('click', function() {
			carousel.spotlight--;
		});
		carousel.buttonRight.addEventListener('click', function() {
			carousel.spotlight++;
		});
	},

	// Set and return spotlight beer
	_spotlight: 0,
	get spotlight() {
		return carousel._spotlight;
	},

	set spotlight(index) {
		index = index % carousel.beers.length
		if(index < 0) {
			index = carousel.beers.length - 1;
		}
		carousel._spotlight = index;
		carousel.changeSpotlight();
	},

	setInitialSpotlight: function() {
		// Set variables for calculations
		carousel.beerTotalWidth = 216;
		carousel.initialSpotlight = Math.ceil((carousel.beers.length -1) / 2);

		// Change spotlight to middle beer
		carousel.spotlight = carousel.initialSpotlight;

		// Fallback - Ensure carousel is not displayed full width before checking
		let carouselTotalWidth = carousel.beerTotalWidth * carousel.beers.length;
		let mediaQuery = window.matchMedia("(min-width:" + carouselTotalWidth + "px)");

		function checkIfNarrow(mq) {
			if(!mq.matches) {
				checkFallbackNeed();
				mediaQuery.removeListener(checkIfNarrow);
			}
		}
		mediaQuery.addListener(checkIfNarrow);
		checkIfNarrow(mediaQuery);

		// Check if fallback for centering carousel is necessary
		function checkFallbackNeed() {
			let beerProperties = carousel.beers[carousel.spotlight].getBoundingClientRect();
			let carouselProperties = carousel.element.getBoundingClientRect();
			let centre = (carouselProperties.width / 2) + carouselProperties.left;
			let offset = centre - (beerProperties.width / 2);

			if(beerProperties.left !== offset) {
				window.addEventListener('resize', function() {
					if(!carousel.fallbackRunning) {
						carousel.fallbackRunning = true;
						requestAnimationFrame(carousel.setOffsetFallback);
					}
				});
				carousel.setOffsetFallback();
			}
		}
	},

	setOffsetFallback: function() {
		let carouselWidth = carousel.element.getBoundingClientRect().width;
		let offset = (carouselWidth - carousel.beerTotalWidth) / 2;

		carousel.offsetFallback = offset;
		carousel.changeSpotlight();
		carousel.fallbackRunning = false;
	},

	changeSpotlight: function() {
		let offset = carousel.beerTotalWidth * -carousel.initialSpotlight;
		if(carousel.offsetFallback) {
			offset = -carousel.offsetFallback;
		}
		let scrollAmount = carousel.beerTotalWidth * -carousel.spotlight;
		let translate = scrollAmount - offset;

		for(let i = 0; i < carousel.beers.length; i++) {
			let beer = carousel.beers[i];
			let image = beer.querySelector('img');
			let caption = beer.querySelector('figcaption');

			// Scale beers according to order
			switch(carousel.spotlight - i) {
				case 0:
					image.style.transform = 'scale(1)';
					break;
				case 1:
				case -1:
					image.style.transform = 'scale(0.85)';
					break;
				default:
					image.style.transform = 'scale(0.7)';
			}

			// Show text only for spotlight beer
			if(i === carousel.spotlight) {
				caption.removeAttribute('style');
			} else {
				caption.style.opacity = '0';
			}
			// Scroll spotlight beer into middle;
			beer.style.transform = 'translateX(' + translate + 'px)';
		}
	}
}


/*
==========
Run scripts on site load
==========
*/

function init() {
	siteNav.initialise();
	carousel.initialise();
}

document.addEventListener('DOMContentLoaded', init, {once: true});
if(document.readyState !== 'loading') {
	init();
	document.removeEventListener('DOMContentLoaded', init, {once: true});
}