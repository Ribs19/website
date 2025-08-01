
function InitializeMatomo() {
	var _paq = window._paq = window._paq || [];
	_paq.push(["setExcludedQueryParams", ["clientid", "ck_subscriber_id", "qid", "license", "interests", "version", "vgo_ee", "conf"]]);
	_paq.push(['enableLinkTracking']);
	_paq.push(["setDoNotTrack", "true"]);
	_paq.push(["setCookieDomain", "*.metalama.net"]);
	_paq.push(['trackPageView']);
	(function () {
		var u = "https://postsharp.matomo.cloud/";
		_paq.push(['setTrackerUrl', u + 'matomo.php']);
		_paq.push(['setSiteId', '10']);
		var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
		g.async = true; g.src = 'https://cdn.matomo.cloud/postsharp.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g, s);
	})();
}

// Check for _human verification in localStorage and dynamically load Turnstile if needed
function checkHumanVerification() {
  // Check if human verification exists in localStorage
  const humanVerified = localStorage.getItem('_human_verified');
  
  if (humanVerified === 'true') {
    console.log('Human verification succeeded, initializing Matomo directly');
    InitializeMatomo();
  } else if (humanVerified === 'false') {
    console.log('Human verification previously failed, ignoring Matomo directly');
  } else {
    console.log('Human verification not found, loading Turnstile');
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
      InitializeMatomo();
    },
    'expired-callback': function () {
      console.log('Turnstile challenge expired.');
      localStorage.setItem('_human_verified', 'false');
      InitializeMatomo();
    },
    'timeout-callback': function () {
      console.log('Turnstile challenge timed out.');
      localStorage.setItem('_human_verified', 'false');
      InitializeMatomo();
    }
  });
};

// Run the check when the document is ready
$(document).ready(function() {
  checkHumanVerification();
});