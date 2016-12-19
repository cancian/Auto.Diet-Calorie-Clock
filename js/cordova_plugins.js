//#/////////////////#//
//# CORDOVA PLUGINS #//
//#/////////////////#//
cordova.define("cordova/plugin_list", function (require, exports, module) {
	"use strict";
	module.exports = [{
			"file" : "plugins/cordova-plugin-dialogs/www/notification.js",
			"id" : "cordova-plugin-dialogs.notification",
			"merges" : [
				"navigator.notification"
			]
		}, {
			"file" : "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
			"id" : "cordova-plugin-inappbrowser.inappbrowser",
			"clobbers" : [
				"cordova.InAppBrowser.open",
				"window.open"
			]
		}
	];
	/////////////////////
	// TOP OF METADATA //
	/////////////////////
	module.exports.metadata = {
		"cordova-plugin-dialogs" : "1.1.1",
		"cordova-plugin-inappbrowser" : "1.0.1"
	};
	//////////
	// BB10 //
	//////////
	if (/BB10|playbook/i.test(navigator.userAgent)) {
		module.exports = [module.exports[0]];
		module.exports.metadata = {
			"cordova-plugin-dialogs" : "1.1.1"
		};
	}
	///////////
	// MSAPP //
	///////////
	if (/MSApp/i.test(navigator.userAgent)) {
		module.exports = [];
		module.exports.metadata = {};
	}
//////
}); //
//////
