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
//#////////////#//
//# ZIP~BASE64 #//
//#////////////#//https://github.com/pieroxy/lz-string
var zip;
var unzip;
(function() {
	var ZIP=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);
	//BASE64
	var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(r){var e,t,o,a,h,n,c,d="",C=0;for(r=Base64._utf8_encode(r);C<r.length;)e=r.charCodeAt(C++),t=r.charCodeAt(C++),o=r.charCodeAt(C++),a=e>>2,h=(3&e)<<4|t>>4,n=(15&t)<<2|o>>6,c=63&o,isNaN(t)?n=c=64:isNaN(o)&&(c=64),d=d+this._keyStr.charAt(a)+this._keyStr.charAt(h)+this._keyStr.charAt(n)+this._keyStr.charAt(c);return d},decode:function(r){var e,t,o,a,h,n,c,d="",C=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");C<r.length;)a=this._keyStr.indexOf(r.charAt(C++)),h=this._keyStr.indexOf(r.charAt(C++)),n=this._keyStr.indexOf(r.charAt(C++)),c=this._keyStr.indexOf(r.charAt(C++)),e=a<<2|h>>4,t=(15&h)<<4|n>>2,o=(3&n)<<6|c,d+=String.fromCharCode(e),64!=n&&(d+=String.fromCharCode(t)),64!=c&&(d+=String.fromCharCode(o));return d=Base64._utf8_decode(d)},_utf8_encode:function(r){r=r.replace(/\r\n/g,"\n");for(var e="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?e+=String.fromCharCode(o):o>127&&2048>o?(e+=String.fromCharCode(o>>6|192),e+=String.fromCharCode(63&o|128)):(e+=String.fromCharCode(o>>12|224),e+=String.fromCharCode(o>>6&63|128),e+=String.fromCharCode(63&o|128))}return e},_utf8_decode:function(r){for(var e="",t=0,o=c1=c2=0;t<r.length;)o=r.charCodeAt(t),128>o?(e+=String.fromCharCode(o),t++):o>191&&224>o?(c2=r.charCodeAt(t+1),e+=String.fromCharCode((31&o)<<6|63&c2),t+=2):(c2=r.charCodeAt(t+1),c3=r.charCodeAt(t+2),e+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),t+=3);return e}},base64Matcher=new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
	//ENCODER
	function BE(e64){ if(e64) { return Base64.encode(e64); } };
	function BD(e64){ if(e64) { return Base64.decode(e64); } };
	//ZIPPER
	var ZC = ZIP.compress;
	var ZD = ZIP.decompress;
	//WRAPPER
	zip   = function (data) { if(data) { return BE(ZC(data)); } };
	unzip = function (data) { if(data) { return ZD(BD(data)); } };
}());
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
	/////////////
	// ISCROLL //
	/////////////
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/iscroll.js" id="iscrollJS"><\/script>');
	/////////////////
	// LOCALFORAGE //
	/////////////////
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
	//JQUERY
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.js" id="jqueryJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.touchswipe.js" id="touchswipeJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.nicescroll.js" id="nicescrollJS"><\/script>');
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
				//CSS
				if(document.getElementById('CSSPlaceholder')) {
					document.getElementById('CSSPlaceholder').innerHTML = window.localStorage.getItem('remoteSuperBlockCSS');
				} else {
					document.write('<style type="text/css" id="superBlockCSS">' + window.localStorage.getItem('remoteSuperBlockCSS') + '<\/style>');
				}
				//JS
				setTimeout(function() {
					document.addEventListener('DOMContentLoaded', function() {
						$.globalEval(window.localStorage.getItem('remoteSuperBlockJS'));
					},false);
				},0);
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

