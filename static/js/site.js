document.addEventListener('DOMContentLoaded', function() {
	siteNav.initialise();
	carousel.initialise();
}, {once:true});

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

		// Highlight initial beer
		carousel.changeSpotlight();

		// Scroll beer carousel on button click
		carousel.buttonLeft.addEventListener('click', function() {
			carousel.spotlight--;
		});
		carousel.buttonRight.addEventListener('click', function() {
			carousel.spotlight++;
		});
	},

	// Set and return spotlight beer
	_spotlightIndex: 2,
	get spotlight() {
		return carousel._spotlightIndex;
	},
	set spotlight(index) {
		if(index >= carousel.beers.length) {
			index = 0;
		} else if(index < 0) {
			index = carousel.beers.length-1;
		}
		carousel._spotlightIndex = index;
		carousel.changeSpotlight();
	},

	changeSpotlight: function() {
		// Remove text from beers not in the spotlight
		for(let i = 0; i < carousel.beers.length; i++) {
			let beer = carousel.beers[i].querySelector('figcaption');
			if(i === carousel.spotlight) {
				beer.removeAttribute('style');
			} else {
				beer.style.opacity = '0';
			}
		}
	}
}