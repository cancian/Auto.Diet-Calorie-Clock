//#/////////////#//
//# GLOBAL VARS #//
//#/////////////#//
var storage             = window.localStorage;
var appBalance;
var appBalanceOver;
var appStatus;
var appHeader;
var db;
var dbName              = "mylivediet.app";
var lib;
var lib2;
var hasSql			    = (window.openDatabase && window.localStorage.getItem("config_nodb") != "active") ? true : false;
var AND                 = " ";
var initialScreenWidth  = window.innerWidth;
var initialScreenHeight = window.innerHeight;
var orientationSwitched = 0;
var initialScreenSize   = window.innerHeight;
var lastScreenSize      = window.innerHeight;
var lastScreenResize    = window.innerHeight;
var opaLock             = 0;
var loadingDivTimer;
var timerPerf           = (new Date().getTime());
var timerDiff           = 100;
var timerWait           = 100;
var noTimer;  
var ref;
var preTab;
var afterTab;
var timerKcals;
var rebuildHistory;
var blockModal = false;
var modalTimer;
jQuery.support.cors     = true
function voidThis()   { }
function voidMe()     { }
///////////////////
// ERROR HANDLER //
///////////////////
function errorHandler(error) {
	//console.log(JSON.stringify(error));
	if(window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if(navigator.userAgent.match(/MSApp/i)) {
			alert(JSON.stringify(error));
		} else {
			if(confirm(JSON.stringify(error))) { blockAlerts = 0; } else { blockAlerts = 1; }
		}
		//if(window.external) { window.external.Notify('onerror: ' + e + ' URL:' + url + ' Line:' + line); } 
		console.log(JSON.stringify(error));
	}
}
/*
var GlobalDebug = (function () {
    var savedConsole = console;
    return function(debugOn,suppressAll){
        var suppress = suppressAll || false;
        if(debugOn === false) {
            console = {};
            console.log = function () { };
            if(suppress) {
                console.info = function () { };
                console.warn = function () { };
                console.error = function () { };
            } else {
                console.info = savedConsole.info;
                console.warn = savedConsole.warn;
                console.error = savedConsole.error;              
            }
        } else {
            console = savedConsole;
        }
    }
})();

var console = {};
console.log = function(e) {
	if(!$("#appDebug").html()) {
		$("body").prepend("<div id='appDebug'></div>");
		$("#appDebug").css("overflow","auto");
		$("#appDebug").css("position","absolute");
		$("#appDebug").css("top","0");
		$("#appDebug").css("left","100px");
		$("#appDebug").css("right","100px");
		$("#appDebug").css("height",$("#appHeader").height() + "px");
		$("#appDebug").css("box-sizing","border-box");
		$("#appDebug").css("padding","6px");
		$("#appDebug").css("z-index","99");
		$("#appDebug").css("display","block");
		$("#appDebug").css("background-color","rgba(0,0,0,.1)");
		$("#appDebug").css("color","rgba(255,255,255,.8)");
		$("#appDebug").css("opacity","1");
	}
	$("#appDebug").prepend(e+"<br>");
}
*/
/////////////
// OPTIONS //
/////////////
var appMode = "direct";
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobile = {
	Cordova: function() {
		return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
	},
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	},
	Windows: function() {
		return (navigator.userAgent.match(/IEMobile/i)) ? true : false;
	},
	//Windows: function() {
	//	return navigator.userAgent.match(/Windows/i) ? true : false;
	//},
	MSApp: function() {
		return navigator.userAgent.match(/MSApp/i) ? true : false;
	},	
	FirefoxOS: function() {
		return ((/firefox/).test(navigator.userAgent.toLowerCase()) && (/mobile/).test(navigator.userAgent.toLowerCase()) && (/gecko/).test(navigator.userAgent.toLowerCase())) ? true : false;
	},
	OSX: function() {
		return ((/Macintosh|Mac OS X/i.test(navigator.userAgent)) && !navigator.userAgent.match(/iPhone|iPad|iPod/i)) ? true : false;
	}
}
//#///////////#//
//# MOBILE OS #//
//#///////////#//
function isDesktop() {
	//first
	var isDesktop = ('DeviceOrientationEvent' in window || 'orientation' in window);
	if(/Windows NT|Macintosh|Mac OS X|Linux/i.test(navigator.userAgent)) isDesktop = true;
	if(/Mobile/i.test(navigator.userAgent)) isDesktop = false;
	//second
	var a = navigator.userAgent || navigator.vendor || window.opera;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) { isDesktop = false; }
	//return
	return isDesktop;
}
//#///////////////#//
//# GET USERAGENT #//
//#///////////////#//
var prefix;
var vendorClass; 
var transitionend;
     if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase()))	{ prefix = '-ms-';     transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/firefox/).test(navigator.userAgent.toLowerCase())) 			{ prefix = '-moz-';    transitionend = 'transitionend';       vendorClass = 'moz';    }
else 																	{ prefix = '-webkit-'; transitionend = 'webkitTransitionEnd'; vendorClass = 'webkit'; } 
//console.log(vendorClass + ' | ' + transitionend + ' | ' + prefix);
////////////////////////
// CONVERT CSS PREFIX //
////////////////////////
$.support.cors = true;
if(vendorClass == "moz" || vendorClass == "msie") {
	$.ajax({
	    url: hostLocal + "css/index.css",
    	dataType: "text",
	    success: function(rawCss) {
			//moz syntax
			if(vendorClass == "moz") {
				rawCss = rawCss.split('box-sizing').join('-moz-box-sizing');
				//rawCss = rawCss.split('-webkit-linear-gradient').join('linear-gradient');
			}
			//msie backface slowdown
			if(vendorClass == "msie") {
				//rawCss = rawCss.split('-webkit-backface-visibility: hidden;').join('');
			}
			if(navigator.userAgent.match(/MSApp/i)) {
				MSApp.execUnsafeLocalFunction(function() {
					$("#coreCss").remove();
					$("#coreFonts").prepend("<style type='text/css' id='coreCss'></style>");
					$("#coreCss").html(rawCss.split('-webkit-').join('-' + vendorClass.replace("ie","") + '-'));
				});
			} else {
				$("#coreCss").remove();
				$("#coreFonts").prepend("<style type='text/css' id='coreCss'></style>");
				$("#coreCss").html(rawCss.split('-webkit-').join('-' + vendorClass.replace("ie","") + '-'));
			}
		}
	});
}
//////////////////
// INJECT FONTS //
//////////////////
/*
$("#coreFonts").remove();
$.ajax({
    url: hostLocal + "css/fonts.css",
    dataType: "text",
    success: function(rawCss) {

	if(navigator.userAgent.match(/MSApp/i)) {
		MSApp.execUnsafeLocalFunction(function() {
			$("head").append("<style type='text/css' id='coreFonts'></style>");
			$("#coreFonts").html(rawCss);
		});
	} else {
		$("head").append("<style type='text/css' id='coreFonts'></style>");
		$("#coreFonts").html(rawCss);
	}
}});
*/
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
function isCordova() {
	return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
}
function androidVersion() {
	if(navigator.userAgent.match(/Android/i) && document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
		return parseFloat(navigator.userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return -1;
	}
}
function hasTouch() {
	return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);	
}
function hasTap() {
	return ( ("ontouchstart" in document) || ("ontouchstart" in window));//|| navigator.msPointerEnabled);
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
if(window.navigator.msPointerEnabled && navigator.userAgent.match(/MSApp|IEMobile/i)) {
	//touchmove  = "MSPointerMove";
	touchend   = "MSPointerUp";
	//touchstart = "MSPointerDown";
}
/////////////////
// NUMBER ONLY //
/////////////////
function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	//backspace, enter, shift, left, right
	if(charCode == 8 || charCode == 13 || charCode == 16 || charCode == 37 || charCode == 39) { 
		return true; 
	}
	if(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}
//////////
// TRIM //
//////////
function trim(str) {
	if(!str) { return ''; }
	str = str.replace(/^\s+/, '');
	for(var i = str.length - 1; i >= 0; i--) {
		if(/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
	/*
    if(!input) return "";
	input    = new Date(input);
    var res  = (input.getMonth()+1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
    var hour = input.getHours(); //+1;
    var ampm = "AM";
	if(hour === 12) ampm = "PM";
    if(hour > 12) {
        hour-=12;
        ampm = "PM";
    }
    var minute = input.getMinutes(); //+1;
    if(minute < 10) minute = "0" + minute;
    res += hour + ":" + minute + " " + ampm;
    return res;
	*/
    if(!input) { return ""; }
	input        = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var hour     = input.getHours();
    var minute   = input.getMinutes(); //+1;
    if(minute < 10)   { minute = "0" + minute; }
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	//
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate + ' - ' + hour + ":" + minute;
}
////////////////////
// DAY UTC FORMAT //
////////////////////
function DayUtcFormat(input) {
    if(!input) return "";
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	var res = input.getFullYear() + "/" + gotMonth + "/" + gotDate;
    return res;
}
////////////////
// DAY FORMAT //
////////////////
function dayFormat(input) {
    if(!input) return "";
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	//if(LANG.LANGUAGE[lang] == "pt") { 
	//	var res = gotDate + "/" + gotMonth + "/" + input.getFullYear();
	//} else {
	//  var res = gotMonth + "/" + gotDate + "/" + input.getFullYear();
	//}
	return res = input.getFullYear() + "/" + gotMonth + "/" + gotDate;
	//}
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	//no future dates
	if(date1 > date2) { date1 = new Date().getTime() }

	//Get 1 day in milliseconds
	var one_day  = 1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = date1;
	var date2_ms = date2;
	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var minutes   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var hours     = Math.floor(difference_ms % 24);
	var days      = Math.floor(difference_ms/24);

	var lMinutes = " " + LANG.MINUTES[lang] + " ";
	var lHours   = " " + LANG.HOURS[lang] + " ";
	var lDays    = " " + LANG.DAYS[lang] + " ";

	if(minutes == 0) { var lMinutes = ""; minutes = ""; }
	if(hours   == 0) { var lHours   = ""; hours   = ""; }
	if(days    == 0) { var lDays    = ""; days    = ""; }

	if(minutes == 1) { var lMinutes = " " + LANG.MINUTE[lang] + " "; }
	if(hours   == 1) { var lHours   = " " + LANG.HOUR[lang] + " ";   }
	if(days    == 1) { var lDays    = " " + LANG.DAY[lang] + " ";    }

	if(days    > 3)                             { var lHours   = ""; hours   = ""; }
	if(days    > 0)                             { var lMinutes = ""; minutes = ""; }
	if(days    > 0 && hours   > 0)              { var lDays    = lDays  + LANG.AND[lang] + " "; }
	if(hours   > 0 && minutes > 0)              { var lHours   = lHours + LANG.AND[lang] + " "; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; var lMinutes = " " + LANG.MINUTES[lang] + " "; }

	return LANG.PREAGO[lang] + " " + days + lDays + hours + lHours + minutes + lMinutes + " " + LANG.AGO[lang] + " ";
}
////////////////////////
// WINDOW ORIENTATION //
////////////////////////
function getOrientation() {
	if(window.orientation == 90 || window.orientation == -90) {
		return "landscape";
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return "portrait";
	}
}
//////////////////////
// ANDROID 2 SELECT //
//////////////////////
function android2Select() {
	if(isMobile.Android() && androidVersion() < 4) {
		$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
		$('#dummyInput').focus();
		$('#dummyInput').blur();
		$('#dummyInput').remove();
	}
}
//////////////
// KICKDOWN //
//////////////
function kickDown(el) {
	if(!el) { el = '#appContent'; }
	if(!$('body').hasClass('android2')) {
		if(!isDesktop() || isMobile.MSApp()) {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			//window.scroll($(el)[0].scrollTop,0,0);
		}
	} else {
		$(el).scrollTop($(el).scrollTop());
	}
}
/////////////////
// MSAPP METRO //
/////////////////
if (navigator.userAgent.match(/MSApp/i)) {
	/////////////////
	// METRO ALERT //
	/////////////////
	(function() {
		var alertsToShow = [];
		var dialogVisible = false;
		function showPendingAlerts() {
			if (dialogVisible || !alertsToShow.length) {
				return;
			}
			dialogVisible = true;
			(new Windows.UI.Popups.MessageDialog(alertsToShow.shift())).showAsync().done(function () {
				dialogVisible = false;
				showPendingAlerts();
			})
		}
		window.alert = function (message) {
			if (window.console && window.console.log) {
				window.console.log(message);
			}
			alertsToShow.push(message);
			showPendingAlerts();
		}
	})();
	/////////////
	// LICENSE //
	/////////////
	function isInAppPurchaseValid(pName) {
		//var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;
		var currentApp    = Windows.ApplicationModel.Store.CurrentApp;
		var inAppLicenses = currentApp.licenseInformation.productLicenses;
		if(inAppLicenses.hasKey(pName)) {
			if(inAppLicenses.lookup(pName).isActive) { 
				return true;
			}
		}
		return false;
	}
	///////////////////
	// PRIVACY CHARM // For an introduction to the Blank template, see the following documentation:
	/////////////////// http://go.microsoft.com/fwlink/?LinkId=232509
	/*
	(function() {
		"use strict";
		WinJS.Binding.optimizeBindingReferences = true;
		var app = WinJS.Application;
		var activation = Windows.ApplicationModel.Activation;
		app.onactivated = function (args) {
			if(args.detail.kind === activation.ActivationKind.launch) {
				args.setPromise(WinJS.UI.processAll());
			}
		};
		app.oncheckpoint = function (args) { };
		WinJS.Application.onsettings = function (e) {
			e.detail.e.request.applicationCommands.append(new Windows.UI.ApplicationSettings.SettingsCommand('Privacy policy', 'Privacy policy', function () {
				Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri('http://kcals.net/privacy.html'));
			}));
		};
		app.start();
	})();
	*/
}
//#////////////////////////#//
//# Base64 encode / decode #// 
//#////////////////////////#// http://www.webtoolkit.info
var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3,
		enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = Base64._utf8_encode(input);
		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3;
		var enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}
var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");

//getEntryHtml = Base64.encode(getEntryHtml);
//getEntryHtml = Base64.decode(getEntryHtml);
//if(base64Matcher.test(getEntryHtml)) {  }


/*
var scriptLoader = {
    _loadScript: function (url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        if (callback) {
            script.onreadystatechange = function () {
                if (this.readyState == 'loaded') callback();
            }
            script.onload = callback;
        }
        head.appendChild(script);
    },
 
    load: function (items, iteration) {
        if (!iteration) iteration = 0;
        if (items[iteration]) {
            scriptLoader._loadScript(
                items[iteration],
                function () {
                    scriptLoader.load(items, iteration+1);
                }
            )
        }
    }
}


scriptLoader.load([
'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js',
'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js',
]);
*/
 