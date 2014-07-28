//////////////////
// DEVICE READY //
//////////////////
$(document).ready(function() {
	//MARK AS READY
	$('body').addClass('ready');
	//SWAP CACHE
	window.applicationCache.addEventListener('updateready', function (event) {
		window.applicationCache.swapCache(); 
	}, false);
	//SETUP DB
	try {
		if(hasSql) {
			db = window.openDatabase(dbName, 1, dbName + "DB", 5*1024*1024);
			db.transaction(initDB, errorHandler, startApp);
		} else {
			lib  = new localStorageDB("mylivediet",  localStorage);
			lib2 = new localStorageDB("mylivediet2", localStorage);
			initDB();
		}
	} catch(error) {
		setTimeout(function() {
			if(window.MyReload) {
				window.MyReload.reloadActivity();
			} else {
				window.location.reload(true);
			}
		},1000);
		console.log(error);
	}
});
////////////////
// RESUME EVT //
////////////////
var resumeTimeout;
$(document).on('resume',function() {
	//silent restart
	if(window.localStorage.getItem("app_restart_pending")) {
		window.localStorage.removeItem("app_restart_pending");
		if(window.MyReload) {
			window.MyReload.reloadActivity();
		} else {
			window.location.reload(true);
		}
	}
	clearTimeout(resumeTimeout);
	//unhide
	$('body').removeClass('hidenotice');
	noteContent = '';
	resumeTimeout = setTimeout(function() { 
		expireNotice();
		updateLoginStatus(1);
		getAnalytics('resume');
		buildRemoteSuperBlock('cached');
		//SHOWHIDE NOTICE
		$('#timerTrial').fadeOut(100,function() {
			noteContent = LANG.DAYS_LEFT[lang] + ': ' + daysLeft();
			$('#timerTrial').fadeIn(300);
			setTimeout(function() { 
				$('#timerTrial').fadeOut(100,function() {
					$('body').addClass('hidenotice');
				});
			},5000);
		});
	},5000);
});
///////////////////////
// VISIBILITY CHANGE //
///////////////////////
$(document).on('visibilitychange', function () {
	if (document.hidden == false || document.visibilityState == 'visible') {
		if (isMobile.OSXApp()) {
			$(document).trigger('resume');
		}
		if(isMobile.FirefoxOS()) {
			screen.mozLockOrientation("portrait-primary");
			$(document).trigger('resume');
		}
	}
});
//##///////////##//
//## START APP ##//
//##///////////##//
function startApp() {
///////////////
// KICKSTART //
////////////////////
// UPDATE TRACKER //
////////////////////
setTimeout(function() { 
	if(!window.localStorage.getItem("app_build")) {
		window.localStorage.setItem("app_build",appBuild);
	}
	if(window.localStorage.getItem("app_build") != appBuild) {
		window.localStorage.setItem("app_build",appBuild);
		getAnalytics('update'); 
	}
},5000);
setTimeout(function() {
	window.localStorage.removeItem("app_restart_pending");
	getAnalytics('init'); 
},0);
setTimeout(function() { 
	expireNotice();
	updateLoginStatus(1);
	getAnalytics('startApp');
	//SHOWHIDE NOTICE
	$('#timerTrial').fadeOut(100,function() {
		noteContent = LANG.DAYS_LEFT[lang] + ': ' + daysLeft();
		$('#timerTrial').fadeIn(300);
		setTimeout(function() { 
			$('#timerTrial').fadeOut(100,function() {
				$('body').addClass('hidenotice');
			});
		},5000);
	});
},5000);
////////////////
// PARSED CSS //
////////////////
safeExec(function() {
	$("head").prepend("<style type='text/css' id='cssStartDate'> #startDateSpan:before { content: '" + LANG.START_DATE[lang] + "'; } </style>");
	$("head").prepend("<style type='text/css' id='daySum'></style>");
	$("head").prepend("<style type='text/css' id='cssAutoUpdate'>\
		.loading #advancedAutoUpdate:before	 { content: '" + LANG.DOWNLOADING[lang]     + "';/**/}\
		.pending #advancedAutoUpdate:before	 { content: '" + LANG.RESTART_PENDING[lang] + "'; }\
		.uptodate #advancedAutoUpdate:before { content: '" + LANG.UP_TO_DATE[lang]      + "'; }\
		.spinnerMask #loadMask:before		 { content: '" + LANG.PREPARING_DB[lang]    + "'; }\
	</style>");
});
updateNutriRatio();
updateEntriesSum();
///////////////
// SET TITLE //
///////////////
$("title").html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$("body").prepend('\
	<div id="appHeader"></div>\
	<div id="loadingDiv"></div>\
	<div class="editable" id="editableDiv">' + window.localStorage.getItem("config_kcals_day_0") + '</div>\
	<div id="appContent"></div>\
	<div id="appFooter">\
		<ul>\
			<li id="tab1">' + LANG.MENU_STATUS[lang]   + '</li>\
			<li id="tab2">' + LANG.MENU_DIARY[lang]    + '</li>\
			<li id="tab3">' + LANG.MENU_PROFILE[lang]  + '</li>\
			<li id="tab4">' + LANG.MENU_SETTINGS[lang] + '</li>\
		</ul>\
	</div>\
');
//#////////////#//
//# APP FOOTER #//
//#////////////#//
var releaseFooter;
var lastTab = 0;
preTab = function(keepOpen) {
	if(keepOpen == 1) { return; }
	kickDown();
	if($('#appContent').scrollTop() > 0) {
		if(isMobile.MSApp()) {
			$('#appContent').scrollTop(0);
		} else {
			window.location='#top';
			history.pushState("", document.title, window.location.pathname);
		}
	}
	//window.location.hash='';
};
afterTab = function(keepOpen) {
	if(keepOpen == 1) { return; }
	$("#appContent").show();
	$("#appContent").css('touch-events','auto');
	$("body").removeClass("newwindow");
	//
	$("#langSelect").remove();
	$("#newWindowWrapper").remove();
	$("#advancedMenuWrapper").remove();
	$("#appHelper").remove();
	$("#appSubHelper").remove();
	//clear pageslidefood
	if($("#pageSlideFood").html()) {
		if(!$("#pageSlideFood").is(":animated")) {
			$("#pageSlideFood").remove();
			$("#appHeader").removeClass("open");
		} else {
			$('#appHeader').trigger(touchstart);
		}
	}
	//NO 50ms FLICKER (android profile)
	appResizer(200);
};
appFooter = function (id,keepOpen) {
	if(new Date().getTime() - lastTab < 200) { lastTab = new Date().getTime(); return; }
	lastTab = new Date().getTime();
	var tabId = id;
	$("#appFooter li").removeClass("selected");
	window.localStorage.setItem("app_last_tab",tabId);
	$("#" + tabId).addClass("selected");
	//SCROLLBAR
	if(!isMobile.iOS() && !isMobile.MSApp() && !isMobile.Windows() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
		$("#appContent").css("overflow","hidden");
		setTimeout(function(){
			$("#appContent").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		},0);
	}
	//ACTION
	if(tabId == "tab1") { openStatus(keepOpen);   }
	if(tabId == "tab2") { updateEntries('','','callback',keepOpen); }
	if(tabId == "tab3") { openProfile(keepOpen);  }
	if(tabId == "tab4") { openSettings(keepOpen); }
	$("body").removeClass("tab1 tab2 tab3 tab4 newwindow");
	$("body").addClass(tabId);
};
//PRELOAD TAB1
if(!window.localStorage.getItem("app_last_tab")) {
	window.localStorage.setItem("app_last_tab","tab1");
}
//READ STORED
appFooter(window.localStorage.getItem("app_last_tab"));
///////////////////////
// LISTEN FOR CLICKS //
///////////////////////
$("#appFooter li").on(touchstart + " click", function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	//not while editing
	if($("#editableInput").is(":visible")) {
		$("#editableInput").blur();
		kickDown();
		return false;
	}
	//
	//
	appFooter($(this).attr("id"));
	if($('#editable').val()) {
		$('#appHeader').trigger(touchstart);
	}
	setTimeout(function() {
		getAnalytics("tab");
	},600);
});
////////////////////////
// WINDOWS OVERSCROLL //
////////////////////////
//ICON PREALOAD
if(isMobile.Windows()) {
	$("body").prepend("\
	<div id='preloadBlock'>\
		<span id='preload1'></span><span id='preload2'></span><span id='preload3'></span><span id='preload4'></span><span id='preload5'></span><span id='preload6'></span><span id='preload7'></span><span id='preload8'></span><span id='preload9'></span><span id='preload10'></span>\
		<span id='preload11'></span><span id='preload12'></span><span id='preload13'></span><span id='preload14'></span><span id='preload15'></span><span id='preload16'></span><span id='preload17'></span><span id='preload18'></span><span id='preload19'></span><span id='preload20'></span>\
		<span id='preload21'></span><span id='preload22'></span><span id='preload23'></span><span id='preload24'></span><span id='preload25'></span><span id='preload26'></span><span id='preload27'></span><span id='preload28'></span><span id='preload29'></span><span id='preload30'></span>\
		<span id='preload31'></span><span id='preload32'></span><span id='preload33'></span><span id='preload34'></span><span id='preload35'></span><span id='preload36'></span><span id='preload37'></span><span id='preload38'></span><span id='preload39'></span><span id='preload40'></span>\
		<span id='preload41'></span><span id='preload42'></span><span id='preload43'></span><span id='preload44'></span><span id='preload45'></span><span id='preload46'></span><span id='preload47'></span><span id='preload48'></span><span id='preload49'></span><span id='preload50'></span>\
	</div>");
}
if(isMobile.Windows()) {
	$("input").on("focus", function(evt) {
		$("html,body").css("position","fixed");
	});
	$("input").on("blur", function(evt) {
		$("html,body").css("position","absolute");
	});
}
////////////////////////
// BACK BUTTON (+ESC) //
////////////////////////
$(document).on("backbutton", function(evt) {
	if($('body').hasClass('spinnerMask')) { return false; }
	//
	if($("#langSelect").length) {
		$(".set").trigger(tap);
	} else if($("#skipIntro").length && myScroll.x) {
		//if(myScroll.x == 0) {
		//	$("#skipIntro").trigger(touchstart);
		//} else {
		if(myScroll) {
			myScroll.prev();
		}
		//}
	} else if(ref) {
		ref.close();
		ref = '';
	} else if($("#addNewCancel").length || $("#modalCancel").length) {
		$("#addNewCancel").trigger(touchstart);
		$("#modalCancel").trigger(touchstart);
	} else if($("#subBackButton").length) {
		$("#subBackButton").trigger(touchend);
	} else if($("#backButton").length && $("#backButton").is(":visible")) {
		if($('.dwo').length) {
			$("#getEntryDate").mobiscroll('cancel');
		} else {
			$("#backButton").trigger(touchend);
		}
	} else if($("#advBackButton").length) {
			$("#advBackButton").trigger(touchend);
	} else if($('#iconClear').is(":visible")) {
		$('#iconClear').trigger(touchstart);
	} else if($('#pageSlideFood').hasClass("open")) {
		if(window.localStorage.getItem("foodDbLoaded") == "done") {
			$('#appHeader').trigger(touchstart);
		}
	} else if($('#editable').val()) {
		$('#appHeader').trigger(touchstart);
	} else if($('#diaryNotesButton').length) {
		$('#diaryNotesButton').trigger(touchstart);
	} else if($('#appStatusFix').hasClass("open")) {
		$('#appStatusFix').removeClass("open");
		$("#startDate").mobiscroll('cancel');
	} else if($(".delete").hasClass("active")) {
		$('#go').trigger(tap);
	} else if($("#editableInput").is(":visible")) {
		$("#editableInput").trigger('focus');
		$("#editableInput").trigger('blur');
	} else if($('input,select').is(":focus")) {
		$('input,select,textarea').trigger('blur');
	} else if(window.localStorage.getItem("app_last_tab") != "tab1") {
		appFooter("tab1");
	} else {
		if(window.localStorage.getItem("config_debug") != "active" && navigator.app) {
			navigator.app.exitApp();
		} else {
			afterHide();			
		}
	}
});
////////////////
// dummyInput //
////////////////
/*
if(isMobile.FirefoxOS()) {
	$("#appHeader").on(touchstart,function() {
		$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
		$('#dummyInput').focus();
		$('#dummyInput').blur();
		$('#dummyInput').remove();
	});
}
*/
/////////////////
// PRESS ENTER //
/////////////////
$(document).on("pressenter", function(evt) {
	$("#editable").trigger("blur");
	$("#saveButton").trigger(touchend);
	$("#editableDiv").trigger("blur");
	$("#entrySubmit").trigger(touchstart);
	$("#modalOk").trigger(touchstart);
	$("#addNewConfirm").trigger(touchstart);
	if($(".set").html()) {
		$(".set").trigger(tap);
	} else {
		$("#skipIntro").trigger(touchend);
	}
	if($('#appStatusFix').hasClass("open")) {
		$("#startDate").mobiscroll('set');
		$('#appStatusFix').removeClass("open");
	}
	if($(".delete").hasClass("active")) {
		$(".delete.active").trigger(tap);
	}
});
//////////////////////
// KEYCODE LISTENER //
//////////////////////
$(document).keyup(function(e) {
	if(e.keyCode == 13) { $(document).trigger("pressenter"); }
	if(e.keyCode == 27) { $(document).trigger("backbutton"); }
	//CONSOLE(e.keyCode);
	//////////////
	// side nav //
	//////////////
	if(!$("input, textarea, select").is(":focus") && !$("#gettingStarted").html()) {
		if(e.keyCode == 37) {  
		         if(window.localStorage.getItem("app_last_tab") == "tab4") { appFooter("tab3"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab3") { appFooter("tab2"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab2") { appFooter("tab1"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab1") { appFooter("tab4"); }
		}
		if(e.keyCode == 39) { 
		         if(window.localStorage.getItem("app_last_tab") == "tab4") { appFooter("tab1"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab3") { appFooter("tab4"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab2") { appFooter("tab3"); }
			else if(window.localStorage.getItem("app_last_tab") == "tab1") { appFooter("tab2"); }	
		}
	}
});
//FORCE SHOW KEYBOARD
$(document).on("click", function(evt) {
	if(isMobile.Android() || isMobile.FirefoxOS()) {
		if($('#diaryNotesInput').length) {
			$('#diaryNotesInput').focus();
		}
	}
	if(isMobile.Windows() || isMobile.MSApp()) {
		if(evt.target.id == "editableDiv") {
			$('#editable').focus();
		}
	}
});
//ON SHOW KEYBOARD
$(document).on("showkeyboard", function(evt) {
	if($('#diaryNotesInput').is(":visible")) {
		setTimeout(function() {
			$('#diaryNotesInput').focus();
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$("#diaryNotesInput").height(window.innerHeight - 32);
			$("#diaryNotesInput").getNiceScroll().resize();
		},0);
		setTimeout(function() {
			$('#diaryNotesInput').focus();
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$("#diaryNotesInput").height(window.innerHeight - 32);
			$("#diaryNotesInput").getNiceScroll().resize();
		},300);
	}
});
//ON HIDE KEYBOARD
$(document).on("hidekeyboard",function() {
	appResizer(100);
	if($('#editable').val()) {
		$('#appHeader').trigger(touchstart);
	}
	if($("#editableInput").is(":visible")) {
		$("#editableInput").trigger('focus');
		$("#editableInput").trigger('blur');
	}
	kickDown();
	return false;
});
/////////////////
// ORIENTATION //
/////////////////
$(window).on("orientationchange", function(evt) {
	appResizer(0);
	appResizer(100);
	appResizer(300);
	appResizer(600); 
});
////////////
// RESIZE //
////////////
$(window).on("resize", function(evt) {
	lastScreenResize = lastScreenSize;
	lastScreenSize = window.innerHeight;
	//unlock top white gap
	$('body').trigger("touchmove");
	//IF WINDOW > BODY (PREVENT KEYBOARD COLAPSE)
	//if(window.innerHeight > $('body').height()) {
	if(initialScreenSize > $('body').height() && !isMobile.MSApp()) {
		//IOS re-scrolling bug
		$('#entryListWrapper').height( $('#entryListWrapper').height() + 1);
		$('#entryListWrapper').height( $('#entryListWrapper').height() - 1);
		appResizer(0);
	}
	//ALWAYS RESIZE NON-MOBILE BROWSER
	if(isMobile.MSApp()) {
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
		if(!$("input").has(":focus")) {
			appResizer(0);
		}
	} else if(isDesktop()) {
		appResizer(0);
	}
	//notepad (ios6 fix)(window.innerHeight)
	if($('#diaryNotesInput').length) {
		if($('#diaryNotesInput').is(":visible") && !isMobile.Windows() && !isMobile.MSApp()) {
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$("#diaryNotesInput").height(window.innerHeight - 32);
			$('#diaryNotesInput').width(window.innerWidth - 24);
			$("#diaryNotesInput").getNiceScroll().resize();	
			$('#diaryNotesButton span').css("top",(window.innerHeight/2) + "px");
		}
	}
	if(window.localStorage.getItem("app_last_tab") == "tab1") {
		//balance
		balanceMeter(timerKcals,'now');
		setTimeout(function() { balanceMeter(timerKcals,'now');	},0);
		setTimeout(function() { balanceMeter(timerKcals,'now');	},600);
		//intake history
		intakeHistory();
	}
	//always resize intro
	if($("#closeDiv").html()) {
		appResizer(0);
	}
	//resize statistics
	setTimeout(function() {
		if($("#appHistory").html() && typeof rebuildHistory == 'function') {
			rebuildHistory();
		}
	},0);
});
//##////////////##//
//##//  ONLOAD  ##//
//##////////////##//
setTimeout(function() {
	appResizer(0);
},1)
/////////////////////
// DEBUG INDICATOR //
/////////////////////
if(window.localStorage.getItem("config_debug") == "active") {
	$("#appFooter").addClass("appDebug");
	$("body").addClass("appDebug");
}
if(window.localStorage.getItem("facebook_logged")) {
	$("#appFooter").addClass("appFacebook");
	$("body").addClass("appFacebook");
}
/////////////////////
// ADJUST ELEMENTS //
/////////////////////
var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
if(window.localStorage.getItem("config_kcals_type") == "cyclic")  {
	if(window.localStorage.getItem("config_kcals_day") == "d") {
		getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
	} else {
		getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
	}
}
$("#editableDiv").html(getKcalsItem);
/////////////
// OPTIONS //
/////////////
//set default
if(!window.localStorage.getItem("config_kcals_type")) {
	window.localStorage.setItem("config_kcals_type","simple");
}
if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
	$("body").addClass("cyclic");
} else {
	$("body").addClass("simple");	
}
///////////
// IOS 7 //
///////////
if(/OS [7-9](.*) like Mac OS X/i.test(userAgent) && isMobile.Cordova()) {
	$("body").addClass("ios7");
}
if(isMobile.iOS()) {
	$("body").addClass("ios");
}
/////////////
// ANDROID //
/////////////
if(isMobile.Android()) {
	$("body").addClass("android");
}
if(isMobile.Android() && androidVersion() < 4) {
	$("body").addClass("android2");
}
if(isMobile.Android() && androidVersion() >= 4 && androidVersion() < 4.4) {
	$("body").addClass("android4");
}
if(isMobile.Android() && androidVersion() >= 4.4) {
	$("body").addClass("android44");
}
if(isMobile.Android() && androidVersion() < 4.4) {
	$("body").addClass("android4lt");
}
if(isMobile.Android() && androidVersion() == 4) {
	$("body").addClass("android40");
}
if(isMobile.Android() && androidVersion() == 4.1) {
	$("body").addClass("android41");
}
if(isMobile.Android() && androidVersion() == 4.2) {
	$("body").addClass("android42");
}
if(isMobile.Android() && androidVersion() == 4.3) {
	$("body").addClass("android43");
}
/////////////
// WINDOWS //
/////////////
if(isMobile.Windows()) {
	$("body").addClass("windows");
}
if(isMobile.MSApp()) {
	$("body").addClass("msapp");
}
////////////////////
// WP8 @FONT-FACE //
////////////////////
if(isMobile.Windows() || isMobile.MSApp()) {
	$('body').append("<span id='fontCheck' style='font-family: FontAwesome, Arial;'>+</span>");
	//COMPARE WIDTH
	if($("#fontCheck").width() != "16") {
		$('body').addClass("msie-png");		
	}
	$("#fontCheck").remove();
}
////////////////////////////
// FF OS ORIENTATION LOCK //
////////////////////////////
if(isMobile.FirefoxOS()) {
	screen.mozLockOrientation("portrait-primary");
}
////////////
// VENDOR //
////////////
$("body").addClass(vendorClass);
$("body").addClass("appLang-" + lang);
/////////
// OSX //
/////////
if(isMobile.OSX()) {
	$("body").addClass("osx");
}
if(isMobile.OSXApp()) {
	$("body").addClass("osxapp");
	//CLOSE ON MINIMIZE
	$(document).on('visibilitychange', function () {
		if (document.hidden == true || document.visibilityState == 'hidden') {
			macgap.app.terminate();
		}
	});
}
/////////////
// CORDOVA //
/////////////
if(isMobile.Cordova()) {
	$("body").addClass("cordova");
}
/////////////
// DESKTOP //
/////////////
if(isDesktop()) {
	$("body").addClass("desktop");
} else {
	$("body").addClass("mobile");	
}
////////////////////
// PRESET PROFILE //
////////////////////
if(!window.localStorage.getItem("calcForm#pA1B")) {
	//male/female
	window.localStorage.setItem("calcForm#pA1B","Male");
	window.localStorage.setItem("calcForm#pA2B","70");
	window.localStorage.setItem("calcForm#pA2C","inches");
	window.localStorage.setItem("calcForm#pA3B","160");
	window.localStorage.setItem("calcForm#pA3C","pounds");
	window.localStorage.setItem("calcForm#pA4B","20");
	window.localStorage.setItem("calcForm#pA5B","Sedentary (little or no exercise, desk job)");
	window.localStorage.setItem("calcForm#pA6G","1");
	window.localStorage.setItem("calcForm#pA6H","pounds");
	window.localStorage.setItem("calcForm#pA6M","1");
	window.localStorage.setItem("calcForm#pA6N","pounds");
	window.localStorage.setItem("calcForm#feet","5");
	window.localStorage.setItem("calcForm#inches","10");
	//LOCALE
	window.localStorage.setItem("config_measurement","imperial");
	if(LANG.LANGUAGE[lang] != "en") {
		window.localStorage.setItem("calcForm#feet","0");
		window.localStorage.setItem("calcForm#inches","170");
		window.localStorage.setItem("calcForm#pA3B","70");	
		window.localStorage.setItem("config_measurement","metric");
		window.localStorage.setItem("calcForm#pA2C","centimetres");
		window.localStorage.setItem("calcForm#pA3C","kilograms");
		window.localStorage.setItem("calcForm#pA6H","kilograms");
		window.localStorage.setItem("calcForm#pA6N","kilograms");
	}
}
//###########################//
//####   START WORKING   ####//
//###########################//
setTimeout(function() {
	//updateEntries();
	if(opaLock < 2 && ($("#loadMask").length || $("body").css("opacity") == 0)) {		
		$('body').addClass('started');
		$('body').css("opacity","1");
	}
	if(isMobile.iOS && hasTouch() && navigator.splashscreen) {
		navigator.splashscreen.hide();
	}
},1000);
///////////////////////////
// ANDROID FIRST INSTALL //
///////////////////////////
setTimeout(function () {
	try {
		if (androidVersion() >= 3) {
			if (window.MyReload) {
				if (window.MyReload.getPackageInstallTime) {
					var installTime = window.MyReload.getPackageInstallTime();
					installTime = parseInt(installTime);
					installTime = JSON.stringify(installTime);
					if (installTime.length >= 13 && !isNaN(installTime)) {
						window.localStorage.setItem("config_install_time", installTime);
					}
				}
			}
		}
	} catch (e) {}
}, 1000);
/////////////
// LICENSE //
/////////////
(function licenseTimer() {
	isPaid();
	checkLicense();
	setTimeout(licenseTimer, 2000);
})();
////////////////
// MAIN TIMER //
////////////////
(function startTimer() {
	if(typeof updateTimer == 'function') {
		timerPerf = (new Date().getTime());
		//CONSOLE(timerDiff,1);
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
	var now = new Date().getTime();
	//sync lock
	if(window.localStorage.getItem("pendingSync") && window.localStorage.getItem("facebook_userid") && window.localStorage.getItem("facebook_logged")) {
		if(now - window.localStorage.getItem("pendingSync") > 30000) {
			syncEntries(window.localStorage.getItem("facebook_userid"));
			window.localStorage.setItem("pendingSync",Number(window.localStorage.getItem("pendingSync")) + 30000);
		}
	}
	//push lock
	if(window.localStorage.getItem("facebook_username") && window.localStorage.getItem("facebook_logged") && window.localStorage.getItem("lastEntryPush")) {
		if(now - window.localStorage.getItem("lastEntryPush") > 500 && window.localStorage.getItem("foodDbLoaded") == "done") {
			pushEntries(window.localStorage.getItem("facebook_userid"));
			window.localStorage.setItem("lastEntryPush",Number(window.localStorage.getItem("lastEntryPush")) + 30000);
		}
	}
	setTimeout(lastEntryPush,1000);
})();
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$("#appHeader,#editableDiv").on(touchstart, function(evt) {
		     if($("#subBackButton").length)		{ $("#subBackButton").trigger(touchend); }
		else if($("#backButton").length)		{ $("#backButton").trigger(touchend); }
		else if($("#advBackButton").length)		{ $("#advBackButton").trigger(touchend); }
		else if($("#langSelect").length)		{ $(".set").trigger(tap); }
		
		if($("body").hasClass("newwindow") && !$('#modalWindow').html()) { return; }
		if(!$("#appHeader").hasClass("closer")) { return; }
		if($("#addNewWrapper").html())			{ return; }
		//hide food
		if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy") && !$('#pageSlideFood').is(":animated")) {
			$("#foodSearch").blur();
			$('#pageSlideFood').addClass('busy');
			$('#appHeader').removeClass("open");
			$('#appHeader').removeClass("closer");
			$('body').removeClass("closer");
			$('#pageSlideFood').removeClass("open");
			$('#pageSlideFood').css('opacity',0);
			$('#pageSlideFood').on(transitionend,function(e) {
				$('#pageSlideFood').removeClass('busy');
				$('#appHeader').removeClass("closer");
				$('body').removeClass("closer");
				//WIPE ON CLOSE
				$('#pageSlideFood').remove();
				//force custom dump/save
				if(typeof updateCustomList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
					updateCustomList('fav');
					updateCustomList('items');
					setTimeout(function() { setPush(); }, 1000);
				}
			});
		}
	});
	///////////////////////////
	// blur edit / entrybody //
	/////////////////////////// BETA ~ ~ ~
	$('#appHeader,#appContent').on(touchstart, function(evt) {
		$("#appContent").show();
		$("#editable").blur();
		$("#entryTime").blur();
		if(!$("#entryBody").is(":focus")) {
			$("#entryBody").blur();
		}
	});
	$('#appHeader,#appContent,#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
		if(window.localStorage.getItem("app_last_tab") != "tab4") {
			evt.preventDefault();
		}
		if($("#entryBody").is(":focus") && evt.target.id == "entryTime") {
			$("#entryTime").focus();
		} else if($("#entryTime").is(":focus") && evt.target.id == "entryBody") {
			$("#entryBody").focus();
		} else if(evt.target.id != "entryTime" && evt.target.id != "entryBody") {
			$("#editable").blur();
			$("#entryTime").blur();
			$("#entryBody").blur();
		}
	});
	//////////////////
	// HEADER SWIPE //
	//////////////////
	var headerSwipe;
	var headerSwipeBlock = 0;	
	$("#appHeader").swipe({
		swipe:function(event,direction) {
			if(direction == 'left') {
				clearTimeout(headerSwipe);
				kickDown();
			         if(window.localStorage.getItem("app_last_tab") == "tab4") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab3"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab3") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab2"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab2") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab1"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab1") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab4"); headerSwipeBlock = 0; }, 150); }
			} else if(direction == 'right') {
				clearTimeout(headerSwipe);
				kickDown();
			         if(window.localStorage.getItem("app_last_tab") == "tab4") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab1"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab3") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab4"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab2") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab3"); headerSwipeBlock = 0; }, 150); }
				else if(window.localStorage.getItem("app_last_tab") == "tab1") { headerSwipeBlock = 1; headerSwipe = setTimeout(function() { appFooter("tab2"); headerSwipeBlock = 0; }, 150); }	
			}
		}
	});
	$("#appHeader").swipe("option", "threshold", 32);
	//////////////////////////
	// AJAX IN-PLACE EDITOR //
	//////////////////////////
	var editableTimeout;
	$('div.editable').on(tap, function(evt) {
		     if($("#subBackButton").length)		{ return; }
		else if($("#advBackButton").length)		{ return; }
		else if($("#backButton").length)		{ return; }
		else if($("#langSelect").length)		{ return; }
		//not with sidemenu
		if(!$('#pageSlideFood').hasClass('busy') && !$('#pageSlideFood').hasClass('open') && !$('#pageSlideFood').is(":animated") ) {
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#modalOverlay').is(':visible') ) {
		//not with delete button
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on(transitionend,function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			////////////////////////
			// DEFINE KCALS VALUE //
			////////////////////////
			var getKcalsKey  = "config_kcals_day_0";
			var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
			var eqPerDay     = window.localStorage.getItem("config_kcals_day_0");
			var resetValue   = 2000;
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					getKcalsKey  = "config_kcals_day_2";
					getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
					eqPerDay     = window.localStorage.getItem("config_kcals_day_2");
				} else {
					getKcalsKey  = "config_kcals_day_1";
					getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
					eqPerDay     = window.localStorage.getItem("config_kcals_day_1");
					resetValue   = 1600;
				}
			}	
			//edit
			if(!$(this).has('input').length) {
				var timedBlur = new Date().getTime();
				var value = $(this).text();
				var input = $('<input/>', {
					'type':'number',
					'id':'editable',
					'class':'editable',
					'value': Number(value),
					//ONCHANGE HANDLER
					blur: function() {
						$(this).val( parseInt($(this).val()) );
						////////////////
						// TIMED BLUR //
						////////////////
						var nowBlur = new Date().getTime();
						if(nowBlur - timedBlur < 500) {
							var blurVal = $("#editable").val();
							$("#editable").val('');
							$("#editable").focus();
							setTimeout( function() {
								$("#editable").val(blurVal);
							},0);
						return; 
						}
						var new_value = Math.ceil($(this).val());
						//NULL-MIN-MAX
						if(isNaN( $(this).val()) || $(this).val() == 0 || $(this).val() <= 1)   { this.value = resetValue; }
						if(this.value < 100 && !isNaN(this.value) && this.value > 1)            { this.value = 100;  }
						if(this.value > 9999)													{ this.value = 9999; }
						//filter zeros
						var permValue = Math.round(parseInt(this.value));
						window.localStorage.setItem(getKcalsKey,permValue);
						//SET CSS TRANSITION
						$('#editable').css(prefix + "transition-timing-function","ease");
						$('#editable').css(prefix + "transition-duration",".175s");
						clearTimeout(editableTimeout);
						editableTimeout = setTimeout(function() {
							// BACKUPDATE
							if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
								if(window.localStorage.getItem("config_kcals_day") == "d") {
									$("#appCyclic2").val(window.localStorage.getItem("config_kcals_day_2"));
								} else {
									$("#appCyclic2").val(window.localStorage.getItem("config_kcals_day_1"));	
								}
							}
							//
							$("#editable").css("opacity",0);
							if(!isMobile.Android()) {
								$('#editable').on(transitionend,function(e) {
									$("#editable").remove();
									$("#editableDiv").html(window.localStorage.getItem(getKcalsKey));
									updateTimer();
									setPush();
								});
							} else {
								$("#editable").remove();
								$("#editableDiv").html(window.localStorage.getItem(getKcalsKey));
								updateTimer();
								setPush();
							}
						},600);
						$("#editableBlock").remove();
						updateTodayOverview();
						intakeHistory();
					},
					change: function() {
						if(hasTap()) {
							$("#editable").blur();
						}
					}
				});
				$(this).empty();
				$(this).append(input);
				//FOCUS, THEN SET VALUE
				var editableValue = $("#editable").val();
				//slider temp blocker
				$("body").append("<div id='editableBlock'></div>");
				$("#editableBlock").css("top",$("#appHeader").height() + "px");
				//android focus-blink fix
				//$("#editable").focus();
				$(this).val(editableValue);
				//$("#editable").select();
				/////////////////////////
				// backport validation //
				/////////////////////////
				var defaultInputHeader = "keypress";
				if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeader = "keydown"; }
				$("#editable").on(defaultInputHeader, function(evt) {
					//no dots
					if((evt.which || evt.keyCode) == 46) { return false; }
					if((evt.which || evt.keyCode) == 8)  { return true; }
					if((evt.which || evt.keyCode) == 13) { return true; }
					//max
					if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
						$(this).val( parseInt($(this).val()) );
						if(isNumberKey(evt)) {
							$(this).val( $(this).val().slice(0,-1) );
						}
					}
					return isNumberKey(evt);
				});
				//
			}}}}
		}
	});
////#//
} //#//
////#//

