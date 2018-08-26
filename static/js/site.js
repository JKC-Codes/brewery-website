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

	// Set and return menu text
	get buttonText() {
		return siteNav._buttonText.textContent;
	},

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
		index = index % carousel.beersCount
		if(index < 0) {
			index = carousel.beersCount - 1;
		}
		carousel._spotlight = index;
		carousel.changeSpotlight();
	},

	setInitialSpotlight: function() {
		carousel.beersCount = carousel.beers.length;

		// Get beer dimensions for calculations
		let beerStyles = window.getComputedStyle(carousel.beers[0]);
		let beerMarginLeft = parseInt(beerStyles.marginLeft);
		let beerMarginRight = parseInt(beerStyles.marginRight);
		let beerWidth = parseInt(beerStyles.width);

		// Set variables for calculations
		carousel.beerTotalWidth = beerMarginLeft + beerMarginRight + beerWidth;
		carousel.initialSpotlight = Math.ceil((carousel.beersCount -1) / 2);
		carousel.fallbackOffset = 0;

		// Change spotlight to middle beer
		carousel.spotlight = carousel.initialSpotlight;

		// Adjust offset if justify centre isn't supported
		let beerPosition = carousel.beers[0].getBoundingClientRect();
		if(beerPosition.left - beerMarginLeft === 0) {
			carousel.adjustOffset(beerMarginLeft);
		}
	},

	adjustOffset: function(beerMarginLeft) {
		let beerPosition = carousel.beers[0].getBoundingClientRect();
		let resizing = false;

		window.addEventListener('resize', makeAdjustment);
		makeAdjustment();

		function makeAdjustment() {
			// Check if already running
			if(resizing) {
				return;
			}
			setTimeout(function() {
				resizing = false;
			}, 66);
			resizing = true;

			// Check for false positive
			if(beerPosition.left - beerMarginLeft !== 0) {
				console.log('false positive');
				carousel.setInitialSpotlight();
				window.removeEventListener('resize', makeAdjustment);
			}

			// Adjust offset
			let carouselWidth = carousel.element.getBoundingClientRect().width;
			let centre = -((carouselWidth - carousel.beerTotalWidth) / 2);
			carousel.fallbackOffset = centre + (carousel.beerTotalWidth * carousel.initialSpotlight);
			carousel.changeSpotlight();
		}
	},

	changeSpotlight: function() {
		let offset = carousel.beerTotalWidth * -carousel.initialSpotlight + carousel.fallbackOffset;
		let scrollAmount = carousel.beerTotalWidth * -carousel.spotlight;
		let translate = scrollAmount - offset;

		for(let i = 0; i < carousel.beersCount; i++) {
			let beer = carousel.beers[i];
			let caption = beer.querySelector('figcaption');

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