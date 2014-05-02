/////////////////
// DEV DEBUGER //
/////////////////
window.onerror = function(e, url, line) {
	if(window.localStorage.getItem("config_debug") == "active") {
		alert('onerror: ' + e + ' URL:' + url + ' Line:' + line);
		console.log('onerror: ' + e + ' URL:' + url + ' Line:' + line);
	}
	//return true; 
}
//////////////
// VIEWPORT //
//////////////
document.write('<meta name="viewport" id="viewPort" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, minimal-ui" />');	
/////////
// CSS //
/////////
//document.write("<link rel='stylesheet' type='text/css' id='coreCss' href='" + hostLocal + "css/index.css' />");
//document.write("<link rel='stylesheet' type='text/css' id='coreFonts' href='" + hostLocal + "css/fonts.css' />");
/////////////////////
// CORDOVA/DESKTOP //
/////////////////////
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|IEMobile)/)) {
	document.write("<script type='text/javascript' src='js/cordova.js'><\/script>");
	document.write("<script type='text/javascript' src='js/cdv-plugin-fb-connect.js'><\/script>");
	document.write("<script type='text/javascript' src='js/facebook-js-sdk.js'><\/script>");
} else {
	//if((/firefox/).test(navigator.userAgent.toLowerCase()) && (/mobile/).test(navigator.userAgent.toLowerCase()) && (/gecko/).test(navigator.userAgent.toLowerCase())) {
	//	document.write("<script type='text/javascript' src='js/cordova.js'><\/script>");	
	//}
	document.write("<script type='text/javascript' src='js/facebook-js-sdk.min.js'><\/script>");
	//document.write("<script type='text/javascript' src='//connect.facebook.net/en_US/all.js'><\/script>");
}
////////
// JS //
////////
document.write("<script type='text/javascript' src='" + hostLocal + "js/GALocalStorage.js'><\/script>");
//document.write("<script type='text/javascript' src='" + hostLocal + "js/jquery-1.11.0.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery-2.1.0.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery-ui-1.10.3.min.js'><\/script>");
document.write("<script type='text/javascript' src='js/mobiscroll.2.9.0.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.nicescroll.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.color-2.1.0.min.js'><\/script>");
//charts
document.write("<script type='text/javascript' src='" + hostLocal + "js/highcharts.js'><\/script>");
//document.write("<script type='text/javascript' src='js/jquery.mobileCheckbox.js'><\/script>");
document.write("<script type='text/javascript' src='js/jquery.touchSwipe.js'><\/script>");
//nprogress
document.write("<script type='text/javascript' src='js/nprogress.js'><\/script>");
document.write("<script type='text/javascript' src='js/spin.min.js'><\/script>");
//if(!navigator.userAgent.match(/(MSIE)/)) {
document.write("<script type='text/javascript' src='js/quo.js'><\/script>");
//} else {
	//document.write("<script type='text/javascript' src='js/jquery.mobile-events.js'><\/script>");
//}
document.write("<script type='text/javascript' src='js/iscroll.js'><\/script>");
document.write("<script type='text/javascript' src='js/html5sql.js'><\/script>");
document.write("<script type='text/javascript' src='js/UserVoice.js'><\/script>");
document.write("<script type='text/javascript' src='js/calculator.js'><\/script>");
document.write("<script type='text/javascript' src='js/localstoragedb.js'><\/script>");
document.write("<script type='text/javascript' src='js/carpe_slider.js'><\/script>");
/////////
// APP //
/////////
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_bootstrap.js'><\/script>");
/*
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lib.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_build.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_static.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js'><\/script>");
document.write("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js'><\/script>");
*/
//WP8
if(navigator.userAgent.match(/(MSIE)/)) {
	if(window.external.Notify) { 
		window.external.Notify("noScroll");
	}
}