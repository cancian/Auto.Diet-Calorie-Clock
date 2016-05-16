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
	function onMessageFromNative(e){var n=require("cordova"),t=e.action;switch(t){case"backbutton":case"menubutton":case"searchbutton":case"pause":case"volumedownbutton":case"volumeupbutton":n.fireDocumentEvent(t);break;case"resume":if(arguments.length>1&&e.pendingResult){if(2===arguments.length)e.pendingResult.result=arguments[1];else{for(var o=[],r=1;r<arguments.length;r++)o.push(arguments[r]);e.pendingResult.result=o}lastResumeEvent=e}n.fireDocumentEvent(t,e);break;default:throw new Error("Unknown event action "+t)}}var lastResumeEvent=null;module.exports={id:"android",bootstrap:function(){function e(e){var n=t.addDocumentEventHandler(e+"button");n.onHasSubscribersChange=function(){o(null,null,u,"overrideButton",[e,1==this.numHandlers])}}var n=require("cordova/channel"),t=require("cordova"),o=require("cordova/exec"),r=require("cordova/modulemapper");o.init(),r.clobbers("cordova/plugin/android/app","navigator.app");var u=Number(t.platformVersion.split(".")[0])>=4?"CoreAndroid":"App",a=t.addDocumentEventHandler("backbutton");a.onHasSubscribersChange=function(){o(null,null,u,"overrideBackbutton",[1==this.numHandlers])},t.addDocumentEventHandler("menubutton"),t.addDocumentEventHandler("searchbutton"),e("volumeup"),e("volumedown");var s=document.addEventListener;document.addEventListener=function(e,n,t){s(e,n,t),"resume"===e&&lastResumeEvent&&n(lastResumeEvent)},n.onCordovaReady.subscribe(function(){o(onMessageFromNative,null,u,"messageChannel",[]),o(null,null,u,"show",[])})}};
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

