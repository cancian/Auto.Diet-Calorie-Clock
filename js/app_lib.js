//#////////////#//
//# APP OBJECT #//
//#////////////#//
var app = {
	db: {},
	tab: {},
	get: {},
	call: {},
	exec: {},
	info: {},
	vars: {},
	timer: {},
	is: {},
	handlers: {},
	ua: navigator.userAgent,
	now: function() {
		return new Date().getTime();
	},
	define: function(key,value) {
		if(!window.localStorage.getItem(key)) {
			window.localStorage.setItem(key,value);
			return false;
		}
		return true;
	},
	read: function(key,value) {
		if(typeof value !== 'undefined') {
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
	save: function(key,value) {
		if(window.localStorage.getItem(key) != value) {
			window.localStorage.setItem(key,value);
		}
	},
	remove: function(key) {
		if(window.localStorage.getItem(key)) {
			window.localStorage.removeItem(key);
		}
	},
}
//////////////////
// APP.REBOOT() //
//////////////////
app.reboot = function(e) {
	if(e) {
		errorHandler(e);
		//CLEAR CACHE
		app.remove('remoteSuperBlockJS');
		app.remove('remoteSuperBlockCSS');
		app.remove('app_autoupdate_hash');
	}
	//RELOAD
	if(window.MyReload) {
		window.MyReload.reloadActivity();
	} else {
		window.location.reload(true);
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
		android:    app.device.android ? 'market://details?id=com.cancian.kcals' : 'https://play.google.com/store/apps/details?id=com.cancian.kcals',
		wp8:        'http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e',
		windows8:   app.device.windows8 ? 'ms-windows-store:PDP?PFN=27631189-ce9d-444e-a46b-31b8f294f14e' : 'http://apps.microsoft.com/windows/app/kcals/27631189-ce9d-444e-a46b-31b8f294f14e',
		firefoxos:  'https://marketplace.firefox.com/app/kcals',
		osxapp:     app.device.osx ? 'macappstores://itunes.apple.com/app/id898749118' : 'https://itunes.apple.com/app/id898749118',
		chromeapp:  'https://chrome.google.com/webstore/detail/kcals-calorie-counter/ipifmjfbmblepifflinikiiboakalboc',
		blackberry: app.device.blackberry ? 'appworld://content/59937667' : 'http://appworld.blackberry.com/webstore/content/59937667',
	};
	//SHORTCUT
	     if((!url && app.device.ios)       || url == 'ios')        { url = store.ios;        }
	else if((!url && app.device.android)   || url == 'android')    { url = store.android;    }
	else if((!url && app.device.wp8)       || url == 'wp8')        { url = store.wp8;        }
	else if((!url && app.device.windows8)  || url == 'windows8')   { url = store.windows8;   }
	else if((!url && app.device.firefoxos) || url == 'firefoxos')  { url = store.firefoxos;  }	
	else if((!url && app.device.osxapp)    || url == 'osxapp')     { url = store.osxapp;     }
	else if((!url && app.device.chromeapp) || url == 'chromeapp')  { url = store.chromeapp;  }
	else if((!url && app.device.blackbery) || url == 'blackberry') { url = store.blackberry; }
	else if(url == 'www')										   { url = store.web;        }
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
app.vars.platform = function() {
	     if(app.device.ios)        { return 'iOS';           }
	else if(app.device.android)    { return 'Android';       }
	else if(app.device.wp8)        { return 'Windows Phone'; }
	else if(app.device.windows8)   { return 'Windows 8';     }
	else if(app.device.firefoxos)  { return 'FirefoxOS';     }	
	else if(app.device.osxapp)     { return 'Mac OSX';       }
	else if(app.device.chromeapp)  { return 'ChromeOS';      }
	else if(app.device.blackbery)  { return 'BlackBerry';    }
	else                           { return 'web';           }
};
app.vars.useragent      = navigator.userAgent;
var userAgent           = navigator.userAgent;
var appBalance;
var appBalanceOver;
var appStatus;
var appHeader;
var appFooter;
var db;
var dbName              = "mylivediet.app";
var lib;
var lib2;
var storeEntry;
var storeFood;
var hasSql              = (window.openDatabase && window.localStorage.getItem("config_nodb") != "active") ? true : false;
var AND                 = " ";
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
var rowsEntry = [];
var rowsFood  = [];
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
}
//////////////////
// APP HANDLERS //
//////////////////
app.handlers = {
	//////////////////
	// CSS FADE OUT //
	//////////////////
	fade : function(inOut,target,callback) {
		//PRE-HIDE FADE-IN
		if(inOut == 1) {
			$(target).css(prefix + 'transition-duration', '0s');
			$(target).css('opacity',0);
			$(target).hide();
		}
		////////////////////
		// TRANSITION END //
		////////////////////
		$(target).off(transitionend).on(transitionend,function(evt) {
			if(inOut == 0) {
				$(target).remove();
			} else {
				//fast resizing
				$(target).css(prefix + 'transition-duration', '0s');
			}
			if(callback) {
				callback(evt);
				callback = '';
			}
		});
		//////////////////
		// SET ANIMATED //
		//////////////////
		$(target).css(prefix + 'transition', 'opacity ease .2s');
		///////////////////////////////////
		// SET OPACITY ~ ENFORCE REMOVAL //
		///////////////////////////////////
		if(inOut == 1) {
			$(target).show();
		}
		setTimeout(function(evt) {
			$(target).css('opacity',inOut);
			setTimeout(function(evt) {
				if($(target).length && callback !== '') {
					$(target).trigger(transitionend);
				}
			//ENFORCE
			},300);
		//DEFER
		},0);
	},
	////////////////
	// ACTIVE ROW //
	////////////////
	activeRowTouches : 0,
	activeRowBlock   : 0,
	activeRowTimer   : '',
	activeLastId     : '',
	activeRow : function (target, style, callback,callbackCondition) {
		var isButton = style == 'button' ? 0 : 40;
		//RESET
		app.handlers.activeRowTouches = 0;
		app.handlers.activeRowBlock   = 0;
		clearTimeout(app.handlers.activeRowTimer);
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
			if($(this).hasClass(style) && app.handlers.activeRowBlock == 0) {
				if (callback) {
					app.handlers.activeRowBlock = 1;
					if(isButton == 0) {
						callback(evt);
					} else {
						callback($(this).attr('id'));
					}
					$(this).addClass(style);
					app.handlers.activeLastId = '#' + $(this).attr('id');
					app.handlers.activeRowTouches = 0;
					app.handlers.activeRowBlock   = 0;
					clearTimeout(app.handlers.activeRowTimer);
					if(style != 'activeOverflow') {
						$(app.handlers.activeLastId).removeClass(style);
					}
				}
			} else {
				app.handlers.activeRowTouches = 0;
				app.handlers.activeRowBlock   = 0;
				clearTimeout(app.handlers.activeRowTimer);
			}
		});
		////////////////
		// TOUCHSTART //
		////////////////
		setTimeout(function () {
			$(target).on(touchstart, function (evt) {
				if(!$(this).hasClass(style)) {
					$(app.handlers.activeLastId).removeClass(style);
				}
				var localTarget = this;
				app.handlers.activeRowTouches = 0;
				clearTimeout(app.handlers.activeRowTimer);
				app.handlers.activeRowTimer = setTimeout(function () {
					if (app.handlers.activeRowTouches == 0 && app.handlers.activeRowBlock == 0) {
						$(localTarget).addClass(style);
						app.handlers.activeLastId = '#' + $(localTarget).attr('id');
					} else {
						$(app.handlers.activeLastId).removeClass(style);
					}
				}, isButton);
				//CALLBACK CONDITION
				if(callbackCondition) {
					if(callbackCondition() === false) {
						clearTimeout(app.handlers.activeRowTimer);
					}
				}
				if(isButton == 0) {
					return false;
				}
			});
		}, 400);
		//////////////////////
		// ROW LEAVE CANCEL //
		//////////////////////
		if(isMobile.MSApp()) {
			$(target).on('pointerleave pointercancel pointerout', function (evt) {
				$(app.handlers.activeLastId).removeClass(style);
				clearTimeout(app.handlers.activeRowTimer);
			});
		}
		if(!isMobile.MSApp()) {
			$(targetParent).on('mouseout mouseleave touchleave touchcancel', function (evt) {
				app.handlers.activeRowTouches++;
				if(!isMobile.Windows() && style != 'activeOverflow') {
					clearTimeout(app.handlers.activeRowTimer);
					$(app.handlers.activeLastId).removeClass(style);
				}
			});
		}
		////////////////////////
		// SCROLL/MOVE CANCEL //
		////////////////////////
		if(!isMobile.MSApp()) {
			var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove;
			$(targetParent).on('scroll ' + moveCancel, function (evt) {
				app.handlers.activeRowTouches++;
				clearTimeout(app.handlers.activeRowTimer);
				if (app.handlers.activeRowTouches > 7 || (app.handlers.activeRowTouches > 1 && isMobile.Android())) {
					$(app.handlers.activeLastId).removeClass(style);
					if(app.device.osxapp || app.device.osx) {
						$('.activeOverflow').removeClass(style);
					}
					app.handlers.activeRowTouches = 0;
				}
			});
		}
		///////////////////////
		// SCROLL TIME BLOCK //
		///////////////////////
		$(targetParent).on('scroll', function (evt) {
			app.handlers.activeRowBlock = 1;
			setTimeout(function () {
				app.handlers.activeRowBlock = 0;
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
					if(callback) {
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
				data[i].pro  = Math.round(data[i].pro  * 100) / 100;
				data[i].car  = Math.round(data[i].car  * 100) / 100;
				data[i].fat  = Math.round(data[i].fat  * 100) / 100;
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
					rowSql += "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + data[i].id + ",'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + data[i].kcal + "','" + data[i].pro + "','" + data[i].car + "','" + data[i].fat + "','" + data[i].fib + "');\n";
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
				window.localStorage.setItem('customFavSql', rowSql);
			} else {
				window.localStorage.setItem('customItemsSql', rowSql);				
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
			evt.preventDefault();
			$(target).removeClass(style);
			clearTimeout(app.repeaterTrigger);
			clearTimeout(app.repeaterLoop);
		});
		/////////////
		// TRIGGER //
		/////////////
		$(target).off(touchstart).on(touchstart, function (evt) {
			evt.preventDefault();
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
	},
};
/////////////
// APP GET //
/////////////
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
//////////////////
// TOTAL WEIGHT //
//////////////////
app.get.totalweight = function() {
	if (!window.localStorage.getItem('calcForm#pA3B')) {
		return 80;
	}
	if (window.localStorage.getItem('calcForm#pA3C') == 'pounds') {
		return Math.round(parseInt(window.localStorage.getItem('calcForm#pA3B'))/2.2);
	}	
	return parseInt(window.localStorage.getItem('calcForm#pA3B'));
};
app.get.androidVersion = function() {
	if((/Android/i).test(userAgent) && window.location.protocol.indexOf('http') === -1) {
		//android L
		if((/Build\/L/i).test(userAgent)) { return 4.4; }
		return parseFloat(userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
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
}
app.get.isDesktop = function() {
	//first
	var isDesktop = ('DeviceOrientationEvent' in window || 'orientation' in window) ? false : true;
	if(/(Windows NT|Macintosh|Mac OS X|Linux)/i.test(userAgent)) { isDesktop = true; }
	if(/Mobile/i.test(userAgent)) { isDesktop = false; }
	//second
	var a = userAgent || navigator.vendor || window.opera;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|bb10|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) { isDesktop = false; }
	return isDesktop;
}
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
	$('#loadMask').html('<span></span>');
}
document.addEventListener("DOMContentLoaded", function(event) {
	$('body').addClass('domcontentloaded');
});
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobileCordova    = (typeof cordova != 'undefined' || typeof Cordova != 'undefined') ? true : false;
var isMobileAndroid    = (/Android/i).test(userAgent) ? true : false;
var isMobileiOS        = (/(iPhone|iPad|iPod)/i).test(userAgent) ? true : false;
var isMobileWindows    = (/IEMobile/i).test(userAgent) ? true : false;
var isMobileWP81       = (/Windows Phone 8.1/i).test(userAgent) ? true : false;
var isMobileMSApp      = (/MSApp/i).test(userAgent) ? true : false;
var isMobileFirefoxOS  = ((/firefox/).test(userAgent.toLowerCase()) && (/mobile/).test(userAgent.toLowerCase()) && (/gecko/).test(userAgent.toLowerCase())) ? true : false;
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
////////////////
// APP DEVICE //
////////////////
app.device = {
	cordova    : ((typeof cordova || typeof Cordova) !== 'undefined') ? true : false,
	android    : (/Android/i).test(app.ua) ? app.get.androidVersion() : false,
	ios        : (/iPhone|iPad|iPod/i).test(app.ua) ? true : false,
	ios7       : (/OS [7-9](.*) like Mac OS X/i).test(app.ua) ? true : false,
	wp8        : (/IEMobile/i).test(app.ua) ? true : false,
	wp81       : (/Windows Phone 8.1/i).test(app.ua) ? true : false,
	wp81JS     : (/Windows Phone 8.1/i).test(app.ua) && (/MSApp/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IEMobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IEMobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IEMobile/i).test(app.ua) ? true : false,
	firefoxos  : ((/firefox/i).test(app.ua) && (/mobile/i).test(app.ua) && (/gecko/i).test(app.ua)) ? true : false,
	osx        : ((/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua)) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,	
	chromeapp  : app.get.isChromeApp() ? true : false,
	blackberry : (/BB10|BlackBerry/i).test(app.ua) ? true : false,
	mobile     : app.get.isDesktop() ? false : true,
	desktop    : app.get.isDesktop() ? true : false,
};
//#///////////////#//
//# GET USERAGENT #//
//#///////////////#//
var prefix;
var vendorClass; 
var transitionend;
     if((/trident|IEMobile/i).test(app.ua))	{ prefix = '-ms-';     transitionend = 'transitionend';       vendorClass = 'msie';   }
else if((/firefox/i).test(app.ua))			{ prefix = '-moz-';    transitionend = 'transitionend';       vendorClass = 'moz';    }
else										{ prefix = '-webkit-'; transitionend = 'webkitTransitionEnd'; vendorClass = 'webkit'; } 
///////////////////////////////////
// STANDALONE CONVERT CSS PREFIX //
///////////////////////////////////
if (!$("#plainLoad").length && !$("#superBlockCSS").length) {
	if (vendorClass == "moz" || vendorClass == "msie") {
		$.support.cors = true;
		$.ajax({
			url : hostLocal + "css/index.css",
			dataType : "text",
			success : function (rawCss) {
				//moz syntax
				if (vendorClass == "moz") {
					rawCss = rawCss.split('box-sizing').join('-moz-box-sizing');
				}
				//msie backface slowdown
				if (vendorClass == "msie") {
					//rawCss = rawCss.split('-webkit-backface-visibility: hidden;').join('');
				}
				app.safeExec(function () {
					$("#coreCss").remove();
					$("#coreFonts").prepend("<style type='text/css' id='coreCss'></style>");
					$("#coreCss").html(rawCss.split('-webkit-').join('-' + vendorClass.replace("ie", "") + '-'));
				});
			}
		});
	}
}
//#///////////////#//
//# TOUCH ? CLICK #//
//#///////////////#//
function isCordova() {
	return isMobileCordova; //(typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
}
function getAndroidVersion() {
	if((/Android/i).test(userAgent) && window.location.protocol.indexOf('http') === -1) {
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

var varHasTouch = window.location.protocol.indexOf('http') === -1 && (/(iPhone|iPod|iPad|Android|BlackBerry)/).test(userAgent);
function hasTouch() {
	return varHasTouch;
}
var varHasTap = (("ontouchstart" in document) || ("ontouchstart" in window));
function hasTap() {
	return varHasTap;
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
if ((/MSAppHost\/1.0|IEMobile/i).test(userAgent) && !app.device.wp81JS && window.navigator.msPointerEnabled) {
	//touchmove  = "MSPointerMove";
	touchend = "MSPointerUp";
	//touchstart = "MSPointerDown";
}
if (app.device.firefoxos) {
	tap       = 'click';
	singletap = 'click';
}
/*
MSPointerDown			pointerdown
MSPointerUp				pointerup
MSPointerCancel			pointercancel
MSPointerMove			pointermove 
MSPointerOver			pointerover 
MSPointerOut			pointerout 
MSPointerEnter			pointerenter 
MSPointerLeave			pointerleave 
*/
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
}
///////////////////
// ERROR HANDLER //
///////////////////
function errorHandler(error) {
	if (window.localStorage.getItem("config_debug") == "active" && blockAlerts == 0) {
		if (isMobile.MSApp()) {
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
		console.log(JSON.stringify(error));
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
		if(keyCode == 46) {
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
		if($(this).val().length == 0 || parseInt($(this).val()) == 0 || isNaN($(this).val())) {
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
};
//////////
// TRIM //
//////////
function trim(str) {
	if(!str) { return ''; }
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
//////////////
// HIGHLIGH //
//////////////
function highlight(targetId,startColor,endColor,fadeTime) {
	$(targetId).animate({backgroundColor : "#ff8"}, 1).animate({backgroundColor : "rgba(255,255,255,0.36)"}, 1500);
	//if(!startColor) { starColor = '#ff8'; }
	//if(!endColor) { endColor = 'rgba(255,255,255,0.36)'; }
	//if(!fadeTime) { fadeTime = 1500; }
	//$(targetId).animate({backgroundColor : startColor}, 1).animate({backgroundColor: endColor}, fadeTime);
}
////////////////
// CAPITALIZE //
////////////////
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}
///////////
// isOdd //
///////////
function isOdd(int) {
	return int % Math.round(2);
}
////////////////
// DECIMALIZE //
////////////////
function decimalize(int,p) {
	if((Math.round(Number(int) *  10)  / 10) == 0 && p == 1) { return '0.0';  }
	if((Math.round(Number(int) * 100) / 100) == 0)			 { return '0.00'; }
	if(p == 1)				{
		return Math.round(Number(int) * 10) / 10;
	}
	return Math.round(Number(int) * 100) / 100;
}
//////////////
// CONTAINS //
//////////////
String.prototype.contains = function() {
	return String.prototype.indexOf.apply( this, arguments ) !== -1;
};
//Array.prototype.contains = function(obj) {
//	return JSON.stringify(this).indexOf(obj) > -1;
//};
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
}
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
}
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
	if(isMobile.Android() && androidVersion() < 4) {
		$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
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
	app.safeExec(function() {
		$("#cssAutoUpdate").html("\
			.loading #advancedAutoUpdate:before	 { content: '" + LANG.DOWNLOADING[lang]     + loadCounter + "'; }\
			.pending #advancedAutoUpdate:before	 { content: '" + LANG.RESTART_PENDING[lang] + "'; }\
			.uptodate #advancedAutoUpdate:before { content: '" + LANG.UP_TO_DATE[lang]      + "'; }\
			.spinnerMask #loadMask:before		 { content: '" + LANG.PREPARING_DB[lang]    + "'; }\
		");
	});
}
//////////////
// KICKDOWN //
//////////////
function kickDown(el) {
	if(!el) { el = '#appContent'; }
	if(!$('body').hasClass('android2')) {
		if(!isDesktop() || isMobile.MSApp()) {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			//window.scroll($(el)[0].scrollTop,0,0);
		}
	} else {
		$(el).scrollTop($(el).scrollTop());
	}
}
/////////////////
// MSAPP METRO //
/////////////////
if(isMobile.MSApp()) {
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
	/////////////
	// LICENSE //
	/////////////
	function isInAppPurchaseValid(pName) {
		//var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;
		var currentApp    = Windows.ApplicationModel.Store.CurrentApp;
		var inAppLicenses = currentApp.licenseInformation.productLicenses;
		if(inAppLicenses.hasKey(pName)) {
			if(inAppLicenses.lookup(pName).isActive) { 
				return true;
			}
		}
		return false;
	}
}
//#////////////////////////#//
//# Base64 encode / decode #// 
//#////////////////////////#// http://www.webtoolkit.info
var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3,
		enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = Base64._utf8_encode(input);
		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3;
		var enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};
//////////////////// getEntryHtml = Base64.encode(getEntryHtml);
// BASE64 MATCHER // getEntryHtml = Base64.decode(getEntryHtml);
//////////////////// if(base64Matcher.test(getEntryHtml)) {  }
var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
//#////////#//
//# ZIPPER #//
//#////////#//
function zip(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
//UNZIP
function unzip(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}
//##///////////////////##//
//## APP CONFIRM LAYER ##//
//##///////////////////##// appConfirm(title, msg, callback, LANG.OK[lang], LANG.CANCEL[lang]);
var MSDialog;
var MSNext = [];
function appConfirm(title, msg, callback, ok, cancel) { 
	var okCancel = (cancel == 'hide') ? [ok] : [ok, cancel];
	///////////
	// MSAPP //
	///////////
	if (isMobile.MSApp()) {
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
					callback(1);
				}
				if (command.label == cancel) {
					callback(0);
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
			callback(1);
		} else {
			callback(0);
		}
	}
}
/////////////////////
// LOCALFORAGE PRE //
/////////////////////
if(!lfloaded) { var lfloaded = true; !function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)k.push("exports"===i[l]?g={}:b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:void 0===this?window:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:void(c[a]=b)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a;a="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var b="Promise"in a&&"resolve"in a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;return new a.Promise(function(a){b=a}),f(b)}();b||(a.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){if(!v(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof i))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],j(a,this)}function j(a,b){function c(a){o(b,a)}function d(a){q(b,a)}try{a(c,d)}catch(e){d(e)}}function k(a,b,c,d){var e,f,g,h,i=v(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;n(b,e)||(i&&g?o(b,e):h?q(b,f):a===D?o(b,e):a===E&&q(b,e))}function l(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+D]=c,e[f+E]=d}function m(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],k(b,c,d,f);a._subscribers=null}function n(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(u(b)&&(d=b.then,v(d)))return d.call(b,function(d){return c?!0:(c=!0,void(b!==d?o(a,d):p(a,d)))},function(b){return c?!0:(c=!0,void q(a,b))}),!0}catch(e){return c?!0:(q(a,e),!0)}return!1}function o(a,b){a===b?p(a,b):n(a,b)||p(a,b)}function p(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(r,a))}function q(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(s,a))}function r(a){m(a,a._state=D)}function s(a){m(a,a._state=E)}var t=a.config,u=(a.configure,b.objectOrFunction),v=b.isFunction,w=(b.now,c.all),x=d.race,y=e.resolve,z=f.reject,A=g.asap;t.async=A;var B=void 0,C=0,D=1,E=2;i.prototype={constructor:i,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;t.async(function(){k(c._state,d,e[c._state-1],c._detail)})}else l(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},i.all=w,i.race=x,i.resolve=y,i.reject=z,h.Promise=i}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}(),function(){"use strict";function a(a){if(a)for(var b in a)l[b]=a[b];return new j(function(a,b){var c=m.open(l.name,l.version);c.onerror=function(){b(c.error)},c.onupgradeneeded=function(){c.result.createObjectStore(l.storeName)},c.onsuccess=function(){k=c.result,a()}})}function b(a,b){var c=this;return new j(function(d,e){c.ready().then(function(){var c=k.transaction(l.storeName,"readonly").objectStore(l.storeName),f=c.get(a);f.onsuccess=function(){var a=f.result;void 0===a&&(a=null),i(b,a),d(a)},f.onerror=function(){b&&b(null,f.error),e(f.error)}},e)})}function c(a,b,c){var d=this;return new j(function(e,f){d.ready().then(function(){var d=k.transaction(l.storeName,"readwrite").objectStore(l.storeName);null===b&&(b=void 0);var g=d.put(b,a);g.onsuccess=function(){void 0===b&&(b=null),i(c,b),e(b)},g.onerror=function(){c&&c(null,g.error),f(g.error)}},f)})}function d(a,b){var c=this;return new j(function(d,e){c.ready().then(function(){var c=k.transaction(l.storeName,"readwrite").objectStore(l.storeName),f=c["delete"](a);f.onsuccess=function(){i(b),d()},f.onerror=function(){b&&b(f.error),e(f.error)},f.onabort=function(a){var c=a.target.error;"QuotaExceededError"===c&&(b&&b(c),e(c))}},e)})}function e(a){var b=this;return new j(function(c,d){b.ready().then(function(){var b=k.transaction(l.storeName,"readwrite").objectStore(l.storeName),e=b.clear();e.onsuccess=function(){i(a),c()},e.onerror=function(){a&&a(null,e.error),d(e.error)}},d)})}function f(a){var b=this;return new j(function(c,d){b.ready().then(function(){var b=k.transaction(l.storeName,"readonly").objectStore(l.storeName),e=b.count();e.onsuccess=function(){a&&a(e.result),c(e.result)},e.onerror=function(){a&&a(null,e.error),d(e.error)}},d)})}function g(a,b){var c=this;return new j(function(d,e){return 0>a?(b&&b(null),void d(null)):void c.ready().then(function(){var c=k.transaction(l.storeName,"readonly").objectStore(l.storeName),f=!1,g=c.openCursor();g.onsuccess=function(){var c=g.result;return c?void(0===a?(b&&b(c.key),d(c.key)):f?(b&&b(c.key),d(c.key)):(f=!0,c.advance(a))):(b&&b(null),void d(null))},g.onerror=function(){b&&b(null,g.error),e(g.error)}},e)})}function h(a){var b=this;return new j(function(c,d){b.ready().then(function(){var b=k.transaction(l.storeName,"readonly").objectStore(l.storeName),e=b.openCursor(),f=[];e.onsuccess=function(){var b=e.result;return b?(f.push(b.key),void b["continue"]()):(a&&a(f),void c(f))},e.onerror=function(){a&&a(null,e.error),d(e.error)}},d)})}function i(a,b){return a?setTimeout(function(){return a(b)},0):void 0}var j="undefined"!=typeof module&&module.exports?require("promise"):this.Promise,k=null,l={},m=m||this.indexedDB||this.webkitIndexedDB||this.mozIndexedDB||this.OIndexedDB||this.msIndexedDB;if(m){var n={_driver:"asyncStorage",_initStorage:a,getItem:b,setItem:c,removeItem:d,clear:e,length:f,key:g,keys:h};"function"==typeof define&&define.amd?define("asyncStorage",function(){return n}):"undefined"!=typeof module&&module.exports?module.exports=n:this.asyncStorage=n}}.call(this),function(){"use strict";function a(a){if(a)for(var b in a)m[b]=a[b];return l=m.name+"/",n.resolve()}function b(a){var b=this;return new n(function(c,d){b.ready().then(function(){o.clear(),a&&a(),c()},d)})}function c(a,b){var c=this;return new n(function(d,e){c.ready().then(function(){try{var c=o.getItem(l+a);c&&(c=h(c)),b&&b(c),d(c)}catch(f){b&&b(null,f),e(f)}},e)})}function d(a,b){var c=this;return new n(function(d,e){c.ready().then(function(){var c;try{c=o.key(a)}catch(e){c=null}c&&(c=c.substring(l.length)),b&&b(c),d(c)},e)})}function e(a){var b=this;return new n(function(c,d){b.ready().then(function(){for(var b=o.length,d=[],e=0;b>e;e++)d.push(o.key(e).substring(l.length));a&&a(d),c(d)},d)})}function f(a){var b=this;return new n(function(c,d){b.ready().then(function(){var b=o.length;a&&a(b),c(b)},d)})}function g(a,b){var c=this;return new n(function(d,e){c.ready().then(function(){o.removeItem(l+a),b&&b(),d()},e)})}function h(a){if(a.substring(0,r)!==q)return JSON.parse(a);for(var b=a.substring(D),c=a.substring(r,D),d=new ArrayBuffer(2*b.length),e=new Uint16Array(d),f=b.length-1;f>=0;f--)e[f]=b.charCodeAt(f);switch(c){case s:return d;case t:return new Blob([d]);case u:return new Int8Array(d);case v:return new Uint8Array(d);case w:return new Uint8ClampedArray(d);case x:return new Int16Array(d);case z:return new Uint16Array(d);case y:return new Int32Array(d);case A:return new Uint32Array(d);case B:return new Float32Array(d);case C:return new Float64Array(d);default:throw new Error("Unkown type: "+c)}}function i(a){var b="",c=new Uint16Array(a);try{b=String.fromCharCode.apply(null,c)}catch(d){for(var e=0;e<c.length;e++)b+=String.fromCharCode(c[e])}return b}function j(a,b){var c="";if(a&&(c=a.toString()),a&&("[object ArrayBuffer]"===a.toString()||a.buffer&&"[object ArrayBuffer]"===a.buffer.toString())){var d,e=q;a instanceof ArrayBuffer?(d=a,e+=s):(d=a.buffer,"[object Int8Array]"===c?e+=u:"[object Uint8Array]"===c?e+=v:"[object Uint8ClampedArray]"===c?e+=w:"[object Int16Array]"===c?e+=x:"[object Uint16Array]"===c?e+=z:"[object Int32Array]"===c?e+=y:"[object Uint32Array]"===c?e+=A:"[object Float32Array]"===c?e+=B:"[object Float64Array]"===c?e+=C:b(new Error("Failed to get type for BinaryArray"))),b(e+i(d))}else if("[object Blob]"===c){var f=new FileReader;f.onload=function(){var a=i(this.result);b(q+t+a)},f.readAsArrayBuffer(a)}else try{b(JSON.stringify(a))}catch(g){this.console&&this.console.error&&this.console.error("Couldn't convert value into a JSON string: ",a),b(null,g)}}function k(a,b,c){var d=this;return new n(function(e,f){d.ready().then(function(){void 0===b&&(b=null);var d=b;j(b,function(b,g){if(g)c&&c(null,g),f(g);else{try{o.setItem(l+a,b)}catch(h){("QuotaExceededError"===h.name||"NS_ERROR_DOM_QUOTA_REACHED"===h.name)&&(c&&c(null,h),f(h))}c&&c(d),e(d)}})},f)})}var l="",m={},n="undefined"!=typeof module&&module.exports?require("promise"):this.Promise,o=null;try{if(!(this.localStorage&&"setItem"in this.localStorage))return;o=this.localStorage}catch(p){return}var q="__lfsc__:",r=q.length,s="arbf",t="blob",u="si08",v="ui08",w="uic8",x="si16",y="si32",z="ur16",A="ui32",B="fl32",C="fl64",D=r+s.length,E={_driver:"localStorageWrapper",_initStorage:a,getItem:c,setItem:k,removeItem:g,clear:b,length:f,key:d,keys:e};"function"==typeof define&&define.amd?define("localStorageWrapper",function(){return E}):"undefined"!=typeof module&&module.exports?module.exports=E:this.localStorageWrapper=E}.call(this),function(){"use strict";function a(a){var b=this;if(a)for(var c in a)p[c]="string"!=typeof a[c]?a[c].toString():a[c];return new m(function(a,c){try{o=n(p.name,p.version,p.description,p.size)}catch(d){return b.setDriver("localStorageWrapper").then(a,c)}o.transaction(function(b){b.executeSql("CREATE TABLE IF NOT EXISTS "+p.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){a()},function(a,b){c(b)})})})}function b(a,b){var c=this;return new m(function(d,e){c.ready().then(function(){o.transaction(function(c){c.executeSql("SELECT * FROM "+p.storeName+" WHERE key = ? LIMIT 1",[a],function(a,c){var e=c.rows.length?c.rows.item(0).value:null;e&&(e=j(e)),b&&b(e),d(e)},function(a,c){b&&b(null,c),e(c)})})},e)})}function c(a,b,c){var d=this;return new m(function(e,f){d.ready().then(function(){void 0===b&&(b=null);var d=b;k(b,function(b,g){g?f(g):o.transaction(function(g){g.executeSql("INSERT OR REPLACE INTO "+p.storeName+" (key, value) VALUES (?, ?)",[a,b],function(){c&&c(d),e(d)},function(a,b){c&&c(null,b),f(b)})},function(a){a.code===a.QUOTA_ERR&&(c&&c(null,a),f(a))})})},f)})}function d(a,b){var c=this;return new m(function(d,e){c.ready().then(function(){o.transaction(function(c){c.executeSql("DELETE FROM "+p.storeName+" WHERE key = ?",[a],function(){b&&b(),d()},function(a,c){b&&b(c),e(c)})})},e)})}function e(a){var b=this;return new m(function(c,d){b.ready().then(function(){o.transaction(function(b){b.executeSql("DELETE FROM "+p.storeName,[],function(){a&&a(),c()},function(b,c){a&&a(c),d(c)})})},d)})}function f(a){var b=this;return new m(function(c,d){b.ready().then(function(){o.transaction(function(b){b.executeSql("SELECT COUNT(key) as c FROM "+p.storeName,[],function(b,d){var e=d.rows.item(0).c;a&&a(e),c(e)},function(b,c){a&&a(null,c),d(c)})})},d)})}function g(a,b){var c=this;return new m(function(d,e){c.ready().then(function(){o.transaction(function(c){c.executeSql("SELECT key FROM "+p.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,c){var e=c.rows.length?c.rows.item(0).key:null;b&&b(e),d(e)},function(a,c){b&&b(null,c),e(c)})})},e)})}function h(a){var b=this;return new m(function(c,d){b.ready().then(function(){o.transaction(function(b){b.executeSql("SELECT key FROM "+p.storeName,[],function(b,d){for(var e=d.rows.length,f=[],g=0;e>g;g++)f.push(d.rows.item(g).key);a&&a(f),c(f)},function(b,c){a&&a(null,c),d(c)})})},d)})}function i(a){var b,c=new Uint8Array(a),d="";for(b=0;b<c.length;b+=3)d+=l[c[b]>>2],d+=l[(3&c[b])<<4|c[b+1]>>4],d+=l[(15&c[b+1])<<2|c[b+2]>>6],d+=l[63&c[b+2]];return c.length%3===2?d=d.substring(0,d.length-1)+"=":c.length%3===1&&(d=d.substring(0,d.length-2)+"=="),d}function j(a){if(a.substring(0,r)!==q)return JSON.parse(a);var b,c,d,e,f,g=a.substring(D),h=a.substring(r,D),i=.75*g.length,j=g.length,k=0;"="===g[g.length-1]&&(i--,"="===g[g.length-2]&&i--);var m=new ArrayBuffer(i),n=new Uint8Array(m);for(b=0;j>b;b+=4)c=l.indexOf(g[b]),d=l.indexOf(g[b+1]),e=l.indexOf(g[b+2]),f=l.indexOf(g[b+3]),n[k++]=c<<2|d>>4,n[k++]=(15&d)<<4|e>>2,n[k++]=(3&e)<<6|63&f;switch(h){case s:return m;case t:return new Blob([m]);case u:return new Int8Array(m);case v:return new Uint8Array(m);case w:return new Uint8ClampedArray(m);case x:return new Int16Array(m);case z:return new Uint16Array(m);case y:return new Int32Array(m);case A:return new Uint32Array(m);case B:return new Float32Array(m);case C:return new Float64Array(m);default:throw new Error("Unkown type: "+h)}}function k(a,b){var c="";if(a&&(c=a.toString()),a&&("[object ArrayBuffer]"===a.toString()||a.buffer&&"[object ArrayBuffer]"===a.buffer.toString())){var d,e=q;a instanceof ArrayBuffer?(d=a,e+=s):(d=a.buffer,"[object Int8Array]"===c?e+=u:"[object Uint8Array]"===c?e+=v:"[object Uint8ClampedArray]"===c?e+=w:"[object Int16Array]"===c?e+=x:"[object Uint16Array]"===c?e+=z:"[object Int32Array]"===c?e+=y:"[object Uint32Array]"===c?e+=A:"[object Float32Array]"===c?e+=B:"[object Float64Array]"===c?e+=C:b(new Error("Failed to get type for BinaryArray"))),b(e+i(d))}else if("[object Blob]"===c){var f=new FileReader;f.onload=function(){var a=i(this.result);b(q+t+a)},f.readAsArrayBuffer(a)}else try{b(JSON.stringify(a))}catch(g){this.console&&this.console.error&&this.console.error("Couldn't convert value into a JSON string: ",a),b(null,g)}}var l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",m="undefined"!=typeof module&&module.exports?require("promise"):this.Promise,n=this.openDatabase,o=null,p={},q="__lfsc__:",r=q.length,s="arbf",t="blob",u="si08",v="ui08",w="uic8",x="si16",y="si32",z="ur16",A="ui32",B="fl32",C="fl64",D=r+s.length;if(n){var E={_driver:"webSQLStorage",_initStorage:a,getItem:b,setItem:c,removeItem:d,clear:e,length:f,key:g,keys:h};"function"==typeof define&&define.amd?define("webSQLStorage",function(){return E}):"undefined"!=typeof module&&module.exports?module.exports=E:this.webSQLStorage=E}}.call(this),function(){"use strict";var a="undefined"!=typeof module&&module.exports?require("promise"):this.Promise,b=1,c=2,d=3,e=d;"function"==typeof define&&define.amd?e=b:"undefined"!=typeof module&&module.exports&&(e=c);var f=this,g={INDEXEDDB:"asyncStorage",LOCALSTORAGE:"localStorageWrapper",WEBSQL:"webSQLStorage",_config:{description:"",name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},config:function(a){if("object"==typeof a){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var b in a)this._config[b]=a[b];return!0}return"string"==typeof a?this._config[a]:this._config},driver:function(){return this._driver||null},_ready:!1,_driverSet:null,setDriver:function(d,g,h){var i=this,j=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};return j(d)||"string"!=typeof d||(d=[d]),this._driverSet=new a(function(j,k){var l=i._getFirstSupportedDriver(d);if(!l){var m=new Error("No available storage method found.");return i._driverSet=a.reject(m),h&&h(m),void k(m)}if(i._ready=null,e===b)return void require([l],function(a){i._extend(a),g&&g(),j()});if(e===c){var n;switch(l){case i.INDEXEDDB:n=require("./drivers/indexeddb");break;case i.LOCALSTORAGE:n=require("./drivers/localstorage");break;case i.WEBSQL:n=require("./drivers/websql")}i._extend(n)}else i._extend(f[l]);g&&g(),j()}),this._driverSet},_getFirstSupportedDriver:function(a){if(a)for(var b=0;b<a.length;b++){var c=a[b];if(this.supports(c))return c}return null},supports:function(a){return!!h[a]},ready:function(b){var c=new a(function(a,b){g._driverSet.then(function(){null===g._ready&&(g._ready=g._initStorage(g._config)),g._ready.then(a,b)},b)});return c.then(b,b),c},_extend:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b])}},h=function(a){var b=b||a.indexedDB||a.webkitIndexedDB||a.mozIndexedDB||a.OIndexedDB||a.msIndexedDB,c={};return c[g.WEBSQL]=!!a.openDatabase,c[g.INDEXEDDB]=!(!b||"function"!=typeof b.open||null!==b.open("_localforage_spec_test",1).onupgradeneeded),c[g.LOCALSTORAGE]=!!function(){try{return localStorage&&"function"==typeof localStorage.setItem}catch(a){return!1}}(),c}(this),i=[g.INDEXEDDB,g.WEBSQL,g.LOCALSTORAGE];g.setDriver(i),e===b?define(function(){return g}):e===c?module.exports=g:this.localforage=g}.call(this); }

