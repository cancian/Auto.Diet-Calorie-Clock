////////////////////
// DOCUMENT READY //
////////////////////
$(document).ready(function() {
	app.ready(function() {
		///////////////////
		// OPEN DATABASE //
		///////////////////
		try {
			localforage.config({storeName: 'KCals'});
			localforage.setDriver(['webSQLStorage','asyncStorage','localStorageWrapper']).then(function() {
			//localforage.setDriver([localforage.WEBSQL, localforage.INDEXEDDB, localforage.LOCALSTORAGE]).then(function() {
				initDB();
			});
		} catch(error) {
			app.reboot('reset',error);
		}
	});
});
////////////////
// RESUME EVT //
////////////////
$(document).on('resume',function() {
	updateTimer();
	clearTimeout(app.repeaterLoop);
	clearTimeout(app.timers.resume);
	app.timers.resume = setTimeout(function() { 
		updateLoginStatus(1);
		app.analytics('resume');
		if(app.read('config_autoupdate','on')) {
			buildRemoteSuperBlock('cached');
		}
	},5000);
	//silent restart
	if(app.read('app_restart_pending')) {
		app.remove('app_restart_pending');
		if(app.read('config_autoupdate','on')) {
			app.reboot('now');
		}
	}
	//fix locked dbs
	if(app.read('startLock','running') && !app.read('foodDbLoaded','done')) {
		app.remove('startLock');
	}
});
///////////////////////
// VISIBILITY CHANGE //
///////////////////////
$(document).on('visibilitychange', function () {
	clearTimeout(app.repeaterLoop);
	if (document.hidden == false || document.visibilityState == 'visible') {
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
$(window).on('pause',function() {
	clearTimeout(app.repeaterLoop);
});
//##///////////##//
//## START APP ##//
//##///////////##//
function startApp() {
try {
	//fix locked dbs
	if(app.read('startLock','running') && !app.read('foodDbLoaded','done')) {
		app.remove('startLock');
	}
///////////////
// KICKSTART //
///////////////
setTimeout(function() {
	if(typeof bodyTimer !== 'undefined') {
		clearTimeout(bodyTimer);
	}
	app.remove('app_restart_pending');
	app.analytics('init'); 
},0);
///////////////////////
// MARK BOOT SUCCESS //
///////////////////////
setTimeout(function() {
	updateLoginStatus(1);
	app.analytics('start');
	app.remove('consecutive_reboots');
	clearTimeout(app.timers.resume);
},5000);
////////////////
// PARSED CSS //
////////////////
app.safeExec(function() {
	$('head').append('<style type="text/css" id="cssStartDate"> #startDateSpan:before { content: "' + LANG.START_DATE[lang] + '"; } </style>');
	$('head').append('<style type="text/css" id="daySum"></style>');
	$('head').append('<style type="text/css" id="cssAutoUpdate">\
		.loading #advancedAutoUpdate:before	    { content: "' + LANG.DOWNLOADING[lang]     + '"; }\
		.pending #advancedAutoUpdate:before	    { content: "' + LANG.RESTART_PENDING[lang] + '"; }\
		.uptodate #advancedAutoUpdate:before    { content: "' + LANG.UP_TO_DATE[lang]      + '"; }\
		.spinnerMask #loadMask:before	        { content: "' + LANG.PREPARING_DB[lang]    + '"; }\
		.spinnerMask.updtdb #loadMask:before    { content: "' + LANG.UPDATING_DB[lang]     + '"; }\
		.spinnerMask.newwindow #loadMask:before { content: "' + LANG.LOADING[lang]         + '"; }\
	</style>');
});
updateNutriRatio();
updateEntriesSum();
///////////////
// SET TITLE //
///////////////
$('title').html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$('body').prepend('\
	<div id="appHeader">\
		<div id="timerKcals"><input id="timerKcalsInput" readonly="readonly" type="text" /><span>' + LANG.CALORIC_BALANCE[lang] + '</span></div>\
		<div id="timerBlocks">\
			<div id="timerDaily"><input id="timerDailyInput" type="number" value="' + app.get.kcals() + '" /><span>' + LANG.DAILY_CALORIES[lang] + '</span></div>\
		</div>\
		<div id="appHeaderIcon"><span></span><p></p></div>\
	</div>\
	<div id="loadingDiv"><input readonly="readonly" id="lid" value="0" type="text" /></div>\
	<div id="appContent"></div>\
	<div id="appFooter">\
		<ul>\
			<li id="tab1">' + LANG.MENU_STATUS[lang].capitalize()   + '</li>\
			<li id="tab2">' + LANG.MENU_DIARY[lang].capitalize()    + '</li>\
			<li id="tab3">' + LANG.MENU_PROFILE[lang].capitalize()  + '</li>\
			<li id="tab4">' + LANG.MENU_SETTINGS[lang].capitalize() + '</li>\
		</ul>\
	</div>\
');
$('html,body').scroll(function(evt) {
	evt.preventDefault();
	evt.stopPropagation();	
});
//////////////
// KEY DUMP //
//////////////
/*
var keyDump = '';
$.each(LANG.LANGUAGE,function(k,v) {
	var addThis = '<div>' + v + '</div><div>' +
	LANG.FOOD[v]     + ',' +
	LANG.EXERCISE[v] + ',' +
	LANG.TIME[v]     + ',' +
	LANG.SURPLUS[v]  + ',' +
	LANG.DEFICIT[v]  + ',' +
	LANG.CALORIC[v]  + ',' +
	LANG.WEIGHT_LOSS[v] + ',' +
	LANG.KCAL[v]        + ',' +
	'myfitnesspal,ipad,' +
	LANG.FATS[v] + ',' +
	LANG.PROTEINS[v]+ ',' +
	LANG.CARBS[v];
	//ADD
	addThis = (addThis.split(' ').join(','));//.slice(0,100);
	keyDump += addThis + '</div>';
});
$('body').html(keyDump.toLowerCase());
*/
//#////////////#//
//# APP FOOTER #//
//#////////////#//
var releaseFooter;
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
	$('#langSelect').remove();
	$('#newWindowWrapper').remove();
	$('#advancedMenuWrapper').remove();
	$('#appHelper').remove();
	$('#appSubHelper').remove();
	$('#diaryNotesWrapper').remove();
	//
	if(!$('#pageSlideFood').is(':animated')) {
		$('#timerDailyInput').removeAttr('readonly'); 
		$('#timerDailyInput').removeClass('dull'); 
		$('#pageSlideFood').remove();
		$('#appHeader').removeClass('open');
		$('body').removeClass('closer');
	} else {
		$('#appHeader').trigger(touchstart);
	}
	//NO 50ms FLICKER (android profile)
	appResizer(100);
	//niceResizer(100);
};
appFooter = function (id,keepOpen,callback) {
	if(app.now() - lastTab < 300) { lastTab = app.now(); return; }
	lastTab = app.now();
	var tabId = id;
	$('#appFooter li').removeClass('selected');
	app.save('app_last_tab',tabId);
	$('#' + tabId).addClass('selected');
	//ACTION
	if(tabId == 'tab1') { app.tab.status(keepOpen);   }
	if(tabId == 'tab2') { app.exec.updateEntries('','','callback',keepOpen); }
	if(tabId == 'tab3') { app.tab.profile(keepOpen);  }
	if(tabId == 'tab4') { app.tab.settings(keepOpen); }
	$('body').removeClass('tab1 tab2 tab3 tab4 newwindow');
	$('body').addClass(tabId);
	if(callback) {
		setTimeout(function() {
			callback();
		},0);
	}
};
//READ STORED
appFooter(app.read('app_last_tab'));
///////////////////////
// LISTEN FOR CLICKS //
///////////////////////
var touchFootTimer;
$('#appFooter li').on(touchstart, function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	//not while editing
	if($('#editableInput').is(':visible')) {
		$('#editableInput').blur();
		kickDown();
		return false;
	}
	//
	appFooter($(this).attr('id'));
	if($('#timerDailyInput').is(':focus')) {
		$('#timerDailyInput').blur();
	}
	clearTimeout(touchFootTimer);
	touchFootTimer = setTimeout(function() {
		app.analytics('tab');
	},600);
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
//////////////////////// backclick?
$(document).on('backbutton', function(evt) {
	if($('body').hasClass('spinnerMask')) { return false; }
	//
	if($('#langSelect').length) {
		$('.preset').addClass('set');
		$('.preset').trigger(touchend);
	} else if($('#skipIntro').length && myScroll.x) {
		if(typeof myScroll !== 'undefined') {
			myScroll.prev();
		}
	} else if(ref) {
		ref.close();
		ref = '';
	} else if($('#addNewCancel').length || $('#modalCancel').length) {
		$('#addNewCancel').trigger(touchstart);
		$('#modalCancel').trigger(touchstart);
	} else if($('#closeButton').length) {
		$('#closeButton').trigger(touchend);
	} else if($('#subBackButton').length) {
		$('#subBackButton').addClass('button');
		$('#subBackButton').trigger(touchend);
	} else if($('#backButton').length && $('#backButton').is(':visible')) {
		if($('.dwo').length) {
			$('#getEntryDate').mobiscroll('cancel');
		} else {
			$('#backButton').addClass('button');
			$('#backButton').trigger(touchend);
		}
	} else if($('#advBackButton').length) {
			$('#advBackButton').addClass('button');
			$('#advBackButton').trigger(touchend);
	} else if($('#iconClear').is(':visible')) {
		$('#iconClear').trigger(touchstart);
	} else if($('#pageSlideFood').hasClass('open')) {
		if(app.read('foodDbLoaded','done')) {
			$('#appHeader').trigger(touchstart);
		}
	} else if($('#timerDailyInput').is(':focus')) {
		$('#timerDailyInput').trigger('blur');
	} else if($('#diaryNotesButton').length) {
		$('#diaryNotesButton').trigger(touchstart);
	} else if($('#appStatusFix').hasClass('open')) {
		$('#appStatusFix').removeClass('open');
		$('#startDate').mobiscroll('cancel');
	} else if($('.delete').hasClass('active')) {
		$('#go').trigger(tap);
	} else if($('#editableInput').is(':visible')) {
		$('#editableInput').trigger('focus');
		$('#editableInput').trigger('blur');
	} else if($('input,select').is(':focus')) {
		$('input,select,textarea').trigger('blur');
	} else if(!app.read('app_last_tab','tab1')) {
		if(app.read('app_last_tab','tab4')) {
			appFooter('tab3');	
		} else if(app.read('app_last_tab','tab3')) {
			appFooter('tab2');
		} else {
			appFooter('tab1');
		}
	} else {
		if(app.read('config_debug','active')) {
			afterHide();
		} else if(app.device.wp8) {
			$(document).off('backbutton');
			blockAlerts = 1;
			throw '';
		} else if(typeof navigator.app !== 'undefined') {
			if(typeof navigator.app.exitApp !== 'undefined') {
				navigator.app.exitApp();
			}
		} else {
			afterHide();
		}
	}
});
/////////////////
// PRESS ENTER //
/////////////////
$(document).on('pressenter', function(evt) {
	if($('#diaryNotesButton').length) {
		return true;
	} else {
		$('#timerDailyInput').trigger('blur');
		if($('#saveButton').length) {
			$('#saveButton').addClass('button');
			$('#saveButton').trigger(touchend);
		}
		$('#closeButton').trigger(touchend);
		$('#editableInput').trigger('blur');
		$('#entrySubmit').trigger(touchstart);
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
$(document).keydown(function(e) {
	if((/18|81/).test(e.keyCode)) {
		app.timers.keystrokeLock = 1;
	}
	if(app.device.osxapp && app.timers.keystrokeLock !== 1) {
		if(!$('input,input[type="number"]select,textarea').is(':focus')) {
			e.preventDefault();	
		}
	}
});
$(document).keyup(function(e) {
	if(e.keyCode == 81) {
		app.timers.keystrokeLock = 0;
	}
	if($('body').hasClass('spinnerMask')) { return false; }
	if(e.keyCode == 13) { $(document).trigger('pressenter'); }
	if(e.keyCode == 27) { $(document).trigger('backbutton'); }
	//CONSOLE(e.keyCode);
	///////////////////
	// MENU BACK KEY //
	///////////////////
	if($('#closeButton').length) { return; }
	if($('#modalWrapper').length) { return; }
	if(e.keyCode == 37 || e.keyCode == 39) {
		if($('#subBackButton').length) {
			if(e.keyCode == 37) {
				$('#subBackButton').addClass('button');
				$('#subBackButton').trigger(touchend);
			}
			return false;
		}
		if($('#backButton').length && $('#backButton').is(':visible')) {
			if(e.keyCode == 37) {
				if(!$('.dwo').length) {
					$('#backButton').addClass('button');
					$('#backButton').trigger(touchend);
				}
			}
			return false;
		}
		if($('#advBackButton').length) {
			if(e.keyCode == 37) {
				$('#advBackButton').addClass('button');
				$('#advBackButton').trigger(touchend);
			}
			return false;
		}
		if($('#langSelect').length) {
			if(e.keyCode == 37) {
				$('.preset').addClass('set');
				$('.preset').trigger(touchend)		
			}
			return false;
		}
	}
	//////////////////
	// NOT ON FOCUS //
	//////////////////
	if($('input,input[type="number"]select,textarea').is(':focus')) { return; }
	//////////////////
	// FAVS KEY NAV //
	//////////////////
	if($('#menuTopBar').is(':visible') && !$('#modalWrapper').length) {
		if(e.keyCode == 37) {
		         if(app.read('lastInfoTab','topBarItem-3')) { $('#topBarItem-2').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-2')) { $('#topBarItem-1').trigger(touchstart); }
			else if(app.read('lastInfoTab','topBarItem-1')) { $('#topBarItem-3').trigger(touchstart); }
		}
		if(e.keyCode == 39) {
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
		if(e.keyCode == 37) {
		         if(app.read('app_last_tab','tab4')) { appFooter('tab3'); }
			else if(app.read('app_last_tab','tab3')) { appFooter('tab2'); }
			else if(app.read('app_last_tab','tab2')) { appFooter('tab1'); }
			else if(app.read('app_last_tab','tab1')) { appFooter('tab4'); }
		}
		if(e.keyCode == 39) {
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
$(window).on('resize', function(evt) {
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
	if(app.device.windows8) {
		//resize triggers blur on orientation change
		if(window.innerWidth == initialScreenHeight && orientationSwitched == 0) {
			appResizer(0);
			appResizer(300);
			orientationSwitched = 1;
		} else if(window.innerWidth == initialScreenWidth && orientationSwitched == 1) {
			appResizer(0);
			appResizer(300);
			orientationSwitched = 0;
		}
		if(!$('input').has(':focus')) {
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
});
/////////////////////
// DEBUG INDICATOR //
/////////////////////
if(app.read('config_debug','active')) {
	$('#appFooter').addClass('appDebug');
	$('body').addClass('appDebug');
}
if(app.read('facebook_logged')) {
	$('#appFooter').addClass('appFacebook');
	$('body').addClass('appFacebook');
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
	$('body').addClass('wp8');
}
if(app.device.windows8) {
	$('body').addClass('windows8');
}
////////////////////////////
// FF OS ORIENTATION LOCK //
////////////////////////////
if(app.device.firefoxos) {
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
		if(macgap.menu.getItem('KCals').submenu().getItem(LANG.SETTINGS_WIPE[lang])) {
			macgap.menu.getItem('KCals').submenu().getItem(LANG.SETTINGS_WIPE[lang]).remove();
		}
		macgap.menu.getItem('KCals').submenu().addSeparator();
		macgap.menu.getItem('KCals').submenu().addItem(LANG.SETTINGS_WIPE[lang], 'cmd+opt+r', function() {
			appConfirm(LANG.SETTINGS_WIPE_TITLE[lang], LANG.ARE_YOU_SURE[lang], function(button) {
				if(button === 2) {
					deSetup();
					return false;
				}
			}, LANG.OK[lang], LANG.CANCEL[lang]);
		});
	} catch(e) {
		errorHandler(e);	
	}
	//CLOSE ON MINIMIZE
	$(document).on('visibilitychange', function () {
		clearTimeout(app.timers.terminate);
		app.timers.terminate = setTimeout(function() {
			if (document.hidden == true || document.visibilityState == 'hidden') {
				macgap.app.terminate();
			}
		},1000);
	});
}
/////////.//////
// CHROME APP //
//////////./////
if(app.device.chromeos) {
	$('body').addClass('chromeos');
}
////////////////
// BLACKBERRY //
////////////////
if(app.device.blackberry) {
	$('body').addClass('blackberry');
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
	$('body').addClass('local');	
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
if(LANG.LANGUAGE[lang] == 'en') {
	app.define('config_measurement','imperial');
	app.define('calcForm#feet','5');
	app.define('calcForm#inches','10');
	app.define('calcForm#pA3B','160');
	app.define('calcForm#pA2C','inches');
	app.define('calcForm#pA3C','pounds');
	app.define('calcForm#pA6H','pounds');
	app.define('calcForm#pA6N','pounds');
} else {
	app.define('config_measurement','metric');
	app.define('calcForm#feet','0');
	app.define('calcForm#inches','170');
	app.define('calcForm#pA3B','70');	
	app.define('calcForm#pA2C','centimetres');
	app.define('calcForm#pA3C','kilograms');
	app.define('calcForm#pA6H','kilograms');
	app.define('calcForm#pA6N','kilograms');
}
//###########################//
//####   START WORKING   ####//
//###########################//
setTimeout(function() {
	getNiceScroll('#appContent');
	appResizer(0);
	//updateEntries();
	if(opaLock < 3) {		
		$('body').removeClass('unloaded');
		$('body').addClass('started');
		$('body').css('opacity',1);
	}
	if(app.device.ios && typeof navigator.splashscreen !== 'undefined') {
		navigator.splashscreen.hide();
	}
},999);
////////////////////////////
// ALLOW HORIZONTAL SWIPE //
////////////////////////////
if(app.is.scrollable) {
	app.globals.X     = 0; 
	app.globals.Y     = 0;
	app.globals.MX    = 0; 
	app.globals.MY    = 0;
	app.globals.XLock = 0;
	$('body').on(touchend + ' mouseup',function(evt) {
		app.globals.XLock = 0;
		app.globals.X     = evt.pageX;
		app.globals.Y     = evt.pageY;
		app.globals.MX    = 0;
		app.globals.MY    = 0;
	});
	$('body').on(touchmove,function(evt) {
		//UPDATE POS
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
//refresh entrylist time
(function entryRetimer() {
	updateEntriesTime();
	setTimeout(entryRetimer,60*1000);
})();
//check last push
(function lastEntryPush() {
	var now = app.now();
	//sync lock
	if(app.read('pendingSync') && app.read('facebook_userid') && app.read('facebook_logged')) {
		if(now - app.read('pendingSync') > 30000) {
			syncEntries(app.read('facebook_userid'));
			app.save('pendingSync',app.read('pendingSync') + 30000);
		}
	}
	//push lock
	if(app.read('facebook_username') && app.read('facebook_logged') && app.read('lastEntryPush')) {
		if(now - app.read('lastEntryPush') > 500 && app.read('foodDbLoaded','done')) {
			pushEntries(app.read('facebook_userid'));
			app.save('lastEntryPush',app.read('lastEntryPush') + 30000);
		}
	}
	setTimeout(lastEntryPush,1000);
})();
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$('#appHeader').on(touchstart, function(evt) {
		var targetId = evt.target.id;
		//CLEAR BLOCK
		if(!$('#pageSlideFood').html() && !$('#newWindow').html()) {
			$('#appHeader').removeClass('closer');
			$('body').removeClass('closer');
			$('#timerDailyInput').removeAttr('readonly'); 
			$('#timerDailyInput').removeClass('dull'); 
		}
		//DEFER
		if(targetId == 'timerDailyInput' && ($('#pageSlideFood').html() || $('#newWindow').html())) {
			//inactive
			$('#timerDailyInput').attr('readonly','readonly'); 
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
		if($('#subBackButton').length)	{ $(document).trigger('backbutton'); return; }
		if($('#backButton').length)		{ $(document).trigger('backbutton'); return; }
		if($('#advBackButton').length)	{ $(document).trigger('backbutton'); return; }
		if($('#langSelect').length)		{ $(document).trigger('backbutton'); return; }
		
		if($('body').hasClass('newwindow') && !$('#modalWindow').length) { return; }
		//if(!$('#appHeader').hasClass('closer')) { return; }
		if($('#addNewWrapper').html())			{ return; }
		//hide food
		if($('#pageSlideFood').hasClass('open') && !$('#pageSlideFood').is(':animated')) {
			$('#foodSearch').blur();
			$('#pageSlideFood').addClass('busy');
			$('#appHeader').removeClass('open');
			$('#appHeader').removeClass('closer');
			$('body').removeClass('closer');
			$('#pageSlideFood').removeClass('open');
			$('#pageSlideFood').css('opacity',0);
			$('#pageSlideFood').on(transitionend,function(e) {
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
					},1000);
				}
			});
		}
	});
	///////////////////////////
	// blur edit / entrybody //
	/////////////////////////// BETA ~ ~ ~
	$('#appHeader,#appContent').on(touchstart, function(evt) {
		$('#appContent').show();
		if(evt.target.id != 'timerDailyInput') {
			$('#timerDailyInput').blur();
		}
		$('#entryTime').blur();
		if(!$('#entryBody').is(':focus')) {
			$('#entryBody').blur();
		}
	});
	$('#appHeader,#appContent,#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
		if(!app.read('app_last_tab','tab4')) {
			evt.preventDefault();
		}
		if($('#entryBody').is(':focus') && evt.target.id == 'entryTime') {
			$('#entryTime').focus();
		} else if($('#entryTime').is(':focus') && evt.target.id == 'entryBody') {
			$('#entryBody').focus();
		} else if(evt.target.id != 'entryTime' && evt.target.id != 'entryBody' && evt.target.id != 'timerDailyInput') {
			$('#timerDailyInput').blur();
			$('#entryTime').blur();
			$('#entryBody').blur();
		}
	});
	//////////////////
	// HEADER SWIPE //
	//////////////////
	var headerSwipe;
	var headerSwipeBlock = 0;	
	$('#appHeader').swipe({
		swipe:function(event,direction) {
			if(direction == 'left') {
				clearTimeout(headerSwipe);
				kickDown();
			         if(app.read('app_last_tab','tab4')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab3'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab3')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab2'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab2')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab1'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab1')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab4'); headerSwipeBlock = 0; }, 150); }
			} else if(direction == 'right') {
				clearTimeout(headerSwipe);
				kickDown();
			         if(app.read('app_last_tab','tab4')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab1'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab3')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab4'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab2')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab3'); headerSwipeBlock = 0; }, 150); }
				else if(app.read('app_last_tab','tab1')) { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter('tab2'); headerSwipeBlock = 0; }, 150); }	
			}
		}
	});
	$('#appHeader').swipe('option', 'threshold', 32);
	//////////////////////////
	// AJAX IN-PLACE EDITOR //
	//////////////////////////
	if(app.device.ios) {
		$('#timerDailyInput').on(touchstart, function(evt) {
			if(!$('#timerDailyInput').is(':focus')) {
				$('#timerDailyInput').focus();
			}
		});
	}
	if(app.device.desktop) {
		$('#timerDailyInput').attr('type','text');
	}
	
	var editableTimeout;
	app.handlers.validate('#timerDailyInput',{minValue: 100, defaultValue: function() { return app.get.kcals('reset'); }},'',function() {
		if($('#pageSlideFood').html() || $('#newWindow').html()) {
			$('#timerDailyInput').trigger('focus');
			$('#timerDailyInput').trigger('blur');
		}
	},function() {
		//FOCUS
		if(app.device.desktop) {
			$('#timerDailyInput').attr('type','number');
		}
		if($('#pageSlideFood').html() || $('#newWindow').html()) {
			$('#timerDailyInput').trigger('blur');
		}
	},function() {
		//UPDATE TODAY'S
		setTimeout(function() {
			updateTodayOverview();
			intakeHistory();
			setPush();
		},1000);
		//BLUR
		if(app.device.desktop) {
			setTimeout(function() {
				if(!$('#timerDailyInput').is(':focus')) {
					$('#timerDailyInput').attr('type','text');
				}
			},420);
		}
		app.save(app.get.kcals('key'),$('#timerDailyInput').val());
		updateTimer();
		// BACKUPDATE
		if(app.read('config_kcals_type','cyclic')) {
			if(app.read('config_kcals_day','d')) {
				$('#appCyclic2').val(app.read('config_kcals_day_2'));
			} else {
				$('#appCyclic1').val(app.read('config_kcals_day_1'));
			}
		}
	});	
///////
///////
///////
} catch(error) {
	app.reboot('reset',error);
}
////#//
} //#//
////#//

