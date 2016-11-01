///////////////
// SAFE EXEC //
///////////////
if(typeof hostLocal === 'undefined') {
	var hostLocal = localStorage.getItem('config_debug') == 'active' ? https + '192.168.1.5/' : '';
}
var staticVendor = ''; //'amazon';
var baseVersion  = 2.1;
var initTime     = new Date().getTime();
var UsrAgt       = navigator.userAgent;
var IsMsApp      = /MSApp/i.test(UsrAgt) ? true : false;
//safeExec
function safeExec(callback) {
	if (IsMsApp) {
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
//##/////////////##//
//## DEV DEBUGER ##//
//##/////////////##//
var blockAlerts = 0;
/////////////
// ONERROR //
/////////////
window.onerror = function (err, url, line) {
	if(!err)  { err  = ''; }
	if(!url)  { url  = ''; }
	if(!line) { line = ''; }
	//STRINGIFY
	if(typeof err !== 'string') {
		err  = JSON.stringify(err);
	}
	if(typeof url !== 'string') {
		url  = JSON.stringify(url);
	}
	if(typeof line !== 'string') {
		line = JSON.stringify(line);
	}
	//IGNORE BASIC
	if(/800a139e|isTrusted|InvalidStateError|UnknownError|space|stack|size|pile|NS_ERROR/i.test(err)) {
		return; 
	}
	//LOG
	console.log('window.onerror: ' + err + ' URL: ' + url + ' Line: ' + line);
	//TRACK UNHANDLED
	if (typeof app !== 'undefined') {
		if (typeof app.analytics !== 'undefined') {
			app.analytics('error','unhandled: ' + err + ' URL: ' + url + ' Line: ' + line);
		}
	}
	//SAVE ERROR LOG
	localStorage.setItem('error_log_unhandled','unhandled log: ' + err + ' URL: ' + url + ' Line: ' + line);
	//SPINNER STOP
	if (typeof spinner !== 'undefined') {
		spinner('stop');
	}
	//DEV ALERT
	if (localStorage.getItem('config_debug') === 'active' && blockAlerts == 0) {
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
	if ((/InvalidStateError/i).test(err) && !localStorage.getItem('config_force_localstorage')) {
		localStorage.setItem('config_force_localstorage',true);
		setTimeout(function () {
			//window.location.reload(true);
			window.location.replace(window.location.href);
		}, 0);
	}
	*/
	//auto restart android
	if (/Exception 18/i.test(err)) {
		setTimeout(function () {
			//RELOAD
			//window.location.reload(true);
			window.location.replace(window.location.href);
		},0);
	}
	return true;
};
//#//////////#//
//# LZSTRING #//
//#//////////#//
var LZString=function(){function n(n,t){if(!o[n]){o[n]={};for(var r=0;r<n.length;r++)o[n][n.charAt(r)]=r}return o[n][t]}var t=String.fromCharCode,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",o={},a=function(n){n.data_position==n.bitsPerChar-1?(n.data_position=0,n.data.push(n.getCharFromInt(n.data_val)),n.data_val=0):n.data_position++},i=function(n,t){for(var r=0;t>r;r++)n.data_val=n.data_val<<1|1&n.value,a(n),n.value>>=1},c=function(n){if(Object.prototype.hasOwnProperty.call(n.dictionaryToCreate,n.w)){var t=n.w.charCodeAt(0)<256;t||(n.value=1);for(var r=0;r<n.numBits;r++)n.data_val=t?n.data_val<<1:n.data_val<<1|n.value,a(n),t||(n.value=0);n.value=n.w.charCodeAt(0),i(n,t?8:16),n.enlargeIn=--n.enlargeIn||Math.pow(2,n.numBits++),delete n.dictionaryToCreate[n.w]}else n.value=n.dictionary[n.w],i(n,n.numBits);n.enlargeIn=--n.enlargeIn||Math.pow(2,n.numBits++),n.dictionary[n.wc]=n.dictSize++,n.w=String(n.c)};return{compressToBase64:function(n){if(null===n)return"";for(var t=this._compress(n,6,function(n){return r.charAt(n)});t.length%4>0;)t+="=";return t},decompressFromBase64:function(t){return null===t?"":""===t?null:this._decompress(t.length,32,function(e){return n(r,t.charAt(e))})},compressToUTF16:function(n){return null===n?"":this._compress(n,15,function(n){return t(n+32)})+" "},decompressFromUTF16:function(n){return null===n?"":""===n?null:this._decompress(n.length,16384,function(t){return n.charCodeAt(t)-32})},compressToUint8Array:function(n){for(var t=this.compress(n),r=new Uint8Array(2*t.length),e=0,o=t.length;o>e;e++){var a=t.charCodeAt(e);r[2*e]=a>>>8,r[2*e+1]=a%256}return r},decompressFromUint8Array:function(n){if(null===n||void 0===n)return this.decompress(n);for(var r=new Array(n.length/2),e=0,o=r.length;o>e;e++)r[e]=256*n[2*e]+n[2*e+1];var a="";return r.forEach(function(n){a+=t(n)}),this.decompress(a)},compressToEncodedURIComponent:function(n){return null===n?"":this._compress(n,6,function(n){return e.charAt(n)})},decompressFromEncodedURIComponent:function(t){return null===t?"":""===t?null:(t=t.replace(/ /g,"+"),this._decompress(t.length,32,function(r){return n(e,t.charAt(r))}))},compress:function(n){return this._compress(n,16,function(n){return t(n)})},_compress:function(n,t,r){if(null===n)return"";for(var e={value:void 0,dictionary:{},dictionaryToCreate:{},c:"",wc:"",w:"",enlargeIn:2,dictSize:3,numBits:2,data:[],data_val:0,data_position:0,bitsPerChar:t,getCharFromInt:r},o=0;o<n.length;o++)e.c=n.charAt(o),Object.prototype.hasOwnProperty.call(e.dictionary,e.c)||(e.dictionary[e.c]=e.dictSize++,e.dictionaryToCreate[e.c]=!0),e.wc=e.w+e.c,Object.prototype.hasOwnProperty.call(e.dictionary,e.wc)?e.w=e.wc:c(e);return""!==e.w&&c(e),e.value=2,i(e,e.numBits),e.data.push(r(e.data_val<<t-e.data_position)),e.data.join("")},decompress:function(n){return null===n?"":""===n?null:this._decompress(n.length,32768,function(t){return n.charCodeAt(t)})},_decompress:function(n,r,e){var o,a,i,c=[0,1,2],u=4,s=4,l=3,d=[],p={val:e(0),position:r,index:1},f=function(n){for(var t=0,o=0;n>o;o++){var a=p.val&p.position;p.position>>=1,0===p.position&&(p.position=r,p.val=e(p.index++)),t|=(a>0)*(1<<o)}return t};if(2===(o=f(2)))return"";for(2>o&&(i=t(f(o?16:8))),d.push(a=c[3]=i);;){if(p.index>n)return"";if(2===(i=f(l)))return d.join("");if(2>i&&(c[s++]=t(f(i?16:8)),i=s-1,u--),u=u||Math.pow(2,l++),!c[i]&&i!==s)return null;var h=c[i]||a+a.charAt(0);d.push(h),c[s++]=a+h.charAt(0),u--,a=h,u=u||Math.pow(2,l++)}}}}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!==module&&(module.exports=LZString);
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
safeExec(function() {
	if(typeof hostLocal === 'undefined') {
		var hostLocal = localStorage.getItem('config_debug') == 'active' ? https + '192.168.1.5/' : '';
	}
	///////////
	// MSAPP //
	///////////
	if(/MSApp/i.test(navigator.userAgent)) { hostLocal = ''; }
	/////////////////
	// LOCALFORAGE //
	/////////////////
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/localforage.js" id="localforageJS"><\/script>');
	/////////////
	// ISCROLL //
	/////////////
	if(!localStorage.getItem('intro_dismissed')) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/iscroll.js" id="iscrollJS"><\/script>');
	}
	/////////////////////
	// CORDOVA/DESKTOP //
	/////////////////////
	if (!/http/i.test(window.location.protocol)) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/cordova.js" id="cordovaJS"><\/script>');
	}
	//////////////
	// FACEBOOK //
	//////////////
		   if ((/IEMobile/i.test(navigator.userAgent) && !IsMsApp && !/http/i.test(window.location.protocol)) || (!/http/i.test(window.location.protocol) && /Android|iPhone|iPod|iPad/i.test(navigator.userAgent) && !/MSApp/i.test(navigator.userAgent))) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/openfb.js" id="openfbJS"><\/script>');
	} else if (/IEMobile|Windows Phone/i.test(navigator.userAgent) && IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/winfb.js"id="winfbJS" ><\/script>');
	} else if (!IsMsApp) {
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/facebook-all.js" id="facebookJS"><\/script>');
	}
	////////
	// JS //
	////////
	//JQUERY
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.js" id="jqueryJS"><\/script>');
	//PLUGINS
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/jquery.nicescroll.js" id="nicescrollJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/highcharts.js" id="highchartsJS"><\/script>');
	//UTILS
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/galocalstorage.js" id="galocalstorageJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/carpe_slider.js" id="carpesliderJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/calculator.js" id="calculatorJS"><\/script>');
	document.write('<script type="text/javascript" src="' + hostLocal + 'js/mobiscroll.js" id="mobiscrollJS"><\/script>');
	//#/////////////////#//
	//# APP MODE LOADER #//
	//#/////////////////#//
		if (localStorage.getItem('config_autoupdate') == 'on' || (IsMsApp && localStorage.getItem('config_debug') == 'active')) {
			if (isCacheValid(localStorage.getItem('remoteSuperBlockJS') + localStorage.getItem('remoteSuperBlockCSS'))) {
				isCurrentCacheValid = 1;
			}
		/////////////////////
		// DEFINE VALIDITY //
		/////////////////////
		document.write('<script type="text/javascript" src="' + hostLocal + 'js/app_bootstrap.js"><\/script>');
		if(isCurrentCacheValid == 1) {
			if(!document.getElementById('superBlockCSS')) {
				//to head
				if(document.getElementById('CSSPlaceholder')) {
					document.getElementById('CSSPlaceholder').innerHTML = window.localStorage.getItem('remoteSuperBlockCSS');
				} else {
					document.write('<style type="text/css" id="superBlockCSS">' + window.localStorage.getItem('remoteSuperBlockCSS') + '<\/style>');
				}
				/////////////
				// JS EVAL //
				/////////////
				document.addEventListener('DOMContentLoaded', function() {
					try {
						////////////
						// APPEND //
						////////////
						var scriptBlock;
						scriptBlock = document.createElement('script');
						scriptBlock.text = window.localStorage.getItem('remoteSuperBlockJS');
						document.head.appendChild(scriptBlock).parentNode.removeChild(scriptBlock);
					} catch(err) {
						//////////
						// EVAL //
						//////////
						var indirect = eval;
						indirect(window.localStorage.getItem('remoteSuperBlockJS'));
					}				
				}, false);
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
});

