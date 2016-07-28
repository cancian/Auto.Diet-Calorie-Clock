////////////////////
// DOCUMENT READY //
////////////////////
$(function() {
	///////////////////
	// OPEN DATABASE //
	///////////////////
	var webSQL       = localforage.WEBSQL;
	var indexedDB    = localforage.INDEXEDDB;
	var localStorage = localforage.LOCALSTORAGE;
	var dbDriver     = [indexedDB, webSQL, localStorage];
	/////////////////////
	// FORCE DB ENGINE //
	/////////////////////
	if (app.read('app_database', 'asyncStorage'))			{ dbDriver = [indexedDB, webSQL, localStorage]; }
	if (app.read('app_database', 'webSQLStorage'))			{ dbDriver = [webSQL, indexedDB, localStorage]; }
	if (app.read('app_database', 'localStorageWrapper'))	{ dbDriver = [localStorage, indexedDB, webSQL]; }
	//////////////////////////////
	// MOZ FALLBACK ~ INCOGNITO //
	//////////////////////////////
	app.remove('config_force_localstorage');
	if (vendorClass == 'moz' && app.device.desktop) {
		detectPrivateMode(function (incognito) {
			if (incognito) {
				app.incognito = true;
				dbDriver = [localStorage];
			}
		});
	}
	/*
	localforage.defineDriver(window.cordovaSQLiteDriver).then(function() {
	return localforage.setDriver([
	window.cordovaSQLiteDriver._driver,
	localforage.INDEXEDDB,
	localforage.WEBSQL,
	localforage.LOCALSTORAGE
	]);
	}).then(function() {
	 */
	//CHECK FOR ANOTHER OS GIVING THE SAME ERROR AS FIREFOX ON PRIVATE MODE
	//if(app.read('config_force_localstorage') && (vendorClass !== 'moz' || !app.device.desktop)) { app.remove('config_force_localstorage'); }
	//FORCE DB (USER CHOICE) ~ MULTIUSER
	//var UserDB = 'KCals';
	//if(!/mud_default/i.test(app.user)) { UserDB = UserDB + '_' + app.user[0]; }
	//INSTANCE
	/*
	app.forage = localforage.createInstance({
	driver      : dbDriver,
	name        : 'localforage',
	storeName   : 'KCals',
	description : 'KCals storage engine',
	version     : 1.0,
	});
	 */
	/////////////
	// LOAD DB //
	/////////////
	localforage.config({driver : dbDriver, name : 'localforage', storeName : 'KCals'});
	initDB();
});
////////////////
// RESUME EVT //
////////////////
$(document).on('resume',function(evt) {
	clearTimeout(app.repeaterLoop);
	$('body').css('opacity',1);
	$('body').show();
	//fix locked dbs ~ mobile
	if (!app.device.desktop) {
		if(app.read('startLock','running') && !app.read('foodDbLoaded','done')) {
			app.remove('startLock');
		}
	}
	//
	app.timeout('resume',4000,function() {
		if(typeof app !== 'undefined') {
			//getRateDialog();
			app.analytics('resume');
			//
			updateCustomList('fav');
			updateCustomList('items');
			updateTodayOverview();
			intakeHistory();
			setTimeout(function() {
				updateLoginStatus(1);
				if(typeof buildRemoteSuperBlock !== 'undefined' && app.read('config_autoupdate','on')) {
					buildRemoteSuperBlock('cached');
				}
			},2000);
			//ONLINE USERS
			if(typeof app.online === 'function') {
				app.online();
			}
		}
	},3000);
});
///////////////////////
// VISIBILITY CHANGE //
///////////////////////
$(document).on('visibilitychange focus', function (evt) {
	if(app) {
		app.timeout('browserResume',5000,function() {
			clearTimeout(app.repeaterLoop);
			//
			if (window.hidden == false || window.visibilityState == 'visible' || evt.type == 'focus') {
				//
				updateCustomList('fav');
				updateCustomList('items');
				updateTodayOverview();
				intakeHistory();
				setTimeout(function() {
					setPush();
				},100);
				if (app.device.desktop) {
					$(document).trigger('resume');
				} else if (app.device.osxapp) {
					$(document).trigger('resume');
				}
				if(app.device.firefoxos) {
					screen.mozLockOrientation('portrait-primary');
					$(document).trigger('resume');
				}
			}
		});
	}
});
//###############//
//## START APP ##//
//###############//
function startApp() {
try {
	//fix locked dbs
	if(app.read('startLock','running') && !app.read('foodDbLoaded','done')) {
		app.remove('startLock');
	}
//#///////////////////#//
//# DB UPDATE PENDING #//
//#///////////////////#//
if(!app.read('startLock','running') && app.read('foodDbPending')) {
	app.remove('foodDbLoaded');
	app.remove('foodDbPending');	
	app.remove('startLock');
	$('body').addClass('updtdb');
	setTimeout(function() {
		updateFoodDb();
	},100);
}
///////////////
// KICKSTART //
///////////////
setTimeout(function() {
	if(typeof bodyTimer !== 'undefined') {
		clearTimeout(bodyTimer);
	}
	app.remove('app_restart_pending');
	//DEV VIEW REBOOTS
	if(app.dev) {
		console.log(app.read('consecutive_reboots'));	
	}
},50);
/////////////////////////
// KICKSTART ANALYTICS //
/////////////////////////
setTimeout(function() {
	app.analytics('init');
	setTimeout(function() {
		//TRACK START
		app.analytics('start');
		//TRACK INSTALL
		if(app.read('intro_dismissed')) {
			app.trackInstall();
		}
	},2000);
},5000);
//////////////////////
// TRIGGER SYNC ETC //
//////////////////////
setTimeout(function() {
	// MARK BOOT SUCCESS
	app.remove('consecutive_reboots');
	updateLoginStatus(1);
	app.parseErrorLog();
	clearTimeout(app.timers.resume);
},5000);
////////////////
// PARSED CSS //
////////////////
if (/MSAppHost\/2.0/i.test(navigator.userAgent) && /Windows Phone 8.1/i.test(navigator.userAgent) && !document.getElementById('wp81ViewportFix')) {
	$('head').append2('<style type="text/css" id="wp81ViewportFix">@media (min-width: 1px) { @-ms-viewport { width: 80%; }}</style>');
}
$('head').append2('<style type="text/css" id="cssStartDate"> #startDateSpan:before { content: "' + LANG.START_DATE[lang] + '"; } </style>');
$('head').append2('<style type="text/css" id="daySum"></style>');
$('head').append2('<style type="text/css" id="cssAutoUpdate">\
	.loading #advancedAutoUpdate:before	    { content: "' + LANG.DOWNLOADING[lang]     + '"; }\
	.pending #advancedAutoUpdate:before	    { content: "' + LANG.RESTART_PENDING[lang] + '"; }\
	.uptodate #advancedAutoUpdate:before    { content: "' + LANG.UP_TO_DATE[lang]      + '"; }\
	.spinnerMask #loadMask:before	        { content: "' + LANG.PREPARING_DB[lang]    + '"; }\
	.spinnerMask.updtdb #loadMask:before    { content: "' + LANG.UPDATING_DB[lang]     + '"; }\
	.spinnerMask.newwindow #loadMask:before { content: "' + LANG.LOADING[lang]         + '"; }\
</style>');
updateNutriRatio();
updateEntriesSum();
///////////////
// SET TITLE //
///////////////
$('title').html2(appName + ' - ' + LANG.REALTIME_CALORIE_COUNTER[lang]);
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$('body').prepend2('\
	<div id="appHeader">\
		<div id="timerKcals"><input id="timerKcalsInput" readonly="readonly" type="text" /><span>' + LANG.CALORIC_BALANCE[lang] + '</span></div>\
		<div id="timerBlocks">\
			<div id="timerDaily"><input id="timerDailyInput" type="' + (app.device.desktop ? 'text' : 'number') + '" value="' + app.get.kcals() + '" /><span>' + LANG.DAILY_CALORIES[lang] + '</span></div>\
		</div>\
		<div id="appHeaderIcon"><span></span><p></p></div>\
		<div id="appStatusTips"></div>\
	</div>\
	<div id="loadingDiv"><input readonly="readonly" id="lid" value="0" type="text" /></div>\
	<div id="contentWrapper">\
	<div id="appContent"></div></div>\
	<div id="appFooter">\
		<ul>\
			<li id="tab1">' + LANG.MENU_STATUS[lang].capitalize()   + '</li>\
			<li id="tab2">' + LANG.MENU_DIARY[lang].capitalize()    + '</li>\
			<li id="tab3">' + LANG.MENU_PROFILE[lang].capitalize()  + '</li>\
			<li id="tab4">' + LANG.MENU_SETTINGS[lang].capitalize() + '</li>\
		</ul>\
	</div>\
');
//#////////////#//
//# APP FOOTER #//
//#////////////#//
var lastTab = 0;
preTab = function(keepOpen) {
	if(keepOpen == 1) { return; }
	if($('#appContent').scrollTop() > 0) {
		document.getElementById('appContent').scrollTop = 0;
		kickDown();
	}
};
afterTab = function(keepOpen) {
	if(keepOpen == 1) { return; }
	$('#appContent').css('display','block');
	$('#appContent').css('visibility','visible');
	$('#appContent').css('pointer-events','auto');
	$('body').removeClass('newwindow');
	//
	$('.sp-picker-container').remove();
	$('#langSelect').remove();
	$('#newWindowWrapper').remove();
	$('#advancedMenuWrapper').remove();
	$('#appHelperWrapper').remove();
	$('#diaryNotesWrapper').remove();
	//
	if(!$('#pageSlideFood').is(':animated')) {
		//$('#timerDailyInput').removeAttr('readonly');
		//$('#timerDailyInput').removeClass('dull');
		$('#pageSlideFood').remove();
		$('#appHeader').removeClass('open');
		$('body').removeClass('closer');
	} else {
		$('#appHeader').trigger(touchstart);
	}
	//NO 50ms FLICKER
	appResizer(100);
	//enforce removal
	if(!$('#skipIntro').length) {
		if(typeof myScroll !== 'undefined') {
			myScroll.destroy();
		}
		$('#iScrollTag').remove();
	}
};
appFooter = function (id,keepOpen,callback) {
	//FLOOD
	if(app.now() - lastTab < 50) { lastTab = app.now(); return; }
	lastTab = app.now();
	var tabId = id;
	$('#appFooter li').removeClass('selected');
	app.save('app_last_tab',tabId);
	$('#' + tabId).addClass('selected');
	//ACTION
	     if(tabId == 'tab1') { app.tab.status(keepOpen);   }
	else if(tabId == 'tab2') { app.exec.updateEntries('','','callback',keepOpen); }
	else if(tabId == 'tab3') { app.tab.profile(keepOpen);  }
	else if(tabId == 'tab4') { app.tab.settings(keepOpen); updateFoodDb(); }
	$('body').removeClass('tab1 tab2 tab3 tab4 newwindow');
	$('body').addClass(tabId);
	if(typeof callback === 'function') {
		setTimeout(function() {
			callback();
		},0);
	}
	//tab tracker
	app.timeout('tab',275,function() {
		app.analytics('tab');
	});
};
//READ STORED
appFooter(app.read('app_last_tab'));
///////////////////////
// LISTEN FOR CLICKS //
///////////////////////
$('#appFooter li').on(touchstart + ' mousedown', function(evt) {
	app.globals.app_last_tab = evt.target.id;
	//DE-REPEATER
	app.timeout('lastFooterId', 50, function(evt) {
		//not while editing
		if($('#timerDailyInput').is(':focus')) {
			$('#timerDailyInput').blur();
		}
		//~
		if($('#editableInput').is(':visible')) {
			$('#editableInput').blur();
			kickDown();
			return false;
		}
		//CHANGE TAB
		appFooter(app.globals.app_last_tab);
	});
});
////////////////////////
// WINDOWS OVERSCROLL //
////////////////////////
if(app.device.wp8) {
	$('input').on('focus', function(evt) {
		$('html,body').css('position','fixed');
	});
	$('input').on('blur', function(evt) {
		$('html,body').css('position','absolute');
	});
}
////////////////////////
// BACK BUTTON (+ESC) //
////////////////////////
var backer = 0;
$(document).on('backbutton', function (evt) {
	//
	backer = 0
	///////////////////
	// TRIGGER CHAIN //
	///////////////////
	if ($('body').hasClass('spinnerMask')) {
		return false;
	}
	//
	if ($('#langSelect').length) {
		$('.preset').addClass('set');
		$('.preset').trigger(touchend);
	} else if ($('#skipIntro').length && myScroll.x) {
		if (typeof myScroll !== 'undefined') {
			myScroll.prev();
		}
	} else if (ref) {
		ref.close();
		ref = '';
	} else if ($('#addNewCancel').length || $('#modalCancel').length) {
		$('#addNewCancel').trigger(touchstart);
		$('#modalCancel').trigger(touchstart);
	} else if ($('#closeButton').length) {
		$('#closeButton').trigger(touchend);
	} else if ($('#subBackButton').length) {
		$('#subBackButton').addClass('button');
		$('#subBackButton').trigger(touchend);
	} else if ($('#backButton').length && $('#backButton').is(':visible')) {
		if ($('.dwo').length) {
			$('#getEntryDate').mobiscroll('cancel');
		} else {
			$('#backButton').addClass('button');
			$('#backButton').trigger(touchend);
		}
	} else if ($('#advBackButton').length) {
		$('#advBackButton').addClass('button');
		$('#advBackButton').trigger(touchend);
	} else if ($('#iconClear').is(':visible')) {
		$('#iconClear').trigger(touchstart);
	} else if ($('#pageSlideFood').hasClass('open')) {
		if (app.read('foodDbLoaded', 'done')) {
			$('#appHeader').trigger(touchstart);
		}
	} else if ($('#timerDailyInput').is(':focus')) {
		$('#timerDailyInput').trigger('blur');
	} else if ($('#diaryNotesButton').length) {
		$('#diaryNotesButton').trigger(touchstart);
	} else if ($('#appStatusFix').hasClass('open')) {
		$('#appStatusFix').removeClass('open');
		$('#startDate').mobiscroll('cancel');
	} else if ($('.delete').hasClass('active')) {
		$('#go').trigger(tap);
	} else if ($('#editableInput').is(':visible')) {
		$('#editableInput').trigger('focus');
		$('#editableInput').trigger('blur');
	} else if ($('input,select').is(':focus')) {
		$('input,select,textarea').trigger('blur');
	} else if (!app.read('app_last_tab', 'tab1')) {
		if (app.read('app_last_tab', 'tab4')) {
			appFooter('tab3');
		} else if (app.read('app_last_tab', 'tab3')) {
			appFooter('tab2');
		} else {
			appFooter('tab1');
		}
	} else {
		/////////////////////////
		// FALLBACK TO DEFAULT //
		/////////////////////////
		if(app.dev) {
			afterHide();
		} else if (app.device.msapp || !app.device.desktop) {
			backer = 1;
		} else if (app.device.wp8) {
			$(document).off('backbutton');
			blockAlerts = 1;
			throw '';
		} else if (typeof navigator.app !== 'undefined') {
			if (typeof navigator.app.exitApp !== 'undefined') {
				navigator.app.exitApp();
			}
		} else {
			afterHide();
		}
	}
});
//////////////////////
// WINJS BACKBUTTON //
//////////////////////
if (app.device.msapp) {
	if (typeof WinJS !== 'undefined') {
		WinJS.Application.onbackclick = function (arg) {
			backer = 0;
			//LET EVENT HANDLE VALUE MODIFICATION
			$(document).trigger('backbutton');
			if(backer == 0) {
				//use backbutton event
				//return true prevents default
   			   	return true;
			} else {
				//allow default behavior once (exit app) && re-enable backbutton
				//return nothing allows default event
				backer = 0;
			}
		};
	}
}
/////////////////
// PRESS ENTER //
/////////////////
$(document).on('pressenter', function(evt) {
	if($('#diaryNotesButton').length || $('#usrMsg').length) {
		return true;
	} else if($('#closeButton').length) {
		$('#closeButton').trigger(touchend);
	} else {
		$('#timerDailyInput').trigger('blur');
		if($('#saveButton').length) {
			$('#saveButton').addClass('button');
			$('#saveButton').trigger(touchend);
		}
		$('#closeButton').trigger(touchend);
		$('#editableInput').trigger('blur');
		$('#entrySubmit').trigger(tap);
		$('#modalOk').trigger(touchstart);
		$('#addNewConfirm').trigger(touchstart);
		if($('#langSelect').length) {
			$('.preset').addClass('set');
			$('.preset').trigger(touchend);
		} else {
			$('#skipIntro').trigger(touchend);
		}
		if($('#appStatusFix').hasClass('open')) {
			$('#startDate').mobiscroll('set');
			$('#appStatusFix').removeClass('open');
		}
		if($('.delete').hasClass('active')) {
			$('.delete.active').trigger(tap);
		}
	}
});
//////////////////////
// KEYCODE LISTENER //
//////////////////////
$(document).keypress(function(evt) {
	//DEV KEYCODE
	//if (app.beenDev) { var ev = evt; setTimeout(function() { app.toast(ev.type + ': ' + ev.which || ev.keyCode); }, 0); }
});
$(document).keydown(function(evt) {
	//DEV KEYCODE
	//if (app.beenDev) { var ev = evt; setTimeout(function() { app.toast(ev.type + ': ' + ev.which || ev.keyCode); }, 0); }

	//MODIFIER KEYS
	if((/18|81/).test(evt.which || evt.keyCode)) {
		app.timers.keystrokeLock = 1;
	}
	if(app.device.osxapp && app.timers.keystrokeLock !== 1) {
		if(!$('input,input[type="number"]select,textarea').is(':focus')) {
			evt.preventDefault();
		}
	}
});
$(document).keyup(function(evt) {
	//DEV KEYCODE
	//if (app.beenDev) { var ev = evt; setTimeout(function() { app.toast(ev.type + ': ' + ev.which || ev.keyCode); }, 0); }	//

	//UNSET MODIFIER KEYS
	if((/18|81/).test(evt.which || evt.keyCode)) {
		app.timers.keystrokeLock = 0;
	}
	if($('body').hasClass('spinnerMask'))							{ return false; }
	if(/37/.test(evt.which || evt.keyCode) && $('#usrMsg').length)	{ return true;  }
	if(/13/.test(evt.which || evt.keyCode))							{ $(document).trigger('pressenter'); }
	if(/27/.test(evt.which || evt.keyCode))							{ $(document).trigger('backbutton'); }
	///////////////////
	// MENU BACK KEY //
	///////////////////
	if($('#closeButton').length)  { return; }
	if($('#modalWrapper').length) { return; }
	if(/37|39/.test(evt.which || evt.keyCode)) {
		if($('#subBackButton').length) {
			if(evt.which || evt.keyCode == 37) {
				$('#subBackButton').addClass('button');
				$('#subBackButton').trigger(touchend);
			}
			return false;
		}
		if($('#backButton').length && $('#backButton').is(':visible')) {
			if(evt.which || evt.keyCode == 37) {
				if(!$('.dwo').length) {
					$('#backButton').addClass('button');
					$('#backButton').trigger(touchend);
				}
			}
			return false;
		}
		if($('#advBackButton').length) {
			if(evt.which || evt.keyCode == 37) {
				$('#advBackButton').addClass('button');
				$('#advBackButton').trigger(touchend);
			}
			return false;
		}
		if($('#langSelect').length) {
			if(evt.which || evt.keyCode == 37) {
				$('.preset').addClass('set');
				$('.preset').trigger(touchend);
			}
			return false;
		}
	}
	//////////////////
	// NOT ON FOCUS //
	//////////////////
	if($('input, input[type="number"], select, textarea').is(':focus')) { return; }
	//////////////////
	// FAVS KEY NAV //
	//////////////////
	if($('#menuTopBar').is(':visible') && !$('#modalWrapper').length) {
		if(/37/.test(evt.which || evt.keyCode)) {
		         if(app.read('lastInfoTab','topBarItem-3')) { $('#topBarItem-2').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-2')) { $('#topBarItem-1').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-1')) { $('#topBarItem-3').trigger(touchstart); }
		}
		if(/39/.test(evt.which || evt.keyCode)) {
		         if(app.read('lastInfoTab','topBarItem-3')) { $('#topBarItem-1').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-2')) { $('#topBarItem-3').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-1')) { $('#topBarItem-2').trigger(touchstart); }
		}
		return false;
	}
	/////////////////
	// TAB KEY NAV //
	/////////////////
	if(!$('input, textarea, select').is(':focus') && !$('#gettingStarted').html() && !$('.dwo').length && !$('#modalWrapper').length) {
		if(/37/.test(evt.which || evt.keyCode)) {
		         if(app.read('app_last_tab','tab4')) { appFooter('tab3'); }
			else if(app.read('app_last_tab','tab3')) { appFooter('tab2'); }
			else if(app.read('app_last_tab','tab2')) { appFooter('tab1'); }
			else if(app.read('app_last_tab','tab1')) { appFooter('tab4'); }
		}
		if(/39/.test(evt.which || evt.keyCode)) {
		         if(app.read('app_last_tab','tab4')) { appFooter('tab1'); }
			else if(app.read('app_last_tab','tab3')) { appFooter('tab4'); }
			else if(app.read('app_last_tab','tab2')) { appFooter('tab3'); }
			else if(app.read('app_last_tab','tab1')) { appFooter('tab2'); }
		}
	}
});
///////////////////
// SHOW KEYBOARD //
///////////////////
$(document).on('showkeyboard', function(evt) {
	if($('#diaryNotesInput').length) {
		setTimeout(function() {
			$('#diaryNotesInput').focus();
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$('#diaryNotesInput').height($('body').height() - 32);
			if($.nicescroll) {
				$('#diaryNotesInput').getNiceScroll().resize();
			}
		},0);
		setTimeout(function() {
			$('#diaryNotesInput').focus();
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$('#diaryNotesInput').height($('body').height() - 32);
			if($.nicescroll) {
				$('#diaryNotesInput').getNiceScroll().resize();
			}
		},300);
	}
});
//////////////////////
// ON HIDE KEYBOARD //
//////////////////////
$(document).on('hidekeyboard',function() {
	appResizer(100);
	if($('#timerDailyInput').is(':focus')) {
		$('#timerDailyInput').trigger('blur');
	}
	if($('#editableInput').is(':visible')) {
		$('#editableInput').trigger('focus');
		$('#editableInput').trigger('blur');
	}
	//profile blur
	if(app.read('app_last_tab','tab3')) {
		if($('#calcForm input').is(':focus') || $('#calcForm select').is(':focus')) {
			$('#calcForm input').each(function(evt) {
				if($(this).is(':focus') && vendorClass != 'moz') {
					$(this).blur();
				}
			});
			$('#calcForm select').each(function(evt) {
				if($(this).is(':focus') && vendorClass != 'moz') {
					$(this).blur();
				}
			});
		}
	}
	//
	kickDown();
	return false;
});
/////////////////
// ORIENTATION //
/////////////////
$(window).on('orientationchange', function(evt) {
	appResizer(0);
	appResizer(100);
	appResizer(300);
	appResizer(600);
});
////////////
// RESIZE //
////////////
app.globals.recentResize = 0;
window.onresize = function(evt) {
	app.width  = window.innerWidth;
	app.height = window.innerHeight;
	app.globals.recentResize = 1;
	clearTimeout(app.timers.recentResize);
	app.timers.recentResize = setTimeout(function() {
		app.globals.recentResize = 0;
	},300);
	lastScreenResize = lastScreenSize;
	lastScreenSize = app.height;
	//unlock top white gap
	$('body').trigger('touchmove');
	//IF WINDOW > BODY (PREVENT KEYBOARD COLAPSE)
	//if(window.innerHeight > $('body').height()) {
	if(initialScreenSize > $('body').height() && !app.device.windows8) {
		//IOS re-scrolling bug
		if(app.device.ios) {
			$('#entryListWrapper').height( $('#entryListWrapper').height() + 1);
			$('#entryListWrapper').height( $('#entryListWrapper').height() - 1);
		}
		appResizer(0);
	}
	//ALWAYS RESIZE NON-MOBILE BROWSER
	if(app.device.windows8 || app.device.windows81 || app.device.windows10) {
		//resize triggers blur on orientation change
		if(window.innerWidth == initialScreenHeight && orientationSwitched == 0) {
			appResizer(0);
			appResizer(300);
			orientationSwitched = 1;
		} else if(window.innerWidth == initialScreenWidth && orientationSwitched == 1) {
			appResizer(0);
			appResizer(300);
			orientationSwitched = 0;
		} else if($('input').has(':focus')) {
			//appResizer(0);
		} else {
			appResizer(0);
		}
	} else if(app.device.desktop) {
		appResizer(0);
	}
	//notepad (ios6 fix)(window.innerHeight)
	if($('#diaryNotesInput').length) {
		if($('#diaryNotesInput').length && !app.device.wp8 && !app.device.windows8) {
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$('#diaryNotesInput').height($('body').height() - 32);
			$('#diaryNotesInput').width($('body').width() - 24);
			if($.nicescroll) {
				$('#diaryNotesInput').getNiceScroll().resize();
			}
			$('#diaryNotesButton span').css('top',($('body').height()/2) + 'px');
		}
	}
	if(app.read('app_last_tab','tab1')) {
		//balance
		balanceMeter(timerKcals,'now');
		setTimeout(function() { balanceMeter(timerKcals,'now');	},0);
		setTimeout(function() { balanceMeter(timerKcals,'now');	},600);
		//intake history
		intakeHistory();
	}
	//always resize intro
	if($('#closeDiv').html()) {
		appResizer(0);
	}
	//resize statistics
	setTimeout(function() {
		if($('#appHistory').html() && typeof rebuildHistory == 'function') {
			rebuildHistory();
		}
	},100);
	niceResizer(300);
	//ffos portrait reinforce
	if(app.device.firefoxos) {
		screen.mozLockOrientation('portrait-primary');
	}
};
/////////////////////
// DEBUG INDICATOR //
/////////////////////
if(app.read('config_debug','active')) {
	$('body').addClass('appDebug');
}
if(app.read('facebook_logged')) {
	$('body').addClass('appFacebook');
	if(/@/i.test(app.read('facebook_username'))) {
		$('body').addClass('appEmailLogin');
	}
}
/////////////
// OPTIONS //
/////////////
//set default
app.define('config_kcals_type','simple');
app.read('config_kcals_type','cyclic') ? $('body').addClass('cyclic') : $('body').addClass('simple');
/////////////
// IOS 7/8 //
/////////////
if(app.device.ios10 && app.device.cordova) {
	$('body').addClass('ios10');
}
if(app.device.ios9 && app.device.cordova) {
	$('body').addClass('ios9');
}
if(app.device.ios8 && app.device.cordova) {
	$('body').addClass('ios8');
}
if(app.device.ios7 && app.device.cordova) {
	$('body').addClass('ios7');
}
if(app.device.ios) {
	$('body').addClass('ios');
}
/////////////
// ANDROID //
/////////////
if(app.device.android) {
	$('body').addClass('android');
	//VERSION SPECIFIC
	if(app.device.android < 4) {
		$('body').addClass('android2');
	}
	if(app.device.android == 4) {
		$('body').addClass('android40');
	}
	if(app.device.android == 4.1) {
		$('body').addClass('android41');
	}
	if(app.device.android == 4.2) {
		$('body').addClass('android42');
	}
	if(app.device.android == 4.3) {
		$('body').addClass('android43');
	}
	if(app.device.android < 4.4) {
		$('body').addClass('android4lt');
	}
	if(app.device.android >= 4 && app.device.android < 4.4) {
		$('body').addClass('android4');
	}
	if(app.device.android >= 4.4) {
		$('body').addClass('android44');
	}
}
/////////////
// WINDOWS //
/////////////
if(app.device.wp8) {
	$('html').addClass('wp8');
	$('body').addClass('wp8');
}
if(app.device.wp81) {
	$('html').addClass('wp81');
	$('body').addClass('wp81');
}
if(app.device.wp10) {
	$('html').addClass('wp10');
	$('body').addClass('wp10');
}
if(app.device.windows8) {
	$('html').addClass('windows8');
	$('body').addClass('windows8');
}
if(app.device.windows10) {
	$('html').addClass('windows10');
	$('body').addClass('windows10');
}
////////////////////////////
// FF OS ORIENTATION LOCK //
////////////////////////////
if(app.device.firefoxos) {
	$('body').addClass('firefoxos');
	screen.mozLockOrientation('portrait-primary');
}
////////////
// VENDOR //
////////////
$('body').addClass(vendorClass);
$('body').addClass('appLang-' + lang);
/////////
// OSX //
/////////
if(app.device.osx) {
	$('body').addClass('osx');
}
if(app.device.osxapp) {
	$('body').addClass('osxapp');
	//ADD MENU (RESET SETTINGS)
	try {
		if(macgap.menu.getItem('ChronoBurn').submenu().getItem(LANG.SETTINGS_WIPE[lang])) {
			macgap.menu.getItem('ChronoBurn').submenu().getItem(LANG.SETTINGS_WIPE[lang]).remove();
		}
		macgap.menu.getItem('ChronoBurn').submenu().addSeparator();
		macgap.menu.getItem('ChronoBurn').submenu().addItem(LANG.SETTINGS_WIPE[lang], 'cmd+opt+r', function() {
			appConfirm(LANG.SETTINGS_WIPE_TITLE[lang], LANG.ARE_YOU_SURE[lang], function(button) {
				if(button === 2) {
					deSetup();
					return false;
				}
			}, LANG.OK[lang], LANG.CANCEL[lang]);
		});
	} catch(err) {
		errorHandler('macgap.menu: ' + err);
	}
	//CLOSE ON MINIMIZE
	if(reviewMode === true) {
		$(document).on('visibilitychange', function () {
			clearTimeout(app.timers.terminate);
			app.timers.terminate = setTimeout(function() {
				if (document.hidden == true || document.visibilityState == 'hidden') {
					macgap.app.terminate();
				}
			},1000);
		});
	}
}
///////////
// LINUX //
///////////
if(app.device.linux) {
	$('body').addClass('linux');
}
////////////////
// CHROME APP //
////////////////
if(app.device.chromeos) {
	$('body').addClass('chromeos');
}
////////////////
// BLACKBERRY //
////////////////
if(app.device.blackberry) {
	$('body').addClass('blackberry');
}
//////////////
// PLAYBOOK //
//////////////
if(app.device.playbook) {
	$('body').addClass('playbook');
}
////////////
// AMAZON //
////////////
if(app.device.amazon) {
	$('body').addClass('amazon');
}
/////////////
// CORDOVA //
/////////////
if(app.device.cordova) {
	$('body').addClass('cordova');
} else {
	$('body').addClass('noncordova');
}
//////////
// HTTP //
//////////
if(app.http) {
	$('body').addClass('http');
} else {
	$('body').addClass('localhost');
}
/////////////
// DESKTOP //
/////////////
if(app.device.desktop) {
	$('body').addClass('desktop');
} else {
	$('body').addClass('mobile');
}
////////////////////
// DEFINE PROFILE //
////////////////////
//male/female
app.define('calcForm#pA1B','Male');
app.define('calcForm#pA2B','70');
app.define('calcForm#pA4B','20');
app.define('calcForm#pA5B','Sedentary (little or no exercise, desk job)');
app.define('calcForm#pA6G','1');
app.define('calcForm#pA6M','1');
app.define('config_measurement','metric');
app.define('calcForm#feet','0');
app.define('calcForm#inches','170');
app.define('calcForm#pA3B','70');
app.define('calcForm#pA2C','centimetres');
app.define('calcForm#pA3C','kilograms');
app.define('calcForm#pA6H','kilograms');
app.define('calcForm#pA6N','kilograms');
//###########################//
//####   START WORKING   ####//
//###########################//
/////////////////
// SAFE-LOADER //
/////////////////
var fontTestInterval = '';
var loadTimeout = setTimeout(function() {
	unlockApp();
},999);
///////////////////
// FONT UNLOCKER //
///////////////////
function unlockApp() {
	///////////////////////
	// clear safe loader //
	///////////////////////
	if (typeof fontTestInterval !== 'undefined') {
		clearInterval(fontTestInterval);
	}
	if (typeof loadTimeout !== 'undefined') {
		clearTimeout(loadTimeout);
	}
	//////////////
	// DEV LOCK //
	//////////////
	if(app.dev) {
		app.save('been_dev',1);
	}
	//start scrolling
	setTimeout(function() {
		getNiceScroll('#appContent');
		appResizer(100);
	},300);
	$('#fontTest').remove();
	//
	$('body').removeClass('unloaded');
	$('body').addClass('started');
	$('body').css('opacity',1);
	$('body').show();
	appResizer(0);
}
//////////////////
// ON FONT LOAD //
//////////////////
if(!document.getElementById('fontTest')) {
	$('body').append2('<div id="fontTest" style="font-family: KCals; font-size: 16px; position: absolute; top: -999px; left: -999px; opacity: 0; display: inline-block;">K+k+K</div>');
	fontTestInterval = setInterval(function() {
		if($('#fontTest').width() == 80) {
			clearInterval(fontTestInterval);
			clearTimeout(loadTimeout);
			unlockApp();
		}
	},10);
}
////////////////////////////
// STABLE SCROLL ON SWIPE //
////////////////////////////
if(app.is.scrollable && app.device.desktop) {
	app.globals.X     = 0;
	app.globals.Y     = 0;
	app.globals.MX    = 0;
	app.globals.MY    = 0;
	app.globals.XLock = 0;
	$('body').on(touchend,function(evt) {
		//NORMALIZE XY
		evt.pageX = evt.changedTouches ? evt.changedTouches[0].pageX : evt.pageX;
		evt.pageY = evt.changedTouches ? evt.changedTouches[0].pageY : evt.pageY;
		//
		app.globals.XLock = 0;
		app.globals.X     = evt.pageX;
		app.globals.Y     = evt.pageY;
		app.globals.MX    = 0;
		app.globals.MY    = 0;
	});
	$('body').on(touchmove,function(evt) {
		//NORMALIZE XY
		evt.pageX = evt.changedTouches ? evt.changedTouches[0].pageX : evt.pageX;
		evt.pageY = evt.changedTouches ? evt.changedTouches[0].pageY : evt.pageY;
		//
		app.globals.MX = app.globals.MX - (app.globals.X - evt.pageX);
		app.globals.MY = app.globals.MY - Math.abs(app.globals.Y - evt.pageY);
		//
		app.globals.X = evt.pageX;
		app.globals.Y = evt.pageY;
		//ENABLE LOCK
		if(Math.abs(app.globals.MY) < 32 && Math.abs(app.globals.MX) > 6) {
			app.globals.XLock = 1;
		}
		//HEIGHT UNBLOCK
		if(Math.abs(app.globals.MY) > 120) {
			app.globals.XLock = 0;
		}
		//READ LOCK
		if(app.globals.XLock == 1 && app.read('app_last_tab','tab2')) {
			evt.stopPropagation();
		}
	});
}
////////////////
// MAIN TIMER //
////////////////
(function startTimer() {
	if(typeof updateTimer == 'function') {
		timerPerf = app.now();
		updateTimer();
		if(typeof timeBomb !== 'undefined') {
			clearTimeout(timeBomb);
		}
		setTimeout(startTimer,timerDiff);
	}
})();
///////////////////////////////////////////
// refresh entrylist time & online users //
///////////////////////////////////////////
(function entryRetimer() {
	//every 60s
	setTimeout(function() {
		updateEntriesTime();
	},0);
	//online users ~ wait wifi
	setTimeout(function() {
		app.online();
	},6000);
	//PARSE ERRORS
	setTimeout(function() {
		app.parseErrorLog();
	},6000);
	//
	setTimeout(entryRetimer,(120*1000));
})();
/////////////////////////////
// check updates regularly //
/////////////////////////////
(function updateChecker() {
	if (typeof buildRemoteSuperBlock !== 'undefined' && app.read('config_autoupdate', 'on')) {
		/////////////////
		// AUTO UPDATE //
		/////////////////
		setTimeout(function () {
			buildRemoteSuperBlock('cached');
		}, (360 * 1000));
	}
	///////////////////
	// every 5+5 min //
	///////////////////
	setTimeout(updateChecker, (360 * 1000));
})();
/////////////////////
// check last push //
/////////////////////
(function lastEntryPush() {
	var now = app.now();
	//sync lock
	if(app.read('pendingSync') && app.read('facebook_userid') && app.read('facebook_logged')) {
		if(now - app.read('pendingSync') > 30000) {
			syncEntries();
			app.save('pendingSync',app.read('pendingSync') + 30000);
		}
	}
	//push lock
	if(app.read('facebook_username') && app.read('facebook_logged') && app.read('lastEntryPush')) {
		if(now - app.read('lastEntryPush') > 500 && app.read('foodDbLoaded','done')) {
			pushEntries();
			app.save('lastEntryPush',app.read('lastEntryPush') + 30000);
		}
	}
	setTimeout(lastEntryPush,3000);
})();
	////////////////////
	// YUI COMPRESSOR // legacy
	////////////////////
	var dummyYUI = 'var editableTimeout';
	/////////////////////////////////
	// HEADER INFO ICON XY HANDLER //
	/////////////////////////////////
	$('#appHeader').on(tap, function(evt) {
		//HANDLE WINDOW		
		if(evt.pageX < 132 && evt.pageY < 72) {
			if($('#timerDailyInput').is(':focus')) {
				$('#timerDailyInput').trigger('blur'); return false;
			}
			if($('#appHelper').length)					{ return; }
			if($('#advancedMenu').length)				{ return; }
			if($('#backButton').length)					{ return; }
			if($('#subBackButton').length)				{ return; }
			if($('#langSelect').length)					{ return; }
			if($('#advancedMenu').length)				{ return; }
			if($('#pageSlideFood').length)				{ return; }
			if($('#appHeader').hasClass('blockInfo'))	{ return; }
			if($('#timerDailyInput').is(':focus'))		{ return; }
			if($('#timerDailyInput').is(':animated'))	{ return; }
			//COLOR ANIMATION VALUE
			if(Number($('#timerDailyInput').css('color').split("rgba(255, 255, 255, ").join("").split(")").join("")) > 0.8) { return; }
			getNewWindow('ChronoBurn: A Metabolism Simulator','<div id="blockInfo">' + LANG.HELP_TOPICS_ARRAY['en']['ChronoBurn: A Metabolism Simulator'] + '</div>',function() {
				$('#tabHelp').removeClass('hidden');
				app.handlers.activeRow('#openHelp','button',function(evt) {
					appFooter('tab4', 0, function() {
						buildHelpMenu('direct');
					});
				});
			});
		}
	});
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$('#appHeader').on(touchstart, function(evt) {
		var targetId = evt.target.id;
		//CLEAR BLOCK
		if(!$('#pageSlideFood').html() && !$('#newWindow').html()) {
			$('#appHeader').removeClass('closer');
			$('body').removeClass('closer');
			//$('#timerDailyInput').removeAttr('readonly');
			//$('#timerDailyInput').removeClass('dull');
		}
		//DEFER
		/*
		if(targetId == 'timerDailyInput' && ($('#pageSlideFood').html() || $('#newWindow').html())) {
			//inactive
			$('#timerDailyInput').prop('readonly','readonly');
			$('#timerDailyInput').addClass('dull');
			setTimeout(function() {
				$('#timerDailyInput').blur();
				$('#appHeader').trigger(touchstart);
			},0);
			setTimeout(function() {
				if(!$('#pageSlideFood').html() && !$('#newWindow').html()) {
					$('#appHeader').removeClass('closer');
					$('body').removeClass('closer');
					$('#timerDailyInput').removeAttr('readonly');
					$('#timerDailyInput').removeClass('dull');
				}
			},200);
			return false;
		}
		*/
		if($('#subBackButton').length)	{ $(document).trigger('backbutton'); return; }
		if($('#backButton').length)		{ $(document).trigger('backbutton'); return; }
		if($('#advancedMenu').length)	{ $(document).trigger('backbutton'); return; }
		if($('#langSelect').length)		{ $(document).trigger('backbutton'); return; }
		if($('#appHelper').length)		{ $(document).trigger('backbutton'); return; }

		if($('body').hasClass('newwindow') && !$('#modalWindow').length) { return; }
		//if(!$('#appHeader').hasClass('closer')) { return; }
		if($('#addNewWrapper').html())			{ return; }
		//hide food
		if($('#pageSlideFood').hasClass('open') && !$('#pageSlideFood').hasClass('busy')) {
			app.suspend('#entryListForm',500);
			$('#foodSearch').blur();
			$('#pageSlideFood').addClass('busy');
			$('#appHeader').removeClass('open');
			$('#appHeader').removeClass('closer');
			$('body').removeClass('closer');
			$('#pageSlideFood').removeClass('open');
			$('#pageSlideFood').css('opacity',0);
			$('#pageSlideFood').on(transitionend,function(evt) {
				$('#pageSlideFood').removeClass('busy');
				$('#appHeader').removeClass('closer');
				$('body').removeClass('closer');
				//WIPE ON CLOSE
				$('#pageSlideFood').remove();
				//force custom dump/save
				if(typeof updateCustomList == 'function' && app.read('foodDbLoaded','done')) {
					updateCustomList('fav');
					updateCustomList('items');
					updateTodayOverview();
					intakeHistory();
					setTimeout(function() {
						setPush();
					},100);
				}
			});
			return;
		}
	});
	///////////////////////////
	// blur edit / entrybody // #appContent removedd ~ save resources
	/////////////////////////// BETA ~ ~ ~ 
	$('#appHeader').on(tap, function(evt) {
		$('#appContent').show();
		if(evt.target.id != 'timerDailyInput' && $('#timerDailyInput').is(':focus')) {
			//triggers setpush
			$('#timerDailyInput').blur();
		}
		$('#entryTime').blur();
		if(!$('#entryBody').is(':focus')) {
			$('#entryBody').blur();
		}
	});
	$('#appHeader').on(tap, function(evt) {
		if($('#entryBody').is(':focus') && evt.target.id == 'entryTime') {
			$('#entryTime').focus();
		} else if($('#entryTime').is(':focus') && evt.target.id == 'entryBody') {
			$('#entryBody').focus();
		} else if(evt.target.id != 'entryTime' && evt.target.id != 'entryBody' && evt.target.id != 'timerDailyInput') {
			//blur on outside tapping
			if($('#timerDailyInput').is(':focus')) {
				$('#timerDailyInput').blur();
			}
			//fix ff select blur
			if(!$('#entryTime').is(':focus')) {
				$('#entryTime').blur();
			}
			if(!$('#entryBody').is(':focus')) {
				$('#entryBody').blur();
			}
		}
	});
	/////////////////////////////////////////////
	// APPCONTENT GLOBAL UNFOCUS (DAILY INPUT) //
	/////////////////////////////////////////////
	$('#appContent').on(touchend, function(evt) {
		$('#timerDailyInput').blur();
	});
	//##//////////////##//
	//## HEADER SWIPE ##//
	//##//////////////##//
	var headerSwipe;
	var headerSwipeBlock = 0;
	$('#appHeader').on(swipe,function(evt) {
		//tap on header does not blur
		$('#timerDailyInput').blur();
		//LEFT SWIPE
		if(/left/i.test(evt.direction || evt.type)) {
			clearTimeout(headerSwipe);
			kickDown();
		         if(app.read('app_last_tab','tab4')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab3'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab3')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab2'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab2')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab1'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab1')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab4'); headerSwipeBlock = 0; }, 150); }
		} else {
			clearTimeout(headerSwipe);
			kickDown();
		         if(app.read('app_last_tab','tab4')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab1'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab3')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab4'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab2')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab3'); headerSwipeBlock = 0; }, 150); }
			else if(app.read('app_last_tab','tab1')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab2'); headerSwipeBlock = 0; }, 150); }
		}
	});
	//##///////////////////////////##//
	//## DAILY INPUT TRIGGER FOCUS ##//
	//##///////////////////////////##//
	$('#appHeader').on(app.device.desktop ? tap : touchstart, function(evt) {
		evt.stopPropagation();
		//NOT WHILE THIS ~
		if($('#pageSlideFood').is(':animated'))		{ return false; }
		if($('#appHelper').length)					{ return false; }
		if($('#advancedMenu').length)				{ return false; }
		if($('#backButton').length)					{ return false; }
		if($('#subBackButton').length)				{ return false; }
		if($('#langSelect').length)					{ return false; }
		if($('#advancedMenu').length)				{ return false; }
		if($('#pageSlideFood').length)				{ return false; }
		if($('#appHeader').hasClass('blockInfo'))	{ return false; }
		// FOCUS VIA XY
		if((app.width - (app.globals.X || evt.pageX)) < 100 && (app.globals.Y || evt.pageY) < $('#appHeader').height()) {
			if(!$('#timerDailyInput').is(':focus')) {
				$('#timerDailyInput').focus();
			}
		}
	});
	//////////////
	// VALIDATE //
	//////////////
	app.handlers.validate('#timerDailyInput',{ 
		minValue: 100, defaultValue: function() { return app.get.kcals('reset'); }
	});
	///////////
	// FOCUS //
	///////////
	$('#timerDailyInput').on('focus', function(evt) {
		if(app.device.desktop) {
			$('#timerDailyInput').prop('type','number');
		}
	});
	//#//////#//
	//# BLUR #//
	//#//////#//
	$('#timerDailyInput').on('blur', function(evt) {
		///////////////////
		// UPDATE BLOCKS //
		///////////////////
		app.timeout('updateBlocksBlur',1000,function() {
			updateTodayOverview();
			updateNutriBars();
			intakeHistory();
			setPush();
		});
		/////////////////////////////////
		//REVERT DESKTOP INPUT TO TEXT //
		/////////////////////////////////
		if(app.device.desktop) {
			app.timeout('revertDesktopInput',300,function() {
				//VERIFY REFOCUS
				if(!$('#timerDailyInput').is(':focus')) {
					$('#timerDailyInput').prop('type','text');
				}
			});
		}
		/////////////////
		// UPDATE DATA //
		/////////////////
		app.save(app.get.kcals('key'),$('#timerDailyInput').val());
		updateTimer();
		// BACKUPDATE CYCLIC
		if(app.read('config_kcals_type','cyclic')) {
			if(app.read('config_kcals_day','d')) {
				$('#appCyclic2').val(app.read('config_kcals_day_2'));
			} else {
				$('#appCyclic1').val(app.read('config_kcals_day_1'));
			}
		}
		//END BLUR/
	});
	////////////////////
	// DEV BOOT TIMER //
	////////////////////
	/*
	if (typeof initTime !== 'undefined') {
		if (app.dev) {
			app.toast(((new Date().getTime()) - initTime) + ' ms');
		}
	}
	*/
///////////////////
// CATCH 5 TIMES //
///////////////////
} catch(err) {
	var bootError = err;
	errorHandler(bootError,function() {
		app.reboot('now');	
	});
}
////#//
} //#//
////#//

