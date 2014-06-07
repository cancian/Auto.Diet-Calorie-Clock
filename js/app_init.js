/////////////////
// DEV DEBUGER //
/////////////////
/*
navigator.__defineGetter__('userAgent', function(){
    return 'iPhone' // customized user agent
});
navigator.__defineGetter__('language', function(){
    return 'en' // customized user agent
});
*/
var blockAlerts = 0;
window.onerror = function(e, url, line) {
	if(window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if(navigator.userAgent.match(/MSApp/i) && typeof alert !== 'undefined' ) {
			alert('onerror: ' + e + ' URL:' + url + ' Line:' + line);
		} else {
			if(confirm('onerror: ' + e + ' URL:' + url + ' Line:' + line)) { blockAlerts = 0; } else { blockAlerts = 1; }
		}
		console.log('onerror: ' + e + ' URL:' + url + ' Line:' + line);
	}
	if($("#tempHolder").html() && typeof spinner !== 'undefined') {
		spinner('stop');
	}
	//return false;
};
//////////////
// VIEWPORT //
//////////////
if(navigator.userAgent.match(/MSApp/i)) { hostLocal = ''; }

function initJS() {
if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
	document.write('<meta name="viewport" id="viewPort" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, minimal-ui" />');
} else {
	document.write('<meta name="viewport" id="viewPort" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />');	
}
/////////
// CSS //
/////////
document.write("<link rel='stylesheet' type='text/css' id='coreCss'   href='" + hostLocal + "css/index.css' />");
document.write("<link rel='stylesheet' type='text/css' id='coreFonts' href='" + hostLocal + "css/fonts.css' />");
/////////////////////
// CORDOVA/DESKTOP //
/////////////////////
document.write("<script type='text/javascript' src='" + hostLocal + "js/cordova.js'><\/script>");
////////
// FB //
////////
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
	document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-js-sdk.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/facebook-connect.js'><\/script>");
} else if(navigator.userAgent.match(/IEMobile/i)) {
	document.write("<script type='text/javascript' src='" + hostLocal + "js/openfb.js'><\/script>");
} else if(navigator.userAgent.match(/MSApp/i)) {
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
if(!navigator.userAgent.match(/(MSIE)/)) {
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
/////////
// APP //
/////////
if(navigator.userAgent.match(/MSApp/i) && window.localStorage.getItem("config_debug") == "active") {
	//document.write("<script type='text/javascript' src='" + hostLocal + "js/app_bootstrap.js'><\/script>");

document.addEventListener( "DOMContentLoaded", function() {
	hostLocal = "http://192.168.1.5/com.cancian.mylivediet/www/";
	var dataJS  = '';
	var dataCSS = '';
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_lib.js",         success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_lang.js",        success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_setup.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_build.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_static.js",      success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_dynamic.js",     success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "js/app_custom_core.js", success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "css/index.css",         success: function(raw) { dataCSS = dataCSS + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal + "css/fonts.css",         success: function(raw) { dataCSS = dataCSS + raw;
	//MOZIE CSS
	if((/firefox/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('box-sizing').join('-moz-box-sizing').split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('-webkit-backface-visibility: hidden;').join('').split('-webkit-').join('-ms-');
	}
	///////////
	//APPEND //
	///////////
if(navigator.userAgent.match(/MSApp/i)) {
	MSApp.execUnsafeLocalFunction(function() {
		$("#coreCss,#coreFonts").remove();
		$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
		$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");

	});
} else {
	$("#coreCss,#coreFonts").remove();
	$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
	$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");
}

	//
	}});}});}});
	}});}});}});
	}});}});
	}});
}, false);



} else {
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lib.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_build.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_static.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js'><\/script>");
	document.write("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js'><\/script>");
}



}

if(navigator.userAgent.match(/MSApp/i)) {
	MSApp.execUnsafeLocalFunction(function() {
		initJS();
	});
} else {
	initJS();
}

