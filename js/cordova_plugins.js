//#/////////////////#//
//# CORDOVA PLUGINS #//
//#/////////////////#//
cordova.define("cordova/plugin_list", function (require, exports, module) {
	module.exports = [{
			"id": "cordova-plugin-dialogs.notification",
			"file": "plugins/cordova-plugin-dialogs/www/notification.js",
			"pluginId": "cordova-plugin-dialogs",
			"merges": [
				"navigator.notification"
			]
		}, {
			"id": "cordova-plugin-inappbrowser.inappbrowser",
			"file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
			"pluginId": "cordova-plugin-inappbrowser",
			"clobbers": [
				"cordova.InAppBrowser.open",
				"window.open"
			]
		}
	];
	//////////////
	// METADATA //
	//////////////
	module.exports.metadata =
	{
		"cordova-plugin-dialogs": "1.3.1",
		"cordova-plugin-inappbrowser": "1.6.1"
	};
	//////////
	// BB10 //
	//////////
	if (/BB10|playbook/i.test(navigator.userAgent)) {
		module.exports = [module.exports[0]];
		module.exports.metadata = {
			"cordova-plugin-dialogs": "1.3.1"
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
