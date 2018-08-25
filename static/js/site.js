document.addEventListener('DOMContentLoaded', init, {once: true});

function init() {
	console.log('init run');
	console.log(document.readyState);
	siteNav.initialise();
	carousel.initialise();
}

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
		console.log('open fetched');
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
	_spotlightIndex: 0,
	get spotlight() {
		return carousel._spotlightIndex;
	},

	set spotlight(index) {
		index = index % carousel.beers.length
		if(index < 0) {
			index = carousel.beers.length - 1;
		}
		carousel._spotlightIndex = index;
		carousel.changeSpotlight();
	},

	setInitialSpotlight: function() {
		console.log('setting initial spotlight');
		console.log(document.readyState);
		let numberOfBeers = carousel.beers.length;
		let middleBeer = Math.ceil((numberOfBeers -1) / 2);
		carousel._spotlightIndex = middleBeer;
		carousel.initialSpotlightIndex = middleBeer;
		carousel.changeSpotlight();
	},
	initialSpotlightIndex: 0,

	changeSpotlight: function() {
		for(let i = 0; i < carousel.beers.length; i++) {
			let beer = carousel.beers[i];
			let caption = beer.querySelector('figcaption');
			let offset = carousel.spotlight - carousel.initialSpotlightIndex;
			let translate = -14 * offset;

			// Show text only for spotlight beer
			if(i === carousel.spotlight) {
				caption.removeAttribute('style');
			} else {
				caption.style.opacity = '0';
			}
			// Scroll spotlight beer into middle;
			beer.style.transform = 'translateX(' + translate + 'rem)';
		}
	}
}