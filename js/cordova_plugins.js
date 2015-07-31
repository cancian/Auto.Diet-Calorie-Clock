if (typeof cordova !== 'undefined') {
	//BB10 ~ inappbrowser
	var BBINAPP = /BB10/.test(navigator.userAgent) ? '' : { 
		'file' : 'plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js',
		'id' : 'org.apache.cordova.inappbrowser.inappbrowser',
		'clobbers' : ['window.open'] 
	};
	//CORDOVA
	cordova.define('cordova/plugin_list', function (require, exports, module) {
		module.exports = [{
				'file' : 'plugins/org.apache.cordova.dialogs/www/notification.js',
				'id' : 'org.apache.cordova.dialogs.notification',
				'merges' : ['navigator.notification']
			}, {
				'file' : 'plugins/org.apache.cordova.dialogs/www/android/notification.js',
				'id' : 'org.apache.cordova.dialogs.notification_android',
				'merges' : ['navigator.notification']
			}, 
			BBINAPP
		];
	});
}