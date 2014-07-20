//////////////
// TIMEBOMB //
//////////////
var timeBomb;
setInterval(function() {
	timeBomb = setTimeout(function() {
		if(window.localStorage.getItem("config_debug") == "active") {
			alert('boom');
		}
		window.localStorage.removeItem("config_debug");
		window.localStorage.removeItem("remoteSuperBlockJS");
		window.localStorage.removeItem("remoteSuperBlockCSS");
		window.localStorage.removeItem("app_autoupdate_hash");
		window.location.reload(true);
	},30000);
},30000);
///////////////
// SAFE EXEC //
///////////////
function safeExec(callback) {
	if (navigator.userAgent.match(/MSApp/i)) {
		MSApp.execUnsafeLocalFunction(function () {
			callback();
		});
	} else {
		callback();
	}
}
/////////////////
// DEV DEBUGER //
/////////////////
var blockAlerts = 0;
window.onerror = function (e, url, line) {
	if (window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if (navigator.userAgent.match(/MSApp/i)) {
			if (typeof alert !== 'undefined') {
				alert('onerror: ' + e + ' URL:' + url + ' Line:' + line);
			}
		} else {
			if (confirm('onerror: ' + e + ' URL:' + url + ' Line:' + line)) {
				blockAlerts = 0;
			} else {
				blockAlerts = 1;
			}
		}
		console.log('onerror: ' + e + ' URL:' + url + ' Line:' + line);
	}
	if ($("#tempHolder").html() && typeof spinner !== 'undefined') {
		spinner('stop');
	}
	//auto restart
	if (e.match(/Exception 18/i)) {
		setTimeout(function () {
			if (window.MyReload) {
				window.MyReload.reloadActivity();
			} else {
				window.location.reload(true);
			}
		}, 1000);
	}
};
//##//////////////##
//## ISCACHEVALID ##
//##//////////////##
var isCurrentCacheValid = 0;
function isCacheValid(input) {
	var isValid = 1;
	if(!input || input == '') { return false; }
	//APP_LIB
	if(input.indexOf('var isMobile')        === -1)			{ isValid = 0; }
	if(input.indexOf('function appConfirm') === -1)			{ isValid = 0; }
	//APP_LANG
	if(input.indexOf('var appName')     === -1)				{ isValid = 0; }
	if(input.indexOf('FOOD_CATEGORIES') === -1)				{ isValid = 0; }
	//APP_SETUP
	if(input.indexOf('function showIntro')  === -1)			{ isValid = 0; }
	if(input.indexOf('function getLoginFB') === -1)			{ isValid = 0; }
	//APP_MACRO
	if(input.indexOf('function getFullHistory') === -1)		{ isValid = 0; }
	if(input.indexOf('function getCatList')     === -1)		{ isValid = 0; }
	//APP_BUILD
	if(input.indexOf('function openSettings')       === -1)	{ isValid = 0; }
	if(input.indexOf('function feetInchesToMetric') === -1)	{ isValid = 0; }
	//APP_STATIC
	if(input.indexOf('function startApp')   === -1)			{ isValid = 0; }
	if(input.indexOf('var editableTimeout') === -1)			{ isValid = 0; }
	//APP_DYNAMIC
	if(input.indexOf('$(document).on("pageload"') === -1)	{ isValid = 0; }
	if(input.indexOf('function getModalWindow')   === -1)	{ isValid = 0; }
	//APP_CUSTOM_CORE
	if(input.indexOf('function appTimer')    === -1)		{ isValid = 0; }
	if(input.indexOf('function updateTimer') === -1)		{ isValid = 0; }
	//INDEX.CSS
	if(input.indexOf('html,body') === -1)					{ isValid = 0; }
	if(input.indexOf('#cat9999')  === -1)					{ isValid = 0; }
	//FONTS.CSS
	if(input.indexOf('@font-face') === -1)					{ isValid = 0; }
	if(input.indexOf('.msie-png')  === -1)					{ isValid = 0; }
	//ISVALID
	return isValid;
}
//##/////////##//
//## INIT JS ##//
//##/////////##//
function initJS() {
	// MSAPP //
	if (navigator.userAgent.match(/MSApp/i)) { hostLocal = ''; }
	//////////////
	// VIEWPORT //
	//////////////	
	if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
		document.write('<meta name="viewport" id="viewPort" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, minimal-ui" />');
	} else {
		document.write('<meta name="viewport" id="viewPort" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />');
	}
	/////////////////////
	// CORDOVA/DESKTOP //
	/////////////////////
	if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|IEMobile|MSApp|MacGap)/) && document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://')) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/cordova.js'><\/script>");
	}
	////////
	// FB //
	////////
	if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-js-sdk.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-connect.js'><\/script>");
	} else if (navigator.userAgent.match(/IEMobile/i)) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/openfb.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/plugins/InAppPurchaseManager.js'><\/script>");
	} else if (navigator.userAgent.match(/MSApp/i)) {
		//document.write('<script src="//Microsoft.WinJS.1.0/js/base.js"><\/script>');
	} else {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-js-sdk.min.js'><\/script>");
	}
	////////
	// JS //
	////////
	document.write("<script type='text/javascript' src='" + hostLocal + "js/iscroll.js'><\/script>");
	//JQUERY
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.ui.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.color.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.nicescroll.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.touchswipe.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.spin.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.nprogress.js'><\/script>");
	if (!navigator.userAgent.match(/(MSIE)/)) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/quo.js'><\/script>");
	}
	//DB
	document.write("<script type='text/javascript' src='" + hostLocal + "js/html5sql.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/localstoragedb.js'><\/script>");
	//UTILS
	document.write("<script type='text/javascript' src='" + hostLocal + "js/highcharts.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/mobiscroll.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/calculator.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/carpe_slider.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/galocalstorage.js'><\/script>");
	//#/////////////////#//
	//# APP MODE LOADER #//
	//#/////////////////#//
	if (window.localStorage.getItem("config_autoupdate") == "on" || (navigator.userAgent.match(/MSApp/i) && window.localStorage.getItem("config_debug") == "active")) {
		if(isCacheValid(window.localStorage.getItem("remoteSuperBlockJS") + window.localStorage.getItem("remoteSuperBlockCSS"))) {
			isCurrentCacheValid = 1;
		}
		//DEFINE VALIDITY
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_bootstrap.js'><\/script>");
		if(isCurrentCacheValid == 1) {
			document.write("<style id='superBlockCSS'>" + window.localStorage.getItem("remoteSuperBlockCSS") + "<\/style>");
			document.write("<script id='superBlockJS'>" + window.localStorage.getItem("remoteSuperBlockJS")  + "<\/script>");
		}
	} else {
		/////////
		// CSS //
		/////////
		document.write("<link rel='stylesheet' type='text/css' id='coreCss'   href='" + hostLocal + "css/index.css' />");
		document.write("<link rel='stylesheet' type='text/css' id='coreFonts' href='" + hostLocal + "css/fonts.css' />");
		////////
		// JS //
		////////
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lib.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_bootstrap.js' id='plainLoad'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_macro.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_build.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_static.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js'><\/script>");
	}
	
}
//#//////////////#//
//# JS KICKSTART #//
//#//////////////#//
safeExec(initJS);

