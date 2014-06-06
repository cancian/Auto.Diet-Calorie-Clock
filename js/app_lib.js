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
if(window.navigator.msPointerEnabled) {
	touchstart = "MSPointerDown";
	touchend   = "MSPointerUp";
	touchmove  = "MSPointerMove";
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
	if(LANG.LANGUAGE[lang] == "pt") { 
		var res = gotDate + "/" + gotMonth + "/" + input.getFullYear();
	} else {
	//    var res = gotMonth + "/" + gotDate + "/" + input.getFullYear();
	//}
		var res = input.getFullYear() + "/" + gotMonth + "/" + gotDate;
	}
    return res;
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
//////////////////
// TIME ELAPSED //
//////////////////
function timeElapsed() {
/*
	var seconds = (new Date().getTime() - window.localStorage.getItem("config_start_time")) / 1000;
	var date = new Date(seconds * 1000);
	var dd   = Math.floor(seconds/86400);
	var hh   = date.getUTCHours();
	var mm   = date.getUTCMinutes();
	var ss   = date.getSeconds();
	//if (hh > 12) {hh = hh - 12;}
	//if (hh < 10) { hh = "0" + hh; }
	if (mm < 10) { mm = "0" + mm; }
	if (ss < 10) { ss = "0" + ss; }
	//hide secs > 1d
	var secs  = ":"+ss;
	var hours = hh+":";
	var dayName = LANG.DAY[lang];
	if(dd > 1)  { dayName = LANG.DAYS[lang]  }
	// This formats your string to HH:MM:SS
	if(hh == 0) { hours = ""; }
	if(dd > 0)  { dd = dd + dayName + ' '; secs = ''; } else { dd = ""; }
	//return dd+hours+mm+secs;
*/	
	var timeEl = (dateDiff(window.localStorage.getItem("config_start_time"),(new Date()).getTime())).split(LANG.AGO[lang]).join('').split(LANG.PREAGO[lang]).join('');
	//selective shrink
	if(timeEl) {
		if(timeEl.length > 20 && window.innerWidth <= 360) {	
		timeEl = timeEl.replace(LANG.MINUTES[lang],LANG.MIN[lang]);
		timeEl = timeEl.replace(LANG.MINUTE[lang],LANG.MIN[lang]);
		timeEl = trim(timeEl.replace('.',''));
		if(timeEl.match('min')) {
			timeEl = timeEl + '.';	
		}
	}
}
	return timeEl;
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

