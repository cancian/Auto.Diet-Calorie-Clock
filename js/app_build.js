/*jshint multistr: true */
/*########################################
####    HTML BUILDS ~ OPEN SETTINGS   ####
########################################*/
function openSettings(keepOpen) {
	//RAW HTML
	var settingsHtml = '\
	<a name="top"></a>\
	<div id="settingsWrapper">\
		<ul id="settingsList">\
			<li id="optionMeasure">\
				<div class="contentToggleTitle">\
					<p class="contentTitle" id="contentToggleTitle">' + LANG.MEASURE_SYSTEM[lang] + '<span>' + LANG.MEASURE_SYSTEM_INFO[lang] + '</span></p>\
					<div id="tapSwitch">\
						<div id="leftOption"><span>'  + LANG.IMPERIAL[lang] + ' </span></div>\
						<div id="rightOption"><span>' + LANG.METRIC[lang]   + ' </span></div>\
					</div>\
				</div>\
			</li>\
			<li id="optionFacebook"><div><p class="contentTitle">' + LANG.SETTINGS_BACKUP[lang]      + '<span>' + LANG.SETTINGS_BACKUP_INFO[lang]   + '</span></p></div></li>\
			<li id="optionLang"><div><p class="contentTitle">'     + LANG.SETTINGS_SYSTEM_LANG[lang] + '<span>' + LANG.LANGUAGE_NAME[lang]          + '</span></p></div></li>\
			<li id="optionHelp"><div><p class="contentTitle">'     + LANG.SETTINGS_HELP[lang]        + '<span>' + LANG.SETTINGS_HELP_INFO[lang]     + '</span></p></div></li>\
			<li id="optionBuy"><div><p class="contentTitle">'      + LANG.BUY_FULL_VERSION[lang]     + '<span>' + LANG.DAYS_LEFT[lang] + ': ' + daysLeft() + '</span></p></div></li>\
		</ul>\
		<div id="optionWebsite">' + appName + " v" + appVersion + '</div>\
		<div id="optionLastSync">' + LANG.LAST_SYNC[lang]  + '<span>--</span></div>\
		<div id="optionAdvanced">' + LANG.SETTINGS_ADVANCED[lang] + '</div>\
	</div>\
	';
	//<div id="optionReset">' + LANG.SETTINGS_WIPE[lang] + '</div>\
	//#////////#//
	//# OUTPUT #//
	//#////////#//
	preTab(keepOpen);
	$("#appContent").html(settingsHtml);
	afterTab(keepOpen);
	///////////////////
	// last sync tap //
	///////////////////
	if(window.localStorage.getItem("lastSync") != "never") {
		$("#optionLastSync span").html(dateDiff(window.localStorage.getItem("lastSync"),(new Date().getTime())));
		//$("#optionLastSync span").html(dtFormat(Number(window.localStorage.getItem("lastSync")))); 
	}
	$("#optionLastSync").on(touchend,function(evt) {
		evt.preventDefault();
		if(!$("#nprogress").html()) {
			syncEntries(window.localStorage.getItem("facebook_userid"));
		}
		return false;
	});
	//////////////
	// HELP TAP //
	//////////////
	$("#optionHelp").on(touchend,function(evt) {
		$(this).addClass("activeRow");
		evt.preventDefault();
		buildHelpMenu();
		return false;
	});	
	/////////////
	// BUY TAP //
	/////////////
	if(!isPaid()) {	
	$("#optionBuy").on(touchend,function(evt) {
		$(this).addClass("activeRow");
		evt.preventDefault();
		billingWindow();
		return false;
	});	
	} else {
		$("#optionBuy").remove();
	}
	//////////////
	// LANG TAP //
	//////////////
	$("#optionLang").on(touchend,function(evt) {
		buildLangMenu();
	});
	////////////////////////
	// SETTINGS: FACEBOOK //
	////////////////////////
	$("#optionFacebook").on(touchend, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//fix exception 18
		if(isMobile.Android()) {
			updateFoodDb();
		}
		if(!$("#nprogress").html()) {
			if(window.localStorage.getItem("facebook_logged")) {
				//CONFIRM DIALOG
				appConfirm(LANG.LOGOUT_TITLE[lang], LANG.ARE_YOU_SURE[lang], getLogoutFB, LANG.OK[lang], LANG.CANCEL[lang]);
			} else {
				setTimeout(function() {
					getLoginFB();
				},100);
			}
		}
	});
	//TOGGLE ACTIVE
	$("#optionFacebook").on(touchstart,function(evt) {
		evt.preventDefault();
		$("#optionFacebook").addClass("activeRow");
	});
	$("#optionFacebook").on(touchend + " mouseout",function(evt) {
		$("#optionFacebook").removeClass("activeRow");
	});
	//SET USERNAME (IF LOGGED)
	if(window.localStorage.getItem("facebook_username") && window.localStorage.getItem("facebook_logged")) {
		$("#optionFacebook span").html(LANG.LOGGED_IN_AS[lang] + ' ' + window.localStorage.getItem("facebook_username"));
	}
	////////////////
	// ACTIVE ROW //
	////////////////
	$("#settingsList li").on(touchstart,function(evt) {
		evt.preventDefault();
		$(this).addClass("activeRow");
	});
	$("#settingsList,#settingsList li").on(touchend + " mouseout",function(evt) {
		$(".activeRow").removeClass("activeRow");
		evt.preventDefault();
	});
	////////////////////////
	// SETTINGS: ADVANCED //
	////////////////////////
	$("#optionAdvanced").on(touchend, function(evt) {
		buildAdvancedMenu();
	});
	$("#optionAdvanced").on(touchstart,function(evt) {
		evt.preventDefault();
		$("#optionAdvanced").addClass("activeRow");
	});
	$("#optionAdvanced").on(touchend + " mouseout",function(evt) {
		$("#optionAdvanced").removeClass("activeRow");
	});
	///////////////////////////
	// SETTINGS: UNIT TOGGLE //
	///////////////////////////
	$("#optionMeasure").on(touchstart,function(evt) {
		evt.preventDefault();
	});	
	$("#leftOption").on(touchstart,function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		$("#leftOption").addClass("toggle");
		$("#rightOption").removeClass("toggle");
		window.localStorage.setItem("config_measurement","imperial");
		window.localStorage.setItem("calcForm#pA2C","inches");
		window.localStorage.setItem("calcForm#pA3C","pounds");
		window.localStorage.setItem("calcForm#pA6H","pounds");
		window.localStorage.setItem("calcForm#pA6N","pounds");
		setPush();
	});
	$("#rightOption").on(touchstart,function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		$("#rightOption").addClass("toggle");
		$("#leftOption").removeClass("toggle");
		window.localStorage.setItem("config_measurement","metric");
		window.localStorage.setItem("calcForm#pA2C","centimetres");
		window.localStorage.setItem("calcForm#pA3C","kilograms");
		window.localStorage.setItem("calcForm#pA6H","kilograms");
		window.localStorage.setItem("calcForm#pA6N","kilograms");
		setPush();
	});
	//read stored
	if(window.localStorage.getItem("config_measurement") == "metric") {
		$("#rightOption").addClass("toggle");
	} else {
		$("#leftOption").addClass("toggle");
	}
}
/*#######################################
####    HTML BUILDS ~ OPEN STATUS    ####
#######################################*/
function openStatus(keepOpen) {
	////////////////////
	// TODAY OVERVIEW //
	////////////////////
	var totalConsumed = parseInt(window.localStorage.getItem("config_ttf"));
	var totalIntake   = parseInt(window.localStorage.getItem("config_kcals_day_0")) + (parseInt(window.localStorage.getItem("config_tte"))*-1);
	var totalPercent  = totalConsumed / (totalIntake / 100);
	//create empty intake html cache
	if(!window.localStorage.getItem("appStatusIntake")) {
		window.localStorage.setItem("appStatusIntake"," ");
	}
	/////////////////////////////
	// PRE-SET START/RESET BAR //
	/////////////////////////////
	var appStatusClass = "start";
	var appStatusTitle = LANG.START[lang];
	if(window.localStorage.getItem("appStatus") == "running") {
		appStatusClass = "reset"; 
		appStatusTitle = LANG.RESET[lang];
	}
	//RAW HTML
	var statusHtml = '\
	<a name="top"></a>\
	<div id="statusWrapper">\
		<div id="appStatusElapsed"><div><p></p><span></span></div>\
		<div id="elapsedIndicators"><div id="ind1"></div><div id="ind2"></div><div id="ind3"></div></div>\
		</div>\
		<div id="appStatusWeight"><div><p>' + totalConsumed + '<strong> / ' + totalIntake + ' ' + LANG.KCAL[lang] + '</strong></p><span>' + LANG.TODAY[lang] + '</span><em></em>\
		<div id="appDays">\
			<div id="appDayA">' + LANG.DAY[lang] + ' A</div>\
			<div id="appDayB">' + LANG.DAY[lang] + ' B</div>\
			<div id="appDayC">' + LANG.DAY[lang] + ' C</div>\
			<div id="appDayD">' + LANG.DAY[lang] + ' D</div>\
		</div></div></div>\
		<div id="appStatusBalance" class=" ' + window.localStorage.getItem("cssOver") + '"><div><p>' + window.localStorage.getItem("appBalance") + '</p><span>' + LANG.CALORIC_BALANCE[lang] + '</span><div id="balanceBar"></div></div></div>\
		<div id="appStatusIntake">' + window.localStorage.getItem("appStatusIntake") + '</div>\
		<div id="appStatusBars">\
			<div id="appStatusBarsPro"><p>' + LANG.PROTEINS[lang].toUpperCase() + '</p><span>0%</span></div>\
			<div id="appStatusBarsCar"><p>' + LANG.CARBS[lang].toUpperCase() + '</p><span>0%</span></div>\
			<div id="appStatusBarsFat"><p>' + LANG.FATS[lang].toUpperCase() + '</p><span>0%</span></div>\
		</div>\
		<div id="appStatusAddLeft"><div>'  + LANG.FOOD[lang]     + '</div></div>\
		<div id="appStatusAddRight"><div>' + LANG.EXERCISE[lang] + '</div></div>\
		<div id="appStatusFix">\
			<div id="startDateBar"><span id="startDateSpan"><input id="startDate" tabindex="-1" readonly /></span></div>\
			<div id="appStatusToggle"></div>\
			<div id="appStatus" class="' + appStatusClass + '">\
				<div id="appStatusTitle">' + appStatusTitle + '</div>\
				<div id="appStatusArrow"></div>\
				<div id="appStatusReload"></div>\
			</div>\
		</div>\
	</div>';
	//#////////#//
	//# OUTPUT #//
	//#////////#//
	preTab(keepOpen);
	$("#appContent").html(statusHtml);
	afterTab(keepOpen);
	////////////////
	// PRE CONFIG //
	////////////////
	//ELAPSED
	getElapsed();
	//BALANCE
	balanceMeter(timerKcals);	
	//TODAY
	$('#appStatusWeight em').css('width',totalPercent + "%");
	updateTodayOverview();
	//INTAKE
	$('#appStatusIntake div').css("padding-top", "0px");
	intakeHistory();
	//NUTRI
	updateNutriBars(window.localStorage.getItem("tPro"),window.localStorage.getItem("tCar"),window.localStorage.getItem("tFat"));
	//#//////////#//
	//# HANDLERS #//
	//#//////////#//
	//////////////////
	// ELAPSED SWAP //
	//////////////////
	$("#appStatusElapsed").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		getElapsed('next');
	});	
	////////////////
	// LIMIT MENU //
	////////////////
	$("#appStatusBalance").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }		
		getLimitMenu();
	});	
	/////////////////
	// CYCLIC MENU //
	/////////////////
	$("#appStatusWeight").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		getCyclicMenu();
	});
	//////////////////
	// HISTORY MENU //
	//////////////////
	$("#appStatusIntake").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		getFullHistory();
	});
	////////////////
	// NUTRI MENU //
	////////////////
	$("#appStatusBars").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		getNutriSliders();
	});
	//#///////////#//
	//# START BAR #//
	//#///////////#//
	$("#appStatusTitle").on(touchend,function(evt) {
		if(window.localStorage.getItem("appStatus") == "running") {
			function appReset(button) {
				//ON CONFIRM
				if(button == 1) {
					setPush();
					$("#appStatus").removeClass("reset");
					$("#appStatus").addClass("start");
					$("#appStatusTitle").html(LANG.START[lang]);
					window.localStorage.removeItem("appStatus");
					window.localStorage.setItem("config_start_time",new Date().getTime());
				}
				return false;
			}
			//SHOW DIALOG
			appConfirm(LANG.RESET_COUNTER_TITLE[lang], LANG.ARE_YOU_SURE[lang], appReset, LANG.OK[lang], LANG.CANCEL[lang]);
		} else {
			setPush();
			$("#appStatus").removeClass("start");
			$("#appStatus").addClass("reset");
			$("#appStatusTitle").html(LANG.RESET[lang]);
			window.localStorage.setItem("appStatus","running");
		}
		evt.preventDefault();
	});
	//#/////////////#//
	//# ADD BUTTONS #//
	//#/////////////#//
	$("#appStatusAddLeft").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		evt.preventDefault();
		if(!$("#pageSlideFood").hasClass("busy")) {
			window.localStorage.setItem("searchType","food");
		} else {
			//return false;
		}
		$(document).trigger("pageReload");
	});
	$("#appStatusAddRight").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		evt.preventDefault();
		if(!$("#pageSlideFood").hasClass("busy")) {
			window.localStorage.setItem("searchType","exercise");
		} else {
			//return false;
		}
		$(document).trigger("pageReload");
	});
	//#/////////////////////#//
	//# APP STATUS/DATE BAR #//
	//#/////////////////////#//	
	////////////////
	// DATEPICKER //
	////////////////
	$('#startDate').mobiscroll().datetime({
		preset: 'datetime',
		minDate: new Date((new Date().getFullYear() - 1),1,1, 0, 0), //LAST YEAR'S START
		maxDate: new Date(),
		theme: 'ios7',
		lang: 'en',
		dateFormat: 'yyyy/mm/dd',
		dateOrder:  'dd MM yy',
		timeWheels: 'HH:ii',
	    timeFormat: 'HH:ii',
		setText: LANG.OK[lang].capitalize(),
		closeText: LANG.CANCEL[lang].capitalize(),
		cancelText: LANG.CANCEL[lang].capitalize(),
		dayText: LANG.DAY[lang].capitalize(),
		monthText: LANG.MONTH[lang].capitalize(),
		yearText: LANG.YEAR[lang].capitalize(),
		hourText: LANG.HOURS[lang].capitalize(),
		minuteText: LANG.MINUTES[lang].capitalize(),
		display: 'modal',
		stepMinute: 1,
		animate: 'none',
		monthNames: LANG.MONTH_SHORT[lang].split(', '),
		monthNamesShort: LANG.MONTH_SHORT[lang].split(', '),
		mode: 'scroller',
		showLabel: true,
		useShortLabels: true
    });
	$('#startDate').on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		$('#startDate').click();
		return false;
	});
	//////////////////
	// ENABLE DEBUG //
	//////////////////	
	$("#appStatusReload").on("longhold", function(evt) {
		evt.preventDefault();		
		if(window.localStorage.getItem("config_debug") == "active") {
			window.localStorage.removeItem("config_debug");
			afterHide();
		} else {
			window.localStorage.setItem("config_debug","active");
			afterHide();
		}
		$("#appStatusReload").off();
	});
	/////////////////
	// RELOAD ICON //
	/////////////////
	$("#appStatusReload").on(tap,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		$('#startDateBar').hide();
		$("#appStatusReload").off();
		afterHide();
	});
	////////////////////
	// SHOW STARTDATE //
	////////////////////
	$("#appStatusToggle").on(tap,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if($('#appStatusFix').hasClass("open")) {
			$('#startDate').blur();
			$('#appStatusFix').removeClass("open");
		} else {
			$("#appStatusFix").addClass("open");
		}
		$('#startDate').scroller('setDate',new Date(Number(window.localStorage.getItem("config_start_time"))), true);
		return false;
	});
	// ON BLUR //
	var onChange = 0;
	$("#startDate").change(function(){
		onChange++;
	});
	$("#startDate").blur(function(){
		//write if changed
		if(onChange > 0) {
			//if not future
			if(Number(Date.parse($("#startDate").val())) < Number((new Date().getTime())) ) {
				//write input date as time
				window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val())));
			}
			setPush();
			onChange = 0;
			updateTimer();
			updateEntries();
		}
	});
	// AUTOCLOSE n' hide //
	$("#appHeader,#appContent").on(touchstart, function(evt) {
		//GLOBAL CLOSER
		if(evt.target.id == "startDate" || evt.target.id == "startDateBar" || evt.target.id == "appStatusToggle") {
			return;
		}
		//TRIGGER BLUR (SAVE) & CLOSE
		if($('#appStatusFix').hasClass("open")) {
			$('#startDate').blur();
			$('#appStatusFix').removeClass("open");
		}
	});
	//prevent keyboard
	$("#startDate").on("focus", function(evt) {
		$("#startDate").blur();
	});
}
/*############################
## HTML BUILDS ~ OPEN DIARY ##
############################*/
function openDiary(entryListHtml,keepOpen) {
	if(!entryListHtml) { return; }
	updateEntriesSum();
//RAW HTML
var diaryHtml    = "";
var lHour        = LANG.HOUR[lang];
var lHours       = LANG.HOURS[lang];
var lDay         = LANG.DAY[lang];
var lDays        = LANG.DAYS[lang];
var lAgo         = " " + LANG.AGO[lang];
var lPreAgo      = LANG.PREAGO[lang] + " ";
//android 2.x select fix
var formSelect = '<select id="entryTime" name="entryTime" tabindex="-1">\
		<option value="0">'   + LANG.NOW[lang]  +                 '</option>\
		<option value="1">'   + lPreAgo + '1 '  + lHour  + lAgo + '</option>\
		<option value="2">'   + lPreAgo + '2 '  + lHours + lAgo + '</option>\
		<option value="3">'   + lPreAgo + '3 '  + lHours + lAgo + '</option>\
		<option value="4">'   + lPreAgo + '4 '  + lHours + lAgo + '</option>\
		<option value="5">'   + lPreAgo + '5 '  + lHours + lAgo + '</option>\
		<option value="6">'   + lPreAgo + '6 '  + lHours + lAgo + '</option>\
		<option value="7">'   + lPreAgo + '7 '  + lHours + lAgo + '</option>\
		<option value="8">'   + lPreAgo + '8 '  + lHours + lAgo + '</option>\
		<option value="9">'   + lPreAgo + '9 '  + lHours + lAgo + '</option>\
		<option value="10">'  + lPreAgo + '10 ' + lHours + lAgo + '</option>\
		<option value="11">'  + lPreAgo + '11 ' + lHours + lAgo + '</option>\
		<option value="12">'  + lPreAgo + '12 ' + lHours + lAgo + '</option>\
		<option value="13">'  + lPreAgo + '13 ' + lHours + lAgo + '</option>\
		<option value="14">'  + lPreAgo + '14 ' + lHours + lAgo + '</option>\
		<option value="15">'  + lPreAgo + '15 ' + lHours + lAgo + '</option>\
		<option value="16">'  + lPreAgo + '16 ' + lHours + lAgo + '</option>\
		<option value="17">'  + lPreAgo + '17 ' + lHours + lAgo + '</option>\
		<option value="18">'  + lPreAgo + '18 ' + lHours + lAgo + '</option>\
		<option value="19">'  + lPreAgo + '19 ' + lHours + lAgo + '</option>\
		<option value="20">'  + lPreAgo + '20 ' + lHours + lAgo + '</option>\
		<option value="21">'  + lPreAgo + '21 ' + lHours + lAgo + '</option>\
		<option value="22">'  + lPreAgo + '22 ' + lHours + lAgo + '</option>\
		<option value="23">'  + lPreAgo + '23 ' + lHours + lAgo + '</option>\
		<option value="24">'  + lPreAgo + '1 '  + lDay   + lAgo + '</option>\
		<option value="48">'  + lPreAgo + '2 '  + lDays  + lAgo + '</option>\
		<option value="72">'  + lPreAgo + '3 '  + lDays  + lAgo + '</option>\
		<option value="96">'  + lPreAgo + '4 '  + lDays  + lAgo + '</option>\
		<option value="120">' + lPreAgo + '5 '  + lDays  + lAgo + '</option>\
		<option value="144">' + lPreAgo + '6 '  + lDays  + lAgo + '</option>\
		<option value="168">' + lPreAgo + '7 '  + lDays  + lAgo + '</option>\
	</select>';
diaryHtml += '\
<a name="top"></a>	\
<div id="entryListForm">\
	<div id="sliderWrapper"><input id="slider" type="range" min="-750" max="750" step="25" value="0" data-carpe-targets="entryTitle" data-carpe-decimals="0" /></div>\
	<div id="sliderNum"><input type="text" id="entryTitle" readonly value="0" />' + LANG.KCAL[lang] + '</div>\
	<div id="sliderNeg"><span></span>' + LANG.EXERCISE[lang] + '</div>\
	<div id="sliderPos">' + LANG.FOOD[lang] + '<span></span></div>\
	<input type="text" id="entryBody" placeholder="' + LANG.DESCRIPTION[lang] + '" tabindex="-1" />\
	<div id="entryBodySearch"><div></div></div>\
	' + formSelect + '\
	<div id="entrySubmit">' + LANG.ADD_ENTRY[lang] + '</div>\
</div>\
<div id="entryListWrapper">\
	<div class="heading" id="go">' + LANG.ACTIVITY_LOG[lang] + '<div id="diarySidebar"></div><div id="diaryNotes"></div></div>\
	<div id="entryList">';
//////////////////////
// CALLBACK CONTENT //
//////////////////////
diaryHtml += entryListHtml;
///////////////////
diaryHtml += '</div>\
		<div id="entryListBottomBar">' + LANG.CLEAR_ALL[lang] + '</div>\
		</div>\
	</div>\
';
//#////////#//
//# OUTPUT #//
//#////////#//
if(window.localStorage.getItem("app_last_tab") != "tab2") { return; }
//HTML
preTab(keepOpen);
pageLoad("#appContent",diaryHtml);
afterTab(keepOpen);
//desktop odd resize -1 bug
if(Math.round(window.innerWidth % 2)) {
	$("#sliderWrapper").width(window.innerWidth-49);
	$(document).trigger("sliderInit");
} else {
	$(document).trigger("sliderInit");
	//$("#sliderWrapper").width(window.innerWidth-48);
}
///////////////////////////////////////////
// ENTRYLISTWRAPPER PRE FIXED MIN-HEIGHT //
///////////////////////////////////////////
if(isMobile.iOS()) {
	var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height()-1);
} else {
	var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height());
}
$("#entryListWrapper").css("min-height",wrapperMinH + "px");
/////////////
// SIDEBAR //
/////////////
updateEntriesTime();
if(!window.localStorage.getItem('config_sidebar')) {
	window.localStorage.setItem('config_sidebar',1);
}
if(window.localStorage.getItem('config_sidebar') == 1) {
	$('body').addClass('sidebar');
} else {
	$('body').removeClass('sidebar');
}
$("#diarySidebar").on(touchstart, function(evt) {
	if(window.localStorage.getItem('config_sidebar') == 1) {
		$('body').removeClass('sidebar');
		window.localStorage.setItem('config_sidebar',0);
	} else {
		$('body').addClass('sidebar');
		window.localStorage.setItem('config_sidebar',1);
	}
	return false;
});
//#//////////#//
//# HANDLERS #//
//#//////////#//
function sliderPos() {
		//console.log("increase slider value");
		var posVal = Number($('#entryTitle').val());
		document.getElementById('slider').slider.increment(1);
		$('#entryTitle').val(posVal+1);
		$("#sliderPos").addClass("activeArrow");
		clearTimeout(loadingDivTimer);
		loadingDivTimer = setTimeout(function() {
			$("#loadingDiv").stop().fadeOut(200);
		},600);
		if($("#loadingDiv").val() != Math.round(document.getElementById('entryTitle').value)) {
			$("#loadingDiv").show();
			$("#lid").val(parseInt($("#entryTitle").val()));
		}	
}

function sliderNeg() {
		//console.log("decrease slider value");
		var negVal = Number($('#entryTitle').val());
 		document.getElementById('slider').slider.increment(-1);
		$('#entryTitle').val(negVal-1);
		$("#sliderNeg").addClass("activeArrow");
		clearTimeout(loadingDivTimer);
		loadingDivTimer = setTimeout(function() {
			$("#loadingDiv").stop().fadeOut(200);
		},600);
		if($("#loadingDiv").val() != Math.round(document.getElementById('entryTitle').value)) {
			$("#loadingDiv").show();
			$("#lid").val(parseInt($("#entryTitle").val()));
		}	
}
	///////////////////
	// ARROW BUTTONS //
	///////////////////
	$("#sliderNum").off().on(touchstart, function(evt) {
		evt.preventDefault();
		$("#entryTime").blur();
		$("#entryBody").blur();
		//console.log("reset slider value");
 		document.getElementById('slider').slider.setValue(0);
 		$("#entryTitle").val(0);
		$("#entryTitle").trigger("update");
		return false;
	});
	$("#sliderPos").off().on(touchstart, function(evt) {
		evt.preventDefault();
		sliderPos();
	});
	$("#sliderNeg").off().on(touchstart, function(evt) {
		evt.preventDefault();
		sliderNeg();
	});
	//
	$("#entryTitle").on("focus", function(evt) {
		$("#entryTitle").blur();
	});
	////////////////////////////////
	// SAVE ENTRY (SUBMIT BUTTON) //
	////////////////////////////////
	$("#entrySubmit").on(touchstart, function(evt) {
		evt.preventDefault();
		//grab values
		var title     = $("#entryTitle").val();
		var body      = $("#entryBody").val();
		var published = new Date().getTime();
		//hours ago
		if(Number($("#entryTime").val()) >= 1) {
			published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000) );
		}
		//null default values
		if(body == LANG.FOOD[lang] || body == LANG.EXERCISE[lang]) {
			body = "";
		}
		//SAVE (NOT NULL)
		if(title != 0) {
			//console.log("new entry added");
			saveEntry({title:title,body:body,published:published});
			updateEntriesSum();
		//}
		//RELOAD IF-KCALS
 			document.getElementById('slider').slider.setValue(0);
			//$("#entryTime").val('0');
			$("#entryTitle").val(0);
			$("#entryTitle").trigger("update");
			$("#entryBody").val('');
			//DISMISS KEYBOARD
			$('#entryTime').blur();
			$('#entryBody').blur();
			$('#editable').blur();
			//auto start
			function onConfirmStart(button) {
				if(button == 1) {
					window.localStorage.setItem("config_start_time",published);
					window.localStorage.setItem("appStatus","running");
					updateEntries();
					setPush();
					$("#appStatus").removeClass("start");
					$("#appStatus").addClass("reset");
					$("#appStatusTitle").html(LANG.RESET[lang]);
				}
			}
			//SHOW START DIALOG
			if(window.localStorage.getItem("appStatus") != "running") {
				appConfirm(LANG.NOT_RUNNING_TITLE[lang], LANG.NOT_RUNNING_DIALOG[lang], onConfirmStart, LANG.OK[lang], LANG.CANCEL[lang]);
			}
			//REFRESH DATA
			updateEntries(published);
			updateTimer();
			updateEntriesTime();
			setPush();
			//SCROLLBAR UPDATE			
			clearTimeout(niceTimer);
			niceTimer = setTimeout(function() {
				niceResizer();
				return false;
			}, 100);
			kickDown();
			return false;
			//dumpEntries();
			//window.scroll($('#appContent')[0].scrollTop,0,0);
			//window.onscroll(scroll($('body')[0].scrollTop,0));
			//$("#appContent").trigger("resize");
			//niceResizer();
		}
	});
	//////////////////
	// SLIDER ROUND //
	//////////////////
	function makeRound() {
		n = document.getElementById('entryTitle').value / 25;
		n = Math.round(n) * 25;
		if($("#entryTitle").val() != n) {
			//$("#entryTitle").val(n);
		}
	}
	//#//////////////////////#//
	//# SLIDER VALUE CHANGES #//
	//#//////////////////////#//
	clearTimeout(loadingDivTimer);
	$("#loadingDiv").html("<input id='lid' value='0' type='text' />");
	(function() { 
		if(!document.getElementById('entryTitle')) { return; }
		document.getElementById('entryTitle').update = function() {
			//UPDATE INPUT
			document.getElementById('entryTitle').value = document.getElementById('slider').value;

			clearTimeout(loadingDivTimer);
			loadingDivTimer = setTimeout(function() {
				$("#loadingDiv").stop().fadeOut(200);
			},600);
			if($("#loadingDiv").val() != Math.round(document.getElementById('entryTitle').value)) {
				$("#loadingDiv").show();
				$("#lid").val(parseInt($("#entryTitle").val()));
			}	
			//force reset < 25
			if(document.getElementById('entryTitle').value == -0) {
				document.getElementById('entryTitle').value = 0;
			}
			//if(!(Math.abs(document.getElementById('entryTitle').value) >= 25)) {
				//makeRound();
			//}
			////////////////////////
			// CHANGE TRACK COLOR //
			////////////////////////
			(function checkTrack() {
				if(document.getElementById('entryTitle').value == 0) {
					$('.carpe-slider-track').css("background-color", "#666");
				} else
				if(document.getElementById('entryTitle').value > 0) {
					$('.carpe-slider-track').css("background-color", "#0000dd");
				} else {
					$('.carpe-slider-track').css("background-color", "#cc3300");
				}
			})();
			/////////////////////////
			// CHANGE SUBMIT COLOR //
			/////////////////////////
			(function checkSubmit() {
				if(document.getElementById('entryTitle').value == 0) {
					if($('#entrySubmit').hasClass('submitActive')) {
						$('#entrySubmit').removeClass('submitActive');
					}
				} else
				if(!$('#entrySubmit').hasClass('submitActive')) {
					$('#entrySubmit').addClass('submitActive');
				}
			})();
			document.getElementById('entryTitle').value = Math.round(document.getElementById('entryTitle').value);
		return;
		};
	})();
	/////////////////////
	// REPEATER SHARED //
	/////////////////////
	function clearRepeater() {
		clearTimeout(pressTimerNeg);
		clearTimeout(pressTimerPos);
		clearInterval(pressRepeatNeg);
		clearInterval(pressRepeatPos);
	}
	///////////////
	// autoclear //
	///////////////
	$("#sliderPos,#sliderNeg,#sliderNum").on(touchend + " mouseout", function(evt) {
		evt.preventDefault();
		clearRepeater();
		$("#sliderPos").removeClass("activeArrow");
		$("#sliderNeg").removeClass("activeArrow");
	});
	///////////////////////
	// POSITIVE REPEATER //
	///////////////////////
	var pressTimerPos;
	var pressRepeatPos;
	$("#sliderPos").on(touchend, function(evt) {
		evt.preventDefault();
		clearRepeater();
	});
	$("#sliderPos").on(touchstart, function(evt) {
		evt.preventDefault();
		clearRepeater();
		pressTimerPos  = setTimeout(function()  {
		pressRepeatPos = setInterval(function() {
			//ACTION
			sliderPos();
			//ocument.getElementById('slider').slider.increment(1);
			//makeRound();
		},25);
		},400);
	});
	///////////////////////
	// NEGATIVE REPEATER //
	///////////////////////
	var pressTimerNeg;
	var pressRepeatNeg;
	$("#sliderNeg").on(touchend, function(evt) {
		evt.preventDefault();
		clearRepeater();
	});
	$("#sliderNeg").on(touchstart, function(evt) {
		evt.preventDefault();
		clearRepeater();
		pressTimerNeg  = setTimeout(function()  {
		pressRepeatNeg = setInterval(function() {
			//ACTION
			sliderNeg();
			//document.getElementById('slider').slider.increment(-1);
			//makeRound();
		},25);
		},400);
	});
	/////////////////////
	// NUM DE-REPEATER //
	/////////////////////
	$("#sliderNum").on(touchstart + " touchmove", function(evt) {
		evt.preventDefault();
		clearRepeater();
		//show zero-ing
		if($("#lid").val() != 0) {
			clearTimeout(loadingDivTimer);
			loadingDivTimer = setTimeout(function() {
				$("#loadingDiv").stop().fadeOut(200);
			},600);
			$("#loadingDiv").css("display","block");
			$("#lid").val(0);
		}
 		document.getElementById('slider').slider.setValue(0);
 		$("#entryTitle").val(0);
		$("#entryTitle").trigger("update");
		return false;
	});
	//////////////////
	// DEV KEYCODES //
	//////////////////
	$("#entryBody").on("keyup", function(evt) {
		if((/dev/).test($("#entryBody").val().toLowerCase())) {
			//////////
			// GOTO //
			//////////
			if ((/devgoto/).test($("#entryBody").val().toLowerCase())) {
				window.location.href = 'http://' + $("#entryBody").val().toLowerCase().split("devgoto").join('');
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			///////////
			// DEBUG //
			///////////
			if ($("#entryBody").val().toLowerCase() == "devdebug") {
				if (window.localStorage.getItem("config_debug") == "active") {
					window.localStorage.setItem("config_debug", "inactive");
					$("#entryBody").val('');
					$("#entryBody").blur();
					afterHide();
				} else {
					window.localStorage.setItem("config_debug", "active");
					$("#entryBody").val('');
					$("#entryBody").blur();
					afterHide();
				}
			}
			////////
			// DB //
			////////
			if ($("#entryBody").val().toLowerCase() == "devdb") {
				if (window.localStorage.getItem("config_nodb") == "active") {
					window.localStorage.setItem("config_nodb", "inactive");
					window.localStorage.removeItem("foodDbLoaded");
					$("#entryBody").val('');
					$("#entryBody").blur();
					afterHide();
				} else {
					window.localStorage.setItem("config_nodb", "active");
					window.localStorage.removeItem("foodDbLoaded");
					$("#entryBody").val('');
					$("#entryBody").blur();
					afterHide();
				}
			}
			////////////////
			// SET EXPIRE //
			////////////////
			if ($("#entryBody").val().toLowerCase() == "devsetexpire") {
				window.localStorage.setItem("config_mode", "expired");
				window.localStorage.setItem("config_install_time", (new Date().getTime()) - (60 * 60 * 24 * 8 * 1000));
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			///////////
			// PURGE //
			///////////
			if ($("#entryBody").val().toLowerCase() == "devpurge") {
				window.localStorage.removeItem("remoteSuperBlockJS");
				window.localStorage.removeItem("remoteSuperBlockCSS");
				window.localStorage.removeItem("app_autoupdate_hash");
				//buildRemoteSuperBlock('cached');
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			////////////
			// NOTIFY //
			////////////
			if ($("#entryBody").val().toLowerCase() == "devnotify") {
				if (window.localStorage.getItem("app_notify_update")) {
					window.localStorage.removeItem("app_notify_update");
				} else {
					window.localStorage.setItem("app_notify_update", true);
				}
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			////////////
			// HASSQL //
			////////////
			if ($("#entryBody").val().toLowerCase() == "devhassql") {
				if (hasSql == true) {
					alert('sql');
				} else {
					alert('localstorage');
				}
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			///////////
			// CLEAR //
			///////////
			if ($("#entryBody").val().toLowerCase() == "devclear") {
				window.localStorage.clear();
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			////////////
			// RELOAD //
			////////////
			if ($("#entryBody").val().toLowerCase() == "devreload") {
				window.location.reload(true);
				$("#entryBody").val('');
				$("#entryBody").blur();
			}
			////////////////
			// INSTALLPKG //
			////////////////
			if ($("#entryBody").val().toLowerCase() == "devinstallpkg") {
				if (vendorClass == "moz") {
					navigator.mozApps.install('http://kcals.net/manifest.webapp');
					$("#entryBody").val('');
					$("#entryBody").blur();
				}
			}
			/////////////////
			// INSTALLTIME //
			/////////////////
			if ($("#entryBody").val().toLowerCase() == "devinstalltime") {
				alert(dtFormat(parseInt(window.localStorage.getItem("config_install_time"))));
			}
			//////////
			// EVAL //
			//////////
			if ((/deveval/).test($("#entryBody").val().toLowerCase())) {
				if($("#entryBody").val().split("deveval").join('') != '') {
					$("#entryBody").val( $("#entryBody").val().split("deveval").join('deveva') );
					try {
						eval( $("#entryBody").val().split("deveva").join(''));
					} catch(e) {
						throw e;
					}
				}
			}
			////////////
			// REWIPE //
			////////////
			if ($("#entryBody").val().toLowerCase() == "devrewipe") {
				deSetup();
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
				return false;
			}
		}
	});
	//#///////////////#//
	//# CLEAR ALL BAR #//
	//#///////////////#//
	$("#entryListBottomBar").on(touchend, function(evt) {
		evt.preventDefault();
		//not while editing		
		if($('#entryList div').is(':animated') || $('.editableInput').is(':visible')) { return; }	
		//CLEAR DIALOG
		function onConfirmClear(button) {
			if(button == 1) {
				clearEntries();
				updateEntries();
				$(window).trigger("orientationchange");
				return false;
			}
		}
		//SHOW DIALOG
		appConfirm(LANG.CLEAR_ALL_TITLE[lang], LANG.ARE_YOU_SURE[lang], onConfirmClear, LANG.OK[lang], LANG.CANCEL[lang]);
	});
	//style
	$("#entryListBottomBar").on(touchstart,function(evt) {
		evt.preventDefault();
		$("#entryListBottomBar").addClass("activeRow");
	});
	$("#entryListBottomBar").on(touchend + " mouseout",function(evt) {
		$("#entryListBottomBar").removeClass("activeRow");
	});
	//#//////////////////#//
	//# FOOD SEARCH ICON #//
	//#//////////////////#//
	$("#entryBodySearch").on(touchstart,function(evt) {
		if($("#entryBody").is(":focus") || evt.target.id == "entryTime") {
			return;
		}
		evt.preventDefault();
		evt.stopPropagation();
		$("#editable").blur();
		$("#entryTime").blur();
		$("#entryBody").blur();
		$(document).trigger("pageReload");
	});
	///////////////////////////
	// blur edit / entrybody //
	///////////////////////////
	$('#appHeader').on(touchstart, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		$("#editable").blur();
		$("#entryTime").blur();
		$("#entryBody").blur();
	});
	$('#appHeader,#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
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
	////////////////////////
	// QUICK FOCUS INPUTS //
	////////////////////////
	$('#entryBody').on(touchstart, function(evt) {
		//allow text select
		if(isMobile.iOS && $("#entryBody").is(":focus")) {
			//evt.preventDefault();
		} else {
			//critical re-keyboarding entrybody/entrytime
			if(!isMobile.Android()) {
				evt.preventDefault();
			}
			evt.stopPropagation();
		}
		//android keyboard focus
		if(isMobile.Android) {
			$("#entryBody").focus();
		}
		if(!$("#entryBody").is(":focus") && !$(".delete").is(":visible")) {
			//ios, switch blur entrytime > entrybody || kitkat non-selectable focus
			if(isMobile.iOS()) {
				evt.preventDefault();
			}
			$("#entryBody").focus();
		}
	});
	$('#entryTime').on(touchstart, function(evt) {
			//evt.preventDefault();
			evt.stopPropagation();	
		if(!$("#entryTime").is(":focus") && !$(".delete").is(":visible")) {
			if(!isMobile.Android() && !isMobile.MSApp()) {
				evt.preventDefault();
			}
			$("#entryTime").focus();
		}
		//msapp
		//force hide keyboard
		if(isMobile.FirefoxOS()) {
			$("#entryTime").on(touchstart,function() {
				evt.preventDefault();
				$("#entryBody").blur();
			});
		}
	});
	//SUPERBORDER FOCUS (IOS)
	if(isMobile.iOS()) {
		$('#entryTime').focus(function(evt) {
			$('#entryBody').removeClass("focusMy");
			$('#entryBody').addClass("focusMe");
		});
		$('#entryBody').focus(function(evt) {
			//evt.preventDefault();
			//evt.stopPropagation();
			$('#entryBody').removeClass("focusMe");
			$('#entryBody').addClass("focusMy");
		});	
		$('#entryTime,#entryBody').blur(function(evt) {
			$('#entryBody').removeClass("focusMe");
			$('#entryBody').removeClass("focusMy");
		});
	}
	//////////////////////////////
	// FIX KEYBOARD PROPAGATION //
	//////////////////////////////
	$('#entryListForm,#go').on(touchstart, function(evt) {
		if(evt.target.id == "entryTime") {
			//$("#entryTime").focus();
		} else if(evt.target.id == "entryBody") {
			//$("#entryBody").focus();
		} else {
			if($("#entryTime").is(":focus") || $("#entryBody").is(":focus") ) {
				//block re-keyboarding on dismiss
				evt.preventDefault();
				evt.stopPropagation();
				//autoclose bug on return
				if(evt.target.id != "entryBody") {
					$("#entryBody").blur();
				}
				$("#entryTime").blur();
			}
		}
	});
	//#/////////////#//
	//# DIARY NOTES #//
	//#/////////////#//
	$('#diaryNotes').on(touchstart, function(evt) {
		//no overlap
		if($('#pageSlideFood').length || $('input,select').is(":focus") || $(".delete").hasClass("active") || $('#entryList div').is(":animated")) {
			$('#go').trigger(touchend);
			return;
		}
		//show
		$('#diaryNotesWrapper').remove();
		$('body').append("<div id='diaryNotesWrapper'><div id='diaryNotesButton'><span>" + LANG.OK[lang] + "</span></div><textarea id='diaryNotesInput'></textarea></div>");
		//load content
		if(window.localStorage.getItem("appNotes") != "") {
			$('#diaryNotesInput').val(window.localStorage.getItem("appNotes"));
		}
		//focus
		$('#diaryNotesInput').focus();
		$('#diaryNotesInput').height(window.innerHeight - 32);
		$('#diaryNotesInput').width(window.innerWidth - 24);
		$('#diaryNotesButton span').css("top",(window.innerHeight/2) + "px");
		//load scroller & set window < height
		setTimeout(function() {
			$('#diaryNotesInput').height(window.innerHeight - 32);
			if(!isMobile.Windows() && !isMobile.MSApp()) {
				$("#diaryNotesInput").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
			} else {
				$('#diaryNotesInput').css("overflow","auto");
			}
		},200);
		//cancel drag for non-overflow
		$('#diaryNotesInput').on(touchmove, function(evt) {
			if($('.nicescroll-rails').is(":visible")) { 
			//
			} else {
				evt.preventDefault();
				evt.stopPropagation();
			}
		});
		//fix android 4.4 scrolling bug
		if(isMobile.Android()) {
			$('#diaryNotesInput').on(tap, function(evt) {
				var notesScroll = $('#diaryNotesInput').scrollTop();
				//allow toolbar select
				if(Math.abs(lastScreenResize - lastScreenSize) > 48) {
					$('#diaryNotesInput').blur();
				}
				$('#diaryNotesInput').focus();
				$('#diaryNotesInput').scrollTop(notesScroll);
			});
		}
		//mostly ios focus re-scrolling fix
		$('#diaryNotesInput').on('focus', function(evt) {
			//window.scroll($('#diaryNotesInput').scrollTop,0,0);
			$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
			$("#diaryNotesInput").height(window.innerHeight - 32);
			$("#diaryNotesInput").getNiceScroll().resize();	
			setTimeout(function() {
				window.scroll($('#diaryNotesInput').scrollTop,0,0);
				//$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
				$("#diaryNotesInput").height(window.innerHeight - 32);
				$("#diaryNotesInput").getNiceScroll().resize();	
			},100);
		});
		//trigger resize (ios 7.1)
		$('#diaryNotesInput').on("blur",function(){
			$(window).trigger("resize");
		});
		$('#diaryNotesInput').on("focus",function(){
			$(window).trigger("resize");
		});		
		//keypress save
		$('#diaryNotesInput').on("keypress", function(evt) {
			window.localStorage.setItem("appNotes",$('#diaryNotesInput').val());
			$('#diaryNotesInput').height(window.innerHeight - 32);
			$("#diaryNotesInput").getNiceScroll().resize();
		});
		//closer
		$('#diaryNotesButton').on(touchstart,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			window.localStorage.setItem("appNotes",$('#diaryNotesInput').val());
			$("#diaryNotesWrapper").fadeOut(200,function() {$('#diaryNotesWrapper').remove(); });
			$("#entryListForm").prepend("<div id='sliderBlock'></div>");
			$("#sliderBlock").fadeOut(500,function() { $("#sliderBlock").remove(); });
			setPush();
		});
	});
//////////////////////
// ENDSCROLL LOADER //
//////////////////////
var topLock = 0;
var topTimer;
$('#appContent').scroll(function() {
	clearTimeout(topTimer);
	blockModal = true;
	topTimer = setTimeout(function() {
		blockModal = false;
		//
		var entryListHeight = $('#entryList').height() * 0.5;
		if(topLock != 0)                  { return; }
		if($('#go').hasClass("scrolled")) { return; }
		//console.log("scrolled: " + $('#appContent').scrollTop() + " total: " + entryListHeight);
		if($('#appContent').scrollTop()+500 > entryListHeight) {
			topLock = 1;
			$('#go').addClass("scrolled");
			updateEntries('','full');
		}
		// FIX ANDROID 2 SELECT
		android2Select();
	},300);
	});
	// FIX ANDROID 2 SELECT
	android2Select();
}
/*##############################
## HTML BUILDS ~ OPEN PROFILE ##
##############################*/
function openProfile(keepOpen) {
//RAW HTML
var profileHtml = '\
<a name="top"></a>\
<div id="calcForm">\
	<form id="formc" name="formc" action="" method="post">\
		<!--<h2>Calories Per Day Calculator</h2>-->\
		<div class="calcRow">\
			<label>' + LANG.YOUR_GENDER[lang] + '</label>\
    		<span class="selectArrow">\
				<select id="pA1B" tabindex="1" onchange="recalc_onclick(&#39;pA1B&#39;)" size="1" name="pA1B">\
					<option value="Male" selected="selected">' + LANG.MALE[lang] + '</option>\
					<option value="Female">' + LANG.FEMALE[lang] + '</option>\
				</select>\
			</span>\
		</div>\
		<div class="calcRow">\
			<label>' + LANG.YOUR_HEIGHT[lang] + '</label>\
			<input type="hidden" class="ee101" id="pA2B" tabindex="2" size="8" value="70" name="pA2B" />\
			<input type="number" tabindex="2" id="feet" name="feet" value="5"><input tabindex="2" type="number" id="inches" name="inches" value="10" size="2">\
		    <span class="selectArrow">\
				<select id="pA2C" tabindex="3" onchange="recalc_onclick(&#39;pA2C&#39;)" name="pA2C">\
					<option value="centimetres">' + LANG.CENTIMETERS[lang] + '</option>\
					<option value="inches" selected="selected">' + LANG.FEET_INCHES[lang] + '</option>\
				</select>\
			</span>\
			<input class="ee101" id="pA2D" type="hidden" readonly name="pA2D" />\
		</div>\
		<div class="calcRow">\
			<label>' + LANG.YOUR_WEIGHT[lang] + '</label>\
			<input type="number" id="pA3B" onblur="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA3B&#39;)" tabindex="4" size="8" value="160" name="pA3B" />\
		    <span class="selectArrow">\
				<select id="pA3C" tabindex="5" onchange="recalc_onclick(&#39;pA3C&#39;)" size="1" name="pA3C">\
					<option value="kilograms">' + LANG.KILOGRAMS[lang] + '</option>\
					<option value="pounds" selected="selected">' + LANG.POUNDS[lang] + '</option>\
				</select>\
			</span>\
		    <input class="ee101" id="pA3D" type="hidden" readonly size="4" value="0" name="pA3D" />\
		</div>\
		<div class="calcRow">\
			<label>' + LANG.YOUR_AGE[lang] + '</label>\
	<span class="selectArrow"><select class="ee100" id="pA4B" tabindex="6" onchange="recalc_onclick(&#39;pA4B&#39;)" size="1" name="pA4B">\
		<option value="10">10</option>\
		<option value="11">11</option>\
		<option value="12">12</option>\
		<option value="13">13</option>\
		<option value="14">14</option>\
		<option value="15">15</option>\
		<option value="16">16</option>\
		<option value="17">17</option>\
		<option value="18">18</option>\
		<option value="19">19</option>\
		<option value="20" selected="selected">20</option>\
		<option value="21">21</option>\
		<option value="22">22</option>\
		<option value="23">23</option>\
		<option value="24">24</option>\
		<option value="25">25</option>\
		<option value="26">26</option>\
		<option value="27">27</option>\
		<option value="28">28</option>\
		<option value="29">29</option>\
		<option value="30">30</option>\
		<option value="31">31</option>\
		<option value="32">32</option>\
		<option value="33">33</option>\
		<option value="34">34</option>\
		<option value="35">35</option>\
		<option value="36">36</option>\
		<option value="37">37</option>\
		<option value="38">38</option>\
		<option value="39">39</option>\
		<option value="40">40</option>\
		<option value="41">41</option>\
		<option value="42">42</option>\
		<option value="43">43</option>\
		<option value="44">44</option>\
		<option value="45">45</option>\
		<option value="46">46</option>\
		<option value="47">47</option>\
		<option value="48">48</option>\
		<option value="49">49</option>\
		<option value="50">50</option>\
		<option value="51">51</option>\
		<option value="52">52</option>\
		<option value="53">53</option>\
		<option value="54">54</option>\
		<option value="55">55</option>\
		<option value="56">56</option>\
		<option value="57">57</option>\
		<option value="58">58</option>\
		<option value="59">59</option>\
		<option value="60">60</option>\
		<option value="61">61</option>\
		<option value="62">62</option>\
		<option value="63">63</option>\
		<option value="64">64</option>\
		<option value="65">65</option>\
		<option value="66">66</option>\
		<option value="67">67</option>\
		<option value="68">68</option>\
		<option value="69">69</option>\
		<option value="70">70</option>\
		<option value="71">71</option>\
		<option value="72">72</option>\
		<option value="73">73</option>\
		<option value="74">74</option>\
		<option value="75">75</option>\
		<option value="76">76</option>\
		<option value="77">77</option>\
		<option value="78">78</option>\
		<option value="79">79</option>\
		<option value="80">80</option>\
		<option value="81">81</option>\
		<option value="82">82</option>\
		<option value="83">83</option>\
		<option value="84">84</option>\
		<option value="85">85</option>\
		<option value="86">86</option>\
		<option value="87">87</option>\
		<option value="88">88</option>\
		<option value="89">89</option>\
		<option value="90">90</option>\
		<option value="91">91</option>\
		<option value="92">92</option>\
		<option value="93">93</option>\
		<option value="94">94</option>\
		<option value="95">95</option>\
		<option value="96">96</option>\
		<option value="97">97</option>\
		<option value="98">98</option>\
		<option value="99">99</option>\
		<option value="100">100</option>\
	</select></span>\
</div>\
<div class="calcRow" id="yourActivity">\
		<label>' + LANG.YOUR_ACTIVITY[lang] + '</label>\
		<span class="selectArrow"><select id="pA5B" tabindex="7" onchange="recalc_onclick(&#39;pA5B&#39;)" size="1" name="pA5B">\
			<option selected="selected" value="Sedentary (little or no exercise, desk job)">' + LANG.YOUR_ACTIVITY_OPTION1[lang] + '</option>\
			<option value="Lightly active (light exercise/sports 1-3 days/wk)">'              + LANG.YOUR_ACTIVITY_OPTION2[lang] + '</option>\
			<option value="Moderately active (moderate exercise/sports 3-5 days/wk)">'        + LANG.YOUR_ACTIVITY_OPTION3[lang] + '</option>\
			<option value="Very active (hard exercise/sports 6-7 days/wk)">'                  + LANG.YOUR_ACTIVITY_OPTION4[lang] + '</option>\
		</select></span>\
</div>\
<div class="invisible"><input type="checkbox" checked="checked" value="ON" name="automatic_recalc" /><label>Automatic recalculation</label></div>\
<div class="invisible"><input onclick="recalc_onclick(&#39;&#39;)" type="button" value="Recalculate" name="do_recalc" id="do_recalc" /></div>\
<div class="invisible"><label>BMR</label><input class="ee101" id="pA6B" readonly size="8" value="0" name="pA6B" /></div>\
<div class="invisible"><h2>Nutrition requirements</h2></div>\
\
<h2 id="mantain"><span>A.</span> ' + LANG.KEEP_WEIGHT[lang] + '</h2>\
<div class="tapSelect"><input class="ee101" id="pA7B" readonly size="7" value="0" name="pA7B" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8B" readonly size="7" value="0" name="pA8B" />cal =<input id="pA8D" readonly size="6" value="0" name="pA8D" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9B" readonly size="7" value="0" name="pA9B" />cal =<input id="pA9D2" readonly size="6" value="0" name="pA9D" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10B" readonly size="7" value="0" name="pA10B" />cal =<input class="ee101" id="pA10D2" readonly size="6" value="0" name="pA10D" />gm</div>\
\
<h2><span>B.</span> ' + LANG.LOSE_WEIGHT[lang] + '</h2>\
<div class="calcResult">\
   <span class="selectArrow"> <select class="ee101" id="pA6G" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6G&#39;)" tabindex="8" size="1" value="1" name="pA6G">\
		<option value="0">0</option>\
		<option value="0.25">0.25</option>\
		<option value="0.5">0.5</option>\
		<option value="0.75">0.75</option>\
		<option value="1" selected="selected">1</option>\
		<option value="1.25">1.25</option>\
		<option value="1.5">1.5</option>\
		<option value="1.75">1.75</option>\
		<option value="2">2</option>\
		<option value="2.25">2.25</option>\
		<option value="2.5">2.5</option>\
		<option value="2.75">2.75</option>\
		<option value="3">3</option>\
		<option value="3.25">3.25</option>\
		<option value="3.5">3.5</option>\
		<option value="3.75">3.75</option>\
		<option value="4">4</option>\
		<option value="4.25">4.25</option>\
		<option value="4.5">4.5</option>\
		<option value="4.75">4.75</option>\
		<option value="5">5</option>\
	</select></span>\
	<input class="ee101" id="pA6J2" type="hidden" readonly size="2" value="0" name="pA6J" />\
	<span class="selectArrow"><select id="pA6H" tabindex="9" onchange="recalc_onclick(&#39;pA6H&#39;)" size="1" name="pA6H">\
		<option value="kilograms">' + LANG.KILOGRAMS[lang] + '</option>\
		<option value="pounds" selected="selected">' + LANG.POUNDS[lang] + '</option>\
	</select></span>\
	<span>' + LANG.PER_WEEK[lang] + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7F" readonly size="7" value="0" name="pA7F" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8F" readonly size="7" value="0" name="pA8F" />cal =<input class="ee101" id="pA8H2" readonly size="7" value="0" name="pA8H" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9F" readonly size="7" value="0" name="pA9F" />cal =<input class="ee101" id="pA9H2" readonly size="7" value="0" name="pA9H" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10F" readonly size="7" value="0" name="pA10F" />cal =<input class="ee101" id="pA10H2" readonly size="7" value="0" name="pA10H" />gm</div>\
\
<h2><span>C.</span> ' + LANG.GAIN_WEIGHT[lang] + '</h2>\
<div class="calcResult">\
    <span class="selectArrow"><select class="ee101" id="pA6M" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6M&#39;)" tabindex="10" size="1" value="1" name="pA6M">\
		<option value="0">0</option>\
		<option value="0.25">0.25</option>\
		<option value="0.5">0.5</option>\
		<option value="0.75">0.75</option>\
		<option value="1" selected="selected">1</option>\
		<option value="1.25">1.25</option>\
		<option value="1.5">1.5</option>\
		<option value="1.75">1.75</option>\
		<option value="2">2</option>\
		<option value="2.25">2.25</option>\
		<option value="2.5">2.5</option>\
		<option value="2.75">2.75</option>\
		<option value="3">3</option>\
		<option value="3.25">3.25</option>\
		<option value="3.5">3.5</option>\
		<option value="3.75">3.75</option>\
		<option value="4">4</option>\
		<option value="4.25">4.25</option>\
		<option value="4.5">4.5</option>\
		<option value="4.75">4.75</option>\
		<option value="5">5</option>\
	</select></span>\
	<input class="ee101" id="pA6O2" type="hidden" readonly size="2" value="0" name="pA6O" />\
	<span class="selectArrow"><select id="pA6N" tabindex="11" onchange="recalc_onclick(&#39;pA6N&#39;)" size="1" name="pA6N">\
		<option value="kilograms">' + LANG.KILOGRAMS[lang] + '</option>\
		<option value="pounds" selected="selected">' + LANG.POUNDS[lang] + '</option>\
	</select></span>\
	<span>' + LANG.PER_WEEK[lang] + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7L" readonly size="7" value="0" name="pA7L" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8L" readonly size="7" value="0" name="pA8L" />cal =<input class="ee101" id="pA8N2" readonly size="7" value="0" name="pA8N" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9L" readonly size="7" value="0" name="pA9L" />cal =<input class="ee101" id="pA9N2" readonly size="7" value="0" name="pA9N" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10L" readonly size="7" value="0" name="pA10L" />cal =<input class="ee101" id="pA10N2" readonly size="7" value="0" name="pA10N" />gm</div>\
</form>\
</div>';
/*
		<option value="100">100</option>\
	</select></span>\
</div>\
<div class="calcRow" id="yourActivity">\
		<label>' + LANG.YOUR_ACTIVITY[lang] + '</label>\
		<span class="selectArrow"><select id="pA5B" tabindex="7" onchange="recalc_onclick(&#39;pA5B&#39;)" size="1" name="pA5B">\
			<option selected="selected" value="Sedentary (little or no exercise, desk job)">' + LANG.YOUR_ACTIVITY_OPTION1[lang] + '</option>\
			<option value="Lightly active (light exercise/sports 1-3 days/wk)">'              + LANG.YOUR_ACTIVITY_OPTION2[lang] + '</option>\
			<option value="Moderately active (moderate exercise/sports 3-5 days/wk)">'        + LANG.YOUR_ACTIVITY_OPTION3[lang] + '</option>\
			<option value="Very active (hard exercise/sports 6-7 days/wk)">'                  + LANG.YOUR_ACTIVITY_OPTION4[lang] + '</option>\
		</select></span>\
</div>\
<div class="invisible"><input type="checkbox" checked="checked" value="ON" name="automatic_recalc" /><label>Automatic recalculation</label></div>\
<div class="invisible"><input onclick="recalc_onclick(&#39;&#39;)" type="button" value="Recalculate" name="do_recalc" id="do_recalc" /></div>\
<div class="invisible"><label>BMR</label><input class="ee101" id="pA6B" readonly size="8" value="0" name="pA6B" /></div>\
<div class="invisible"><h2>Nutrition requirements</h2></div>\
\
<h2 id="mantain" class="invisible hidden"><span>A.</span> ' + LANG.KEEP_WEIGHT[lang] + '</h2>\
<div class="tapSelect invisible hidden"><input class="ee101" id="pA7B" readonly size="7" value="0" name="pA7B" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8B" readonly size="7" value="0" name="pA8B" />cal =<input id="pA8D" readonly size="6" value="0" name="pA8D" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9B" readonly size="7" value="0" name="pA9B" />cal =<input id="pA9D2" readonly size="6" value="0" name="pA9D" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10B" readonly size="7" value="0" name="pA10B" />cal =<input class="ee101" id="pA10D2" readonly size="6" value="0" name="pA10D" />gm</div>\
\
<h2 class="invisible hidden"><span>B.</span> ' + LANG.LOSE_WEIGHT[lang] + '</h2>\
<div class="calcResult invisible hidden">\
   <span class="selectArrow"> <select class="ee101" id="pA6G" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6G&#39;)" tabindex="8" size="1" value="1" name="pA6G">\
		<option value="-5">-5</option>\
		<option value="-4.75">-4.75</option>\
		<option value="-4.5">-4.5</option>\
		<option value="-4.25">-4.25</option>\
		<option value="-4">-4</option>\
		<option value="-3.75">-3.75</option>\
		<option value="-3.5">-3.5</option>\
		<option value="-3.25">-3.25</option>\
		<option value="-3">-3</option>\
		<option value="-2.75">-2.75</option>\
		<option value="-2.5">-2.5</option>\
		<option value="-2.25">-2.25</option>\
		<option value="-2">-2</option>\
		<option value="-1.75">-1.75</option>\
		<option value="-1.5">-1.5</option>\
		<option value="-1.25">-1.25</option>\
		<option value="-1">-1</option>\
		<option value="-0.75">-0.75</option>\
		<option value="-0.5">-0.5</option>\
		<option value="-0.25">-0.25</option>\
		<option value="0" selected="selected">0</option>\
		<option value="0.25">+0.25</option>\
		<option value="0.5">+0.5</option>\
		<option value="0.75">+0.75</option>\
		<option value="1">+1</option>\
		<option value="1.25">+1.25</option>\
		<option value="1.5">+1.5</option>\
		<option value="1.75">+1.75</option>\
		<option value="2">+2</option>\
		<option value="2.25">+2.25</option>\
		<option value="2.5">+2.5</option>\
		<option value="2.75">+2.75</option>\
		<option value="3">+3</option>\
		<option value="3.25">+3.25</option>\
		<option value="3.5">+3.5</option>\
		<option value="3.75">+3.75</option>\
		<option value="4">+4</option>\
		<option value="4.25">+4.25</option>\
		<option value="4.5">+4.5</option>\
		<option value="4.75">+4.75</option>\
		<option value="5">+5</option>\
	</select></span>\
	<input class="ee101" id="pA6J2" type="hidden" readonly size="2" value="0" name="pA6J" />\
	<span class="selectArrow"><select id="pA6H" tabindex="9" onchange="recalc_onclick(&#39;pA6H&#39;)" size="1" name="pA6H">\
		<option value="kilograms">' + LANG.KILOGRAMS[lang] + '</option>\
		<option value="pounds" selected="selected">' + LANG.POUNDS[lang] + '</option>\
	</select></span>\
	<span>' + LANG.PER_WEEK[lang] + '</span>\
</div>\
<div class="tapSelect invisible hidden"><input class="ee101" id="pA7F" readonly size="7" value="0" name="pA7F" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8F" readonly size="7" value="0" name="pA8F" />cal =<input class="ee101" id="pA8H2" readonly size="7" value="0" name="pA8H" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9F" readonly size="7" value="0" name="pA9F" />cal =<input class="ee101" id="pA9H2" readonly size="7" value="0" name="pA9H" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10F" readonly size="7" value="0" name="pA10F" />cal =<input class="ee101" id="pA10H2" readonly size="7" value="0" name="pA10H" />gm</div>\
\
<h2><span>C.</span> ' + LANG.GAIN_WEIGHT[lang] + '</h2>\
<div class="calcResult">\
    <span class="selectArrow"><select class="ee101" id="pA6M" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6M&#39;)" tabindex="10" size="1" value="1" name="pA6M">\
		<option value="-5">-5</option>\
		<option value="-4.75">-4.75</option>\
		<option value="-4.5">-4.5</option>\
		<option value="-4.25">-4.25</option>\
		<option value="-4">-4</option>\
		<option value="-3.75">-3.75</option>\
		<option value="-3.5">-3.5</option>\
		<option value="-3.25">-3.25</option>\
		<option value="-3">-3</option>\
		<option value="-2.75">-2.75</option>\
		<option value="-2.5">-2.5</option>\
		<option value="-2.25">-2.25</option>\
		<option value="-2">-2</option>\
		<option value="-1.75">-1.75</option>\
		<option value="-1.5">-1.5</option>\
		<option value="-1.25">-1.25</option>\
		<option value="-1">-1</option>\
		<option value="-0.75">-0.75</option>\
		<option value="-0.5">-0.5</option>\
		<option value="-0.25">-0.25</option>\
		<option value="0" selected="selected">0</option>\
		<option value="0.25">+0.25</option>\
		<option value="0.5">+0.5</option>\
		<option value="0.75">+0.75</option>\
		<option value="1">+1</option>\
		<option value="1.25">+1.25</option>\
		<option value="1.5">+1.5</option>\
		<option value="1.75">+1.75</option>\
		<option value="2">+2</option>\
		<option value="2.25">+2.25</option>\
		<option value="2.5">+2.5</option>\
		<option value="2.75">+2.75</option>\
		<option value="3">+3</option>\
		<option value="3.25">+3.25</option>\
		<option value="3.5">+3.5</option>\
		<option value="3.75">+3.75</option>\
		<option value="4">+4</option>\
		<option value="4.25">+4.25</option>\
		<option value="4.5">+4.5</option>\
		<option value="4.75">+4.75</option>\
		<option value="5">+5</option>\
	</select></span>\
	<input class="ee101" id="pA6O2" type="hidden" readonly size="2" value="0" name="pA6O" />\
	<span class="selectArrow"><select id="pA6N" tabindex="11" onchange="recalc_onclick(&#39;pA6N&#39;)" size="1" name="pA6N">\
		<option value="kilograms">' + LANG.KILOGRAMS[lang] + '</option>\
		<option value="pounds" selected="selected">' + LANG.POUNDS[lang] + '</option>\
	</select></span>\
	<span>' + LANG.PER_WEEK[lang] + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7L" readonly size="7" value="0" name="pA7L" /><span class="bold">' + LANG.KCAL[lang] + ' / ' + LANG.DAY[lang] + '</span></div>\
\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8L" readonly size="7" value="0" name="pA8L" />cal =<input class="ee101" id="pA8N2" readonly size="7" value="0" name="pA8N" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9L" readonly size="7" value="0" name="pA9L" />cal =<input class="ee101" id="pA9N2" readonly size="7" value="0" name="pA9N" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10L" readonly size="7" value="0" name="pA10L" />cal =<input class="ee101" id="pA10N2" readonly size="7" value="0" name="pA10N" />gm</div>\
</form>\
</div>';
*/
//#////////#//
//# OUTPUT #//
//#////////#//
preTab(keepOpen);
$("#appContent").html(profileHtml);
afterTab(keepOpen);
//////////////////////////
// FIX ANDROID 2 SELECT //
//////////////////////////
android2Select();
var topLocko = 0;
var topTimero;
$('#appContent').scroll(function() {
	clearTimeout(topTimero);
	topTimero = setTimeout(function() {
		android2Select();
	},100);
});
//#//////////#//
//# HANDLERS #//
//#//////////#//
//enforce onchange
$("#pA2B").on("blur",function(evt) {
	$("#pA2B").val( eedisplayFloat(eeparseFloat( $(this).val() )) );
	recalc_onclick("pA2B");
	writeCalcValues();
});
$("#pA2B").on("change keypress",function(evt) {
	$("#pA2B").val( (Number($("#feet").val())*12)  +  Number($("#inches").val()) );
	writeCalcValues();
});
$("#inches").on("change keypress",function(evt) {
	$("#pA2B").val( Number(($("#feet").val()*12))  +  Number($("#inches").val()) );
	writeCalcValues();
});
$("#feet").on("change keypress",function(evt) {
	$("#pA2B").val( Number(($("#feet").val()*12))  +  Number($("#inches").val()) );
	writeCalcValues();
});
//input validate
var defaultInput = "keypress";
if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInput = "keydown"; }
$("#pA3B,#feet,#inches").on(defaultInput, function(evt) {
	//no dots
	var keyCode = (evt.which) ? evt.which : evt.keyCode;
	if(keyCode == 46) { return false; }
	if(keyCode == 8)  { return true; }
	if(keyCode == 13) { $(this).blur(); return true; }
	//max
	if(parseInt($(this).val()) > 999 || $(this).val().length > 2) {
		$(this).val( parseInt($(this).val()) );
		if(isNumberKey(evt)) {
			$(this).val( $(this).val().slice(0,-1) );
		}
	}
	//num only
	return isNumberKey(evt);
});
//place zero if empty
$("#pA3B,#feet,#inches").on("blur", function(evt) {
	if($(this).val().length == 0) {
		$(this).val('0');
	}
});
///////////////
// TAP VALUE //
///////////////
var tapVar;
$("#pA7B,#pA7F,#pA7L").on("focus", function(evt) {
	tapVar = this;
	setTimeout(function(){ if(tapVar) { tapVar.blur(); } },1);

	if(isMobile.FirefoxOS() || isMobile.MSApp() || (isMobile.Android() && androidVersion() < 4)) {
		$('body').append('<input type="number" id="dummyInput" style="opacity: 0.001;" />');
		$('#dummyInput').focus();
		$('#dummyInput').blur();
		$('#dummyInput').remove();
	}
});
$("#pA7B,#pA7F,#pA7L").on(tap, function(evt) {
	//RELOAD INFO HTML
	var calcResult = Math.round($(this).val());
	//check n'updt
	if(calcResult >= 100 && calcResult <= 9999) {
		//adjust current value
		var getKcalsKey = "config_kcals_day_0";
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				getKcalsKey = "config_kcals_day_2";
			} else {
				getKcalsKey = "config_kcals_day_1";
			}
		}
		//update db
		window.localStorage.setItem(getKcalsKey,calcResult);
		document.getElementById('editableDiv').innerHTML = window.localStorage.getItem(getKcalsKey);
		//HIGHLIGHT
		$(this).addClass("tapActive");
		$(this).stop().animate({ backgroundColor: "rgba(255,255,0,0.2)" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.2)" }, 450);
		setTimeout (function() { $("#pA7B,#pA7F,#pA7L").removeClass("tapActive"); }, 200);
		//document.getElementById('editableDiv').innerHTML = calcResult;
		//window.localStorage.setItem("config_kcals_type","simple");
		updateTimer();
	} else {
		//shake error
		$(this).addClass("tapActive");
		setTimeout (function() { $("#pA7B,#pA7F,#pA7L").removeClass("tapActive"); }, 400);
		$(this).stop().parent("div").effect("shake",{times:3,direction:'left',distance:6}, 300);
	}
	return false;
});
/*
$("#formc input,#formc select").on(tap, function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
//	$("#" + evt.target.id).focus();
});

if(isMobile.iOS()) {
	$("#formc input,#formc select").on(touchstart, function(evt) {
		if(!(evt.target.id).match(/pA7B|pA7F|pA7L/)) {
			//evt.preventDefault();
			//evt.stopPropagation();
			$(this).focus();
		}
	});
}
*/
//////////////////////////////
// BLUR ON NULL ID TOUCHEND //
//////////////////////////////
//wp8 pan (quick drop)
$("#calcForm input, #calcForm select").on("blur",function(evt) {
	if(isMobile.Windows()) {
		window.scroll($('#appContent')[0].scrollTop,0,0);
		//$('#appContent').scrollTop($('#appContent').scrollTop());
		return false;
	}
});
$("#calcForm").on(touchend, function(evt) {
	if(evt.target.id == "") {
		evt.preventDefault();
		if(isMobile.iOS()) {
			evt.stopPropagation();
		}
		//PROTECT FROM CALCULATOR BLUR SLOWDOWN
		if($("#calcForm input").is(":focus") || $("#calcForm select").is(":focus")) {
			$("#calcForm input").each(function(evt) {
				if($(this).is(":focus") && vendorClass != "moz") {
					$(this).blur();
				}
			});
			$("#calcForm select").each(function(evt) {
				if($(this).is(":focus") && vendorClass != "moz") {
					$(this).blur();
				}
			});
		}
	}
});
//////////////////////
// ONCHANGE TRIGGER //
//////////////////////
$("#formc input").on("change",function() {
	$('#do_recalc').trigger('click');	
	writeCalcValues();
	setPush();
});
$("#formc select").on("change",function() {
	$('#do_recalc').trigger('click');
	writeCalcValues();
	setPush();
});
$("#formc input").on("blur",function() {
	$('#do_recalc').trigger('click');
	writeCalcValues();
	setPush();
});
$("#formc select").on("blur",function() {
	$('#do_recalc').trigger('click');
	writeCalcValues();
	setPush();
});
//force hide keyboard 
/*
if(isMobile.FirefoxOS()) {
	//causes ficker on device
	$("#formc select").on(touchstart,function() {
		$(this).focus();
		$(this).blur();
	});
}
*/
$(document).on("hidekeyboard",function() {
		if($("#calcForm input").is(":focus") || $("#calcForm select").is(":focus")) {
			$("#calcForm input").each(function(evt) {
				if($(this).is(":focus") && vendorClass != "moz") {
					$(this).blur();
				}
			});
			$("#calcForm select").each(function(evt) {
				if($(this).is(":focus") && vendorClass != "moz") {
					$(this).blur();
				}
			});
		}
});
$("#formc input").on("keyup",function() {
	writeCalcValues();
});
///////////////////
// WRITE CHANGES //
///////////////////
function writeCalcValues() {
	var preffix = "calcForm";
	//male/female
	window.localStorage.setItem(preffix + "#pA1B",$("#pA1B").val());
	//height (hidden)
	if(!isNaN(parseInt($("#pA2B").val()))) {
		$("#pA2B").val( Math.abs(parseInt($("#pA2B").val())) );
		window.localStorage.setItem(preffix + "#pA2B",parseInt($("#pA2B").val()));
	}
	//cm/in
	window.localStorage.setItem(preffix + "#pA2C",$("#pA2C").val());
	//weight
	if(!isNaN(parseInt($("#pA3B").val()))) {
		//$("#pA3B").val( parseInt($("#pA3B").val()) );
		$("#pA3B").val( Math.abs(parseInt($("#pA3B").val())) );
		window.localStorage.setItem(preffix + "#pA3B",parseInt($("#pA3B").val()));
	}
	//kg/lb
	window.localStorage.setItem(preffix + "#pA3C",$("#pA3C").val());
	//age
	window.localStorage.setItem(preffix + "#pA4B",$("#pA4B").val());
	//activity
	window.localStorage.setItem(preffix + "#pA5B",$("#pA5B").val());
	//weight
	window.localStorage.setItem(preffix + "#pA6G",$("#pA6G").val());
	//measure
	window.localStorage.setItem(preffix + "#pA6H",$("#pA6H").val());
	//gain weight
	window.localStorage.setItem(preffix + "#pA6M",$("#pA6M").val());
	//measure
	window.localStorage.setItem(preffix + "#pA6N",$("#pA6N").val());
	//measure
	if(!isNaN(parseInt($("#feet").val()))) {
		$("#feet").val( Math.abs(parseInt($("#feet").val())) );
		window.localStorage.setItem(preffix + "#feet",parseInt($("#feet").val()));
	}
	if(!isNaN(parseInt($("#inches").val()))) {
		$("#inches").val( Math.abs(parseInt($("#inches").val())) );
		window.localStorage.setItem(preffix + "#inches",parseInt($("#inches").val()));	
	}
}
/////////////////
// LOAD VALUES //
/////////////////
function loadCalcValues() {
	var preffix = "calcForm";
	//check
	if(window.localStorage.getItem(preffix + "#pA1B")) {
		//male/female
		$("#pA1B").val(window.localStorage.getItem(preffix + "#pA1B"));
		//height
		$("#pA2B").val(window.localStorage.getItem(preffix + "#pA2B"));
		//cm/in
		$("#pA2C").val(window.localStorage.getItem(preffix + "#pA2C"));
		//weight
		$("#pA3B").val(window.localStorage.getItem(preffix + "#pA3B"));
		//kg/lb
		$("#pA3C").val(window.localStorage.getItem(preffix + "#pA3C"));
		//age
		$("#pA4B").val(window.localStorage.getItem(preffix + "#pA4B"));
		//activity
		$("#pA5B").val(window.localStorage.getItem(preffix + "#pA5B"));
		//weight
		$("#pA6G").val(window.localStorage.getItem(preffix + "#pA6G"));
		//measure
		$("#pA6H").val(window.localStorage.getItem(preffix + "#pA6H"));
		//gain weight
		$("#pA6M").val(window.localStorage.getItem(preffix + "#pA6M"));
		//measure
		$("#pA6N").val(window.localStorage.getItem(preffix + "#pA6N"));
		//measure
		$("#feet").val(window.localStorage.getItem(preffix + "#feet"));
		$("#inches").val(window.localStorage.getItem(preffix + "#inches"));	
	}
	//recalc
	$('#do_recalc').trigger('click');
}
//go
loadCalcValues();
//////////////////////
// SWAP FEET/INCHES //
//////////////////////
function feetInchesToMetric() {
	if(document.getElementById("pA2C").value == "centimetres") {
		$("#feet").val(0);
		$("#feet").removeClass("imperial");
		$("#inches").removeClass("imperial");
		$("#feet").addClass("metric");
		$("#inches").addClass("metric");
	} else {
		$("#feet").removeClass("metric");
		$("#inches").removeClass("metric");
		$("#feet").addClass("imperial");
		$("#inches").addClass("imperial");		
	}
	loadCalcValues();
}
$("#pA2C").on("change",function(evt) {
	feetInchesToMetric();
	//STARTUP FIX
	$("#feet").val(0);
	$("#pA2B").val(  Number($("#inches").val())  );
	$("#pA2B").change();
	writeCalcValues();
});
if(document.getElementById("pA2C").value == "centimetres") {
	//FIX
	$("#feet").val(0);
	$("#pA2B").val(  Number($("#inches").val())  );
	//
	$("#feet").removeClass("imperial");
	$("#inches").removeClass("imperial");
	$("#feet").addClass("metric");
	$("#inches").addClass("metric");
} else {
	$("#feet").removeClass("metric");
	$("#inches").removeClass("metric");
	$("#feet").addClass("imperial");
	$("#inches").addClass("imperial");		
}
/////////////
// ON LOAD //
/////////////
$("#pA2B").change();
	writeCalcValues();
}

