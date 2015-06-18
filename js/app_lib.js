$.ajaxSetup({ xhr: function() {return new window.XMLHttpRequest({mozSystem: true}); }, cache: false, crossDomain: true, async:true});
//#////////////#//
//# APP OBJECT #//
//#////////////#//
// SET USER //
//////////////
/*
var appUser = ('mud_default###default').split('###');
if(!window.localStorage.getItem('app_current_user')) {
	window.localStorage.setItem('app_current_user','mud_default###default###' + new Date().getTime());
} else {
	appUser = window.localStorage.getItem('app_current_user').split('###');	
}
*/
var app = {
	width: window.innerWidth,
	height: window.innerHeight,
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
	//user: window.localStorage.getItem('app_current_user').split('###'),
	dev: window.localStorage.getItem('config_debug') === 'active' ? true : false,
	is: {},
	config: {},
	db: {},
	tab: {},
	get: {},
	call: {},
	exec: {},
	info: {},
	exists: function(targetId) {
		if(targetId) {
			targetId = targetId.replace('#','');
		}
		if(document.getElementById(targetId)) { 
			return true;
		} else {
			return false;
		}
	},
	ua:   navigator.userAgent,
	http: /http/i.test(window.location.protocol) ? true : false,
	https: /https/i.test(window.location.protocol) ? 'https://' : 'http://',
	now: function() {
		return new Date().getTime();
	},
	define: function(key,value) {
		//MULTIUSER
		/*
		if(!/mud_default/i.test(app.user)) {
			//protect superglobals
			if(!/remoteSuperBlock|autoupdate|app_build|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/.test(key)) {
				key = app.user[0] + '_' + key;
			}
		}
		*/
		//
		if(!window.localStorage.getItem(key)) {
			window.localStorage.setItem(key,value);
			return false;
		}
		return true;
	},
	rows: { 
		entry: [],
		food: []
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
		//
		//localforage wrapper
		if(/diary_entry|diary_food/.test(key)) {
			if(typeof localforageDB !== 'undefined') {
				localforage.getItem(key,function(err, rows) {
					if(err) {
						errorHandler(err);
					} else {
						app.returner(value,rows);
					}
				});
			} else {
				localforage.getItem(key,function(rows) {
					app.returner(value,rows);
				});
			}
			return;
		}
		//
		//OBJECT
		if(type == 'object') {
			if(!window.localStorage.getItem(key)) {
				return [];
			}
			var keyValue = window.localStorage.getItem(key);
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
			if(window.localStorage.getItem(key) == value) {
				return true;
			} else {
				return false;
			}
		}
		if(!window.localStorage.getItem(key)) {
			return false;
		} else {
			if(isNaN(Number(window.localStorage.getItem(key)))) {
				return window.localStorage.getItem(key);
			} else {
				return Number(window.localStorage.getItem(key));
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
		//
		//localforage wrapper
		if(/diary_entry|diary_food/.test(key)) {
			app.returner(type,value);
			app.timeout(key,1000,function() {
				localforage.setItem(key,value);
			});
			return;
		}
		//OBJECT
		if(type == 'object') {
			if(value) {
				window.localStorage.setItem(key,JSON.stringify(value));
			}
			return;	
		}
		//
		if(window.localStorage.getItem(key) != value) {
			window.localStorage.setItem(key,value);
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
		if(window.localStorage.getItem(key)) {
			window.localStorage.removeItem(key);
		}
	},
	clear : function () {
		app.define('config_install_time', app.now());
		var keys = Object.keys(window.localStorage);
		for (var i = 0; i < keys.length; i++) {
			//cached keys
			if (!(/app_build|app_autoupdate_hash|remoteSuperBlockCSS|remoteSuperBlockJS/i).test(keys[i]) || window.localStorage.getItem('config_autoupdate') !== 'on') {
				//protected keys
				if(!/autoupdate|debug|been_dev|config_install_time|app_current_user|app_userlist|app_restart_pending|consecutive_reboots/i.test(keys[i])) {
					//MULTIUSER
					/*
					//remove current user settings
					if (keys[i].contains(app.user[0])) {
						window.localStorage.removeItem(keys[i]);
					}
					//remove default user settings
					if(app.user.id === 'mud_default' && !keys[i].contains(app.user.id)) {
						window.localStorage.removeItem(keys[i]);
					}
					*/
					window.localStorage.removeItem(keys[i]);
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
	}
};
///////////////////
// CUSTOM JQUERY //
///////////////////
$.prototype.html2 = function (data, callback) {
	var selector = this.selector;
	if(selector.indexOf('#') !== -1 && selector.indexOf(' ') === -1) {
		var el = document.getElementById(selector.replace('#',''));
		if(el) {
			if(el.innerHTML != data) {
				safeExec(function () {
					el.innerHTML = data;
				});
			}
		}
	} else {
		var obj = $(selector);
		if (obj.length) {
			if (obj.html() !== data) {
				safeExec(function () {
					obj.html(data);
				});
			}
		}
	}
	if (typeof callback === 'function') {
		callback();
	}
};
$.prototype.append2 = function (data, callback) {
	var obj = $(this);
	if (obj.length) {
		safeExec(function () {
			obj.append(data);
			if (typeof callback === 'function') {
				callback();
			}
		});
	}
};
$.prototype.prepend2 = function (data, callback) {
	var obj = $(this);
	if (obj.length) {
		safeExec(function () {
			obj.prepend(data);
			if (typeof callback === 'function') {
				callback();
			}
		});
	}
};
$.prototype.before2 = function (data, callback) {
	var obj = $(this);
	if (obj.length) {
		safeExec(function () {
			obj.before(data);
			if (typeof callback === 'function') {
				callback();
			}
		});
	}
};
$.prototype.after2 = function (data, callback) {
	var obj = $(this);
	if (obj.length) {
		safeExec(function () {
			obj.after(data);
			if (typeof callback === 'function') {
				callback();
			}
		});
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
				window.localStorage.removeItem('app_current_user');
		//first use
		} else if(!app.read('app_userlist')) {
			app.save('app_userlist',newUserLine)
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
				app.save('app_userlist',app.read('app_userlist') + newUserLine)
				app.save('app_current_user',trim(newUserLine));
			}
		}
		//	
		$('body').css('opacity',0);
		noTimer = 'active';
		setTimeout(function() {
			window.location.reload(true);
		},0);
	}
};
/////////////////
// SWIPE EVENT //
/////////////////
app.swipe = function (elem, callback) {
	//$(elem).swipe('destroy');
	$(elem).swipe({
		swipe : function (evt, direction) {
			if (direction == 'left' || direction == 'right') {
			if (typeof callback === 'function') {
				var that = this;
				callback(that,evt,direction);
			}
			}
		},
		threshold : 32,
		allowPageScroll: 'vertical'
	});
};
///////////////
// TAP EVENT //
///////////////
app.tap = function (elem, callback) {
	//$(elem).swipe('destroy');
	$(elem).swipe({
		tap : function(evt) {
			if (typeof callback === 'function') {
				var that = this;
				callback(that,evt);
			}
		}
	});
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
	android    : (/Android/i).test(app.ua) ? app.get.androidVersion() : false,
	android2   : (/Android/i).test(app.ua) && app.get.androidVersion() < 4 ? true : false,
	ios        : (/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	ios7       : (/OS [7-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	ios8       : (/OS [8-9](.*) like Mac OS X/i).test(app.ua) || (/OS [10](.*) like Mac OS X/i).test(app.ua) ? true : false,
	linux      : (/X11/i).test(navigator.userAgent) && (/Linux/i).test(navigator.userAgent) && !(/Android/i).test(navigator.userAgent) ? true : false,
	wp8        : (/IEMobile/i).test(app.ua) ? true : false,
	wp81       : (/Windows Phone 8.1/i).test(app.ua) ? true : false,
	wp81JS     : (/Windows Phone 8.1/i).test(app.ua) && (/MSApp/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	firefoxos  : ((/firefox/i).test(app.ua) && (/mobile|tablet/i).test(app.ua) && (/gecko/i).test(app.ua)) ? true : false,
	osx        : ((/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua)) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,	
	chromeos   : app.get.isChromeApp() ? true : false,
	blackberry : ((/BB10|BlackBerry|All Touch/i).test(app.ua)) ? true : false,
	amazon     : (/Amazon|FireOS/i).test(app.ua) ? true : false,
	desktop    : ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Mobile|Touch/i.test(app.ua) || (document.createTouch)) && !/Windows NT/.test(app.ua)) ? false : true
};
//STATIC
if(typeof staticVendor !== 'undefined') {
	if(staticVendor == 'blackberry' && (/Android/i).test(app.ua)) {
		app.device.blackberry = true;
	}
	if(staticVendor == 'amazon' && (/Android/i).test(app.ua)) {
		app.device.amazon = true;	
	}	
}
//////////////////////
// GLOBAL SHORTCUTS //
//////////////////////
app.get.platform = function(noweb) {
	if(app.device.ios && app.http)     { return 'web';              }
	if(app.device.android && app.http) { return 'web';              }
	if(app.device.wp8 && app.http)     { return 'web';              }
	if(app.device.linux)               { return 'Linux';            }
	if(app.device.ios)                 { return 'iOS';              }
	if(app.device.amazon)              { return 'Android (Amazon)'; }
	if(app.device.wp8)                 { return 'Windows Phone';    }
	if(app.device.windows8)            { return 'Windows 8';        }
	if(app.device.blackberry)          { return 'BlackBerry';       }
	if(app.device.android)             { return 'Android';          }
	if(app.device.firefoxos)           { return 'FirefoxOS';        }	
	if(app.device.osxapp)              { return 'Mac';              }
	if(app.device.chromeos)            { return 'ChromeOS';         }
	return 'web';
};
////////////////////
// GLOBAL BOOLEAN //
////////////////////
app.is.scrollable = ($.nicescroll && !app.device.ios && !app.device.wp8 && !app.device.firefoxos && !app.device.windows8T && app.device.android < 4.4) ? true : false;
//&& !app.device.blackberry 
//////////////////
// APP.REBOOT() //
//////////////////
app.reboot = function(type,error) {
	var timeout = type == 'now' ? 0 : 500;
	if(type == 'now') {	
		$('body').css('opacity',0);
	}
	if(error) {
		app.analytics('error','rebootHandler: ' + JSON.stringify(error));
		//throw error;
	}
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
		if(app.device.android >= 3) {
			if(typeof window.MyReload !== 'undefined') {
				window.MyReload.reloadActivity();
			} else {
				window.location.reload(true);	
			}
		} else {
			window.location.reload(true);
		}
	},timeout);
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
	if($('#skipIntro').length)		{ return; }
	if(app.globals.blockInfo == 1)	{ return; }
	if (app.read('info_' + title) && !app.dev) {
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
app.url = function(url) {
	//STORES
	var store = {
		web:        'http://kcals.net',
		ios:        'https://itunes.apple.com/app/id732382802',
		android:    'https://play.google.com/store/apps/details?id=com.cancian.kcals',
		wp8:        'http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e',
		windows8:   app.device.windows8 ? 'ms-windows-store:REVIEW?PFN=27631189-ce9d-444e-a46b-31b8f294f14e' : 'http://apps.microsoft.com/windows/app/27631189-ce9d-444e-a46b-31b8f294f14e',
		firefoxos:  'https://marketplace.firefox.com/app/kcals',
		osxapp:     app.device.osx ? 'macappstores://itunes.apple.com/app/id898749118' : 'https://itunes.apple.com/app/id898749118',
		chromeos:   'https://chrome.google.com/webstore/detail/kcals-calorie-counter/ipifmjfbmblepifflinikiiboakalboc/reviews',
		blackberry: app.device.blackberry ? 'appworld://content/59937667' : 'http://appworld.blackberry.com/webstore/content/59937667',
		amazon:     'http://www.amazon.com/Kcals-net-KCals-Calorie-Counter/dp/B00NDSQIHK/qid=1411265533'
	};
	//SHORTCUT
	     if((!url && app.device.ios)        || url == 'ios')        { url = store.ios;        }
	else if((!url && app.device.amazon)     || url == 'amazon')     { url = store.amazon; store.android = store.amazon; }
	else if((!url && app.device.blackberry) || url == 'blackberry') { url = store.blackberry; }
	else if((!url && app.device.android)    || url == 'android')    { url = store.android;    }
	else if((!url && app.device.wp8)        || url == 'wp8')        { url = store.wp8;        }
	else if((!url && app.device.windows8)   || url == 'windows8')   { url = store.windows8;   }
	else if((!url && app.device.firefoxos)  || url == 'firefoxos')  { url = store.firefoxos;  }	
	else if((!url && app.device.osxapp)     || url == 'osxapp')     { url = store.osxapp;     }
	else if((!url && app.device.chromeos)   || url == 'chromeos')   { url = store.chromeos;   }
	else if(url == 'www')										    { url = store.web;        }
	//OPEN
	if(url) {
		     if(app.device.ios)			{ window.open(url, '_system', 'location=yes');								}
		else if(app.device.android)		{ window.open(url, '_system', 'location=yes');								}
		else if(app.device.wp8)			{ ref = window.open(url, '_blank', 'location=no');							}
		else if(app.device.windows8)	{ Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(url));	}
		else if(app.device.firefoxos)	{ ref = window.open(url, '_system', 'location=yes');						}
		else if(app.device.osxapp)		{ macgap.app.open(url);														}
		else 							{ window.open(url, '_blank'); 												}
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
var hasSql              = (window.openDatabase && window.localStorage.getItem('config_nodb') !== 'active') ? true : false;
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
var ref;
var preTab;
var afterTab;
var timerKcals;
var rebuildHistory;
var blockModal = false;
var modalTimer;
function voidThis()   { }
function voidMe()     { }
/////////////////
// APP COUNTER //
/////////////////
//app.counter.start();
//app.counter.stop(0,'before callback');
app.counter = {
	startTime: 0,
	start: function() {
		app.counter.startTime = new Date().getTime();
	},
	stop: function(action,msg) {
		if(msg) {
			msg = msg + ':  ';
		} else {
			msg = 0;
		}
		if(action == 1) {
			alert(msg + (new Date().getTime() - app.counter.startTime));
		} else {
			console.log(msg + (new Date().getTime() - app.counter.startTime));
		}
	}
};
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
	activeLastId     : [],
	activeRow : function (target, style, callback,callbackCondition) {
		var t = searchalize(target);
		var isButton = style == 'button' ? 40 : 40;
		if(app.is.scrollable && app.device.desktop) {
			isButton = 1;	
		}
		//RESET
		app.handlers.activeRowTouches[t] = 0;
		app.handlers.activeRowBlock[t]   = 0;
		app.handlers.activeLastId[t]     = '';				
		clearTimeout(app.handlers.activeRowTimer[t]);
		////////////////
		// SET PARENT //
		////////////////
		var targetParent = target;
		if (target.match(' ')) {
			targetParent = target.split(' ')[0] + ', ' + target;
		}
		//////////////
		// TOUCHEND //
		//////////////
		$(target).on(touchend, function (evt) {
			if($(this).hasClass(style) && app.handlers.activeRowBlock[t] == 0) {
				if (typeof callback === 'function') {
					app.handlers.activeRowBlock[t] = 1;
					if(style == 'button') {
						callback(evt);
					} else {
						callback($(this).attr('id'));
					}
					$(this).addClass(style);
					app.handlers.activeLastId[t] = this;
					app.handlers.activeRowTouches[t] = 0;
					app.handlers.activeRowBlock[t]   = 0;
					clearTimeout(app.handlers.activeRowTimer[t]);
					if(style != 'activeOverflow') {
						$(app.handlers.activeLastId[t]).removeClass(style);
					}
				}
			} else {
				app.handlers.activeRowTouches[t] = 0;
				app.handlers.activeRowBlock[t]   = 0;
				clearTimeout(app.handlers.activeRowTimer[t]);
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
					$(app.handlers.activeLastId[t]).removeClass(style);
				}
				var localTarget = this;
				app.handlers.activeRowTouches[t] = 0;
				clearTimeout(app.handlers.activeRowTimer[t]);
				app.handlers.activeRowTimer[t] = setTimeout(function () {
					if (app.handlers.activeRowTouches[t] == 0 && app.handlers.activeRowBlock[t] == 0) {
						$(localTarget).addClass(style);
						app.handlers.activeLastId[t] = localTarget;
					} else {
						$(app.handlers.activeLastId[t]).removeClass(style);
					}
				}, isButton);
				//CALLBACK CONDITION
				if(callbackCondition) {
					if(callbackCondition() === false) {
						clearTimeout(app.handlers.activeRowTimer[t]);
					}
				}
				//no drag
				//if(style == 'button') {
				//	return false;
				//}
			});
		}, 400);
		//////////////////////
		// ROW LEAVE CANCEL //
		//////////////////////
		if(app.device.windows8) {
			$(target).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
				$(app.handlers.activeLastId[t]).removeClass(style);
				clearTimeout(app.handlers.activeRowTimer[t]);
			});
		} else {
			$(targetParent).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
				app.handlers.activeRowTouches[t]++;
				if(!app.device.wp8 && style != 'activeOverflow') {
					clearTimeout(app.handlers.activeRowTimer[t]);
					$(app.handlers.activeLastId[t]).removeClass(style);
				}
			});
		}
		////////////////////////
		// SCROLL/MOVE CANCEL //
		////////////////////////
		if(!app.device.windows8) {
			var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove;
			$(targetParent).on('scroll ' + moveCancel, function (evt) {
				app.handlers.activeRowTouches[t]++;
				clearTimeout(app.handlers.activeRowTimer[t]);
				if (app.handlers.activeRowTouches[t] > 7 || (app.handlers.activeRowTouches[t] > 1 && app.device.android)) {
					$(app.handlers.activeLastId[t]).removeClass(style);
					if(app.device.osxapp || app.device.osx) {
						$('.activeOverflow').removeClass(style);
					}
					app.handlers.activeRowTouches[t] = 0;
				}
			});
		}
		///////////////////////
		// SCROLL TIME BLOCK //
		///////////////////////
		$(targetParent).on('scroll', function (evt) {
			app.handlers.activeRowBlock[t] = 1;
			setTimeout(function () {
				app.handlers.activeRowBlock[t] = 0;
			}, 100);
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
		var lastRowId = '';
		var i = data.length;
		//data = data.reverse();
		while(i--) {
			/////////////////////
			// FILTER REPEATED //
			/////////////////////
			if (data[i].id && data[i].id !== lastRowId) {
				lastRowId = data[i].id;
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
						rowSql += "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + data[i].id + ",'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + data[i].kcal + "','" + data[i].pro + "','" + data[i].car + "','" + data[i].fat + "','" + data[i].fib + ",'" + data[i].fii + ",'" + data[i].sug + ",'" + data[i].sod + "');\n";
					}
				}
			}
		}
		///////////////
		// WRITE SQL //
		///////////////
		if(filter) {
			//PREPARE
			if(rowSql == '') {
				rowSql = ' ';	
			}
			rowSql = rowSql.split('undefined').join('');
			//
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
				//rowHtml = '<span id="noMatches"> ' + LANG.NO_ENTRIES[lang] +' </span>'; //
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
		var clearActions = touchend + ' mouseout mouseleave touchleave touchcancel';
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
function getIsDesktop() {
}
var isItDesktop = getIsDesktop();
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
document.addEventListener("DOMContentLoaded", function(event) {
	$('body').addClass('domcontentloaded');
},false);
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobileCordova    = (typeof cordova != 'undefined' || typeof Cordova != 'undefined') ? true : false;
var isMobileAndroid    = (/Android/i).test(userAgent) ? true : false;
var isMobileiOS        = (/(iPhone|iPad|iPod)/i).test(userAgent) ? true : false;
var isMobileWindows    = (/IEMobile/i).test(userAgent) ? true : false;
var isMobileWP81       = (/Windows Phone 8.1/i).test(userAgent) ? true : false;
var isMobileMSApp      = (/MSApp/i).test(userAgent) ? true : false;
var isMobileFirefoxOS  = ((/firefox/i).test(userAgent) && (/mobile/i).test(userAgent) && (/gecko/i).test(userAgent)) ? true : false;
var isMobileOSX        = ((/(Macintosh|Mac OS X)/i).test(userAgent) && !(/(iPhone|iPad|iPod)/i).test(userAgent)) ? true : false;
var isMobileOSXApp     = (/MacGap/i).test(userAgent) ? true : false;
var isMobileBlackBerry = (/BB10|BlackBerry/i).test(userAgent) ? true : false;
var isMobile = {
	Cordova: function() {
		return isMobileCordova;
	},
	Android: function() {
		return isMobileAndroid;
	},
	iOS: function() {
		return isMobileiOS;
	},
	Windows: function() {
		return isMobileWindows;
	},
	WP81: function() {
		return isMobileWP81;
	},	
	MSApp: function() {
		return isMobileMSApp;
	},	
	FirefoxOS: function() {
		return isMobileFirefoxOS;
	},
	OSX: function() {
		return isMobileOSX;
	},
	OSXApp: function() {
		return isMobileOSXApp;
	},
	BlackBerry: function() {
		return isMobileBlackBerry;
	},	
	ChromeApp: function() {
		if(chrome) {
			if(chrome.app) {
				if(chrome.app.isInstalled) {
					 return true;	
				}
			}
		}
		return false;
	}
};
//#///////////////#//
//# GET USERAGENT #//
//#///////////////#//
var prefix;
var vendorClass; 
var transitionend;
     if((/trident|IEMobile/i).test(app.ua))	{ prefix = '-ms-';     transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/Firefox/i).test(app.ua))			{ prefix = '-moz-';    transitionend = 'transitionend';       vendorClass = 'moz';    }
else										{ prefix = '-webkit-'; transitionend = 'webkitTransitionEnd'; vendorClass = 'webkit'; } 
///////////////////////////////////
// STANDALONE CONVERT CSS PREFIX //
///////////////////////////////////
if (!$("#plainLoad").length && !$("#superBlockCSS").length && isCurrentCacheValid !== 1) {
	if (vendorClass == "moz" || vendorClass == "msie") {
		var cssPath = (typeof JScompress === 'undefined') ? 'css/index.css' : 'css/min/index.css';
		$.support.cors = true;
		$.ajax({
			url : hostLocal + cssPath,
			dataType : "text",
			success : function (dataCSS) {
				if(vendorClass == 'moz') {
					dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
					dataCSS = dataCSS.split('-webkit-').join('-moz-');
				}
				if(vendorClass == 'msie') {
					dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
					dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
					dataCSS = dataCSS.split('-webkit-').join('-ms-');
				}
				$("#coreCss").remove();
				$("#coreFonts").prepend2("<style type='text/css' id='coreCss'></style>");
				$("#coreCss").html2(dataCSS);
			}
		});
	}
};
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
//test
try {
	document.createEvent('TouchEvent');
	app.touch = true;
} catch (e) {
	app.touch = false;
}
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

var varHasTouch = !app.http && (/(iPhone|iPod|iPad|Android|BlackBerry)/).test(userAgent);
function hasTouch() {
	return varHasTouch;
}
var varHasTap = (('ontouchstart' in document) || ('ontouchstart' in window));
function hasTap() {
	//if(app.device.linux) {
	//	return varHasTap ? false : true;
	//}
	return varHasTap;
}
var touchstart  = hasTap() ? 'touchstart'  : 'mousedown';
var touchend    = hasTap() ? 'touchend'    : 'mouseup';
var touchmove   = hasTap() ? 'touchmove'   : 'mousemove';
var tap         = hasTap() ? 'tap'         : 'click';
var doubletap   = hasTap() ? 'doubleTap'   : 'dblclick';
var touchcancel = hasTap() ? 'touchcancel' : 'touchcancel';
var touchleave  = hasTap() ? 'touchleave'  : 'mouseleave';
var touchout    = hasTap() ? 'touchout'    : 'mouseout';

if(window.PointerEvent) {
	//IE11
	touchend    = 'pointerup';
	touchstart  = 'pointerdown';	
	touchmove   = 'pointermove';
	touchcancel = 'pointercancel';
	touchleave  = 'pointerleave';
	touchout    = 'pointerout';
} else if (window.MSPointerEvent) {
	//IE10
	touchend    = 'MSPointerUp';
	touchstart  = 'MSPointerDown';	
	touchmove   = 'MSPointerMove';
	touchcancel = 'MSPointerOver';
	touchleave  = 'MSPointerLeave';
	touchout    = 'MSPointerOut';	
}
//
if (app.device.firefoxos) {
	tap = 'click';
}
///////////////
// SAFE EXEC //
///////////////
app.safeExec = function (callback) {
	if (app.device.windows8) {
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
function errorHandler(error) {
	if (window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if (app.device.windows8) {
			if (typeof alert !== 'undefined') {
				alert(JSON.stringify(error));
			}
		} else {
			if (confirm(JSON.stringify(error))) {
				blockAlerts = 0;
			} else {
				blockAlerts = 1;
			}
		}
		console.log('errorHandler: ' + JSON.stringify(error));
	} else {
		app.analytics('error','errorHandler: ' + JSON.stringify(error));
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
	if(keyCode != 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
		return false;
	}
	return true;
}
app.handlers.validate = function(target,config,preProcess,postProcess,focusProcess,blurProcess) {
	var inputHandler = (app.device.android == 4.1 || app.device.wp8) ? 'keydown' : 'keypress';
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
		if(keyCode == 13)								{ $(this).blur(); return true; }
		//MINUS INVERTER
		if(keyCode == 45 && config.inverter == true)	{ $(this).val( $(this).val()*-1 ); return false; }
		if(keyCode == 46 && config.inverter == true)	{ $(this).val( $(this).val()*-1 ); return false; }
		//DOT
		if(keyCode == 46 || (keyCode == 190 && app.device.wp8)) {
			if(config.allowDots != true || keydownValue.split('.').join('').length < keydownValue.length) {
				return false;
			}
			return true;
		}
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
				$(this).val( Math.abs($(this).val()) )
			}
		}
		//limit to 2 decimals
		if(($(this).val()).contains('.')) {
			var number = $(this).val().split('.');
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
//////////
// TRIM //
//////////
function trim(str) {
	if(str) { 
		if(str.length) {
			str = str.replace(/^\s+/, '');
			str = str.replace(/(^[ \t]*\n)/gm, "");
			for(var i = str.length - 1; i >= 0; i--) {
				if(/\S/.test(str.charAt(i))) {
				str = str.substring(0, i + 1);
				break;
			}
		}
		return str;
		}
	}
	return '';
}
function trimDot(x) {
	if(x.length) {
		return x.replace(/\.$/, '').replace(/\,$/, '');
	}
}
//////////////
// HIGHLIGH //
//////////////
function highlight(targetId,startColor,endColor,fadeTime) {
	//$(targetId).animate({backgroundColor : "#ff8"}, 1).animate({backgroundColor : "rgba(255,255,255,0.36)"}, 1500);
	if(!startColor) { startColor = '#ff8'; }
	if(!endColor)   { endColor   = 'rgba(255,255,255,0.36)'; }
	if(!fadeTime)   { fadeTime   = 1500; }
	$(targetId).animate({backgroundColor : startColor}, 1).animate({backgroundColor: endColor}, fadeTime);
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
	if((Math.round(Number(val) *  10)  / 10) == 0 && p == -1) { return '0';    }
	if((Math.round(Number(val) *  10)  / 10) == 0 && p == 1)  { return '0.0';  }
	if((Math.round(Number(val) * 100) / 100) == 0)			  { return '0.00'; }
	if(p == 1)				{
		return Math.round(Number(val) * 10) / 10;
	}
	return Math.round(Number(val) * 100) / 100;
}
/////////////
// TOASCII //
/////////////
(function(){var e=false;var t="_";toAscii=function(e){if(e===null){return""}var t="";for(var i=0;i<e.length;i++){var s=n(e,i);if(s){if(s<128){t+=String.fromCharCode(s)}else{t+=r(s)}}}return t};var n=function(e,t){t=t||0;var n=e.charCodeAt(t);var r,i;if(55296<=n&&n<=56319){r=n;i=e.charCodeAt(t+1);if(isNaN(i)){throw"High surrogate not followed by low surrogate in fixedCharCodeAt()"}return(r-55296)*1024+(i-56320)+65536}if(56320<=n&&n<=57343){return false}return n};var r=function(n){var r="";switch(n){case 192:case 193:case 194:case 195:case 196:case 197:case 256:case 258:case 260:case 399:case 461:case 478:case 480:case 506:case 512:case 514:case 550:case 570:case 7424:case 7680:case 7840:case 7842:case 7844:case 7846:case 7848:case 7850:case 7852:case 7854:case 7856:case 7858:case 7860:case 7862:case 9398:case 65313:r+="A";break;case 224:case 225:case 226:case 227:case 228:case 229:case 257:case 259:case 261:case 462:case 479:case 481:case 507:case 513:case 515:case 551:case 592:case 601:case 602:case 7567:case 7573:case 7681:case 7834:case 7841:case 7843:case 7845:case 7847:case 7849:case 7851:case 7853:case 7855:case 7857:case 7859:case 7861:case 7863:case 8336:case 8340:case 9424:case 11365:case 11375:case 65345:r+="a";break;case 42802:r+="A";r+="A";break;case 198:case 482:case 508:case 7425:r+="A";r+="E";break;case 42804:r+="A";r+="O";break;case 42806:r+="A";r+="U";break;case 42808:case 42810:r+="A";r+="V";break;case 42812:r+="A";r+="Y";break;case 9372:r+="(";r+="a";r+=")";break;case 42803:r+="a";r+="a";break;case 230:case 483:case 509:case 7426:r+="a";r+="e";break;case 42805:r+="a";r+="o";break;case 42807:r+="a";r+="u";break;case 42809:case 42811:r+="a";r+="v";break;case 42813:r+="a";r+="y";break;case 385:case 386:case 579:case 665:case 7427:case 7682:case 7684:case 7686:case 9399:case 65314:r+="B";break;case 384:case 387:case 595:case 7532:case 7552:case 7683:case 7685:case 7687:case 9425:case 65346:r+="b";break;case 9373:r+="(";r+="b";r+=")";break;case 199:case 262:case 264:case 266:case 268:case 391:case 571:case 663:case 7428:case 7688:case 9400:case 65315:r+="C";break;case 231:case 263:case 265:case 267:case 269:case 392:case 572:case 597:case 7689:case 8580:case 9426:case 42814:case 42815:case 65347:r+="c";break;case 9374:r+="(";r+="c";r+=")";break;case 208:case 270:case 272:case 393:case 394:case 395:case 7429:case 7430:case 7690:case 7692:case 7694:case 7696:case 7698:case 9401:case 42873:case 65316:r+="D";break;case 240:case 271:case 273:case 396:case 545:case 598:case 599:case 7533:case 7553:case 7569:case 7691:case 7693:case 7695:case 7697:case 7699:case 9427:case 42874:case 65348:r+="d";break;case 452:case 497:r+="D";r+="Z";break;case 453:case 498:r+="D";r+="z";break;case 9375:r+="(";r+="d";r+=")";break;case 568:r+="d";r+="b";break;case 454:case 499:case 675:case 677:r+="d";r+="z";break;case 200:case 201:case 202:case 203:case 274:case 276:case 278:case 280:case 282:case 398:case 400:case 516:case 518:case 552:case 582:case 7431:case 7700:case 7702:case 7704:case 7706:case 7708:case 7864:case 7866:case 7868:case 7870:case 7872:case 7874:case 7876:case 7878:case 9402:case 11387:case 65317:r+="E";break;case 232:case 233:case 234:case 235:case 275:case 277:case 279:case 281:case 283:case 477:case 517:case 519:case 553:case 583:case 600:case 603:case 604:case 605:case 606:case 666:case 7432:case 7570:case 7571:case 7572:case 7701:case 7703:case 7705:case 7707:case 7709:case 7865:case 7867:case 7869:case 7871:case 7873:case 7875:case 7877:case 7879:case 8337:case 9428:case 11384:case 65349:r+="e";break;case 9376:r+="(";r+="e";r+=")";break;case 401:case 7710:case 9403:case 42800:case 42875:case 43003:case 65318:r+="F";break;case 402:case 7534:case 7554:case 7711:case 7835:case 9429:case 42876:case 65350:r+="f";break;case 9377:r+="(";r+="f";r+=")";break;case 64256:r+="f";r+="f";break;case 64259:r+="f";r+="f";r+="i";break;case 64260:r+="f";r+="f";r+="l";break;case 64257:r+="f";r+="i";break;case 64258:r+="f";r+="l";break;case 284:case 286:case 288:case 290:case 403:case 484:case 485:case 486:case 487:case 500:case 610:case 667:case 7712:case 9404:case 42877:case 42878:case 65319:r+="G";break;case 285:case 287:case 289:case 291:case 501:case 608:case 609:case 7543:case 7545:case 7555:case 7713:case 9430:case 42879:case 65351:r+="g";break;case 9378:r+="(";r+="g";r+=")";break;case 292:case 294:case 542:case 668:case 7714:case 7716:case 7718:case 7720:case 7722:case 9405:case 11367:case 11381:case 65320:r+="H";break;case 293:case 295:case 543:case 613:case 614:case 686:case 687:case 7715:case 7717:case 7719:case 7721:case 7723:case 7830:case 9431:case 11368:case 11382:case 65352:r+="h";break;case 502:r+="H";r+="V";break;case 9379:r+="(";r+="h";r+=")";break;case 405:r+="h";r+="v";break;case 204:case 205:case 206:case 207:case 296:case 298:case 300:case 302:case 304:case 406:case 407:case 463:case 520:case 522:case 618:case 7547:case 7724:case 7726:case 7880:case 7882:case 9406:case 43006:case 65321:r+="I";break;case 236:case 237:case 238:case 239:case 297:case 299:case 301:case 303:case 305:case 464:case 521:case 523:case 616:case 7433:case 7522:case 7548:case 7574:case 7725:case 7727:case 7881:case 7883:case 8305:case 9432:case 65353:r+="i";break;case 306:r+="I";r+="J";break;case 9380:r+="(";r+="i";r+=")";break;case 307:r+="i";r+="j";break;case 308:case 584:case 7434:case 9407:case 65322:r+="J";break;case 309:case 496:case 567:case 585:case 607:case 644:case 669:case 9433:case 11388:case 65354:r+="j";break;case 9381:r+="(";r+="j";r+=")";break;case 310:case 408:case 488:case 7435:case 7728:case 7730:case 7732:case 9408:case 11369:case 42816:case 42818:case 42820:case 65323:r+="K";break;case 311:case 409:case 489:case 670:case 7556:case 7729:case 7731:case 7733:case 9434:case 11370:case 42817:case 42819:case 42821:case 65355:r+="k";break;case 9382:r+="(";r+="k";r+=")";break;case 313:case 315:case 317:case 319:case 321:case 573:case 671:case 7436:case 7734:case 7736:case 7738:case 7740:case 9409:case 11360:case 11362:case 42822:case 42824:case 42880:case 65324:r+="L";break;case 314:case 316:case 318:case 320:case 322:case 410:case 564:case 619:case 620:case 621:case 7557:case 7735:case 7737:case 7739:case 7741:case 9435:case 11361:case 42823:case 42825:case 42881:case 65356:r+="l";break;case 455:r+="L";r+="J";break;case 7930:r+="L";r+="L";break;case 456:r+="L";r+="j";break;case 9383:r+="(";r+="l";r+=")";break;case 457:r+="l";r+="j";break;case 7931:r+="l";r+="l";break;case 682:r+="l";r+="s";break;case 683:r+="l";r+="z";break;case 412:case 7437:case 7742:case 7744:case 7746:case 9410:case 11374:case 43005:case 43007:case 65325:r+="M";break;case 623:case 624:case 625:case 7535:case 7558:case 7743:case 7745:case 7747:case 9436:case 65357:r+="m";break;case 9384:r+="(";r+="m";r+=")";break;case 209:case 323:case 325:case 327:case 330:case 413:case 504:case 544:case 628:case 7438:case 7748:case 7750:case 7752:case 7754:case 9411:case 65326:r+="N";break;case 241:case 324:case 326:case 328:case 329:case 331:case 414:case 505:case 565:case 626:case 627:case 7536:case 7559:case 7749:case 7751:case 7753:case 7755:case 8319:case 9437:case 65358:r+="n";break;case 458:r+="N";r+="J";break;case 459:r+="N";r+="j";break;case 9385:r+="(";r+="n";r+=")";break;case 460:r+="n";r+="j";break;case 210:case 211:case 212:case 213:case 214:case 216:case 332:case 334:case 336:case 390:case 415:case 416:case 465:case 490:case 492:case 510:case 524:case 526:case 554:case 556:case 558:case 560:case 7439:case 7440:case 7756:case 7758:case 7760:case 7762:case 7884:case 7886:case 7888:case 7890:case 7892:case 7894:case 7896:case 7898:case 7900:case 7902:case 7904:case 7906:case 9412:case 42826:case 42828:case 65327:r+="O";break;case 242:case 243:case 244:case 245:case 246:case 248:case 333:case 335:case 337:case 417:case 466:case 491:case 493:case 511:case 525:case 527:case 555:case 557:case 559:case 561:case 596:case 629:case 7446:case 7447:case 7575:case 7757:case 7759:case 7761:case 7763:case 7885:case 7887:case 7889:case 7891:case 7893:case 7895:case 7897:case 7899:case 7901:case 7903:case 7905:case 7907:case 8338:case 9438:case 11386:case 42827:case 42829:case 65359:r+="o";break;case 338:case 630:r+="O";r+="E";break;case 42830:r+="O";r+="O";break;case 546:case 7445:r+="O";r+="U";break;case 9386:r+="(";r+="o";r+=")";break;case 339:case 7444:r+="o";r+="e";break;case 42831:r+="o";r+="o";break;case 547:r+="o";r+="u";break;case 420:case 7448:case 7764:case 7766:case 9413:case 11363:case 42832:case 42834:case 42836:case 65328:r+="P";break;case 421:case 7537:case 7549:case 7560:case 7765:case 7767:case 9439:case 42833:case 42835:case 42837:case 43004:case 65360:r+="p";break;case 9387:r+="(";r+="p";r+=")";break;case 586:case 9414:case 42838:case 42840:case 65329:r+="Q";break;case 312:case 587:case 672:case 9440:case 42839:case 42841:case 65361:r+="q";break;case 9388:r+="(";r+="q";r+=")";break;case 569:r+="q";r+="p";break;case 340:case 342:case 344:case 528:case 530:case 588:case 640:case 641:case 7449:case 7450:case 7768:case 7770:case 7772:case 7774:case 9415:case 11364:case 42842:case 42882:case 65330:r+="R";break;case 341:case 343:case 345:case 529:case 531:case 589:case 636:case 637:case 638:case 639:case 7523:case 7538:case 7539:case 7561:case 7769:case 7771:case 7773:case 7775:case 9441:case 42843:case 42883:case 65362:r+="r";break;case 9389:r+="(";r+="r";r+=")";break;case 346:case 348:case 350:case 352:case 536:case 7776:case 7778:case 7780:case 7782:case 7784:case 9416:case 42801:case 42885:case 65331:r+="S";break;case 347:case 349:case 351:case 353:case 383:case 537:case 575:case 642:case 7540:case 7562:case 7777:case 7779:case 7781:case 7783:case 7785:case 7836:case 7837:case 9442:case 42884:case 65363:r+="s";break;case 7838:r+="S";r+="S";break;case 9390:r+="(";r+="s";r+=")";break;case 223:r+="s";r+="s";break;case 64262:r+="s";r+="t";break;case 354:case 356:case 358:case 428:case 430:case 538:case 574:case 7451:case 7786:case 7788:case 7790:case 7792:case 9417:case 42886:case 65332:r+="T";break;case 355:case 357:case 359:case 427:case 429:case 539:case 566:case 647:case 648:case 7541:case 7787:case 7789:case 7791:case 7793:case 7831:case 9443:case 11366:case 65364:r+="t";break;case 222:case 42854:r+="T";r+="H";break;case 42792:r+="T";r+="Z";break;case 9391:r+="(";r+="t";r+=")";break;case 680:r+="t";r+="c";break;case 254:case 7546:case 42855:r+="t";r+="h";break;case 678:r+="t";r+="s";break;case 42793:r+="t";r+="z";break;case 217:case 218:case 219:case 220:case 360:case 362:case 364:case 366:case 368:case 370:case 431:case 467:case 469:case 471:case 473:case 475:case 532:case 534:case 580:case 7452:case 7550:case 7794:case 7796:case 7798:case 7800:case 7802:case 7908:case 7910:case 7912:case 7914:case 7916:case 7918:case 7920:case 9418:case 65333:r+="U";break;case 249:case 250:case 251:case 252:case 361:case 363:case 365:case 367:case 369:case 371:case 432:case 468:case 470:case 472:case 474:case 476:case 533:case 535:case 649:case 7524:case 7577:case 7795:case 7797:case 7799:case 7801:case 7803:case 7909:case 7911:case 7913:case 7915:case 7917:case 7919:case 7921:case 9444:case 65365:r+="u";break;case 9392:r+="(";r+="u";r+=")";break;case 7531:r+="u";r+="e";break;case 434:case 581:case 7456:case 7804:case 7806:case 7932:case 9419:case 42846:case 42856:case 65334:r+="V";break;case 651:case 652:case 7525:case 7564:case 7805:case 7807:case 9445:case 11377:case 11380:case 42847:case 65366:r+="v";break;case 42848:r+="V";r+="Y";break;case 9393:r+="(";r+="v";r+=")";break;case 42849:r+="v";r+="y";break;case 372:case 503:case 7457:case 7808:case 7810:case 7812:case 7814:case 7816:case 9420:case 11378:case 65335:r+="W";break;case 373:case 447:case 653:case 7809:case 7811:case 7813:case 7815:case 7817:case 7832:case 9446:case 11379:case 65367:r+="w";break;case 9394:r+="(";r+="w";r+=")";break;case 7818:case 7820:case 9421:case 65336:r+="X";break;case 7565:case 7819:case 7821:case 8339:case 9447:case 65368:r+="x";break;case 9395:r+="(";r+="x";r+=")";break;case 221:case 374:case 376:case 435:case 562:case 590:case 655:case 7822:case 7922:case 7924:case 7926:case 7928:case 7934:case 9422:case 65337:r+="Y";break;case 253:case 255:case 375:case 436:case 563:case 591:case 654:case 7823:case 7833:case 7923:case 7925:case 7927:case 7929:case 7935:case 9448:case 65369:r+="y";break;case 9396:r+="(";r+="y";r+=")";break;case 377:case 379:case 381:case 437:case 540:case 548:case 7458:case 7824:case 7826:case 7828:case 9423:case 11371:case 42850:case 65338:r+="Z";break;case 378:case 380:case 382:case 438:case 541:case 549:case 576:case 656:case 657:case 7542:case 7566:case 7825:case 7827:case 7829:case 9449:case 11372:case 42851:case 65370:r+="z";break;case 9397:r+="(";r+="z";r+=")";break;case 8304:case 8320:case 9450:case 9471:case 65296:r+="0";break;case 185:case 8321:case 9312:case 9461:case 10102:case 10112:case 10122:case 65297:r+="1";break;case 9352:r+="1";r+=".";break;case 9332:r+="(";r+="1";r+=")";break;case 178:case 8322:case 9313:case 9462:case 10103:case 10113:case 10123:case 65298:r+="2";break;case 9353:r+="2";r+=".";break;case 9333:r+="(";r+="2";r+=")";break;case 179:case 8323:case 9314:case 9463:case 10104:case 10114:case 10124:case 65299:r+="3";break;case 9354:r+="3";r+=".";break;case 9334:r+="(";r+="3";r+=")";break;case 8308:case 8324:case 9315:case 9464:case 10105:case 10115:case 10125:case 65300:r+="4";break;case 9355:r+="4";r+=".";break;case 9335:r+="(";r+="4";r+=")";break;case 8309:case 8325:case 9316:case 9465:case 10106:case 10116:case 10126:case 65301:r+="5";break;case 9356:r+="5";r+=".";break;case 9336:r+="(";r+="5";r+=")";break;case 8310:case 8326:case 9317:case 9466:case 10107:case 10117:case 10127:case 65302:r+="6";break;case 9357:r+="6";r+=".";break;case 9337:r+="(";r+="6";r+=")";break;case 8311:case 8327:case 9318:case 9467:case 10108:case 10118:case 10128:case 65303:r+="7";break;case 9358:r+="7";r+=".";break;case 9338:r+="(";r+="7";r+=")";break;case 8312:case 8328:case 9319:case 9468:case 10109:case 10119:case 10129:case 65304:r+="8";break;case 9359:r+="8";r+=".";break;case 9339:r+="(";r+="8";r+=")";break;case 8313:case 8329:case 9320:case 9469:case 10110:case 10120:case 10130:case 65305:r+="9";break;case 9360:r+="9";r+=".";break;case 9340:r+="(";r+="9";r+=")";break;case 9321:case 9470:case 10111:case 10121:case 10131:r+="1";r+="0";break;case 9361:r+="1";r+="0";r+=".";break;case 9341:r+="(";r+="1";r+="0";r+=")";break;case 9322:case 9451:r+="1";r+="1";break;case 9362:r+="1";r+="1";r+=".";break;case 9342:r+="(";r+="1";r+="1";r+=")";break;case 9323:case 9452:r+="1";r+="2";break;case 9363:r+="1";r+="2";r+=".";break;case 9343:r+="(";r+="1";r+="2";r+=")";break;case 9324:case 9453:r+="1";r+="3";break;case 9364:r+="1";r+="3";r+=".";break;case 9344:r+="(";r+="1";r+="3";r+=")";break;case 9325:case 9454:r+="1";r+="4";break;case 9365:r+="1";r+="4";r+=".";break;case 9345:r+="(";r+="1";r+="4";r+=")";break;case 9326:case 9455:r+="1";r+="5";break;case 9366:r+="1";r+="5";r+=".";break;case 9346:r+="(";r+="1";r+="5";r+=")";break;case 9327:case 9456:r+="1";r+="6";break;case 9367:r+="1";r+="6";r+=".";break;case 9347:r+="(";r+="1";r+="6";r+=")";break;case 9328:case 9457:r+="1";r+="7";break;case 9368:r+="1";r+="7";r+=".";break;case 9348:r+="(";r+="1";r+="7";r+=")";break;case 9329:case 9458:r+="1";r+="8";break;case 9369:r+="1";r+="8";r+=".";break;case 9349:r+="(";r+="1";r+="8";r+=")";break;case 9330:case 9459:r+="1";r+="9";break;case 9370:r+="1";r+="9";r+=".";break;case 9350:r+="(";r+="1";r+="9";r+=")";break;case 9331:case 9460:r+="2";r+="0";break;case 9371:r+="2";r+="0";r+=".";break;case 9351:r+="(";r+="2";r+="0";r+=")";break;case 171:case 187:case 8220:case 8221:case 8222:case 8243:case 8246:case 10077:case 10078:case 10094:case 10095:case 65282:r+='"';break;case 8216:case 8217:case 8218:case 8219:case 8242:case 8245:case 8249:case 8250:case 10075:case 10076:case 65287:r+="'";break;case 8208:case 8209:case 8210:case 8211:case 8212:case 8315:case 8331:case 65293:r+="-";break;case 8261:case 10098:case 65339:r+="[";break;case 8262:case 10099:case 65341:r+="]";break;case 8317:case 8333:case 10088:case 10090:case 65288:r+="(";break;case 11816:r+="(";r+="(";break;case 8318:case 8334:case 10089:case 10091:case 65289:r+=")";break;case 11817:r+=")";r+=")";break;case 10092:case 10096:case 65308:r+="<";break;case 10093:case 10097:case 65310:r+=">";break;case 10100:case 65371:r+="{";break;case 10101:case 65373:r+="}";break;case 8314:case 8330:case 65291:r+="+";break;case 8316:case 8332:case 65309:r+="=";break;case 65281:r+="!";break;case 8252:r+="!";r+="!";break;case 8265:r+="!";r+="?";break;case 65283:r+="#";break;case 65284:r+="$";break;case 8274:case 65285:r+="%";break;case 65286:r+="&";break;case 8270:case 65290:r+="*";break;case 65292:r+=",";break;case 65294:r+=".";break;case 8260:case 65295:r+="/";break;case 65306:r+=":";break;case 8271:case 65307:r+=";";break;case 65311:r+="?";break;case 8263:r+="?";r+="?";break;case 8264:r+="?";r+="!";break;case 65312:r+="@";break;case 65340:r+="\\";break;case 8248:case 65342:r+="^";break;case 65343:r+="_";break;case 8275:case 65374:r+="~";break;default:r+=e?t:String.fromCharCode(n);break}return r}})();
/////////////////
// SEARCHALIZE //
/////////////////
function searchalize(str) {
	if (!str.length) {
		return '';
	}
	str = toAscii(str);
	str = str.split('	').join('');
	str = str.toLowerCase();
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
//////////////
// CONTAINS //
//////////////
String.prototype.contains = function() {
	return String.prototype.indexOf.apply( this, arguments ) !== -1;
};
Array.prototype.contains = function(obj) {
	return JSON.stringify(this).indexOf(obj) > -1;
};
//String.prototype.contains = function(obj) {
//	return this.indexOf(obj) > -1;
//};
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
// OBJECT
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
	//no future dates
	if(date1 > date2) { date1 = new Date().getTime(); }

	//Get 1 day in milliseconds
	var one_day  = 1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = date1;
	var date2_ms = date2;
	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
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

	return LANG.PREAGO[lang] + " " + days + lDays + hours + lHours + minutes + lMinutes + " " + LANG.AGO[lang] + " ";
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
//#//////////////#//
//# ONLINE USERS #//
//#//////////////#//
app.online = function () {
	$.ajax({type: 'GET', dataType: 'text', url: https + 'kcals.net/' + 'update.php?type=usr', success: function(onlineUsers) {
		app.save('online_users',onlineUsers);
		if(app.read('app_last_tab','tab1')) {
			$('#onlineUsers span').html2(app.read('online_users'));
		}
	}});
}
//#//////////////#//
//# BLOCK PIRACY #//
//#//////////////#//
app.piracy = function (force) {
	if (force == 1 || typeof baseVersion === 'undefined' || typeof LANG.BACKUP_AND_SYNC === 'undefined' || baseVersion < 1.9) {
		app.analytics('blocked');
		clearTimeout(app.timers['popTimer']);
		app.timers['popTimer'] = setTimeout(function () {
			appConfirm('Warning! Critical Update!', 'This version of KCals is built on a distribution of Apache Cordova that contains security vulnerabilities. Please update now!', function (button) {
				if (button) {
					if (app.device.android) {
						app.url('android');
					} else if (app.device.ios) {
						app.url('ios');
					} else if (app.device.wp8) {
						app.url('wp8');
					} else if (app.device.amazon) {
						app.url('amazon');
					} else if (app.device.windows8) {
						app.url('windows8');
					} else if (app.device.blackberry) {
						app.url('blackberry');
					} else {
						app.url('web');
					}
				}
			}, LANG.OK[lang], LANG.CANCEL[lang]);
		}, 2000);
	}
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
	if (typeof navigator.notification !== 'undefined' && !app.http && !app.device.windows8) {
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
/*window.navigator.notification.prompt(
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
);*/
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
				if (command.label == ok) {
					callback(2);
				}
				if (command.label == cancel) {
					callback(1);
				}
			})
			.done(function () {
				MSDialog = false;
				if (MSNext.length) {
					appConfirm(MSNext[0][0], MSNext[0][1], MSNext[0][2], MSNext[0][3], MSNext[0][4]);
					MSNext.shift();
				}
			});
		} catch (e) {
			MSDialog = false;
			errorHandler(e);
		}
	////////////////////
	// CORDOVA PLUGIN //
	////////////////////
	} else if (typeof navigator.notification !== 'undefined') {
		navigator.notification.confirm(msg, callback, title, okCancel);
	//////////////
	// FALLBACK //
	//////////////
	} else {
		if (confirm(title + "\n" + msg)) {
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
			url : 'https://kcals.net/mail.php',
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

///////////////////////
// CUSTOM JQUERY TAP //
///////////////////////
$.prototype.tap = function (style, callback, callbackCondition) {
	var target = this.selector;
	var t = searchalize(target);
	var isButton = style == 'button' ? 40 : 40;
	if (app.is.scrollable && app.device.desktop) {
		isButton = 1;
	}
	//RESET
	app.handlers.activeRowTouches[t] = 0;
	app.handlers.activeRowBlock[t] = 0;
	app.handlers.activeLastId[t] = '';
	clearTimeout(app.handlers.activeRowTimer[t]);
	////////////////
	// SET PARENT //
	////////////////
	var targetParent = target;
	if (target.match(' ')) {
		targetParent = target.split(' ')[0] + ', ' + target;
	}
	//////////////
	// TOUCHEND //
	//////////////
	$(target).on(touchend, function (evt) {
		if ($(this).hasClass(style) && app.handlers.activeRowBlock[t] == 0) {
			if (typeof callback === 'function') {
				app.handlers.activeRowBlock[t] = 1;
				if (style == 'button') {
					callback(evt, style);
				} else {
					callback($(this).attr('id'), style);
				}
				$(this).addClass(style);
				app.handlers.activeLastId[t] = this;
				app.handlers.activeRowTouches[t] = 0;
				app.handlers.activeRowBlock[t] = 0;
				clearTimeout(app.handlers.activeRowTimer[t]);
				if (style != 'activeOverflow') {
					$(app.handlers.activeLastId[t]).removeClass(style);
				}
			}
		} else {
			app.handlers.activeRowTouches[t] = 0;
			app.handlers.activeRowBlock[t] = 0;
			clearTimeout(app.handlers.activeRowTimer[t]);
		}
		if (style == 'false') {
			var falseThis = this;
			$(falseThis).css('pointer-events', 'none');
			app.timeout('tapSelect', 500, function () {
				$(falseThis).css('pointer-events', 'auto');
			});
		}
	});
	////////////////
	// TOUCHSTART //
	////////////////
	setTimeout(function () {
		$(target).on(touchstart, function (evt) {
			if (!$(this).hasClass(style)) {
				$(app.handlers.activeLastId[t]).removeClass(style);
			}
			var localTarget = this;
			app.handlers.activeRowTouches[t] = 0;
			clearTimeout(app.handlers.activeRowTimer[t]);
			app.handlers.activeRowTimer[t] = setTimeout(function () {
					if (app.handlers.activeRowTouches[t] == 0 && app.handlers.activeRowBlock[t] == 0) {
						$(localTarget).addClass(style);
						app.handlers.activeLastId[t] = localTarget;
					} else {
						$(app.handlers.activeLastId[t]).removeClass(style);
					}
				}, isButton);
			//CALLBACK CONDITION
			if (callbackCondition) {
				if (callbackCondition() === false) {
					clearTimeout(app.handlers.activeRowTimer[t]);
				}
			}
			//no drag
			//if(style == 'button') {
			//	return false;
			//}
		});
	}, 400);
	//////////////////////
	// ROW LEAVE CANCEL //
	//////////////////////
	if (app.device.windows8) {
		$(target).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
			$(app.handlers.activeLastId[t]).removeClass(style);
			clearTimeout(app.handlers.activeRowTimer[t]);
		});
	} else {
		$(targetParent).on(touchout + ' ' + touchleave + ' ' + touchcancel, function (evt) {
			app.handlers.activeRowTouches[t]++;
			if (!app.device.wp8 && style != 'activeOverflow') {
				clearTimeout(app.handlers.activeRowTimer[t]);
				$(app.handlers.activeLastId[t]).removeClass(style);
			}
		});
	}
	////////////////////////
	// SCROLL/MOVE CANCEL //
	////////////////////////
	if (!app.device.windows8) {
		var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove;
		$(targetParent).on('scroll ' + moveCancel, function (evt) {
			app.handlers.activeRowTouches[t]++;
			clearTimeout(app.handlers.activeRowTimer[t]);
			if (app.handlers.activeRowTouches[t] > 7 || (app.handlers.activeRowTouches[t] > 1 && app.device.android)) {
				$(app.handlers.activeLastId[t]).removeClass(style);
				if (app.device.osxapp || app.device.osx) {
					$('.activeOverflow').removeClass(style);
				}
				app.handlers.activeRowTouches[t] = 0;
			}
		});
	}
	///////////////////////
	// SCROLL TIME BLOCK //
	///////////////////////
	$(targetParent).on('scroll', function (evt) {
		app.handlers.activeRowBlock[t] = 1;
		setTimeout(function () {
			app.handlers.activeRowBlock[t] = 0;
		}, 100);
	});
};
