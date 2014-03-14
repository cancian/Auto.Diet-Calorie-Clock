/*########################################
####    HTML BUILDS ~ OPEN SETTINGS   ####
########################################*/
function openSettings(string) {
	//RAW HTML
	var settingsHtml = '\
	<a name="top"></a>\
	<div id="settingsWrapper">\
		<ul id="settingsList">\
			<li id="optionMeasure">\
				<div class="contentToggleTitle">\
					<p class="contentTitle" id="contentToggleTitle">' + LANG("MEASURE_SYSTEM") + '<span>' + LANG("MEASURE_SYSTEM_INFO") + '</span></p>\
					<div id="tapSwitch">\
						<div id="leftOption"><span>'  + LANG("IMPERIAL") + ' </span></div>\
						<div id="rightOption"><span>' + LANG("METRIC")   + ' </span></div>\
					</div>\
				</div>\
			</li>\
			<li id="optionFacebook"><div><p class="contentTitle">' + LANG("SETTINGS_SYNC")   + '<span>' + LANG("SETTINGS_SYNC_INFO")   + '</span></p></div></li>\
			<li id="optionReview"><div><p class="contentTitle">'   + LANG("SETTINGS_REVIEW") + '<span>' + LANG("SETTINGS_REVIEW_INFO") + '</span></p></div></li>\
			<li id="optionFeedback"><div><p class="contentTitle">' + LANG("SETTINGS_FEEDBACK") + '<span>' + LANG("SETTINGS_FEEDBACK_INFO") + '</span></p></div>\
			<li id="optionHelp"><div><p class="contentTitle">'     + LANG("SETTINGS_HELP")   + '<span>' + LANG("SETTINGS_HELP_INFO")   + '</span></p></div></li>\
		</ul>\
		<div id="optionWebsite">' + LANG("ABOUT_TITLE") + '</div>\
		<div id="optionLastSync">' + LANG("LAST_SYNC") + '<span>--</span></div>\
		<div id="optionReset">' + LANG("SETTINGS_RESET") + '</div>\
	</div>\
	';
	//<div id="optionFacebookWrapper"><div id="optionFacebook"><span>' + LANG("SETTINGS_FACEBOOK") + '</span></div></div>\
	//<li id="optionAbout"><div>'    + LANG("SETTINGS_ABOUT")    + '</div></li>\
	//<li id="optionFeedback"><div>' + LANG("SETTINGS_FEEDBACK") + '</div></li>\
	//#////////#//
	//# OUTPUT #//
	//#////////#//
	$("#appContent").html(settingsHtml);
	///////////////
	// last sync //
	///////////////
	$("#optionLastSync").on(touchend,function(evt) {
		evt.preventDefault();
		syncEntries(window.localStorage.getItem("facebook_userid"));
		return false;
	});	
	if(window.localStorage.getItem("lastSync") != "never") { $("#optionLastSync span").html(dtFormat(Number(window.localStorage.getItem("lastSync")))); }
	////////////
	// UNUSED //
	////////////
	//$("#optionWebsite").remove();
	$("#optionContact").remove();
	//$("#optionFeedback").remove();
	if(!hasTouch()) {
		$("#optionReview").remove();
	}
	////////////////
	// ACTIVE ROW //
	////////////////
	$("#optionHelp").on(touchend,function(evt) {
		$(this).addClass("activeRow");
		evt.preventDefault();
		buildHelpMenu();
		return false;
	});	
	////////////////////////
	// SETTINGS: FACEBOOK //
	////////////////////////
	$("#optionFacebook").on(touchend, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if(window.localStorage.getItem("facebook_logged")) {
			///////////////
			// LOGGED IN //
			///////////////
			// ON CONFIRM
			function onConfirmLogout(button) {
				function didUnlog() {
					setTimeout(function() { 
						NProgress.done();
						$("#optionFacebook span").html(LANG("SETTINGS_FACEBOOK"));
						window.localStorage.removeItem("facebook_logged");
						window.localStorage.removeItem("facebook_userid");
						window.localStorage.removeItem("facebook_username");	
						$("#appFooter").removeClass("appFacebook");
						$("body").removeClass("appFacebook");
					},250);
				}
				if(button == 1) {
					NProgress.start();
					FB.logout(function(response) {
						if(response.status != "connected") {
							didUnlog();
						} else {
							//agressively log out
							setTimeout(function() { onConfirmLogout(1); },500);
						}
					});
					FB.logout(function(response) {
						if(response.status != "connected") {
							didUnlog();
						} else {
							//agressively log out
							setTimeout(function() { onConfirmLogout(1); },500);
						}
					});
				}
			}
			//CONFIRM DIALOG
			if(hasTouch()) {
				navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmLogout, LANG("LOGOUT_TITLE"), [LANG("OK"),LANG("CANCEL")]);
			} else {
				if(confirm(LANG("LOGOUT_TITLE") + "\n" + LANG("ARE_YOU_SURE"))) { onConfirmLogout(1); } else { }
			}
		} else {
			////////////////
			// LOGGED OUT //
			////////////////
			if(!$("#nprogress").html()) {
				FB.login(function(response) {
					NProgress.start();
					//timeout
					setTimeout(function() { NProgress.done(); },9999);
					if(response.status == "connected") {
						//alert(JSON.stringify(response));
						//alert('done (login)!');
						FB.api('/me', function(me) {
							if(me.id && me.name) {
								var facebook_userid   = me.id;
								var facebook_username = me.name;
								window.localStorage.setItem("facebook_logged",true);
								window.localStorage.setItem("facebook_userid",facebook_userid);
								window.localStorage.setItem("facebook_username",facebook_username);	
								$("#appFooter").addClass("appFacebook");
								$("body").addClass("appFacebook");
								$("#optionFacebook span").html(LANG("SETTINGS_FACEBOOK_LOGGED") + window.localStorage.getItem("facebook_username"));
								syncEntries(window.localStorage.getItem("facebook_userid"));
							} else {
								NProgress.done();
							}
						});
					} else {
						NProgress.done();
					}
				},{ scope: "email" });
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
		$("#optionFacebook span").html(LANG("SETTINGS_FACEBOOK_LOGGED") + window.localStorage.getItem("facebook_username"));
	}
	////////////////
	// ACTIVE ROW //
	////////////////
	$("#settingsList li").on(touchstart,function(evt) {
		evt.preventDefault();
		$(this).addClass("activeRow");
		//$(this).next().addClass("nextChild");
	});
	$("#settingsList,#settingsList li").on(touchend + " mouseout",function(evt) {
		$(".activeRow").removeClass("activeRow");
		//$(".nextChild").removeClass("nextChild");
		evt.preventDefault();
	});
	////////////////////////
	// SETTINGS: FEEDBACK //
	////////////////////////
	$("#optionReview").on(touchend,function(evt) {
		if(isMobile.iOS()) {
			window.open('https://itunes.apple.com/app/mylivediet-realtime-calorie/id732382802', '_system', 'location=yes');
		} else if(isMobile.Android()) {
			window.open('https://market.android.com/details?id=com.cancian.mylivediet', '_system', 'location=yes');
		}
	});
	/////////////////////
	// SETTINGS: SHARE //
	/////////////////////
	$("li#optionReview").append('<span id="optionShare"></span>');
	//android exeption 18 bug (sql db init)
	$("#optionShare").on(touchstart + AND + touchend,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
	});
	$("#optionShare").on(touchend,function(evt) {
		if(isMobile.iOS()) {
			var shareLink = 'https://itunes.apple.com/app/mylivediet-realtime-calorie/id732382802';
			var shareOS   = 'iOS';
		} else if(isMobile.Android()) {
			var shareLink = 'https://market.android.com/details?id=com.cancian.mylivediet';
			var shareOS   = 'Android';
		} else {
			var shareLink = 'http://mylivediet.com/';
			var shareOS   = 'Web';
		}
		var params = {
			method: 'feed',
			name: 'MyLiveDiet ' + LANG("FOR") + ' ' + shareOS,
			link: shareLink,
			picture: 'http://mylivediet.com/icon.png',
			caption: LANG("CALORIE_COUNTER"),
			description: LANG("SHARE_MESSAGE")
		};
		FB.ui(params, function(obj) { CONSOLE(obj); });
		//FB.ui(params);
	});
	////////////////////////
	// SETTINGS: FEEDBACK //
	////////////////////////
	$("#optionFeedback").on(touchend,function(evt) {
		if(isMobile.iOS()) {
			var cfg = {
				task:'launchFeedback',//[launchFeedback|contactUs|viewForum|postIdea]
				site:'cancian.uservoice.com',
				key:'62oo7AhcRoQuvozU6ya6A',
				secret:'g911MyHj3qs92pDDa6f1XOgT9fHSi7pNBZoXO4E',
				topicId:0,//[0|453|333 (any valid topicId as interger)]
				showContactUs:1,//[0|1], Show/hide Contact us button
				showForum:1,//[0|1] Show/hide Forum button
				showPostIdea:1,//[0|1] Show/hide Post an idea button
				showKnowledgeBase:1//[0|1] Show/hide Search
			};
			showUserVoice(cfg);
			return false;
		} else if(isMobile.Android() && androidVersion() >= 3) {
		//} else if(isMobile.Android()) {
			window.MyCls.changeActivity();
			return false;
		} else {
			window.open('http://cancian.uservoice.com', '_system', 'location=yes');
			return false;
		}
	});	
	///////////////////////
	// SETTINGS: WEBSITE //
	///////////////////////
	$("#optionWebsite").on(tap,function(evt) {
		window.open('http://mylivediet.com', '_system', 'location=yes');
	});
	///////////////////////
	// SETTINGS: CONTACT //
	///////////////////////
	$("li#optionContact").on(touchend,function(evt) {
		window.location='mailto:support@mylivediet.com?Subject=MyLiveDiet%20-%20Support';	
	});
	/////////////////////
	// SETTINGS: ABOUT //
	/////////////////////
	$("#optionAbout").on(touchend, function(evt) {
		if(hasTouch()) {
			navigator.notification.alert(LANG("ABOUT_DIALOG"), voidThis,LANG("ABOUT_TITLE"),LANG("OK"));
		} else {
			alert(LANG("ABOUT_TITLE") + " \n" + LANG("ABOUT_DIALOG"));
			setTimeout(function() {
				//$(".nextChild").removeClass("nextChild");
				$(".activeRow").removeClass("activeRow");
			},0);
		}
	});
	////////////////////
	// SETTINGS: EDGE //
	////////////////////	
	/*
	$("#optionEdge").on("hold", function(evt) {
		//evt.preventDefault();		
		if(window.localStorage.getItem("app_last_tab") == "tab1") { return; }
		if(window.localStorage.getItem("config_debug") == "active") {
			window.localStorage.removeItem("config_debug");
			window.localStorage.setItem("app_last_tab","tab1");
			afterHide();
		} else {
			window.localStorage.setItem("config_debug","active");
			window.localStorage.setItem("app_last_tab","tab1");
			afterHide();
		}
		$("#optionEdge").off();
	});
	$("#optionEdge").on(touchend, function(evt) {
		//evt.preventDefault();
		if(window.localStorage.getItem("app_last_tab") == "tab1") { return; }
		if(window.localStorage.getItem("config_debug") == "edge") {
			window.localStorage.removeItem("config_debug");
			window.localStorage.setItem("app_last_tab","tab1");
			afterHide();
		} else {
			window.localStorage.setItem("config_debug","edge");
			window.localStorage.setItem("app_last_tab","tab1");
			afterHide();
		}
		$("#optionEdge").off();
	});
	//style
	if(window.localStorage.getItem("config_debug") == "edge") {
		$("#optionEdge").addClass("appEdge");
	}
	*/
	/////////////////////
	// SETTINGS: RESET //
	/////////////////////
	// WIPE DIALOG
	$("#optionReset").on(touchend, function(evt) {
		evt.preventDefault();
		function onConfirmWipe(button) {
			if(button == 1) {
				$("#optionReset").off();
				deSetup();
				return false;
			}
		}
		//SHOW DIALOG
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmWipe, LANG("WIPE_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
			return false;
		} else {
			if(confirm(LANG("WIPE_DIALOG"))) { onConfirmWipe(1); } else { return false; }
		}
	});
	$("#optionReset").on(touchstart,function(evt) {
		evt.preventDefault();
		$("#optionReset").addClass("activeRow");
	});
	$("#optionReset").on(touchend + " mouseout",function(evt) {
		$("#optionReset").removeClass("activeRow");
	});
	///////////////////////////
	// SETTINGS: UNIT TOGGLE //
	///////////////////////////
	$("#optionMeasure").on(touchstart,function(evt) {
		evt.preventDefault();
		//$(".nextChild").removeClass("nextChild");
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
function openStatus(string) {
	//calculate pre-fillings
	if(window.localStorage.getItem("appStatus") == "running") {
		var weightLoss   = ((((Number(window.localStorage.getItem("calcForm#pA6G"))) * ((Number(new Date().getTime()) - (Number(window.localStorage.getItem("config_start_time")))) / (60*60*24*7))) / 1000)).toFixed(7);
	} else {
		var weightLoss   = "0.0000000";		
	}
	if(window.localStorage.getItem("calcForm#pA6H") == "kilograms") {
		var weightLossUnit = "kg";
	} else {
		var weightLossUnit = "lb"; 
	}
	/////////////////////////////
	// PRE-SET START/RESET BAR //
	/////////////////////////////
	if(window.localStorage.getItem("appStatus") == "running") {
		var appStatusClass = "reset"; 
		var appStatusTitle = LANG("RESET");
	} else {
		var appStatusClass = "start";
		var appStatusTitle = LANG("START");
	}
	//RAW HTML
	var statusHtml = '\
	<a name="top"></a>\
	<div id="statusWrapper">\
		<div id="appStatusElapsed"><div><p>' + timeElapsed() + '</p><span>' + LANG("TIME_ELAPSED") + '</span></div></div>\
		<div id="appStatusWeight"><div><p><strong>' + weightLoss + '</strong>&nbsp;' + weightLossUnit + '</p><span>' + LANG("WEIGHT_LOSS") + '</span></div></div>\
		<div id="appStatusBalance" class=" ' + window.localStorage.getItem("cssOver") + '"><div><p>' + window.localStorage.getItem("appBalance") + '</p><span>' + LANG("CALORIC_BALANCE") + '</span><div id="balanceBar"></div></div></div>\
		<div id="appStatusIntake">\
	<div id="entry_f-sum"><p>' + Number(window.localStorage.getItem("config_entry_f-sum")) + '</p><span>' + LANG("FOOD")     + '</span></div>\
	<div id="entry_e-sum"><p>' + Number(window.localStorage.getItem("config_entry_e-sum")) + '</p><span>' + LANG("EXERCISE") + '</span></div>\
		</div>\
		<div id="appStatusBars">\
			<div id="appStatusBarsPro"><p>' + LANG("PROTEINS") + '</p><span>0%</span></div>\
			<div id="appStatusBarsCar"><p>' + LANG("CARBS") + '</p><span>0%</span></div>\
			<div id="appStatusBarsFat"><p>' + LANG("FATS") + '</p><span>0%</span></div>\
		</div>\
		<div id="appStatusAddLeft"><div>'  + LANG("FOOD")     + '</div></div>\
		<div id="appStatusAddRight"><div>' + LANG("EXERCISE") + '</div></div>\
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
	$("#appContent").html(statusHtml);
	balanceMeter(parseFloat($("#timerKcals").text()));
	//////////////
	// HANDLERS //
	//////////////
	//#/////////////////#//
	//# TAP STATUS TEXT #//
	//#/////////////////#//
	////////////////////////
	// NUTRITION BARS TAP //
	////////////////////////
	updateNutriBars(window.localStorage.getItem("tPro"),window.localStorage.getItem("tCar"),window.localStorage.getItem("tFat"));
	$("#appStatusBars").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		//DIALOG
		if(hasTouch()) {
			navigator.notification.alert("25% " + LANG("PROTEINS") + "\n" + "50% " + LANG("CARBS")    + "\n" + "25% " + LANG("FATS"), voidThis,LANG("STATUS_BARS").toUpperCase(),LANG("OK"));
		} else {
			alert(LANG("STATUS_BARS").toUpperCase() + ": \n" + "25% " + LANG("PROTEINS") + "\n" + "50% " + LANG("CARBS")    + "\n" + "25% " + LANG("FATS"));
		}
		return false;
	});	
	//////////////////
	// TIME ELAPSED //
	//////////////////
	$("#appStatusElapsed").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		var ELAPSED_DIALOG = LANG("BEEN_DIETING") + " " + trim(dateDiff(window.localStorage.getItem("config_start_time"),(new Date()).getTime()).replace(" " + LANG('AGO'),"")) + "";
		//DIALOG
		if(hasTouch()) {
			navigator.notification.alert(ELAPSED_DIALOG, voidThis,LANG("TIME_ELAPSED").toUpperCase(),LANG("OK"));
		} else {
			alert(LANG("TIME_ELAPSED").toUpperCase() + ": \n" + ELAPSED_DIALOG);
		}
		return false;
	});
	/////////////////
	// LOST WEIGHT //
	/////////////////
	$("#appStatusWeight").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		if(weightLossUnit == "kg") { 
			var resValue = Math.round(((Number(window.localStorage.getItem('calcForm#pA6G'))*7700)/7));
		} else { 
			var resValue = Math.round(((Number(window.localStorage.getItem('calcForm#pA6G'))*3500)/7));
		}
		var LOSS_DIALOG = LANG("STATUS_LOSS_1") + $("#appStatusWeight p").text() + "\n\n" + LANG("STATUS_LOSS_2") + resValue + " kcal/" + LANG("DAY") + ")";
		//[" + window.localStorage.getItem('calcForm#pA6G') + weightLossUnit + "/week])";
		//DIALOG
		if(hasTouch()) {
			navigator.notification.alert(LOSS_DIALOG, voidThis,LANG("WEIGHT_LOSS").toUpperCase(),LANG("OK"));
		} else {
			alert(LANG("WEIGHT_LOSS").toUpperCase() + ": \n" + LOSS_DIALOG);
		}
		return false;
	});
	//////////////////////////////
	// CALORIC STATUS (EQ TIME) //
	//////////////////////////////
	$("#appStatusBalance").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		var eqStart 	= Number(window.localStorage.getItem("config_start_time"));
		var kcalsInput = parseInt($("#timerKcals").text());
		var eqPerDay   = Number($("#editableDiv").text());
		var eqDate  	 = Number((new Date()).getTime());
		var eqRatio 	= (60*60*24 / eqPerDay);
		var eqDiff  	 = eqDate - Math.floor(Math.abs(kcalsInput*eqRatio));
		var eqTime  	 = trim(dateDiff(eqDiff*1000,eqDate*1000).replace(" " + LANG("AGO"),""));
		if(parseInt($("#timerKcals").text()) < 0) {
			var EQ_DIALOG = LANG("STATUS_EQ_TIME_1") + eqTime + LANG("STATUS_EQ_TIME_2") + Math.abs(parseInt($("#timerKcals").text())) + LANG("STATUS_EQ_TIME_3") + eqPerDay + LANG("STATUS_EQ_TIME_4");
		} else {
			var EQ_DIALOG = LANG("STATUS_EQ_TIME_5") + parseInt($("#timerKcals").text()) + LANG("STATUS_EQ_TIME_6") + eqTime + LANG("STATUS_EQ_TIME_7") + eqPerDay + LANG("STATUS_EQ_TIME_8");
		}
		//DIALOG
		if(hasTouch()) {
			navigator.notification.alert(EQ_DIALOG, voidThis,LANG("CALORIC_BALANCE").toUpperCase(),LANG("OK"));
		} else {
			alert(LANG("CALORIC_BALANCE").toUpperCase() + ": \n" + EQ_DIALOG);
		}
		return false;
	});
	///////////////////
	// INTAKE STATUS //
	///////////////////
	$("#appStatusIntake").on(touchstart,function(evt) {
		if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return false; }
		var INTAKE_DIALOG = LANG("STATUS_INTAKE_1") + Number($("#editableDiv").text()) + LANG("STATUS_INTAKE_2");
		//DIALOG
		if(hasTouch()) {
			navigator.notification.alert(INTAKE_DIALOG, voidThis,LANG("CALORIC_INTAKE").toUpperCase(),LANG("OK"));
		} else {
			alert(LANG("CALORIC_INTAKE").toUpperCase() + ": \n" + INTAKE_DIALOG);
		}
		return false;
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
					$("#appStatusTitle").html(LANG("START"));
					window.localStorage.removeItem("appStatus");
					window.localStorage.setItem("config_start_time",new Date().getTime());
				}
				return false;
			}
			//SHOW DIALOG
			if(hasTouch()) {
				navigator.notification.confirm(LANG("ARE_YOU_SURE"), appReset, LANG("RESET_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
				return false;
			} else {
				if(confirm(LANG("RESET_DIALOG"))) { appReset(1); } else { return false; }
			}
		} else {
			setPush();
			$("#appStatus").removeClass("start");
			$("#appStatus").addClass("reset");
			$("#appStatusTitle").html(LANG("RESET"));
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
		minDate: new Date((new Date().getFullYear() - 1),1,1, 0, 0), //ONE YEAR BACK
		maxDate: new Date(),
		theme: 'android-ics light',
		lang: LANG("LANGUAGE_FULL"),
		dateFormat:'yyyy/mm/dd',
		display: 'modal',
		stepMinute: 1,
		animate: 'none',
		mode: 'scroller'
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
}
/*############################
## HTML BUILDS ~ OPEN DIARY ##
############################*/
function openDiary(string) {
getEntries(function(data) {
updateEntriesSum();
//RAW HTML
var diaryHtml = ""
var lHoursAgo = LANG('HOURS_AGO');
//android 2.x select fix
var formSelect = '<select id="entryTime" name="entryTime" tabindex="-1">\
		<option value="0">' + LANG('NOW') + '</option>\
		<option value="1">1 ' + LANG('HOUR_AGO') + '</option>\
		<option value="2">2 ' + lHoursAgo + '</option>\
		<option value="3">3 ' + lHoursAgo + '</option>\
		<option value="4">4 ' + lHoursAgo + '</option>\
		<option value="5">5 ' + lHoursAgo + '</option>\
		<option value="6">6 ' + lHoursAgo + '</option>\
		<option value="7">7 ' + lHoursAgo + '</option>\
		<option value="8">8 ' + lHoursAgo + '</option>\
		<option value="9">9 ' + lHoursAgo + '</option>\
		<option value="10">10 ' + lHoursAgo + '</option>\
		<option value="11">11 ' + lHoursAgo + '</option>\
		<option value="12">12 ' + lHoursAgo + '</option>\
		<option value="13">13 ' + lHoursAgo + '</option>\
		<option value="14">14 ' + lHoursAgo + '</option>\
		<option value="15">15 ' + lHoursAgo + '</option>\
		<option value="16">16 ' + lHoursAgo + '</option>\
		<option value="17">17 ' + lHoursAgo + '</option>\
		<option value="18">18 ' + lHoursAgo + '</option>\
		<option value="19">19 ' + lHoursAgo + '</option>\
		<option value="20">20 ' + lHoursAgo + '</option>\
		<option value="21">21 ' + lHoursAgo + '</option>\
		<option value="22">22 ' + lHoursAgo + '</option>\
		<option value="23">23 ' + lHoursAgo + '</option>\
		<option value="24">1 ' + LANG('DAY_AGO') + '</option>\
		<option value="48">2 ' + LANG('DAYS_AGO') + '</option>\
		<option value="72">3 ' + LANG('DAYS_AGO') + '</option>\
	</select>';
	if(Math.floor(androidVersion()) == 2) {  
		var outerSelect = formSelect;
		var innerSelect = '';
	} else {
		var innerSelect = formSelect;
		var outerSelect = '';
	}
diaryHtml += '\
<a name="top"></a>	\
' + outerSelect + '\
<div id="entryListForm">\
	<div id="sliderWrapper"><input id="slider" type="range" min="-750" max="750" step="25" value="0" data-carpe-targets="entryTitle" data-carpe-decimals="0" /></div>\
	<div id="sliderNum"><input type="text" id="entryTitle" readonly value="0" />kcal</div>\
	<div id="sliderNeg"><span></span>' + LANG('EXERCISE') + '</div>\
	<div id="sliderPos">' + LANG('FOOD') + '<span></span></div>\
	<input type="text" id="entryBody" placeholder="' + LANG('DESCRIPTION') + '" tabindex="-1" />\
	<div id="entryBodySearch"><div></div></div>\
	' + innerSelect + '\
	<div id="entrySubmit">' + LANG('ADD_ENTRY') + '</div>\
</div>\
<div id="entryListWrapper">\
	<div class="heading" id="go">' + LANG('ACTIVITY_LOG') + '<div id="diaryNotes"></div></div>\
	<div id="entryList">';
		///////////////////////
		// updateEntries SQL //
		///////////////////////
		var s = "";
		var p = "";
		var rowClass;
		var lastRow = "";
		var lastId  = "";
		var lastPub = 0;
		var langFood = LANG("FOOD");
		var langExer = LANG("EXERCISE");
		var langDel = LANG("DELETE");
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = Number(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = Number(data[i].published);
			// 0 : 1
			if(data[i].body == "") {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
				} else {
					dataBody = "";
				}
			}
			// row colors
			var rowDate = new Date(dataPublished);
			var rowHour = rowDate.getHours();
                 if(rowHour <  6) { rowClass = "rowAfterhours"; }
			else if(rowHour < 12) { rowClass = "rowMorning";    }
			else if(rowHour < 18) { rowClass = "rowAfternoon";  }
			else if(rowHour < 24) { rowClass = "rowNight";      }

			if(dataTitle < 0)	{ rowClass = "e-" + rowClass; }
			// EXPIRED
			if(window.localStorage.getItem("config_start_time") > dataPublished) { rowClass = rowClass + " expired"; }
			// CORE OUTPUT
			//<p class='entriesId'>#" + Number(i+1) + "</p>
			var dataHandler = "\
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='entryListRow " + rowClass + " day" + dayFormat(dataPublished).split("/").join("x") + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>kcal</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
			// ROW++ (sqlish sort)
			if(lastPub > Number(data[i].published)) {
				s = s + dataHandler;
			} else {
				s = dataHandler + s;
			}
			lastPub = Number(data[i].published);
			//partial == last row time
			if(partial == Number(data[i].published)) {
				lastRow = dataHandler;
				lastId  = data[i].id;
			}
		}
	////////////////
	// UPDATE DIV //
	////////////////
		if(s == "") {
			diaryHtml += '<div id="noEntries"><span>' + LANG("NO_ENTRIES") + '</span></div>';
		} else {
			diaryHtml += s;
		}
///////////////////
diaryHtml += '</div>\
		<div id="entryListBottomBar">' + LANG("CLEAR_ALL") + '</div>\
		</div>\
	</div>\
';
//#////////#//
//# OUTPUT #//
//#////////#//
//HTML
pageLoad("#appContent",diaryHtml);
//desktop odd resize -1 bug
if(Math.round(window.innerWidth % 2)) {
	$("#sliderWrapper").width(window.innerWidth-49);
}
$(document).trigger("sliderInit");
///////////////////////////////////////////
// ENTRYLISTWRAPPER PRE FIXED MIN-HEIGHT //
///////////////////////////////////////////
if(isMobile.iOS()) {
	var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height()-1);
} else {
	var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height());
}
$("#entryListWrapper").css("min-height",wrapperMinH + "px");
//#//////////#//
//# HANDLERS #//
//#//////////#//
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
		//console.log("increase slider value");
		var posVal = Number($('#entryTitle').val());
		document.getElementById('slider').slider.increment(1);
		$('#entryTitle').val(posVal+1);
		$("#sliderPos").addClass("activeArrow");
		return false;
	});
	$("#sliderNeg").off().on(touchstart, function(evt) {
		evt.preventDefault();
		//console.log("decrease slider value");
		var negVal = Number($('#entryTitle').val());
 		document.getElementById('slider').slider.increment(-1);
		$('#entryTitle').val(negVal-1);
		$("#sliderNeg").addClass("activeArrow");
		return false;
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
		if(body == LANG("FOOD") || body == LANG("EXERCISE")) {
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
				}
			}
			//SHOW START DIALOG
			if(window.localStorage.getItem("appStatus") != "running") {
				if(hasTouch()) {
					navigator.notification.confirm(LANG("NOT_RUNNING_DIALOG"), onConfirmStart, LANG("NOT_RUNNING_TITLE"), [LANG("OK"),LANG("CANCEL")]);
				} else {
					if(confirm(LANG("NOT_RUNNING_TITLE") + "\n" + LANG("NOT_RUNNING_DIALOG"))) { onConfirmStart(1); } else { }
				}
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
	!function() { 
		if(!document.getElementById('entryTitle')) { return; }
		document.getElementById('entryTitle').update = function() {
			//UPDATE INPUT
			document.getElementById('entryTitle').value = document.getElementById('slider').value;

			clearTimeout(loadingDivTimer);
			loadingDivTimer = setTimeout(function() {
				$("#loadingDiv").stop().fadeOut(200);
			},600);
			if($("#loadingDiv").val() != Math.round(document.getElementById('entryTitle').value)) {
				$("#loadingDiv").css("display","block");
				document.getElementById('lid').value = Math.round(document.getElementById('entryTitle').value);
			}	
			//force reset < 25
			if(document.getElementById('entryTitle').value == -0) {
				document.getElementById('entryTitle').value = 0;
			}
			if(!(Math.abs(document.getElementById('entryTitle').value) >= 25)) {
				//makeRound();
			}
			////////////////////////
			// CHANGE TRACK COLOR //
			////////////////////////
			function checkTrack() {
				if(document.getElementById('entryTitle').value == 0) {
					$('.carpe-slider-track').css("background-color", "#666");
				} else
				if(document.getElementById('entryTitle').value > 0) {
					$('.carpe-slider-track').css("background-color", "#0000dd");
				} else {
					$('.carpe-slider-track').css("background-color", "#cc3300");
				}
			}
			checkTrack();
			/////////////////////////
			// CHANGE SUBMIT COLOR //
			/////////////////////////
			function checkSubmit() {
				if(document.getElementById('entryTitle').value == 0) {
					if($('#entrySubmit').hasClass('submitActive')) {
						$('#entrySubmit').removeClass('submitActive');
					}
				} else
				if(!$('#entrySubmit').hasClass('submitActive')) {
					$('#entrySubmit').addClass('submitActive');
				}
			}
			checkSubmit();
			
			document.getElementById('entryTitle').value = Math.round(document.getElementById('entryTitle').value);
		return;
		};
	}();
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
		pressTimerPos  = window.setTimeout(function()  {
		pressRepeatPos = window.setInterval(function() {
			//ACTION
			var repeatPos = document.getElementById('slider').slider.increment(1);
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
		pressTimerNeg  = window.setTimeout(function()  {
		pressRepeatNeg = window.setInterval(function() {
			//ACTION
			var repeatNeg = document.getElementById('slider').slider.increment(-1);
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
	$("#entryBody").on("keypress keyup keydown change blur focus",function(evt) {
		//DEV SET LANG
		if($("#entryBody").val().toLowerCase() == "devsetlang") {
			if(window.localStorage.getItem("devSetLang") == "pt") {
				window.localStorage.removeItem("devSetLang");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			} else {
				window.localStorage.setItem("devSetLang","pt");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			}
		}
		//DEV EDGE
		if($("#entryBody").val().toLowerCase() == "devedge") {
			if(window.localStorage.getItem("config_debug") == "edge") {
				window.localStorage.setItem("config_debug","inactive");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			} else {
				window.localStorage.setItem("config_debug","edge");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			}
		}
		//DEV DEBUG
		if($("#entryBody").val().toLowerCase() == "devdebug") {
			if(window.localStorage.getItem("config_debug") == "active") {
				window.localStorage.setItem("config_debug","inactive");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			} else {
				window.localStorage.setItem("config_debug","active");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			}
		}
		//DEV DB
		if($("#entryBody").val().toLowerCase() == "devdb") {
			window.localStorage.removeItem("foodDbLoaded");
			if(window.localStorage.getItem("config_nodb") == "active") {
				window.localStorage.setItem("config_nodb","inactive");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			} else {
				window.localStorage.setItem("config_nodb","active");
				$("#entryBody").val('');
				$("#entryBody").blur();
				afterHide();
			}
		}
		//drop food db
		if($("#entryBody").val().toLowerCase() == "devfood") {
			window.localStorage.setItem("foodDbLoaded","empty");
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//refresh
		if($("#entryBody").val().toLowerCase() == "devreload") {
			window.location='';
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//rewipe
		if($("#entryBody").val().toLowerCase() == "devrewipe") {
			//window.localStorage.clear();
			//window.localStorage.setItem("appReset","wipe");
			deSetup();
			$("#entryBody").val('');
			$("#entryBody").blur();
			afterHide();
			return false;
		}
		if($("#entryBody").val().toLowerCase() == "devshare") {
			if(isMobile.iOS()) {
				var shareLink = 'https://itunes.apple.com/app/mylivediet-realtime-calorie/id732382802';
				var shareOS   = 'iOS';
			} else if(isMobile.Android()) {
				var shareLink = 'https://market.android.com/details?id=com.cancian.mylivediet';
				var shareOS   = 'Android';
			} else {
				var shareLink = 'http://mylivediet.com/';
				var shareOS   = 'Web';
			}
			/*
			var params = {
				method: 'feed',
				name: 'MyLiveDiet ' + LANG("FOR") + ' ' + shareOS,
				link: shareLink,
				picture: 'http://mylivediet.com/icon.png',
				caption: LANG("CALORIE_COUNTER"),
				description: LANG("SHARE_MESSAGE")
			};*/
			//FB.ui(params, function(obj) { CONSOLE(obj); });
			FB.ui({
				method: 'feed',
				name: 'MyLiveDiet ' + LANG("FOR") + ' ' + shareOS,
				link: shareLink,
				picture: 'http://mylivediet.com/icon.png',
				caption: LANG("CALORIE_COUNTER"),
				description: LANG("SHARE_MESSAGE")
			});
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
	});
	//#///////////////#//
	//# CLEAR ALL BAR #//
	//#///////////////#//
	$("#entryListBottomBar").on(touchend, function(evt) {
		evt.preventDefault();
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
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmClear, LANG("CLEAR_ALL_TITLE"), [LANG("OK"),LANG("CANCEL")]);
			return false;
		} else {
			if(confirm(LANG("CLEAR_ALL_TITLE") + '\n' + LANG("ARE_YOU_SURE"))) { onConfirmClear(1); } else { return false; }
		}
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
			if(isMobile.iOS) {
				evt.preventDefault(); 
			}
			$("#entryBody").focus();
		}
	});
	$('#entryTime').on(touchstart, function(evt) {
			//evt.preventDefault();
			evt.stopPropagation();	
		
		if(!$("#entryTime").is(":focus") && !$(".delete").is(":visible")) {
			if(!isMobile.Android()) {
				evt.preventDefault();
			}
			$("#entryTime").focus();
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
		$('body').append("<div id='diaryNotesWrapper'><div id='diaryNotesButton'><span>" + LANG("NOTEPAD_DONE") + "</span></div><textarea id='diaryNotesInput'></textarea></div>");
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
			$("#diaryNotesInput").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:false});
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
			window.scroll($('#diaryNotesInput').scrollTop,0,0);
			$("#diaryNotesInput").height(window.innerHeight - 32);
			$("#diaryNotesInput").getNiceScroll().resize();	
			setTimeout(function() {
				window.scroll($('#diaryNotesInput').scrollTop,0,0);
				$("#diaryNotesInput").height(window.innerHeight - 32);
				$("#diaryNotesInput").getNiceScroll().resize();	
			},100);
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
});
}
/*##############################
## HTML BUILDS ~ OPEN PROFILE ##
##############################*/
function openProfile(string) {
//RAW HTML
var profileHtml = '\
<a name="top"></a>\
<div id="calcForm">\
	<form id="formc" name="formc" action="" method="post">\
		<!--<h2>Calories Per Day Calculator</h2>-->\
		<div class="calcRow">\
			<label>' + LANG("YOUR_GENDER") + '</label>\
    		<span class="selectArrow">\
				<select id="pA1B" tabindex="1" onchange="recalc_onclick(&#39;pA1B&#39;)" size="1" name="pA1B">\
					<option value="Male" selected="selected">' + LANG("MALE") + '</option>\
					<option value="Female">' + LANG("FEMALE") + '</option>\
				</select>\
			</span>\
		</div>\
		<div class="calcRow">\
			<label>' + LANG("YOUR_HEIGHT") + '</label>\
			<input type="hidden" class="ee101" id="pA2B" tabindex="2" size="8" value="70" name="pA2B" />\
			<input type="number" tabindex="2" id="feet" name="feet" value="5"><input tabindex="2" type="number" id="inches" name="inches" value="10" size="2">\
		    <span class="selectArrow">\
				<select id="pA2C" tabindex="3" onchange="recalc_onclick(&#39;pA2C&#39;)" name="pA2C">\
					<option value="centimetres">' + LANG("CENTIMETERS") + '</option>\
					<option value="inches" selected="selected">' + LANG("FEET_INCHES") + '</option>\
				</select>\
			</span>\
			<input class="ee101" id="pA2D" type="hidden" readonly name="pA2D" />\
		</div>\
		<div class="calcRow">\
			<label>' + LANG("YOUR_WEIGHT") + '</label>\
			<input type="number" id="pA3B" onblur="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA3B&#39;)" tabindex="4" size="8" value="160" name="pA3B" />\
		    <span class="selectArrow">\
				<select id="pA3C" tabindex="5" onchange="recalc_onclick(&#39;pA3C&#39;)" size="1" name="pA3C">\
					<option value="kilograms">' + LANG("KILOGRAMS") + '</option>\
					<option value="pounds" selected="selected">' + LANG("POUNDS") + '</option>\
				</select>\
			</span>\
		    <input class="ee101" id="pA3D" type="hidden" readonly size="4" value="0" name="pA3D" />\
		</div>\
		<div class="calcRow">\
			<label>' + LANG("YOUR_AGE") + '</label>\
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
		<label>' + LANG("YOUR_ACTIVITY") + '</label>\
		<span class="selectArrow"><select id="pA5B" tabindex="7" onchange="recalc_onclick(&#39;pA5B&#39;)" size="1" name="pA5B">\
			<option selected="selected" value="Sedentary (little or no exercise, desk job)">' + LANG("YOUR_ACTIVITY_OPTION1") + '</option>\
			<option value="Lightly active (light exercise/sports 1-3 days/wk)">'              + LANG("YOUR_ACTIVITY_OPTION2") + '</option>\
			<option value="Moderately active (moderate exercise/sports 3-5 days/wk)">'        + LANG("YOUR_ACTIVITY_OPTION3") + '</option>\
			<option value="Very active (hard exercise/sports 6-7 days/wk)">'                  + LANG("YOUR_ACTIVITY_OPTION4") + '</option>\
		</select></span>\
</div>\
<div class="invisible"><input type="checkbox" checked="checked" value="ON" name="automatic_recalc" /><label>Automatic recalculation</label></div>\
<div class="invisible"><input onclick="recalc_onclick(&#39;&#39;)" type="button" value="Recalculate" name="do_recalc" id="do_recalc" /></div>\
<div class="invisible"><label>BMR</label><input class="ee101" id="pA6B" readonly size="8" value="0" name="pA6B" /></div>\
<div class="invisible"><h2>Nutrition requirements</h2></div>\
\
<h2 id="mantain"><span>A.</span> ' + LANG("KEEP_WEIGHT") + '</h2>\
<div class="tapSelect"><input class="ee101" id="pA7B" readonly size="7" value="0" name="pA7B" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8B" readonly size="7" value="0" name="pA8B" />cal =<input id="pA8D" readonly size="6" value="0" name="pA8D" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9B" readonly size="7" value="0" name="pA9B" />cal =<input id="pA9D2" readonly size="6" value="0" name="pA9D" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10B" readonly size="7" value="0" name="pA10B" />cal =<input class="ee101" id="pA10D2" readonly size="6" value="0" name="pA10D" />gm</div>\
\
<h2><span>B.</span> ' + LANG("LOSE_WEIGHT") + '</h2>\
<div class="calcResult">\
   <span class="selectArrow"> <select class="ee101" id="pA6G" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6G&#39;)" tabindex="8" size="1" value="1" name="pA6G">\
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
		<option value="kilograms">' + LANG("KILOGRAMS") + '</option>\
		<option value="pounds" selected="selected">' + LANG("POUNDS") + '</option>\
	</select></span>\
	<span>' + LANG("PER_WEEK") + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7F" readonly size="7" value="0" name="pA7F" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8F" readonly size="7" value="0" name="pA8F" />cal =<input class="ee101" id="pA8H2" readonly size="7" value="0" name="pA8H" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9F" readonly size="7" value="0" name="pA9F" />cal =<input class="ee101" id="pA9H2" readonly size="7" value="0" name="pA9H" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10F" readonly size="7" value="0" name="pA10F" />cal =<input class="ee101" id="pA10H2" readonly size="7" value="0" name="pA10H" />gm</div>\
\
<h2><span>C.</span> ' + LANG("GAIN_WEIGHT") + '</h2>\
<div class="calcResult">\
    <span class="selectArrow"><select class="ee101" id="pA6M" onchange="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA6M&#39;)" tabindex="10" size="1" value="1" name="pA6M">\
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
		<option value="kilograms">' + LANG("KILOGRAMS") + '</option>\
		<option value="pounds" selected="selected">' + LANG("POUNDS") + '</option>\
	</select></span>\
	<span>' + LANG("PER_WEEK") + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7L" readonly size="7" value="0" name="pA7L" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8L" readonly size="7" value="0" name="pA8L" />cal =<input class="ee101" id="pA8N2" readonly size="7" value="0" name="pA8N" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9L" readonly size="7" value="0" name="pA9L" />cal =<input class="ee101" id="pA9N2" readonly size="7" value="0" name="pA9N" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10L" readonly size="7" value="0" name="pA10L" />cal =<input class="ee101" id="pA10N2" readonly size="7" value="0" name="pA10N" />gm</div>\
</form>\
</div>';
/*
		<option value="100">100</option>\
	</select></span>\
</div>\
<div class="calcRow" id="yourActivity">\
		<label>' + LANG("YOUR_ACTIVITY") + '</label>\
		<span class="selectArrow"><select id="pA5B" tabindex="7" onchange="recalc_onclick(&#39;pA5B&#39;)" size="1" name="pA5B">\
			<option selected="selected" value="Sedentary (little or no exercise, desk job)">' + LANG("YOUR_ACTIVITY_OPTION1") + '</option>\
			<option value="Lightly active (light exercise/sports 1-3 days/wk)">'              + LANG("YOUR_ACTIVITY_OPTION2") + '</option>\
			<option value="Moderately active (moderate exercise/sports 3-5 days/wk)">'        + LANG("YOUR_ACTIVITY_OPTION3") + '</option>\
			<option value="Very active (hard exercise/sports 6-7 days/wk)">'                  + LANG("YOUR_ACTIVITY_OPTION4") + '</option>\
		</select></span>\
</div>\
<div class="invisible"><input type="checkbox" checked="checked" value="ON" name="automatic_recalc" /><label>Automatic recalculation</label></div>\
<div class="invisible"><input onclick="recalc_onclick(&#39;&#39;)" type="button" value="Recalculate" name="do_recalc" id="do_recalc" /></div>\
<div class="invisible"><label>BMR</label><input class="ee101" id="pA6B" readonly size="8" value="0" name="pA6B" /></div>\
<div class="invisible"><h2>Nutrition requirements</h2></div>\
\
<h2 id="mantain" class="invisible hidden"><span>A.</span> ' + LANG("KEEP_WEIGHT") + '</h2>\
<div class="tapSelect invisible hidden"><input class="ee101" id="pA7B" readonly size="7" value="0" name="pA7B" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8B" readonly size="7" value="0" name="pA8B" />cal =<input id="pA8D" readonly size="6" value="0" name="pA8D" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9B" readonly size="7" value="0" name="pA9B" />cal =<input id="pA9D2" readonly size="6" value="0" name="pA9D" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10B" readonly size="7" value="0" name="pA10B" />cal =<input class="ee101" id="pA10D2" readonly size="6" value="0" name="pA10D" />gm</div>\
\
<h2 class="invisible hidden"><span>B.</span> ' + LANG("LOSE_WEIGHT") + '</h2>\
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
		<option value="kilograms">' + LANG("KILOGRAMS") + '</option>\
		<option value="pounds" selected="selected">' + LANG("POUNDS") + '</option>\
	</select></span>\
	<span>' + LANG("PER_WEEK") + '</span>\
</div>\
<div class="tapSelect invisible hidden"><input class="ee101" id="pA7F" readonly size="7" value="0" name="pA7F" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8F" readonly size="7" value="0" name="pA8F" />cal =<input class="ee101" id="pA8H2" readonly size="7" value="0" name="pA8H" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9F" readonly size="7" value="0" name="pA9F" />cal =<input class="ee101" id="pA9H2" readonly size="7" value="0" name="pA9H" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10F" readonly size="7" value="0" name="pA10F" />cal =<input class="ee101" id="pA10H2" readonly size="7" value="0" name="pA10H" />gm</div>\
\
<h2><span>C.</span> ' + LANG("GAIN_WEIGHT") + '</h2>\
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
		<option value="kilograms">' + LANG("KILOGRAMS") + '</option>\
		<option value="pounds" selected="selected">' + LANG("POUNDS") + '</option>\
	</select></span>\
	<span>' + LANG("PER_WEEK") + '</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7L" readonly size="7" value="0" name="pA7L" /><span class="bold">kcal / ' + LANG("DAY") + '</span></div>\
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
$("#appContent").html(profileHtml);
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
	$("#pA2B").val(  (Number($("#feet").val())*12)  +  Number($("#inches").val()) );
	writeCalcValues();
});
$("#inches").on("change keypress",function(evt) {
	$("#pA2B").val(  Number(($("#feet").val()*12))  +  Number($("#inches").val())  );
	writeCalcValues();
});
$("#feet").on("change keypress",function(evt) {
	$("#pA2B").val(  Number(($("#feet").val()*12))  +  Number($("#inches").val())  );
	writeCalcValues();
});
//input validate
$("#feet,#inches,#pA3B").on("keypress", function(evt) {
	//max
	if(parseInt($(this).val()) >= 999) {
		return false;
	}
	//num only
	return isNumberKey(evt);
});
///////////////
// TAP VALUE //
///////////////
$("#pA7B,#pA7F,#pA7L").on(tap, function(evt) {
	//RELOAD INFO HTML
	var calcResult = Math.round($(this).val());
	//check n'updt
	if(calcResult >= 100 && calcResult <= 9999) {
	//adjust current value
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		if(window.localStorage.getItem("config_kcals_day") == "d") {
			var getKcalsKey  = "config_kcals_day_2";
		} else {
			var getKcalsKey  = "config_kcals_day_1";
			}
		} else {
			var getKcalsKey  = "config_kcals_day_0";
		}
		//update db
		window.localStorage.setItem(getKcalsKey,calcResult);
		document.getElementById('editableDiv').innerHTML = window.localStorage.getItem(getKcalsKey);
		//HIGHLIGHT
		$(this).addClass("tapActive");
		$(this).stop().animate({ backgroundColor: "rgba(255,255,0,0.2)" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.2)" },450);
		setTimeout (function() { $("#pA7B,#pA7F,#pA7L").removeClass("tapActive"); } ,200);
		//document.getElementById('editableDiv').innerHTML = calcResult;
		//window.localStorage.setItem("config_kcals_type","simple");
		updateTimer();
	} else {
		//shake error
		$(this).addClass("tapActive");
		setTimeout (function() { $("#pA7B,#pA7F,#pA7L").removeClass("tapActive"); },400);
		$(this).stop().parent("div").effect("shake",{times:3,direction:'left',distance:6},300);
	}
});
$("#formc input,#formc select").on(tap, function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
//	$("#" + evt.target.id).focus();
});
//////////////////////////////
// BLUR ON NULL ID TOUCHEND //
//////////////////////////////
//wp8 pan (quick drop)
$("#calcForm input, #calcForm select").on("blur",function(evt) {
	window.scroll($('#appContent')[0].scrollTop,0,0);
	return false;
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
				if($(this).is(":focus")) {
					$(this).blur();
				}
			});
			$("#calcForm select").each(function(evt) {
				if($(this).is(":focus")) {
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
///////////////////
// WRITE CHANGES //
///////////////////
function writeCalcValues() {
	var preffix = "calcForm";
	//male/female
	window.localStorage.setItem(preffix + "#pA1B",$("#pA1B").val());
	//height
	window.localStorage.setItem(preffix + "#pA2B",$("#pA2B").val());
	//cm/in
	window.localStorage.setItem(preffix + "#pA2C",$("#pA2C").val());
	//weight
	window.localStorage.setItem(preffix + "#pA3B",parseInt($("#pA3B").val()));
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
	window.localStorage.setItem(preffix + "#feet",parseInt($("#feet").val()));
	window.localStorage.setItem(preffix + "#inches",parseInt($("#inches").val()));	
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

