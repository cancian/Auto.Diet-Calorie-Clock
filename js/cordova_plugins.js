cordova.define('cordova/plugin_list', function (require, exports, module) {
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
	////////////////////
	// BB10 EXCEPTION //
	////////////////////
	if (/BB10|playbook/i.test(navigator.userAgent)) {
		module.exports = [module.exports[0]];
	}
	//
	module.exports.metadata =
		// TOP OF METADATA
	{
		"cordova-plugin-dialogs" : "1.1.1",
		"cordova-plugin-inappbrowser" : "1.0.1",
	}
	// BOTTOM OF METADATA
});