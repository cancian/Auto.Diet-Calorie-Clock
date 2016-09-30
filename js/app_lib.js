//##////////////##//
//## APP_LIB.JS ##//
//##////////////##//
var isMobile = 'isCurrentCacheValid';
/*////////////
// SET USER //
//////////////
var appUser = ('mud_default###default').split('###');
if(!localStorage.getItem('app_current_user')) {
	localStorage.setItem('app_current_user','mud_default###default###' + new Date().getTime());
} else {
	appUser = localStorage.getItem('app_current_user').split('###');
}*/
//#////////////#//
//# APP OBJECT #//
//#////////////#//
if(typeof app === 'undefined') { var app = {}; }
var appRows = { entry: [], food: [] };
app.ua      = navigator.userAgent;
app = {
	width: function() { return parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth  || 0)); },
	height: function() { return parseInt(Math.max(document.documentElement.clientHeight, window.innerHeight || 0)); },
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
	//user: localStorage.getItem('app_current_user').split('###'),
	dev: localStorage.getItem('config_debug') === 'active' ? true : false,
	beenDev: localStorage.getItem('config_debug') === 'active' || localStorage.getItem('been_dev') ? true : false,
	pointer : function (e) {
		//FIX
		e = $.event.fix(e);
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
		//TOUCH EVENT
		if (/touch/i.test(e.type) && e.originalEvent) {
			if(e.originalEvent.touches || e.originalEvent.changedTouches) {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				out.x = parseInt(touch.pageX);
				out.y = parseInt(touch.pageY);
				return out;
			}
		}
		//REGULAR EVENT
		out.x = parseInt(e.pageX);
		out.y = parseInt(e.pageY);
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
		if($(targetId).length) {
			return true;
		} else {
			return false;
		}
	},
	ua:   navigator.userAgent,
	http: /http/i.test(window.location.protocol) ? true : false,
	https: /http:/i.test(window.location.protocol) || (localStorage.getItem('config_debug') == 'active' && !/http/i.test(window.location.protocol)) ? 'http://' : 'https://',
	now: function() {
		return new Date().getTime();
	},
	define: function(key,value) {
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
		if(!localStorage.getItem(key)) {
			localStorage.setItem(key,value);
			return false;
		}
		return true;
	},
	returner: function(func,rows) {
		if(typeof func === 'function') {
			if(rows == null) {
				rows = [];
			}
			func(rows);
		}
	},
	read: function(key,value,type) {
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
		if(type == 'object') {
			if(!localStorage.getItem(key)) {
				return [];
			}
			var keyValue = localStorage.getItem(key);
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
			if(localStorage.getItem(key) == value) {
				return true;
			} else {
				return false;
			}
		}
		if(!localStorage.getItem(key)) {
			return false;
		} else {
			if(isNaN(Number(localStorage.getItem(key)))) {
				return localStorage.getItem(key);
			} else {
				return Number(localStorage.getItem(key));
			}
		}
	},
	save: function(key,value,type) {
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
		if(localStorage.getItem(key) != value) {
			if(type == 'object') {
				//OBJECT
				localStorage.setItem(key,JSON.stringify(value));
			} else {
				//STRING
				localStorage.setItem(key,value);
			}
		}
	},
	remove: function(key) {
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
		if(localStorage.getItem(key)) {
			localStorage.removeItem(key);
		}
	},
	clear : function () {
		app.define('config_install_time', app.now());
		var keys = Object.keys(localStorage);
		for (var i = 0; i < keys.length; i++) {
			//cached keys
			if (!/app_build|app_autoupdate_hash|remoteSuperBlockCSS|remoteSuperBlockJS/i.test(keys[i]) || localStorage.getItem('config_autoupdate') !== 'on') {
				//protected keys
				if(!/ga_storage|autoupdate|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots|app_installed/i.test(keys[i])) {
					//MULTIUSER
					/*
					//remove current user settings
					if (keys[i].contains(app.user[0])) {
						localStorage.removeItem(keys[i]);
					}
					//remove default user settings
					if(app.user.id === 'mud_default' && !keys[i].contains(app.user.id)) {
						localStorage.removeItem(keys[i]);
					}
					*/
					localStorage.removeItem(keys[i]);
				}
			}
		}
	},
	show: function(target,callback) {
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
		clearTimeout(app.timers[gid]);
		if(time == 'clear') { return; }
		app.timers[gid] = setTimeout(function() {
			if(typeof callback === 'function') {
				callback();
			}
		}, time);
	},
	suspend: function(target,time,callback) {
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
		start : function(str)     { if(!str) { str = 'generic'; }; app.globals[str] = app.now(); },
		end   : function(str,txt) { if(!str) { str = 'generic'; }; if(txt) { txt = txt + ': '; } else { txt = 'total: '; }; app.toast(txt + (Number((app.now() - app.globals[str]))) + ' ms', 'timer_' + (JSON.stringify(app.globals[str]))); }
	}
};
/////////////////
// SWITCH USER //
/////////////////
app.switchUser = function(switchTo) {
	if(switchTo) {
		if(searchalize(switchTo).length == 0) { return; }
		//
		var usrMatch    = '_' + searchalize(switchTo) + '###';
		var newUserLine = 'mui_' + searchalize(switchTo) + '###' + switchTo + '###' + app.now() + '\r\n';
		//default
		if(switchTo == 'mud_default') {
				localStorage.removeItem('app_current_user');
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
	linux      : (/X11|Linux|Ubuntu/i).test(navigator.userAgent) && !(/Android/i).test(navigator.userAgent) ? true : false,
	msapp      : (/MSApp/i).test(app.ua) ? true : false,
	wp8        : (/IEMobile/i).test(app.ua) && !(/MSApp/i).test(app.ua) ? true : false,
	wp81       : (/Mobile/i).test(app.ua) && (/MSApp/i).test(app.ua)  ? true : false,
	wp10       : (/MSAppHost\/3.0/i).test(app.ua) && (/Windows Phone 10/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IE__Mobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows10  : (/MSAppHost\/3.0/i).test(app.ua) ? true : false,
	firefoxos  : (/firefox/i).test(app.ua) && (/mobile|tablet/i).test(app.ua) && (/gecko/i).test(app.ua) ? true : false,
	osx        : (/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,
	chrome     : (/chrome/i.test(app.ua) && /windows|macintosh|linux/i.test(app.ua) && !/mobile/i.test(app.ua) && !/nexus/i.test(app.ua)) ? true : false,
	chromeos   : (app.get.isChromeApp()) ? true : false,
	blackberry : (/BB10|BlackBerry|All Touch/i).test(app.ua) && !/(PlayBook)/i.test(app.ua) ? true : false,
	playbook   : (/PlayBook|Tablet OS/i).test(app.ua) ? true : false,
	amazon     : (/Amazon|FireOS/i).test(app.ua) ? true : false,
	desktop    : ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|PlayBook|IEMobile|Opera Mini|Tablet|Mobile|Touch/i.test(app.ua) || (document.createTouch)) && !/X11|Windows NT/i.test(app.ua)) ? false : true
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
	     if(app.device.ios && app.http)		{ return 'web';              }
	else if(app.device.android && app.http)	{ return 'web';              }
	else if(app.device.wp8 && app.http)		{ return 'web';              }
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
if(app.device.blackberry || app.device.playbook || app.device.android2) {
	app.https = 'http://';
	https = app.https;	
}
//#///////////////////#//
//# APP.IS.SCROLLABLE #//
//#///////////////////#//
app.is.scrollable = false;
if($.nicescroll && !app.device.msapp && vendorClass != 'msie') {
	if(app.device.desktop && !app.device.msapp)			{ app.is.scrollable = true; }
	if(app.device.linux)								{ app.is.scrollable = true; }
	if(app.device.android && app.device.android < 5)	{ app.is.scrollable = true; }
}
//////////////////
// APP.REBOOT() //
//////////////////
app.reboot = function(type,error) {
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
var jq = $([1]);
$.fn.each = function (fn) {
	var i = -1;
	while ((jq.context = jq[0] = this[++i]) && fn.call(jq[0], i, jq) !== false) {}
	//chainability.
	return this;
};
///////////
// HTML2 //
///////////
$.prototype.html2 = function (data, callback) {
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
	if(!msg)		{ msg = ''; }
	if(!tag)		{ tag = 'appToast' + JSON.stringify(app.now()); }
	////////////
	// INSERT //
	////////////
	$('body').append2('<div id="appToast" class="' + tag + '">' + msg + '</div>');
	//DISMISS
	setTimeout(function() {
		$('.' + tag).on(tap, function () {
			app.handlers.fade(0, '.' + tag, '', 300);
		});
		setTimeout(function() { 
			app.handlers.fade(0, '.' + tag, '', 300);
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
	if($('#skipIntro').length)	   { return; }
	if($(document).height() < 350) { return; }
	if(app.globals.blockInfo == 1) { return; }
	if (app.read('info_' + title)) { // && !app.dev) {
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
	var script   = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};
/////////
// URL //
/////////
var ref;
app.url = function(url) {
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
		amazon:     'https://www.amazon.com/dp/B00NDSQIHK/qid=1411265533'
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
		else 													{ window.open(url, '_blank'); }
	}
};
//////////////
// APP INFO //
//////////////
var userAgent           = navigator.userAgent;
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
var hasSql              = (window.openDatabase && localStorage.getItem('config_nodb') !== 'active') ? true : false;
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
var rebuildHistory;
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
		var t = searchalize(target);
		var isButton = style == 'button' ? 1 : 40;
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
			if($(this).hasClass(style) && app.handlers.activeRowBlock[t] == 0) {
				if (typeof callback === 'function') {
					//app.handlers.activeRowBlock[t] = 1;
					//
					callback($(this).attr('id'), evt);
					$(this).addClass(style);
					app.handlers.activeLastObj[t] = this;
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
				var falseThis = this;
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
				if(!$(this).hasClass(style)) {
					$(app.handlers.activeLastObj[t]).removeClass(style);
				}
				var localTarget = this;
				app.handlers.activeRowTouches[t] = 0;
				app.timeout(t,isButton,function (evt) {
					if (app.handlers.activeRowTouches[t] == 0 && app.handlers.activeRowBlock[t] == 0) {
						$(localTarget).addClass(style);
						app.handlers.activeLastObj[t] = localTarget;
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
		}, 300);
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
		var TouchLimit = app.device.android ? 5 : 10;
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
			}, 65);
		});
	},
	///////////////////
	// HIGHLIGHT ROW //
	///////////////////
	highlight: function(target,callback) {
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
		//////////////////
		// TOTAL WEIGHT //
		//////////////////
		var totalWeight = app.get.totalweight();
		////////////////
		// LOOP ARRAY //
		////////////////
		var rowHtml = '';
		var rowSql  = '';
		var i = data.length;
		while(i--) {
			/////////////////////
			// FILTER REPEATED //
			/////////////////////
			if (data[i].id && !rowHtml.contains(data[i].id)) {
				data[i].id = Number(data[i].id);
				var favClass = (data[i].fib === 'fav') ? ' favItem' : '';
				if((JSON.stringify(data[i].id)).length >= 13) {
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
				if(!data[i].pro)  { data[i].pro  = 0; }
				if(!data[i].car)  { data[i].car  = 0; }
				if(!data[i].fat)  { data[i].fat  = 0; }
				if(!data[i].fii)  { data[i].fii  = 0; }
				if(!data[i].sug)  { data[i].sug  = 0; }
				if(!data[i].sod)  { data[i].sod  = 0; }
				data[i].pro  = Math.round(data[i].pro  * 100) / 100;
				data[i].car  = Math.round(data[i].car  * 100) / 100;
				data[i].fat  = Math.round(data[i].fat  * 100) / 100;
				data[i].fii  = Math.round(data[i].fii  * 100) / 100;
				data[i].sug  = Math.round(data[i].sug  * 100) / 100;
				data[i].sod  = Math.round(data[i].sod  * 100) / 100;

				data[i].fib  = (data[i].fib).split('diary_food').join('');
				//////////////
				// ROW HTML //
				//////////////
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
					if(!rowSql.contains(data[i].id)) {
						rowSql += "INSERT OR REPLACE INTO \"diary_food\" VALUES(#^#" + Number(data[i].id) + "#^#,'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + Number(data[i].kcal) + "','" + Number(data[i].pro) + "','" + Number(data[i].car) + "','" + Number(data[i].fat) + "','" + data[i].fib + "','" + Number(data[i].fii) + "','" + Number(data[i].sug) + "','" + Number(data[i].sod) + "');\n";					}
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
	if(!minValue) { minValue = 0;    }
	if(!maxValue) { maxValue = 9999; }
	//HTML
	if(!$( target + 'Neg').html()) {
		$(target).before2('<p class="neg" id="' + target.replace('#','') + 'Neg"></p><p class="pos" id="' + target.replace('#','') + 'Pos"></p>');
	}
	//NEG
	app.handlers.repeater(target + 'Neg','active',400,25,function() {
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue >= minValue + 1) {
			inputValue = inputValue - 1;
		} else {
			inputValue = 0;
		}
		$(target).val(decimalize(inputValue,-1));
	});
	//POS
	app.handlers.repeater(target + 'Pos','active',400,25,function() {
		if($(target).val() == '') {
			$(target).val(0);
		}
		var inputValue = valueType == 'int' ? parseInt($(target).val()) : parseFloat($(target).val());
		if(inputValue <= maxValue - 1) {
			inputValue = inputValue + 1;
		}
		$(target).val( decimalize(inputValue,-1) );
	});
};
/////////////
// APP GET //
/////////////
////////////////
// SCREENSHOT //
////////////////
app.screenshot = function() {
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
	return isItDesktop;
}
//#//////////////////#//
//# DOMContentLoaded #//
//#//////////////////#//
document.addEventListener("DOMContentLoaded", function() {
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
//AUTOEXEC
(function() {
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
				app.analytics('spectrum');
			}
		});
	} else {
		app.updateColorPicker();
	}
})();
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
app.touch = 'ontouchstart' in window && !app.device.chrome ? true : false;
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
	if(prefix === 1) {
		touchstart  = 'MSPointerDown';
		touchend    = 'MSPointerUp';
		touchmove   = 'MSPointerMove';
		touchcancel = 'MSPointerCancel';
		touchleave  = 'MSPointerLeave';
		touchout    = 'MSPointerOut';
		app.save('config_autoupdate','off');
	} else {
		touchstart  = 'pointerdown';
		touchend    = 'pointerup';
		touchmove   = 'pointermove';
		touchcancel = 'pointercancel';
		touchleave  = 'pointerleave';
		touchout    = 'pointerout';
	}
}
//SETPOINTER
if (window.PointerEvent || window.MSPointerEvent) {
	if(app.device.wp8 && !app.device.wp10 && !app.device.desktop) {
		//WP81 ON WP81 && WP10
		msPointerSet(1);
	} else {
		//NO PREFIX
		msPointerSet(0);
	}
}
//OVERRIDE TAP
if (app.device.msapp) {
	tap = 'click';
}
///////////////
// SAFE EXEC //
///////////////
app.safeExec = function (callback) {
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
		app.save('error_log_handled','handled log: ' + error)
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
			if (number[1].length > 2) {
				$(this).val( parseFloat(number[0] + '.' + number[1].slice(0,2)) );
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
app.fixSql = function(fetchEntries) {
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
//////////
// TRIM //
//////////
function trim(str) {
	if(!str.length) { return ''; }
	str = str.replace(/^\s+/, '');
	str = str.replace(/(^[ \t]*\n)/gm, "");
		for(var i = str.length - 1; i >= 0; i--) {
			if(/\S/i.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
function trimDot(str) {
	if(!str.length) { return ''; }
	return str.replace(/\.$/, '').replace(/\,$/, '');
}
function trimSpace(str) {
	if(!str.length) { return ''; }
	return str.replace(/\s\s+/g, ' ');
}
function trimSpaceAll(str) {
	if(!str.length) { return ''; }
	return str.replace(/  +/g, ' ');
}
///////////////
// ISEMPTY() //
///////////////
function isEmpty(val){
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
	].join('')
	var l = 0
		var i = 0
		str += ''
		if (charlist) {
			whitespace = (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '$1')
		}
		l = str.length
		for (i = 0; i < l; i++) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(i)
					break
			}
		}
		l = str.length
		for (i = l - 1; i >= 0; i--) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(0, i + 1)
					break
			}
		}
		return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}
///////////////
// HIGHLIGHT //
///////////////
app.highlight = function (target, duration, startColor, endColor, callback, forceWait) {
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
	return this.charAt(0).toUpperCase() + this.slice(1);
};
///////////
// isOdd //
///////////
function isOdd(val) {
	return val % Math.round(2);
}
////////////////
// DECIMALIZE //
////////////////
function decimalize(val,p) {
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
var latin_map = {'á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','å':'a','ǻ':'a','ḁ':'a','ã':'a','æ':'ae','ǽ':'ae','ǣ':'ae','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ƃ':'b','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ċ':'c','ƈ':'c','ď':'d','ḑ':'d','ḓ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ḏ':'d','ǲ':'d','ǅ':'d','đ':'d','ƌ':'d','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ę':'e','ẽ':'e','ḛ':'e','ḟ':'f','ƒ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ǥ':'g','ḫ':'h','ḩ':'h','ĥ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ħ':'h','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','İ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ɨ':'i','ĩ':'i','ḭ':'i','ĵ':'j','ḱ':'k','ǩ':'k','ķ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ĺ':'l','ľ':'l','ļ':'l','ḽ':'l','ḷ':'l','ḹ':'l','ḻ':'l','ŀ':'l','ǈ':'l','ł':'l','ǉ':'lj','ḿ':'m','ṁ':'m','ṃ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ṅ':'n','ṇ':'n','ɲ':'n','ṉ':'n','ǋ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ō':'o','ṓ':'o','ṑ':'o','ɵ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ƣ':'oi','ɛ':'e','ɔ':'o','ṕ':'p','ṗ':'p','ƥ':'p','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ȓ':'r','ṟ':'r','ǝ':'e','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ṡ':'s','ṣ':'s','ṩ':'s','ť':'t','ţ':'t','ṱ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ʈ':'t','ŧ':'t','ɯ':'m','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ṿ':'v','ʋ':'v','ṽ':'v','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ẍ':'x','ẋ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ż':'z','ẓ':'z','ẕ':'z','ƶ':'z','ĳ':'ij','œ':'oe','ʙ':'b','ɢ':'g','ʛ':'g','ʜ':'h','ɪ':'i','ʁ':'r','ʟ':'l','ɴ':'n','ɶ':'oe','ʀ':'r','ʏ':'y','ẚ':'a','ƀ':'b','ɕ':'c','ɖ':'d','ı':'i','ɟ':'j','ʄ':'j','ɦ':'h','ẖ':'h','ƕ':'hv','ǰ':'j','ʝ':'j','ƚ':'l','ɬ':'l','ɫ':'l','ɭ':'l','ſ':'s','ẛ':'s','ɱ':'m','ƞ':'n','ɳ':'n','ʠ':'q','ɾ':'r','ɼ':'r','ɽ':'r','ɘ':'e','ɿ':'r','ʂ':'s','ɡ':'g','ẗ':'t','ƫ':'t','ɐ':'a','ɥ':'h','ʞ':'k','ɰ':'m','ɹ':'r','ɻ':'r','ɺ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ẘ':'w','ẙ':'y','ʑ':'z','ʐ':'z','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ﬆ':'st'};
String.prototype.latinize=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(char){'use strict';return latin_map[char]||char})};
/////////////////
// SEARCHALIZE //
/////////////////
function searchalize(str) {
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
	str = str.split("'").join('');
	str = str.split('‘').join('');
	str = str.split("’").join('');
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
////////////////
// ARRAY FIND //
////////////////
if (!Array.prototype.find) {
	Array.prototype.find = function (predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}
/////////////////////
// ARRAY FINDINDEX //
/////////////////////
if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function (predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return i;
			}
		}
		return -1;
	};
}
//////////////////
// ARRAY FILTER //
//////////////////
if (!Array.prototype.filter) {
	Array.prototype.filter = function (fun) {
		'use strict';
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}
		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				var val = t[i];
				if (fun.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}
///////////////
// ARRAY MAP //
///////////////
if (!Array.prototype.map) {
	Array.prototype.map = function (callback, thisArg) {
		var T,A,k;
		if (this == null) {
			throw new TypeError(' this is null or not defined');
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}
		if (arguments.length > 1) {
			T = thisArg;
		}
		A = new Array(len);
		k = 0;
		while (k < len) {
			var kValue,
			mappedValue;
			if (k in O) {
				kValue = O[k];
				mappedValue = callback.call(T, kValue, k, O);
				A[k] = mappedValue;
			}
			k++;
		}
		return A;
	};
}
//////////////////////
// INCLUDES (ARRAY) //
//////////////////////
if (!Array.prototype.includes) {
	Array.prototype.includes = function (searchElement /*, fromIndex*/
	) {
		'use strict';
		var O = Object(this);
		var len = parseInt(O.length, 10) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1], 10) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {
				k = 0;
			}
		}
		var currentElement;
		var searchIsNaN = isNaN(searchElement);
		while (k < len) {
			currentElement = O[k];
			// SameValueZero algorithm has to treat NaN as equal to itself, but
			// NaN === NaN is false, so check explicitly
			// SameValueZero treats 0 and -0 as equal, as does ===, so we're fine there
			if (searchElement === currentElement || (searchIsNaN && isNaN(currentElement))) {
				return true;
			}
			k++;
		}
		return false;
	};
}
///////////////////////
// INCLUDES (STRING) //
///////////////////////
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
//////////////
// CONTAINS //
//////////////
//ARRAY
Array.prototype.contains = function(obj) {
	return (JSON.stringify(this)).indexOf(JSON.stringify(obj)) > -1;
	//return JSON.stringify(this).indexOf(obj) > -1;
};
//STRING
String.prototype.contains = function () {
	return String.prototype.indexOf.apply(this, arguments) !== -1;
};
////////////////
// SORTBYATTR //
////////////////
Array.prototype.sortbyattr = function(attr,order) {
	// NORMAL ATTR SORT
	this.sort(function(a, b) {
		if(order == 'desc') {
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
	var uniques = [];
	var stringify = {};
	for (var i = 0; i < obj.length; i++) {
		var keys = Object.keys(obj[i]);
		keys.sort(function (a, b) {
			return a - b
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
	return (typeof num == 'string' || typeof num == 'number') && !isNaN(num - 0) && num !== '';
};
//ISNUMBER
function isNumber(num) {
	return (typeof num == 'number') && !isNaN(num - 0) && num !== '';
};
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
    if(!input) { return ''; }
	input        = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var hour     = input.getHours();
    var minute   = input.getMinutes(); //+1;
    if(minute < 10)   { minute = '0' + minute; }
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	//
	return input.getFullYear() + '/' + gotMonth + '/' + gotDate + ' - ' + hour + ':' + minute;
}
////////////////////
// DAY UTC FORMAT //
////////////////////
function DayUtcFormat(input) {
    if(!input) { return ''; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	return input.getFullYear() + '/' + gotMonth + '/' + gotDate;
}
////////////////
// DAY FORMAT //
////////////////
function dayFormat(input) {
    if(!input) { return ""; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = '0' + gotMonth; }
	if(gotDate  < 10) { gotDate  = '0' + gotDate;  }
	return input.getFullYear() + '/' + gotMonth + '/' + gotDate;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	
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
	var days      = Math.floor(difference_ms/24);

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
	} else if(app.device.cordova || app.device.msapp || app.device.ios || app.device.android || app.device.wp8 || app.device.wp10 || app.device.windows8 || app.device.windows10 || app.device.osxapp || app.device.blackberry || app.device.playbook) {
		//INSTALL
		app.analytics('install');
	} else {
		//BOGUS
		app.analytics('bogus');
	}
};
//#//////////////#//
//# ONLINE USERS #//
//#//////////////#//
app.online = function () {
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
		if (window.azert(title + '\n' + msg))
		setTimeout(function () {
			callback();
		}, 0);
	}
};
//##//////////////##//
//## APP.PROMPT() ##//
//##//////////////##// prompt: function(message, resultCallback, title, buttonLabels, defaultText) {
app.prompt = function(title,content,callback) {
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
			if (cancel != "hide") {
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
		if (window.confirm(title + "\n" + msg)) {
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
	if (usrMsg && usrMail) {
		$.ajax({
			type : 'POST',
			url : app.https + 'chronoburn.com/mail.php',
			data : {
				mail: usrMail,
				msg: usrMsg,
				usr: app.get.platform() + ' - ' + lang
			},
			dataType : 'text'
		}).error(function(xhr, statusText) {
			callback(false);
		}).success(function (result) {
			if (typeof callback === 'function') {
				callback(true);
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
			Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold
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
//#/////////////#//
//# TAP HANDLER #// Version: 0.3.1
//#/////////////#// https://github.com/BR0kEN-/jTap
(function ($, specialEventName, touch_start, touch_end) {
	'use strict';
	
	if(app.device.wp10) {
		touch_start = 'touchstart';
		touch_end   = 'touchend';
	}
	
	var nativeEvent = {
		start : touch_start,
		end : touch_end
	};
	
	$.event.special[specialEventName] = {
		setup : function (data, namespaces, eventHandle) {
			var $element = $(this);
			var eventData = {};
			$element.on(nativeEvent.start, function (event) {
				if (event.which && event.which !== 1) {
					return;
				}
				//TWEAK
				if (event) {
					if (event.target) {
						eventData.target = event.target || $element;
						eventData.pageX  = app.pointer(event).x;
						eventData.pageY  = app.pointer(event).y;
						eventData.time   = app.now();
					}
				}
			}).on(nativeEvent.end, function (event) {
				//TWEAK
				if (eventData) {
					//DIFF
					var diffX = Math.abs(eventData.pageX - app.pointer(event).x);
					var diffY = Math.abs(eventData.pageY - app.pointer(event).y);
					var endX = app.pointer(event).x; 
					var endY = app.pointer(event).y;
					//THRESHOLD
					if ((eventData.target === event.target || eventData.target === $(this)) && app.now() - eventData.time < 750 && diffX < 10 && diffY < 10) {
						event.type  = specialEventName;
						event.pageX = endX;
						event.pageY = endY;
						//TRIGGER
						eventHandle.call(this, event);
					}
				}
			});
		},
		remove : function () {
			$(this).off(nativeEvent.start + ' ' + nativeEvent.end);
		}
	};
	$.fn[specialEventName] = function (fn) {
		return this[fn ? 'on' : 'trigger'](specialEventName, fn);
	};
})(jQuery, 'tap', touchstart, touchend);
//#////////////#//
//# TAPHOLD.JS #//
//#////////////#// https://svn.stylite.de/egwdoc/phpgwapi/js/jquery/jquery-tap-and-hold/jquery.tapandhold.js.source.txt
(function ($, touch_start, touch_end, touch_move) {
	'use strict';
	var TAP_AND_HOLD_TRIGGER_TIMER = 1500;
	var MAX_DISTANCE_ALLOWED_IN_TAP_AND_HOLD_EVENT = 10;

	var TOUCHSTART = touch_start;
	var TOUCHEND = touch_end;
	var TOUCHMOVE = touch_move;

	var tapAndHoldTimer = null;

	function calculateEuclideanDistance(x1, y1, x2, y2) {
		if (!x1)	{ return; }
		var diffX = (x2 - x1);
		var diffY = (y2 - y1);
		return Math.sqrt((diffX * diffX) + (diffY * diffY));
	};

	function onTouchStart(event) {
		var e = app.pointer(event).e;

		// Only start detector if and only if one finger is over the widget
		if (!e.touches || (e.targetTouches.length === 1 && e.touches.length === 1)) {
			startTapAndHoldDetector.call(this, event)
			var element = $(this);
			element.bind(TOUCHMOVE, onTouchMove);
			element.bind(TOUCHEND, onTouchEnd);
		} else {
			stopTapAndHoldDetector.call(this);
		}
	};

	function onTouchMove(event) {
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
	};

	function onTouchEnd(event) {
		stopTapAndHoldDetector.call(this);
	};

	function onTapAndHold(event) {
		clear.call(this);
		$(this).data("taphold.handler").call(this, event);
	};

	function clear() {
		tapAndHoldTimer = null;
		$(this).unbind(TOUCHMOVE, onTouchMove);
		$(this).unbind(TOUCHEND, onTouchEnd);
	};

	function startTapAndHoldDetector(event) {
		if (tapAndHoldTimer != null) {
			return;
		}
		var self = this;
		tapAndHoldTimer = setTimeout(function () {
				onTapAndHold.call(self, event)
			}, TAP_AND_HOLD_TRIGGER_TIMER);

		// Stores tap x & y
		var e = app.pointer(event);
		var tapAndHoldPoint = {};
		if(!e.x || !e.y) { return; }
		tapAndHoldPoint.x = e.x;
		tapAndHoldPoint.y = e.y;
		$(this).data('taphold.point', tapAndHoldPoint);
	};

	function stopTapAndHoldDetector() {
		clearTimeout(tapAndHoldTimer);
		clear.call(this);
	};

	$.event.special['hold'] = {
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
})(jQuery, touchstart, touchend, touchmove);
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
var md5=function(r){function n(r,n){return r<<n|r>>>32-n}function t(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,t=1073741824&r,o=1073741824&n,f=(1073741823&r)+(1073741823&n),t&o?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function o(r,n,t){return r&n|~r&t}function e(r,n,t){return r&t|n&~t}function u(r,n,t){return r^n^t}function f(r,n,t){return n^(r|~t)}function i(r,e,u,f,i,a,c){return r=t(r,t(t(o(e,u,f),i),c)),t(n(r,a),e)}function a(r,o,u,f,i,a,c){return r=t(r,t(t(e(o,u,f),i),c)),t(n(r,a),o)}function c(r,o,e,f,i,a,c){return r=t(r,t(t(u(o,e,f),i),c)),t(n(r,a),o)}function C(r,o,e,u,i,a,c){return r=t(r,t(t(f(o,e,u),i),c)),t(n(r,a),o)}function g(r){for(var n,t=r.length,o=t+8,e=(o-o%64)/64,u=16*(e+1),f=Array(u-1),i=0,a=0;t>a;)n=(a-a%4)/4,i=a%4*8,f[n]=f[n]|r.charCodeAt(a)<<i,a++;return n=(a-a%4)/4,i=a%4*8,f[n]=f[n]|128<<i,f[u-2]=t<<3,f[u-1]=t>>>29,f}function h(r){var n,t,o="",e="";for(t=0;3>=t;t++)n=r>>>8*t&255,e="0"+n.toString(16),o+=e.substr(e.length-2,2);return o}function d(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):o>127&&2048>o?(n+=String.fromCharCode(o>>6|192),n+=String.fromCharCode(63&o|128)):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128),n+=String.fromCharCode(63&o|128))}return n}var v,m,S,l,A,s,y,b,p,w=Array(),L=7,j=12,k=17,q=22,x=5,z=9,B=14,D=20,E=4,F=11,G=16,H=23,I=6,J=10,K=15,M=21;for(r=d(r),w=g(r),s=1732584193,y=4023233417,b=2562383102,p=271733878,v=0;v<w.length;v+=16)m=s,S=y,l=b,A=p,s=i(s,y,b,p,w[v+0],L,3614090360),p=i(p,s,y,b,w[v+1],j,3905402710),b=i(b,p,s,y,w[v+2],k,606105819),y=i(y,b,p,s,w[v+3],q,3250441966),s=i(s,y,b,p,w[v+4],L,4118548399),p=i(p,s,y,b,w[v+5],j,1200080426),b=i(b,p,s,y,w[v+6],k,2821735955),y=i(y,b,p,s,w[v+7],q,4249261313),s=i(s,y,b,p,w[v+8],L,1770035416),p=i(p,s,y,b,w[v+9],j,2336552879),b=i(b,p,s,y,w[v+10],k,4294925233),y=i(y,b,p,s,w[v+11],q,2304563134),s=i(s,y,b,p,w[v+12],L,1804603682),p=i(p,s,y,b,w[v+13],j,4254626195),b=i(b,p,s,y,w[v+14],k,2792965006),y=i(y,b,p,s,w[v+15],q,1236535329),s=a(s,y,b,p,w[v+1],x,4129170786),p=a(p,s,y,b,w[v+6],z,3225465664),b=a(b,p,s,y,w[v+11],B,643717713),y=a(y,b,p,s,w[v+0],D,3921069994),s=a(s,y,b,p,w[v+5],x,3593408605),p=a(p,s,y,b,w[v+10],z,38016083),b=a(b,p,s,y,w[v+15],B,3634488961),y=a(y,b,p,s,w[v+4],D,3889429448),s=a(s,y,b,p,w[v+9],x,568446438),p=a(p,s,y,b,w[v+14],z,3275163606),b=a(b,p,s,y,w[v+3],B,4107603335),y=a(y,b,p,s,w[v+8],D,1163531501),s=a(s,y,b,p,w[v+13],x,2850285829),p=a(p,s,y,b,w[v+2],z,4243563512),b=a(b,p,s,y,w[v+7],B,1735328473),y=a(y,b,p,s,w[v+12],D,2368359562),s=c(s,y,b,p,w[v+5],E,4294588738),p=c(p,s,y,b,w[v+8],F,2272392833),b=c(b,p,s,y,w[v+11],G,1839030562),y=c(y,b,p,s,w[v+14],H,4259657740),s=c(s,y,b,p,w[v+1],E,2763975236),p=c(p,s,y,b,w[v+4],F,1272893353),b=c(b,p,s,y,w[v+7],G,4139469664),y=c(y,b,p,s,w[v+10],H,3200236656),s=c(s,y,b,p,w[v+13],E,681279174),p=c(p,s,y,b,w[v+0],F,3936430074),b=c(b,p,s,y,w[v+3],G,3572445317),y=c(y,b,p,s,w[v+6],H,76029189),s=c(s,y,b,p,w[v+9],E,3654602809),p=c(p,s,y,b,w[v+12],F,3873151461),b=c(b,p,s,y,w[v+15],G,530742520),y=c(y,b,p,s,w[v+2],H,3299628645),s=C(s,y,b,p,w[v+0],I,4096336452),p=C(p,s,y,b,w[v+7],J,1126891415),b=C(b,p,s,y,w[v+14],K,2878612391),y=C(y,b,p,s,w[v+5],M,4237533241),s=C(s,y,b,p,w[v+12],I,1700485571),p=C(p,s,y,b,w[v+3],J,2399980690),b=C(b,p,s,y,w[v+10],K,4293915773),y=C(y,b,p,s,w[v+1],M,2240044497),s=C(s,y,b,p,w[v+8],I,1873313359),p=C(p,s,y,b,w[v+15],J,4264355552),b=C(b,p,s,y,w[v+6],K,2734768916),y=C(y,b,p,s,w[v+13],M,1309151649),s=C(s,y,b,p,w[v+4],I,4149444226),p=C(p,s,y,b,w[v+11],J,3174756917),b=C(b,p,s,y,w[v+2],K,718787259),y=C(y,b,p,s,w[v+9],M,3951481745),s=t(s,m),y=t(y,S),b=t(b,l),p=t(p,A);var N=h(s)+h(y)+h(b)+h(p);return N.toLowerCase()};
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
 
