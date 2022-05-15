﻿////////////////
// SHOW INTRO //
////////////////
var myScroll;
function showIntro() {
	'use strict';
	///////////////////////////////////////
	// SKIP INTRO FOR VERY SMALL DEVICES //
	///////////////////////////////////////
	//& wp8.1 under wp10
	if((app.height() < 350 && app.device.blackberry) || (/Windows Phone 8.1/i.test(app.ua) && /Trident\/8/i.test(app.ua)) ) {
		return;
	}
	//////////////////
	// ISCROLL HTML //
	//////////////////
	$('#gettingStarted').remove();
	$('body').append2('\
	<div id="gettingStarted">\
		<div id="viewport">\
			<div id="wrapper">\
				<div id="scroller">\
					<div class="slide" id="slide1"><p>' + LANG.INTRO_SLIDE_1[lang].split('.').join('. ') + '</p></div>\
					<div class="slide" id="slide2"><p>' + LANG.INTRO_SLIDE_2[lang].split('.').join('. ') + '</p>\
						<span id="deficit">' + LANG.DEFICIT[lang] + '</span>\
						<span id="balanced">' + LANG.BALANCED[lang] + '</span>\
						<span id="surplus">' + LANG.SURPLUS[lang] + '</span>\
					</div>\
					<div class="slide" id="slide3"><p>' + LANG.INTRO_SLIDE_3[lang].split('.').join('. ') + '</p>\
						<span id="deficit">' + LANG.EXERCISE[lang] + '</span>\
						<span id="balanced">' + LANG.CALORIC_BALANCE[lang] + '</span>\
						<span id="surplus">' + LANG.FOOD[lang] + '</span>\
					</div>\
					<div class="slide" id="slide4"><p>' + LANG.INTRO_SLIDE_4[lang].split('.').join('. ') + '</p>\
						<span id="deficit">' + LANG.DEFICIT[lang] + '</span>\
						<span id="balanced">' + LANG.BALANCED[lang] + '</span>\
						<span id="surplus">' + LANG.SURPLUS[lang] + '</span>\
						<span id="clock"><span class="hand minute"></span><span class="hand hour"></span></span>\
					</div>\
					<div class="slide" id="slide5"><p>' + LANG.INTRO_SLIDE_5[lang].split('.').join('. ') + '</p>\
						<span id="deficit">' + LANG.DEFICIT[lang] + '</span>\
						<span id="balanced">' + LANG.BALANCED[lang] + '</span>\
						<span id="surplus">' + LANG.SURPLUS[lang] + '</span>\
						<span id="clock"><span class="hand minute"></span><span class="hand hour"></span></span>\
					</div>\
					<div class="slide" id="slide6"><p>' + LANG.INTRO_SLIDE_6[lang].split('.').join('. ') + '</p><div id="closeDiv">' + LANG.CLOSE_INTRO[lang] + '</div></div>\
				</div>\
			</div>\
		</div>\
		<div id="nextDiv"></div>\
		<div id="prevDiv"></div>\
		<div id="indicator">\
			<div id="dotty"></div>\
		</div>\
		<div id="appLang">'   + LANG.LANGUAGE_NAME[lang] + '</div>\
		<div id="skipIntro">' + LANG.SKIP[lang]          + '</div>\
	</div>');
	//////////////
	// HANDLERS //
	//////////////
	$('#skipIntro, #closeDiv').on(touchend + ' click',function(evt) {
		evt.stopPropagation();
		//manually dismissed
		app.save('intro_dismissed','done');
		//QUICK PRE-UPDATE
		if(app.read('app_restart_pending')) {
			app.remove('app_restart_pending');
			if(app.read('config_autoupdate','on')) {
				app.reboot('now');
			}
		} else {
			app.handlers.fade(0,'#gettingStarted',function() {
				setTimeout(function() {
					if(typeof myScroll !== 'undefined') {
						myScroll.destroy();
					}
					$('#iScrollTag').remove();
				},600);
			});
		}
		evt.preventDefault();
	});
	$('#gettingStarted').on(touchstart,function(evt) {
		evt.stopPropagation();
	});
	$('#appLang').on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		buildLangMenu('intro');
	});
	///////////////
	// NEXT/PREV //
	///////////////
	$('#nextDiv').on(touchstart,function(evt) {
		evt.stopPropagation();
		if(typeof myScroll !== 'undefined') {
			if(myScroll.currentPage.pageX == 5) {
				$('#skipIntro').trigger(touchend);
			}
			myScroll.next();
		}
	});
	$('#prevDiv').on(touchstart,function(evt) {
		evt.stopPropagation();
		if(typeof myScroll !== 'undefined') {
			myScroll.prev();
		}
	});
	///////////////
	// INDICATOR //
	///////////////
	$(window).on('resize',function() {
		if($('#indicator').length) {
			$('#indicator').css2('left',( ($('body').width() - $('#indicator').width()) / 2) + 'px');
		}
	});
	$(window).trigger('resize');
	/////////////
	// ISCROLL //
	/////////////
	setTimeout(function() {
		if($('#gettingStarted').html()) {
			try {
				myScroll = new IScroll('#wrapper', {
					scrollX : true,
					scrollY : false,
					momentum : false,
					snap : 'div',
					snapSpeed : 600,
					snapThreshold : 1 / ($('body').width() * 0.01),
					keyBindings : true,
					//bindToWrapper: true,
					indicators : {
						el : document.getElementById('indicator'),
						resize : false
					}
				});
			} catch(err) {
				errorHandler('error: new IScroll | ' + err);
			}
		}
	}, 400);
}
/////////////
// INIT DB //
/////////////
function initDB(t) {
	'use strict';
	////////////
	// DEFINE //
	////////////
	app.define('app_database',localforage._driver);
	app.define('config_install_time',app.now());
	app.define('app_last_tab','tab1');
	app.define('config_start_time',app.now());
	app.define('config_kcals_day_0',2000);
	app.define('config_kcals_day_1',1600);
	app.define('config_kcals_day_2',2000);
	app.define('appBalance',LANG.BALANCED[lang]);
	app.define('lastSync','never');
	app.define('searchType','food');
	app.define('lastInfoTab','topBarItem-1');
	app.define('totalEntries',0);
	app.define('totalRecentEntries',0);
	app.define('appNutrients','25|50|25');
	app.define('appNutrientTimeSpan',1);
	app.define('config_ttf',0);
	app.define('config_tte',0);
	app.define('config_limit_1',-600);
	app.define('config_limit_2',600);
	app.define('appStatus','stopped');
	app.define('app_counter_mode','regressive');
	app.define('colorDeficit','#E54B1D');
	app.define('colorBalanced','#007AFF');
	app.define('colorSurplus','#2DB454');
	app.define('waterConsumed', 0);
	app.define('waterLastDay',app.today());
	///////////
	// START //
	///////////
	(function () {
		app.read('diary_entry', function (rows) {
			appRows.entry = rows;
			app.read('diary_food', function (rows) {
				appRows.food = rows;
				////////////////
				// SHOW INTRO //
				////////////////
				if(!app.read('intro_dismissed')) {
					showIntro();
				} else {
					$('#iScrollTag').remove();
				}
				///////////////
				// GO STATIC //
				///////////////
				//setTimeout(function() {
					startApp();
				//},0);
				/////////////////////////
				// REBUILD OUTDATED DB //
				/////////////////////////
				if (app.read('foodDbLoaded', 'done') && app.read('foodDbVersion') > 0 && app.read('foodDbVersion') != 5) {
					app.remove('foodDbLoaded', 'done');
					$('body').addClass('updtdb');
					setTimeout(function () {
						updateFoodDb();
					}, 100);
				}
			});
		});
	})();
}
////////////////////
// RESET DATA+SQL //
////////////////////
function deSetup(callback) {
	'use strict';
	blockAlerts = 1;
	localforage.clear(function() {
		afterHide('clear');
	});
}
///////////////////
// CLEAR ENTRIES //
///////////////////
function clearEntries(callback) {
	'use strict';
	for(var i=0, len=appRows.entry.length; i<len; i++) {
		appRows.entry[i].info = 'deleted';
	}
	app.save('diary_entry',appRows.entry,function(rows) {
		appRows.entry = rows;
		setPush();
		callback();
	});
}
///////////////////
// RESET COUNTER //
///////////////////
app.resetCounter = function(pusher) {
	'use strict';
	$('#appStatus').removeClass('reset');
	$('#appStatus').addClass('start');
	$('#appStatusTitle').html2(LANG.START[lang]);
	//STOP COUNTER
	app.save('config_start_time',app.now());
	app.save('appStatus','stopped');
	//RESET BACKPORT
	app.save('config_entry_sum',0);
	app.save('config_entry_f-sum',0);
	app.save('config_entry_e-sum',0);
	app.save('config_ttf',0);
	app.save('config_tte',0);
	$('#appStatusBars p').css2('width',0);
	$('#appStatusBars span').html2('0%');
	$('#appStatusBalance div p').html2(LANG.BALANCED[lang]);
	updateTodayOverview();
	updateNutriBars();
	//TRACKER
	app.analytics('reset');
	/////////////////////
	// RELOAD ON RESET //
	/////////////////////
	app.save('waterConsumed',0);
	if(app.read('app_last_tab') === 'tab1') {
		appFooter('tab1');
	}
	if(pusher == 1) {
		setPush();
	}
};
//////////////////////////////
// SQL-ENCODE LOCAL STORAGE //
//////////////////////////////
function localStorageSql() {
	'use strict';
	var keyList = '';
	//daily
	if(app.read('config_kcals_type'))	{ keyList = keyList + '#@@@#' + 'config_kcals_type'  + '#@@#' + app.read('config_kcals_type');  }
	if(app.read('config_kcals_day_0'))	{ keyList = keyList + '#@@@#' + 'config_kcals_day_0' + '#@@#' + app.read('config_kcals_day_0'); }
	if(app.read('config_kcals_day_1'))	{ keyList = keyList + '#@@@#' + 'config_kcals_day_1' + '#@@#' + app.read('config_kcals_day_1'); }
	if(app.read('config_kcals_day_2'))	{ keyList = keyList + '#@@@#' + 'config_kcals_day_2' + '#@@#' + app.read('config_kcals_day_2'); }
	if(app.read('config_measurement'))	{ keyList = keyList + '#@@@#' + 'config_measurement' + '#@@#' + app.read('config_measurement'); }
	if(app.read('config_limit_1'))		{ keyList = keyList + '#@@@#' + 'config_limit_1'     + '#@@#' + app.read('config_limit_1');     }
	if(app.read('config_limit_2'))		{ keyList = keyList + '#@@@#' + 'config_limit_2'     + '#@@#' + app.read('config_limit_2');     }
	//weight tracker
	if(app.read('weight_tracker'))		{ keyList = keyList + '#@@@#' + 'weight_tracker'     + '#@@#' + app.read('weight_tracker');     }
	//counter mode
	if(app.read('app_counter_mode'))	{ keyList = keyList + '#@@@#' + 'app_counter_mode' + '#@@#' + app.read('app_counter_mode');		}
	if(app.read('colorDeficit'))		{ keyList = keyList + '#@@@#' + 'colorDeficit'     + '#@@#' + app.read('colorDeficit');			}
	if(app.read('colorBalanced'))		{ keyList = keyList + '#@@@#' + 'colorBalanced'    + '#@@#' + app.read('colorBalanced');		}
	if(app.read('colorSurplus'))		{ keyList = keyList + '#@@@#' + 'colorSurplus'     + '#@@#' + app.read('colorSurplus');			}
	//recents
	if(app.read('app_recent_items'))	{ keyList = keyList + '#@@@#' + 'app_recent_items' + '#@@#' + app.read('app_recent_items');     }
	//nutrients
	if(app.read('appNutrients'))		{ keyList = keyList + '#@@@#' + 'appNutrients' + '#@@#' + app.read('appNutrients');             }
	if(app.read('appRatioBy'))			{ keyList = keyList + '#@@@#' + 'appRatioBy'   + '#@@#' + app.read('appRatioBy');               }
	if(!isNaN(app.read('appNutrientTimeSpan'))) { keyList = keyList + '#@@@#' + 'appNutrientTimeSpan' +'#@@#'+ JSON.stringify(app.read('appNutrientTimeSpan')); }
	//water
	if(app.read('waterLastDay'))		{ keyList = keyList + '#@@@#' + 'waterLastDay'  + '#@@#' + app.read('waterLastDay');            }
	if(app.read('waterConsumed'))		{ keyList = keyList + '#@@@#' + 'waterConsumed' + '#@@#' + app.read('waterConsumed');           }
	//overrides ~ water/fiber/sugar/sodium
	if(app.read('override_water'))		{ keyList = keyList + '#@@@#' + 'override_water'        + '#@@#' + app.read('override_water');        }
	if(app.read('override_water_value')){ keyList = keyList + '#@@@#' + 'override_water_value'  + '#@@#' + app.read('override_water_value');  }
	if(app.read('override_fiber'))		{ keyList = keyList + '#@@@#' + 'override_fiber'        + '#@@#' + app.read('override_fiber');        }
	if(app.read('override_fiber_value')){ keyList = keyList + '#@@@#' + 'override_fiber_value'  + '#@@#' + app.read('override_fiber_value');  }
	if(app.read('override_sugar'))		{ keyList = keyList + '#@@@#' + 'override_sugar'        + '#@@#' + app.read('override_sugar');        }
	if(app.read('override_sugar_value')){ keyList = keyList + '#@@@#' + 'override_sugar_value'  + '#@@#' + app.read('override_sugar_value');  }
	if(app.read('override_sodium'))		{ keyList = keyList + '#@@@#' + 'override_sodium'       + '#@@#' + app.read('override_sodium');       }
	if(app.read('override_sodium_value')){keyList = keyList + '#@@@#' + 'override_sodium_value' + '#@@#' + app.read('override_sodium_value'); }
	//notes
	if(app.read('appNotes')) {
		keyList = keyList + '#@@@#' + 'appNotes' + '#@@#' + app.read('appNotes').replace(/(\n|\r\n)/g, '#@#').split('/*').join('/ *');
	} else {
		keyList = keyList + '#@@@#' + 'appNotes' + '#@@#' + '';
	}
	//form
	if(app.read('calcForm#feet'))	{ keyList = keyList + '#@@@#' + 'calcForm#feet' + '#@@#' + app.read('calcForm#feet'); }
	if(app.read('calcForm#inches'))	{ keyList = keyList + '#@@@#' + 'calcForm#inches' + '#@@#' + app.read('calcForm#inches'); }
	if(app.read('calcForm#pA1B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA1B' + '#@@#' + app.read('calcForm#pA1B'); }
	if(app.read('calcForm#pA2B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA2B' + '#@@#' + app.read('calcForm#pA2B'); }
	if(app.read('calcForm#pA2C'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA2C' + '#@@#' + app.read('calcForm#pA2C'); }
	if(app.read('calcForm#pA3B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA3B' + '#@@#' + app.read('calcForm#pA3B'); }
	if(app.read('calcForm#pA3C'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA3C' + '#@@#' + app.read('calcForm#pA3C'); }
	if(app.read('calcForm#pA4B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA4B' + '#@@#' + app.read('calcForm#pA4B'); }
	if(app.read('calcForm#pA5B'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA5B' + '#@@#' + app.read('calcForm#pA5B'); }
	if(app.read('calcForm#pA6G'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6G' + '#@@#' + app.read('calcForm#pA6G'); }
	if(app.read('calcForm#pA6H'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6H' + '#@@#' + app.read('calcForm#pA6H'); }
	if(app.read('calcForm#pA6M'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6M' + '#@@#' + app.read('calcForm#pA6M'); }
	if(app.read('calcForm#pA6N'))	{ keyList = keyList + '#@@@#' + 'calcForm#pA6N' + '#@@#' + app.read('calcForm#pA6N'); }
	//start
	keyList = keyList + '#@@@#' + 'appStatus' + '#@@#'         + app.read('appStatus');
	keyList = keyList + '#@@@#' + 'config_start_time' + '#@@#' + app.read('config_start_time');
	//dom reset
	if(app.read('appStatus','stopped')) {
		app.resetCounter();
	}
	//return
	if(keyList != '') { keyList = '/*' + keyList + '*/'; }
	return keyList;
}
///////////////////////////
// REBUILD LOCAL STORAGE //
///////////////////////////
function rebuildLocalStorage(lsp) {
	'use strict';
	if(!lsp.match('#@@@#')) { return; }
	//comments
	lsp = lsp.split('/*').join('').split('*/').join('');
	lsp = lsp.split('#@@@#');
	var lsPart;
	var ignoreWater = false;
	for(var i=0; i<lsp.length; i++) {
		lsPart = lsp[i].split('#@@#');
		if(lsPart[0]) {
			if(lsPart[0] === 'appNotes') {
				app.save(lsPart[0],lsPart[1].split('#@#').join('\n'));
			//WATER
			} else if(lsPart[0] === 'waterLastDay') {
				if(lsPart[1] !== app.today()) {
					ignoreWater = true;
				} else {
					app.save(lsPart[0],lsPart[1]);	
				}
			//ADD?IGNORE
			} else if(lsPart[0] === 'waterConsumed') {
				if(ignoreWater !== true) {
					app.save(lsPart[0],lsPart[1]);
				}
			//ALL
			} else {
				app.save(lsPart[0],lsPart[1]);
			}
		}
	}
	//UPDATE UNDERLYING
	$('#timerDailyInput').val(app.get.kcals());
}
///////////////////
// FETCH ENTRIES //
///////////////////
function fetchEntries(callback) {
	'use strict';
	callback(appRows.entry.sortbyattr('published','desc'));
}
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries() {
	'use strict';
app.timeout('pushEntries', 4000, function() {
	if(!app.read('facebook_logged'))	{ return; }
	if($('body').hasClass('insync'))	{ return; }	
	if(app.read('pendingSync'))			{ return; }
	if($('body').hasClass('setpush'))	{ $('body').removeClass('setpush'); return; }
	//////////
	// LOCK //
	//////////	
	$('body').addClass('setpush');	
	////////////
	// USERID //
	////////////
	var userId = app.read('facebook_userid');
	fetchEntries(function(data) {
		if(!data) { return; }
		///////////
		// TIMER //
		///////////
		if(app.beenDev) {
			app.timer.start('push');
		}
		//VARTS
		var fetchEntries = '';
		var newLineFetch = '';
		//var allFetchIds  = [];
		var id;
		var title;
		var body;
		var published;
		var info;
		var kcal;
		var pro;
		var car;
		var fat;
		var fib;
		var fii;
		var sug;
		var sod;
		///////////////////
		// BUILD SQL ROW //
		///////////////////
		for(var i=0, len=data.length; i<len; i++) {
			if(!isNaN(data[i].id)) {
				id        = data[i].id;
				title     = data[i].title;
				body      = sanitizeSql(data[i].body);
				published = parseInt(data[i].published);
				info      = data[i].info;
				kcal      = data[i].kcal;
				pro       = data[i].pro;
				car       = data[i].car;
				fat       = data[i].fat;
				fib       = data[i].fib;
				fii       = data[i].fii;
				sug       = data[i].sug;
				sod       = data[i].sod;

				if(!body) { body = ''; }
				if(!kcal) { kcal = ''; }
				if(!info) { info = ''; }
				if(!kcal) { kcal = ''; }
				if(!pro)  { pro  = ''; }
				if(!car)  { car  = ''; }
				if(!fat)  { fat  = ''; }
				if(!fib)  { fib  = ''; }
				if(!fii)  { fii  = ''; }
				if(!sug)  { sug  = ''; }
				if(!sod)  { sod  = ''; }
				//INSERT
				if(id != '' && published != '') {
					/*jshint ignore:start*/
					newLineFetch = "\"diary_entry\" VALUES(" + id + ",'" + title + "','" + body + "','" + published + "','" + info + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "','" + fii + "','" + sug + "','" + sod + "');\n";
					/*jshint ignore:end*/
					fetchEntries += newLineFetch;
				}
				////////////////
				// reset loop //
				////////////////
				newLineFetch = '';
				id        = '';
				title     = '';
				body      = '';
				published = '';
				info      = '';
				kcal      = '';
				pro       = '';
				car       = '';
				fat       = '';
				fib       = '';
				fii       = '';
				sug       = '';
				sod       = '';
			}
		}
		//////////////////////
		// ADD CUSTOM ITEMS //
		//////////////////////
		if(app.read('customItemsSql')) {
			fetchEntries = fetchEntries + trim(app.read('customItemsSql'));
			//padding
			if(app.read('customFavSql')) {
				fetchEntries = fetchEntries + '\n';
			}
		}
		///////////////////
		// ADD FAVORITES //
		///////////////////
		if(app.read('customFavSql')) {
			fetchEntries = fetchEntries + trim(app.read('customFavSql'));
		}
		//////////////////
		// ADD SETTINGS //
		//////////////////
		var storageSqlData = localStorageSql();
		if(storageSqlData) {
			fetchEntries = fetchEntries + '\n' + trim(storageSqlData);
		}
		//////////////////
		// BASIC FILTER //
		//////////////////
		fetchEntries = trim(fetchEntries.split('undefined').join('').split('NaN').join(''));
		if(fetchEntries.length == 0) { fetchEntries = ' '; }
		/////////////////////////////////////
		// AUTO RETRY IN 30s, not every 5s //
		/////////////////////////////////////
		//if(app.read('lastEntryPush')) {
		//	app.save('lastEntryPush',app.now() + (30000));
		//}
		////////////////
		// CHECK DIFF //
		////////////////
		var md4Fetch = md4(fetchEntries);
		if(md4Fetch == app.read('last_push_data')) {
			//fake success ~ disable spinner
			$('body').removeClass('setpush');
			$('body').removeClass('insync');
			//app.remove('lastEntryPush');
			// END TIMER //
			if(app.beenDev) { app.timer.end('push','not pushing'); }
			return;
		} else {
			// END TIMER //
			if(app.beenDev) { app.timer.end('push','pushing'); }				
			/////////////////
			// UPLOAD DATA //
			/////////////////		
			$.ajax({type: 'POST', dataType: 'text', url: app.https + 'dietclock.app/sync.php', data: { 'sql':fetchEntries,'uid':userId },  
				/////////////////////
				// ERROR ~ OFFLINE //
				/////////////////////
				error: function(xhr, statusText) { 
					$('body').removeClass('setpush');
					//app.save('lastEntryPush',app.now() + (30000));
					app.remove('lastEntryPush');
					if(app.beenDev) { app.toast('push error'); }
				//////////////////
				// SUCCESS PUSH //
				//////////////////
				}, success: function(data) {				
					//clear marker
					app.remove('lastEntryPush');
					$('body').removeClass('setpush');
					$('body').removeClass('insync');
					//save data
					app.save('last_push_data',md4Fetch);
					if(app.beenDev) { app.toast('push ended'); }
				}
			});
		}
	});
//
});
}
function setPush(msg) {
	'use strict';
	//force load db
	if(app.read('facebook_logged')) {
		updateFoodDb();
	}
	//next push time
	app.timeout('setPushPrimary', 1000, function() {
		app.save('lastEntryPush', app.now());
	});
}
//#///////////////////#//
//# AUX: SYNC ENTRIES #//
//#///////////////////#//
function setComplete() {
	'use strict';
	//clear previous
	$('body').removeClass('insync');
	//set complete
	app.remove('pendingSync');
	if(!app.read('foodDbLoaded','done')) {
		updateFoodDb();
	}
	//////////////////////
	// DEFER DOM update //
	//////////////////////
	//updateEntriesSum();
	//updateNutriRatio();
	setTimeout(function() {
		app.updateColorPicker();
		appFooter(app.read('app_last_tab'), 1); //keepopen
	}, 200);
	//dump custom data to sql
	setTimeout(function() {
		if(app.read('foodDbLoaded','done')) {
			updateCustomList('fav');
			updateCustomList('items');
			//catlist first-load
			if($('body').hasClass('closer')) {
				getCatList();
			}
			setPush();
		}
	}, 100);
	//update last sync date
	app.save('lastSync',app.now());
	$('#optionLastSync span').html2( dateDiff( app.read('lastSync'), app.now()) );
	////////////////////
	// SHOW SYNC TIME //
	////////////////////
	if(app.beenDev) {
		if(app.globals.noSyncDiff == 1) {
			//do nothing
		} else {
			app.timer.end('sync','sync');
		}
		app.globals.noSyncDiff = 0;
	}
}
///////////////
// ROWS LOOP //
///////////////
function rowsLoop(sqlEntry, hive, callback) {
	'use strict';
	var rows;
	if (hive === 'diary_entry') {
		rows = appRows.entry;
	} else {
		rows = appRows.food;
		hive = 'diary_food';
	}
	//////////////////
	// INDEXED ROWS //
	//////////////////
	var indexedRows = {};
	(function() {
		for (var i = 0, len = rows.length; i < len; i++) {
			var rowId = (hive === 'diary_entry') ? rows[i].id : rows[i].code;
			indexedRows[rowId] = { index: i, row: rows[i] };
		}
	}());
	/////////////////////
	// UPDATE ROW LOOP //
	/////////////////////
	var sqlEntryCache;
	for (var i = 0, len = sqlEntry.length; i < len; i++) {
		sqlEntryCache = sqlEntry[i];
		if (sqlEntryCache) {
			var lookFor    = (hive === 'diary_entry') ? sqlEntryCache.id : sqlEntryCache.code;
			var indexedRow = indexedRows[lookFor];
			//////////////////////
			// INSERT OR UPDATE //
			//////////////////////
			if(typeof indexedRow !== 'undefined') {
				// UPDATE ON DIFF //
				if(rows[indexedRow.index] !== sqlEntryCache) {
					rows[indexedRow.index] = sqlEntryCache;
				}
			} else {
				// INSERT NEW //
				rows.push(sqlEntryCache);	
			}
		}
	}
	//UPDATE CACHE
	if (hive === 'diary_entry') {
		appRows.entry = rows;
	} else {
		appRows.food  = rows;
	}
	////////////////////
	// WRITE CALLBACK //
	////////////////////
	setTimeout(function() {
		app.save(hive, rows, function (rows) {
			callback();
		});
	}, 0);
}
/////////////////
// SQL TO JSON //
/////////////////
function sqlToJson(row) {
	'use strict';
	if (!row)			{ return ''; }
	if (row.length < 5) { return ''; }
	/*jshint ignore:start*/
	row = row.replace(",'", "','").split("');").join("").split('INSERT OR REPLACE INTO "').join('').split('" VALUES(').join("','").split("','");
	/*jshint ignore:end*/
	///////////
	// ENTRY //
	///////////
	if (row[0].indexOf('_entry') !== -1) {
		return {
			id        : row[1],
			title     : row[2],
			body      : row[3],
			published : row[4],
			info      : row[5],
			kcal      : row[6],
			pro       : row[7],
			car       : row[8],
			fat       : row[9],
			fib       : row[10],
			fii       : row[11],
			sug       : row[12],
			sod       : row[13],
		};
	}
	//////////
	// FOOD //
	//////////
	if (row[0].indexOf('_food') !== -1) {
		return {
			id   : row[1],
			type : row[2],
			code : row[3],
			name : row[4],
			term : searchalize(row[5]),
			kcal : row[6],
			pro  : row[7],
			car  : row[8],
			fat  : row[9],
			fib  : row[10],
			fii  : row[11],
			sug  : row[12],
			sod  : row[13],
		};
	}
	return '';
}

//////////////////////
// INSERT OR UPDATE //
//////////////////////
function insertOrUpdate(rows, callback) {
	'use strict';
	if (!rows || rows == '') {
		if(typeof callback === 'function') {
			callback();
		}
		return;
	}
	/////////////////////
	// POPULATE ARRAYS //
	/////////////////////
	if (rows.match('\n')) {
		rows = rows.split('\n');
	} else {
		var ctts = rows;
		rows = [];
		rows.push(ctts);
	}
	///////////////
	// LOOP VARS //
	///////////////
	var sqlEntry = [];
	var sqlFood  = [];
	var rowsI;
	var rowsJson;
	var rowsLength = rows.length;
	for (var i = 0; i < rowsLength; i++) {
		rowsI    = rows[i];
		rowsJson = sqlToJson(rowsI);
		///////////////
		// PUSH LOOP //
		///////////////
		if(rowsJson != '') {
			if (rowsI.length) {
			   if(rowsI.indexOf('_entry') !== -1) { 
			   		sqlEntry.push(rowsJson); 
				} else {
					sqlFood.push(rowsJson); 
				}
			}
		}
	}
	//////////////////
	// ENTRIES LOOP //
	//////////////////
	rowsLoop(sqlEntry, 'diary_entry', function () {
		rowsLoop(sqlFood, 'diary_food', function () {
			if(typeof callback === 'function') {
				callback();
			}
		});
	});
}
//##//////////////##//
//## SYNC ENTRIES ##//
//##//////////////##//
function syncEntries() {
	'use strict';
	app.timeout('syncEntries', 2000, function () {
		if (app.read('facebook_logged'))	{ updateFoodDb(); }
		if (!app.read('facebook_logged'))	{ return; }
		if (!app.read('facebook_userid'))	{ return; }
		if ($('body').hasClass('insync'))	{ return; }
		if ($('body').hasClass('setpush'))	{ return; }
		////////////////
		// SET USERID //
		////////////////
		var userId = app.read('facebook_userid');
		/////////////////////
		// OK, UPDATE TIME //
		/////////////////////
		app.save('pendingSync', app.now());
		app.globals.syncRunning = false;
		if (!app.globals.syncRunning) {
			app.globals.syncRunning = true;
			$('body').addClass('insync');
			//get remote sql
			$.ajax({
				type : 'GET',
				dataType : 'text',
				url : app.https + 'dietclock.app/sync.php?uid=' + userId,
				error : function (xhr, statusText) {
					$('body').removeClass('insync');
				},
				success : function (sql) {
					if (app.beenDev) {
						app.timer.start('sync');
					}
					//////////////////
					// prepare data //
					//////////////////
					if (sql) {
						sql = sql.split('undefined').join('');
					}
					//local storage slice
					if (sql.match('#@@@#')) {
						rebuildLocalStorage(sql.split('\n').pop());
						sql = sql.split('\n\r\n\r').join('\n\r').split('\n\r\n\r').join('\n\r');
					}
					///////////////////////
					// FAKE VALID RESULT // empty but valid result ~ trigger success
					/////////////////////// return for no diff
					var md4Sql = md4(sql);
					if (!sql || sql.trim() == '' || (md4Sql == app.read('last_sync_data'))) {
						app.globals.syncRunning = false;
						app.remove('pendingSync');
						//NO DIFF
						if (app.beenDev) {
							app.globals.noSyncDiff = 1;
							app.timer.end('sync', 'no diff');
						}
						setComplete();
					} else {
						//SAVE CACHE DIFF
						app.save('last_sync_data', md4Sql);
						//////////////////////
						// FULLY PARSE DATA //
						//////////////////////
						setTimeout(function () {
							insertOrUpdate(sql, function () {
								app.globals.syncRunning = false;
								setComplete();
							});
						}, 0);
					}
				}
			});
		}
		//
	});
}
/////////////////
// GET ENTRIES //
/////////////////
function getEntries(callback) {
	'use strict';
	var newArray    = [];
	var rowsArray   = appRows.entry;
	var arrayLength = rowsArray.length;
	for (var i = 0; i < arrayLength; i++) {
		if (rowsArray[i].info !== 'deleted') {
			newArray.push(rowsArray[i]);
		}
	}
	if (typeof callback === 'function') {
		callback(newArray);
	}
	/*
	var rowsArray = appRows.entry;
	var newArray = [];
	if (rowsArray) {
		if (rowsArray.length) {
			newArray = rowsArray.filter(function (row) {
					if (row.info !== 'deleted') {
						return row;
					}
				});
		}
	}
	if (typeof callback === 'function') {
		callback(newArray);
	}
	*/
}
///////////////
// GET ENTRY //
///////////////
function getEntry(eid,callback) {
	'use strict';
	for(var i=0, len=appRows.entry.length; i<len; i++) {
		if(appRows.entry[i].id == eid) {
			callback(appRows.entry[i]);
			break;
		}
	}
}
//#//////////////////#//
//# DB: UPDATE ENTRY #//
//#//////////////////#//
function updateEntry(data,callback) {
	'use strict';
	var endDate = (data.published.toString()).slice((data.published.toString()).length-4,(data.published.toString()).length);
	var endId   = (data.id.toString()).slice((data.id.toString()).length-4,(data.id.toString()).length);
	if(endDate == '0000') {
		data.published = data.published.split(endDate).join(endId);
	}
	for(var i=0, len=appRows.entry.length; i<len; i++) {
		if(appRows.entry[i].id == data.id) {
			appRows.entry[i].id        = data.id;
			appRows.entry[i].title     = parseInt(data.title);
			appRows.entry[i].body      = data.body;
			appRows.entry[i].published = parseInt(data.published);
			appRows.entry[i].info      = data.info ? data.info : '';
			appRows.entry[i].kcal      = '';
			appRows.entry[i].pro       = data.pro;
			appRows.entry[i].car       = data.car;
			appRows.entry[i].fat       = data.fat;
			appRows.entry[i].fib       = '';
			appRows.entry[i].fii       = data.fii;
			appRows.entry[i].sug       = data.sug;
			appRows.entry[i].sod       = data.sod;
			break;
		}
	}
	//return id/date pair
	callback(data.id,data.published);
	app.save('diary_entry',appRows.entry,function(rows) {
		setPush();
	});
}
//#//////////////////#//
//# DB: DELETE ENTRY #//
//#//////////////////#//
function deleteEntry(entry,callback) {
	'use strict';
	for(var i=0, len=appRows.entry.length; i<len; i++) {
		if(appRows.entry[i].id == entry.id) {
			appRows.entry[i].info = 'deleted';
			break;
		}
	}
	app.save('diary_entry',appRows.entry,function(rows) {
		//appRows.entry = rows;
		setPush();
		if(typeof callback === 'function') {
			callback();
		}
	});
}
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data,callback) {
	'use strict';
	////////////////
	// RAW INSERT //
	////////////////
	if(data.raw == true) {
		//SAVE
		appRows.entry.push(data);
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			if(typeof callback === 'function') {
				callback();
			}
		});
	/////////////////
	// REUSE ENTRY //
	/////////////////
	} else if(data.reuse == true) {
		//SAVE
		var saveTime = app.now();
		if(Number($('#entryTime').val()) < 0) {
			//past
			saveTime = saveTime + (Number($('#entryTime').val()) * (60 * 60 * 1000) );
		} else if(Number($('#entryTime').val()) > 0) {
			//schedule
			saveTime = saveTime + (Number($('#entryTime').val()) * (60 * 60 * 1000) );
		}
		appRows.entry.push({id: saveTime, title: data.title, body: data.body, published: saveTime, info: '', kcal: data.kcal, pro: data.pro, car: data.car, fat: data.fat, fib: data.fib, fii: data.fii, sug: data.sug, sod: data.sod});
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			getRateDialog();
			if(typeof callback === 'function') {
				callback(saveTime);
			}
		});
	/////////////////
	// UPDATE BODY //
	/////////////////
	} else if(data.id && !data.title) {
		for(var i=0, len=appRows.entry.length; i<len; i++) {
			if(appRows.entry[i].id == data.id) {
				appRows.entry[i].body = data.body;
				break;
			}
		}
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			if(typeof callback === 'function') {
				callback();
			}
		});
	} else if(data.id && data.title) {
	//////////////////
	// UPDATE TITLE //
	//////////////////
		for(var t=0, ten=appRows.entry.length; t<ten; t++) {
			if(appRows.entry[t].id == data.id) {
				appRows.entry[t].title = data.title;
				break;
			}
		}
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			if(typeof callback === 'function') {
				callback();
			}
		});
	} else if(data.pro || data.car || data.fat || data.fii || data.sug || data.sod) {
	/////////////////
	// INSERT FULL //
	/////////////////
		appRows.entry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: data.info, kcal: '', pro: data.pro, car: data.car, fat: data.fat, fib: '', fii: data.fii, sug: data.sug, sod: data.sod});
		//SAVE
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			app.analytics('add');
			getRateDialog();
			if(typeof callback === 'function') {
				callback();
			}
		});
	} else {
	//////////////////
	// INSERT QUICK //
	//////////////////
		appRows.entry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: data.info, kcal: '', pro: '', car: '', fat: '', fib: '', fii: '', sug: '', sod: ''});
		//SAVE
		app.save('diary_entry',appRows.entry,function(rows) {
			appRows.entry = rows;
			setPush();
			app.analytics('add');
			getRateDialog();
			if(typeof callback === 'function') {
				callback();
			}
		});
	}
}
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	'use strict';
	if(data.act == 'update') {
		//UPDATE
		for(var i=0, len=appRows.food.length; i<len; i++) {
			if(appRows.food[i].id == data.id) {
				appRows.food[i].id   = data.id;
				appRows.food[i].type = data.type;
				appRows.food[i].code = data.code;
				appRows.food[i].name = data.name;
				appRows.food[i].term = data.term;
				appRows.food[i].kcal = data.kcal;
				appRows.food[i].pro  = data.pro;
				appRows.food[i].car  = data.car;
				appRows.food[i].fat  = data.fat;
				appRows.food[i].fib  = data.fib;
				appRows.food[i].fii  = data.fii;
				appRows.food[i].sug  = data.sug;
				appRows.food[i].sod  = data.sod;
				break;
			}
		}
		callback();
		app.save('diary_food',appRows.food,function(rows) {
			appRows.food = rows;
			setPush();
		});
	} else {
	//INSERT
		appRows.food.push({
			id:   data.id,
			type: data.type,
			code: data.code,
			name: data.name,
			term: sanitize(data.name),
			kcal: data.kcal,
			pro:  data.pro,
			car:  data.car,
			fat:  data.fat,
			fib:  data.fib,
			fii:  data.fii,
			sug:  data.sug,
			sod:  data.sod,
		});
		callback();
		app.save('diary_food',appRows.food,function(rows) {
			appRows.food = rows;
			setPush();
		});
	}
}
//////////////
// GET FOOD //
//////////////
function getFood(foodId,callback) {
	'use strict';
	//SEARCH ONLINE RESULTS
	if(app.read('online_results')) {
		var onlineRows = app.read('online_results','','object');
		for(var o=0, lon=onlineRows.length; o<lon; o++) {
			if(onlineRows[o].id == foodId) {
				callback(onlineRows[o]);
				return;
			}
		}
	}
	//SEARCH REGULAR RESULTS
	for(var i=0, len=appRows.food.length; i<len; i++) {
		if(appRows.food[i].id == foodId) {
			callback(appRows.food[i]);
			break;
		}
	}
}
/////////////////
// DELETE FOOD //
/////////////////
function delFood(foodId, callback) {
	'use strict';
	var rowsArray = [];
	for(var i=0, len=appRows.food.length; i<len; i++) {
		if(appRows.food[i]) {
			if(!foodId.contains(appRows.food[i].id)) {
				rowsArray.push(appRows.food[i]);
			}
		}
	}
	appRows.food = rowsArray;
	if(callback) {
		callback();
	}
	app.save('diary_food',rowsArray,function(rows) {
		appRows.food = rows;
		setPush();
	});
}
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function getCustomList(listType,filter) {
	'use strict';
	var rowsArray,i,len;
	//////////////
	// CAT LIST //
	//////////////
	if(!isNaN(listType)) {
		var orType = '';
		if(listType == '9999') { orType = 'food';     }
		if(listType == '0000') { orType = 'exercise'; }
		rowsArray = [];
		i = appRows.food.length;
		while(i--) {
			if(appRows.food[i]) {
				if(appRows.food[i].type === listType || appRows.food[i].type === orType) {
					rowsArray.push(appRows.food[i]);
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'));
	//////////////
	// FAV LIST //
	//////////////
	} else if(listType == 'fav') {
		rowsArray = [];
		for(i=0, len=appRows.food.length; i<len; i++) {
			if(appRows.food[i]) {
				if(appRows.food[i].fib) {
					if(appRows.food[i].fib === 'fav') {
						rowsArray.push(appRows.food[i]);
					}
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'),filter);
	////////////////////////
	// FOOD~EXERCISE LIST //
	////////////////////////
	} else {
		rowsArray = [];
		for(i=0, len=appRows.food.length; i<len; i++) {
			if(appRows.food[i]) {
				if(appRows.food[i].id) {
					if((JSON.stringify(appRows.food[i].id)).length >= 13) {
						rowsArray.push(appRows.food[i]);
					}
				}
			}
		}
		return app.handlers.buildRows(rowsArray.sortbyattr('term','desc'),filter);
	}
}
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	'use strict';
	for(var i=0, len=appRows.food.length; i<len; i++) {
		if(appRows.food[i].id == data.id) {
			appRows.food[i].fib = data.fib;
			break;
		}
	}
	callback();
	app.save('diary_food',appRows.food,function(rows) {
		appRows.food = rows;
		setPush();
	});
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	'use strict';
	noTimer = 'active';
	opaLock = 2;
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		$('*').css2('pointer-events','none');
		blockAlerts = 1;
		//////////////
		// FADE OUT //
		//////////////
		app.handlers.fade(0,'body',function() {
			if(app.read('facebook_logged') && cmd == 'clear') {
				$.post(app.https + 'dietclock.app/sync.php', { 'sql':' ','uid':app.read('facebook_userid') }, function(data) {
					setTimeout(function() {
						app.reboot(cmd);
					},200);
				}, 'text');
			} else {
				setTimeout(function() {
					app.reboot(cmd);
				},200);
			}
		});
	},100);
}
/////////////
// SPINNER //
/////////////
function spinner(action,target) {
	'use strict';

	if(!target) { target = 'spinnerMask'; }

	if(!$('#loadMask').length)		{ $('body').prepend2('<div id="loadMask"><span></span></div>'); }
	if($('#loadMask').html() == '') { $('#loadMask').html2('<span></span>'); }
	if(action == 'stop') {
		$('body').removeClass(target);
		$('#loadMask').off();
		$('body').removeClass('updtdb');
	} else {
		$('body').addClass(target);
		$('#loadMask').css2('pointer-events','auto');
		$('#loadMask').off().on(touchstart,function(evt) {
			var pos = app.pointer(evt);
			//USE :AFTER COORDS
			if(app.width() - pos.x < 120 && app.height() - pos.y < 120 && !document.getElementById('saveButton')) {
				//DIALOG
				appConfirm(LANG.CANCEL[lang].toUpperCase() + ' (' + (LANG.DATABASE_UPDATE[lang]).toLowerCase() + ')', LANG.ARE_YOU_SURE[lang].capitalize(), function(button) {
					//$('#loadMask').css2('pointer-events','none')
					if(button === 2) { 
						//KILL SPINNER
						if(app.read('startLock','running') && !app.read('foodDbLoaded','done')) {
							app.remove('startLock');
						}
						spinner('stop');
					} else {
						//do nothing
					}
				}, LANG.OK[lang], LANG.CANCEL[lang]);
			} else {
				//BLOCK TOUCHSTART
				return false;	
			}
		});
	}
}
////////////////////
// FOOD DB IMPORT //
////////////////////
function updateFoodDb(callback) {
	'use strict';
	if (app.read('foodDbLoaded', 'done') && !app.read('foodDbVersion')) { app.remove('foodDbLoaded'); }
	if (app.read('foodDbLoaded', 'done')) { return; }
	if (!app.read('foodDbLoaded', 'done') && !app.read('startLock', 'running')) {
		//LANGDB		
		var langDB = (lang == 'en' && app.read('config_measurement', 'metric')) ? 'em' : lang;
		//GLOBALS
		app.globals.foodDbRunning = false;
		//reset blocks
		$('#tabMyCatsBlock,#tabMyFavsBlock,#tabMyItemsBlock').html2('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		if (app.globals.foodDbRunning == false) {
			//start
			app.globals.foodDbRunning = true;
			app.save('startLock', 'running');
			////////////
			// IMPORT //
			////////////
			app.saveParsed = function(rowsArray, callback) {
				//REINSERT
				var postCustom = '';
				if (trim(app.read('customItemsSql')) != '') {
					postCustom += trim(app.read('customItemsSql'));
				}
				if (trim(app.read('customFavSql')) != '') {
					postCustom += trim(app.read('customFavSql'));
				}
				appRows.food = rowsArray;
				app.save('diary_food', rowsArray, function () {
					insertOrUpdate(postCustom, function () {
						//success
						app.globals.foodDbRunning = false;
						app.save('foodDbLoaded', 'done');
						app.save('foodDbVersion', 5);
						app.remove('startLock');
						niceResizer(300);
						//save delay
						app.timeout('saveFoodItem',200,function() {
							//push update
							if (app.read('facebook_userid')) {
								//setPush();
								syncEntries();
							} else {
							//update listing
							setTimeout(function () {
								updateCustomList('all');
							}, 200);
							}
						});
						//////////////
						// CALLBACK //
						//////////////
						if (typeof callback === 'function') {
							callback();
						}
						setTimeout(function () {
							spinner('stop');
							$('body').removeClass('updtdb');
						}, 500);
					});
				});
			};
			///////////////
			// UNLOCK DB //
			///////////////
			app.unlockDb = function (callback) {
				app.timeout('unlockDb', 500, function (callback) {
					//failure
					app.globals.foodDbRunning = false;
					app.remove('foodDbLoaded');
					app.remove('startLock');
					spinner('stop');
					//////////////////////////////////////////
					if (callback != 'retry') {
						//OFFLINE.APP
						if(!/http/i.test(window.location.protocol)) {
							//RETRY LOCAL
							updateFoodDb('retry');
							//
							app.timeout('retryDB',200,function() {
								//IMPORT LOCAL
								setTimeout(function() {
									alert('Error downloading database', 'Importing local database instead.');
								},100);
							});
						} else {
							//OFFLINE.WEB ~ SKIP
							if(typeof pageReloads !== 'undefined') {
								pageReloads = 100;
							}							
							app.timeout('giveUpDB',200,function() {						
								setTimeout(function() {
									alert('Error downloading database', 'Please connect to the internet and try again.');
									if(typeof pageReloads !== 'undefined') {
										pageReloads = 0;
									}				
								},100);
							});
						}
					}
					//////////////////////////////////////////
				});
			};
			app.doImport = function (callback) {
				spinner();
				var databaseHost = app.read('config_autoupdate', 'on') ? app.https + 'dietclock.app/' : hostLocal;
				if (callback == 'retry') {
					databaseHost = '';
				}
				app.timeout('foodDbTimer', 100, function (callback) {
					try {
						$.ajax({
							type : 'GET',
							dataType : 'text',
							url : databaseHost + 'sql/searchdb_' + langDB + '.txt',
							error : function (xhr, statusText) {
								//CONNECTION ERROR
								app.unlockDb(callback);
							},
							success : function (ls) {
								if (ls.length < 15000) {
									app.unlockDb(callback);
									return false;
								}
								var rowsArray = [];
								//////////////////
								// PARSE NEW DB //
								//////////////////
								ls = ls.split('।').join('');
								ls = ls.split('。').join('');
								ls = ls.split('"').join('”');
								ls = ls.split('\'').join('’');
								ls = ls.split('、').join(',');
								ls = ls.split(',,').join(',');
								ls = ls.split('  ').join(' ');
								ls = ls.split(' %').join('%');
								ls = ls.split(' / ').join('/');
								ls = ls.split('\r').join('');
								ls = ls.split('\n');
								$.ajax({
									type : 'GET',
									dataType : 'text',
									url : databaseHost + 'sql/searchdb.txt',
									error : function (xhr, statusText) {
										app.unlockDb(callback);
									},
									success : function (sdb) {
										//////////////////
										// SAVE DB DATA //
										//////////////////
										rowsArray = JSON.parse(sdb);
										for (var s = 0, slen = rowsArray.length; s < slen; s++) {
											try {
												rowsArray[s].name = trim(trimDot(ls[s])).capitalize();
												rowsArray[s].term = searchalize(rowsArray[s].name);
											} catch (err) { }
										}
										app.saveParsed(rowsArray, callback);
									}
								});
							}
						});
					} catch (err) {
						//failure
						errorHandler('db parse catch: ' + err);
						app.unlockDb(callback);
					}
				});
			};
		}
		//////////////////////
		// CALLBACK TRIGGER //
		//////////////////////
		if(/en|em/.test(langDB)) {
			app.doImport(callback);
		} else {
			appConfirm(LANG.TRANSLATE_DATABASE[lang], LANG.ORIGINAL_DATABASE_ENGLISH[lang], function(trad) {
				langDB = trad == 2 ? lang : 'em';
				app.doImport(callback);
			}, LANG.LANGUAGE_NAME[lang], LANG.LANGUAGE_NAME['en']);
		}
	}
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	'use strict';
	var page;
	var arr = [];
	var entryPos;
	//
	if(published) {
		//push 'published' into array
		arr.push(published);
		//build array from time on 'name'
		$('#entryList').children().each(function() {
			//use attr, not prop
			if($(this).attr('name')) {
				arr.push($(this).attr('name'));
			}
		});
		//sort it
		var entryArr = arr.sort().reverse();
		//find new row position in current list
		for(var i=0, len=entryArr.length; i<len; i++) {
			if(entryArr[i] == published) {
				entryPos = i;
			}
		}
		// INSERT PARTIAL
		//overwrite 'no entries'
			if(i == 1) {
				$('#entryList').html2(content,function() {
					app.highlight('#entryList div',1000,'#ffffcc');
				});
			//match div before
			} else if($('#entryList>div:eq(' + entryPos + ')').html()) {
				$('#entryList>div:eq(' + entryPos + ')').before2(content,function() {
					app.highlight('#entryList>div:eq(' + entryPos + ')',1000,'#ffffcc');
				});
			} else {
				//append if none
				$('#entryList').append2(content,function() {
					app.highlight('#' + published,1000,'#ffffcc');
				});
			}

		//target [div#partial] ~time's parent div id as target
		page = $('#entryList div' + '#' + $('#t' + published).parent('div').prop('id'));
	// FULL DIV REPLACE //
	} else {
		//check existence
		$(target).html2(content);
		page = $('#entryList');
	}
	/////////////////////
	// RELOAD HANDLERS //
	/////////////////////
	if(page[0]) {
		$(page).trigger('pageload');
	}
	return;
}
///////////////
// FILL DATE //
///////////////
function fillDate(timestamp,element) {
	'use strict';
	//time [ datetime-local / 2013-01-01T00:00 ]
	var d = (timestamp != '') ? new Date(Number(timestamp)) : new Date();
	//fill
	$('#' + element).val(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + (d.getDate())).slice(-2) + 'T' + ('0' + (d.getHours() + 0)).slice(-2) + ':' + ('0' + (d.getMinutes() + 0)).slice(-2));
	return;
}
//////////////////////
// UPDATE ENTRYLIST //
//////////////////////
var partial = '';
app.exec.updateEntries = function(partial,range,callback,keepOpen) {
	'use strict';
	//////////////
	// GET LOOP //
	//////////////
	getEntries(function(data) {
		var s = '';
		var p = '';
		var rowClass;
		var lastRow = '';
		var lastId  = '';
		var lastPub = 0;
		var totalArray = [];
		var langFood = LANG.FOOD[lang];
		var langExer = LANG.EXERCISE[lang];
		var langDel  = LANG.DELETE[lang];
		var langKcal = LANG.KCAL[lang];
		//
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = parseInt(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = parseInt(data[i].published);
			// 0 : 1
			if(data[i].body == '') {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
				} else {
					dataBody = '';
				}
			}
			// row colors
			var rowDate = new Date(dataPublished);
			var rowHour = rowDate.getHours();
                 if(rowHour <  6) { rowClass = 'rowAfterhours'; }
			else if(rowHour < 12) { rowClass = 'rowMorning';    }
			else if(rowHour < 18) { rowClass = 'rowAfternoon';  }
			//else if(rowHour < 24) { rowClass = 'rowNight';    }
			else				  { rowClass = 'rowNight';      }
			//
			if(dataTitle < 0)	{ rowClass = 'e-' + rowClass; }
			// EXPIRED
			if(app.read('config_start_time') > dataPublished || !app.read('appStatus','running')) { rowClass = rowClass + ' expired'; }
			// CORE OUTPUT
			var dataHandler = '\
			<div data-id="' + data[i].id + '" id="' + data[i].id + '" class="entryListRow ' + rowClass + ' day' + dayFormat(dataPublished).split('/').join('x') + '" name="' + dataPublished + '">\
				<p class="entriesTitle">' + dataTitle + '</p>\
				<p class="entriesKcals">' + langKcal + '</p>\
				<p class="entriesBody">' + dataBody + '</p>\
				<p id="t' + dataPublished + '" class="entriesPublished">' + dateDiff(dataPublished,app.now()) + '</p>\
				<span class="delete"><span id="reuse"></span><span id="edit"></span><span id="delete"></span></span>\
			</div>';
			///////////////////
			// ROW PRELOADER //
			///////////////////
			//totalEntries++;
			//if((app.now() - dataPublished) < 60*60*24*5*1000) {
			//	totalRecentEntries++;
			//}
			//BUILD ARRAY WITH DATES FOR SORTING
			//if(((app.now() - dataPublished) < 60*60*24*5*1000) || totalEntries < 50 || totalRecentEntried < 20 || range == 'full') {
			totalArray.push({dati:dataPublished, dato: dataHandler});
			//}
			lastPub = parseInt(data[i].published);
			//partial == last row time
			if(partial == lastPub) {
				lastRow = dataHandler;
				lastId  = data[i].id;
			}
		}
		///////////////////
		// ORDER BY DATE //
		///////////////////
		totalArray = totalArray.sortbyattr('dati','desc');
		//BUILD OUTPUT
		for(var t=0, ten=totalArray.length; t<ten; t++) {
			//LIMIT FIRST OUTPUT TO 100 ROWS
			if(t < 100 || range == 'full') {
				s += totalArray[t].dato;
			}
		}
		//////////////
		// CALLBACK //
		//////////////
		if(callback) {
			if(s != '') {
				app.tab.diary(s,keepOpen);
			} else {
				app.tab.diary('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>',keepOpen);
			}
		} else {
		////////////////////
		// RETURN CONTENT //
		////////////////////
		if(s != '') {
			if(partial) {
				//IF PARTIAL + nonRepeat
				if($('#' + lastId).html()) {
					$('#' + lastId).remove();
				}
				if(!$('#' + lastId).html()) {
					pageLoad('#entryList',lastRow,partial);
				} else { return false; }
			} else {
				//FULL
				pageLoad('#entryList',s);
				if(range == 'full') { niceResizer(200); }
			}
		///////////
		// EMPTY //
		///////////
		} else {
			//PRE-FILL
			$('#entryList').html2('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
		}}
	});
	updateEntriesTime();
};
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	'use strict';
	getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = parseInt(data[i].published);
			$('#t' + dataPublished).html2(dateDiff(dataPublished,app.now()));
			if(dataPublished > app.now()){
				$('#t' + dataPublished).addClass('scheduled');
			} else {
				$('#t' + dataPublished).removeClass('scheduled');
			}
			//planned
			if(data[i].info === 'planned'){
				$('#t' + dataPublished).html2(LANG.PLANNED[lang]);
				$('#t' + dataPublished).addClass('planned');
			} else {
				$('#t' + dataPublished).removeClass('planned');
			}
		}
	});
	//SIDEBAR TIME CLASS
	var currentHour = new Date().getHours();
	var rowClass;
         if(currentHour <  6) { rowClass = 'afterhours'; }
	else if(currentHour < 12) { rowClass = 'morning';    }
	else if(currentHour < 18) { rowClass = 'afternoon';  }
	//else if(currentHour < 24) { rowClass = 'night';    }
	else 					  { rowClass = 'night';      }	
	$('body').removeClass(('morning afternoon night afterhours').replace(rowClass));
	$('body').addClass(rowClass);
}
//////////////////////////////
// UPDATE CSS HEADING *SUM* //
//////////////////////////////
function updateEntriesSum() {
	'use strict';
	var pushTitle = [];
	var lToday    = LANG.TODAY[lang];
	var lFood     = LANG.FOOD[lang];
	var lExe      = LANG.EXERCISE[lang];
	var lPlanned  = LANG.PLANNED[lang];
	getEntries(function(data) {
		for(var m=0, men=data.length; m<men; m++) {
			pushTitle.push({ date: dayFormat(parseInt(data[m].published)).split('/').join('x'),val: data[m].title});
		}
		//
		var eachDay  = [];
		for(var p=0, pen=pushTitle.length; p<pen; p++) {
			if(eachDay.indexOf(pushTitle[p].date) == -1) {
				eachDay.push(pushTitle[p].date);
			}
		}
		//
		var totalDayF;
		var totalDayE;
		var reStyle = '';
		var thisDay;
		//
		for(var d=0, den=eachDay.length; d<den; d++) {
			totalDayF = 0;
			totalDayE = 0;
			for(var x=0, xen=pushTitle.length; x<xen; x++) {
				if(eachDay[d] == pushTitle[x].date) {
					if(pushTitle[x].val > 0)  {
						totalDayF = totalDayF + parseInt(pushTitle[x].val);
					} else {
						totalDayE = totalDayE + parseInt(pushTitle[x].val);
					}
				}
			}
			//set dates row sum
			var SumDateTime = Date.parse(eachDay[d].split('x').join('/'));
			var plannedDate = app.now()+(4000*24*60*60*1000);
			if(SumDateTime > plannedDate) {
				//planned
				thisDay = lPlanned;				
			} else if(eachDay[d] == dayFormat(app.now()).split('/').join('x')) {
				//today
				thisDay = lToday;
			} else {
				//regular days
				thisDay = eachDay[d];
			}
			/*jshint ignore:start*/
			reStyle = reStyle + '\
			#entryList div.day' + eachDay[d] + ' { border-top: 21px solid #eee; min-height: 66px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ' { margin-top: 0px; min-height: 45px; border-top: 0px solid #eee; }\
			#entryList div.day' + eachDay[d] + ':before { content: "' + lFood + ': ' + totalDayF + '  /  ' + lExe + ': ' + totalDayE + ' / net: ' + (totalDayF + totalDayE) + '"; color: #777; position: absolute; top: -22px; right: 0px; left: -3px; font-size: 12px; line-height: 16px; background-color: #eee; width: 100%; text-align: right; padding-top: 4px; padding-bottom: 2px; padding-right: 6px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':before { content: ""; padding-top: 0; padding-bottom: 0; }\
			#entryList div.day' + eachDay[d] + ':after { content: "' + thisDay.split("x").join("/") +'"; color: #999; position: absolute; top: -18px; left: 15px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':after { content: "";  }\
			';
			/*jshint ignore:end*/
		}
		//OUTPUT
		$('#daySum').html2(reStyle);
	});
}
//#////////////////////////////#//
//# UPDATE NUTRI RATIO PSEUDOS #//
//#////////////////////////////#//
function updateNutriRatio() {
	'use strict';
	app.define('dailyWaterIntake',2000);
	//
	var appNutrients = app.read('appNutrients').split('|');
	var proRatio = parseInt(appNutrients[0]);
	var carRatio = parseInt(appNutrients[1]);
	var fatRatio = parseInt(appNutrients[2]);

	var nutrientsStyle = '\
		#appStatusBarsPro span:after	{ content: " (' + proRatio + '%)" !important; }\
		#appStatusBarsCar span:after	{ content: " (' + carRatio + '%)" !important; }\
		#appStatusBarsFat span:after	{ content: " (' + fatRatio + '%)" !important; }\
		#appStatusBarsWat span:after	{ content: " (' + app.read('dailyWaterIntake') + '' + LANG.ML[lang] + ')" !important; }\
	';
	//////////
	// EXEC //
	//////////
	//INSERT ONCE
	if(!document.getElementById('appNutrients')) {
		$('head').append2('<style id="appNutrients"></style>');
	}
	//UPDATE
	$('#appNutrients').html2(nutrientsStyle);
}
//#/////////////////#//
//# NUTRI TIME SPAN #//
//#/////////////////#//
function getNutriTimeSpan(entryTime) {
	'use strict';
	//
	app.define('app_last_tab','tab1');
	//
	var now        = app.now();
	var day        = 60 * 60 * 24 * 1000;
	var todaysTime = (new Date(dayFormat(now))).getTime();
	var last7Time  = (new Date(dayFormat(todaysTime - (7*day)))).getTime();
	var last30Time = (new Date(dayFormat(todaysTime - (30*day)))).getTime();
	/////////
	// ALL //
	/////////
	if(app.read('appNutrientTimeSpan',0)) {
		return true;
	}
	///////////
	// TODAY //
	///////////
	else if(app.read('appNutrientTimeSpan',1))  {
		if(dayFormat(entryTime) == dayFormat(now)) {
			return true;
		} else {
			return false;
		}
	}
	////////////
	// LAST 7 //
	////////////
	else if(app.read('appNutrientTimeSpan',7))  {
		if(entryTime > last7Time) {
			return true;
		} else {
			return false;
		}
	}
	/////////////
	// LAST 30 //
	/////////////
	else if(app.read('appNutrientTimeSpan',30)) {
		if(entryTime > last30Time) {
			return true;
		} else {
			return false;
		}
	}
}
//##/////////////////##//
//## BUILD HELP MENU ##//
//##/////////////////##//
var subHelperTimer;
function buildHelpMenu(args) {
	'use strict';
	//insert menu
	if(args !== 'direct') {
		$('#optionHelp').addClass('activeRow');
	}
	$('body').append2('<div id="appHelperWrapper"><div id="appHelper"></div></div>');

	$('#appHelper').hide();
	$('#appHelper').css2('top',($('#appHeader').height()) + 'px');
	$('#appHelper').height($('#appContent').height());
	$('#appHelper').css2('bottom',($('#appFooter').height()) + 'px');
	$('#appHelper').show();

	//STARTLOCK
	var startLock = 1;
	//BUILD CONTENT ARRAY
	var helpTopics = LANG.HELP_TOPICS_ARRAY['en'];
	var helpHtml   = '';
	var topicId    = 0;
	$.each(helpTopics, function(key, value) {
		if(key && value) {
			topicId++;
			helpHtml = helpHtml + '<li id="topic' + topicId + '">' + key + '<div class="topicTitle">' + key + '</div><div class="topicContent">' + value + '</div></li>';
		}
	});
	/////////////////////
	// RE-INSERT INTRO //
	/////////////////////
	var introValue = '<p>' + LANG.INTRO_SLIDE_1[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_2[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_3[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_4[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_5[lang].split('.').join('. ') + '</p>\
	<p>' + LANG.INTRO_SLIDE_6[lang].split('.').join('. ') + '</p>';
	//
	helpHtml = '<li id="topic' + (topicId+1) + '">' + LANG.INTRO[lang] + '<div class="topicTitle">' + LANG.INTRO[lang] + '</div><div class="topicContent">' + introValue + '</div></li>' + helpHtml;
	///////////////////////
	// INSERT TOPIC LIST //
	///////////////////////
	$('#appHelper').html2('<h2><span id="backButton"> </span><div id="helpTitle">' + LANG.SETTINGS_HELP[lang] + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$('#appHelper').css2('opacity','1');
		//$('#appHelper').height($('#appContent').height());
	},0);
	//SCROLLER
	getNiceScroll('#appHelper',250,function() {
		startLock = 0;
	});
	//LIST CLOSER HANDLER
	app.handlers.activeRow('#backButton','button',function(evt) {
		app.handlers.fade(0,'#appHelperWrapper',function() {
			$('#appHelperWrapper').remove();
		});
	});
	//////////////////////////////////
	// CONTENT-BUILDER SELF-HANDLER //
	//////////////////////////////////
	app.handlers.activeRow('#appHelper li','activeRow',function(targetId) {
		if(startLock != 0) { return; }
		//PASS CONTENT
		var subTitle   = $('#' + targetId + ' .topicTitle').html();
		var subContent = $('#' + targetId + ' .topicContent').html();
		//BUILD SUB-CONTENT
		app.safeExec(function() {
			$('#appHelper').after('<div id="appSubHelper"><h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2><div id="subHelpContent">' + subContent + '</div></div>');
		});
		$('#appSubHelper').hide();
		$('#appSubHelper').css2('top',($('#appHeader').height()) + 'px');
		$('#appSubHelper').height($('#appContent').height());
		$('#appSubHelper').css2('bottom',($('#appFooter').height()) + 'px');
		$('#appSubHelper').show();
		/////////////
		// SUBHIDE //
		/////////////
		$('#appSubHelper').on('scroll',function(evt) {
			$('#appContent').hide();
			clearTimeout(subHelperTimer);
			subHelperTimer = setTimeout(function() {
				$('#appContent').show();
			},100);
		});
		///////////////////////////////
		// SUB-CONTENT ANIMATION END //
		///////////////////////////////
		setTimeout(function() {
			//ios horiz-scrolling crazy bug
			$('#appSubHelper').height($('#appContent').height());
		},0);
		$('#appSubHelper').on(transitionend,function(evt) {
			niceResizer(100);
			//IF CLOSED
			if(!$('#appSubHelper').hasClass('open')) {
				$('#appSubHelper').remove();
				setTimeout(function() {
					$('#appHelper').css2('width','100%');
					//restore visibility
					//$('.nicescroll-rails').css2('display','block');
				},100);
			//IF OPENED
			} else {
				$('.activeRow').removeClass('activeRow');
				//SCROLLER
				getNiceScroll('#appSubHelper');
			}
			setTimeout(function() {
				$('#appSubHelper').css2('width','100%');
			},100);
		});
		//SUB-CONTENT HANDLERS
		app.handlers.activeRow('#subBackButton','button',function(evt) {
		//$('#subBackButton').on(touchend,function() {
			//remove
			$('#appSubHelper').removeClass('open');
			$('#appHelper').removeClass('out');
			//hide on transision
			$('.nicescroll-rails').css2('display','none');
		});
		//////////////////////
		// OPEN SUB-CONTENT //
		//////////////////////
		setTimeout(function() {
			//smooth transition (wp8)
			$('#appSubHelper').css2('overflow','hidden');
			$('#appSubHelper').addClass('open');
			$('#appHelper').addClass('out');
			$('.nicescroll-rails').css2('display','none');
		},50);
	});
}
//##//////////////##//
//## GETNEWwINDOW ##//
//##//////////////##//
function getNewWindow(title,content,handlers,save,closer,direction,bottom,top) {
	'use strict';
	var newWindow = (title == 'newSearch') ? 'newSearch' : 'newWindow';
	var newClass  = (title == 'newSearch') ? 'newsearch' : 'newwindow';
	if(title == 'newSearch') {
		bottom = 'flush';
	}
	//
	if($('#timerDailyInput').is(':focus')) { $('#timerDailyInput').trigger('blur'); return; }
	//FLOOD
	if($('#' + newWindow + 'Wrapper').html()) { return; }
	$('body').addClass(newClass);
	//////////
	// HTML //
	//////////
	//add heavy class
	var sideLoader = (direction == 'sideload') ? ' class="firstLoad"' : '';
	$('#' + newWindow + 'Wrapper').remove();
	var newContent = '\
	<div id="' + newWindow + 'Wrapper">\
		<div id="' + newWindow + 'Header">\
			<div id="backButton"></div>\
			<div id="saveButton">' + LANG.OK[lang] + '</div>\
			<div id="' + newWindow + 'Title">' + title + '</div>\
			</div>\
		<div id="' + newWindow + '"' + sideLoader + '>' + content + '</div>\
	</div>';
	$('#appContent').after2(newContent);
	//configure ui
	if(direction == 'sideload') {
		$('#' + newWindow + 'Wrapper').addClass('sideload');
	}
	if(typeof save !== 'function') {
		$('#saveButton').remove();
	}
	if(bottom == 'flush') {
		$('#' + newWindow + 'Wrapper').css2('bottom','0px');
	}
	$('#' + newWindow + 'Wrapper').css2('top',($('#appHeader').height()) + 'px');
	//////////////
	// HANDLERS //
	//////////////
	if(typeof handlers === 'function') {
		handlers();
	}
	////////////////////
	// OPEN NEWWINDOW //
	////////////////////	
	$('#' + newWindow + 'Wrapper').addClass('busy');
	$('#' + newWindow + 'Wrapper').addClass('open');
	////////////////////
	// TRANSISION END //
	////////////////////
	$('#' + newWindow + 'Wrapper').off().on(transitionend,function() {
		//swipe h2 closer
		/*
		app.swipe('#newWindowTitle',function(that,evt,direction) {
			if(/right|left/i.test(direction)) {
				$(document).trigger('backbutton');
			}
		});
		*/
		//scroller
		getNiceScroll('#' + newWindow,250);
		$('#' + newWindow + 'Wrapper').removeClass('busy');
		///////////////////
		// GLOBAL CLOSER //
		///////////////////
		var timerCloser;
		var windowTitle = title;
		function windowCloser() {
			if(closer) {
				closer();
			}
			$('#appContent, #foodSearch, #' + newWindow + 'Wrapper').css2('pointer-events','none');
			if($.nicescroll) {
				$('#' + newWindow).getNiceScroll().remove();
			}
			setTimeout(function() {
				$('#' + newWindow + 'Wrapper').removeClass('open');
				$('#' + newWindow + 'Wrapper').css2('opacity',0);
			},50);
			$('#' + newWindow + 'Wrapper').off().on(transitionend,function() {
				$('#' + newWindow + 'Wrapper').remove();
				$('#appContent, #foodSearch').css2('pointer-events','auto');
				$('body').removeClass(newClass);
				clearTimeout(timerCloser);
				if(!/help|chronoburn|diet/i.test(windowTitle)) {
					setPush();
				}
			});
			timerCloser = setTimeout(function() {
				$('#' + newWindow + 'Wrapper').remove();
				$('#appContent, #foodSearch').css2('pointer-events','auto');
				$('body').removeClass(newClass);
				if(!/help|chronoburn|diet/i.test(windowTitle)) {				
					setPush();
				}
			},500);
		}
		///////////////////////////////////
		// TRANSITION-PROTECTED HANDLERS //
		///////////////////////////////////
		// SAVE HANDLER //
		//////////////////
		app.handlers.activeRow('#saveButton','button',function(evt) {
			if(save() == true) {
				windowCloser();
			}
		});
		////////////////////
		// CLOSER HANDLER //
		////////////////////
		app.handlers.activeRow('#backButton','button',function(evt) {
			windowCloser();
		});
	});
}
//##/////////////////##//
//## BUILD LANG MENU ##//
//##/////////////////##//
//dump lang
/*
var langListString = [];
$.each(LANG, function(i, langCode) {
	langListString.push(langCode[lang]);
});
app.save('langDump',JSON.stringify(langListString));
*/
//pre-process
var langListArray = [];
$.each(LANG.LANGUAGE, function(i, langCode) {
	'use strict';
	langListArray.push('<li id="set' + langCode + '">'+ LANG.LANGUAGE_NAME[langCode] +'</li>');
});
//BUILD ORDERED HTML
langListArray.sort();
var langListCore  = '';
$.each(langListArray, function(l, Langline) {
	'use strict';
	langListCore = langListCore + Langline;
});
var langSelectTap;
function buildLangMenu(opt) {
	'use strict';
	$('#langSelect').remove();
	/////////////////
	// APPEND HTML //
	/////////////////
	$('body').append2('<div id="langSelect"><ul id="langSelectList"><li id="setAuto">' + LANG.AUTO_DETECT[lang] + ' (' + LANG.LANGUAGE_NAME[defaultLang] + ')</li>' + langListCore + '</ul></div>');
	$('#langSelect').hide();
	//intro
	if(opt !== 'intro') {
		$('#langSelect').css2('top',($('#appHeader').height()) + 'px');
		$('#langSelect').css2('bottom',($('#appFooter').height()) + 'px');
		$('#langSelect').height($('#appContent').height());
	}
	//intro
	if(opt == 'intro') {
		$('#langSelect').css2('z-index',100);
		//pad
		if($('body').hasClass('ios7')) {
			$('#langSelect').css2('padding-top','24px');
		}
	}
	//mark current
	//app.save("devSetLang",lang);
	if(app.read('devSetLang')) {
		$('#set' + lang).addClass('set');
	} else {
		$('#setAuto').addClass('set');
	}
	$('.set').addClass('preset');
	/////////////
	// FADE IN //
	/////////////
	app.handlers.fade(1,'#langSelect',function(evt) {
		getNiceScroll('#langSelect');
	});
	/////////////
	// handler //
	/////////////
	//FLOOD PROTECTION
	clearTimeout(langSelectTap);
	langSelectTap = setTimeout(function() {
		app.handlers.activeRow('#langSelect li','set',function(rowId) {
		//$('#langSelect li').on(tap,function(evt) {
			$('.preset').removeClass('preset');
			if(rowId == 'setAuto') {
				app.remove('devSetLang');
			} else {
				app.save('devSetLang',rowId.replace('set',''));
			}
			//////////////
			// fade out //
			//////////////
			app.handlers.fade(0,'#langSelect',function(evt) {
			//$('#langSelect').stop().fadeOut(200,function() {
				setTimeout(function() {
				$('body').removeClass('appLang-' + lang);
				if(app.read('devSetLang')) {
					lang = app.read('devSetLang');
				} else {
					lang = defaultLang;
				}
				$('body').addClass('appLang-' + lang);
				if(lang != 'en') {
					LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
				}
				//FOOTER
				$('#tab1').html2(LANG.MENU_STATUS[lang]);
				$('#tab2').html2(LANG.MENU_DIARY[lang]);
				$('#tab3').html2(LANG.MENU_PROFILE[lang]);
				$('#tab4').html2(LANG.MENU_SETTINGS[lang]);
				//HEADER
				$('#timerKcals span').html2(LANG.CALORIC_BALANCE[lang]);
				$('#timerDaily span').html2(LANG.DAILY_CALORIES[lang]);
				//CONTENT
				//prevent colapse
				$('#timerDailyInput').trigger('blur');
				appFooter(app.read('app_last_tab'),0);
				//start date
				$('#cssStartDate').html2('#startDateSpan:before { content: "' + LANG.START_DATE[lang] + '"; }');
				//page title
				//$('title').html2(appName + ' ' + LANG.CALORIE_CLOCK[lang]);
				//heading sum
				updateEntriesSum();
				//update cat list cache
				buildCatListMenu();
				//AUTO UPDATE CSS TITLES
				$('#cssAutoUpdate').html2('\
					.loading #advancedAutoUpdate:before	  { content: "' + LANG.DOWNLOADING[lang]     + '"; }\
					.pending #advancedAutoUpdate:before	  { content: "' + LANG.RESTART_PENDING[lang] + '"; }\
					.uptodate #advancedAutoUpdate:before  { content: "' + LANG.UP_TO_DATE[lang]      + '"; }\
					.corrupted #advancedAutoUpdate:before { content: "' + LANG.CORRUPTED[lang]       + '"; }\
					.spinnerMask #loadMask:before		  { content: "' + LANG.PREPARING_DB[lang]    + '"; }\
					.spinnerMask.updtdb #loadMask:before  { content: "' + LANG.UPDATING_DB[lang]     + '"; }\
				');
				///////////////////
				// refresh intro //
				///////////////////
				if(opt == 'intro') {
					$('#slide1 p').html2(LANG.INTRO_SLIDE_1[lang].split('.').join('. '));
					$('#slide2 p').html2(LANG.INTRO_SLIDE_2[lang].split('.').join('. '));
					$('#slide3 p').html2(LANG.INTRO_SLIDE_3[lang].split('.').join('. '));
					$('#slide4 p').html2(LANG.INTRO_SLIDE_4[lang].split('.').join('. '));
					$('#slide5 p').html2(LANG.INTRO_SLIDE_5[lang].split('.').join('. '));
					$('#slide6 p').html2(LANG.INTRO_SLIDE_6[lang].split('.').join('. '));
					$('#closeDiv').html2(LANG.CLOSE_INTRO[lang]);
					$('#appLang').html2(LANG.LANGUAGE_NAME[lang]);
					$('#skipIntro').html2(LANG.SKIP[lang]);
					$('span#deficit').html2(LANG.DEFICIT[lang]);
					$('span#balanced').html2(LANG.BALANCED[lang]);
					$('span#surplus').html2(LANG.SURPLUS[lang]);
					$('#slide3 span#deficit').html2(LANG.EXERCISE[lang]);
					$('#slide3 span#balanced').html2(LANG.CALORIC_BALANCE[lang]);
					$('#slide3 span#surplus').html2(LANG.FOOD[lang]);
				setTimeout(function() {
						appFooter('tab1',1);
					},100);
				}
				},100);
			});
		});
	},300);
}
//////////////////
// NICE RESIZER //
//////////////////
function niceResizer(timeout,callback) {
	'use strict';
	if(!timeout) { timeout = 100; }
	app.timeout('niceResizer',timeout,function() {
		if(app.is.scrollable && app.globals.scrollerList) {
			$(app.globals.scrollerList).getNiceScroll().resize();
		}
		if(typeof callback === 'function') {
			callback();
		}
	});
}
///////////////////
// GETNICESCROLL //
///////////////////
function getNiceScroll(target,timeout,callback) {
	'use strict';
	if(!$.nicescroll)		{ return; }
	if(!app.exists(target)) { return; }
	if(!timeout)	  		{ timeout = 0; }
	//force is.scrollable on #appHistory for android
	if(app.device.android && app.device.android >= 5) {
		app.is.scrollable  = document.getElementById('appHistory') ? true : false;
		app.is.scrollable  = document.getElementById('appTracker') ? true : false;
	}	
	//BB10 for nutrients
	if(app.device.blackberry || app.device.tizen) {
		app.is.scrollable = document.getElementById('addNewWrapper') ? true : false;
	}
	//quick scrolling / prevent scrollbar
	if(app.is.scrollable || (($('#appHistory').html() || $('#appTracker').html()) && (app.device.wp8 || app.device.msapp || app.device.firefoxos))) {
		//$('.overthrow').removeClass('overthrow');
		$(target).removeClass('overthrow');
		$(target).css2('overflow','hidden');
	} else {
		//$('.overthrow').removeClass('overthrow');
		$(target).addClass('overthrow');
		$(target).css2('overflow','auto');
		if(app.device.ios) {
			$(target).css2('-webkit-overflow-scrolling','touch');
		}
	}
	////////////////
	// NICESCROLL //
	////////////////
	setTimeout(function() {
		///////////////
		// NSETTINGS //
		///////////////
		var NSettings = {
			touchbehavior: true,
			nativeparentscrolling: true,
			cursorcolor: '#000',
			cursorborderradius: 0,
			railpadding: { right: 1,  bottom: 0, top: 0 },
			cursorborder: '0px solid #ffffff',
			cursoropacitymax: .666,
			cursorwidth: 3,
			horizrailenabled: false,
			autohidemode: true,
			hidecursordelay: 400,
			hwacceleration: true,
			rtlmode: false,
			railalign: 'right',
			railvalign: 'bottom',
			zindex: 50
		};
		//ADDNEW Z-INDEX (99)
		if(/addNewWrapper|lang/i.test(target)) {
			NSettings.zindex = 100;
			//NSettings.railpadding.bottom = 1;
		}
		//HIDE FIRST HELPER
		if(/appHelper/i.test(target)) {
			//NSettings.zindex = -1;
			NSettings.cursorborder = '0px solid rgba(0,0,0,0)';
			NSettings.cursorcolor = 'rgba(0,0,0,0)';
		}
		//HORIZONTAL
		if($('#appHistory').html() || $('#appTracker').html()) {
			NSettings.horizrailenabled = true;
		}
		if(app.device.desktop || app.device.linux) {
			NSettings.touchbehavior = true;
		}
		//NO HAND CURSOR
		if(app.device.desktop && (vendorClass == 'msie' || app.device.msapp)) {
			NSettings.grabcursorenabled = false;
		}
		if(/subhelp/i.test(target)) {
			NSettings.touchbehavior = false;
			NSettings.enablescrollonselection = true;
		}
		//UPDATE LIST
		if(!app.globals.scrollerList) {
			app.globals.scrollerList = target;
		}
		if(!(app.globals.scrollerList).contains(target)) {
			app.globals.scrollerList += ',' + target;
		}
		//NOTES
		if(target == '#diaryNotesInput') {
			if(!app.device.wp8 && !app.device.windows8) {
				$(target).removeClass('overthrow');
				$(target).css2('overflow','hidden');
				$(target).niceScroll(NSettings);
			} else {
				$(target).addClass('overthrow');
				$(target).css2('overflow','auto');
			}
		//APPLY
		} else {
			if(app.is.scrollable || (($('#appHistory').html() || $('#appTracker').html()) && (app.device.wp8 || app.device.windows8 || app.device.firefoxos))) {
				$(target).removeClass('overthrow');
				$(target).css2('overflow','hidden');
				$(target).niceScroll(NSettings);
			} else {
				$(target).addClass('overthrow');
				$(target).css2('overflow','auto');
				if(app.device.ios) {
					$(target).css2('-webkit-overflow-scrolling','touch');
				}
			}
		}
		//////////////
		// CALLBACK //
		//////////////
		if(typeof callback === 'function') {
			setTimeout(function() {
				callback();
			},0);
		}
		//
		niceResizer(120);
	},timeout);
}
///////////////////////////////
// UPDATE WRAPPER MIN-HEIGHT //
///////////////////////////////
app.wrapperMinHeight = function() {
	'use strict';
	var wrapperMinH = (app.relHeight) - (154 + $('#appHeader').height() + $('#appFooter').height());
	if(wrapperMinH < 0) {
		wrapperMinH = 0;
	}
	if($('#entryListWrapper').height() < app.relHeight) {
		//HOLDER
		if(!$('#entryListHeight').length) {
			$('head').append2('<style id="entryListHeight"></style>');
		}
		//IF NEEDED
		$('#entryListHeight').html2('#entryListWrapper { min-height: ' + wrapperMinH + 'px !important; }');
	}
};
//#/////////////#//
//# APP RESIZER #//
//#/////////////#//
function appResizer(time,callback) {
	'use strict';
	if(!time) { time = 0; }
	app.timeout('appResizer',time,function() {
		app.relWidth  = app.width()  / app.read('app_zoom');
		app.relHeight = app.height() / app.read('app_zoom');

		if(vendorClass == 'moz' || vendorClass == 'msie') {
			$('body').css2('width', app.relWidth + 'px');
			$('body').css2('height', app.relHeight + 'px');
		}

		if(!app.device.msapp && !app.device.desktop && !app.device.linux && !app.device.ipad) {
			if(app.device.android) {
				//old method for android ~ prevent kb colapse
				$('body').css2('min-height', app.relHeight + 'px');
			}
			//regular method
			$('body').css2('max-height', app.relHeight + 'px');
		}
		//unlock top white gap
		$('body').trigger('touchmove');
		//SCROLLBAR UPDATE
		niceResizer();
		niceResizer(400);
		//WRAPPER MIN-HEIGHT
		app.wrapperMinHeight();
		//
		$('#appHelper').height($('#appContent').height());
		$('#appSubHelper').height($('#appContent').height());		
		//
		//$('#newWindowWrapper').hide();
		//if($('#newWindowWrapper').hasClass('sideload')) {
		//	$('#newWindowWrapper').height($('body').height() - $('#appHeader').height());
		//} else {
		//	$('#newWindowWrapper').height($('body').height() - ($('#appHeader').height() + $('#appFooter').height()));
		//}
		//$('#newWindowWrapper').show();
		//
		if($('#skipIntro').length) {
			$('#langSelect').height($('body').height());
		} else {
			$('#langSelect').height($('#appContent').height());
		}
		$('#advancedMenuWrapper').height($('#appContent').height());
		//FAST RESIZE
		$('#pageSlideFood').hide();
		$('#pageSlideFood').height($('body').height() - ($('#appHeader').height()));
		//$('#pageSlideFood').css2('min-height',($('body').height() - ($('#appHeader').height())) + 'px');
		$('#pageSlideFood').show();
		//$('#tabMyItemsBlock').css2('min-height', ($('#foodList').height() - 128) + 'px');
		//chrome v32 input width
		if(app.device.desktop || app.device.windows8 || app.device.firefoxos || app.device.android) {
			$('#entryBody').width( $('body').width() -105);
			$('#foodSearch').width( $('body').width() -55);
		}
		//////////////
		// CALLBACK //
		//////////////
		if(typeof callback === 'function') {
			callback();
		}
	 });
}
//////////////
// SANITIZE //
//////////////
function sanitize(str) {
	'use strict';
	if(str) {
		/*jshint ignore:start*/
		var result = str.split(" ").join("").split("’").join("").split("”").join("").split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split(":").join("").split("/").join("").split("\\").join("").split("&").join("").split("â").join("a").split("ê").join("e").split("ô").join("o").split("ã").join("a").split("ç").join("c").split("á").join("a").split("é").join("e").split("í").join("i").split("ó").join("o").split("ú").join("u").split("à").join("a").split("õ").join("o").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").split(' ').join("").toLowerCase();
		/*jshint ignore:end*/
		return result;
	}
}
//////////////////
// SANITIZE SQL //
//////////////////
function sanitizeSql(str) {
	'use strict';
	if(str) {
		/*jshint ignore:start*/
		var result = str.split("'").join("’").split('"').join("”").split(";").join(",").split("\\").join(" ").split("  ").join(" ").split("  ").join(" ");
		/*jshint ignore:end*/
		return result;
	}
}
/////////////////////
// GET RATE DIALOG //
/////////////////////
// store url //
///////////////
var rateTimer;
function getRateDialog() {
	'use strict';
	//appstore enabled
	if (!app.device.ios && !app.device.android && !app.device.wp8 && !app.device.msapp && !app.device.windows8 && !app.device.wp10 && !app.device.windows10 && !app.device.firefoxos && !app.device.osxapp && !app.device.chromeos && !app.device.blackberry && !app.device.playbook && !app.device.tizen) {
		return;
	}
	if (app.get.platform() === 'web') {
		return;
	}
	//first use
	app.define('getRate', app.now());
	//return
	//if(app.read('getRate','locked')) { return; }
	//////////////////
	// DAYS TO WAIT // 1 ~ 7 days
	//////////////////
	var daysToWait = app.read('notFirstTime') ? 7 : 1;
	var timeRate = (24 * 60 * 60 * 1000) * daysToWait;
	//app.toast('wait: ' + daysToWait + ' days');
	//
	if ((app.now() - app.read('getRate')) > (timeRate)) {
		app.timeout('rateTimer', 2300, function () {
			//if(app.read('getRate','locked')) { return; }
			//app.save('getRate','locked');
			app.save('getRate', app.now());
			app.save('notFirstTime', app.now());			
			//SHOW IOS NATIVE RATING DIALOG
			if (app.device.ios && typeof LaunchReview !== 'undefined') {
				LaunchReview.rating(function (status) {
					if (status === "requested") {
						//app.toast('requested');
					} else if (status === "shown") {
						//app.toast('shown');
						app.analytics('vote');
					} else if (status === "dismissed") {
						//app.toast('dismissed');
						app.analytics('vote-no');
					}
					//STORE LAST RESULT
					var lastStatus = status;
					//IF NO MORES CREDITS, REVERT TO REGULAR DIALOG
					app.timeout('regularDialog', 3000, function () {
					//app.toast('last status' + lastStatus);					
					//AFTER 3s, CHECK IT THE LAST RETURNTED STATUS WAS 'REQUESTED' (BLOCKED), 
					if(lastStatus === 'requested') {
						//SHOW REGULAR DIALOG
						appConfirm(LANG.RATE_TITLE[lang], LANG.RATE_MSG[lang], function (button) {
							if (button === 2) {
								//LAUNCH
								app.analytics('vote');
								app.timeout('voteyes', 1500, function () {
									app.url();
								});
							} else if (button === 1) {
								//on action
								app.analytics('vote-no');
							}
							//
						}, LANG.YES_RATE[lang], LANG.NO_THANKS[lang]);
						//
					}
				});
			//ERROR ~ END OF FUNCTION
			}, function (err) {
					errorHandler('vote: ' + err);
					//app.toast('err');
				});
			} else {
			//SHOW REGULAR DIALOG
				appConfirm(LANG.RATE_TITLE[lang], LANG.RATE_MSG[lang], function (button) {
					if (button === 2) {
						//LAUNCH
						app.analytics('vote');
						app.timeout('voteyes', 1500, function () {
							app.url();
						});
					} else if (button === 1) {
						//on action
						app.analytics('vote-no');
					}
					//
				}, LANG.YES_RATE[lang], LANG.NO_THANKS[lang]);
				//
			}
		});
	}
}
//#///////////////#//
//# GET ANALYTICS #//
//#///////////////#//
app.analytics = function(target, desc) {
	'use strict';
	///////////////////////
	// FILTER DEV & NULL //
	///////////////////////
	if(target === 'error' && !desc)						{ return; }
	if(typeof ga_storage === 'undefined')				{ return; }
	if(app.dev || app.read('been_dev'))					{ app.remove('error_log_handled'); app.remove('error_log_unhandled'); return; }
	if(/local.|192.168.1./i.test(document.URL))			{ app.remove('error_log_handled'); app.remove('error_log_unhandled'); return; }
	if(/cancian/i.test(app.read('facebook_userid')))	{ app.remove('error_log_handled'); app.remove('error_log_unhandled'); return; }
	if(app.read('facebook_userid',1051211303))			{ app.remove('error_log_handled'); app.remove('error_log_unhandled'); return; }
	//////////
	// INIT //
	//////////
	if(!app.globals.initGA) {
		ga_storage._setAccount('UA-46450510-2');
		app.globals.initGA = true;
	}
	////////////////
	// TRACK VARS //
	////////////////
	var deviceType = 'web';
	var appOS      = vendorClass;
	     if(app.device.ios)		   { appOS = 'ios';        if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.amazon)     { appOS = 'amazon';     if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.blackberry) { appOS = 'blackberry'; if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.playbook)   { appOS = 'playbook';   if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.android)	   { appOS = 'android';    if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.wp10)	   { appOS = 'wp10';       if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.wp81)	   { appOS = 'wp8';        if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.wp8)		   { appOS = 'wp8';        if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.windows10)  { appOS = 'windows10';  if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.windows8)   { appOS = 'windows8';   if(app.device.cordova) { deviceType = 'app'; }}
	else if(app.device.tizen)      { appOS = 'tizen';      deviceType = 'app'; }
	else if(app.device.firefoxos)  { appOS = 'firefoxos';  deviceType = 'app'; }
	else if(app.device.osxapp)     { appOS = 'osxapp';     deviceType = 'app'; }
	else if(app.device.chromeos)   { appOS = 'chromeos';   deviceType = 'app'; }
	else if(app.device.linux)      { appOS = 'linux';      deviceType = 'app'; }
	//string
	var trackString = appOS + '.' + deviceType  + '/#' + target + ' (' + lang + ') (' + appBuild + ')';
	//track page/event
	if(target === 'error') {
		//skip irrelevant
		if(/800a139e|isTrusted|InvalidStateError|UnknownError|space|stack|size|pile|NS_ERROR|ADCk2gVoB8/i.test(JSON.stringify(desc))) {
			return;	
		}
		//ERROR EVENT
		ga_storage._trackEvent(appOS, target, desc);
	} else {
		//REGULAR EVENT ~ plus loadTIme
		ga_storage._trackEvent(appOS, target, (typeof desc === 'number') ? desc : lang, (typeof desc === 'number') ? desc : 0);
		ga_storage._trackPageview(trackString, appOS + ' (' + lang + ') (' + appBuild + ')');
	}
};
//BACKWARDS C.
function getAnalytics(action) {
	'use strict';
	app.analytics(action);
}
//#//////////////////////#//
//# FACEBOOK INTEGRATION #//
//#//////////////////////#//
///////////////////
// GET LOGOUT FB //
///////////////////
function getLogoutFB(button) {
	'use strict';
	$('body').removeClass('insync');
	$('body').removeClass('setpush');
	if(button === 2) {
		app.remove('facebook_logged');
		app.remove('facebook_userid');
		app.remove('facebook_username');
		$('body').removeClass('appFacebook');
		$('body').removeClass('appEmailLogin');
		$('#optionFacebook span').html2(LANG.SETTINGS_BACKUP_INFO[lang]);
	}
}
/////////////////////////
// UPDATE LOGIN STATUS //
/////////////////////////
function updateLoginStatus(sync) {
	'use strict';
	if(app.read('facebook_logged') && app.read('facebook_userid') && app.read('facebook_username')) {
		$('body').addClass('appFacebook');
		if(/@/i.test(app.read('facebook_username'))) {
			$('body').addClass('appEmailLogin');
		}
		$('#optionFacebook span').html2(LANG.LOGGED_IN_AS[lang] + ' ' + app.read('facebook_username'));
		if(sync == 1) { syncEntries(); }
	} else {
		getLogoutFB(1);
	}
}
//////////////////
// GET TOKEN FB //
//////////////////
function getTokenFB(result) {
	'use strict';
	try {
		var access_token;
		var expires_in;
		//msapp
		if(result.responseData) {
			var fullUrl      = (result.responseData).split('#');
			var responseData = fullUrl[1];
			var keyValPairs  = responseData.split('&');
			for(var i = 0; i < keyValPairs.length; i++) {
				var splits = keyValPairs[i].split('=');
				switch (splits[0]) {
					case 'access_token':
						access_token = splits[1];
						break;
					case 'expires_in':
						expires_in = splits[1];
						break;
				}
			}
		} else {
			access_token = result;
		}
		///////////////////
		// GET USER INFO //
		///////////////////
		$.get('https://graph.facebook.com/me?access_token=' + access_token,function(me) {
			if(me.id && me.name) {
				app.save('facebook_logged',true);
				app.save('facebook_userid',me.id);
				app.save('facebook_username',me.name);
				updateLoginStatus(1);
			}
		});
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}
//////////////////
// GET LOGIN FB //
//////////////////
function getLoginFB() {
	'use strict';
	try {
		////////////////////////
		// OPENFB ANDROID/IOS //
		////////////////////////
		if(app.device.cordova && (app.device.ios || app.device.android) && !app.device.msapp) {
			if (typeof openFB !== 'undefined') {
				openFB.init({appId: '577673025616946'});
				openFB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				});
			}
		/////////
		// WP8 //
		/////////
		} else if (app.device.wp8) {
			if(typeof openFB !== 'undefined') {
				openFB.init('577673025616946');
				openFB.login('email',
					function() {
						getTokenFB(window.sessionStorage.fbtoken);
					},
					function (err) {
						errorHandler(err);
				});
			}
		///////////
		// MSAPP //
		///////////
		} else if(app.device.msapp) {
			var callbackURL = 'https://www.facebook.com/connect/login_success.html';
			var facebookURL = 'https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=' + encodeURIComponent(callbackURL);
			var startURI    = new Windows.Foundation.Uri(facebookURL);
			var endURI      = new Windows.Foundation.Uri(callbackURL);
			//METHODS
			try {
				if(app.device.wp81 || app.device.wp10) {
					//WP
					(function() { Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAndContinue(startURI, endURI); })();
				} else {
					//WINDOWS
					(function() { Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync('', startURI, endURI).then(getTokenFB, errorHandler); })();
				}
			} catch(err) {
				errorHandler('error: getLoginFB (msapp) | catch: ' + err);
			}
		//////////
		// BB10 //
		//////////
		} else if(app.device.tizen || app.device.blackberry || app.device.playbook) {
			//CLEAR TIZEN
			if(app.device.tizen) {
				if(typeof tizen !== 'undefined') {
					tizen.websetting.removeAllCookies();
				}
			}
			//INIT
			FB.init({ appId : '577673025616946', status : true, version: 'v2.8', cookie : true, xfbml : true });
			var callBackURL = 'https://www.facebook.com/connect/login_success.html';
			var faceBookURL = 'https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&response_type=token&redirect_uri=' + encodeURIComponent(callBackURL);
			//open
			var childWindow = window.open(faceBookURL, '_blank');
			//TIZEN WINDOW CLOSER
			if(app.device.tizen) {
				childWindow.addEventListener('tizenhwkey', function(e) {
					if(e.keyName === 'back' ) {
						clearInterval(app.timers.bbtoken);
						childWindow.close();
					}
				});
			}
			//INTERVAL CHECKER
			app.timers.bbtoken = setInterval(function () {
				try {
					var currentURL  = childWindow.window.location.href;
					var callbackURL = 'https://www.facebook.com/connect/login_success.html';
					var inCallback  = currentURL.indexOf(callbackURL);
					//TOKEN
					if (inCallback == 0) {
						clearInterval(app.timers.bbtoken);
						var tokenURL = childWindow.document.URL;
						tokenURL = tokenURL.split('access_token=')[1];
						tokenURL = tokenURL.split('&expires_in=')[0];
						app.save('temp_token', tokenURL);
						childWindow.close();
						setTimeout(function () {
							getTokenFB(app.read('temp_token'));
						}, 200);
					}
				} catch(err) {					
					clearInterval(app.timers.bbtoken);
				}
			}, 100);
		////////////
		// OSXAPP //
		////////////
		} else if(app.device.osxapp) {
			if(typeof FB !== 'undefined' && typeof macgap !== 'undefined') {
				var pops;
				//callback listener
				$(document).off('userDefaultsChanged').on('userDefaultsChanged', function () {
					var macToken = macgap.userDefaults.getString('macgap_token');
					if(macToken != '') {
						getTokenFB(macToken);
						$(document).off('userDefaultsChanged');
						macgap.userDefaults.removeObjectForKey('macgap_token');
						pops.close();
					}
				});
				//window
				pops = window.open('https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=' + app.https + 'dietclock.app/redirect.php','pops','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no, width=480,height=320');
			}
		////////////
		// JS SDK //v2.8 
		////////////
		} else {
			$.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
				if(typeof FB !== 'undefined') {
					FB.init({ appId : '577673025616946', status : true, version: 'v2.8', cookie : true, xfbml : true });
					//check status
					FB.getLoginStatus(function(response) {
						//already logged
						if(response.authResponse) {
							getTokenFB(response.authResponse.accessToken);
						}
					});
					FB.login(function (response) {
						//auth dialog
						if(response.authResponse) {
							getTokenFB(response.authResponse.accessToken);
						}
					}, { scope : 'email' });
				}
			});
		}
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}
/////////////////////
// GET LOGIN EMAIL //
/////////////////////
function getLoginEmail() {
	'use strict';
	var suggestionBoxHtml = '<div id="suggestionBox">\
			<label for="usrMail" class="usrMail">' + LANG.EMAIL[lang] + ':</label><input type="text" name="usrMail" id="usrMail" />\
			<label for="usrPass" class="usrPass">' + LANG.PASSWORD[lang] + ':</label><input type="password" name="usrPass" id="usrPass" />\
			<div id="resetPass">' + LANG.RESET_PASSWORD[lang] + '</div>\
			<div id="newUsers">*If you don’t have an account yet, it will be automatically created the first time you login.</div>\
			</div>';
	//////////////
	// HANDLERS //
	//////////////
	var suggestionBoxHandlers = function () {
		$('#saveButton').html2(LANG.OK[lang]);
		$('#saveButton').css2('text-transform', 'uppercase');
		//
		$('#suggestionBox').on(touchstart, function (evt) {
			if (evt.target.id === 'suggestionBox') {
				$('#usrMail').trigger('blur');
				$('#usrPass').trigger('blur');
			}
		});
		//prevent propagation focus
		$('#usrMail').css2('pointer-events', 'none');
		$('#usrPass').css2('pointer-events', 'none');
		$('#resetPass').css2('pointer-events', 'none');
		setTimeout(function () {
			$('#usrMail').css2('pointer-events', 'auto');
			$('#usrPass').css2('pointer-events', 'auto');
			$('#resetPass').css2('pointer-events', 'auto');
		}, 400);
		// SAVE LAST EMAIL
		$('#usrMail').on('input blur keyup keypress', function(evt) {
			if($('#usrMail').val().length) {
				app.save('usrMail',(trim($('#usrMail').val()).toLowerCase()));
			}
		});
		//PRE-FILL
		if(app.read('usrMail')) {
			if (app.checkEmail(app.read('usrMail'))) {
				$('#usrMail').val(trim(app.read('usrMail')));
			}
		}
		////////////////////
		// RESET PASSWORD //
		////////////////////
		app.handlers.activeRow('#resetPass', 'button', function (evt) {
			//validate e-mail
			if (!app.checkEmail($('#usrMail').val())) {
				$('.usrMail').css2('color', '#c30');
				setTimeout(function () {
					alert(LANG.BLANK_FIELD_TITLE[lang], LANG.BLANK_FIELD_DIALOG[lang]);
				}, 50);
				return false;
			} else {
				//send mail
				$('.usrMail').css2('color', '#000');
				var usrMailStore = (trim($('#usrMail').val())).toLowerCase();
				var usrPassStore = md5(trim($('#usrPass').val()));
				$.ajax({
					type : 'GET',
					dataType : 'text',
					url : app.https + 'dietclock.app/auth.php?user=' + usrMailStore,
					error : function (xhr, statusText) {
						errorHandler('error: ' + xhr + statusText);
					},
					success : function (reply) {
						if (reply == 'sent') {
							alert(LANG.EMAIL_SENT[lang].split('{{email}}').join(usrMailStore), '');
						} else if (reply === 'error') {
							//login to account
							alert(LANG.ERROR[lang],LANG.NO_ENTRIES[lang]);
							//alert('The specified account does not exist.', '');
						}
					}
				});

			}
		});
	};
	/////////////
	// CONFIRM //
	/////////////
	var suggestionBoxConfirm = function () {
		var result = false;
		//MSG
		if ((trim(JSON.stringify($('#usrPass').val()))).length >= 4) {
			$('.usrPass').css2('color', '#000');
		} else {
			$('.usrPass').css2('color', '#c30');
		}
		//MAIL
		if (app.checkEmail(app.read('usrMail'))) {
			$('.usrMail').css2('color', '#000');
		} else {
			$('.usrMail').css2('color', '#c30');
		}
		//STORE VALUES
		var usrMailStore = app.read('usrMail');
		var usrPassStore = md5(trim($('#usrPass').val()));
		//LOWERCASE EMAIL
		if(usrMailStore.length) {
			usrMailStore = usrMailStore.toLowerCase();
		}
		//VALIDATE
		if (app.checkEmail(app.read('usrMail')) && (trim(JSON.stringify($('#usrPass').val()))).length >= 4) {
			//send mail
			$('#saveButton').css2('pointer-events', 'none');
			$('#saveButton').css2('color', '#ccc');
			//AJAX
			$.ajax({
				type : 'GET',
				dataType : 'text',
				url : app.https + 'dietclock.app/auth.php?mail=' + usrMailStore + '&hash=' + usrPassStore,
				error : function (xhr, statusText) {
					errorHandler('error: ' + xhr + statusText);
				},
				success : function (reply) {
					if (reply == 'created') {
						app.save('facebook_logged', true);
						app.save('facebook_userid', usrMailStore);
						app.save('facebook_username', usrMailStore);
						updateLoginStatus(1);
						alert(LANG.ALL_DONE[lang], '');
						$('#usrMail').trigger('blur');
						$('#usrPass').trigger('blur');
						$(document).trigger('backbutton');
					} else if (reply === 'logged') {
						app.save('facebook_logged', true);
						app.save('facebook_userid', usrMailStore);
						app.save('facebook_username', usrMailStore);
						updateLoginStatus(1);
						$('#usrMail').trigger('blur');
						$('#usrPass').trigger('blur');
						$(document).trigger('backbutton');
					} else if (reply == 'error') {
						setTimeout(function () {
							$('#saveButton').css2('pointer-events', 'auto');
							$('#saveButton').css2('color', '#007aff');
							alert(LANG.ERROR[lang], LANG.WRONG_PASSWORD[lang]);
						}, 50);
					}
				}
			});
		} else {
			setTimeout(function () {
				$('#saveButton').css2('pointer-events', 'auto');
				$('#saveButton').css2('color', '#007aff');
				alert(LANG.BLANK_FIELD_TITLE[lang], LANG.BLANK_FIELD_DIALOG[lang]);
			}, 50);
			return false;
		}
	};
	//
	var suggestionBoxClose = function () {};
	getNewWindow('E-mail Login', suggestionBoxHtml, suggestionBoxHandlers, suggestionBoxConfirm, suggestionBoxClose);
}

