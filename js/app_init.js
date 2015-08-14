///////////////
// SAFE EXEC //
///////////////
if(typeof hostLocal === 'undefined') {
	var hostLocal = window.localStorage.getItem('config_debug') == 'active' ? 'http://192.168.1.5/' : '';
}
var staticVendor = ''; //'amazon';
var baseVersion  = 1.9;
var initTime     = new Date().getTime();
var UsrAgt  = navigator.userAgent;
var IsMsApp = (/MSApp/i).test(UsrAgt) ? true : false;
function safeExec(callback) {
	if(typeof MSApp !== 'undefined' && /MSAppHost\/3.0/i.test(navigator.userAgent)) {
		MSApp.execUnsafeLocalFunction = function(callback) {
			callback();	
		}
	}
	if (/MSApp/.test(navigator.userAgent)) {
		MSApp.execUnsafeLocalFunction(function () {
			if(typeof callback === 'function') {
				callback();
			}
		});
	} else {
		if(typeof callback === 'function') {
			callback();
		}
	}
}
/////////////////
// DEV DEBUGER //
/////////////////
var blockAlerts = 0;
window.onerror = function (e, url, line) {
	if(typeof e !== 'string') {
		e = JSON.stringify(e);
	}
	if(typeof url !== 'string') {
		url = JSON.stringify(url);
	}
	if(typeof line !== 'string') {
		line = JSON.stringify(line);
	}	
	console.log('onerror: ' + e + ' URL:' + url + ' Line:' + line);
	//
	if (window.localStorage.getItem('config_debug') == 'active' && blockAlerts == 0) {
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
	//ERROR
	if (typeof app !== 'undefined') {
		if (typeof app.analytics !== 'undefined') {
			app.analytics('error','onerror: ' + e + ' URL:' + url + ' Line:' + line);
		}	
	}
	//disable db
	if ((/InvalidStateError/i).test(e) && !window.localStorage.getItem('config_force_localstorage')) {
		window.localStorage.setItem('config_force_localstorage',true);
		setTimeout(function () {
			window.location.reload(true);
		}, 100);
	}
	//auto restart
	if ((/Exception 18/i).test(e)) {
		setTimeout(function () {
			if (typeof window.MyReload !== 'undefined') {
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
	if(input.indexOf('var isMobile')        === -1)			{ console.log("APP_LIB: 'var isMobile'"); return false; }
	if(input.indexOf('function appConfirm') === -1)			{ console.log("APP_LIB: 'function appConfirm'"); return false; }
	//APP_LANG
	if(input.indexOf('var appName')     === -1)				{ console.log("APP_LANG: 'var appName'"); return false; }
	if(input.indexOf('FOOD_CATEGORIES') === -1)				{ console.log("APP_LANG: 'FOOD_CATEGORIES'"); return false; }
	//APP_SETUP
	if(input.indexOf('function showIntro')  === -1)			{ console.log("APP_SETUP: 'function showIntro'"); return false; }
	if(input.indexOf('function getLoginFB') === -1)			{ console.log("APP_SETUP: 'function getLoginFB'"); return false; }
	//APP_MACRO
	if(input.indexOf('function getFullHistory') === -1)		{ console.log("APP_MACRO: 'function getFullHistory'"); return false; }
	if(input.indexOf('function getCatList')     === -1)		{ console.log("APP_MACRO: 'function getCatList'"); return false; }
	//APP_BUILD
	if(input.indexOf('var settingsHtml')            === -1)	{ console.log("APP_BUILD: var settingsHtml"); return false; }
	if(input.indexOf('function feetInchesToMetric') === -1)	{ console.log("APP_BUILD: 'function feetInchesToMetric'"); return false; }
	//APP_STATIC
	if(input.indexOf('function startApp')   === -1)			{ console.log("APP_STATIC: 'function startApp'"); return false; }
	if(input.indexOf('var editableTimeout') === -1)			{ console.log("APP_STATIC: 'var editableTimeout'"); return false; }
	//APP_DYNAMIC
	if(input.indexOf('$(document).on("pageload"') === -1)	{ console.log('APP_DYNAMIC: \'$(document).on("pageload"\''); return false; }
	if(input.indexOf('function getModalWindow')   === -1)	{ console.log("APP_DYNAMIC: 'function getModalWindow'"); return false; }
	//APP_CUSTOM_CORE
	if(input.indexOf('function appTimer')    === -1)		{ console.log("APP_CUSTOM_CORE: 'function appTimer'"); return false; }
	if(input.indexOf('function updateTimer') === -1)		{ console.log("APP_CUSTOM_CORE: 'function updateTimer'"); return false; }
	//INDEX.CSS
	if(input.indexOf('html,body') === -1)					{ console.log("INDEX.CSS: 'html,body'"); return false; }
	if(input.indexOf('#cat9999')  === -1)					{ console.log("INDEX.CSS: '#cat9999'"); return false; }
	//FONTS.CSS
	if(input.indexOf('@font-face')   === -1)				{ console.log("FONTS.CSS: '@font-face'"); return false; }
	if(input.indexOf('spinnerMask')  === -1)				{ console.log("FONTS.CSS: 'spinnerMask'"); return false; }
	//ISVALID
	return isValid;
}
//##/////////##//
//## INIT JS ##//
//##/////////##//
function initJS() {
	if(typeof hostLocal === 'undefined') {
		var hostLocal = window.localStorage.getItem('config_debug') == 'active' ? 'http://192.168.1.5/' : '';
	}
	///////////
	// MSAPP //
	if(/MSApp/i.test(navigator.userAgent)) { hostLocal = ''; }
	/////////////////////
	// CORDOVA/DESKTOP //
	/////////////////////
	if (!/http/i.test(window.location.protocol)) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/cordova.js"><\/script>');
	}
	////////
	// FB //
	////////
	if (!/http/i.test(window.location.protocol) && (/(iPhone|iPod|iPad|Android)/).test(navigator.userAgent)) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/facebook-js-sdk.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/facebook-connect.js"><\/script>');
	} else if (/IEMobile/i.test(navigator.userAgent) && !IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/openfb.js"><\/script>');
	} else if (/IEMobile/i.test(navigator.userAgent) && IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/winfb.js"><\/script>');
	} else if (!IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/facebook-js-sdk.min.js"><\/script>');
	}
	////////
	// JS //
	////////
	//ISCROLL
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/iscroll.js" id="iScrollTag"><\/script>');
	//JQUERY
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.nicescroll.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.touchswipe.js"><\/script>');
	//DB
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/localforage.js"><\/script>');
	//UTILS
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/galocalstorage.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/carpe_slider.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/highcharts.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/calculator.js"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/mobiscroll.js"><\/script>');
	//#/////////////////#//
	//# APP MODE LOADER #//
	//#/////////////////#//
	if (window.localStorage.getItem('config_autoupdate') == 'on' || (IsMsApp && window.localStorage.getItem('config_debug') == 'active')) {
		if(isCacheValid(window.localStorage.getItem('remoteSuperBlockJS') + window.localStorage.getItem('remoteSuperBlockCSS'))) {
			isCurrentCacheValid = 1;
		}
		//DEFINE VALIDITY
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_bootstrap.js"><\/script>');
		if(isCurrentCacheValid == 1) {
			if(!document.getElementById('superBlockCSS')) {
				//to head
				if(document.getElementById('CSSPlaceholder')) {
					document.getElementById('CSSPlaceholder').innerHTML = window.localStorage.getItem('remoteSuperBlockCSS');
				} else {
					document.write('<style type="text/css" id="superBlockCSS">' + window.localStorage.getItem('remoteSuperBlockCSS') + '<\/style>');
				}
				//JS
				document.addEventListener('DOMContentLoaded', function() {
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
		document.write('<link rel="stylesheet" type="text/css" id="coreCss"   href="' + hostLocal + 'css/index.css" />');
		document.write('<link rel="stylesheet" type="text/css" id="coreFonts" href="' + hostLocal + 'css/fonts.css" />');
		////////
		// JS //
		////////
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_lib.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_lang.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_setup.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_bootstrap.js" id="plainLoad"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_macro.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_build.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_static.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_dynamic.js"><\/script>');
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_custom_core.js"><\/script>');
	}
}
//#//////////////#//
//# JS KICKSTART #//
//#//////////////#//
safeExec(initJS);

