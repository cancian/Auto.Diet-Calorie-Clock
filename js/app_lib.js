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
	width: window.innerWidth,
	height: window.innerHeight,
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
	base64: {
		encode: function (e){if("undefined"==typeof window)return new Buffer(e).toString("base64");if("undefined"!=typeof window.btoa)return window.btoa(escape(encodeURIComponent(e)));var n,t,o,r,a,c,d,i,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",h=0,u=0,w="",A=[];if(!e)return e;e=unescape(encodeURIComponent(e));do n=e.charCodeAt(h++),t=e.charCodeAt(h++),o=e.charCodeAt(h++),i=n<<16|t<<8|o,r=i>>18&63,a=i>>12&63,c=i>>6&63,d=63&i,A[u++]=f.charAt(r)+f.charAt(a)+f.charAt(c)+f.charAt(d);while(h<e.length);w=A.join("");var p=e.length%3;return(p?w.slice(0,p-3):w)+"===".slice(p||3)},
		decode: function (e){if("undefined"==typeof window)return new Buffer(e,"base64").toString("utf-8");if("undefined"!=typeof window.atob)return decodeURIComponent(unescape(window.atob(e)));var n,r,o,t,d,i,f,a,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=0,h=0,w="",C=[];if(!e)return e;e+="";do t=c.indexOf(e.charAt(u++)),d=c.indexOf(e.charAt(u++)),i=c.indexOf(e.charAt(u++)),f=c.indexOf(e.charAt(u++)),a=t<<18|d<<12|i<<6|f,n=a>>16&255,r=a>>8&255,o=255&a,64===i?C[h++]=String.fromCharCode(n):64===f?C[h++]=String.fromCharCode(n,r):C[h++]=String.fromCharCode(n,r,o);while(u<e.length);return w=C.join(""),decodeURIComponent(escape(w.replace(/\0+$/,"")))}
	},
	//user: localStorage.getItem('app_current_user').split('###'),
	dev: localStorage.getItem('config_debug') === 'active' ? true : false,
	beenDev: localStorage.getItem('config_debug') === 'active' || localStorage.getItem('been_dev') ? true : false,
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
	https: /http:/i.test(window.location.protocol) || /BB10|BlackBerry|All Touch|PlayBook/i.test(navigator.userAgent) || (localStorage.getItem('config_debug') == 'active' && !/http/i.test(window.location.protocol)) ? 'http://' : 'https://',
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
			app.timeout('dbTimeout_' + key,750,function() {
				localforage.setItem(key,value);
			});
			return;
		}
		//OBJECT
		if(type == 'object') {
			if(value) {
				localStorage.setItem(key,JSON.stringify(value));
			}
			return;
		}
		//
		if(localStorage.getItem(key) != value) {
			localStorage.setItem(key,value);
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
				if(!/autoupdate|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots|app_installed/i.test(keys[i])) {
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
		$(target).css('pointer-events','auto');
		$(target).css(prefix + 'transition', 'opacity ease .32s');
		$(target).css('opacity',1);
		setTimeout(function() {
			if(typeof callback === 'function') {
				callback(target);
			}
		},320);
	},
	hide: function(target,callback) {
		$(target).css('pointer-events','none');
		$(target).css(prefix + 'transition', 'opacity ease .12s');
		$(target).css('opacity',0);
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
		$(target).css('pointer-events','none');
		app.timers[app.timers[searchalize(target)]] = setTimeout(function() {
			if(typeof callback === 'function') {
				callback();
			}
			$(target).css('pointer-events','auto');
		}, time);
	},
	timer: {
		start : function(str)     { if(!str) { str = 'generic'; }; app.globals[str] = app.now(); },
		end   : function(str,txt) { if(!str) { str = 'generic'; }; if(txt) { txt = txt + ': '; } else { txt = 'total: '; }; app.toast(txt + (Number((app.now() - app.globals[str]))) + ' ms', 'timer_' + (JSON.stringify(app.globals[str]))); }
	}
};
/////////////////////////////////////
// UPDATE HARDCODED HTTP/HTTPS VAR //
/////////////////////////////////////~BB10
if(typeof https !== 'undefined') {
	https = app.https;
}
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
		$('body').css('opacity',0);
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
	//UNHANDLED
	if(app.read('error_log_unhandled')) {
		var unhandledError = app.read('error_log_unhandled');
		setTimeout(function() {
			app.analytics('error',unhandledError);
		},0);
		//app.remove('error_log_unhandled')
	}
	//HANDLED
	if(app.read('error_log_handled')) {
		var handledError = app.read('error_log_handled');
		setTimeout(function() {
			app.analytics('error',handledError);
		},0);
		//app.remove('error_log_handled')
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
app.get.androidVersion = function() {
	if((/Android/i).test(app.ua) && !app.http) {
		//android L
		if((/Build\/L/i).test(app.ua)) { return 4.4; }
		return parseFloat(app.ua.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return false;
	}
};
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
	android    : (/Android/i).test(app.ua) && !(/MSApp/i).test(app.ua) ? app.get.androidVersion() : false,
	android2   : (/Android/i).test(app.ua) && app.get.androidVersion() < 4 ? true : false,
	ios        : (/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	ios7       : (/OS [7-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios8       : (/OS [8](.*)   like Mac OS X/i).test(app.ua) ? true : false,
	ios9       : (/OS [9](.*)   like Mac OS X/i).test(app.ua) ? true : false,
	ios10      : (/OS [10](.*)  like Mac OS X/i).test(app.ua) ? true : false,	
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
	chromeos   : app.get.isChromeApp() ? true : false,
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
////////////////////
// GLOBAL BOOLEAN //
////////////////////
app.is.scrollable = false;
if($.nicescroll && !app.device.msapp && vendorClass != 'msie') {
	if(app.device.desktop && !app.device.msapp)			{ app.is.scrollable = true; }
	if(app.device.linux)								{ app.is.scrollable = true; }
	if(app.device.android && app.device.android < 4.4)	{ app.is.scrollable = true; }
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
$.prototype.html2 = function (data, callback) {
	var obj = $(this);
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
$.prototype.append2 = function (data, callback) {
	var obj = $(this);
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
	var obj = $(this);
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
	var obj = $(this);
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
	var obj = $(this);
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
	//$('body').css('zoom',Math.round(app.read('app_zoom') * 100) + '%');
	//$('body').css('zoom',app.read('app_zoom'));
	//$('body').css('-moz-transform','scale(' + app.read('app_zoom') + ',' + app.read('app_zoom') + ')');
	if(typeof appResizer == 'function') {
		$('.nicescroll-rails').css('display','none');
		appResizer();
		app.timeout('zoomHideScrollar',400,function() {
			$('.nicescroll-rails').css('display','block');
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
///////////////////
// APPEND SCRIPT //
///////////////////
app.appendScript = function(url) {
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
		wp8:        'http://windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e',
		wp10:       'https://www.microsoft.com/store/apps/9wzdncrdkhz5',
		windows8:   'http://apps.microsoft.com/windows/app/27631189-ce9d-444e-a46b-31b8f294f14e',
		windows10:  'https://www.microsoft.com/store/apps/9wzdncrdkhz5',
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
	else if((!url && app.device.wp10)       || url == 'wp10')        { url = store.wp8;        } //wp10
	else if((!url && app.device.wp8)        || url == 'wp8')         { url = store.wp8;        }
	else if((!url && app.device.windows10)  || url == 'windows10')   { url = store.windows10;  }	
	else if((!url && app.device.windows8)   || url == 'windows8')    { url = store.windows8;   }
	else if((!url && app.device.firefoxos)  || url == 'firefoxos')   { url = store.firefoxos;  }
	else if((!url && app.device.osxapp)     || url == 'osxapp')      { url = store.osxapp;     }
	else if((!url && app.device.chromeos)   || url == 'chromeos')    { url = store.chromeos;   }
	else if(url == 'www')										 	 { url = store.web;        }
	//OPEN
	if(url) {
		     if(app.device.ios)								{ ref = window.open(url, '_system', 'location=yes');						}
		else if(app.device.android)							{ ref = window.open(url, '_system', 'location=yes');						}
		else if(app.device.wp8 || app.device.wp10)			{ ref = window.open(url, '_blank', 'location=no');							}
		else if(app.device.msapp)							{ Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(url));	}
		else if(app.device.firefoxos)						{ ref = window.open(url, '_system', 'location=yes');						}
		else if(app.device.osxapp)							{ macgap.app.open(url);														}
		else if(app.device.playbook)						{ try { blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, new blackberry.invoke.BrowserArguments(url)); } catch (err) { errorHandler('url: ' + err); }}
		else if(app.device.blackberry)						{ if(/appworld/i.test(url)) { window.location.href=url; } else { ref = window.open(url, '_blank'); }}
		else 												{ ref = window.open(url, '_blank'); }
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
var initialScreenWidth  = window.innerWidth;
var initialScreenHeight = window.innerHeight;
var orientationSwitched = 0;
var initialScreenSize   = window.innerHeight;
var lastScreenSize      = window.innerHeight;
var lastScreenResize    = window.innerHeight;
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
			$(target).css(prefix + 'transition-duration', '0s');
			$(target).css('opacity',0);
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
				$(target).css(prefix + 'transition-duration', '0s');
			}
			if(typeof callback === 'function') {
				callback();
				callback = '';
			}
		});
		//////////////////
		// SET ANIMATED //
		//////////////////
		$(target).css(prefix + 'transition', 'opacity ease ' + (duration/1000) + 's');
		///////////////////////////////////
		// SET OPACITY ~ ENFORCE REMOVAL //
		///////////////////////////////////
		if(inOut == 1) {
			$(target).show();
		}
		//setTimeout(function() {
			$(target).css('opacity',inOut);
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
				$(falseThis).css('pointer-events','none');
				app.timeout('tapSelect',500,function() {
					$(falseThis).css('pointer-events','auto');
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
		var TouchLimit = app.device.android ? 8 : 16;
		//
		if(!app.device.windows8) {
			var moveCancel =  touchmove + ' ' + touchout  + ' ' + touchleave  + ' ' + touchcancel;
			/////////////////
			// MOVE CANCEL //
			/////////////////
			$(targetParent).on(moveCancel, function (evt) {
				app.handlers.activeRowTouches[t]++;
				app.timeout(t,'clear');
				if (app.handlers.activeRowTouches[t] > TouchLimit) {
					$(app.handlers.activeLastObj[t]).removeClass(style);
					app.handlers.activeRowTouches[t] = 0;
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
			$(target).css(prefix + 'transition','background linear .5s');
			setTimeout(function () {
				$(target).removeClass('yellow');
				setTimeout(function () {
					$(target).css(prefix + 'transition','background linear 0s');
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
//KCALS
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
///////////
// LOADER //
///////////
if($('#loadMask').html() == '') {
	$('#loadMask').html2('\
<table width="100%" height="100%" border="0">\
  <tbody>\
    <tr>\
      <td align="center" valign="middle"><span></span></td>\
    </tr>\
  </tbody>\
</table>');
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
if (!$("#plainLoad").length && !$("#superBlockCSS").length && isCurrentCacheValid !== 1) {
	if (vendorClass == "moz" || vendorClass == "msie") {
		var cssPath = 'css/index.css';
		$.support.cors = true;
		$.ajax({
			url : hostLocal + cssPath,
			dataType : "text",
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
				$("#coreCss").remove();
				$("#coreFonts").before2("<style type='text/css' id='coreCss'></style>");
				$("#coreCss").html2(dataCSS);
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
app.updateColorPicker();
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
//test
/*
try {
	document.createEvent('TouchEvent');
	app.touch = true;
} catch (err) {
	app.touch = false;
}
*/
//
function isCordova() {
	return isMobileCordova;
}
function getAndroidVersion() {
	if((/Android/i).test(userAgent) && !app.http) {
		//android L
		if((/Build\/L/i).test(userAgent)) { return 4.4; }
		return parseFloat(userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return -1;
	}
}
var gotAndroidVersion = getAndroidVersion();
var androidVersion = function() {
	return gotAndroidVersion;
};

var varHasTouch = !app.http && (/(iPhone|iPod|iPad|Android|BlackBerry|PlayBook)/).test(userAgent);
function hasTouch() {
	return varHasTouch;
}
var varHasTap = 'ontouchend' in document && !app.device.linux ? true : false;
function hasTap() {
	return varHasTap;
}
////////////////////
// TOUCH HANDLERS //
////////////////////
var tap         = 'tap';
var hold        = 'hold';
var swipe       = 'swipe';
var touchstart  = hasTap() ? 'touchstart'  : 'mousedown';
var touchend    = hasTap() ? 'touchend'    : 'mouseup';
var touchmove   = hasTap() ? 'touchmove'   : 'mousemove';
var touchcancel = hasTap() ? 'touchcancel' : 'mouseup';
var touchleave  = hasTap() ? 'touchleave'  : 'mouseleave';
var touchout    = hasTap() ? 'touchout'    : 'mouseout';
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
	if(typeof error === 'undefined' || !error.length) {
		return;
	}
	//FILTER
	if(/800a139e|isTrusted|InvalidStateError|UnknownError|space|stack|size|pile/i.test(JSON.stringify(error))) { 
		return; 
	}
	//STRINGIFY
	if(typeof error !== 'string') {
		error = stringifyError(error);
	}
	//DEV
	if(app.beenDev) {
		console.log('errorHandler Dev Log: ' + error);
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
		//LOG ERROR
		app.save('error_log_handled','handled log: ' + error)
		//TRACK
		app.analytics('error','handled: ' + error);
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
	$(target).css(prefix + 'transition', 'background linear 0s');
	$(target).css('background-color', startColor);	
	setTimeout(function () {
		$(target).css(prefix + 'transition', 'background linear ' + JSON.stringify(duration) + 'ms');
		$(target).css('background-color', endColor);
		$(target).css('pointer-events','none');
		//WAIT TO DISABLE
		setTimeout(function () {
			$(target).css(prefix + 'transition', 'background linear 0s');
			$(target).css('pointer-events','auto');
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
if (typeof stringifyError === 'undefined') {
	var stringifyError = function (err) {
		var plainObject = {};
		Object.getOwnPropertyNames(err).forEach(function (key) {
			plainObject[key] = err[key];
		});
		return JSON.stringify(plainObject);
	};
}
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
	if((Math.round(Number(val) *  10) / 10)  == 0 && p ==  1)  { return '0.0';  }
	if((Math.round(Number(val) * 100) / 100) == 0)			  { return '0.00'; }
	if(p == 1)				{
		return Math.round(Number(val) * 10) / 10;
	}
	return Math.round(Number(val) * 100) / 100;
}
/////////////
// TOASCII //
/////////////
var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinize=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return latin_map[a]||a})};
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
//OBJECT
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
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
    if(!input) { return ""; }
	input        = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	var hour     = input.getHours();
    var minute   = input.getMinutes(); //+1;
    if(minute < 10)   { minute = "0" + minute; }
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	//
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate + ' - ' + hour + ":" + minute;
}
////////////////////
// DAY UTC FORMAT //
////////////////////
function DayUtcFormat(input) {
    if(!input) { return ""; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate;
}
////////////////
// DAY FORMAT //
////////////////
function dayFormat(input) {
    if(!input) { return ""; }
	input = new Date(input);
	var gotMonth = input.getMonth()+1;
	var gotDate  = input.getDate();
	if(gotMonth < 10) { gotMonth = "0" + gotMonth; }
	if(gotDate  < 10) { gotDate  = "0" + gotDate;  }
	return input.getFullYear() + "/" + gotMonth + "/" + gotDate;
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

	var lMinutes = " " + LANG.MINUTES[lang] + " ";
	var lHours   = " " + LANG.HOURS[lang] + " ";
	var lDays    = " " + LANG.DAYS[lang] + " ";

	if(minutes == 0) { lMinutes = ""; minutes = ""; }
	if(hours   == 0) { lHours   = ""; hours   = ""; }
	if(days    == 0) { lDays    = ""; days    = ""; }

	if(minutes == 1) { lMinutes = " " + LANG.MINUTE[lang] + " "; }
	if(hours   == 1) { lHours   = " " + LANG.HOUR[lang] + " ";   }
	if(days    == 1) { lDays    = " " + LANG.DAY[lang] + " ";    }

	if(days    > 3)                             { lHours   = ""; hours   = ""; }
	if(days    > 0)                             { lMinutes = ""; minutes = ""; }
	if(days    > 0 && hours   > 0)              { lDays    = lDays  + LANG.AND[lang] + " "; }
	if(hours   > 0 && minutes > 0)              { lHours   = lHours + LANG.AND[lang] + " "; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; lMinutes = " " + LANG.MINUTES[lang] + " "; }

	if(showAgo == true) {
		return LANG.PREAGO[lang] + " " + days + lDays + hours + lHours + minutes + lMinutes + " " + LANG.AGO[lang] + " ";
	} else
		return days + lDays + hours + lHours + minutes + lMinutes + " "; {
	}

}
////////////////////////
// WINDOW ORIENTATION //
////////////////////////
function getOrientation() {
	if(window.orientation == 90 || window.orientation == -90) {
		return "landscape";
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return "portrait";
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
	var loadCounter = " (" + num + "/" + total + ")";
	if(num == 0 && total == 0) { loadCounter = ''; }
	$("#cssAutoUpdate").html2("\
		.loading #advancedAutoUpdate:before	  { content: '" + LANG.DOWNLOADING[lang]     + loadCounter + "'; }\
		.pending #advancedAutoUpdate:before	  { content: '" + LANG.RESTART_PENDING[lang] + "'; }\
		.uptodate #advancedAutoUpdate:before  { content: '" + LANG.UP_TO_DATE[lang]      + "'; }\
		.corrupted #advancedAutoUpdate:before { content: '" + LANG.CORRUPTED[lang]       + "'; }\
		.spinnerMask #loadMask:before		  { content: '" + LANG.PREPARING_DB[lang]    + "'; }\
		.spinnerMask.updtdb #loadMask:before  { content: '" + LANG.UPDATING_DB[lang]     + "'; }\
	");
}
//////////////
// KICKDOWN //
//////////////
function kickDown(el) {
	if(!el) { el = '#appContent'; }
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
}
///////////////////
// TRACK INSTALL //
///////////////////
app.trackInstall = function () {
	//CHECK
	if (app.read('app_installed','installed')) { return; }
	//LOCK
	app.save('app_installed', 'installed');
	//////////
	//TRACK //
	//////////
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
//#/////////////////////#//
//# POINTER XY POLYFILL #// jquery.event.pointertouch
//#/////////////////////#// https://github.com/timmywil/jquery.event.pointertouch
(function(window, $) {
	'use strict';
	// Common properties to lift for touch or pointer events
	var list = 'over out down up move enter leave cancel'.split(' ');
	var hook = $.extend({}, $.event.mouseHooks);
	var events = {};

	// Support pointer events in IE11+ if available
	if ( window.PointerEvent ) {
		$.each(list, function( i, name ) {
			// Add event name to events property and add fixHook
			$.event.fixHooks[
				(events[name] = 'pointer' + name)
			] = hook;
		});
	} else {
		var mouseProps = hook.props;
		// Add touch properties for the touch hook
		hook.props = mouseProps.concat(['touches', 'changedTouches', 'targetTouches', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']);

		// Support: Android
		// Android sets pageX/Y to 0 for any touch event
		// Attach first touch's pageX/pageY and clientX/clientY if not set correctly
		hook.filter = function( event, originalEvent ) {
			var touch;
			var i = mouseProps.length;
			if ( !originalEvent.pageX && originalEvent.touches && (touch = originalEvent.touches[0]) ) {
				// Copy over all mouse properties
				while(i--) {
					event[mouseProps[i]] = touch[mouseProps[i]];
				}
			}
			return event;
		};

		$.each(list, function( i, name ) {
			// No equivalent touch events for over and out
			if (i < 2) {
				events[ name ] = 'mouse' + name;
			} else {
				var touch = 'touch' +
					(name === 'down' ? 'start' : name === 'up' ? 'end' : name);
				// Add fixHook
				$.event.fixHooks[ touch ] = hook;
				// Add event names to events property
				events[ name ] = touch + ' mouse' + name;
			}
		});
	}

	$.pointertouch = events;

	return events;
})(window, jQuery);
//#///////////////#//
//# SWIPE HANDLER #// Version: 0.3.1
//#///////////////#// https://github.com/BR0kEN-/jTap
(function ($, specialEventName, touch_start, touch_end) {
	'use strict';
	var nativeEvent = Object.create(null);
	var getTime = function () {
		return new Date().getTime();
	};
	
	nativeEvent.original = 'click';
	nativeEvent.start    = touch_start;
	nativeEvent.end      = touch_end;

	$.event.special[specialEventName] = {
		setup : function (data, namespaces, eventHandle) {
			var $element = $(this);
			var eventData = {};
			$element.off(nativeEvent.original).on(nativeEvent.original, false).on(nativeEvent.start + ' ' + nativeEvent.end, function (event) {
				//TWEAK
				if (event) {
					if (event.originalEvent) {
						eventData.event = event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : event;
					}
				}
			}).on(nativeEvent.start, function (event) {
				if (event.which && event.which !== 1) {
					return;
				}
				//TWEAK
				if (eventData) {
					if (eventData.event) {
						eventData.target = event.target;
						eventData.pageX  = eventData.event.pageX;
						eventData.pageY  = eventData.event.pageY;
						eventData.time   = getTime();
					}
				}
			}).on(nativeEvent.end, function (event) {
				//TWEAK
				if (eventData) {
					if (eventData.event) {
						//TWEAK ~ round decimals for android
						var diffX = Math.abs(parseInt(eventData.pageX) - parseInt(eventData.event.pageX));
						var diffY = Math.abs(parseInt(eventData.pageY) - parseInt(eventData.event.pageY));
						//SWIPE COORDS
						var startX = parseInt(eventData.pageX);
						var endX   = parseInt(eventData.event.pageX);
						//SWIPE THRESHOLD
						if (eventData.target === event.target && getTime() - eventData.time < 750 && diffX > 30 && diffY < 30) {
							//MODIFY EVENT
							event.type      = specialEventName;
							event.pageX     = eventData.event.pageX;
							event.pageY     = eventData.event.pageY;
							event.direction = startX > endX ? 'left' : 'right';
							eventHandle.call(this, event);
							if (!event.isDefaultPrevented()) {
								$element.off(nativeEvent.original).trigger(nativeEvent.original);
							}
						}
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
})(jQuery, 'swipe', touchstart, touchend);
//#/////////////#//
//# TAP HANDLER #// Version: 0.3.1
//#/////////////#// https://github.com/BR0kEN-/jTap
(function ($, specialEventName, touch_start, touch_end) {
	'use strict';
	var nativeEvent = Object.create(null);
	var getTime = function () {
		return new Date().getTime();
	};
	
	nativeEvent.original = 'click';
	nativeEvent.start    = touch_start;
	nativeEvent.end      = touch_end;

	$.event.special[specialEventName] = {
		setup : function (data, namespaces, eventHandle) {
			var $element = $(this);
			var eventData = {};
			$element.off(nativeEvent.original).on(nativeEvent.original, false).on(nativeEvent.start + ' ' + nativeEvent.end, function (event) {
				//TWEAK
				if (event) {
					if (event.originalEvent) {
						eventData.event = event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : event;
					}
				}
			}).on(nativeEvent.start, function (event) {
				if (event.which && event.which !== 1) {
					return;
				}
				//TWEAK
				if (eventData) {
					if (eventData.event) {
						eventData.target = event.target;
						eventData.pageX  = eventData.event.pageX;
						eventData.pageY  = eventData.event.pageY;
						eventData.time   = getTime();
					}
				}
			}).on(nativeEvent.end, function (event) {
				//TWEAK
				if (eventData) {
					if (eventData.event) {
						//TWEAK ~ round decimals for android
						var diffX = Math.abs(parseInt(eventData.pageX) - parseInt(eventData.event.pageX));
						var diffY = Math.abs(parseInt(eventData.pageY) - parseInt(eventData.event.pageY));
						//TAP THRESHOLD
						if (eventData.target === event.target && getTime() - eventData.time < 750 && diffX < 10 && diffY < 10) {
							//MODIFY EVENT
							event.type = specialEventName;
							event.pageX = eventData.event.pageX;
							event.pageY = eventData.event.pageY;
							eventHandle.call(this, event);
							if (!event.isDefaultPrevented()) {
								$element.off(nativeEvent.original).trigger(nativeEvent.original);
							}
						}
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
	var TAP_AND_HOLD_TRIGGER_TIMER = 1750;
	var MAX_DISTANCE_ALLOWED_IN_TAP_AND_HOLD_EVENT = 10;

	var TOUCHSTART = touch_start;
	var TOUCHEND = touch_end;
	var TOUCHMOVE = touch_move;

	var tapAndHoldTimer = null;

	function calculateEuclideanDistance(x1, y1, x2, y2) {
		var diffX = (x2 - x1);
		var diffY = (y2 - y1);
		return Math.sqrt((diffX * diffX) + (diffY * diffY));
	};

	function onTouchStart(event) {
		var e = event.originalEvent;

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

		var e = event.originalEvent;
		var x = e.pageX;
		var y = e.pageY;

		var tapAndHoldPoint = $(this).data("taphold.point");
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
		var e = event.originalEvent;
		var tapAndHoldPoint = {};
		tapAndHoldPoint.x = e.pageX;
		tapAndHoldPoint.y = e.pageY;
		$(this).data("taphold.point", tapAndHoldPoint);
	};

	function stopTapAndHoldDetector() {
		clearTimeout(tapAndHoldTimer);
		clear.call(this);
	};

	$.event.special["hold"] = {
		setup : function () {},

		add : function (handleObj) {
			$(this).data("taphold.handler", handleObj.handler);
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
//#//////////////#//
//# COLOR PICKER #//
//#//////////////#//
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports&&"object"==typeof module?module.exports=t(require("jquery")):t(jQuery)}(function(t,e){"use strict";function r(e,r,n,a){for(var i=[],s=0;s<e.length;s++){var o=e[s];if(o){var l=tinycolor(o),c=l.toHsl().l<.5?"sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";c+=tinycolor.equals(r,o)?" sp-thumb-active":"";var f=l.toString(a.preferredFormat||"rgb"),u=b?"background-color:"+l.toRgbString():"filter:"+l.toFilter();i.push('<span title="'+f+'" data-color="'+l.toRgbString()+'" class="'+c+'"><span class="sp-thumb-inner" style="'+u+';" /></span>')}else{var h="sp-clear-display";i.push(t("<div />").append(t('<span data-color="" style="background-color:transparent;" class="'+h+'"></span>').attr("title",a.noColorSelectedText)).html())}}return"<div class='sp-cf "+n+"'>"+i.join("")+"</div>"}function n(){for(var t=0;t<p.length;t++)p[t]&&p[t].hide()}function a(e,r){var n=t.extend({},d,e);return n.callbacks={move:c(n.move,r),change:c(n.change,r),show:c(n.show,r),hide:c(n.hide,r),beforeShow:c(n.beforeShow,r)},n}function i(i,o){function c(){if(W.showPaletteOnly&&(W.showPalette=!0),Dt.text(W.showPaletteOnly?W.togglePaletteMoreText:W.togglePaletteLessText),W.palette){dt=W.palette.slice(0),pt=t.isArray(dt[0])?dt:[dt],gt={};for(var e=0;e<pt.length;e++)for(var r=0;r<pt[e].length;r++){var n=tinycolor(pt[e][r]).toRgbString();gt[n]=!0}}kt.toggleClass("sp-flat",X),kt.toggleClass("sp-input-disabled",!W.showInput),kt.toggleClass("sp-alpha-enabled",W.showAlpha),kt.toggleClass("sp-clear-enabled",Qt),kt.toggleClass("sp-buttons-disabled",!W.showButtons),kt.toggleClass("sp-palette-buttons-disabled",!W.togglePaletteOnly),kt.toggleClass("sp-palette-disabled",!W.showPalette),kt.toggleClass("sp-palette-only",W.showPaletteOnly),kt.toggleClass("sp-initial-disabled",!W.showInitial),kt.addClass(W.className).addClass(W.containerClassName),z()}function d(){function e(e){return e.data&&e.data.ignore?(O(t(e.target).closest(".sp-thumb-el").data("color")),j()):(O(t(e.target).closest(".sp-thumb-el").data("color")),j(),I(!0),W.hideAfterPaletteSelect&&F()),!1}if(g&&kt.find("*:not(input)").attr("unselectable","on"),c(),Bt&&_t.after(Lt).hide(),Qt||jt.hide(),X)_t.after(kt).hide();else{var r="parent"===W.appendTo?_t.parent():t(W.appendTo);1!==r.length&&(r=t("body")),r.append(kt)}y(),Kt.bind("click.spectrum touchstart.spectrum",function(e){xt||A(),e.stopPropagation(),t(e.target).is("input")||e.preventDefault()}),(_t.is(":disabled")||W.disabled===!0)&&V(),kt.click(l),Tt.change(P),Tt.bind("paste",function(){setTimeout(P,1)}),Tt.keydown(function(t){13==t.keyCode&&P()}),Nt.text(W.cancelText),Nt.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),T(),F()}),jt.attr("title",W.clearText),jt.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),Gt=!0,j(),X&&I(!0)}),Et.text(W.chooseText),Et.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),g&&Tt.is(":focus")&&Tt.trigger("change"),N()&&(I(!0),F())}),Dt.text(W.showPaletteOnly?W.togglePaletteMoreText:W.togglePaletteLessText),Dt.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),W.showPaletteOnly=!W.showPaletteOnly,W.showPaletteOnly||X||kt.css("left","-="+(St.outerWidth(!0)+5)),c()}),f(Ht,function(t,e,r){ht=t/st,Gt=!1,r.shiftKey&&(ht=Math.round(10*ht)/10),j()},S,C),f(At,function(t,e){ct=parseFloat(e/at),Gt=!1,W.showAlpha||(ht=1),j()},S,C),f(Ct,function(t,e,r){if(r.shiftKey){if(!yt){var n=ft*et,a=rt-ut*rt,i=Math.abs(t-n)>Math.abs(e-a);yt=i?"x":"y"}}else yt=null;var s=!yt||"x"===yt,o=!yt||"y"===yt;s&&(ft=parseFloat(t/et)),o&&(ut=parseFloat((rt-e)/rt)),Gt=!1,W.showAlpha||(ht=1),j()},S,C),$t?(O($t),E(),Xt=W.preferredFormat||tinycolor($t).format,w($t)):E(),X&&M();var n=g?"mousedown.spectrum":"click.spectrum touchstart.spectrum";Ot.delegate(".sp-thumb-el",n,e),qt.delegate(".sp-thumb-el:nth-child(1)",n,{ignore:!0},e)}function y(){if(G&&window.localStorage){try{var e=window.localStorage[G].split(",#");e.length>1&&(delete window.localStorage[G],t.each(e,function(t,e){w(e)}))}catch(r){}try{bt=window.localStorage[G].split(";")}catch(r){}}}function w(e){if(Y){var r=tinycolor(e).toRgbString();if(!gt[r]&&-1===t.inArray(r,bt))for(bt.push(r);bt.length>vt;)bt.shift();if(G&&window.localStorage)try{window.localStorage[G]=bt.join(";")}catch(n){}}}function _(){var t=[];if(W.showPalette)for(var e=0;e<bt.length;e++){var r=tinycolor(bt[e]).toRgbString();gt[r]||t.push(bt[e])}return t.reverse().slice(0,W.maxSelectionSize)}function x(){var e=q(),n=t.map(pt,function(t,n){return r(t,e,"sp-palette-row sp-palette-row-"+n,W)});y(),bt&&n.push(r(_(),e,"sp-palette-row sp-palette-row-selection",W)),Ot.html(n.join(""))}function k(){if(W.showInitial){var t=Wt,e=q();qt.html(r([t,e],e,"sp-palette-row-initial",W))}}function S(){(0>=rt||0>=et||0>=at)&&z(),tt=!0,kt.addClass(mt),yt=null,_t.trigger("dragstart.spectrum",[q()])}function C(){tt=!1,kt.removeClass(mt),_t.trigger("dragstop.spectrum",[q()])}function P(){var t=Tt.val();if(null!==t&&""!==t||!Qt){var e=tinycolor(t);e.isValid()?(O(e),I(!0)):Tt.addClass("sp-validation-error")}else O(null),I(!0)}function A(){Z?F():M()}function M(){var e=t.Event("beforeShow.spectrum");return Z?void z():(_t.trigger(e,[q()]),void(J.beforeShow(q())===!1||e.isDefaultPrevented()||(n(),Z=!0,t(wt).bind("keydown.spectrum",R),t(wt).bind("click.spectrum",H),t(window).bind("resize.spectrum",U),Lt.addClass("sp-active"),kt.removeClass("sp-hidden"),z(),E(),Wt=q(),k(),J.show(Wt),_t.trigger("show.spectrum",[Wt]))))}function R(t){27===t.keyCode&&F()}function H(t){2!=t.button&&(tt||(Yt?I(!0):T(),F()))}function F(){Z&&!X&&(Z=!1,t(wt).unbind("keydown.spectrum",R),t(wt).unbind("click.spectrum",H),t(window).unbind("resize.spectrum",U),Lt.removeClass("sp-active"),kt.addClass("sp-hidden"),J.hide(q()),_t.trigger("hide.spectrum",[q()]))}function T(){O(Wt,!0)}function O(t,e){if(tinycolor.equals(t,q()))return void E();var r,n;!t&&Qt?Gt=!0:(Gt=!1,r=tinycolor(t),n=r.toHsv(),ct=n.h%360/360,ft=n.s,ut=n.v,ht=n.a),E(),r&&r.isValid()&&!e&&(Xt=W.preferredFormat||r.getFormat())}function q(t){return t=t||{},Qt&&Gt?null:tinycolor.fromRatio({h:ct,s:ft,v:ut,a:Math.round(100*ht)/100},{format:t.format||Xt})}function N(){return!Tt.hasClass("sp-validation-error")}function j(){E(),J.move(q()),_t.trigger("move.spectrum",[q()])}function E(){Tt.removeClass("sp-validation-error"),D();var t=tinycolor.fromRatio({h:ct,s:1,v:1});Ct.css("background-color",t.toHexString());var e=Xt;1>ht&&(0!==ht||"name"!==e)&&("hex"===e||"hex3"===e||"hex6"===e||"name"===e)&&(e="rgb");var r=q({format:e}),n="";if(Vt.removeClass("sp-clear-display"),Vt.css("background-color","transparent"),!r&&Qt)Vt.addClass("sp-clear-display");else{var a=r.toHexString(),i=r.toRgbString();if(b||1===r.alpha?Vt.css("background-color",i):(Vt.css("background-color","transparent"),Vt.css("filter",r.toFilter())),W.showAlpha){var s=r.toRgb();s.a=0;var o=tinycolor(s).toRgbString(),l="linear-gradient(left, "+o+", "+a+")";g?Rt.css("filter",tinycolor(o).toFilter({gradientType:1},a)):(Rt.css("background","-webkit-"+l),Rt.css("background","-moz-"+l),Rt.css("background","-ms-"+l),Rt.css("background","linear-gradient(to right, "+o+", "+a+")"))}n=r.toString(e)}W.showInput&&Tt.val(n),W.showPalette&&x(),k()}function D(){var t=ft,e=ut;if(Qt&&Gt)Ft.hide(),Mt.hide(),Pt.hide();else{Ft.show(),Mt.show(),Pt.show();var r=t*et,n=rt-e*rt;r=Math.max(-nt,Math.min(et-nt,r-nt)),n=Math.max(-nt,Math.min(rt-nt,n-nt)),Pt.css({top:n+"px",left:r+"px"});var a=ht*st;Ft.css({left:a-ot/2+"px"});var i=ct*at;Mt.css({top:i-lt+"px"})}}function I(t){var e=q(),r="",n=!tinycolor.equals(e,Wt);e&&(r=e.toString(Xt),w(e)),It&&_t.val(r),t&&n&&(J.change(e),_t.trigger("change",[e]))}function z(){Z&&(et=Ct.width(),rt=Ct.height(),nt=Pt.height(),it=At.width(),at=At.height(),lt=Mt.height(),st=Ht.width(),ot=Ft.width(),X||(kt.css("position","absolute"),W.offset?kt.offset(W.offset):kt.offset(s(kt,Kt))),D(),W.showPalette&&x(),_t.trigger("reflow.spectrum"))}function B(){_t.show(),Kt.unbind("click.spectrum touchstart.spectrum"),kt.remove(),Lt.remove(),p[Jt.id]=null}function L(r,n){return r===e?t.extend({},W):n===e?W[r]:(W[r]=n,"preferredFormat"===r&&(Xt=W.preferredFormat),void c())}function K(){xt=!1,_t.attr("disabled",!1),Kt.removeClass("sp-disabled")}function V(){F(),xt=!0,_t.attr("disabled",!0),Kt.addClass("sp-disabled")}function $(t){W.offset=t,z()}var W=a(o,i),X=W.flat,Y=W.showSelectionPalette,G=W.localStorageKey,Q=W.theme,J=W.callbacks,U=u(z,10),Z=!1,tt=!1,et=0,rt=0,nt=0,at=0,it=0,st=0,ot=0,lt=0,ct=0,ft=0,ut=0,ht=1,dt=[],pt=[],gt={},bt=W.selectionPalette.slice(0),vt=W.maxSelectionSize,mt="sp-dragging",yt=null,wt=i.ownerDocument,_t=(wt.body,t(i)),xt=!1,kt=t(m,wt).addClass(Q),St=kt.find(".sp-picker-container"),Ct=kt.find(".sp-color"),Pt=kt.find(".sp-dragger"),At=kt.find(".sp-hue"),Mt=kt.find(".sp-slider"),Rt=kt.find(".sp-alpha-inner"),Ht=kt.find(".sp-alpha"),Ft=kt.find(".sp-alpha-handle"),Tt=kt.find(".sp-input"),Ot=kt.find(".sp-palette"),qt=kt.find(".sp-initial"),Nt=kt.find(".sp-cancel"),jt=kt.find(".sp-clear"),Et=kt.find(".sp-choose"),Dt=kt.find(".sp-palette-toggle"),It=_t.is("input"),zt=It&&"color"===_t.attr("type")&&h(),Bt=It&&!X,Lt=Bt?t(v).addClass(Q).addClass(W.className).addClass(W.replacerClassName):t([]),Kt=Bt?Lt:_t,Vt=Lt.find(".sp-preview-inner"),$t=W.color||It&&_t.val(),Wt=!1,Xt=W.preferredFormat,Yt=!W.showButtons||W.clickoutFiresChange,Gt=!$t,Qt=W.allowEmpty&&!zt;d();var Jt={show:M,hide:F,toggle:A,reflow:z,option:L,enable:K,disable:V,offset:$,set:function(t){O(t),I()},get:q,destroy:B,container:kt};return Jt.id=p.push(Jt)-1,Jt}function s(e,r){var n=0,a=e.outerWidth(),i=e.outerHeight(),s=r.outerHeight(),o=e[0].ownerDocument,l=o.documentElement,c=l.clientWidth+t(o).scrollLeft(),f=l.clientHeight+t(o).scrollTop(),u=r.offset();return u.top+=s,u.left-=Math.min(u.left,u.left+a>c&&c>a?Math.abs(u.left+a-c):0),u.top-=Math.min(u.top,u.top+i>f&&f>i?Math.abs(i+s-n):n),u}function o(){}function l(t){t.stopPropagation()}function c(t,e){var r=Array.prototype.slice,n=r.call(arguments,2);return function(){return t.apply(e,n.concat(r.call(arguments)))}}function f(e,r,n,a){function i(t){t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.returnValue=!1}function s(t){if(f){if(g&&c.documentMode<9&&!t.button)return l();var n=t.originalEvent&&t.originalEvent.touches&&t.originalEvent.touches[0],a=n&&n.pageX||t.pageX,s=n&&n.pageY||t.pageY,o=Math.max(0,Math.min(a-u.left,d)),b=Math.max(0,Math.min(s-u.top,h));p&&i(t),r.apply(e,[o,b,t])}}function o(r){var a=r.which?3==r.which:2==r.button;a||f||n.apply(e,arguments)!==!1&&(f=!0,h=t(e).height(),d=t(e).width(),u=t(e).offset(),t(c).bind(b),t(c.body).addClass("sp-dragging"),s(r),i(r))}function l(){f&&(t(c).unbind(b),t(c.body).removeClass("sp-dragging"),setTimeout(function(){a.apply(e,arguments)},0)),f=!1}r=r||function(){},n=n||function(){},a=a||function(){};var c=document,f=!1,u={},h=0,d=0,p="ontouchstart"in window,b={};b.selectstart=i,b.dragstart=i,b["touchmove mousemove"]=s,b["touchend mouseup"]=l,t(e).bind("touchstart mousedown",o)}function u(t,e,r){var n;return function(){var a=this,i=arguments,s=function(){n=null,t.apply(a,i)};r&&clearTimeout(n),(r||!n)&&(n=setTimeout(s,e))}}function h(){return t.fn.spectrum.inputTypeColorSupport()}var d={beforeShow:o,move:o,change:o,show:o,hide:o,color:!1,flat:!1,showInput:!1,allowEmpty:!1,showButtons:!0,clickoutFiresChange:!0,showInitial:!1,showPalette:!1,showPaletteOnly:!1,hideAfterPaletteSelect:!1,togglePaletteOnly:!1,showSelectionPalette:!0,localStorageKey:!1,appendTo:"body",maxSelectionSize:7,cancelText:"cancel",chooseText:"choose",togglePaletteMoreText:"more",togglePaletteLessText:"less",clearText:"Clear Color Selection",noColorSelectedText:"No Color Selected",preferredFormat:!1,className:"",containerClassName:"",replacerClassName:"",showAlpha:!1,theme:"sp-light",palette:[["#ffffff","#000000","#ff0000","#ff8000","#ffff00","#008000","#0000ff","#4b0082","#9400d3"]],selectionPalette:[],disabled:!1,offset:null},p=[],g=!!/msie/i.exec(window.navigator.userAgent),b=function(){function t(t,e){return!!~(""+t).indexOf(e)}var e=document.createElement("div"),r=e.style;return r.cssText="background-color:rgba(0,0,0,.5)",t(r.backgroundColor,"rgba")||t(r.backgroundColor,"hsla")}(),v=["<div class='sp-replacer'>","<div class='sp-preview'><div class='sp-preview-inner'></div></div>","<div class='sp-dd'>&#9660;</div>","</div>"].join(""),m=function(){var t="";if(g)for(var e=1;6>=e;e++)t+="<div class='sp-"+e+"'></div>";return["<div class='sp-container sp-hidden'>","<div class='sp-palette-container'>","<div class='sp-palette sp-thumb sp-cf'></div>","<div class='sp-palette-button-container sp-cf'>","<button type='button' class='sp-palette-toggle'></button>","</div>","</div>","<div class='sp-picker-container'>","<div class='sp-top sp-cf'>","<div class='sp-fill'></div>","<div class='sp-top-inner'>","<div class='sp-color'>","<div class='sp-sat'>","<div class='sp-val'>","<div class='sp-dragger'></div>","</div>","</div>","</div>","<div class='sp-clear sp-clear-display'>","</div>","<div class='sp-hue'>","<div class='sp-slider'></div>",t,"</div>","</div>","<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>","</div>","<div class='sp-input-container sp-cf'>","<input class='sp-input' type='text' spellcheck='false'  />","</div>","<div class='sp-initial sp-thumb sp-cf'></div>","<div class='sp-button-container sp-cf'>","<a class='sp-cancel' href='#'></a>","<button type='button' class='sp-choose'></button>","</div>","</div>","</div>"].join("")}(),y="spectrum.id";t.fn.spectrum=function(e,r){if("string"==typeof e){var n=this,a=Array.prototype.slice.call(arguments,1);return this.each(function(){var r=p[t(this).data(y)];if(r){var i=r[e];if(!i)throw new Error("Spectrum: no such method: '"+e+"'");"get"==e?n=r.get():"container"==e?n=r.container:"option"==e?n=r.option.apply(r,a):"destroy"==e?(r.destroy(),t(this).removeData(y)):i.apply(r,a)}}),n}return this.spectrum("destroy").each(function(){var r=t.extend({},e,t(this).data()),n=i(this,r);t(this).data(y,n.id)})},t.fn.spectrum.load=!0,t.fn.spectrum.loadOpts={},t.fn.spectrum.draggable=f,t.fn.spectrum.defaults=d,t.fn.spectrum.inputTypeColorSupport=function w(){if("undefined"==typeof w._cachedResult){var e=t("<input type='color'/>")[0];w._cachedResult="color"===e.type&&""!==e.value}return w._cachedResult},t.spectrum={},t.spectrum.localization={},t.spectrum.palettes={},t.fn.spectrum.processNativeColorInputs=function(){var e=t("input[type=color]");e.length&&!h()&&e.spectrum({preferredFormat:"hex6"})},function(){function t(t){var r={r:0,g:0,b:0},a=1,s=!1,o=!1;return"string"==typeof t&&(t=T(t)),"object"==typeof t&&(t.hasOwnProperty("r")&&t.hasOwnProperty("g")&&t.hasOwnProperty("b")?(r=e(t.r,t.g,t.b),s=!0,o="%"===String(t.r).substr(-1)?"prgb":"rgb"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("v")?(t.s=R(t.s),t.v=R(t.v),r=i(t.h,t.s,t.v),s=!0,o="hsv"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("l")&&(t.s=R(t.s),t.l=R(t.l),r=n(t.h,t.s,t.l),s=!0,o="hsl"),t.hasOwnProperty("a")&&(a=t.a)),a=x(a),{ok:s,format:t.format||o,r:D(255,I(r.r,0)),g:D(255,I(r.g,0)),b:D(255,I(r.b,0)),a:a}}function e(t,e,r){return{r:255*k(t,255),g:255*k(e,255),b:255*k(r,255)}}function r(t,e,r){t=k(t,255),e=k(e,255),r=k(r,255);var n,a,i=I(t,e,r),s=D(t,e,r),o=(i+s)/2;if(i==s)n=a=0;else{var l=i-s;switch(a=o>.5?l/(2-i-s):l/(i+s),i){case t:n=(e-r)/l+(r>e?6:0);break;case e:n=(r-t)/l+2;break;case r:n=(t-e)/l+4}n/=6}return{h:n,s:a,l:o}}function n(t,e,r){function n(t,e,r){return 0>r&&(r+=1),r>1&&(r-=1),1/6>r?t+6*(e-t)*r:.5>r?e:2/3>r?t+(e-t)*(2/3-r)*6:t}var a,i,s;if(t=k(t,360),e=k(e,100),r=k(r,100),0===e)a=i=s=r;else{var o=.5>r?r*(1+e):r+e-r*e,l=2*r-o;a=n(l,o,t+1/3),i=n(l,o,t),s=n(l,o,t-1/3)}return{r:255*a,g:255*i,b:255*s}}function a(t,e,r){t=k(t,255),e=k(e,255),r=k(r,255);var n,a,i=I(t,e,r),s=D(t,e,r),o=i,l=i-s;if(a=0===i?0:l/i,i==s)n=0;else{switch(i){case t:n=(e-r)/l+(r>e?6:0);break;case e:n=(r-t)/l+2;break;case r:n=(t-e)/l+4}n/=6}return{h:n,s:a,v:o}}function i(t,e,r){t=6*k(t,360),e=k(e,100),r=k(r,100);var n=j.floor(t),a=t-n,i=r*(1-e),s=r*(1-a*e),o=r*(1-(1-a)*e),l=n%6,c=[r,s,i,i,o,r][l],f=[o,r,r,s,i,i][l],u=[i,i,o,r,r,s][l];return{r:255*c,g:255*f,b:255*u}}function s(t,e,r,n){var a=[M(E(t).toString(16)),M(E(e).toString(16)),M(E(r).toString(16))];return n&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function o(t,e,r,n){var a=[M(H(n)),M(E(t).toString(16)),M(E(e).toString(16)),M(E(r).toString(16))];return a.join("")}function l(t,e){e=0===e?0:e||10;var r=B(t).toHsl();return r.s-=e/100,r.s=S(r.s),B(r)}function c(t,e){e=0===e?0:e||10;var r=B(t).toHsl();return r.s+=e/100,r.s=S(r.s),B(r)}function f(t){return B(t).desaturate(100)}function u(t,e){e=0===e?0:e||10;var r=B(t).toHsl();return r.l+=e/100,r.l=S(r.l),B(r)}function h(t,e){e=0===e?0:e||10;var r=B(t).toRgb();return r.r=I(0,D(255,r.r-E(255*-(e/100)))),r.g=I(0,D(255,r.g-E(255*-(e/100)))),r.b=I(0,D(255,r.b-E(255*-(e/100)))),B(r)}function d(t,e){e=0===e?0:e||10;var r=B(t).toHsl();return r.l-=e/100,r.l=S(r.l),B(r)}function p(t,e){var r=B(t).toHsl(),n=(E(r.h)+e)%360;return r.h=0>n?360+n:n,B(r)}function g(t){var e=B(t).toHsl();return e.h=(e.h+180)%360,B(e)}function b(t){var e=B(t).toHsl(),r=e.h;return[B(t),B({h:(r+120)%360,s:e.s,l:e.l}),B({h:(r+240)%360,s:e.s,l:e.l})]}function v(t){var e=B(t).toHsl(),r=e.h;return[B(t),B({h:(r+90)%360,s:e.s,l:e.l}),B({h:(r+180)%360,s:e.s,l:e.l}),B({h:(r+270)%360,s:e.s,l:e.l})]}function m(t){var e=B(t).toHsl(),r=e.h;return[B(t),B({h:(r+72)%360,s:e.s,l:e.l}),B({h:(r+216)%360,s:e.s,l:e.l})]}function y(t,e,r){e=e||6,r=r||30;var n=B(t).toHsl(),a=360/r,i=[B(t)];for(n.h=(n.h-(a*e>>1)+720)%360;--e;)n.h=(n.h+a)%360,i.push(B(n));return i}function w(t,e){e=e||6;for(var r=B(t).toHsv(),n=r.h,a=r.s,i=r.v,s=[],o=1/e;e--;)s.push(B({h:n,s:a,v:i})),i=(i+o)%1;return s}function _(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function x(t){return t=parseFloat(t),(isNaN(t)||0>t||t>1)&&(t=1),t}function k(t,e){P(t)&&(t="100%");var r=A(t);return t=D(e,I(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),j.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function S(t){return D(1,I(0,t))}function C(t){return parseInt(t,16)}function P(t){return"string"==typeof t&&-1!=t.indexOf(".")&&1===parseFloat(t)}function A(t){return"string"==typeof t&&-1!=t.indexOf("%")}function M(t){return 1==t.length?"0"+t:""+t}function R(t){return 1>=t&&(t=100*t+"%"),t}function H(t){return Math.round(255*parseFloat(t)).toString(16)}function F(t){return C(t)/255}function T(t){t=t.replace(O,"").replace(q,"").toLowerCase();var e=!1;if(L[t])t=L[t],e=!0;else if("transparent"==t)return{r:0,g:0,b:0,a:0,format:"name"};var r;return(r=V.rgb.exec(t))?{r:r[1],g:r[2],b:r[3]}:(r=V.rgba.exec(t))?{r:r[1],g:r[2],b:r[3],a:r[4]}:(r=V.hsl.exec(t))?{h:r[1],s:r[2],l:r[3]}:(r=V.hsla.exec(t))?{h:r[1],s:r[2],l:r[3],a:r[4]}:(r=V.hsv.exec(t))?{h:r[1],s:r[2],v:r[3]}:(r=V.hsva.exec(t))?{h:r[1],s:r[2],v:r[3],a:r[4]}:(r=V.hex8.exec(t))?{a:F(r[1]),r:C(r[2]),g:C(r[3]),b:C(r[4]),format:e?"name":"hex8"}:(r=V.hex6.exec(t))?{r:C(r[1]),g:C(r[2]),b:C(r[3]),format:e?"name":"hex"}:(r=V.hex3.exec(t))?{r:C(r[1]+""+r[1]),g:C(r[2]+""+r[2]),b:C(r[3]+""+r[3]),format:e?"name":"hex"}:!1}var O=/^[\s,#]+/,q=/\s+$/,N=0,j=Math,E=j.round,D=j.min,I=j.max,z=j.random,B=function(e,r){if(e=e?e:"",r=r||{},e instanceof B)return e;if(!(this instanceof B))return new B(e,r);var n=t(e);this._originalInput=e,this._r=n.r,this._g=n.g,this._b=n.b,this._a=n.a,this._roundA=E(100*this._a)/100,this._format=r.format||n.format,this._gradientType=r.gradientType,this._r<1&&(this._r=E(this._r)),this._g<1&&(this._g=E(this._g)),this._b<1&&(this._b=E(this._b)),this._ok=n.ok,this._tc_id=N++};B.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},setAlpha:function(t){return this._a=x(t),this._roundA=E(100*this._a)/100,this},toHsv:function(){var t=a(this._r,this._g,this._b);return{h:360*t.h,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=a(this._r,this._g,this._b),e=E(360*t.h),r=E(100*t.s),n=E(100*t.v);return 1==this._a?"hsv("+e+", "+r+"%, "+n+"%)":"hsva("+e+", "+r+"%, "+n+"%, "+this._roundA+")"},toHsl:function(){var t=r(this._r,this._g,this._b);return{h:360*t.h,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=r(this._r,this._g,this._b),e=E(360*t.h),n=E(100*t.s),a=E(100*t.l);return 1==this._a?"hsl("+e+", "+n+"%, "+a+"%)":"hsla("+e+", "+n+"%, "+a+"%, "+this._roundA+")"},toHex:function(t){return s(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(){return o(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:E(this._r),g:E(this._g),b:E(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+E(this._r)+", "+E(this._g)+", "+E(this._b)+")":"rgba("+E(this._r)+", "+E(this._g)+", "+E(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:E(100*k(this._r,255))+"%",g:E(100*k(this._g,255))+"%",b:E(100*k(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+E(100*k(this._r,255))+"%, "+E(100*k(this._g,255))+"%, "+E(100*k(this._b,255))+"%)":"rgba("+E(100*k(this._r,255))+"%, "+E(100*k(this._g,255))+"%, "+E(100*k(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:K[s(this._r,this._g,this._b,!0)]||!1},toFilter:function(t){var e="#"+o(this._r,this._g,this._b,this._a),r=e,n=this._gradientType?"GradientType = 1, ":"";if(t){var a=B(t);r=a.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+n+"startColorstr="+e+",endColorstr="+r+")"},toString:function(t){var e=!!t;t=t||this._format;var r=!1,n=this._a<1&&this._a>=0,a=!e&&n&&("hex"===t||"hex6"===t||"hex3"===t||"name"===t);return a?"name"===t&&0===this._a?this.toName():this.toRgbString():("rgb"===t&&(r=this.toRgbString()),"prgb"===t&&(r=this.toPercentageRgbString()),("hex"===t||"hex6"===t)&&(r=this.toHexString()),"hex3"===t&&(r=this.toHexString(!0)),"hex8"===t&&(r=this.toHex8String()),"name"===t&&(r=this.toName()),"hsl"===t&&(r=this.toHslString()),"hsv"===t&&(r=this.toHsvString()),r||this.toHexString())},_applyModification:function(t,e){var r=t.apply(null,[this].concat([].slice.call(e)));return this._r=r._r,this._g=r._g,this._b=r._b,this.setAlpha(r._a),this},lighten:function(){return this._applyModification(u,arguments)},brighten:function(){return this._applyModification(h,arguments)},darken:function(){return this._applyModification(d,arguments)},desaturate:function(){return this._applyModification(l,arguments)},saturate:function(){return this._applyModification(c,arguments)},greyscale:function(){return this._applyModification(f,arguments)},spin:function(){return this._applyModification(p,arguments)},_applyCombination:function(t,e){return t.apply(null,[this].concat([].slice.call(e)))},analogous:function(){return this._applyCombination(y,arguments)},complement:function(){return this._applyCombination(g,arguments)},monochromatic:function(){return this._applyCombination(w,arguments)},splitcomplement:function(){return this._applyCombination(m,arguments)},triad:function(){return this._applyCombination(b,arguments)},tetrad:function(){return this._applyCombination(v,arguments)}},B.fromRatio=function(t,e){if("object"==typeof t){var r={};for(var n in t)t.hasOwnProperty(n)&&("a"===n?r[n]=t[n]:r[n]=R(t[n]));t=r}return B(t,e)},B.equals=function(t,e){return t&&e?B(t).toRgbString()==B(e).toRgbString():!1},B.random=function(){return B.fromRatio({r:z(),g:z(),b:z()})},B.mix=function(t,e,r){r=0===r?0:r||50;var n,a=B(t).toRgb(),i=B(e).toRgb(),s=r/100,o=2*s-1,l=i.a-a.a;n=o*l==-1?o:(o+l)/(1+o*l),n=(n+1)/2;var c=1-n,f={r:i.r*n+a.r*c,g:i.g*n+a.g*c,b:i.b*n+a.b*c,a:i.a*s+a.a*(1-s)};return B(f)},B.readability=function(t,e){var r=B(t),n=B(e),a=r.toRgb(),i=n.toRgb(),s=r.getBrightness(),o=n.getBrightness(),l=Math.max(a.r,i.r)-Math.min(a.r,i.r)+Math.max(a.g,i.g)-Math.min(a.g,i.g)+Math.max(a.b,i.b)-Math.min(a.b,i.b);return{brightness:Math.abs(s-o),color:l}},B.isReadable=function(t,e){var r=B.readability(t,e);return r.brightness>125&&r.color>500},B.mostReadable=function(t,e){for(var r=null,n=0,a=!1,i=0;i<e.length;i++){var s=B.readability(t,e[i]),o=s.brightness>125&&s.color>500,l=3*(s.brightness/125)+s.color/500;(o&&!a||o&&a&&l>n||!o&&!a&&l>n)&&(a=o,n=l,r=B(e[i]))}return r};var L=B.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},K=B.hexNames=_(L),V=function(){var t="[-\\+]?\\d+%?",e="[-\\+]?\\d*\\.\\d+%?",r="(?:"+e+")|(?:"+t+")",n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?",a="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+a),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+a),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+a),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();window.tinycolor=B}(),t(function(){t.fn.spectrum.load&&t.fn.spectrum.processNativeColorInputs()})});
//#/////#//
//# MD5 #//
//#/////#//
var md5=function(r){function n(r,n){return r<<n|r>>>32-n}function t(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,t=1073741824&r,o=1073741824&n,f=(1073741823&r)+(1073741823&n),t&o?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function o(r,n,t){return r&n|~r&t}function e(r,n,t){return r&t|n&~t}function u(r,n,t){return r^n^t}function f(r,n,t){return n^(r|~t)}function i(r,e,u,f,i,a,c){return r=t(r,t(t(o(e,u,f),i),c)),t(n(r,a),e)}function a(r,o,u,f,i,a,c){return r=t(r,t(t(e(o,u,f),i),c)),t(n(r,a),o)}function c(r,o,e,f,i,a,c){return r=t(r,t(t(u(o,e,f),i),c)),t(n(r,a),o)}function C(r,o,e,u,i,a,c){return r=t(r,t(t(f(o,e,u),i),c)),t(n(r,a),o)}function g(r){for(var n,t=r.length,o=t+8,e=(o-o%64)/64,u=16*(e+1),f=Array(u-1),i=0,a=0;t>a;)n=(a-a%4)/4,i=a%4*8,f[n]=f[n]|r.charCodeAt(a)<<i,a++;return n=(a-a%4)/4,i=a%4*8,f[n]=f[n]|128<<i,f[u-2]=t<<3,f[u-1]=t>>>29,f}function h(r){var n,t,o="",e="";for(t=0;3>=t;t++)n=r>>>8*t&255,e="0"+n.toString(16),o+=e.substr(e.length-2,2);return o}function d(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):o>127&&2048>o?(n+=String.fromCharCode(o>>6|192),n+=String.fromCharCode(63&o|128)):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128),n+=String.fromCharCode(63&o|128))}return n}var v,m,S,l,A,s,y,b,p,w=Array(),L=7,j=12,k=17,q=22,x=5,z=9,B=14,D=20,E=4,F=11,G=16,H=23,I=6,J=10,K=15,M=21;for(r=d(r),w=g(r),s=1732584193,y=4023233417,b=2562383102,p=271733878,v=0;v<w.length;v+=16)m=s,S=y,l=b,A=p,s=i(s,y,b,p,w[v+0],L,3614090360),p=i(p,s,y,b,w[v+1],j,3905402710),b=i(b,p,s,y,w[v+2],k,606105819),y=i(y,b,p,s,w[v+3],q,3250441966),s=i(s,y,b,p,w[v+4],L,4118548399),p=i(p,s,y,b,w[v+5],j,1200080426),b=i(b,p,s,y,w[v+6],k,2821735955),y=i(y,b,p,s,w[v+7],q,4249261313),s=i(s,y,b,p,w[v+8],L,1770035416),p=i(p,s,y,b,w[v+9],j,2336552879),b=i(b,p,s,y,w[v+10],k,4294925233),y=i(y,b,p,s,w[v+11],q,2304563134),s=i(s,y,b,p,w[v+12],L,1804603682),p=i(p,s,y,b,w[v+13],j,4254626195),b=i(b,p,s,y,w[v+14],k,2792965006),y=i(y,b,p,s,w[v+15],q,1236535329),s=a(s,y,b,p,w[v+1],x,4129170786),p=a(p,s,y,b,w[v+6],z,3225465664),b=a(b,p,s,y,w[v+11],B,643717713),y=a(y,b,p,s,w[v+0],D,3921069994),s=a(s,y,b,p,w[v+5],x,3593408605),p=a(p,s,y,b,w[v+10],z,38016083),b=a(b,p,s,y,w[v+15],B,3634488961),y=a(y,b,p,s,w[v+4],D,3889429448),s=a(s,y,b,p,w[v+9],x,568446438),p=a(p,s,y,b,w[v+14],z,3275163606),b=a(b,p,s,y,w[v+3],B,4107603335),y=a(y,b,p,s,w[v+8],D,1163531501),s=a(s,y,b,p,w[v+13],x,2850285829),p=a(p,s,y,b,w[v+2],z,4243563512),b=a(b,p,s,y,w[v+7],B,1735328473),y=a(y,b,p,s,w[v+12],D,2368359562),s=c(s,y,b,p,w[v+5],E,4294588738),p=c(p,s,y,b,w[v+8],F,2272392833),b=c(b,p,s,y,w[v+11],G,1839030562),y=c(y,b,p,s,w[v+14],H,4259657740),s=c(s,y,b,p,w[v+1],E,2763975236),p=c(p,s,y,b,w[v+4],F,1272893353),b=c(b,p,s,y,w[v+7],G,4139469664),y=c(y,b,p,s,w[v+10],H,3200236656),s=c(s,y,b,p,w[v+13],E,681279174),p=c(p,s,y,b,w[v+0],F,3936430074),b=c(b,p,s,y,w[v+3],G,3572445317),y=c(y,b,p,s,w[v+6],H,76029189),s=c(s,y,b,p,w[v+9],E,3654602809),p=c(p,s,y,b,w[v+12],F,3873151461),b=c(b,p,s,y,w[v+15],G,530742520),y=c(y,b,p,s,w[v+2],H,3299628645),s=C(s,y,b,p,w[v+0],I,4096336452),p=C(p,s,y,b,w[v+7],J,1126891415),b=C(b,p,s,y,w[v+14],K,2878612391),y=C(y,b,p,s,w[v+5],M,4237533241),s=C(s,y,b,p,w[v+12],I,1700485571),p=C(p,s,y,b,w[v+3],J,2399980690),b=C(b,p,s,y,w[v+10],K,4293915773),y=C(y,b,p,s,w[v+1],M,2240044497),s=C(s,y,b,p,w[v+8],I,1873313359),p=C(p,s,y,b,w[v+15],J,4264355552),b=C(b,p,s,y,w[v+6],K,2734768916),y=C(y,b,p,s,w[v+13],M,1309151649),s=C(s,y,b,p,w[v+4],I,4149444226),p=C(p,s,y,b,w[v+11],J,3174756917),b=C(b,p,s,y,w[v+2],K,718787259),y=C(y,b,p,s,w[v+9],M,3951481745),s=t(s,m),y=t(y,S),b=t(b,l),p=t(p,A);var N=h(s)+h(y)+h(b)+h(p);return N.toLowerCase()};
/////////////////

