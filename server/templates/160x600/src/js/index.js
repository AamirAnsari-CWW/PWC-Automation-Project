var initBanner = (function() {
	"use strict";
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// B A S E   V A R S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var ids = [];
	var imageLoadedCount = 0;
	var width = 160;
	var height = 600;
	var banImgs = ban_1_Imgs;
	var banTxt = [];
	var conceptNum = 1;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// S E T T E R S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Pass properties into Frame Module js doc.
	setModuleProps(width, height);

	// ======================================================================================================
	// C O R E   F U N S T I O N S - [DO NOT EDIT]
	// ======================================================================================================
	function initBanner() {

		// Assign any variables here
		// takes all DOM els with ids and assigns them to a global var with the name of the id
		idsToVars();

		// Create frame divs for banners
		createDivs();

		// Initializes clicktag code
		initClickTag();

		// Import / Parse Dyanmic Data
		if(adType == "standard"){
			setStandardBan();
		} else {
			setDyanmicBan();
		}

		if (window.location.href.indexOf("mccannny") != -1) {

			wrapper.className += ' centerMe ';
			wrapper.appendChild(click_through);
			wrapper.appendChild(tooltip);
			wrapper.appendChild(details_btn);
		}

	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// S E T   B A N N E R   T Y P E S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Set standard banner CTAs and data
	function setStandardBan() {
		waitForWebfonts(fonts);
	}

	// Set dynamic banner CTAs and data
	function setDyanmicBan() {

		switch (adPlatform) {
			case "Sizmek":
				adkit.onReady(handleSizmekData);
				break;
			case "DoubleClick":
				Enabler.addEventListener(studio.events.StudioEvent.INIT, handleDoubleClickData);
				break;
			default:
		}

	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// P A R S E   D Y A N M I C   D A T A
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function handleSizmekData() {
		setSizmekData(adkit);
		waitForWebfonts(fonts);
	}

	function handleDoubleClickData() {
		setDoubleClickData();
		waitForWebfonts(fonts);
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// C R E A T E   D I V S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Create frame divs for banners
	function createDivs() {
		for(var i = 1; i <= totalDivs; i++){
			auto_divs.innerHTML = auto_divs.innerHTML + "<div id='d" + i + "' style='position: absolute'></div>";
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// S T A R T   A N I M A T I O N
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function startAnimation() {

		wrapper.className += 'show';
		click_through.className += 'show';
		eval("banner_" + conceptNum + "()");
	}

	// Create vars from IDs
	function idsToVars() {

		[].forEach.call(document.querySelectorAll('*'), function(el) {
			if (el.id) {
				window[el.id] = el;
				ids.push(el.id);
			}
		});
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// I N I T   C L I C K T A G   A N D   B A C K U P
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Initialize Clickthrough
	function initClickTag() {

		click_through.onclick = function() {
			switch (adPlatform) {
				case "Sizmek":
					adkit.clickthrough();
					break;
				case "DoubleClick":
					if(adType === "standard"){
						window.open(window.clickTag);
					} else {
			      Enabler.exit(dcDCOExitURL);
					}
					break;
				default:

			}
		};
	}


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// P R E L O A D   F O N T S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function waitForWebfonts(fonts) {


			// waitForWebfonts with IntvervalArray
			// Use array to maintain multiple intervals in a loop
			// use timeoutInterval to continue after n seconds (for IE11 bug)

			var loadedFonts = 0;
			var intervalArray = new Array(fonts.length);
			var timeoutInterval;
			timeoutInterval = setTimeout(continueFontTimeout, 1000);

			for(var i = 0, l = fonts.length; i < l; ++i) {

				var font = fonts[i];

				var tempSpan = document.createElement('span');
				// Characters that vary significantly among different fonts
				tempSpan.innerHTML = 'giItT1WQy@!-/#';
				// Visible - so we can measure it - but not on the screen
				tempSpan.style.position      = 'absolute';
				tempSpan.style.left          = '-10000px';
				tempSpan.style.top           = '-10000px';
				// Large font size makes even subtle changes obvious
				tempSpan.style.fontSize      = '160px';
				// Reset any font properties
				tempSpan.style.fontFamily    = 'Times New Roman';
				tempSpan.style.fontVariant   = 'normal';
				tempSpan.style.fontStyle     = 'normal';
				tempSpan.style.fontWeight    = 'normal';
				tempSpan.style.letterSpacing = '0';
				document.body.appendChild(tempSpan);

				// Remember width with no applied web font
				var width = tempSpan.offsetWidth;

				tempSpan.style.fontFamily = font;



				if(!checkFont()) {
						intervalArray[i] = setInterval(checkFont, 50);
				}
			}

			function checkFont() {
					// Compare current width with original width

					if(tempSpan && tempSpan.offsetWidth != width) {
							loadedFonts++;

							tempSpan.parentNode.removeChild(tempSpan);
							tempSpan = null;
					}

					// If all fonts have been loaded
					if(loadedFonts == fonts.length) {
						// clear timeoutInterval...intervalArray cleared in continueInit()
						clearInterval(timeoutInterval);
						continueInit();
						return true;
					}
					else
					{
						return false;
					}
			}

			function continueInit() {

				// fininish init, clear intervals and start animation
				for(var i = 0, l = fonts.length; i < l; ++i) {
					if(intervalArray[i]) {
						clearInterval(intervalArray[i]);
					}
				}
				
				// startAnimsation();
				loadImages();
			
			}

			function continueFontTimeout() {
				continueInit();
			}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// P R E L O A D   I M A G E S
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function imageLoaded() {	

		imageLoadedCount++;

		if (imageLoadedCount == banImgs.length){
			startAnimation();
		}
	}

	function loadImages() {		

		var count = 0;

		banImgs.forEach(function(element) {
			var imgLoader = new Image();
			imgLoader.onload = function(){	imageLoaded();	}
			imgLoader.src = banImgs[count];
			count++;
		});
		
	}

	return initBanner;
})();
