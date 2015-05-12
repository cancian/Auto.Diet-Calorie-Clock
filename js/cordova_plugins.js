if (typeof cordova !== 'undefined') {
	//BB10 ~ inappbrowser
	var BBINAPP = /BB10/.test(navigator.userAgent) ? '' : { 
		'file' : 'plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js',
		'id' : 'org.apache.cordova.inappbrowser.InAppBrowser',
		'clobbers' : ['window.open'] 
	};
	//CORDOVA
	cordova.define('cordova/plugin_list', function (require, exports, module) {
		module.exports = [{
				'file' : 'plugins/org.apache.cordova.dialogs/www/notification.js',
				'id' : 'org.apache.cordova.dialogs.notification',
				'merges' : ['navigator.notification']
			}, {
				'file' : 'plugins/org.apache.cordova.dialogs/www/blackberry10/beep.js',
				'id' : 'org.apache.cordova.dialogs.beep',
				'clobbers' : ['window.navigator.notification.beep']
			}, {
				'file' : 'plugins/org.apache.cordova.dialogs/www/android/notification.js',
				'id' : 'org.apache.cordova.dialogs.notification_android',
				'merges' : ['navigator.notification']
			}, 
			BBINAPP
		];
	});
}