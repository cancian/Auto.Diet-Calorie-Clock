//#/////////////////#//
//# CORDOVA PLUGINS #//
//#/////////////////#//
cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.1",
    "de.twentysteps.cordova.watch": "0.1.",
    "cordova-plugin-dialogs": "1.3.1",
    "cordova-plugin-inappbrowser": "1.6.1"
};
	///////////////
	// IOS WATCH //
	///////////////
	if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    	var watchPlugin = {
	        "id": "de.twentysteps.cordova.watch.watch",
        	"file": "plugins/de.twentysteps.cordova.watch/www/watch.js",
    	    "pluginId": "de.twentysteps.cordova.watch",
	        "clobbers": [
        	    "cordova.plugins.Watch"
    	    ]
	    };
		module.exports.push(watchPlugin);
	}
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
