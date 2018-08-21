document.addEventListener('DOMContentLoaded', init, {once:true});

// Declare DOM variables
var siteNavButton
var siteNav;
var menuStateText;
var siteNavLinks;

// Declare variables
var heroMediaQuery = window.matchMedia("(max-width: 33rem)");

function init() {
	// Initialise DOM variables
	siteNavButton = document.querySelector('#site-nav-button');
	siteNav = document.querySelector('#site-nav');
	menuStateText = document.querySelector('#menu-state-text');
	siteNavLinks = document.querySelector('#site-nav-links');

	// Activate nav menu
	siteNavButton.addEventListener('click', toggleNavMenu);

	// Listen for width changes
	heroMediaQuery.addListener(heroViewportChange);
}

function toggleNavMenu() {
	siteNavLinks.removeAttribute('style');
	setTimeout(function() {
		if(siteNav.hasAttribute('data-open')) {
			siteNav.removeAttribute('data-open');
			menuStateText.textContent = 'Open';
			siteNav.addEventListener('transitionend', function() {
				siteNavLinks.style.display = 'none';
			},{once:true});
		} else {
			siteNav.setAttribute('data-open', '');
			menuStateText.textContent = 'Close';
		}
	}, 10);
}

function heroViewportChange(mq) {
	if(mq.matches && !siteNav.hasAttribute('data-open')) {
		siteNavLinks.style.display = 'none';
	} else {
		siteNavLinks.removeAttribute('style');
	}
}