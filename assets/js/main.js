/*
var swiper = new Swiper('.swiper-container', {
  navigation: {
	 nextEl: '.swiper-button-next',
	 prevEl: '.swiper-button-prev',
  },
  pagination: {
	 el: '.swiper-pagination',
	 clickable: true,
	 renderBullet: function (index, className) {
		return '<span class="' + className + '">' + (index + 1) + '</span>';
	 },
  },
});
*/
(() => {
	"use strict";
	let bodyLockStatus = true;
	let bodyLockToggle = (delay = 500) => {
		if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
	};
	let bodyUnlock = (delay = 500) => {
		if (bodyLockStatus) {
			setTimeout((() => {
				document.documentElement.classList.remove("lock");
			}), delay);
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	let bodyLock = (delay = 500) => {
		if (bodyLockStatus) {
			document.documentElement.classList.add("lock");
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	function menuInit() {
		if (document.querySelector(".icon-menu")) document.addEventListener("click", (function (e) {
			if (bodyLockStatus && e.target.closest(".icon-menu")) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
			}
		}));
	}
	window["FLS"] = true;
	menuInit();
})();


function initializeHeader() {
	var lastScrollTop = 0;
	var $header = $('header');
	var $spacer = $('.header-spacer');
	var currentSubmenu = null;  // Store the currently open submenu
	function isMobile() {
		return getComputedStyle(document.body).getPropertyValue('--is-mobile').trim() === '1';
	}

	function isTouch() {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0
	}

	function setHeaderBg(scrollTop) {
		if (scrollTop > 85) {
			$header.css('background', '#130722');
		} else {
			$header.css('background', 'transparent');
		}
	}

	// Check the background immediately on load
	setHeaderBg($(window).scrollTop());

	// Pin the header when scrolling up, unpin when scrolling down.
	$(window).scroll(function () {
		var scrollTop = $(this).scrollTop();

		if (scrollTop > lastScrollTop) {
			$header.removeClass('pinned');
			$spacer.hide();
		} else {
			if (scrollTop > 85) {
				$header.addClass('pinned');
				$spacer.show();
			} else {
				$header.removeClass('pinned');
				$spacer.hide();
			}
		}

		setHeaderBg(scrollTop);
		lastScrollTop = scrollTop;
	});

	$(".has-dropdownmenu").hover(
		function () {
			if (!isMobile()) { // Only for desktop
				var submenuId = $(this).find("a").data("submenu");

				if (currentSubmenu && currentSubmenu !== submenuId) {
					$("#" + currentSubmenu).stop(true, true).hide();
				}

				$("#" + submenuId).stop(true, true).show();
				currentSubmenu = submenuId;

				setHeaderBg($(window).scrollTop());
			}
		},
		function (e) {
			if (!isMobile()) { // Only for desktop
				if ($(e.relatedTarget).closest('.dropdownmenu').length === 0) {
					if (currentSubmenu) {
						$("#" + currentSubmenu).stop(true, true).hide();
						currentSubmenu = null;
					}
				}
			}
		}
	);


	$(".dropdownmenu").hover(
		function () {
			$(this).stop(true, true).show();
			setHeaderBg($(window).scrollTop());
		},
		function (e) {
			if ($(e.relatedTarget).closest(".has-dropdownmenu, .dropdownmenu, header").length) return;

			$(this).stop(true, true).hide();
			setHeaderBg($(window).scrollTop());
		}
	);

	var currentSubmenu = null;

	// Present <a> link behavior on touch because there is no hover.
	if (isTouch()) {
		$(".has-dropdownmenu > a").on("click", function (e) {
			if (!isMobile() || $(this).hasClass('.has-mobile-dropdownmenu')) {
				e.preventDefault();
			}
		});
	}


	// Click on the link on mobile displays the drop-down menu in the mobile way.
	if (isMobile()) {
		$(".has-mobile-dropdownmenu > a").on("click", function (e) {

			var submenuId = $(this).data("submenu");
			e.preventDefault();

			var $submenu = $("#" + submenuId);
			var $parentItem = $(this).parent(); // .has-dropdownmenu

			// Close others and remove their class
			if (currentSubmenu && currentSubmenu !== submenuId) {
				$("#" + currentSubmenu).stop(true, true).slideUp();
				$(".has-dropdownmenu").removeClass("submenu-open");
			}

			// Toggle
			if ($submenu.is(":visible")) {
				$submenu.stop(true, true).slideUp();
				$parentItem.removeClass("submenu-open");
				currentSubmenu = null;
			} else {
				$submenu.stop(true, true).slideDown();
				$parentItem.addClass("submenu-open");
				currentSubmenu = submenuId;
			}

			setHeaderBg($(window).scrollTop());
		}
		);
	}

	// Close on click outside
	$(document).on("click", function (e) {
		if (isMobile()) {
			if (
				!$(e.target).closest(".has-dropdownmenu").length &&
				!$(e.target).closest(".dropdownmenu").length
			) {
				if (currentSubmenu) {
					$("#" + currentSubmenu).stop(true, true).slideUp();
					$(".has-dropdownmenu").removeClass("submenu-open");
					currentSubmenu = null;
					setHeaderBg($(window).scrollTop());
				}
			}
		}
	});

	// Close on resize
	$(window).on("resize", function () {
		if (!isMobile() && currentSubmenu) {
			$("#" + currentSubmenu).hide();
			$(".has-dropdownmenu").removeClass("submenu-open");
			currentSubmenu = null;
			setHeaderBg($(window).scrollTop());
		}
	});
}

$(document).ready(function () {
	initializeHeader();


	// Manage the pinned status of toc_nav in the blog.
	var isLeftTocPinned = false;

	function adjustPinned() {
		var scrollPosition = $(window).scrollTop();
		if (scrollPosition > 600 && !isLeftTocPinned) {
			$('.toc_nav').addClass('pinned');
			isLeftTocPinned = true;
		} else if (scrollPosition < 200 && isLeftTocPinned) {
			$('.toc_nav').removeClass('pinned');
			isLeftTocPinned = false;
		}
	}

	adjustPinned();
	$(window).scroll(function () {
		adjustPinned();
	});

});


// Track the active section in the right nav.
$(document).ready(function () {
	var $navLinks = $("nav.right-nav a");

	// Scroll 100px under the clicked target instantly to cope with the fixed header.
	$navLinks.on("click", function (e) {
		e.preventDefault();
		var targetId = $(this).attr("href");
		var $target = $(targetId);
		if ($target.length) {
			// Removed animation; perform instant scroll
			$("html, body").scrollTop($target.offset().top - 100);
		}
	});

	function onScroll() {
		var currentSectionId = "";
		var minDistance = Infinity;

		$navLinks.each(function () {
			var $link = $(this);
			var targetId = $link.attr("href").replace(/^#/, "");
			var $target = $("#" + targetId);
			if ($target.length) {
				var rect = $target[0].getBoundingClientRect();
				if (rect.top >= 0 && rect.top < minDistance) {
					minDistance = rect.top;
					currentSectionId = targetId;
				}
			}
		});

		$navLinks.parent().removeClass("active");

		if (currentSectionId) {
			$("nav.right-nav a[href='#" + currentSectionId + "']").parent().addClass("active");
		}
	}

	$(window).on("scroll", onScroll);
	onScroll();
});

// Handle the 'show-more' magic.
$(document).ready(function () {
	$('p.show-more').each(function () {
		var $showMorePara = $(this);
		var $showMoreContent = $showMorePara.nextUntil('h2, h3, h4'); // All blocks until the next header
		var $link = $('<a class="show-more-link">' + $showMorePara.text() + '</a>'); // Create the hyperlink

		// Hide the blocks
		$showMoreContent.addClass('hidden');

		// Replace the paragraph with the hyperlink
		$showMorePara.replaceWith($link);

		// Add a click event to the hyperlink
		$link.on('click', function (e) {
			e.preventDefault();
			$link.hide(); // Hide the link
			$showMoreContent.removeClass('hidden'); // Show all hidden blocks
		});
	});
});

// Home page.
$(document).ready(function () {
	// Handle the FAQ section
	$('.faq-section .question').click(function () {
		// Inactivate other questions
		$('.faq-section .question').not(this).removeClass('active');
		$('.faq-section .arrow').not($(this).parent().find('.arrow')).removeClass('arrow-animate');
		$('.faq-section .answer').not($(this).parent().find('.answer')).slideUp(280);

		// Toggle the clicked question
		$(this).toggleClass('active');
		$(this).parent().find('.arrow').toggleClass('arrow-animate');
		$(this).parent().find('.answer').slideToggle(280);
	});

	// Handles the Lottie animation
	if ($('#graphLottie').length) {
		var graphLottieHasStarted = false;

		$(window).scroll(function () {
			var top = $('#approach').offset().top;

			if ($(window).scrollTop() > (top - 600) && $(window).scrollTop() < (top + 500) && graphLottieHasStarted == false) {
				lottie.loadAnimation({
					container: document.getElementById('graphLottie'),
					renderer: 'svg',
					loop: false,
					autoplay: true,
					path: '/assets/animations/graph/data.json'
				});
				graphLottieHasStarted = true;
			}
		}).scroll();
	}
});


$(document).ready(function () {
	// This is how to add a banner, if enabled.
	/*
	if (!localStorage.getItem('bannerDismissed')) {
	  const banner = $(`
		<div id="preview-banner" style="background: #ffcc00; color: #000; padding: 10px; text-align: center; width: 100%; position: fixed; bottom: 0; z-index: 1000;">
		  <span>This website is a preview. It applies to Metalama 2025.1, the first open-source version of Metalama.</span>
		  <button id="dismiss-banner" style="margin-left: 10px; background: #000; color: #fff; border: none; padding: 5px 10px; cursor: pointer;">Dismiss</button>
		</div>
	  `);
	  $('body').prepend(banner);
	  $('body').css('padding-bottom', '50px'); // Adjust for banner height
  
	  $('#dismiss-banner').on('click', function () {
		$('#preview-banner').remove();
		$('body').css('padding-bottom', '0');
		localStorage.setItem('bannerDismissed', 'true');
	  });
	}
	  */


});



// Scrolling without scrollbars
document.querySelectorAll('.scroll-wrapper').forEach(wrapper => {
	const content = wrapper.querySelector('.scroll-content');
	const btnUp = wrapper.querySelector('.scroll-btn.up');
	const btnDown = wrapper.querySelector('.scroll-btn.down');

	const updateButtonOpacity = () => {
		const scrollTop = content.scrollTop;
		const scrollHeight = content.scrollHeight;
		const clientHeight = content.clientHeight;

		if (scrollTop <= 0) {
			btnUp.classList.add('disabled');
		} else {
			btnUp.classList.remove('disabled');
		}

		if (scrollTop + clientHeight >= scrollHeight - 20) {
			btnDown.classList.add('disabled');
		} else {
			btnDown.classList.remove('disabled');
		}
	};

	// Scroll event listener just for this content div
	content.addEventListener('scroll', updateButtonOpacity);

	// Click listeners only affect their local content
	btnUp.addEventListener('click', () => {
		content.scrollBy({ top: -100, behavior: 'smooth' });
	});

	btnDown.addEventListener('click', () => {
		content.scrollBy({ top: 100, behavior: 'smooth' });
	});

	// Initialize opacity once on load
	updateButtonOpacity();
});

var _paq = window._paq = window._paq || [];

var matomoInitialized = false;
function InitializeMatomo() {
	if ( matomoInitialized ) return;
	matomoInitialized = true;
	console.log('Initializing Matomo.');
	_paq.push(["setExcludedQueryParams", ["clientid", "ck_subscriber_id", "qid", "license", "interests", "version", "vgo_ee", "conf"]]);
	_paq.push(['enableLinkTracking']);
	_paq.push(["setDoNotTrack", "true"]);
	_paq.push(["setCookieDomain", "*.metalama.net"]);
	_paq.push(['setCustomDimension', 1, '2025-08-07-01']);
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