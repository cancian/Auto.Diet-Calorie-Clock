///////////////
// SAFE EXEC //
///////////////
var baseVersion = 1.5;
var UsrAgt  = navigator.userAgent;
var IsMsApp = (/MSApp/i).test(UsrAgt) ? true : false;
function safeExec(callback) {
	if (IsMsApp) {
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
		if (IsMsApp) {
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
	if (typeof spinner !== 'undefined') {
		spinner('stop');
	}
	//auto restart
	if ((/Exception 18/i).test(e)) {
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
	if(input.indexOf('var isMobile')        === -1)			{ return false; }
	if(input.indexOf('function appConfirm') === -1)			{ return false; }
	//APP_LANG
	if(input.indexOf('var appName')     === -1)				{ return false; }
	if(input.indexOf('FOOD_CATEGORIES') === -1)				{ return false; }
	//APP_SETUP
	if(input.indexOf('function showIntro')  === -1)			{ return false; }
	if(input.indexOf('function getLoginFB') === -1)			{ return false; }
	//APP_MACRO
	if(input.indexOf('function getFullHistory') === -1)		{ return false; }
	if(input.indexOf('function getCatList')     === -1)		{ return false; }
	//APP_BUILD
	if(input.indexOf('function openSettings')       === -1)	{ return false; }
	if(input.indexOf('function feetInchesToMetric') === -1)	{ return false; }
	//APP_STATIC
	if(input.indexOf('function startApp')   === -1)			{ return false; }
	if(input.indexOf('var editableTimeout') === -1)			{ return false; }
	//APP_DYNAMIC
	if(input.indexOf('$(document).on("pageload"') === -1)	{ return false; }
	if(input.indexOf('function getModalWindow')   === -1)	{ return false; }
	//APP_CUSTOM_CORE
	if(input.indexOf('function appTimer')    === -1)		{ return false; }
	if(input.indexOf('function updateTimer') === -1)		{ return false; }
	//INDEX.CSS
	if(input.indexOf('html,body') === -1)					{ return false; }
	if(input.indexOf('#cat9999')  === -1)					{ return false; }
	//FONTS.CSS
	if(input.indexOf('@font-face') === -1)					{ return false; }
	if(input.indexOf('.msie-png')  === -1)					{ return false; }
	//ISVALID
	return isValid;
}
//##/////////##//
//## INIT JS ##//
//##/////////##//
function initJS() {
	// MSAPP //
	if (IsMsApp) { hostLocal = ''; }
	/////////////////////
	// CORDOVA/DESKTOP //
	/////////////////////
	if (window.location.protocol.indexOf('http') === -1) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/cordova.js'><\/script>");
	}
	////////
	// FB //
	////////
	if (window.location.protocol.indexOf('http') === -1 && (/(iPhone|iPod|iPad|Android)/).test(navigator.userAgent)) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-js-sdk.js'><\/script>");
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-connect.js'><\/script>");
	} else if ((/IEMobile/i).test(navigator.userAgent)) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/openfb.js'><\/script>");
	} else if (!IsMsApp) {
		document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-js-sdk.min.js'><\/script>");
	}
	////////
	// JS //
	////////
	document.write("<script type='text/javascript' src='" + hostLocal + "js/iscroll.js'><\/script>");
	//JQUERY
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/quo.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.touchswipe.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.ui.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.color.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.nicescroll.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery.nprogress.js'><\/script>");
	//DB
	document.write("<script type='text/javascript' src='" + hostLocal + "js/localforage.js'><\/script>");
-	document.write("<script type='text/javascript' src='" + hostLocal + "js/html5sql.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/localstoragedb.js'><\/script>");
	//UTILS
	document.write("<script type='text/javascript' src='" + hostLocal + "js/carpe_slider.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/highcharts.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/mobiscroll.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/calculator.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/galocalstorage.js'><\/script>");
	//#/////////////////#//
	//# APP MODE LOADER #//
	//#/////////////////#//
	if (window.localStorage.getItem("config_autoupdate") == "on" || (IsMsApp && window.localStorage.getItem("config_debug") == "active")) {
		if(isCacheValid(window.localStorage.getItem("remoteSuperBlockJS") + window.localStorage.getItem("remoteSuperBlockCSS"))) {
			isCurrentCacheValid = 1;
		}
		//DEFINE VALIDITY
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_bootstrap.js"><\/script>');
		if(isCurrentCacheValid == 1) {
			if(!document.getElementById('superBlockCSS')) {
				document.write('<style type="text/css" id="superBlockCSS">' + window.localStorage.getItem('remoteSuperBlockCSS') + '<\/style>');
				document.addEventListener('DOMContentLoaded', function(event) {
					setTimeout(function() {
						$.globalEval(window.localStorage.getItem('remoteSuperBlockJS'));
					},0);
				},false);
			}
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

