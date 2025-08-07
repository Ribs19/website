
// Matomo tracking
var _paq = window._paq = window._paq || [];

var matomoInitialized = false;
function InitializeMatomo() {
	if ( matomoInitialized ) return;
	matomoInitialized = true;
	console.log('Initializing Matomo.');
	_paq.push(["setExcludedQueryParams", ["clientid", "ck_subscriber_id", "qid", "license", "interests", "version", "vgo_ee", "conf"]]);
	_paq.push(['enableLinkTracking']);
	_paq.push(["setDoNotTrack", "true"]);
	_paq.push(["setCookieDomain", "*.__domain__"]);
	_paq.push(['setCustomDimension', 2, '2025-08-07-01']);
	_paq.push(['trackPageView']);
	(function () {
		var u = "https://postsharp.matomo.cloud/";
		_paq.push(['setTrackerUrl', u + 'matomo.php']);
		_paq.push(['setSiteId', '__site_id']);
		var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
		g.async = true; g.src = 'https://cdn.matomo.cloud/postsharp.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g, s);
	})();
}

// Check for _human verification in localStorage and dynamically load Turnstile if needed
var humanVerificationChecked = false;
function checkHumanVerification() {
  // Prevent multiple checks
  if (humanVerificationChecked) return;
  humanVerificationChecked = true;
  
  // Check if human verification exists in localStorage
  const humanVerified = localStorage.getItem('_human_verified');
  
  if (humanVerified === 'true') {
    InitializeMatomo();
  } else if (humanVerified === 'false') {
    // Ignoring.
  } else {
    loadTurnstile();
  }
}

// Dynamically load Turnstile script and create container
function loadTurnstile() {
  // Create the Turnstile script element
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
  script.async = true;
  script.defer = true;
  
  // Create the container div
  const container = document.createElement('div');
  container.id = 'turnstile-container';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  
  // Append both to the document
  document.body.appendChild(container);
  document.head.appendChild(script);
}

// Turnstile callback function
window.onloadTurnstileCallback = function () {
  turnstile.render("#turnstile-container", {
    sitekey: "0x4AAAAAABnl924VVHcjQp5L",
    callback: function (token) {
      console.log(`Turnstile challenge success.`);
      // Set localStorage to indicate human verification succeeded
      localStorage.setItem('_human_verified', 'true');
      InitializeMatomo();
    },
    'error-callback': function () {
      console.log('Turnstile challenge failed.');
      localStorage.setItem('_human_verified', 'false');
    },
    'expired-callback': function () {
      console.log('Turnstile challenge expired.');
      localStorage.setItem('_human_verified', 'false');
    },
    'timeout-callback': function () {
      console.log('Turnstile challenge timed out.');
      localStorage.setItem('_human_verified', 'false');
    }
  });
};

// Run the check when the document is ready
$(document).ready(function() {
  checkHumanVerification();
});