///////////////
// SAFE EXEC //
///////////////
if(typeof hostLocal === 'undefined') {
	var hostLocal = window.localStorage.getItem('config_debug') == 'active' ? 'http://192.168.1.5/' : '';
}
var staticVendor = ''; //'amazon';
var baseVersion  = 1.9;
var initTime     = new Date().getTime();
var UsrAgt       = navigator.userAgent;
var IsMsApp      = (/MSApp/i).test(UsrAgt) ? true : false;
//safeExec
function safeExec(callback) {
	if (/MSApp/i.test(UsrAgt)) {
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
window.onerror = function (err, url, line) {
	if(!err)  { err  = ''; }
	if(!url)  { url  = ''; }
	if(!line) { line = ''; }
	//STRINGIFY
	if(typeof err !== 'string') {
		err  = JSON.stringify(err);
	}
	if(typeof url === 'string') {
		url  = JSON.stringify(url);
	}
	if(!typeof line === 'string') {
		line = JSON.stringify(line);
	}
	//LOG
	console.log('unhandled log: ' + err + ' URL: ' + url + ' Line: ' + line);
	//SAVE
	window.localStorage.setItem('error_log_unhandled','unhandled log: ' + err + ' URL: ' + url + ' Line: ' + line);
	//TRACK
	if (typeof app !== 'undefined') {
		if (typeof app.analytics !== 'undefined') {
			app.analytics('error','unhandled: ' + err + ' URL: ' + url + ' Line: ' + line);
		}
	}
	if (typeof spinner !== 'undefined') {
		spinner('stop');
	}
	//DEV ALERT
	if (window.localStorage.getItem('config_debug') === 'active' && blockAlerts == 0 && !(/InvalidStateError/i).test(err)) {
		if (IsMsApp) {
			if (typeof alert !== 'undefined') {
				alert('onerror: ' + err + ' URL: ' + url + ' Line: ' + line);
			}
		} else {
			if (confirm('onerror: ' + err + ' URL: ' + url + ' Line: ' + line)) {
				blockAlerts = 0;
			} else {
				blockAlerts = 1;
			}
		}
	}
	//disable ff db
	/*
	if ((/InvalidStateError/i).test(err) && !window.localStorage.getItem('config_force_localstorage')) {
		window.localStorage.setItem('config_force_localstorage',true);
		setTimeout(function () {
			window.location.reload(true);
		}, 0);
	}
	*/
	//auto restart android
	if (/Exception 18/i.test(err)) {
		setTimeout(function () {
			//RELOAD
			window.location.reload(true);
		},0);
	}
	return true;
};
//#////////#//
//# ZIPPER #//
//#////////#//
var Zipper={compress:function(o){var r,i,t,e={},n={},a="",s="",h="",f=2,p=3,C=2,d="",c=0,g=0;for(t=0;t<o.length;t+=1)if(a=o.charAt(t),e.hasOwnProperty(a)||(e[a]=p++,n[a]=!0),s=h+a,e.hasOwnProperty(s))h=s;else{if(n.hasOwnProperty(h)){if(h.charCodeAt(0)<256){for(r=0;C>r;r++)c<<=1,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++;for(i=h.charCodeAt(0),r=0;8>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1}else{for(i=1,r=0;C>r;r++)c=c<<1|i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i=0;for(i=h.charCodeAt(0),r=0;16>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1}f--,0==f&&(f=Math.pow(2,C),C++),delete n[h]}else for(i=e[h],r=0;C>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1;f--,0==f&&(f=Math.pow(2,C),C++),e[s]=p++,h=String(a)}if(""!==h){if(n.hasOwnProperty(h)){if(h.charCodeAt(0)<256){for(r=0;C>r;r++)c<<=1,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++;for(i=h.charCodeAt(0),r=0;8>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1}else{for(i=1,r=0;C>r;r++)c=c<<1|i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i=0;for(i=h.charCodeAt(0),r=0;16>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1}f--,0==f&&(f=Math.pow(2,C),C++),delete n[h]}else for(i=e[h],r=0;C>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1;f--,0==f&&(f=Math.pow(2,C),C++)}for(i=2,r=0;C>r;r++)c=c<<1|1&i,15==g?(g=0,d+=String.fromCharCode(c),c=0):g++,i>>=1;for(;;){if(c<<=1,15==g){d+=String.fromCharCode(c);break}g++}return d},readBits:function(o,r){for(var i,t=0,e=Math.pow(2,o),n=1;n!=e;)i=r.val&r.position,r.position>>=1,0==r.position&&(r.position=32768,r.val=r.string.charCodeAt(r.index++)),t|=(i>0?1:0)*n,n<<=1;return t},decompress:function(o){var r,i,t,e,n,a,s,h,f={},p=4,C=4,d=3,c="",g="",l=0,v={string:o,val:o.charCodeAt(0),position:32768,index:1};for(i=0;3>i;i+=1)f[i]=i;for(e=0,a=Math.pow(2,2),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;switch(r=e){case 0:for(e=0,a=Math.pow(2,8),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;h=String.fromCharCode(e);break;case 1:for(e=0,a=Math.pow(2,16),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;h=String.fromCharCode(e);break;case 2:return""}for(f[3]=h,t=g=h;;){for(e=0,a=Math.pow(2,d),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;switch(h=e){case 0:if(l++>1e4)return"Error";for(e=0,a=Math.pow(2,8),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;f[C++]=String.fromCharCode(e),h=C-1,p--;break;case 1:for(e=0,a=Math.pow(2,16),s=1;s!=a;)n=v.val&v.position,v.position>>=1,0==v.position&&(v.position=32768,v.val=v.string.charCodeAt(v.index++)),e|=(n>0?1:0)*s,s<<=1;f[C++]=String.fromCharCode(e),h=C-1,p--;break;case 2:return g}if(0==p&&(p=Math.pow(2,d),d++),f[h])c=f[h];else{if(h!==C)return null;c=t+t.charAt(0)}g+=c,f[C++]=t+c.charAt(0),p--,t=c,0==p&&(p=Math.pow(2,d),d++)}return g}};
//##//////////////##
//## ISCACHEVALID ##
//##//////////////##
var isCurrentCacheValid = 0;
function isCacheValid(input) {
	var isValid = 1;
	if(!input || input == '') { return false; }
	//APP_LIB
	if(input.indexOf('var isMobile')                === -1)	{ return false; }
	if(input.indexOf('function appConfirm')         === -1)	{ return false; }
	//APP_LANG
	if(input.indexOf('var appName')                 === -1)	{ return false; }
	if(input.indexOf('FOOD_CATEGORIES')             === -1)	{ return false; }
	//APP_SETUP
	if(input.indexOf('function showIntro')          === -1)	{ return false; }
	if(input.indexOf('function getLoginFB')         === -1)	{ return false; }
	//APP_MACRO
	if(input.indexOf('function getFullHistory')     === -1)	{ return false; }
	if(input.indexOf('function getCatList')         === -1)	{ return false; }
	//APP_BUILD
	if(input.indexOf('var settingsHtml')            === -1)	{ return false; }
	if(input.indexOf('function feetInchesToMetric') === -1)	{ return false; }
	//APP_STATIC
	if(input.indexOf('function startApp')           === -1)	{ return false; }
	if(input.indexOf('var editableTimeout')         === -1)	{ return false; }
	//APP_DYNAMIC
	if(input.indexOf('$(document).on("pageload"')   === -1)	{ return false; }
	if(input.indexOf('function getModalWindow')     === -1)	{ return false; }
	//APP_CUSTOM_CORE
	if(input.indexOf('function appTimer')           === -1)	{ return false; }
	if(input.indexOf('function updateTimer')        === -1)	{ return false; }
	//INDEX.CSS
	if(input.indexOf('html,body')                   === -1)	{ return false; }
	if(input.indexOf('#cat9999')                    === -1)	{ return false; }
	//FONTS.CSS
	if(input.indexOf('@font-face')                  === -1)	{ return false; }
	if(input.indexOf('spinnerMask')                 === -1)	{ return false; }
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
	///////////
	if(/MSApp/i.test(navigator.userAgent)) { hostLocal = ''; }
	////////
	// DB //
	////////
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/localforage.js" id="localforageJS"><\/script>');
	/////////////////////
	// CORDOVA/DESKTOP //
	/////////////////////
	if (!/http/i.test(window.location.protocol)) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/cordova.js" id="cordovaJS"><\/script>');
	}
	//////////////
	// FACEBOOK //
	//////////////
		   if ((/IEMobile/i.test(navigator.userAgent) && !IsMsApp && !/http/i.test(window.location.protocol)) || (!/http/i.test(window.location.protocol) && /Android|iPhone|iPod|iPad/i.test(navigator.userAgent))) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/openfb.js" id="openfbJS"><\/script>');
	} else if (/IEMobile/i.test(navigator.userAgent) && IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/winfb.js"id="winfbJS" ><\/script>');
	} else if (!IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/facebook-all.js" id="facebookJS"><\/script>');
	}
	////////
	// JS //
	////////
	//ISCROLL
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/iscroll.js" id="iscrollJS"><\/script>');
	//JQUERY
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.js" id="jqueryJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.nicescroll.js" id="nicescrollJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.touchswipe.js" id="touchswipeJS"><\/script>');
	//UTILS
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/carpe_slider.js" id="carpesliderJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/calculator.js" id="calculatorJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/highcharts.js" id="highchartsJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/mobiscroll.js" id="mobiscrollJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/galocalstorage.js" id="galocalstorageJS"><\/script>');
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

