if (typeof cordova !== 'undefined') {
	cordova.define('cordova/plugin_list', function (require, exports, module) {
		module.exports = [{
				"file" : "plugins/org.apache.cordova.dialogs/www/notification.js",
				"id" : "org.apache.cordova.dialogs.notification",
				"merges" : [
					"navigator.notification"
				]
			}, {
				"file" : "plugins/org.apache.cordova.dialogs/www/android/notification.js",
				"id" : "org.apache.cordova.dialogs.notification_android",
				"merges" : [
					"navigator.notification"
				]
			}, {
				"file" : "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
				"id" : "org.apache.cordova.inappbrowser.InAppBrowser",
				"clobbers" : [
					"window.open"
				]
			}, {
				"file" : "plugins/org.apache.cordova.inappbrowser/src/windows/InAppBrowserProxy.js",
				"id" : "org.apache.cordova.inappbrowser.InAppBrowserProxy",
				"merges" : [
					""
				]
			}, {
				"file" : "plugins/org.apache.cordova.dialogs/src/windows8/NotificationProxy.js",
				"id" : "org.apache.cordova.dialogs.NotificationProxy",
				"merges" : [
					""
				]
			}
		];
	});
}