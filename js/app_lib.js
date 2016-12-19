//##////////////##//
//## APP_LIB.JS ##//
//##////////////##//
var isMobile = 'isCurrentCacheValid';
/*////////////
// SET USER //
//////////////
var appUser = ('mud_default###default').split('###');
if(!appStorage.getItem('app_current_user')) {
	appStorage.setItem('app_current_user','mud_default###default###' + new Date().getTime());
} else {
	appUser = appStorage.getItem('app_current_user').split('###');
}*/
//#////////////#//
//# APP OBJECT #//
//#////////////#//
if(typeof app === 'undefined')		  { var app = {}; }
if(typeof appStorage === 'undefined') { var appStorage = window.localStorage; }
var appRows = { entry: [], food: [] };
app.ua      = navigator.userAgent;
app = {
	width:  function() { 'use strict'; return parseInt(Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0)); },
	height: function() { 'use strict'; return parseInt(Math.max(document.documentElement.clientHeight, window.innerHeight || 0)); },
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
	isFalse: function(x) {
		'use strict';
		if (!x)						 { return true; }
		if (x === 0)				 { return true; }
		if (x === '')				 { return true; }
		if (x === false)			 { return true; }
		if (x.length === 0)			 { return true; }
		if (typeof x === 'undefined'){ return true; }
		if (x === null)				 { return true; }
		if (x === '0')				 { return true; }
		if (x === 'no')				 { return true; }
		if (x === 'off')			 { return true; }
		if (x === 'null')			 { return true; }
		if (x === 'none')    		 { return true; }
		if (x === 'false')			 { return true; }
		if (x === 'disabled')		 { return true; }
		//default
		return false;
	},
	isEmpty: function (mixedVar) {
		'use strict';
		var undef;
		var key;
		var i;
		var len;
		var emptyValues = [undef, null, false, 0, '', '0'];
		//VALUES
		for (i = 0, len = emptyValues.length; i < len; i++) {
			if (mixedVar === emptyValues[i]) {
				return true;
			}
		}
		//OBJECTS
		if (typeof mixedVar === 'object') {
			for (key in mixedVar) {
				if (mixedVar.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		}
		//default
		return false;
	},
	//user: appStorage.getItem('app_current_user').split('###'),
	dev: appStorage.getItem('config_debug') === 'active' ? true : false,
	beenDev: appStorage.getItem('config_debug') === 'active' || appStorage.getItem('been_dev') ? true : false,
	pointer : function (e) {
		'use strict';
		//DEFINE
		var out = {
			x : 0,
			y : 0
		};
		//EVENT
		if (!e) {
			return out;
		} else {
			out.e = e;	
		}
		//TARGET
		if ($(e.target)) {
			out.target = $(e.target);
			//ID
			if ($(e.target).prop('id')) {
				out.id = $(e.target).prop('id');
			}
		}
		//TIME
		out.time = app.now();
		//TOUCH EVENT
		if (/touch|pointer/i.test(e.type) && e.originalEvent) {
			if(e.originalEvent.changedTouches) {
				var touch = e.originalEvent.changedTouches[0];
				if(typeof touch !== 'undefined') {
					out.x = parseInt(touch.pageX);
					out.y = parseInt(touch.pageY);
					//~
					out.pageX = out.x;
					out.pageY = out.y;
					//add data to event
					//out.e = e.originalEvent
					out.e.pageX = out.x;
					out.e.pageY = out.y;
					out.e.x = out.x;
					out.e.y = out.y;
					return out;
				}
			}
		}
		//REGULAR EVENT
		out.x = parseInt(e.pageX);
		out.y = parseInt(e.pageY);
		//~
		out.pageX = out.x;
		out.pageY = out.y;
		//add data to event
		out.e.pageX = out.x;
		out.e.pageY = out.y;
		out.e.x = out.x;
		out.e.y = out.y;
		return out;
	},
	is: {},
	config: {},
	db: {
		indexedDB    : typeof window.indexedDB === 'undefined' ? false : true,
		webSQL       : !window.openDatabase ? false : true,
		localStorage : !window.localStorage ? false : true,
	},
	tab: {},
	get: {},
	call: {},
	exec: {},
	info: {},
	exists: function(targetId) {
		'use strict';
		if($(targetId).length) {
			return true;
		} else {
			return false;
		}
	},
	ua:   navigator.userAgent,
	http: /http/i.test(window.location.protocol) ? true : false,
	https: /http:/i.test(window.location.protocol) || (appStorage.getItem('config_debug') == 'active' && !/http/i.test(window.location.protocol)) ? 'http://' : 'https://',
	now: function() {
		'use strict';
		return new Date().getTime();
	},
	define: function(key,value,type) {
		'use strict';
		//MULTIUSER
		/*
		if(!/mud_default/i.test(app.user)) {
			//protect superglobals
			if(!/remoteSuperBlock|autoupdate|app_build|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/i.test(key)) {
				key = app.user[0] + '_' + key;
			}
		}
		*/
		//
		if(!appStorage.getItem(key)) {
			if(type == 'object' || type == 'array') {
				//OBJECT
				appStorage.setItem(key,JSON.stringify(value));
			} else {
				//STRING
				appStorage.setItem(key,value);
			}
		}
		return true;
	},
	returner: function(func,rows) {
		'use strict';
		if(typeof func === 'function') {
			if(rows == null) {
				rows = [];
			}
			func(rows);
		}
	},
	read: function(key,value,type) {
		'use strict';
		//MULTIUSER
		/*
		if(!/mud_default/i.test(app.user)) {
			//protect superglobals
			if(!/remoteSuperBlock|autoupdate|app_build|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/i.test(key)) {
				key = app.user[0] + '_' + key;
			}
		}
		*/
		/////////////////////////
		// localforage wrapper // READ
		/////////////////////////
		if(/diary_entry|diary_food/i.test(key)) {
			localforage.getItem(key).then(function(rows) {
				app.returner(value,rows);
			});
			return;
		}
		//
		//OBJECT
		if(type === 'object' || type === 'array') {
			if(!appStorage.getItem(key)) {
				return [];
			}
			var keyValue = appStorage.getItem(key);
			if(value == '') {
				//return whole object
				return JSON.parse(keyValue);
				//return keyValue && JSON.parse(keyValue);
			} else {
				//return key's value
				return JSON.parse(keyValue)[value];
				//return keyValue[value] && JSON.parse(keyValue)[value];
			}
		}
		//
		if(typeof value != 'undefined') {
			if(appStorage.getItem(key) == value) {
				return true;
			} else {
				return false;
			}
		}
		if(!appStorage.getItem(key)) {
			return false;
		} else {
			if(isNaN(Number(appStorage.getItem(key)))) {
				return appStorage.getItem(key);
			} else {
				return Number(appStorage.getItem(key));
			}
		}
	},
	save: function(key,value,type) {
		'use strict';
		if(typeof value === 'undefined') { return; }
		//MULTIUSER
		/*
		if(!/mud_default/i.test(app.user)) {
			//protect superglobals
			if(!/remoteSuperBlock|autoupdate|app_build|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/i.test(key)) {
				key = app.user[0] + '_' + key;
			}
		}
		*/
		/////////////////////////
		// localforage wrapper // SAVE
		///////////////////////// 
		if(/diary_entry|diary_food/i.test(key)) {
			app.returner(type,value);
			app.timeout('dbTimeout_' + key,300,function() {
				localforage.setItem(key,value);
			});
			return;
		}
		//DIFF CHECK
		if(appStorage.getItem(key) != value) {
			if(type == 'object' || type == 'array') {
				//OBJECT
				appStorage.setItem(key,JSON.stringify(value));
			} else {
				//STRING
				appStorage.setItem(key,value);
			}
		}
	},
	remove: function(key) {
		'use strict';
		//MULTIUSER
		/*
		if(!/mud_default/i.test(app.user)) {
			//protect superglobals
			if(!/remoteSuperBlock|autoupdate|app_build|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/i.test(key)) {
				key = app.user[0] + '_' + key;
			}
		}
		*/
		//
		if(appStorage.getItem(key)) {
			appStorage.removeItem(key);
		}
	},
	clear : function () {
		'use strict';
		app.define('config_install_time', app.now());
		var keys = Object.keys(appStorage);
		for (var i = 0; i < keys.length; i++) {
			//cached keys
			if (!/app_build|app_autoupdate_hash|remoteSuperBlockCSS|remoteSuperBlockJS/i.test(keys[i]) || appStorage.getItem('config_autoupdate') !== 'on') {
				//protected keys
				if(!/ga_storage|autoupdate|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots|app_installed|index_eval|online_users/i.test(keys[i])) {
					//MULTIUSER
					/*
					//remove current user settings
					if (keys[i].contains(app.user[0])) {
						appStorage.removeItem(keys[i]);
					}
					//remove default user settings
					if(app.user.id === 'mud_default' && !keys[i].contains(app.user.id)) {
						appStorage.removeItem(keys[i]);
					}
					*/
					appStorage.removeItem(keys[i]);
				}
			}
		}
	},
	show: function(target,callback) {
		'use strict';
		$(target).css2('pointer-events','auto');
		$(target).css2(prefix + 'transition', 'opacity ease .32s');
		$(target).css2('opacity',1);
		setTimeout(function() {
			if(typeof callback === 'function') {
				callback(target);
			}
		},320);
	},
	hide: function(target,callback) {
		'use strict';
		$(target).css2('pointer-events','none');
		$(target).css2(prefix + 'transition', 'opacity ease .12s');
		$(target).css2('opacity',0);
		setTimeout(function() {
			if(typeof callback === 'function') {
				callback(target);
			}
		},120);
	},
	timeout: function(gid,time,callback) {
		'use strict';
		clearTimeout(app.timers[gid]);
		if(time == 'clear') { return; }
		app.timers[gid] = setTimeout(function() {
			if(typeof callback === 'function') {
				callback();
			}
		}, time);
	},
	suspend: function(target,time,callback) {
		'use strict';
		clearTimeout(app.timers[searchalize(target)]);
		$(target).css2('pointer-events','none');
		app.timers[app.timers[searchalize(target)]] = setTimeout(function() {
			if(typeof callback === 'function') {
				callback();
			}
			$(target).css2('pointer-events','auto');
		}, time);
	},
	timer: {
		start : function(str)     { 'use strict'; if(!str) { str = 'generic'; } app.globals[str] = app.now(); },
		end   : function(str,txt) { 'use strict'; if(!str) { str = 'generic'; } if(txt) { txt = txt + ': '; } else { txt = 'total: '; } app.toast(txt + (Number((app.now() - app.globals[str]))) + ' ms', 'timer_' + (JSON.stringify(app.globals[str]))); }
	}
};
/////////////////
// SWITCH USER //
/////////////////
app.switchUser = function(switchTo) {
	'use strict';
	if(switchTo) {
		if(searchalize(switchTo).length == 0) { return; }
		//
		var usrMatch    = '_' + searchalize(switchTo) + '###';
		var newUserLine = 'mui_' + searchalize(switchTo) + '###' + switchTo + '###' + app.now() + '\r\n';
		//default
		if(switchTo == 'mud_default') {
				appStorage.removeItem('app_current_user');
		//first use
		} else if(!app.read('app_userlist')) {
			app.save('app_userlist',newUserLine);
			app.save('app_current_user',newUserLine);
		} else {
			if(app.read('app_userlist').contains(usrMatch)) {
				//add new user line
				var userArray = app.read('app_userlist').split('\r\n');
				for (var i = 0; i < userArray.length; i++) {
					if(userArray[i].contains(usrMatch)) {
						app.save('app_current_user',trim(userArray[i]));
						break;
					}
				}
			} else {
				app.save('app_userlist',app.read('app_userlist') + newUserLine);
				app.save('app_current_user',trim(newUserLine));
			}
		}
		//
		$('body').css2('opacity',0);
		noTimer = 'active';
		setTimeout(function() {
			//window.location.reload(true);
			window.location.replace(window.location.href);
		},0);
	}
};
///////////////
// LOG ERROR //
///////////////
app.parseErrorLog = function() {
	'use strict';
	//SEND UNHANDLED LOG
	if(app.read('error_log_unhandled')) {
		app.analytics('error',app.read('error_log_unhandled'));
		//ERASE LOG
		app.remove('error_log_unhandled');
	}
	//SEND HANDLED LOG
	if(app.read('error_log_handled')) {
		app.analytics('error',app.read('error_log_handled'));
		//ERASE LOG
		app.remove('error_log_handled');
	}
};
//////////////////
// TOTAL WEIGHT //
//////////////////
app.get.totalweight = function() {
	'use strict';
	if (!app.read('calcForm#pA3B')) {
		return 80;
	}
	if (app.read('calcForm#pA3C','pounds')) {
		return Math.round(app.read('calcForm#pA3B')/2.2);
	}
	return app.read('calcForm#pA3B');
};
//ANDROID VERSION
app.get.androidVersion = /Android/i.test(app.ua) && !app.http ? parseFloat((app.ua).match(/Android [\d+\.]{3,5}/)[0].replace('Android ','')) : false;
//CHROMEAPP
app.get.isChromeApp = function() {
	'use strict';
	if(typeof chrome !== 'undefined') {
		if(typeof chrome.app !== 'undefined') {
			if(chrome.app.isInstalled) {
				return true;
			}
		}
	}
	return false;
};
app.get.isDesktop = function() {};
////////////////
// APP DEVICE //
////////////////
app.device = {
	cordova    : ((typeof cordova || typeof Cordova) !== 'undefined') ? true : false,
	android    : (/Android/i).test(app.ua) && !(/MSApp/i).test(app.ua) ? app.get.androidVersion : false,
	android2   : (/Android/i).test(app.ua) && app.get.androidVersion < 4 ? true : false,
	ios        : (/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	ios7       : (/OS [7-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios8       : (/OS [8](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios9       : (/OS [9](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios10      : (/OS [10-19](.*) like Mac OS X/i).test(app.ua) ? true : false,	
	ipad       : (/iPad/i).test(app.ua) ? true : false,
	tablet     : (/iPad|tablet|surface/i).test(app.ua) ? true : false,
	linux      : (/X11|Linux|Ubuntu/i).test(app.ua) && !(/Android/i).test(app.ua) ? true : false,
	tizen      : (/Tizen/i).test(app.ua) ? true : false,
	msapp      : (/MSApp/i).test(app.ua) ? true : false,
	wp8        : (/IEMobile/i).test(app.ua) && !(/MSApp/i).test(app.ua) ? true : false,
	wp80       : (/IEMobile/i).test(app.ua) && !(/MSApp/i).test(app.ua) && (/Windows Phone 8.0/i).test(app.ua) ? true : false,
	wp81       : (/Mobile/i).test(app.ua) && (/MSApp/i).test(app.ua)  ? true : false,
	wp10       : (/MSAppHost\/3.0/i).test(app.ua) && (/Windows Phone 10/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IE__Mobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows10  : (/MSAppHost\/3.0/i).test(app.ua) ? true : false,
	firefoxos  : (/firefox/i).test(app.ua) && (/mobile|tablet/i).test(app.ua) && (/gecko/i).test(app.ua) ? true : false,
	osx        : (/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,
	safari     : (/AppleWebKit/i.test(app.ua) && /macintosh|windows/i.test(app.ua) && /safari/i.test(app.ua) && !/mobile/i.test(app.ua) && !/chrome/i.test(app.ua)) ? true : false,
	chrome     : (/chrome/i.test(app.ua) && /windows|macintosh|linux/i.test(app.ua) && !/mobile/i.test(app.ua) && !/nexus/i.test(app.ua)) ? true : false,
	chromeos   : (app.get.isChromeApp()) ? true : false,
	blackberry : (/BB10|BlackBerry|All Touch/i).test(app.ua) && !/(PlayBook)/i.test(app.ua) ? true : false,
	playbook   : (/PlayBook|Tablet OS/i).test(app.ua) ? true : false,
	amazon     : (/Amazon|FireOS/i).test(app.ua) ? true : false,
	desktop    : ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|PlayBook|IEMobile|Tizen|Opera Mini|Tablet|Mobile|Touch/i.test(app.ua) || (document.createTouch)) && !/X11|Windows NT/i.test(app.ua)) ? false : true
};
//STATIC
if(typeof staticVendor !== 'undefined') {
	if(staticVendor == 'amazon' && (/Android/i).test(app.ua)) {
		app.device.amazon = true;
	}
}
//////////////////////
// GLOBAL SHORTCUTS //
//////////////////////
app.get.platform = function(noweb) {
	'use strict';
	     if(app.device.ios && app.http)		{ return 'web';              }
	else if(app.device.android && app.http)	{ return 'web';              }
	else if(app.device.wp8 && app.http)		{ return 'web';              }
	else if(app.device.tizen)				{ return 'Tizen';            }
	else if(app.device.linux)				{ return 'Linux';            }
	else if(app.device.ios)					{ return 'iOS';              }
	else if(app.device.amazon)				{ return 'Android (Amazon)'; }
	else if(app.device.wp8)					{ return 'Windows Phone';    }
	else if(app.device.wp81)				{ return 'Windows Phone';    }
	else if(app.device.wp10)				{ return 'Windows Phone';    }
	else if(app.device.windows8)			{ return 'Windows';          }
	else if(app.device.windows81)			{ return 'Windows';          }
	else if(app.device.windows10)			{ return 'Windows';          }
	else if(app.device.blackberry)			{ return 'BlackBerry';       }
	else if(app.device.playbook)			{ return 'PlayBook';         }
	else if(app.device.android)				{ return 'Android';          }
	else if(app.device.firefoxos)			{ return 'FirefoxOS';        }
	else if(app.device.osxapp)				{ return 'Mac';              }
	else if(app.device.chromeos)			{ return 'ChromeOS';         }
	else									{ return 'web'; }
};
//#/////////////////////////////#//
//# UPDATE HARDCODED SSL MARKER #//~Let's encrypt denied?
//#/////////////////////////////#//~BB10
if(typeof https !== 'undefined') {
	https = app.https;
}
//MANUAL OVERRIDES (DISABLE)
if(app.device.android2) { //|| app.device.blackberry || app.device.playbook) {
	app.https = 'http://';
	https = app.https;	
}
//#///////////////////#//
//# APP.IS.SCROLLABLE #//
//#///////////////////#//
app.is.scrollable = false;
if($.nicescroll) {
	if(app.device.msapp)								{ app.is.scrollable = true;  }
	if(app.device.wp80)									{ app.is.scrollable = true;  }
	if(app.device.wp81)									{ app.is.scrollable = true;  }
	if(app.device.wp10)									{ app.is.scrollable = false; }
	if(app.device.linux)								{ app.is.scrollable = true;  }
	if(app.device.desktop)								{ app.is.scrollable = true;  }
	if(app.device.android && app.device.android < 5)	{ app.is.scrollable = true;  }
	if(app.device.tizen)								{ app.is.scrollable = false; }
}
//////////////////
// APP.REBOOT() //
//////////////////
app.reboot = function(type,error) {
	'use strict';
	var timeout = type == 'now' ? 0 : 500;
	//CLEAR CACHE
	if(type == 'reset') {
		app.remove('remoteSuperBlockJS');
		app.remove('remoteSuperBlockCSS');
		app.remove('app_autoupdate_hash');
	}
	//WIPE STORAGE
	if(type == 'clear') {
		app.clear();
	}
	setTimeout(function() {
		//RELOAD
		//window.location.reload(true);
		window.location.replace(window.location.href);
	},timeout);
	if(error) {
		throw error;
	}
};
/////////////////
// SWIPE DUMMY //
/////////////////
app.swipe         = function() {};
$.prototype.swipe = function() {};
//////////////////////////////////
// MODIFIED JQUERY W/ CALLLBACK //
//////////////////////////////////
// EACH2 //
/////////// http://benalman.com/projects/jquery-misc-plugins/#each2
/*
(function ($) {
	// Create a placeholder jQuery object with a length of 1. The single item
	// is completely arbitrary and will be replaced.
	var jq = $([1]);

	$.fn.each2 = function (fn) {
		var i = -1;
		while (
			// Set both the first element AND context property of the placeholder
			// jQuery object to the DOM element. When i has been incremented past the
			// end, this[++i] will return undefined and abort the while loop.
			(jq.context = jq[0] = this[++i])

			// Invoke the callback function in the context of the DOM element,
			// passing both the index and the placeholder jQuery object in. Like
			// .each, if the callback returns `false`, abort the while loop.
			 && fn.call(jq[0], i, jq) !== false) {}

		// Return the initial jQuery object for chainability.
		return this;
	};
})(jQuery);
*/
///////////
// HTML2 //
///////////
$.prototype.html2 = function (data, callback) {
	'use strict';
	if(typeof this === 'undefined') { return; }
	var obj = this;
	if($(obj).length) {
		if (app.device.msapp) {
			MSApp.execUnsafeLocalFunction(function () {
				obj.html(data);
			});
		} else {
			obj.html(data);
		}
	}
	//CALLBACK
	if (typeof callback === 'function') {
		callback();
	}
};
//////////
// CCS2 //
//////////
$.prototype.css2 = function (attr, value) {
	'use strict';
	//FILTER
	if (typeof this === 'undefined' || typeof attr === 'undefined') {
		return;
	}
	//VARS
	var thisObj  = this;
	var thisAttr = thisObj.css(attr);
	//get/set
	if (typeof value === 'undefined') {
		//get value
		if(typeof thisAttr !== 'undefined') {
			return thisAttr;
		}
	} else {
		//set value
		if (thisAttr !== value) {
			thisObj.css(attr, value);
		}
	}
};
/////////////
// APPEND2 //
/////////////
$.prototype.append2 = function (data, callback) {
	'use strict';
	if(typeof this === 'undefined') { return; }
	var obj = this;
	if($(obj).length) {
		if (app.device.msapp) {
			MSApp.execUnsafeLocalFunction(function () {
				obj.append(data);
			});
		} else {
			obj.append(data);
		}
	}
	//CALLBACK
	if (typeof callback === 'function') {
		callback();
	}

};
$.prototype.prepend2 = function (data, callback) {
	'use strict';
	if(typeof this === 'undefined') { return; }
	var obj = this;
	if($(obj).length) {
		if (app.device.msapp) {
			MSApp.execUnsafeLocalFunction(function () {
				obj.prepend(data);
			});
		} else {
			obj.prepend(data);
		}
	}
	//CALLBACK
	if (typeof callback === 'function') {
		callback();
	}
};
$.prototype.before2 = function (data, callback) {
	'use strict';
	if(typeof this === 'undefined') { return; }
	var obj = this;
	if($(obj).length) {
		if (app.device.msapp) {
			MSApp.execUnsafeLocalFunction(function () {
				obj.before(data);
			});
		} else {
			obj.before(data);
		}
	}
	//CALLBACK
	if (typeof callback === 'function') {
		callback();
	}
};
$.prototype.after2 = function (data, callback) {
	'use strict';
	if(typeof this === 'undefined') { return; }
	var obj = this;
	if($(obj).length) {
		if (app.device.msapp) {
			MSApp.execUnsafeLocalFunction(function () {
				obj.after(data);
			});
		} else {
			obj.after(data);
		}
	}
	//CALLBACK
	if (typeof callback === 'function') {
		callback();
	}
};
///////////
// TOAST //
///////////
app.toast = function (msg, tag) {
	'use strict';
	if(!msg)		{ msg = ''; }
	if(!tag)		{ tag = 'appToast' + JSON.stringify(app.now()); }
	////////////
	// INSERT //
	////////////
	$('body').append2('<div id="appToast" class="' + tag + '">' + msg + '</div>');
	//DISMISS
	setTimeout(function() {
		$('.' + tag).on(tap, function () {
			app.handlers.fade(0, '.' + tag, 300);
		});
		setTimeout(function() { 
			app.handlers.fade(0, '.' + tag, 300);
		},2000);
	},0);
};
//////////
// ZOOM //
//////////
/*
app.zoom = function(ratio) {
	if(!ratio) {
		//ratio = app.read('app_zoom');
	}
	if(ratio == 1 || app.read('app_zoom',1)) {
		$('html').addClass('zoomx1');
		$('html').removeClass('zoomx2 zoomx3');
		app.save('app_zoom',1);
	}
	if(ratio == 2 || app.read('app_zoom',1.2)) {
		$('html').addClass('zoomx2');
		$('html').removeClass('zoomx1 zoomx3');
		app.save('app_zoom',1.2);
	}
	if(ratio == 3 || app.read('app_zoom',1.4)) {
		$('html').addClass('zoomx3');
		$('html').removeClass('zoomx1 zoomx2');
		app.save('app_zoom',1.4);
	}
	//$('body').css2('zoom',Math.round(app.read('app_zoom') * 100) + '%');
	//$('body').css2('zoom',app.read('app_zoom'));
	//$('body').css2('-moz-transform','scale(' + app.read('app_zoom') + ',' + app.read('app_zoom') + ')');
	if(typeof appResizer == 'function') {
		$('.nicescroll-rails').css2('display','none');
		appResizer();
		app.timeout('zoomHideScrollar',400,function() {
			$('.nicescroll-rails').css2('display','block');
		});
	}
};
app.zoom();
*/
////////////////
// APP.INFO() //
////////////////
app.info = function (title, msg, preHandler, postHandler) {
	'use strict';
	if($('#skipIntro').length)		{ return; }
	if($(document).height() < 350)	{ return; }
	if(app.globals.blockInfo == 1)	{ return; }
	if (app.read('info_' + title))	{ // && !app.dev) {
		return;
	}
	$('#screenInfo').remove();
	/////////////////
	// INSERT HTML //
	/////////////////
	$('body').prepend2('\
	<div id="screenInfo" class="info_' + title + '">\
		<div id="circleFocus"></div>\
		<div id="textBlock">' + msg + '</div>\
		<div id="closeButton">' + LANG.CLOSE[lang] + '</div>\
	</div>');
	$('#screenInfo').hide();
	//////////////////////
	// STOP PROPAGATION //
	//////////////////////
	$('#screenInfo').on(touchstart, function (evt) {
		if(!$('body').hasClass('msie') && !app.device.desktop) {
			evt.stopPropagation();
			evt.preventDefault();
		}
	});
	/////////////
	// FADE IN //
	/////////////
	app.handlers.fade(1, '#screenInfo', function () {
		////////////////
		// PREHANDLER //
		////////////////
		setTimeout(function () {
			if (typeof preHandler === 'function') {
				preHandler();
			}
		}, 0);
	});
	/////////////////
	// POSTHANDLER //
	/////////////////
	setTimeout(function () {
		$('#closeButton').on(touchend, function (evt) {
			app.save('info_' + title, true);
			app.handlers.fade(0, '#screenInfo');
			if (typeof postHandler === 'function') {
				postHandler();
			}
			evt.preventDefault();
			evt.stopPropagation();
		});
		//allow disable
		/*
		if(app.dev) {
			$('#closeButton').on('longhold',function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				app.globals.blockInfo = 1;
				$('#closeButton').trigger(touchend);
				evt.preventDefault();
				evt.stopPropagation();
			});
		}
		*/
	}, 300);
};
///////////////
// APP READY //
///////////////
app.ready = function(callback) {
	'use strict';
	//READY
	$('body').addClass('ready');
	//////////////
	// VIEWPORT //
	//////////////
	if(app.device.ios) {
		$('#viewPort').attr('content', $('#viewPort').attr('content').split('height=device-height').join('minimal-ui') );
	}
	//////////////
	// CALLBACK //
	//////////////
	if(typeof callback === 'function') {
		callback();
	}
};
////////////////
// ADD SCRIPT //
////////////////
app.getScript = function(url) {
	'use strict';
	var script  = document.createElement('script');
	script.type = 'text/javascript';
	script.src  = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};
/////////
// URL //
/////////
var ref;
app.url = function(url) {
	'use strict';
	//STORES
	var store = {
		web:        'https://chronoburn.com',
		ios:        'https://itunes.apple.com/app/id732382802',
		android:    'https://play.google.com/store/apps/details?id=com.cancian.kcals',
		wp8:        'https://www.microsoft.com/en-us/store/p/chronoburn-real-time-calorie-counter/9wzdncrdkhz5?#ratings-reviews',
		wp10:       'https://www.microsoft.com/en-us/store/p/chronoburn-real-time-calorie-counter/9wzdncrdkhz5?#ratings-reviews',
		windows8:   'https://www.microsoft.com/en-us/store/p/chronoburn-real-time-calorie-counter/9wzdncrdkhz5?#ratings-reviews',
		windows10:  'https://www.microsoft.com/en-us/store/p/chronoburn-real-time-calorie-counter/9wzdncrdkhz5?#ratings-reviews',
		firefoxos:  'https://marketplace.firefox.com/app/chronoburn',
		osxapp:     app.device.osx ? 'macappstores://itunes.apple.com/app/id898749118' : 'https://itunes.apple.com/app/id898749118',
		chromeos:   'https://chrome.google.com/webstore/detail/ipifmjfbmblepifflinikiiboakalboc',
		blackberry: app.device.blackberry ? 'appworld://content/59937667' : 'https://appworld.blackberry.com/webstore/content/59937667',
		playbook:   'https://appworld.blackberry.com/webstore/content/59937667',
		amazon:     'https://www.amazon.com/dp/B00NDSQIHK/qid=1411265533',
		tizen:      'tizenstore://ProductDetail/000000084298' //http://www.tizenstore.com/event/event_ajax.as?contentId=000000084298
	};
	//SHORTCUT
	     if((!url && app.device.ios)        || url == 'ios')         { url = store.ios;        }
	else if((!url && app.device.amazon)     || url == 'amazon')      { url = store.amazon; store.android = store.amazon; }
	else if((!url && app.device.blackberry) || url == 'blackberry')  { url = store.blackberry; }
	else if((!url && app.device.playbook)   || url == 'playbook')    { url = store.playbook;   }
	else if((!url && app.device.android)    || url == 'android')     { url = store.android;    }
	else if((!url && app.device.wp10)       || url == 'wp10')        { url = store.wp10;       }
	else if((!url && app.device.wp8)        || url == 'wp8')         { url = store.wp8;        }
	else if((!url && app.device.windows10)  || url == 'windows10')   { url = store.windows10;  }	
	else if((!url && app.device.windows8)   || url == 'windows8')    { url = store.windows8;   }
	else if((!url && app.device.firefoxos)  || url == 'firefoxos')   { url = store.firefoxos;  }
	else if((!url && app.device.osxapp)     || url == 'osxapp')      { url = store.osxapp;     }
	else if((!url && app.device.chromeos)   || url == 'chromeos')    { url = store.chromeos;   }
	else if((!url && app.device.tizen)      || url == 'tizen')       { url = store.tizen;      }
	else if(url == 'www')										 	 { url = store.web;        }
	//OPEN
	if(url) {
		     if(app.device.ios)									{ ref = window.open(url, '_system', 'location=yes'); }
		else if(app.device.android)								{ ref = window.open(url, '_system', 'location=yes'); }
		else if(app.device.msapp && typeof Windows!='undefined'){ try { Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(url)); } catch(err) { window.open(url, '_blank'); }}
		else if(app.device.wp8)									{ window.open(url, '_blank');						 }
		else if(app.device.firefoxos)							{ ref = window.open(url, '_system', 'location=yes'); }
		else if(app.device.osxapp)								{ macgap.app.open(url);								 }
		else if(app.device.playbook)							{ try { blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, new blackberry.invoke.BrowserArguments(url)); } catch (err) { errorHandler('url: ' + err); }}
		else if(app.device.blackberry)							{ if(/appworld/i.test(url)) { window.location.href=url; } else { ref = window.open(url, '_blank'); }}
		else if(app.device.tizen)								{ if(/tizenstore/i.test(url)) { (function() { var service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view','tizenstore://ProductDetail/000000084298', null, null, null); var id = 'org.tizen.tizenstore'; try { tizen.application.launchAppControl(service, id, function (success) {}, function (err) { errorHandler(err); }, null); } catch (er) { errorHandler(er); }})(); } else { ref = window.open(url, '_blank'); ref.addEventListener('tizenhwkey', function(e) { if(e.keyName === 'back' && ref) { ref.close(); }}); }}
		else 													{ window.open(url, '_blank'); }
	}
};
//////////////
// APP INFO //
//////////////
var appBalance;
var appBalanceOver;
var appStatus;
var appHeader;
var appFooter;
var db;
var dbName              = 'mylivediet.app';
var lib;
var lib2;
var storeEntry;
var storeFood;
var AND                 = ' ';
var initialScreenWidth  = app.width();
var initialScreenHeight = app.height();
var orientationSwitched = 0;
var initialScreenSize   = app.height();
var lastScreenSize      = app.height();
var lastScreenResize    = app.height();
var opaLock             = 0;
var loadingDivTimer;
var timerPerf           = (new Date().getTime());
var timerDiff           = 100;
var timerWait           = 100;
var noteContent         = '';
var noTimer;
var preTab;
var afterTab;
var timerKcals;
var blockModal = false;
var modalTimer;
function voidThis()   { }
function voidMe()     { }
//////////////////
// APP HANDLERS //
//////////////////
app.handlers = {
	//////////////////
	// CSS FADE OUT //
	//////////////////
	fade : function(inOut,target,callback,duration) {
		'use strict';
		if(!duration) {
			duration = 200;
		}
		//PRE-HIDE FADE-IN
		if(inOut == 1) {
			$(target).css2(prefix + 'transition-duration', '0s');
			$(target).css2('opacity',0);
			$(target).hide();
		}
		////////////////////
		// TRANSITION END //
		////////////////////
		$(target).off(transitionend).on(transitionend,function() {
			if(inOut == 0) {
				$(target).remove();
			} else {
				//fast resizing
				$(target).css2(prefix + 'transition-duration', '0s');
			}
			if(typeof callback === 'function') {
				callback();
				callback = '';
			}
		});
		//////////////////
		// SET ANIMATED //
		//////////////////
		$(target).css2(prefix + 'transition', 'opacity ease ' + (duration/1000) + 's');
		///////////////////////////////////
		// SET OPACITY ~ ENFORCE REMOVAL //
		///////////////////////////////////
		if(inOut == 1) {
			$(target).show();
		}
		//setTimeout(function() {
			$(target).css2('opacity',inOut);
			setTimeout(function() {
				if($(target).length && callback !== '') {
					$(target).trigger(transitionend);
				}
			//ENFORCE
			},300);
		//DEFER
		//},0);
	},
	////////////////
	// ACTIVE ROW //
	////////////////
	activeRowTouches : [],
	activeRowBlock   : [],
	activeRowTimer   : [],	
	activeLastObj    : [],
	activeRow : function (target, style, callback,callbackCondition) {
		'use strict';
		//ANDROID TAP ONLY
		if(app.device.android) {
			$(target).on(tap, function (evt) {
				if(typeof callback === 'function') {
					callback($(this).attr('id'), evt, this);
					$(this).removeClass(style);
				}
			});
			//TOUCHEND
			$(target).on(touchend + ' ' + touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) { $(this).removeClass(style); });
			//TOUCHSTART
			$(target).on(touchstart, function (evt) {
				$(this).addClass(style); 
				var Thiz = this;
				var Ztyle = style;
				setTimeout(function() { $(Thiz).removeClass(Ztyle); },700);
			});
			//
			return;
		}
		//
		var t = searchalize(target);
		var isButton = style == 'button' ? 1 : 30;
		if(app.device.osxapp || app.device.osx) {
			isButton = 1;
		}
		//RESET
		app.handlers.activeRowTouches[t] = 0;
		app.handlers.activeRowBlock[t]   = 0;
		app.handlers.activeLastObj[t]    = '';
		////////////////
		// SET PARENT //
		////////////////
		var targetParent = target;
		if (target.match(' ')) {
			targetParent = target.split(' ')[0] + ',' + target;
		}
		//////////////
		// TOUCHEND //
		//////////////
		$(target).on(touchend, function (evt) {
			var thiz = this;
			if($(thiz).hasClass(style) && app.handlers.activeRowBlock[t] == 0) {
				if (typeof callback === 'function') {
					//app.handlers.activeRowBlock[t] = 1;
					//
					callback($(thiz).attr('id'), evt, thiz);
					$(thiz).addClass(style);
					app.handlers.activeLastObj[t] = thiz;
					app.handlers.activeRowTouches[t] = 0;
					//app.handlers.activeRowBlock[t] = 0;
					app.timeout(t,'clear');
					if(style != 'activeOverflow') {
						$(app.handlers.activeLastObj[t]).removeClass(style);
					}
				}
			} else {
				app.handlers.activeRowTouches[t] = 0;
				//app.handlers.activeRowBlock[t] = 0;
				app.timeout(t,'clear');
			}
			if(style == 'false') {
				var falseThis = thiz;
				$(falseThis).css2('pointer-events','none');
				app.timeout('tapSelect',500,function() {
					$(falseThis).css2('pointer-events','auto');
				});
			}
		});
		////////////////
		// TOUCHSTART //
		////////////////
		setTimeout(function () {
			$(target).on(touchstart, function (evt) {
				var thiz = this;
				if(!$(thiz).hasClass(style)) {
					$(app.handlers.activeLastObj[t]).removeClass(style);
				}
				app.handlers.activeRowTouches[t] = 0;
				app.timeout(t,isButton,function (evt) {
					if (app.handlers.activeRowTouches[t] == 0 && app.handlers.activeRowBlock[t] == 0) {
						$(thiz).addClass(style);
						app.handlers.activeLastObj[t] = thiz;
					} else {
						$(app.handlers.activeLastObj[t]).removeClass(style);
					}
				});
				//CALLBACK CONDITION
				if(callbackCondition) {
					if(callbackCondition() === false) {
						app.timeout(t,'clear');
					}
				}
			});
		}, 200);
		//////////////////////
		// ROW LEAVE CANCEL //
		//////////////////////
		if(app.device.windows8) {
			$(target).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
				$(app.handlers.activeLastObj[t]).removeClass(style);
				app.timeout(t,'clear');
			});
		} else {
			$(targetParent).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
				app.handlers.activeRowTouches[t]++;
				if(!app.device.wp8 && style != 'activeOverflow') {
					app.timeout(t,'clear');
					$(app.handlers.activeLastObj[t]).removeClass(style);
				}
			});
		}
		//#////////////////////#//
		//# SCROLL/MOVE CANCEL #//
		//#////////////////////#//
		//lower thresold for android
		var TouchLimit = app.device.android ? 8 : 12;
		//
		if(!app.device.windows8) {
			var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove + ' ' + touchout  + ' ' + touchleave  + ' ' + touchcancel;
			/////////////////
			// MOVE CANCEL //
			/////////////////
			$(targetParent).on(moveCancel, function (evt) {
				app.handlers.activeRowTouches[t]++;
				app.timeout(t,'clear');
				if (app.handlers.activeRowTouches[t] > TouchLimit) {
					$(app.handlers.activeLastObj[t]).removeClass(style);
					if(app.device.osxapp || app.device.osx) {
						$('.activeOverflow').removeClass(style);
					}
				}
			});
			///////////////////
			// SCROLL CANCEL //
			///////////////////
			$(targetParent).on('scroll',function (evt) {
				app.handlers.activeRowTouches[t]++;
				app.timeout(t,'clear');
				if (app.handlers.activeRowTouches[t] > TouchLimit) {
					$(app.handlers.activeLastObj[t]).removeClass(style);
					app.handlers.activeRowTouches[t] = 0;
				}
			});
		}
		///////////////////////
		// SCROLL TIME BLOCK //
		///////////////////////
		$(targetParent).on('scroll',function (evt) {
			//BLOCK
			app.handlers.activeRowBlock[t] = 1;
			//UNBLOCK
			clearTimeout(app.handlers.activeRowTimer[t]);
			//TIMEOUT
			app.handlers.activeRowTimer[t] = setTimeout(function () {
				app.handlers.activeRowBlock[t] = 0;
			}, 60);
		});
	},
	///////////////////
	// HIGHLIGHT ROW //
	///////////////////
	highlight: function(target,callback) {
		'use strict';
		$(target).removeClass('activeOverflow');
		$(target).addClass('yellow');
		setTimeout(function () {
			$(target).css2(prefix + 'transition','background linear .5s');
			setTimeout(function () {
				$(target).removeClass('yellow');
				setTimeout(function () {
					$(target).css2(prefix + 'transition','background linear 0s');
					if(typeof callback === 'function') {
						callback();
					}
				}, 500);
			}, 100);
		}, 100);
	},
	///////////////
	// BUILD ROW //
	///////////////
	buildRows: function(data,filter) {
		'use strict';
		//////////////////
		// TOTAL WEIGHT //
		//////////////////
		var totalWeight = app.get.totalweight();
		////////////////
		// LOOP ARRAY //
		////////////////
		var rowHtml = '';
		var rowSql  = '';
		var dataID  = '';
		var rowIDs  = [];
		var i = data.length;
		while(i--) {
			/////////////////////
			// FILTER REPEATED //
			/////////////////////
			dataID = data[i].id;
			if (dataID && !rowIDs.contains(dataID)) {
				//
				var favClass = (data[i].fib === 'fav') ? ' favItem' : '';
				if((JSON.stringify(dataID)).length >= 13) {
					favClass = favClass + ' customItem';
				}
				var rowType  = (data[i].type == '0000' || data[i].type == 'exercise') ? 'exercise' : 'food';
				var catClass = 'cat' + (data[i].type).split('food').join('9999').split('exercise').join('0000');
				///////////////////////////
				// AJUST WEIGHT EXERCISE //
				///////////////////////////
				var kcals = data[i].kcal;
				if (rowType == 'exercise') {
					kcals = Math.round(((data[i].kcal * totalWeight) / 60) * 30);
				}
				//FORCE DECIMAL
				data[i].name = sanitizeSql(data[i].name);
				if(!data[i].pro) { data[i].pro = 0; }
				if(!data[i].car) { data[i].car = 0; }
				if(!data[i].fat) { data[i].fat = 0; }
				if(!data[i].fii) { data[i].fii = 0; }
				if(!data[i].sug) { data[i].sug = 0; }
				if(!data[i].sod) { data[i].sod = 0; }
				data[i].pro = Math.round(data[i].pro * 100) / 100;
				data[i].car = Math.round(data[i].car * 100) / 100;
				data[i].fat = Math.round(data[i].fat * 100) / 100;
				data[i].fii = Math.round(data[i].fii * 100) / 100;
				data[i].sug = Math.round(data[i].sug * 100) / 100;
				data[i].sod = Math.round(data[i].sod * 100) / 100;
				
				data[i].fib = (data[i].fib).split('diary_food').join('');
				//////////////
				// ROW HTML //
				//////////////
				//RowIDs no-repeat
				rowIDs.push(dataID);
				//
				rowHtml += '\
				<div class="searcheable' + favClass + ' ' + rowType + ' ' + data[i].id + ' ' + catClass + '" id="' + data[i].id + '">\
				<div class="foodName ' + rowType + '">' + data[i].name + '</div>\
				<span class="foodKcal"><span class="preSpan">' + LANG.KCAL[lang] + '</span>' + kcals + '</span>';
				////////////////////////
				// ADD NUTRITION INFO //
				////////////////////////
				if (rowType === 'food') {
					rowHtml += '\
					<span class="foodPro ' + rowType + '"><span class="preSpan">' + LANG.PRO[lang] + '</span>' + data[i].pro + '</span>\
					<span class="foodCar ' + rowType + '"><span class="preSpan">' + LANG.CAR[lang] + '</span>' + data[i].car + '</span>\
					<span class="foodFat ' + rowType + '"><span class="preSpan">' + LANG.FAT[lang] + '</span>' + data[i].fat + '</span>';
				}
				rowHtml += '</div>';
				///////////////
				// BUILD SQL //
				///////////////
				if(filter) {
					/*jshint ignore:start*/
					rowSql += "\"diary_food\" VALUES(#^#" + data[i].id + "#^#,'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + Number(data[i].kcal) + "','" + Number(data[i].pro) + "','" + Number(data[i].car) + "','" + Number(data[i].fat) + "','" + data[i].fib + "','" + Number(data[i].fii) + "','" + Number(data[i].sug) + "','" + Number(data[i].sod) + "');\n";
					/*jshint ignore:end*/
				}
			}
		}
		///////////////
		// WRITE SQL //
		///////////////
		if(filter) {
			//PREPARE
			rowSql = app.fixSql(rowSql);
			///////////////////
			// FIX MALFORMED //
			///////////////////
			//FAV~CUSTOM
			if(filter === 'fav') {
				app.save('customFavSql', rowSql);
			} else {
				app.save('customItemsSql', rowSql);
			}
		}
		/////////////////
		// RETURN HTML //
		/////////////////
		if(rowHtml == '') {
			if($('#foodSearch').is(':focus')) {
				rowHtml = '<div class="searcheable noContent"><div><em>' + LANG.NO_MATCHES[lang] + '</em></div></div>';
			} else {
				rowHtml = '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>';
			}
		}
		////////////
		// OUTPUT //
		////////////
		return rowHtml;
	},
	//@//////////@//
	//@ REPEATER @//
	//@//////////@//
	repeaterTrigger: '',
	repeaterLoop:    '',
	repeater: function(target,style,triggerMs,repeatMs,callback) {
		'use strict';
		$(target).removeClass(style);
		clearTimeout(app.repeaterTrigger);
		clearTimeout(app.repeaterLoop);
		///////////////
		// AUTOCLEAR //
		///////////////
		var clearActions = touchend + ' ' + touchout + ' ' + touchleave + ' ' + touchcancel;
		$(target).off(clearActions).on(clearActions, function (evt) {
			if(!app.device.ios && !app.device.firefoxos) {
				evt.preventDefault();
			}
			$(target).removeClass(style);
			clearTimeout(app.repeaterTrigger);
			clearTimeout(app.repeaterLoop);
		});
		/////////////
		// TRIGGER //
		/////////////
		$(target).off(touchstart).on(touchstart, function (evt) {
			if(!app.device.ios && !app.device.firefoxos) {
				evt.preventDefault();
			}
			clearTimeout(app.repeaterTrigger);
			clearTimeout(app.repeaterLoop);
			//TAP
			$(target).addClass(style);
			callback();
			//START
			app.repeaterTrigger = setTimeout(function() {
				//REPEAT
				(function repeatMe() {
					clearTimeout(app.repeaterTrigger);
					clearTimeout(app.repeaterLoop);
					callback();
					app.repeaterLoop = setTimeout(repeatMe,repeatMs);
				})();
			}, triggerMs);
			return false;
		});
	}
};
////////////////
// ADD/REMOVE //
////////////////
app.handlers.addRemove = function(target,minValue,maxValue,valueType) {
	'use strict';
	if(!minValue) { minValue = 0;    }
	if(!maxValue) { maxValue = 9999; }
	//HTML
	if(!$( target + 'Neg').html()) {
		$(target).before2('<p class="neg" id="' + target.replace('#','') + 'Neg"></p><p class="pos" id="' + target.replace('#','') + 'Pos"></p>');
	}
	//NEG
	app.handlers.repeater(target + 'Neg','active',400,25,function() {
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue >= minValue + (valueType == 'dec' ? 0.1 : 1)) {
			inputValue = inputValue - (valueType == 'dec' ? 0.1 : 1);
		} else {
			inputValue = minValue;
		}
		$(target).val(decimalize(inputValue,-1));
	});
	//POS
	app.handlers.repeater(target + 'Pos','active',400,25,function() {
		if($(target).val() == '') {
			$(target).val(minValue);
		}
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue <= maxValue - (valueType == 'dec' ? 0.1 : 1)) {
			inputValue = inputValue + (valueType == 'dec' ? 0.1 : 1);
		}
		$(target).val( decimalize(inputValue,-1));
	});
};
/////////////
// APP GET //
/////////////
////////////////
// SCREENSHOT //
////////////////
app.screenshot = function() {
	'use strict';
	//SCREENSHOT
	var day = 60 * 60 * 24 * 1000;
	clearEntries(function() {
		saveEntry({raw: true, id: app.now()-(0*day), title: 1300, body: '', published: app.now()-(0*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(1*day), title: 1800, body: '', published: app.now()-(1*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(2*day), title: 1500, body: '', published: app.now()-(2*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(3*day), title: 1000, body: '', published: app.now()-(3*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(4*day), title: 1300, body: '', published: app.now()-(4*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(5*day), title: 1800, body: '', published: app.now()-(5*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(6*day), title: 1300, body: '', published: app.now()-(6*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		saveEntry({raw: true, id: app.now()-(7*day), title: 1000, body: '', published: app.now()-(7*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: '', fii: 2, sug: 1, sod: 9});
		app.save('config_start_time',app.now()-(7.7*day));
		app.save('config_kcals_day_0',1400);
		$('#timerDailyInput').val(app.read('config_kcals_day_0'));
		updateTimer();
		app.exec.updateEntries();
	});
};
///////////
// KCALS //
///////////
app.get.kcals = function(opt) {
	'use strict';
	if(app.read('config_kcals_type','cyclic')) {
		if(app.read('config_kcals_day','d')) {
			if(opt == 'reset') {
				return 2000;
			}
			if(opt == 'key') {
				return 'config_kcals_day_2';
			}
			return app.read('config_kcals_day_2');
		} else {
			if(opt == 'reset') {
				return 1600;
			}
			if(opt == 'key') {
				return 'config_kcals_day_1';
			}
			return app.read('config_kcals_day_1');
		}
	} else {
		if(opt == 'reset') {
			return 2000;
		}
		if(opt == 'key') {
			return 'config_kcals_day_0';
		}
		return app.read('config_kcals_day_0');
	}
};
//#///////////#//
//# MOBILE OS #//
//#///////////#//
function getIsDesktop() {}
var isItDesktop = getIsDesktop;
function isDesktop() {
	'use strict';
	return isItDesktop;
}
//#//////////////////#//
//# DOMContentLoaded #//
//#//////////////////#//
document.addEventListener('DOMContentLoaded', function() {
	'use strict';
	$('body').addClass('domcontentloaded');
},false);
//#///////////////#//
//# GET USERAGENT #//
//#///////////////#//
var prefix;
var vendorClass;
var transitionend;
     if(/MSAppHost\/3.0/i.test(app.ua))				{ prefix = '';         transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/edge|trident|IEMobile/i).test(app.ua))	{ prefix = '-ms-';     transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/Firefox/i).test(app.ua))					{ prefix = '-moz-';    transitionend = 'transitionend';       vendorClass = 'moz';    }
else												{ prefix = '-webkit-'; transitionend = 'webkitTransitionEnd'; vendorClass = 'webkit'; }
///////////////////////////////////
// STANDALONE CONVERT CSS PREFIX //
///////////////////////////////////
if (!$('#plainLoad').length && !$('#superBlockCSS').length && isCurrentCacheValid !== 1) {
	if (vendorClass == 'moz' || vendorClass == 'msie') {
		var cssPath = 'css/index.css';
		$.support.cors = true;
		$.ajax({
			url : hostLocal + cssPath,
			dataType : 'text',
			success : function (dataCSS) {
				'use strict';
				if(vendorClass == 'moz') {
					dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
					dataCSS = dataCSS.split('-webkit-').join('-moz-');
				}
				if((/trident|IEMobile/i).test(navigator.userAgent))	{
					dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
					dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
					dataCSS = dataCSS.split('-webkit-').join('-ms-');
				}
				$('#coreCss').remove();
				$('#coreFonts').before2('<style type="text/css" id="coreCss"></style>');
				$('#coreCss').html2(dataCSS);
			}
		});
	}
}
////////////////////////
// UPDATE USER COLORS //
////////////////////////
app.updateColorPicker = function() {
	'use strict';
	if(!document.getElementById('colorPickerStyle')) {
		$('head').append2('<style type="text/css" id="colorPickerStyle"></style>');
	}
	var deficitColor  = app.read('colorDeficit');
	var balancedColor = app.read('colorBalanced');
	var surplusColor  = app.read('colorSurplus');

var pickerCss = '\
body.tab1 #appFooter li#tab1,\
body.tab2 #appFooter li#tab2,\
body.tab3 #appFooter li#tab3,\
body.tab4 #appFooter li#tab4			{ color: ' + balancedColor + '!important ; }\
body.tab1.surplus #appFooter li#tab1,\
body.tab2.surplus #appFooter li#tab2,\
body.tab3.surplus #appFooter li#tab3,\
body.tab4.surplus #appFooter li#tab4	{ color: ' + surplusColor  + '!important ; }\
body.tab1.deficit #appFooter li#tab1,\
body.tab2.deficit #appFooter li#tab2,\
body.tab3.deficit #appFooter li#tab3,\
body.tab4.deficit #appFooter li#tab4	{ color: ' + deficitColor  + '!important ; }\
body.balanced #appHeader		{ background-color: ' + balancedColor  +  '!important; }\
body.deficit #appHeader,\
body.over.deficit #appHeader	{ background-color: ' + deficitColor  +  '!important; }\
body.surplus #appHeader,\
body.over.surplus #appHeader	{ background-color: ' + surplusColor  +  '!important; }\
.android2 #balanceBar:before	{ background: -webkit-gradient(linear, left top, right top, color-stop(25.5%,' + deficitColor + '), color-stop(25.5%,' + balancedColor + '), color-stop(73.9%,' + balancedColor + '), color-stop(73.9%,'+surplusColor+')); }\
#balanceBar:before				{ background: -webkit-linear-gradient(left,                                  ' + deficitColor + ' 25.5%,             ' + balancedColor + ' 25.5%,             ' + balancedColor + ' 73.9%,             '+surplusColor+' 73.9%); }\
body.deficit #appStatusBalance #balanceBar:after	{ color: ' + deficitColor + '!important; }\
body.surplus #appStatusBalance #balanceBar:after	{ color: ' + surplusColor + '!important; }\
body.error.surplus #appHeader,\
body.error.deficit #appHeader		{ background-color: #000 !important; }\
body.error #timerKcalsInput			{ text-shadow: 0 0 1px rgba(255,255,255,.4) !important; }\
body.error.deficit #timerKcalsInput,\
body.error.deficit #timerKcals span,\
body.error.deficit #timerDailyInput,\
body.error.deficit #timerDaily span	{ color: #E54B1D !important; text-shadow: 0 0 1px rgba(255,255,255,.4) !important; }\
body.error.surplus #timerKcalsInput,\
body.error.surplus #timerKcals span,\
body.error.surplus #timerDailyInput,\
body.error.surplus #timerDaily span	{ color: #2DB454 !important; text-shadow: 0 0 1px rgba(255,255,255,.4) !important; }';
	//VENDOR PREFIX
	if(vendorClass == 'moz') {
		pickerCss = pickerCss.split('-webkit-').join('-moz-');
	}
	if(vendorClass == 'msie') {
		if(/MSAppHost\/3.0/i.test(app.ua)) {
			//MSAPP3
			pickerCss = pickerCss.split('-webkit-').join('');
		} else {
			//MSAPP2
			pickerCss = pickerCss.split('-webkit-').join('-ms-');
		}
	}
	$('#colorPickerStyle').html2(pickerCss);
};
//////////////////
// AUTOEXEC.OLD //
//////////////////
(function() {
	'use strict';
	////////////////////
	// FETCH SPECTRUM //
	////////////////////
	if(typeof $.spectrum === 'undefined') {
		$.support.cors = true;
		$.ajax({
			url : app.https + (app.dev ? '192.168.1.5' : 'chronoburn.com') + '/js/highcharts.js',
			dataType : 'text',
			success : function (spectrumData) {
				$.globalEval(spectrumData);
				app.updateColorPicker();
				if(typeof app.analytics !== 'undefined') {
					app.analytics('spectrum');
				}
			}
		});
	} else {
		app.updateColorPicker();
	}
	/////////////////////////
	// PUSHDOWN DEPRECATED //
	///////////////////////// WP80 && WP81 && deprecated
	if(app.device.wp80 || (app.device.wp81 && !app.device.wp10)) { // || baseVersion < 2.1)) { 
		if(app.read('config_autoupdate','on')) {
			console.log('rebooting...');
			app.reboot();
		}
		app.save('config_autoupdate','off');
		app.remove('remoteSuperBlockCSS');
		app.remove('remoteSuperBlockJS');
	}
})();
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
app.touch = (('ontouchend' in document) || ('ontouchstart' in window) || ('onmsgesturechange' in window)) && !app.device.chrome ? true : false;
////////////////////
// TOUCH HANDLERS //
////////////////////
var tap         = 'tap';
var hold        = 'hold';
var swipe       = 'swipe';
var touchstart  = app.touch ? 'touchstart'  : 'mousedown';
var touchend    = app.touch ? 'touchend'    : 'mouseup';
var touchmove   = app.touch ? 'touchmove'   : 'mousemove';
var touchcancel = app.touch ? 'touchcancel' : 'mouseup';
var touchleave  = app.touch ? 'touchleave'  : 'mouseleave';
var touchout    = app.touch ? 'touchout'    : 'mouseout';
///////////////
// MSPOINTER //
///////////////
function msPointerSet(prefix) {
	'use strict';
	if(prefix === 1) {
		touchstart  = 'MSPointerDown';
		touchend    = 'MSPointerUp';
		touchmove   = 'MSPointerMove';
		touchcancel = 'MSPointerCancel';
		touchleave  = 'MSPointerLeave';
		touchout    = 'MSPointerOut';
	} else {
		touchstart  = 'pointerdown';
		touchend    = 'pointerup';
		touchmove   = 'pointermove';
		touchcancel = 'pointercancel';
		touchleave  = 'pointerleave';
		touchout    = 'pointerout';
	}
}
//SETPOINTER (touchswipe ~ app.touch)
if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled && !app.touch) {
	if(window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !app.touch) {
	//if(app.device.wp8 && !app.device.wp10 && !app.device.desktop) {
		//WP81 ON WP81 && WP10
		//PREFFIX
		msPointerSet(1);
	} else {
		//NO PREFIX
		msPointerSet(0);
	}
}
//OVERRIDE TAP
if (app.device.wp80) { //app.device.msapp
	tap = 'click';
}
///////////////
// SAFE EXEC //
///////////////
app.safeExec = function (callback) {
	'use strict';
	if (app.device.msapp) {
		MSApp.execUnsafeLocalFunction(function () {
			callback();
		});
	} else {
		callback();
	}
};
///////////////////
// ERROR HANDLER //
///////////////////
function errorHandler(error,callback) {
	'use strict';
	if(!error || !error.length || typeof error === 'undefined') {
		return;
	}
	//FILTER
	if(/800a139e|isTrusted|InvalidStateError|UnknownError|space|stack|size|pile|NS_ERROR/i.test(JSON.stringify(error))) { 
		return; 
	}
	//STRINGIFY
	if(typeof error !== 'string') {
		error = stringifyError(error);
	}
	//DEV
	if(app.beenDev) {
		console.log('errorHandler[dev log]: ' + error);
	}
	//DEV ALERT
	if (app.dev && blockAlerts == 0) {
		if (app.device.windows8) {
			if (typeof alert !== 'undefined') {
				alert(error);
			}
		} else {
			if (window.confirm(error)) {
				blockAlerts = 0;
			} else {
				blockAlerts = 1;
			}
		}
	} else {
		//TRACK
		app.analytics('error','handled: ' + error);
		//LOG ERROR
		app.save('error_log_handled','handled log: ' + error);
	}
	//////////////
	// CALLBACK //
	//////////////
	if (typeof callback === 'function') {
		callback();
	}
}
/////////////////
// NUMBER ONLY //
/////////////////
function isNumberKey(evt){
	'use strict';
	var keyCode = (evt.which) ? evt.which : evt.keyCode;
	//backspace, enter, shift, left, right
	if(keyCode == 8 || keyCode == 13 || keyCode == 16 || keyCode == 37 || keyCode == 39) {
		return true;
	}
	//46 dot / 110 numlock dot / 190 wpdot 
	if((keyCode != 46 && keyCode != 190 && keyCode != 110) && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
		return false;
	}
	return true;
}
app.handlers.validate = function(target,config,preProcess,postProcess,focusProcess,blurProcess) {
	'use strict';
	var inputHandler = (app.device.android == 4.1 || app.device.wp8 || app.device.windows10 || app.device.wp10) ? 'keydown' : 'keypress';
	//SETTINGS
	if(!config)           { config = {}; }
	if(!config.maxValue)  { config.maxValue  = 9999; }
	if(!config.maxLength) { config.maxLength = 4;    }
	//if(!config.allowDots) { config.allowDots = 0; }
	//if(!config.inverter)  { config.inverter  = 0; }
	////////////////////////
	// KEYDOWN VALIDATION //
	////////////////////////
	var keydownId;
	var keydownValue;
	$(target).on(inputHandler, function(evt) {
		keydownId    = evt.target.id;
		keydownValue = JSON.stringify($(this).val());
		var keyCode  = evt.which || evt.keyCode;
		//PRE HANDLERS
		if(preProcess) {
			preProcess();
		}
		////////////
		// CONFIG //
		////////////
		//ENTER
		if(keyCode == 13)																	{ $(this).blur(); return true; }
		//MINUS INVERTER
		if(keyCode == 45 && config.inverter == true)										{ $(this).val( $(this).val()*-1 ); return false; }
		if((keyCode == 46 || keyCode == 110 || keyCode == 190) && config.inverter == true)	{ $(this).val( $(this).val()*-1 ); return false; }
		//DOT
		if(keyCode == 46 || keyCode == 110 || keyCode == 190) { if(config.allowDots != true || keydownValue.split('.').join('').length < keydownValue.length) {	return false; } return true; }
		///////////////////
		// ENFORCE LIMIT //
		///////////////////
		keydownValue = $(this).val();
		if(parseInt($(this).val()) > config.maxValue || JSON.stringify($(this).val()).length > config.maxLength+1) {
			if(config.allowDots == true)  {
				$(this).val( parseFloat($(this).val()) );
			} else {
				$(this).val( parseInt($(this).val()) );
			}
			//PRE-CHECK
			if(isNumberKey(evt)) {
				keydownValue = $(this).val();
				$(this).val( $(this).val().slice(0,-1) );
			}
		}
		//CHECK
		return isNumberKey(evt);
	});
	//////////////////////
	// KEYUP VALIDATION //
	//////////////////////
	$(target).on('keyup change input paste', function(evt) {
		var keyCode = evt.which || evt.keyCode;
		//' bug
		if(keyCode == 222 || isNaN($(this).val())) {
			$('#' + keydownId).val( keydownValue );
		}
		//NO NEGATIVE
		if(!config.inverter) {
			if(parseInt($(this).val()) < 0) {
				$(this).val(Math.abs($(this).val()));
			}
		}
		//limit to 2 decimals
		if(($(this).val()).contains('.')) {
			var number = $(this).val().split(',').join('.');
				number = $(this).val().split('.');
			if(number) {
				if (number[1].length > 2) {
					$(this).val( parseFloat(number[0] + '.' + number[1].slice(0,2)) );
				}
			}
		}
		//POST HANDLERS
		if(postProcess) {
			postProcess();
		}
	});
	///////////
	// FOCUS //
	///////////
	$(target).on('focus', function(evt) {
		if($(this).val() == '0') {
			$(this).val('');
		}
		//FOCUS HANDLER
		if(focusProcess) {
			focusProcess();
		}
	});
	//////////
	// BLUR //
	//////////
	$(target).on('blur', function(evt) {
		if($(this).val().length == 0 || parseFloat($(this).val()) == 0 || isNaN($(this).val())) {
			if(config.defaultValue) {
				$(this).val(config.defaultValue);
			} else {
				$(this).val('0');
			}
		}
		if(config.minValue) {
			if($(this).val() < config.minValue) {
				$(this).val(config.minValue);
			}
		}
		if(config.maxValue) {
			if($(this).val() > config.maxValue) {
				$(this).val(config.maxValue);
			}
		}
		//BLUR HANDLER
		if(blurProcess) {
			blurProcess();
		}
	});
	/////////////////
	// PROPAGATION //
	/////////////////
	$(target).on(touchmove, function(evt) {
		evt.preventDefault();
	});
};
////////////////////
// FIX/FORMAT SQL //
////////////////////
/*jshint ignore:start*/
app.fixSql = function(fetchEntries) {
	'use strict';
	if(!fetchEntries) { return ' '; }
	//NULL
	fetchEntries = fetchEntries.split('undefined').join('');
	fetchEntries = fetchEntries.split('NaN').join('');
	//ZEROES
	fetchEntries = fetchEntries.split("'0,'").join("'0','");
	fetchEntries = fetchEntries.split("'0.0,'").join("'0.0','");
	fetchEntries = fetchEntries.split("'0.00,'").join("'0.00','");
	//NUMERIC
	fetchEntries = fetchEntries.split("0,'").join("0','");
	fetchEntries = fetchEntries.split("1,'").join("1','");
	fetchEntries = fetchEntries.split("2,'").join("2','");
	fetchEntries = fetchEntries.split("3,'").join("3','");
	fetchEntries = fetchEntries.split("4,'").join("4','");
	fetchEntries = fetchEntries.split("5,'").join("5','");
	fetchEntries = fetchEntries.split("6,'").join("6','");
	fetchEntries = fetchEntries.split("7,'").join("7','");
	fetchEntries = fetchEntries.split("8,'").join("8','");
	fetchEntries = fetchEntries.split("9,'").join("9','");
	//CUSTOM
	fetchEntries = fetchEntries.split("'fav,").join("'fav',");
	fetchEntries = fetchEntries.split("'nonFav,").join("'nonFav',");
	fetchEntries = fetchEntries.split("'custom,").join("'custom',");
	//GENERIC
	fetchEntries = fetchEntries.split("'','").join("','");
	fetchEntries = fetchEntries.split("',''").join("','");
	//ENDINGS
	fetchEntries = fetchEntries.split("(''").join("('");
	fetchEntries = fetchEntries.split(",');").join(",'');");
	//REFILL
	fetchEntries = fetchEntries.split(",',").join(",'',");
	//RESTORE
	fetchEntries = fetchEntries.split("#^#").join("");
	//RETURN
	return fetchEntries;
};
/*jshint ignore:end*/
//////////
// TRIM //
//////////
function trim(str) {
	'use strict';
	if(!str.length) { return ''; }
	str = str.replace(/^\s+/, '');
	str = str.replace(/(^[ \t]*\n)/gm, '');
		for(var i = str.length - 1; i >= 0; i--) {
			if(/\S/i.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
function trimDot(str) {
	'use strict';
	if(!str.length) { return ''; }
	return str.replace(/\.$/, '').replace(/\,$/, '');
}
function trimSpace(str) {
	'use strict';
	if(!str.length) { return ''; }
	return str.replace(/\s\s+/g, ' ');
}
function trimSpaceAll(str) {
	'use strict';
	if(!str.length) { return ''; }
	return str.replace(/  +/g, ' ');
}
///////////////
// ISEMPTY() //
///////////////
function isEmpty(val){
	'use strict';
	if (typeof val === 'undefined' || !val) {
		return true;
	} else {
		return false;
	}
}
//////////////////////
// PROTOTYPE.TRIM() //
////////////////////// https://github.com/kvz/locutus/blob/master/src/php/strings/trim.js
String.prototype.trim = function (charlist) {
	'use strict';
	var str = this;
	if (!str) {
		return '';
	}
	var whitespace = [
		' ',
		'\n',
		'\r',
		'\t',
		'\f',
		'\x0b',
		'\xa0',
		'\u2000',
		'\u2001',
		'\u2002',
		'\u2003',
		'\u2004',
		'\u2005',
		'\u2006',
		'\u2007',
		'\u2008',
		'\u2009',
		'\u200a',
		'\u200b',
		'\u2028',
		'\u2029',
		'\u3000'
	].join('');
	var l = 0;
		var i = 0;
		str += '';
		if (charlist) {
			whitespace = (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '$1');
		}
		l = str.length;
		for (i = 0; i < l; i++) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(i);
					break;
			}
		}
		l = str.length;
		for (i = l - 1; i >= 0; i--) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(0, i + 1);
					break;
			}
		}
		return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};
///////////////
// HIGHLIGHT //
///////////////
app.highlight = function (target, duration, startColor, endColor, callback, forceWait) {
	'use strict';
	if (!startColor) { startColor = 'rgba(255,200,0,0.5)'; }
	if (!endColor)   { endColor   = 'rgba(255,255,255,0)'; }
	if (!duration)   { duration   = 1000; }
	//
	$(target).css2(prefix + 'transition', 'background linear 0s');
	$(target).css2('background-color', startColor);	
	$(target).addClass('appHighlight');
	setTimeout(function () {
		$(target).css2(prefix + 'transition', 'background linear ' + JSON.stringify(duration) + 'ms');
		$(target).css2('background-color', endColor);
		$(target).css2('pointer-events','none');
		//WAIT TO DISABLE
		setTimeout(function () {
			$(target).css2(prefix + 'transition', 'background linear 0s');
			$(target).css2('pointer-events','auto');
			$(target).removeClass('appHighlight');			
			//
			if (typeof callback === 'function') {
				callback();
			}
		}, duration);
	}, 0);
};
/////////////////////
// STRINFIGY ERROR //
/////////////////////
var stringifyError = function (err) {
	'use strict';
	var plainObject = {};
	Object.getOwnPropertyNames(err).forEach(function (key) {
		plainObject[key] = err[key];
	});
	return JSON.stringify(plainObject);
};
////////////////
// CAPITALIZE //
////////////////
String.prototype.capitalize = function() {
	'use strict';
	return this.charAt(0).toUpperCase() + this.slice(1);
};
///////////
// isOdd //
///////////
function isOdd(val) {
	'use strict';
	return val % Math.round(2);
}
////////////////
// DECIMALIZE //
////////////////
function decimalize(val,p) {
	'use strict';
	if((Math.round(Number(val) *  10) / 10)  == 0 && p == -1) { return '0';    }
	if((Math.round(Number(val) *  10) / 10)  == 0 && p ==  1) { return '0.0';  }
	if((Math.round(Number(val) * 100) / 100) == 0)			  { return '0.00'; }
	if(p == 1) {
		return Math.round(Number(val) * 10) / 10;
	}
	return Math.round(Number(val) * 100) / 100;
}
/////////////
// TOASCII //
/////////////
var latin_map = {'á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','å':'a','ǻ':'a','ḁ':'a','ã':'a','æ':'ae','ǽ':'ae','ǣ':'ae','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ƃ':'b','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ċ':'c','ƈ':'c','ď':'d','ḑ':'d','ḓ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ḏ':'d','ǲ':'d','ǅ':'d','đ':'d','ƌ':'d','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ę':'e','ẽ':'e','ḛ':'e','ḟ':'f','ƒ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ǥ':'g','ḫ':'h','ḩ':'h','ĥ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ħ':'h','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','İ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ɨ':'i','ĩ':'i','ḭ':'i','ĵ':'j','ḱ':'k','ǩ':'k','ķ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ĺ':'l','ľ':'l','ļ':'l','ḽ':'l','ḷ':'l','ḹ':'l','ḻ':'l','ŀ':'l','ǈ':'l','ł':'l','ǉ':'lj','ḿ':'m','ṁ':'m','ṃ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ṅ':'n','ṇ':'n','ɲ':'n','ṉ':'n','ǋ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ō':'o','ṓ':'o','ṑ':'o','ɵ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ƣ':'oi','ɛ':'e','ɔ':'o','ṕ':'p','ṗ':'p','ƥ':'p','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ȓ':'r','ṟ':'r','ǝ':'e','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ṡ':'s','ṣ':'s','ṩ':'s','ț':'t','ť':'t','ţ':'t','ṱ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ʈ':'t','ŧ':'t','ɯ':'m','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ṿ':'v','ʋ':'v','ṽ':'v','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ẍ':'x','ẋ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ż':'z','ẓ':'z','ẕ':'z','ƶ':'z','ĳ':'ij','œ':'oe','ʙ':'b','ɢ':'g','ʛ':'g','ʜ':'h','ɪ':'i','ʁ':'r','ʟ':'l','ɴ':'n','ɶ':'oe','ʀ':'r','ʏ':'y','ẚ':'a','ƀ':'b','ɕ':'c','ɖ':'d','ı':'i','ɟ':'j','ʄ':'j','ɦ':'h','ẖ':'h','ƕ':'hv','ǰ':'j','ʝ':'j','ƚ':'l','ɬ':'l','ɫ':'l','ɭ':'l','ſ':'s','ẛ':'s','ɱ':'m','ƞ':'n','ɳ':'n','ʠ':'q','ɾ':'r','ɼ':'r','ɽ':'r','ɘ':'e','ɿ':'r','ʂ':'s','ɡ':'g','ẗ':'t','ƫ':'t','ɐ':'a','ɥ':'h','ʞ':'k','ɰ':'m','ɹ':'r','ɻ':'r','ɺ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ẘ':'w','ẙ':'y','ʑ':'z','ʐ':'z','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ﬆ':'st'};
String.prototype.latinize=function(){'use strict';return this.replace(/[^A-Za-z0-9\[\] ]/g,function(char){return latin_map[char]||char;});};
/////////////////
// SEARCHALIZE //
/////////////////
function searchalize(str) {
	'use strict';
	if(!str || str == '')	{ return ''; }
	if(str === null)		{ return ''; }
	str = str.split('	').join('');
	str = str.toLowerCase();
	str = str.latinize();
	str = str.split('0').join('');
	str = str.split('1').join('');
	str = str.split('2').join('');
	str = str.split('3').join('');
	str = str.split('4').join('');
	str = str.split('5').join('');
	str = str.split('6').join('');
	str = str.split('7').join('');
	str = str.split('8').join('');
	str = str.split('9').join('');
	str = str.split(' ').join('');
	str = str.split('.').join('');
	str = str.split(',').join('');
	str = str.split('-').join('');
	str = str.split('_').join('');
	str = str.split(':').join('');
	str = str.split(';').join('');
	str = str.split('"').join('');
	str = str.split('“').join('');
	str = str.split('”').join('');
	str = str.split('\'').join('');
	str = str.split('‘').join('');
	str = str.split('’').join('');
	str = str.split('(').join('');
	str = str.split(')').join('');
	str = str.split('{').join('');
	str = str.split('}').join('');
	str = str.split('[').join('');
	str = str.split(']').join('');
	str = str.split('%').join('');
	str = str.split('&').join('');
	str = str.split('/').join('');
	str = str.split('~').join('');
	str = str.split('*').join('');
	str = str.split('`').join('');
	str = str.split('!').join('');
	str = str.split('@').join('');
	str = str.split('#').join('');
	str = str.split('$').join('');
	str = str.split('^').join('');
	str = str.split('+').join('');
	str = str.split('|').join('');
	str = str.split('?').join('');
	str = str.split('>').join('');
	str = str.split('<').join('');
	str = str.split('=').join('');
	str = str.split('\\').join('');
	str = str.split('।').join('');
	str = str.split('。').join('');
	str = str.split('、').join('');
	return trim(str);
}
//////////////
// CONTAINS //
//////////////
//ARRAY
Array.prototype.contains = function(obj) {
	'use strict';
	return (JSON.stringify(this)).indexOf(JSON.stringify(obj)) > -1;
};
//STRING
String.prototype.contains = function () {
	'use strict';
	return String.prototype.indexOf.apply(this, arguments) !== -1;
};
///////////
// EMPTY //
///////////
function empty(mixedVar) {
	'use strict';
	var undef;
	var key;
	var i;
	var len;
	var emptyValues = [undef, null, false, 0, '', '0'];

	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixedVar === emptyValues[i]) {
			return true;
		}
	}

	if (typeof mixedVar === 'object') {
		for (key in mixedVar) {
			if (mixedVar.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}

	return false;
}
////////////////
// SORTBYATTR //
////////////////
Array.prototype.sortbyattr = function(attr,order) {
	'use strict';
	// NORMAL ATTR SORT
	this.sort(function(a, b) {
		if(order === 'desc') {
			return (b[attr] > a[attr]) ? 1 : ((b[attr] < a[attr]) ? -1 : 0);
		} else {
			return (a[attr] > b[attr]) ? 1 : ((a[attr] < b[attr]) ? -1 : 0);
		}
	});
	return this;
};
////////////////
// SORTOBJECT //
////////////////
function sortObject(obj) {
	'use strict';
	var arr = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			arr.push([prop,obj[prop]]);
		}
	}
	return arr.sort().reverse();
}
/////////////////
// PUSH UNIQUE //
/////////////////
Array.prototype.pushUnique = function (item) {
	'use strict';
	if (this.indexOf(item) == -1) {
		//if(jQuery.inArray(item, this) == -1) {
		this.push(item);
		return true;
	}
	return false;
};
////////////////////
// RETURN UNIQUES //
////////////////////
function unique(obj) {
	'use strict';
	var uniques = [];
	var stringify = {};
	for (var i = 0; i < obj.length; i++) {
		var keys = Object.keys(obj[i]);
		keys.sort(function (a, b) {
			return a - b;
		});
		var str = '';
		for (var j = 0; j < keys.length; j++) {
			str += JSON.stringify(keys[j]);
			str += JSON.stringify(obj[i][keys[j]]);
		}
		if (!stringify.hasOwnProperty(str)) {
			uniques.push(obj[i]);
			stringify[str] = true;
		}
	}
	return uniques;
}
///////////////
// ISNUMERIC //
///////////////
function isNumeric(num) {
	'use strict';
	return (typeof num == 'string' || typeof num == 'number') && !isNaN(num - 0) && num !== '';
}
//ISNUMBER
function isNumber(num) {
	'use strict';
	return (typeof num == 'number') && !isNaN(num - 0) && num !== '';
}
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
	'use strict';
    if(!input) { return ''; }
	input        = new Date(input);
	var gotYear  = input.getFullYear();
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var hour     = input.getHours();
    var minute   = input.getMinutes();
    if(minute < 10)   { minute = '0' + minute; }
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	//
	return gotYear + '/' + gotMonth + '/' + gotDate + ' - ' + hour + ':' + minute;
}
////////////////////
// DAY UTC FORMAT //
////////////////////
var DayUtcFormat = function(input) {
	'use strict';
    if(!input) { return ''; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var gotYear  = input.getFullYear();
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	return gotYear + '/' + gotMonth + '/' + gotDate;
};
var toDate = DayUtcFormat;
/////////////////////
// CONVERT TO TIME //
/////////////////////
var toTime = function (input){
	'use strict';
	if(!input) { return; }
	var datum = Date.parse(input);
	return datum;
};
////////////////
// DAY FORMAT //
////////////////
function dayFormat(input) {
	'use strict';
    if(!input) { return ''; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var gotYear  = input.getFullYear();
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	return gotYear + '/' + gotMonth + '/' + gotDate;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	'use strict';
	//no future dates ~ implemented
	//if(date1 > date2) { date1 = new Date().getTime(); }
	
	if(!LANG) { return; }

	//Get 1 day in milliseconds
	var one_day  = 1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = date1;
	var date2_ms = date2;
	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	var showAgo = difference_ms >= 0 ? true : false;
	difference_ms = Math.abs(difference_ms);

	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var minutes   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var hours     = Math.floor(difference_ms % 24);
	var days      = Math.floor(difference_ms / 24);

	var lMinutes = ' ' + LANG.MINUTES[lang] + ' ';
	var lHours   = ' ' + LANG.HOURS[lang]   + ' ';
	var lDays    = ' ' + LANG.DAYS[lang]    + ' ';

	if(minutes == 0) { lMinutes = ''; minutes = ''; }
	if(hours   == 0) { lHours   = ''; hours   = ''; }
	if(days    == 0) { lDays    = ''; days    = ''; }

	if(minutes == 1) { lMinutes = ' ' + LANG.MINUTE[lang] + ' '; }
	if(hours   == 1) { lHours   = ' ' + LANG.HOUR[lang]   + ' '; }
	if(days    == 1) { lDays    = ' ' + LANG.DAY[lang]    + ' '; }

	if(days    > 3)                             { lHours   = ''; hours   = ''; }
	if(days    > 0)                             { lMinutes = ''; minutes = ''; }
	if(days    > 0 && hours   > 0)              { lDays    = lDays  + LANG.AND[lang] + ' '; }
	if(hours   > 0 && minutes > 0)              { lHours   = lHours + LANG.AND[lang] + ' '; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; lMinutes = ' ' + LANG.MINUTES[lang] + ' '; }

	if(showAgo == true) {
		return LANG.PREAGO[lang] + ' ' + days + lDays + hours + lHours + minutes + lMinutes + ' ' + LANG.AGO[lang] + ' ';
	} else {
		return days + lDays + hours + lHours + minutes + lMinutes + ' ';
	}
}
////////////////////////
// WINDOW ORIENTATION //
////////////////////////
function getOrientation() {
	'use strict';
	if(window.orientation == 90 || window.orientation == -90) {
		return 'landscape';
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return 'portrait';
	}
}
//////////////////////
// ANDROID 2 SELECT //
//////////////////////
function android2Select() {
	'use strict';
	if(app.device.android && app.device.android < 4) {
		$('body').append2('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
		$('#dummyInput').focus();
		$('#dummyInput').blur();
		$('#dummyInput').remove();
	}
}
////////////////////
// CSS LOAD COUNT //
////////////////////
function cssLoadCount(num,total) {
	'use strict';
	if(typeof LANG === 'undefined') { return; }
	//
	var loadCounter = ' (' + num + '/' + total + ')';
	if(num == 0 && total == 0) { loadCounter = ''; }
	$('#cssAutoUpdate').html2('\
		.loading #advancedAutoUpdate:before	  { content: "' + LANG.DOWNLOADING[lang]     + loadCounter + '"; }\
		.pending #advancedAutoUpdate:before	  { content: "' + LANG.RESTART_PENDING[lang] + '"; }\
		.uptodate #advancedAutoUpdate:before  { content: "' + LANG.UP_TO_DATE[lang]      + '"; }\
		.corrupted #advancedAutoUpdate:before { content: "' + LANG.CORRUPTED[lang]       + '"; }\
		.spinnerMask #loadMask:before		  { content: "' + LANG.PREPARING_DB[lang]    + '"; }\
		.spinnerMask.updtdb #loadMask:before  { content: "' + LANG.UPDATING_DB[lang]     + '"; }\
	');
}
//////////////
// KICKDOWN //
//////////////
function kickDown(el) {
	'use strict';
	if(!el) { el = '#appContent'; }
	//
	try {
		if(!$('body').hasClass('android2')) {
			if(!app.device.desktop || app.device.windows8) {
				window.scrollTo(0, 0);
				if(document.body) {
					document.body.scrollTop = 0;
				}
				//window.scroll($(el)[0].scrollTop,0,0);
			}
		} else {
			$(el).scrollTop($(el).scrollTop());
		}
	} catch(err) { errorHandler(err); }
}
///////////////////
// TRACK INSTALL //
///////////////////
app.trackInstall = function () {
	'use strict';
	//REAL USERS
	if(!app.read('intro_dismissed'))			{ return; }
	//FIRST RUN
	if(app.read('app_installed','installed'))	{ return; }
	//LOCK
	app.save('app_installed', 'installed');
	///////////
	// TRACK //
	///////////
	if (app.http) {
		//WEBINSTALL
		app.analytics('webinstall');
		return;
	} else if(app.device.cordova || app.device.msapp || app.device.ios || app.device.android || app.device.wp8 || app.device.wp10 || app.device.windows8 || app.device.windows10 || app.device.osxapp || app.device.blackberry || app.device.playbook || app.device.tizen) {
		//INSTALL
		if(typeof baseVersion !== 'undefined') {
			if(baseVersion >= 2.1) {
				app.analytics('install 2.1');
				return;
			}
		}
	}
	//BOGUS ~ UNCAUGHT
	app.analytics('bogus');
};
//#//////////////#//
//# ONLINE USERS #//
//#//////////////#//
app.online = function () {
	'use strict';
	$.ajax({type: 'GET', dataType: 'text', url: app.https + 'chronoburn.com/' + 'update.php?type=usr', success: function(onlineUsers) {
		app.save('online_users',onlineUsers);
		if(app.read('app_last_tab','tab1')) {
			$('#onlineUsers span').html2(app.read('online_users'));
		}
	}});
};
/////////////////
// MSAPP METRO //
/////////////////
if(app.device.windows8) {
	/////////////////
	// METRO ALERT //
	/////////////////
	(function() {
		'use strict';
		var alertsToShow = [];
		var dialogVisible = false;
		function showPendingAlerts() {
			if (dialogVisible || !alertsToShow.length) {
				return;
			}
			dialogVisible = true;
			(new Windows.UI.Popups.MessageDialog(alertsToShow.shift())).showAsync().done(function () {
				dialogVisible = false;
				showPendingAlerts();
			});
		}
		window.alert = function (message) {
			if (window.console && window.console.log) {
				window.console.log(message);
			}
			alertsToShow.push(message);
			showPendingAlerts();
		};
	})();
}
//##/////////////##//
//## APP.ALERT() ##//
//##/////////////##//
window.azert = window.alert;
window.alert = {};
window.alert = function (title, msg, button, callback) {
	'use strict';
	if (typeof title    !== 'undefined' && typeof msg === 'undefined') { msg  = ' '; }
	if (typeof title    === 'undefined') { title  = 'alert';       }
	if (typeof msg      === 'undefined') { msg    = 'msg';         }
	if (typeof button   === 'undefined') { button = LANG.OK[lang]; }
	if (typeof callback !== 'function')  { callback = voidThis;    }
	//
	if (app.device.playbook) {
		try {
			blackberry.ui.dialog.customAskAsync(msg, [button], function(button) { callback(button+1); }, {title : title});
		} catch(err) { errorHandler(err); }
	} else if (typeof navigator.notification !== 'undefined' && !app.http && !app.device.windows8) {
		navigator.notification.alert(msg, callback, title, button);
	} else {
		if ((msg != 'msg' && msg != ' ') || title == 'alert') { msg = '\n' + msg; }
		if (window.azert(title + '\n' + msg)) {
			setTimeout(function () {
				callback();
			}, 0);
		}
	}
};
//##//////////////##//
//## APP.PROMPT() ##//
//##//////////////##// prompt: function(message, resultCallback, title, buttonLabels, defaultText) {
app.prompt = function(title,content,callback) {
	'use strict';
	var usrPrompt = window.prompt(title,content);
	if(usrPrompt !== null) {
		callback(usrPrompt);
	}
};
/*
window.navigator.notification.prompt(
    new String(), // message
    function(answer) {
        if (answer.buttonIndex === 1) {
            // Ok
            var newcat = answer.input1;
            transaction.executeSql("INSERT INTO cat (Name) VALUES (?)", [newcat]);
        }
        else {
            // Exit
        }
    }, // callback
    "ADD CATEGORY", //title
    ["Ok", "Exit"], // button titles
    new String() // defaultText
);
*/
//##///////////////////##//
//## APP CONFIRM LAYER ##//
//##///////////////////##// appConfirm(title, msg, callback, LANG.OK[lang], LANG.CANCEL[lang]);
var MSDialog;
var MSNext = [];
function appConfirm(title, msg, callback, ok, cancel) {
	'use strict';
	var okCancel = (cancel == 'hide') ? [ok] : [cancel, ok];
	///////////
	// MSAPP //
	///////////
	if (app.device.windows8) {
		//STORE NEXT
		if (MSDialog == true) {
			var isRepeated = 0;
			//NOREPEAT
			$.each(MSNext, function (key, value) {
				if (title == MSNext[key][0]) {
					isRepeated = 1;
				}
			});
			if (isRepeated == 0) {
				MSNext.push([title, msg, callback, ok, cancel]);
			}
			return;
		}
		// SHOW
		try {
			MSDialog = true;
			var md = new Windows.UI.Popups.MessageDialog(msg, title);
			md.commands.append(new Windows.UI.Popups.UICommand(ok));
			if (cancel != 'hide') {
				md.commands.append(new Windows.UI.Popups.UICommand(cancel));
			}
			md.showAsync()
			.then(function (command) {
				if(!command) { callback(1); return; }
				if (command.label == ok) { callback(2); } else if (command.label == cancel) { callback(1); }
			})
			.done(function () {
				MSDialog = false;
				if (MSNext.length) {
					appConfirm(MSNext[0][0], MSNext[0][1], MSNext[0][2], MSNext[0][3], MSNext[0][4]);
					MSNext.shift();
				}
			});
		} catch (err) {
			MSDialog = false;
			//errorHandler(err);
		}
	//////////////
	// PLAYBOOK //
	//////////////
	} else if (app.device.playbook) {
		try {
			blackberry.ui.dialog.customAskAsync(msg, [cancel, ok], function(button) { callback(button+1); }, {title : title});
		} catch(err) { errorHandler(err); }
	////////////////////
	// CORDOVA PLUGIN //
	////////////////////
	} else if (typeof navigator.notification !== 'undefined') {
		navigator.notification.confirm(msg, function(button) { setTimeout(function() { callback(button); }, 0); }, title, okCancel);
	//////////////
	// FALLBACK //
	//////////////
	} else {
		if (window.confirm(title + '\n' + msg)) {
			callback(2);
		} else {
			callback(1);
		}
	}
}
//////////////
// SENDMAIL //
//////////////
app.sendmail = function (usrMail, usrMsg, callback) {
	'use strict';
	if (usrMsg && usrMail) {
		$.ajax({
			type: 'POST',
			data : {
				mail: usrMail,
				msg: usrMsg,
				usr: app.get.platform() + ' - ' + lang
			},
			dataType: 'text',
			url: app.https + 'chronoburn.com/mail.php',
			error: function(xhr, statusText) {
				if (typeof callback === 'function') {
					callback(false);
				}
			}, success: function(result) { 
				if (typeof callback === 'function') {
					callback(true);
				}
			}
		});
	}
};
//##/////////////////##//
//## POINTY GESTURES ##// Pointy.js
//##/////////////////##// https://github.com/vistaprint/PointyJS
(function ($, touch_start, touch_end, touch_move) {
	'use strict';

	if(app.device.wp10) {
		touch_start = 'touchstart';
		touch_end   = 'touchend';
		touch_move  = 'touchmove';
	}
	
	///////////////
	// POINTY.JS //
	///////////////
	function copyEvent(event, type, dir) {
		event.type      = type;
		event.direction = dir;
		//event.isPropagationStopped = function () {
		//	return false;
		//};
		//event.isDefaultPrevented = function () {
		//	return false;
		//};
		//if (extras) {
		//	$.extend(event, extras);
		//}
		return event;
	}
	///////////////////
	// SWIPE HANDLER //
	///////////////////
	$.event.special.swipe = {
		// More than this horizontal displacement, and we will suppress scrolling.
		scrollSupressionThreshold : 30,

		// More time than this, and it isn't a swipe it's a "hold" gesture.
		durationThreshold : 750,

		// swipe horizontal displacement must be more than this.
		horizontalDistanceThreshold : app.device.android ? 15 : 30,

		// swipe vertical displacement must be less than this.
		verticalDistanceThreshold : 30,

		start : function (event) {
			if(event) {
				var pos = app.pointer(event);
				return {
					time : app.now(),
					coords : [pos.x, pos.y],
					origin : $(event.target)
				};
			}
		},

		stop : function (event) {
			if(event) {
				var pos = app.pointer(event);
				return {
					time : app.now(),
					coords : [pos.x, pos.y],
				};
			}
		},

		isSweep : function (start, stop, checkTime) {
			return stop.time - start.time < $.event.special.swipe.durationThreshold && 
			Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold &&
			Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold;
		},

		add : function (handleObj) {
			var thisObject = this,
			$this = $(thisObject);

			handleObj.pointerdown = function (event) {
				var start = $.event.special.swipe.start(event),
				stop;

				// we need to call prevent default because on IE browsers,
				// dragging anything with a mouse will start dragging the
				// element for "copy and paste" functionality
				// on other browsers, it will start selecting text
				// event.preventDefault();

				function move(event) {
					if (!start) {
						return;
					}
					
					//FIX
					event = app.pointer(event).e;

					stop = $.event.special.swipe.stop(event);

					//prevent scrolling on touch devices
					if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
						event.preventDefault();
					}
				}

				function up() {
					$this.off(touch_move, move);

					if (start && stop && $.event.special.swipe.isSweep(start, stop, true)) {
						var dir = start.coords[0] > stop.coords[0] ? 'left' : 'right';
						$.event.dispatch.call(thisObject, copyEvent(event, 'swipe', dir));
					}

					start = stop = undefined;
				}

				$this.on(touch_move, move).one(touch_end, up);

				// set a timeout to ensure we cleanup, in case the "pointerup" isn't fired
				setTimeout(function () {
					$this
					.off(touch_move, handleObj.selector, move)
					.off(touch_end, handleObj.selector, up);
				}, $.event.special.swipe.durationThreshold);
			};

			$this.on(touch_start, handleObj.selector, handleObj.pointerdown);
		},

		remove : function (handleObj) {
			$(this).off(touch_start, handleObj.selector, handleObj.pointerdown);
		}
	};
})(jQuery, touchstart, touchend, touchmove);
/*
// swipe Event (also handles swipeup, swiperight, swipedown and swipeleft):
$.event.special.swipe = {
	setup : function () {
		var thisObject = this,
		$this = $(thisObject),
		started = false,
		hasSwiped = false,
		originalCoord = {
			x : 0,
			y : 0
		},
		finalCoord = {
			x : 0,
			y : 0
		},
		startEvnt;

		// Screen touched, store the original coordinate

		function touchStart(e) {
			$this = $(e.currentTarget);
			$this.data('callee1', touchStart);
			originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
			originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
			finalCoord.x = originalCoord.x;
			finalCoord.y = originalCoord.y;
			started = true;
			var origEvent = e.originalEvent;
			// Read event data into our startEvt:
			startEvnt = {
				'position' : {
					'x' : (app.touch) ? origEvent.touches[0].screenX : e.screenX,
					'y' : (app.touch) ? origEvent.touches[0].screenY : e.screenY
				},
				'offset' : {
					'x' : (app.touch) ? origEvent.touches[0].screenX : e.screenX,
					'y' : (app.touch) ? origEvent.touches[0].screenY : e.screenY
				},
				'time' : Date.now(),
				'target' : e.target
			};
		}

		// Store coordinates as finger is swiping

		function touchMove(e) {
			$this = $(e.currentTarget);
			$this.data('callee2', touchMove);
			finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
			finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

			var swipedir;

			// We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
			var ele_x_threshold = ($this.parent().data('xthreshold')) ? $this.parent().data('xthreshold') : $this.data('xthreshold'),
			ele_y_threshold = ($this.parent().data('ythreshold')) ? $this.parent().data('ythreshold') : $this.data('ythreshold'),
			h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : 30,
			v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : 30;

			if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
				swipedir = 'swipeup';
			}
			if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
				swipedir = 'swiperight';
			}
			if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
				swipedir = 'swipedown';
			}
			if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
				swipedir = 'swipeleft';
			}
			if (swipedir != undefined && started) {
				originalCoord.x = 0;
				originalCoord.y = 0;
				finalCoord.x = 0;
				finalCoord.y = 0;
				started = false;

				// Read event data into our endEvnt:
				var origEvent = e.originalEvent;
				var endEvnt = {
					'position' : {
						'x' : (app.touch) ? origEvent.touches[0].screenX : e.screenX,
						'y' : (app.touch) ? origEvent.touches[0].screenY : e.screenY
					},
					'offset' : {
					'x' : (app.touch) ? origEvent.touches[0].screenX : e.screenX,
					'y' : (app.touch) ? origEvent.touches[0].screenY : e.screenY
					},
					'time' : Date.now(),
					'target' : e.target
				};

				// Calculate the swipe amount (normalized):
				var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
				yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

				var touchData = {
					'startEvnt' : startEvnt,
					'endEvnt' : endEvnt,
					'direction' : swipedir.replace('swipe', ''),
					'xAmount' : xAmount,
					'yAmount' : yAmount,
					'duration' : endEvnt.time - startEvnt.time
				};
				hasSwiped = true;
				//$this.trigger('swipe', touchData).trigger(swipedir, touchData);
			}
		}

		function touchEnd(e) {
			$this = $(e.currentTarget);
			var swipedir = "";
			$this.data('callee3', touchEnd);
			if (hasSwiped) {
				// We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
				var ele_x_threshold = $this.data('xthreshold'),
				ele_y_threshold = $this.data('ythreshold'),
				h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : 30,
				v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : 30;

				var origEvent = e.originalEvent;
				var endEvnt = {
					'position' : {
						'x' : (app.touch) ? origEvent.changedTouches[0].screenX : e.screenX,
						'y' : (app.touch) ? origEvent.changedTouches[0].screenY : e.screenY
					},
					'offset' : {
					'x' : (app.touch) ? origEvent.touches[0].screenX : e.screenX,
					'y' : (app.touch) ? origEvent.touches[0].screenY : e.screenY
					},
					'time' : Date.now(),
					'target' : e.target
				};

				// Read event data into our endEvnt:
				if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
					swipedir = 'swipeup';
				}
				if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
					swipedir = 'swiperight';
				}
				if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
					swipedir = 'swipedown';
				}
				if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
					swipedir = 'swipeleft';
				}

				// Calculate the swipe amount (normalized):
				var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
				yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

				var touchData = {
					'startEvnt' : startEvnt,
					'endEvnt' : endEvnt,
					'direction' : swipedir.replace('swipe', ''),
					'xAmount' : xAmount,
					'yAmount' : yAmount,
					'duration' : endEvnt.time - startEvnt.time
				};
				//$this.trigger('swipeend', touchData);
				e.type = 'swipe';
				e.direction = swipedir;
				//TRIGGER
				if(/right|left/.test(swipedir)) {
					$.event.dispatch.call(thisObject, e);
				}
			}

			started = false;
			hasSwiped = false;
		}

		$this.on(touchstart, touchStart);
		$this.on(touchmove, touchMove);
		$this.on(touchend, touchEnd);
	},

	remove : function () {
		$(this).off(touchstart, $(this).data.callee1).off(touchmove, $(this).data.callee2).off(touchend, $(this).data.callee3);
	}
};
*/
//#/////////////#//
//# TAP HANDLER #// Version: 0.3.1
//#/////////////#// https://github.com/BR0kEN-/jTap
(function ($) {
	'use strict';
	//SETUP
	$.event.special.tap = {
		setup : function () {
			var thisObject = this,
			$this = $(thisObject),
			started = false,
			origTarget = null,
			start_time,
			start_pos = {
				x : 0,
				y : 0
			};
			//START
			$this.on(touchstart, function (e) {
				if (e.which && e.which !== 1) {
					return false;
				} else {
					var startPos = app.pointer(e);
					started = true;
					start_pos.x = startPos.x;
					start_pos.y = startPos.y;
					start_time = Date.now();
					origTarget = e.target;
					return true;
				}
				//END
			}).on(touchend, function (e) {
				var endPos = app.pointer(e);
				var end_x = endPos.x;
				var end_y = endPos.y;
				var diff_x = (start_pos.x - end_x);
				var diff_y = (start_pos.y - end_y);
				// Only trigger if they've started, and the target matches:
				if (origTarget == e.target && started && ((Date.now() - start_time) < 750) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >=  - (20) && diff_x <= 20 && diff_y >=  - (20) && diff_y <= 20))) {
					e.type = 'tap';
					e.pageX = end_x;
					e.pageY = end_y;
					//TRIGGER
					$.event.dispatch.call(thisObject, e);
				}
			});
		},
		//REMOVE
		remove : function () {
			$(this).off(touchstart).off(touchend);
		}
	};
})(jQuery);
//#////////////#//
//# TAPHOLD.JS #//
//#////////////#// https://svn.stylite.de/egwdoc/phpgwapi/js/jquery/jquery-tap-and-hold/jquery.tapandhold.js.source.txt
(function ($) {
	'use strict';
	
	var TAP_AND_HOLD_TRIGGER_TIMER = 1500;
	var MAX_DISTANCE_ALLOWED_IN_TAP_AND_HOLD_EVENT = 15;

	var TOUCHSTART = touchstart;
	var TOUCHEND = touchend;
	var TOUCHMOVE = touchmove;

	var tapAndHoldTimer = null;

	var calculateEuclideanDistance = function(x1, y1, x2, y2) {
		if (!x1)	{ return; }
		var diffX = (x2 - x1);
		var diffY = (y2 - y1);
		return Math.sqrt((diffX * diffX) + (diffY * diffY));
	}

	var onTouchStart = function(event) {
		var e = app.pointer(event).e;

		// Only start detector if and only if one finger is over the widget
		if (!e.touches || (e.targetTouches.length === 1 && e.touches.length === 1)) {
			startTapAndHoldDetector.call(this, event);
			var element = $(this);
			element.bind(TOUCHMOVE, onTouchMove);
			element.bind(TOUCHEND, onTouchEnd);
		} else {
			stopTapAndHoldDetector.call(this);
		}
	}

	var onTouchMove = function(event) {
		if (tapAndHoldTimer == null) {
			return;
		}

		var e = app.pointer(event);
		var x = e.x;
		var y = e.y;
		if(!x || !y) { return; }

		var tapAndHoldPoint = $(this).data('taphold.point');
		if (!tapAndHoldPoint)	{ return; }
		if (!tapAndHoldPoint.x) { return; }
		if (!tapAndHoldPoint.y) { return; }
		var euclideanDistance = calculateEuclideanDistance(tapAndHoldPoint.x, tapAndHoldPoint.y, x, y);

		if (euclideanDistance > MAX_DISTANCE_ALLOWED_IN_TAP_AND_HOLD_EVENT) {
			stopTapAndHoldDetector.call(this);
		}
	}

	var onTouchEnd = function(event) {
		stopTapAndHoldDetector.call(this);
	}

	var onTapAndHold = function(event) {
		clear.call(this);
		$(this).data('taphold.handler').call(this, event);
	}

	var clear = function() {
		tapAndHoldTimer = null;
		$(this).unbind(TOUCHMOVE, onTouchMove);
		$(this).unbind(TOUCHEND, onTouchEnd);
	}

	var startTapAndHoldDetector = function(event) {
		if (tapAndHoldTimer != null) {
			return;
		}
		var self = this;
		tapAndHoldTimer = setTimeout(function () {
				onTapAndHold.call(self, event);
			}, TAP_AND_HOLD_TRIGGER_TIMER);

		// Stores tap x & y
		var e = app.pointer(event);
		var tapAndHoldPoint = {};
		if(!e.x || !e.y) { return; }
		tapAndHoldPoint.x = e.x;
		tapAndHoldPoint.y = e.y;
		$(this).data('taphold.point', tapAndHoldPoint);
	}

	var stopTapAndHoldDetector = function() {
		clearTimeout(tapAndHoldTimer);
		clear.call(this);
	}

	$.event.special.hold = {
		setup : function () {},

		add : function (handleObj) {
			$(this).data('taphold.handler', handleObj.handler);
			if (handleObj.data) {
				$(this).bind(TOUCHSTART, handleObj.data, onTouchStart);
			} else {
				$(this).bind(TOUCHSTART, onTouchStart);
			}
		},

		remove : function (handleObj) {
			stopTapAndHoldDetector.call(this);
			if (handleObj.data) {
				$(this).unbind(TOUCHSTART, handleObj.data, onTouchStart);
			} else {
				$(this).unbind(TOUCHSTART, onTouchStart);
			}
		},

		teardown : function () {}
	};
})(jQuery);
/*jshint ignore:start*/
//#//////////////////////////////#//
//# FIREFOX: DETECT PRIVATE MODE #//
//#//////////////////////////////#//
if (vendorClass == 'moz' && app.device.desktop) {
	function retry(isDone,next){var current_trial=0,max_retry=50,interval=10,is_timeout=false;var id=window.setInterval(function(){if(isDone()){window.clearInterval(id);next(is_timeout)}if(current_trial++>max_retry){window.clearInterval(id);is_timeout=true;next(is_timeout)}},10)}function isIE10OrLater(user_agent){var ua=user_agent.toLowerCase();if(ua.indexOf('msie')===0&&ua.indexOf('trident')===0){return false}var match=/(?:msie|rv:)\s?([\d\.]+)/.exec(ua);if(match&&parseInt(match[1],10)>=10){return true}return false}function detectPrivateMode(callback){var is_private;if(window.webkitRequestFileSystem){window.webkitRequestFileSystem(window.TEMPORARY,1,function(){is_private=false},function(e){console.log(e);is_private=true})}else if(window.indexedDB&&/Firefox/.test(window.navigator.userAgent)){var db;try{db=window.indexedDB.open('test')}catch(e){is_private=true}if(typeof is_private==='undefined'){retry(function isDone(){return db.readyState==='done'?true:false},
	function next(is_timeout){if(!is_timeout){is_private=db.result?false:true}})}}else if(isIE10OrLater(window.navigator.userAgent)){is_private=false;try{if(!window.indexedDB){is_private=true}}catch(e){is_private=true}}else if(window.localStorage&&/Safari/.test(window.navigator.userAgent)){try{localStorage.setItem('test',1)}catch(e){is_private=true}if(typeof is_private==='undefined'){is_private=false;localStorage.removeItem('test')}}retry(function isDone(){return typeof is_private!=='undefined'?true:false},function next(is_timeout){callback(is_private)})}
}
//#////////#//
//# OPENFB #//
//#////////#//
if(typeof openFB === 'undefined') { var openFB; }
openFB=function(){function e(e){if(!e.appId)throw"appId parameter not set in init()";u=e.appId,e.tokenStore&&(k=e.tokenStore),e.accessToken&&(k.fbAccessToken=e.accessToken),f=e.loginURL||f,h=e.logoutURL||h,v=e.oauthRedirectURL||v,w=e.cordovaOAuthRedirectURL||w,g=e.logoutRedirectURL||g}function o(e){var o=k.fbAccessToken,t={};o?(t.status="connected",t.authResponse={accessToken:o}):t.status="unknown",e&&e(t)}function t(e,o){function t(e){var o=e.url;if(o.indexOf("access_token=")>0||o.indexOf("error=")>0){var t=600-((new Date).getTime()-a);setTimeout(function(){c.close()},t>0?t:0),n(o)}}function s(){console.log("exit and remove listeners"),p&&!l&&p({status:"user_cancelled"}),c.removeEventListener("loadstop",t),c.removeEventListener("exit",s),c=null,console.log("done removing listeners")}var c,a,r="",i=d?w:v;return u?(o&&o.scope&&(r=o.scope),p=e,l=!1,a=(new Date).getTime(),c=window.open(f+"?client_id="+u+"&redirect_uri="+i+"&response_type=token&scope="+r,"_blank","location=no,clearcache=yes"),void(d&&(c.addEventListener("loadstart",t),c.addEventListener("exit",s)))):e({status:"unknown",error:"Facebook App Id not set."})}function n(e){var o,t;l=!0,e.indexOf("access_token=")>0?(o=e.substr(e.indexOf("#")+1),t=r(o),k.fbAccessToken=t.access_token,p&&p({status:"connected",authResponse:{accessToken:t.access_token}})):e.indexOf("error=")>0?(o=e.substring(e.indexOf("?")+1,e.indexOf("#")),t=r(o),p&&p({status:"not_authorized",error:t.error})):p&&p({status:"not_authorized"})}function s(e){var o,t=k.fbAccessToken;k.removeItem("fbAccessToken"),t&&(o=window.open(h+"?access_token="+t+"&next="+g,"_blank","location=no,clearcache=yes"),d&&setTimeout(function(){o.close()},700)),e&&e()}function c(e){var o,t=e.method||"GET",n=e.params||{},s=new XMLHttpRequest;n.access_token=k.fbAccessToken,o="https://graph.facebook.com"+e.path+"?"+i(n),s.onreadystatechange=function(){if(4===s.readyState)if(200===s.status)e.success&&e.success(JSON.parse(s.responseText));else{var o=s.responseText?JSON.parse(s.responseText).error:{message:"An error has occurred"};e.error&&e.error(o)}},s.open(t,o,!0),s.send()}function a(e,o){return c({method:"DELETE",path:"/me/permissions",success:function(){e()},error:o})}function r(e){var o=decodeURIComponent(e),t={},n=o.split("&");return n.forEach(function(e){var o=e.split("=");t[o[0]]=o[1]}),t}function i(e){var o=[];for(var t in e)e.hasOwnProperty(t)&&o.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return o.join("&")}var u,p,d,l,f="https://www.facebook.com/dialog/oauth",h="https://www.facebook.com/logout.php",k=window.sessionStorage,m=window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")),v=(location.protocol+"//"+location.hostname+(location.port?":"+location.port:"")+m,app.https+"chronoburn.com/oauthcallback.html"),w="https://www.facebook.com/connect/login_success.html",g=app.https+"chronoburn.com/logoutcallback.html";return document.addEventListener("deviceready",function(){d=!0},!1),{init:e,login:t,logout:s,revokePermissions:a,api:c,oauthCallback:n,getLoginStatus:o}}();
//#/////#//
//# MD5 #//
//#/////#//
!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;try{b=window}catch(a){b=self}b.SparkMD5=a()}}(function(a){"use strict";function d(a,c,d,e,f,g){return c=b(b(c,a),b(e,g)),b(c<<f|c>>>32-f,d)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){var d=a[0],i=a[1],j=a[2],k=a[3];d=e(d,i,j,k,c[0],7,-680876936),k=e(k,d,i,j,c[1],12,-389564586),j=e(j,k,d,i,c[2],17,606105819),i=e(i,j,k,d,c[3],22,-1044525330),d=e(d,i,j,k,c[4],7,-176418897),k=e(k,d,i,j,c[5],12,1200080426),j=e(j,k,d,i,c[6],17,-1473231341),i=e(i,j,k,d,c[7],22,-45705983),d=e(d,i,j,k,c[8],7,1770035416),k=e(k,d,i,j,c[9],12,-1958414417),j=e(j,k,d,i,c[10],17,-42063),i=e(i,j,k,d,c[11],22,-1990404162),d=e(d,i,j,k,c[12],7,1804603682),k=e(k,d,i,j,c[13],12,-40341101),j=e(j,k,d,i,c[14],17,-1502002290),i=e(i,j,k,d,c[15],22,1236535329),d=f(d,i,j,k,c[1],5,-165796510),k=f(k,d,i,j,c[6],9,-1069501632),j=f(j,k,d,i,c[11],14,643717713),i=f(i,j,k,d,c[0],20,-373897302),d=f(d,i,j,k,c[5],5,-701558691),k=f(k,d,i,j,c[10],9,38016083),j=f(j,k,d,i,c[15],14,-660478335),i=f(i,j,k,d,c[4],20,-405537848),d=f(d,i,j,k,c[9],5,568446438),k=f(k,d,i,j,c[14],9,-1019803690),j=f(j,k,d,i,c[3],14,-187363961),i=f(i,j,k,d,c[8],20,1163531501),d=f(d,i,j,k,c[13],5,-1444681467),k=f(k,d,i,j,c[2],9,-51403784),j=f(j,k,d,i,c[7],14,1735328473),i=f(i,j,k,d,c[12],20,-1926607734),d=g(d,i,j,k,c[5],4,-378558),k=g(k,d,i,j,c[8],11,-2022574463),j=g(j,k,d,i,c[11],16,1839030562),i=g(i,j,k,d,c[14],23,-35309556),d=g(d,i,j,k,c[1],4,-1530992060),k=g(k,d,i,j,c[4],11,1272893353),j=g(j,k,d,i,c[7],16,-155497632),i=g(i,j,k,d,c[10],23,-1094730640),d=g(d,i,j,k,c[13],4,681279174),k=g(k,d,i,j,c[0],11,-358537222),j=g(j,k,d,i,c[3],16,-722521979),i=g(i,j,k,d,c[6],23,76029189),d=g(d,i,j,k,c[9],4,-640364487),k=g(k,d,i,j,c[12],11,-421815835),j=g(j,k,d,i,c[15],16,530742520),i=g(i,j,k,d,c[2],23,-995338651),d=h(d,i,j,k,c[0],6,-198630844),k=h(k,d,i,j,c[7],10,1126891415),j=h(j,k,d,i,c[14],15,-1416354905),i=h(i,j,k,d,c[5],21,-57434055),d=h(d,i,j,k,c[12],6,1700485571),k=h(k,d,i,j,c[3],10,-1894986606),j=h(j,k,d,i,c[10],15,-1051523),i=h(i,j,k,d,c[1],21,-2054922799),d=h(d,i,j,k,c[8],6,1873313359),k=h(k,d,i,j,c[15],10,-30611744),j=h(j,k,d,i,c[6],15,-1560198380),i=h(i,j,k,d,c[13],21,1309151649),d=h(d,i,j,k,c[4],6,-145523070),k=h(k,d,i,j,c[11],10,-1120210379),j=h(j,k,d,i,c[2],15,718787259),i=h(i,j,k,d,c[9],21,-343485551),a[0]=b(d,a[0]),a[1]=b(i,a[1]),a[2]=b(j,a[2]),a[3]=b(k,a[3])}function j(a){var c,b=[];for(c=0;c<64;c+=4)b[c>>2]=a.charCodeAt(c)+(a.charCodeAt(c+1)<<8)+(a.charCodeAt(c+2)<<16)+(a.charCodeAt(c+3)<<24);return b}function k(a){var c,b=[];for(c=0;c<64;c+=4)b[c>>2]=a[c]+(a[c+1]<<8)+(a[c+2]<<16)+(a[c+3]<<24);return b}function l(a){var d,e,f,g,h,k,b=a.length,c=[1732584193,-271733879,-1732584194,271733878];for(d=64;d<=b;d+=64)i(c,j(a.substring(d-64,d)));for(a=a.substring(d-64),e=a.length,f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],d=0;d<e;d+=1)f[d>>2]|=a.charCodeAt(d)<<(d%4<<3);if(f[d>>2]|=128<<(d%4<<3),d>55)for(i(c,f),d=0;d<16;d+=1)f[d]=0;return g=8*b,g=g.toString(16).match(/(.*?)(.{0,8})$/),h=parseInt(g[2],16),k=parseInt(g[1],16)||0,f[14]=h,f[15]=k,i(c,f),c}function m(a){var d,e,f,g,h,j,b=a.length,c=[1732584193,-271733879,-1732584194,271733878];for(d=64;d<=b;d+=64)i(c,k(a.subarray(d-64,d)));for(a=d-64<b?a.subarray(d-64):new Uint8Array(0),e=a.length,f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],d=0;d<e;d+=1)f[d>>2]|=a[d]<<(d%4<<3);if(f[d>>2]|=128<<(d%4<<3),d>55)for(i(c,f),d=0;d<16;d+=1)f[d]=0;return g=8*b,g=g.toString(16).match(/(.*?)(.{0,8})$/),h=parseInt(g[2],16),j=parseInt(g[1],16)||0,f[14]=h,f[15]=j,i(c,f),c}function n(a){var d,b="";for(d=0;d<4;d+=1)b+=c[a>>8*d+4&15]+c[a>>8*d&15];return b}function o(a){var b;for(b=0;b<a.length;b+=1)a[b]=n(a[b]);return a.join("")}function p(a){return/[\u0080-\uFFFF]/.test(a)&&(a=unescape(encodeURIComponent(a))),a}function q(a,b){var f,c=a.length,d=new ArrayBuffer(c),e=new Uint8Array(d);for(f=0;f<c;f+=1)e[f]=a.charCodeAt(f);return b?e:d}function r(a){return String.fromCharCode.apply(null,new Uint8Array(a))}function s(a,b,c){var d=new Uint8Array(a.byteLength+b.byteLength);return d.set(new Uint8Array(a)),d.set(new Uint8Array(b),a.byteLength),c?d:d.buffer}function t(a){var d,b=[],c=a.length;for(d=0;d<c-1;d+=2)b.push(parseInt(a.substr(d,2),16));return String.fromCharCode.apply(String,b)}function u(){this.reset()}var b=function(a,b){return a+b&4294967295},c=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];return"5d41402abc4b2a76b9719d911017c592"!==o(l("hello"))&&(b=function(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}),"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||!function(){function b(a,b){return a=0|a||0,a<0?Math.max(a+b,0):Math.min(a,b)}ArrayBuffer.prototype.slice=function(c,d){var h,i,j,k,e=this.byteLength,f=b(c,e),g=e;return d!==a&&(g=b(d,e)),f>g?new ArrayBuffer(0):(h=g-f,i=new ArrayBuffer(h),j=new Uint8Array(i),k=new Uint8Array(this,f,h),j.set(k),i)}}(),u.prototype.append=function(a){return this.appendBinary(p(a)),this},u.prototype.appendBinary=function(a){this._buff+=a,this._length+=a.length;var c,b=this._buff.length;for(c=64;c<=b;c+=64)i(this._hash,j(this._buff.substring(c-64,c)));return this._buff=this._buff.substring(c-64),this},u.prototype.end=function(a){var d,f,b=this._buff,c=b.length,e=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(d=0;d<c;d+=1)e[d>>2]|=b.charCodeAt(d)<<(d%4<<3);return this._finish(e,c),f=o(this._hash),a&&(f=t(f)),this.reset(),f},u.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},u.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash}},u.prototype.setState=function(a){return this._buff=a.buff,this._length=a.length,this._hash=a.hash,this},u.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},u.prototype._finish=function(a,b){var d,e,f,c=b;if(a[c>>2]|=128<<(c%4<<3),c>55)for(i(this._hash,a),c=0;c<16;c+=1)a[c]=0;d=8*this._length,d=d.toString(16).match(/(.*?)(.{0,8})$/),e=parseInt(d[2],16),f=parseInt(d[1],16)||0,a[14]=e,a[15]=f,i(this._hash,a)},u.hash=function(a,b){return u.hashBinary(p(a),b)},u.hashBinary=function(a,b){var c=l(a),d=o(c);return b?t(d):d},u.ArrayBuffer=function(){this.reset()},u.ArrayBuffer.prototype.append=function(a){var d,b=s(this._buff.buffer,a,!0),c=b.length;for(this._length+=a.byteLength,d=64;d<=c;d+=64)i(this._hash,k(b.subarray(d-64,d)));return this._buff=d-64<c?new Uint8Array(b.buffer.slice(d-64)):new Uint8Array(0),this},u.ArrayBuffer.prototype.end=function(a){var e,f,b=this._buff,c=b.length,d=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<c;e+=1)d[e>>2]|=b[e]<<(e%4<<3);return this._finish(d,c),f=o(this._hash),a&&(f=t(f)),this.reset(),f},u.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},u.ArrayBuffer.prototype.getState=function(){var a=u.prototype.getState.call(this);return a.buff=r(a.buff),a},u.ArrayBuffer.prototype.setState=function(a){return a.buff=q(a.buff,!0),u.prototype.setState.call(this,a)},u.ArrayBuffer.prototype.destroy=u.prototype.destroy,u.ArrayBuffer.prototype._finish=u.prototype._finish,u.ArrayBuffer.hash=function(a,b){var c=m(new Uint8Array(a)),d=o(c);return b?t(d):d},u});
var md5 = function(str) { 'use strict'; if(str) { return SparkMD5.hash(str); }};
//#/////#//
//# MD5 #//
//#/////#//
var md4 = function (str) {
	'use strict';
	var hash = 0;
	var char;
	if (str.length == 0) {
		return hash;
	}
	for (var i=0; i<str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
};
/*jshint ignore:end*/
////////////////
///////////////
//////////////
/////////////
////////////
///////////
//////////
/////////
////////
///////
//////
/////
////
///
//
 
