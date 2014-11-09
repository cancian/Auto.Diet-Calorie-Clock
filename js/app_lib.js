$.ajaxSetup({cache: false, crossDomain: true, async:true});
//#////////////#//
//# APP OBJECT #//
//#////////////#//
var app = {
	width: window.innerWidth,
	height: window.innerHeight,
	globals: {},
	handlers: {},
	timers: {},
	vars: {},
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
		if(!window.localStorage.getItem(key)) {
			window.localStorage.setItem(key,value);
			return false;
		}
		return true;
	},
	read: function(key,value,type) {
		if(type == 'object') {
			if(!window.localStorage.getItem(key)) {
				return [];
			}
			var value = window.localStorage.getItem(key)
			return value && JSON.parse(value);			
			
		}
		//
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
	save: function(key,value,type) {
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
		if(window.localStorage.getItem(key)) {
			window.localStorage.removeItem(key);
		}
	},
	clear: function() {
		app.define('config_install_time',app.now());
		var installTime = app.read('config_install_time');
		window.localStorage.clear();
		app.save('config_install_time',installTime);
	},
	show: function(target,callback) {
		$(target).css('pointer-events','auto');
		$(target).css(prefix + 'transition', 'opacity ease .32s');
		$(target).css('opacity',1);
		setTimeout(function() {
			if(callback) {
				callback(target);	
			}
		},320);
	},
	hide: function(target,callback) {
		$(target).css('pointer-events','none');
		$(target).css(prefix + 'transition', 'opacity ease .12s');
		$(target).css('opacity',0);	
		setTimeout(function() {
			if(callback) {
				callback(target);	
			}
		},120);
	}
}
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
}
app.get.isDesktop = function() {

};
//////////////////
// PRINT OBJECT //
//////////////////
app.print = function(obj, maxDepth, prefix) {
	if(!maxDepth) {
		maxDepth = 3;
	}
	var result = '';
	if (!prefix)
		prefix = '';
	for (var key in obj) {
		if (typeof obj[key] == 'object') {
			if (maxDepth !== undefined && maxDepth <= 1) {
				result += (prefix + key + '=object [max depth reached]\n');
			} else {
				result += app.print(obj[key], (maxDepth) ? maxDepth - 1 : maxDepth, prefix + key + '.');
			}
		} else {
			result += (prefix + key + '=' + obj[key] + '\n');
		}
	}
	return result;
}
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
	wp8        : (/IEMobile/i).test(app.ua) ? true : false,
	wp81       : (/Windows Phone 8.1/i).test(app.ua) ? true : false,
	wp81JS     : (/Windows Phone 8.1/i).test(app.ua) && (/MSApp/i).test(app.ua) ? true : false,
	windows8   : (/MSApp/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	windows81  : (/MSAppHost\/2.0/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua)? true : false,
	windows8T  : (/MSApp/i).test(app.ua) && (/Touch/i).test(app.ua) && !(/IE___Mobile/i).test(app.ua) ? true : false,
	firefoxos  : ((/firefox/i).test(app.ua) && (/mobile/i).test(app.ua) && (/gecko/i).test(app.ua)) ? true : false,
	osx        : ((/Macintosh|Mac OS X/i).test(app.ua) && !(/iPhone|iPad|iPod/i).test(app.ua)) ? true : false,
	osxapp     : (/MacGap/i).test(app.ua) ? true : false,	
	chromeos   : app.get.isChromeApp() ? true : false,
	blackberry : ((/Android/i).test(app.ua) && (/(BB10|BlackBerry|All Touch|10\.)/i).test(app.ua)) ? true : false,
	amazon     : (/Amazon|FireOS/i).test(app.ua) ? true : false,
	desktop    : (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Touch/i.test(app.ua) || document.createTouch) ? false : true,
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
	if(app.device.ios)                 { return 'iOS';              }
	if(app.device.amazon)              { return 'Android (Amazon)'; }
	if(app.device.blackberry)          { return 'BlackBerry';       }
	if(app.device.android)             { return 'Android';          }
	if(app.device.wp8)                 { return 'Windows Phone';    }
	if(app.device.windows8)            { return 'Windows 8';        }
	if(app.device.firefoxos)           { return 'FirefoxOS';        }	
	if(app.device.osxapp)              { return 'Mac';              }
	if(app.device.chromeos)            { return 'ChromeOS';         }
	return 'web';
};
////////////////////
// GLOBAL BOOLEAN //
////////////////////
app.is.scrollable = ($.nicescroll && !app.device.ios && !app.device.wp8 && !app.device.firefoxos && !app.device.windows8T && app.device.android < 4.4) ? true : false;
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
	if(error) {
		throw error;
	}
};
//////////
// ZOOM //
//////////
/**/
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
		appResizer();
		$('.nicescroll-rails').css('display','none');
		clearTimeout(app.timers.zoomRails);
		app.timers.zoomRails = setTimeout(function() {
			$('.nicescroll-rails').css('display','block');
		},400);
	}
};
//app.zoom();

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
		chromeos:   'https://chrome.google.com/webstore/detail/kcals-calorie-counter/ipifmjfbmblepifflinikiiboakalboc',
		blackberry: app.device.blackberry ? 'appworld://content/59937667' : 'http://appworld.blackberry.com/webstore/content/59937667',
		amazon:     'http://www.amazon.com/Kcals-net-KCals-Calorie-Counter/dp/B00NDSQIHK/qid=1411265533',
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
			if(callback) {
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
	activeRowTouches : 0,
	activeRowBlock   : 0,
	activeRowTimer   : '',
	activeLastId     : '',
	activeRow : function (target, style, callback,callbackCondition) {
		var isButton = style == 'button' ? 40 : 40;
		//RESET
		app.handlers.activeRowTouches = 0;
		app.handlers.activeRowBlock   = 0;
		app.handlers.activeLastId     = '';				
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
		if(app.device.windows8) {
			$(target).on('pointerleave pointercancel pointerout', function (evt) {
				$(app.handlers.activeLastId).removeClass(style);
				clearTimeout(app.handlers.activeRowTimer);
			});
		}
		if(!app.device.windows8) {
			$(targetParent).on('mouseout mouseleave touchleave touchcancel', function (evt) {
				app.handlers.activeRowTouches++;
				if(!app.device.wp8 && style != 'activeOverflow') {
					clearTimeout(app.handlers.activeRowTimer);
					$(app.handlers.activeLastId).removeClass(style);
				}
			});
		}
		////////////////////////
		// SCROLL/MOVE CANCEL //
		////////////////////////
		if(!app.device.windows8) {
			var moveCancel = app.device.osxapp || app.device.osx ? 'mouseout' : touchmove;
			$(targetParent).on('scroll ' + moveCancel, function (evt) {
				app.handlers.activeRowTouches++;
				clearTimeout(app.handlers.activeRowTimer);
				if (app.handlers.activeRowTouches > 7 || (app.handlers.activeRowTouches > 1 && app.device.android)) {
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
					if(!rowSql.contains(data[i].id)) {
						rowSql += "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + data[i].id + ",'" + data[i].type + "','" + data[i].code + "','" + data[i].name + "','" + sanitize(data[i].name) + "','" + data[i].kcal + "','" + data[i].pro + "','" + data[i].car + "','" + data[i].fat + "','" + data[i].fib + "');\n";
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
////////////////
// ADD/REMOVE //
////////////////
app.handlers.addRemove = function(target,minValue,maxValue,valueType) {
	if(!minValue) { minValue = 0;    }
	if(!maxValue) { maxValue = 9999; }
	//HTML
	if(!$( target + 'Neg').html()) {
		$(target).before('<p class="neg" id="' + target.replace('#','') + 'Neg"></p><p class="pos" id="' + target.replace('#','') + 'Pos"></p>');
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
	})
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
	})				
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
		saveEntry({raw: true, id: app.now()-(0*day), title: 1300, body: '', published: app.now()-(0*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(1*day), title: 1800, body: '', published: app.now()-(1*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(2*day), title: 1500, body: '', published: app.now()-(2*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(3*day), title: 1000, body: '', published: app.now()-(3*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(4*day), title: 1300, body: '', published: app.now()-(4*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(5*day), title: 1800, body: '', published: app.now()-(5*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(6*day), title: 1300, body: '', published: app.now()-(6*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
		saveEntry({raw: true, id: app.now()-(7*day), title: 1000, body: '', published: app.now()-(7*day), info: '', kcal: '', pro: 12, car: 19, fat: 4, fib: ''});
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
	$('#loadMask').html('\
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
if (!$("#plainLoad").length && !$("#superBlockCSS").length) {
	if (vendorClass == "moz" || vendorClass == "msie") {
		$.support.cors = true;
		$.ajax({
			url : hostLocal + "css/index.css",
			dataType : "text",
			success : function (dataCSS) {
				if(vendorClass == 'moz') {
					dataCSS = dataCSS.split('-webkit-').join('-moz-');
				}
				if(vendorClass == 'msie') {
					dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
					dataCSS = dataCSS.split('-webkit-').join('-ms-');
				}
				app.safeExec(function () {
					$("#coreCss").remove();
					$("#coreFonts").prepend("<style type='text/css' id='coreCss'></style>");
					$("#coreCss").html(dataCSS);
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
if ((/MSAppHost\/1.0|IEMobile/i).test(app.ua) && !app.device.wp81JS && window.navigator.msPointerEnabled) {
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
	if((Math.round(Number(int) *  10)  / 10) == 0 && p == -1) { return '0';    }
	if((Math.round(Number(int) *  10)  / 10) == 0 && p == 1)  { return '0.0';  }
	if((Math.round(Number(int) * 100) / 100) == 0)			  { return '0.00'; }
	if(p == 1)				{
		return Math.round(Number(int) * 10) / 10;
	}
	return Math.round(Number(int) * 100) / 100;
}
/////////////
// TOASCII //
/////////////
function toAscii(newStringComAcento) {
	var string = newStringComAcento;
	var mapaAcentosHex = {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};
	for (var letra in mapaAcentosHex) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace(expressaoRegular, letra);
	}
	return string;
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
	if(app.device.android && app.device.android < 4) {
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
		if(!app.device.desktop || app.device.windows8) {
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

