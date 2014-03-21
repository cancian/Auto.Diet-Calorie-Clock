//#/////////////#//
//# GLOBAL VARS #//
//#/////////////#//
var db;
var dbName            = "mylivediet.app";
var lib;
var lib2;
var hasSql			  = (window.openDatabase && window.localStorage.getItem("config_nodb") != "active") ? true : false;
var AND               = " ";
var initialScreenSize = window.innerHeight;
var lastScreenSize    = window.innerHeight;
var lastScreenResize  = window.innerHeight;
var opaLock           = 0;
var loadingDivTimer;
var timerPerf         = (new Date().getTime());
var timerDiff         = 100;
var timerWait         = 100;
function voidThis() { }
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
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	}
};
//#////////#//
//# VENDOR #//
//#////////#//
var prefix = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/msie/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? '-moz-'    :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? '-ms-'     :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? ''         : '';

var transitionend = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/msie/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? 'transitionend'       :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? 'webkitTransitionEnd' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? 'transitionend'       :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? 'transitionend'       : '';

var vendorClass = (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
!/msie/.test(navigator.userAgent.toLowerCase()) &&
!/webkit/.test(navigator.userAgent.toLowerCase())) ? 'moz'    :
(/webkit/.test(navigator.userAgent.toLowerCase())) ? 'webkit' :
(/msie/.test(navigator.userAgent.toLowerCase()))   ? 'msie'   :
(/opera/.test(navigator.userAgent.toLowerCase()))  ? 'opera'  : '';
////////////////////////
// CONVERT VENDOR CSS //
////////////////////////
if(vendorClass == "moz" || vendorClass == "msie") {
	$("#coreCss").remove();
	$("head").append("<style type='text/css' id='coreCss'></style>");
	$.get(hostLocal + "css/index.css",function(rawCss) {
		//moz syntax
		if(vendorClass == "moz") {
			rawCss = rawCss.split('box-sizing').join('-moz-box-sizing');
		}
		//msie backface slowdown
		if(vendorClass == "msie") {
			rawCss = rawCss.split('-webkit-backface-visibility: hidden;').join('');
		}
		$("#coreCss").html(rawCss.split('-webkit-').join('-' + vendorClass.replace("ie","") + '-'));
	});
}
//////////////////
// INJECT FONTS //
//////////////////
$("head").append("<style type='text/css' id='coreFonts'></style>");
$.get(hostLocal + "css/fonts.css",function(raw) {
	$("#coreFonts").html(raw);
});
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
	return ("ontouchstart" in document.documentElement) || ("ontouchstart" in window);
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
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
	    var res = gotMonth + "/" + gotDate + "/" + input.getFullYear();
	}
    return res;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
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
	var seconds = (new Date().getTime() - window.localStorage.getItem("config_start_time")) / 1000;
	var date = new Date(seconds * 1000);
	var dd   = Math.floor(seconds/86400);
	var hh   = date.getUTCHours();
	var mm   = date.getUTCMinutes();
	var ss   = date.getSeconds();
	//if (hh > 12) {hh = hh - 12;}
	if (hh < 10) { hh = "0" + hh; }
	if (mm < 10) { mm = "0" + mm; }
	if (ss < 10) { ss = "0" + ss; }
	// This formats your string to HH:MM:SS
	if(dd > 0) { dd = dd + "d "; } else { dd = ""; }
	return dd+hh+":"+mm+":"+ss;
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


