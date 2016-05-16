//////////////////////
// CORDOVA PLATFORM //
//////////////////////
// IOS //
/////////
if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
	module.exports = { id: 'ios', bootstrap: function() { require('cordova/channel').onNativeReady.fire(); }};
/////////////
// ANDROID //
/////////////
} else if (/Android/i.test(navigator.userAgent)) {
	//
///////////////////
// WINDOWS PHONE //
///////////////////
} else if (/IEMobile/i.test(navigator.userAgent) && !/MSApp/i.test(navigator.userAgent)) {
	//
///////////
// MSAPP //
///////////
} else if (/MSApp/i.test(navigator.userAgent)) {
	//
///////////////////
// BLACKBERRY 10 //
///////////////////
} else if (/BB10/i.test(navigator.userAgent)) {
	//
////
} //
////

