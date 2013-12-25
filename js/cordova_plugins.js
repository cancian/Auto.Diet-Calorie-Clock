cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.adobe.plugins.GAPlugin/www/GAPlugin.js",
        "id": "com.adobe.plugins.GAPlugin.GAPlugin",
        "clobbers": [
            "GAPlugin"
        ]
    },
    {
        "file": "plugins/com.bikasv.plugins.datepicker/scripts/datePickerPlugin.js",
        "id": "com.bikasv.plugins.datepicker.datePicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "file": "plugins/com.bikasv.plugins.datepicker/scripts/share.js",
        "id": "com.bikasv.plugins.datepicker.share",
        "clobbers": [
            "share"
        ]
    }
]
});