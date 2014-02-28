//////////////////
// DEVICE READY //
//////////////////
$(document).ready(function() {  
	try {
		if(hasSql) {
			db = window.openDatabase(dbName, 1, dbName + "DB", -1);
			db.transaction(initDB, dbErrorHandler, startApp);
		} else {
			initDB();
			startApp();
		}
	} catch(error) {
		setTimeout(function() {
			if(window.MyReload) {
				window.MyReload.reloadActivity();
			} else {
				window.location.reload();
			}
			console.log(error);
		},1000);
	}
});
//##///////////##//
//## START APP ##//
//##///////////##//
function startApp() {
try{
////////////////
// PARSED CSS //
////////////////
$("head").prepend("<style type='text/css'> #startDateSpan:before { content: '" + LANG('START_DATE') + "'; } </style>");
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$("body").prepend('\
	<div id="appHeader"></div>\
	<div id="loadingDiv"></div>\
	<div class="editable" id="editableDiv">' + window.localStorage.getItem("config_kcals_day_0") + '</div>\
	<div id="appContent"></div>\
	<ul id="appFooter">\
		<li id="tab1">' + LANG("STATUS")   + '</li>\
		<li id="tab2">' + LANG("DIARY")    + '</li>\
		<li id="tab3">' + LANG("PROFILE")  + '</li>\
		<li id="tab4">' + LANG("SETTINGS") + '</li>\
	</ul>\
');
//#////////////////////#//
//# RESIZE/ORIENTATION #//
//#////////////////////#//
function appResizer(time) {
	setTimeout(function() {
		$('body').height(window.innerHeight);
		//unlock top white gap
		$('body').trigger("touchmove");
		//NO < 0
		var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height());
		//force scrolling ios
		if(isMobile.iOS()) { wrapperMinH = wrapperMinH + 1; }
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",wrapperMinH + "px");
		//$('#foodList').css("min-height",$('#foodList').height() + "px");
		//$('#foodList').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#foodList,#pageSlideFood').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#tabMyFoodsBlock,#tabMyExercisesBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		//chrome v32 input width
		$('#entryBody').width(window.innerWidth -58);
		$('#foodSearch').width(window.innerWidth -55);
		$("ul#addNewList input").width(window.innerWidth - 180);
		//SCROLLBAR UPDATE	
		clearTimeout(niceTimer);
		niceTimer = setTimeout(niceResizer,20);
	 },time);
}
//#////////////#//
//# APP FOOTER #//
//#////////////#//
function appFooter(id) {
	$("ul#appFooter li").removeClass("selected");
	window.localStorage.setItem("app_last_tab",id);
	$("#" + id).addClass("selected");
	//SCROLLBAR
	if(!isMobile.iOS() && androidVersion() < 4.4) {
		//$("#appContent").css("overflow","hidden");
		setTimeout(function(){
			$("#appContent").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.5,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		},0);
	}
	//ACTION
	if(id == "tab1") { openStatus();   }
	if(id == "tab2") { openDiary();    }
	if(id == "tab3") { openProfile();  }
	if(id == "tab4") { openSettings(); }
	$("body").removeClass("tab1 tab2 tab3 tab4");
	$("body").addClass(id);
	//clear pageslidefood
	if(!$("#pageSlideFood").is(":animated")) {
		$("#pageSlideFood").remove();
		$("#appHeader").removeClass("open");
	} else {
		$('#appHeader').trigger(touchstart);
	}
	//NO 50ms FLICKER (android profile)
	appResizer(200);
	updateTimer();
}
//PRELOAD TAB1
if(!window.localStorage.getItem("app_last_tab")) {
	window.localStorage.setItem("app_last_tab","tab1");
}
//READ STORED
appFooter(window.localStorage.getItem("app_last_tab"));
//LISTEN FOR CLICKS
$("ul#appFooter li").on(touchstart, function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	//not while editing
	if($("#editableInput").is(":visible")) {
		$("#editableInput").blur();
		window.scroll($('#appContent')[0].scrollTop,0,0);
		return false;
	}
	//window.location='#top';
	$('#appContent').scrollTop(0);
	appFooter($(this).attr("id"));
});
////////////////////////
// WINDOWS OVERSCROLL //
////////////////////////
if(isMobile.Windows()) {
	$("input").on("focus", function(evt) {
		$("html,body").css("position","fixed");
	});
	$("input").on("blur", function(evt) {
		$("html,body").css("position","absolute");
	});
}
/////////////////////
// KEYBOARD EVENTS //
/////////////////////
//MENU BUTTON
$(document).on("menubutton", function(evt) {
	//alert(JSON.stringify($('body')));
	evt.preventDefault();
	if($("#tempHolder").html()) { return false; }
	if(androidVersion() >= 3 && window.MyCls) {
		window.MyCls.changeActivity();
		return false;
	} else {
		if($('#pageSlideFood').hasClass("open")) {
			if(window.localStorage.getItem("foodDbLoaded") == "done") {
				$('#appHeader').trigger(touchstart);
				return false;
			}		
		} else {
			//window.open('http://cancian.uservoice.com', '_system', 'location=yes');
			$(document).trigger("pageReload");
			return false;
		}
	}
});
//BACK BUTTON
$(document).on("backbutton", function(evt) {
	if($("#tempHolder").html() && $("#spinner").html()) { return false; }
	//
	if($("#addNewCancel").length || $("#modalCancel").length) {
		$("#addNewCancel").trigger(touchstart);
		$("#modalCancel").trigger(touchstart);
	} else if($('#iconClear').is(":visible")) {
		$('#iconClear').trigger(touchstart);
	} else if($('#pageSlideFood').hasClass("open")) {
		if(window.localStorage.getItem("foodDbLoaded") == "done") {
			$('#appHeader').trigger(touchstart);
		}
	} else if($('#diaryNotesButton').length) {
		$('#diaryNotesButton').trigger(touchstart);
	} else if($('#appStatusFix').hasClass("open")) {
		$('#appStatusFix').removeClass("open");
		$("#startDate").mobiscroll('cancel');
	} else if($(".delete").hasClass("active")) {
		$('#go').trigger(tap);
	} else if($('input,select').is(":focus")) {
		$('input,select,textarea').trigger('blur');
	} else if(window.localStorage.getItem("app_last_tab") != "tab1") {
		appFooter("tab1");
	} else {
		//afterHide();
		navigator.app.exitApp();
	}
});
//FORCE SHOW KEYBOARD
$(document).on("click", function(evt) {
	if(isMobile.Android()) {
		$('#diaryNotesInput').focus();
	}
});
//ON SHOW KEYBOARD
$(document).on("showkeyboard", function(evt) {
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
});
//ON HIDE KEYBOARD
$(document).on("hidekeyboard",function() {
	window.scroll($('#appContent')[0].scrollTop,0,0);
	$('#appContent').scrollTop($('#appContent').scrollTop());
	$('#editableInput').blur();
	appResizer(100);
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
	if(initialScreenSize > $('body').height()) {
		//IOS re-scrolling bug
		$('#entryListWrapper').height( $('#entryListWrapper').height() + 1);
		$('#entryListWrapper').height( $('#entryListWrapper').height() - 1);
		appResizer(0);
	}
	//ALWAYS RESIZE NON-MOBILE BROWSER
	if(!hasTouch() && !isMobile.Android() && !isMobile.iOS() && !isMobile.Windows()) {
		appResizer(0);
	}
	//notepad (ios6 fix)(window.innerHeight)
	if($('#diaryNotesInput').is(":visible")) {
		$('#diaryNotesInput').scrollTop($('#diaryNotesInput').scrollTop());
		$("#diaryNotesInput").height(window.innerHeight - 32);
		$('#diaryNotesInput').width(window.innerWidth - 24);
		$("#diaryNotesInput").getNiceScroll().resize();	
		$('#diaryNotesButton span').css("top",(window.innerHeight/2) + "px");
	}
});
//##////////////##//
//##//  ONLOAD  ##//
//##////////////##//
appResizer(0);
/////////////////////
// DEBUG INDICATOR //
/////////////////////
if(window.localStorage.getItem("config_debug") == "active") {
	$("#appFooter").addClass("appDebug");
	$("body").addClass("appDebug");
}
if(window.localStorage.getItem("config_debug") == "edge") {
	$("#appFooter").addClass("appEdge");
	$("body").addClass("appEdge");
}
if(window.localStorage.getItem("facebook_logged")) {
	$("#appFooter").addClass("appFacebook");
	$("body").addClass("appFacebook");
}
/////////////////////
// ADJUST ELEMENTS //
/////////////////////
/*
var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
if(window.localStorage.getItem("config_kcals_type") == "cyclic")  {
	if(window.localStorage.getItem("config_kcals_day") == "d") {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
	} else {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
	}
} else {
var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
}
*/
///////////
// IOS 7 //
///////////
if(/OS [7-9](.*) like Mac OS X/i.test(navigator.userAgent)) {
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
/////////////
// WINDOWS //
/////////////
if(isMobile.Windows()) {
	$("body").addClass("windows");
}
////////////
// PINKED //
////////////
if(window.localStorage.getItem("config_pinked") == "pinked") {
	$("body").addClass("pinked");	
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
	if(LANG("LANGUAGE") == "pt") {
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
	if(opaLock < 2 && $("body").css("opacity") == 0) {
		$("body").css("opacity","1");
	}
	if(isMobile.iOS && hasTouch() && navigator.splashscreen) {
		navigator.splashscreen.hide();
	}
},999);
//updateEntries();
//updateEntriesTime();
(function startTimer() {
	if(typeof updateTimer == 'function') {
		timerPerf = (new Date().getTime());
		//CONSOLE(timerDiff,1);
		updateTimer();
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
		if(!$("#appHeader").hasClass("closer")) { return; }
		//if(!$('#pageSlideFood').hasClass("open") && $('#pageSlideFood').is(":animated")) { alert("got ya"); return; }
		//evt.preventDefault();//android kitkat focus
		//hide food
		if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy") && !$('#pageSlideFood').is(":animated")) {
			$("#foodSearch").blur();
			$('#pageSlideFood').addClass('busy');
			$('#appHeader').removeClass("open");
			$('#appHeader').removeClass("closer");
			$('#pageSlideFood').removeClass("open");
			$('#pageSlideFood').css('opacity',0);
			$('#pageSlideFood').on(transitionend,function(e) {
				$('#pageSlideFood').removeClass('busy');
				$('#appHeader').removeClass("closer");
				//WIPE ON CLOSE
				$('#pageSlideFood').remove();
				//force custom dump/save
				if(typeof updateFavList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done" && window.localStorage.getItem("facebook_logged")) {
					updateFavList();	
					updateFoodList();	
					updateExerciseList();
					setTimeout(function() { setPush(); }, 1000);
				}
			});
		}
	});
	///////////////////////////
	// blur edit / entrybody //
	/////////////////////////// BETA ~ ~ ~
	$('#appHeader,#appContent').on(touchstart, function(evt) {
		//evt.preventDefault();
		//evt.stopPropagation();
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
		//evt.stopPropagation();
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
	//////////////////////////
	// AJAX IN-PLACE EDITOR //
	//////////////////////////
	$('div.editable').on(tap, function(evt) {
		evt.preventDefault();
		//not with sidemenu
		if(!$('#pageSlideFood').hasClass('busy') && !$('#pageSlideFood').hasClass('open') && !$('#pageSlideFood').is(":animated")) {
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
			var resetValue = 2000;
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					var getKcalsKey  = "config_kcals_day_2";
					var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
					var eqPerDay     = window.localStorage.getItem("config_kcals_day_2");
				} else {
					var getKcalsKey  = "config_kcals_day_1";
					var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
					var eqPerDay     = window.localStorage.getItem("config_kcals_day_1");
					var resetValue   = 1600;
				}
			} else {
				var getKcalsKey  = "config_kcals_day_0";
				var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
				var eqPerDay     = window.localStorage.getItem("config_kcals_day_0");
			}	
			//edit...
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
						var permValue = Math.round(Number(this.value));
						window.localStorage.setItem(getKcalsKey,permValue);
						//SET CSS TRANSITION
						$('#editable').css("-webkit-transition-timing-function","ease");
						$('#editable').css("-webkit-transition-duration",".25s");
						setTimeout(function() {
							$("#editable").css("opacity","0");
							$('#editable').on(transitionend,function(e) { 
								$("#editable").remove();
								$("#editableDiv").html(window.localStorage.getItem(getKcalsKey));
								updateTimer();
								setPush();
							});
						},300);
						$("#editableBlock").remove();
					},
					change: function() {
						if(hasTap()) {
							$("#editable").blur();
						}
					},
					keypress: function(evt) {
						return isNumberKey(evt);
					}
				});
				$(this).empty();
				$(this).append(input);
				//FOCUS, THEN SET VALUE
				var editableValue = $("#editable").val();
				//slider temp blocker
				$("body").append("<div id='editableBlock'></div>");
				$("#editableBlock").css("top",$("#appHeader").height() + "px");
				//$("#editableBlock").show();
				$("#editable").focus();
				$(this).val(editableValue);
				//$("#editable").select();
			}}}}
		}
	});

} catch(e) {
	console.log(e);
	return false;
}
////#//
} //#//
////#//

