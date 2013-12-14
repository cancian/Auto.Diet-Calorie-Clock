var appVersion = "1.0.5";
////////////////////////
// DEVICE READY EVENT //
////////////////////////
//document.addEventListener('deviceready', init, false);
$(document).ready(function() {
	$("body").css("visibility","hidden");
	//console.log('deviceready');
	init();
});
function init() {
	diary = new Diary();
	diary.setup(startApp);
}
//#////////////////#//
//# CORE KICKSTART #//
//#////////////////#//
function startApp() {
//console.log("startApp()");
afterShow(700);
updateTimer();
updateEntries();
updateEntriesTime();
(function startTimer() {
	updateTimer();
	setTimeout(startTimer,99);
})();
///////////////
// ANALYTICS //
///////////////
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
	var gaPlugin;
	gaPlugin = window.plugins.gaPlugin;
	gaPlugin.init(successHandler, errorHandler, "UA-46450510-1", 10);
	function successHandler(result) {}
	function errorHandler(error)	{}
}
/////////////////////
// ADJUST ELEMENTS //
/////////////////////
if(window.localStorage.getItem("config_kcals_type") == "cyclic")  {
	if(window.localStorage.getItem("config_kcals_day") == "d") {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
	} else {
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
	}
} else {
	var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
}
$("#timer").after('<div class="editable" id="editableDiv">' + getKcalsItem + '</div>');


$('#startDateBar').prepend("<div id='appVersion'>" + appVersion + "</div>");

//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	}
};
	var scrollPad = 0;
	/////////////////
	// IOS VERSION //
	/////////////////
	if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
		$("body").addClass("ios");
		scrollPad = -1;
		
			if(/OS [1-5](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 5 //
				///////////
				//document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'none';
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//stuff...
			} else if(/OS [6](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 6 //
				///////////
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//stuff...
			} else if(/OS [7-9](.*) like Mac OS X/i.test(navigator.userAgent)) {
				///////////
				// IOS 7 //
				///////////
				document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
				//IOS7 HEIGHT FIX
				var ios7Height = "71px";
				//$('input#editable').css("top", "44px");
				//$("div#entryListFix").css("margin-top", "71px");
				//$("div#deficit,div#surplus,div#balanced").css("line-height", "83px");
				//$("div#timerFix,#timer,siv#deficit,div#surplus,div#balanced,div.editable").css("height", "71px");
				//$('div#pageSlideInfo,div#pageSlideFood,div#pageSlideCalc,div#editableBlock').css("top", "71px");
				$("body").addClass("ios7");
				//$("span#subKcalsRange").css("bottom", "42px");
				//$("span#subCurrentDay").css("bottom", "32px");
				//$("span#statusStop").css("line-height", "66px");
				//stuff...
			}
		} else {
			/////////////
			// NOT IOS //
			/////////////
			document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
			//stuff...
		}
if(hasTouch()) {
	////////////
	// MOBILE //
	////////////
	//set fixed height
	$('#entryListWrapper').css("min-height",                       ($('#afterLoad').height() - (234 + scrollPad + $('#timer').height())) + "px");
	$('#entryListScroller').css("height",                          ($('#afterLoad').height() - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",($('#afterLoad').height() - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
	/////////////
	// ANDROID //
	/////////////
	if(isMobile.Android()) {
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","absolute");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");
		$("body").addClass("android");
		//$("#iconInfo").hide();
		//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","absolute");
		//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");
		// PRELOAD SIDE MENUS
		setTimeout(function(){
			//re-set fixed height
			//$('#entryListWrapper').css("min-height",                       ($('#afterLoad').height() - (230 + $('#timer').height())) + "px");
			//$('#entryListScroller').css("height",                          ($('#afterLoad').height() - (      $('#timer').height())) + "px");
			//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",($('#afterLoad').height() - (      $('#timer').height())) + "px");
		},1000);
	}
	//////////////////
	// INTRO NOTICE //
	//////////////////
	if(window.localStorage.getItem("config_swipe_tooltip") != "seen") {
		$('#entryListForm').addClass("toolTip");
	}
}// else {
	//APP OR BROWSER
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(!app) {
	////////////////////
	// WEBKIT BROWSER //
	////////////////////
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","fixed");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");	
	//set fixed height  
	$('#entryListWrapper').css("min-height",                       ($('#afterLoad').height() - (234 + scrollPad + $('#timer').height())) + "px");
	$('#entryListScroller').css("height",                          ($('#afterLoad').height() - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",($('#afterLoad').height() - (      $('#timer').height())) + "px");
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
	//INTRO NOTICE
	if(window.localStorage.getItem("config_swipe_tooltip") != "seen") {
		$('#entryListForm').addClass("toolTip");
	}
	//$("#configNow").html($("#configNow").html().replace(LANG("RESET_COUNTER"),"<a id='mailTo' href='#'>support@mylivediet.com</a>"))
	$("#mailTo").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		window.location='mailto:support@mylivediet.com?Subject=MyLiveDiet%20-%20Support';
	});
	//APP STORE ICONS ON DESKTOP
	$('#entryListWrapper').append("<div id='appStore'><span class='ios'><img src='http://mylivediet.com/img/appstore_ios.png' /></span><span class='android'><img src='http://mylivediet.com/img/appstore_android.png' /></span></div");	
	$(".ios img").on(touchstart,function(evt) {
		window.location='https://itunes.apple.com/us/app/mylivediet-realtime-calorie/id732382802?mt=8';
	});
	$(".android img").on(touchstart,function(evt) {
		window.location='https://play.google.com/store/apps/details?id=com.cancian.mylivediet';
	});
	}
//}
// PRELOAD SIDE MENUS
setTimeout(function(){
	//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	//$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
	$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	$.get("info_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
},1000);
//$.get("food.html", function(data) { $("#pageSlideFood").html("<div id='sideMenuFood'>" + data + "</div>"); });
//#/////////////////#// tap hold singleTap doubleTap swipe swiping swipeLeft swipeRight swipeDown swipeUp
//# STATIC HANDLERS #// touchstart touchmove touchend longTap
//#/////////////////#// taphold doubleTap singleTap swipe
	//HIDE TOOLTIP //
	$("#entryListForm").on(touchstart, function(evt) {
		if($("#entryListForm").hasClass("toolTip")) {
			evt.preventDefault();
			evt.stopPropagation();
			$("#entryListForm").removeClass("toolTip");
			window.localStorage.setItem("config_swipe_tooltip","seen");
		}
	});
	///////////////////
	// ARROW BUTTONS //
	///////////////////
	$("#sliderNum").off().on(touchstart, function(evt) {
		evt.preventDefault();
		$("#entryTime").blur();
		$("#entryBody").blur();
		//console.log("reset slider value");
		var sliderNum = document.getElementById('slider').slider.resetValue();
		makeRound();
				return false;
	});
	$("#sliderPos").off().on(touchstart, function(evt) {
		evt.preventDefault();
		//console.log("increase slider value");
		var sliderPos = document.getElementById('slider').slider.increment(1);
		makeRound();
		return false;
	});
	$("#sliderNeg").off().on(touchstart, function(evt) {
		evt.preventDefault();
		//console.log("decrease slider value");
		var sliderNeg = document.getElementById('slider').slider.increment(-1);
		makeRound();
		return false;
	});
	////////////////////////////////
	// SAVE ENTRY (SUBMIT BUTTON) //
	////////////////////////////////
	$("#entrySubmit").on(touchstart, function(evt) {
		evt.preventDefault();
		makeRound();
		//grab values
		var title     = $("#entryTitle").val();
		var body      = $("#entryBody").val();
		var published = new Date().getTime();
		//hours ago
		if(Number($("#entryTime").val()) >= 1) {
			published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000) );
		}
		//SAVE (NOT NULL)
		if(title != 0) {
			//console.log("new entry added");
			diary.saveEntry({title:title,body:body,published:published});
		//}
		//RELOAD IF-KCALS
		//if(title != 0) {
			var resetSlider = document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			//DISMISS KEYBOARD
			$('#entryTime').blur();
			$('#entryBody').blur();
			$('#editable').blur();
			//REFRESH DATA
			updateEntries(published);
			updateTimer();
			updateEntriesTime();
		}
	});
	//#//////////////#//
	//# FORCE RELOAD #//
	//#//////////////#//
	$("#go").on("hold", function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
		//REFRESH DATA
		updateTimer();
		updateEntries();
		updateEntriesTime();
		//return false;
	});
	//////////////////
	// SLIDER ROUND //
	//////////////////
	function makeRound() {
		n = document.getElementById('entryTitle').value / 25;
		n = Math.round(n) * 25;
		if($("#entryTitle").val() != n) {
			$("#entryTitle").val(n);
		}
	}
	//#//////////////////////#//
	//# SLIDER VALUE CHANGES #//
	//#//////////////////////#//
	!function() {
		document.getElementById('entryTitle').update = function() {
			//UPDATE INPUT
			document.getElementById('entryTitle').value = document.getElementById('slider').value;
			//force reset < 25
			if(document.getElementById('entryTitle').value == -0) {
				document.getElementById('entryTitle').value = 0;
			}
			if(!(Math.abs(document.getElementById('entryTitle').value) >= 25)) {
				makeRound();
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
	$("#sliderPos,#sliderNeg,#sliderNum").on(touchend + "mouseout", function(evt) {
		evt.preventDefault();
		clearRepeater();
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
			makeRound();
		},275);
		},275);
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
			makeRound();
		},275);
		},275);
	});
	/////////////////////
	// NUM DE-REPEATER //
	/////////////////////
	$("#sliderNum").on(touchstart + "touchmove", function(evt) {
		evt.preventDefault();
		clearRepeater();
		var sliderNum = document.getElementById('slider').slider.resetValue();
		return false;
	});
	//#//////////////////#//
	//# BOTTOM RESET BAR #//
	//#//////////////////#//
	//LONG TAP
	$("#configNow").on("hold", function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//console.log('wipe all data');
		//CONFIRMATION DIALOG
		//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmWipe, LANG("WIPE_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
		} else {
			//if(confirm('Wipe all data?')) { onConfirmWipe(1); } else {  }
			onConfirmWipe(1);
		}
	});
	//TAP
	$("#configNow").on('singleTap', function(evt) {
		//console.log('reset timer');
		evt.preventDefault();
		evt.stopPropagation();
		//CONFIRMATION DIALOG
		//if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmReset, LANG("RESET_DIALOG") , [LANG("OK"),LANG("CANCEL")]);
		} else {
			//if(confirm('Reset counter? (set to now)')) { onConfirmReset(1); } else {  }
			onConfirmReset(1);
		}
	});
	////////////////////
	// RESET FUNCTION //
	////////////////////
	function onConfirmReset(button) {
		if(button == 1) {
			//set to now
			window.localStorage.setItem("config_start_time",Number(new Date().getTime()));
			fillDate(Number(window.localStorage.getItem("config_start_time")),'startDate');
			//reset form
			document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			//refresh timer
			updateTimer();
			updateEntries();
			updateEntriesTime();
		}
	}
	///////////////////
	// WIPE FUNCTION //
	///////////////////
	function onConfirmWipe(button) {
		if(button == 1) {
			//drop
			diary.deSetup();
			//update entrylist
			document.getElementById("entryList").style.display = 'none';
			$("#entryList").html("<div id='noEntries'><span>" + LANG('NO_ENTRIES') + "</span></div>");
			document.getElementById("entryList").style.display = 'block';
			//refresh timer
			updateTimer();
			updateEntriesTime();
			//reset form
			document.getElementById('slider').slider.resetValue();
			document.getElementById('entryBody').value = "";
			document.getElementById('entryTime').value = 0;
			window.location='#top';
		}
	}
	//////////////////
	// small tweaks //
	//////////////////
	//fixed bottom bar
	$("#configNow, #startDateBarToggle, #iconRepeatToggle").on("touchmove", function(evt) {
		evt.preventDefault();
	});
	//date fastfocus
	$('#startDate').on(tap,function(evt) {
		$('#startDate').focus();
	});
	//////////////////
	// DEV KEYCODES //
	//////////////////
	//ICONINFO GREEN
	if(window.localStorage.getItem("config_debug") == "active") {
		$("#iconInfo").css("color","#00cc00");
	}
	///////////
	// CODES //
	///////////
	$("#entryBody").keyup(function(evt) {
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
		//wipe data
		if($("#entryBody").val().toLowerCase() == "devwipe") {
			onConfirmWipe(1);
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
		//rewipe
		if($("#entryBody").val().toLowerCase() == "devrewipe") {
			onConfirmWipe(1);
			$("#entryBody").val('');
			$("#entryBody").blur();
			afterHide();
		}
		if($("#entryBody").val().toLowerCase() == "devstress") {
			stressTest.bookmarklet();
			$("#entryBody").val('');
			$("#entryBody").blur();
		}
	});
	$("#iconInfo").on("touchmove", function(evt) {
		evt.preventDefault();
	});
	$("#iconInfo").on(tap, function(evt) {
	//NATIVE USERVOICE
	if(isMobile.iOS()) {
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
				evt.preventDefault();
				evt.stopPropagation();
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
			}}
	//WEB URL
	} else {
		window.location='http://cancian.uservoice.com';
	}
		return false;
	});
	/////////////////
	// RELOAD ICON //
	/////////////////
	$("#iconRepeatToggle").on(tap, function(evt) {
		evt.preventDefault();
		//prevent click
		if(!$('#startDate').is(':visible')) {
			afterHide();
			return false;
		}
	});
	////////////////////
	// START DATE BAR //
	////////////////////
	$("#startDateBarToggle").on(tap, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//save on close click
		if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
			$('#startDate').blur();
		}
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
		//not with delete button
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			//edit...
		//PRE-FILL WITH STORED DATE
		fillDate((window.localStorage.getItem("config_start_time")),'startDate');
		//ANIMATE
		if(!$('#configNow').is(':animated')) {
			if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
			} else {
				//open and show
				$('#startDate').show();
				$('#configNow').animate({"bottom": '-48px'});
			}}
		}}}
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
			if(Number(Date.parse($("#startDate").val()) + ((((new Date($("#startDate").val())).getTimezoneOffset()) * 60 * 1000))) < Number((new Date().getTime())) ) {
				//write input date as time
				window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val()) + ((((new Date($("#startDate").val())).getTimezoneOffset()) * 60 * 1000))) );
				//window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val()) + ((((new Date()).getTimezoneOffset()) * 60 * 1000))) );
			} else {
				//REVERT TO STORED
				fillDate(Number(window.localStorage.getItem("config_start_time")),'startDate');
			}
		onChange = 0;
		updateTimer();
		updateEntries();
		//updateEntriesTime();
		}
	});
	// AUTOCLOSE n' hide //
	$("#timerTouch,#editableDiv,#entryList,#go,#entryListForm").on(tap + "swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		//save on close click
		if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
			$('#startDate').blur();
		}
		if(!$('#configNow').is(':animated')) {
			if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
			}
		}
	});
	// AUTOCLOSE WRAPPER //
	$("#entryListWrapper").on(tap, function(evt) {
		if(evt.target.id == "entryListWrapper") {
			//save on close click
			if($('#startDate').is(':visible') && Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
				$('#startDate').blur();
			}
			if(!$('#configNow').is(':animated')) {
				if(Math.round($("#configNow").css("bottom").replace("px","")) != "0") {
					$('#configNow').animate({"bottom": '0px'},function() { $('#startDate').hide(); });
				}
			}
		}
	});
	//##//////////////////////##//
	//## MISC. GESTURE EVENTS ##//
	//##//////////////////////##//
	$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').on("touchmove",function(evt) {
		//evt.preventDefault();
		evt.stopPropagation();		
	});
	//#//////////////////#//
	//# FOOD SEARCH ICON #//
	//#//////////////////#//
	$("#entryBodySearch").on(touchstart,function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from info nor calc
		if(!$("#pageSlideInfo").hasClass("open") && !$("#pageSlideCalc").hasClass("open")) {
			//hide
			if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
				$('#pageSlideFood').addClass('busy');
				$('#pageSlideFood').removeClass("open");
				$('#entryListScroller').removeClass("food");
				$('#pageSlideFood').on('webkitTransitionEnd',function(e) { $('#pageSlideFood').removeClass('busy'); /*$('#pageSlideFood').css("opacity","0");*/ $("#foodSearch").blur(); });
			} else {
				if(!$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')) {
					//load html
					//if(document.getElementById('pageSlideFood').innerHTML == "") {
						//$.get("food.html", function(data) {
							//$("#pageSlideFood").html("<div id='sideMenuFood'>" + data + "</div>"); 
							$(document).trigger("pageReload");
						//});
					//}
					//show
					$("#entryBody").blur();
					$("#entryTime").blur();
					//$('#pageSlideFood').css("opacity",".925");
					$('#pageSlideFood').addClass('busy');
					$('#pageSlideFood').addClass("open");
					$('#entryListScroller').addClass("food");
					$('#pageSlideFood').on('webkitTransitionEnd',function(e) { $('#pageSlideFood').removeClass('busy'); });
				}}
			}}
		}}
	});
	////////////////////
	// READ INFO.HTML //
	////////////////////
	//$("#timerTouch,#editableDiv").on("swipeRight", function(evt) {
	$("#timerTouch, #editableDiv").swipe({
	swipe:function(evt,direction) {
	if(direction == 'right') {
		evt.preventDefault();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from calc
		if(!$("#pageSlideCalc").hasClass("open")) {
			//hide
			if($('#pageSlideInfo').hasClass("open") && !$('#pageSlideInfo').hasClass("busy")) {
				$('#pageSlideInfo').addClass("busy");
				$('#pageSlideInfo').removeClass("open");
				$('#entryListScroller').removeClass("info");
				$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy'); $("#CyclicInput1").blur(); $("#CyclicInput2").blur(); });
				//wipe tmp
				//$("#pageSlideInfo").html('');
			} else {
				if(!$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')  && !$('#pageSlideFood').hasClass('open')) {
					//load html
					if(document.getElementById('pageSlideInfo').innerHTML == "") {
						//$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) {
						$.get("info_" + LANG("LANGUAGE") + ".html", function(data) {
							$("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>");
						});
					}
					//show
					$('#pageSlideInfo').addClass("open");
					$('#entryListScroller').addClass("info");
					$('#pageSlideInfo').addClass('busy');
					$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy');
						//INTRO TOOLTIP
						window.localStorage.setItem("config_swipe_tooltip","seen");
						$('#entryListForm').removeClass("toolTip");
					});
				}}
			}}
		}}
	//});
	////////////////////
	// READ CALC.HTML //
	////////////////////
	//$("#timerTouch,#editableDiv").on("swipeLeft", function(evt) {
	} else if(direction == 'left') {
		evt.preventDefault();
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') ) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
		//no overlap from info
		if(!$("#pageSlideInfo").hasClass("open")) {
			//hide
			if($('#pageSlideCalc').hasClass("open") && !$('#pageSlideCalc').hasClass("busy")) {
				$('#pageSlideCalc').addClass('busy');
				$('#pageSlideCalc').removeClass("open");
				$('#entryListScroller').removeClass("calc");
				$('#pageSlideCalc').on('webkitTransitionEnd',function(e) { $('#pageSlideCalc').removeClass('busy'); $("*").blur(); });
			} else {
				if(!$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')  && !$('#pageSlideFood').hasClass('open')) {
					//load html
					if(document.getElementById('pageSlideCalc').innerHTML == "") {
						//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) {
						$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) {
							$("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>");
						});
					}
					//show
					$('#pageSlideCalc').addClass('busy');
					$('#pageSlideCalc').addClass("open");
					$('#entryListScroller').addClass("calc");
					$('#pageSlideCalc').on('webkitTransitionEnd',function(e) { $('#pageSlideCalc').removeClass('busy'); });
					}}
				}}
			}}
		}}
	});
	$("#timerTouch, #editableDiv").swipe("option", "threshold", 20);
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$("#timerTouch,#editableDiv").on(tap + "swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		//hide info
		if($('#pageSlideInfo').hasClass("open") && !$('#pageSlideInfo').hasClass("busy")) {
			$('#pageSlideInfo').addClass('busy');
			$('#pageSlideInfo').removeClass("open");
			$('#entryListScroller').removeClass("info");
			$('#pageSlideInfo').on('webkitTransitionEnd',function(e) { $('#pageSlideInfo').removeClass('busy'); $("#CyclicInput1").blur(); $("#CyclicInput2").blur(); });
			//wipe tmp
			//$("#pageSlideInfo").html('');
		}
		//hide calc
		if($('#pageSlideCalc').hasClass("open") && !$('#pageSlideCalc').hasClass("busy")) {
			$('#pageSlideCalc').addClass('busy');
			$('#pageSlideCalc').removeClass("open");
			$('#entryListScroller').removeClass("calc");
			$('#pageSlideCalc').on('webkitTransitionEnd',function(e) {
				$('#pageSlideCalc').removeClass('busy'); 
				//WIPE ON CLOSE
				if(!$('#pageSlideCalc').hasClass("open")) {
					$('#pageSlideCalc').html('');
					//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
					$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
				}
			});
		}
		//hide food
		if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
			$("#foodSearch").blur();
			$('#pageSlideFood').addClass('busy');
			$('#pageSlideFood').removeClass("open");
			$('#entryListScroller').removeClass("food");
			$('#pageSlideFood').on('webkitTransitionEnd',function(e) {
				$('#pageSlideFood').removeClass('busy'); 
				//WIPE ON CLOSE
				if(!$('#pageSlideFood').hasClass("open")) {
					$('#pageSlideFood').removeClass('busy');
					//$('#pageSlideFood').css("opacity","0");
				}
			});
		}
	});
	//////////////////////////
	// AJAX IN-PLACE EDITOR //
	//////////////////////////
	$('div.editable').on(tap, function(evt) {
		evt.preventDefault();
		//not with sidemenu
		if(!$('#pageSlideInfo').hasClass('busy') && !$('#pageSlideCalc').hasClass('busy') && !$('#pageSlideFood').hasClass('busy')) {
		//not while editing
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') ) {
		//not with delete button
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
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
				var value = $(this).html();
				var input = $('<input/>', {
					'type':'number',
					'id':'editable',
					'class':'editable',
					'value': Number(value),
					//ONCHANGE HANDLER
					blur: function() {
						var new_value = Math.ceil($(this).val());
						//NULL-MIN-MAX
						if(isNaN( $(this).val()) || $(this).val() == 0 || $(this).val() <= 1)    { this.value = resetValue; document.getElementById('editableDiv').innerHTML = resetValue; }
						if(this.value < 500 && !isNaN(this.value) && this.value > 1)             { this.value = 500;  document.getElementById('editableDiv').innerHTML = 500;  }
						if(this.value > 9999)													{ this.value = 9999; document.getElementById('editableDiv').innerHTML = 9999; }
						//filter zeros
						this.value = Math.round(Number(this.value));
						document.getElementById('editableDiv').innerHTML = this.value;
						//IF ENTERED VALUE WAS OK, PASS IT
						window.localStorage.setItem(getKcalsKey,$(this).val());
						//IF MAIN VALUE IS SOMESHOW STILL BOGUS, RESET BOTH TO 2000
						if(isNaN(window.localStorage.getItem(getKcalsKey)) || window.localStorage.getItem(getKcalsKey) == 0 || window.localStorage.getItem(getKcalsKey) < 1) {
							window.localStorage.setItem(getKcalsKey,resetValue);
							document.getElementById('editableDiv').innerHTML = window.localStorage.getItem(getKcalsKey);
						}
						$(this).replaceWith(new_value);
						//update info inputs
						$("#CyclicInput1").val(window.localStorage.getItem("config_kcals_day_1"));
						$("#CyclicInput2").val(window.localStorage.getItem("config_kcals_day_2"));
						//WRITE TO DB
						window.localStorage.setItem(getKcalsKey,$(this).val());
						updateTimer();
						updateEntriesTime();
						$("#editableBlock").hide();
					},
					change: function() {
						$("#editable").blur();
					},
					keypress: function(evt) {
					return isNumberKey(evt);
					}
				});
				$(this).empty();
				$(this).append(input);
				//FOCUS, THEN SET VALUE
				var editableValue = $("#editable").val();
				$("#editableBlock").show();
				$("#editable").focus();
				$(this).val(editableValue);
				$("#editable").select();
			}}}}
		}
	});
	// blur edit / entrybody
	$('#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
		evt.preventDefault();
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
	// timer blur
	$('#timerTouch').on(touchstart, function(evt) {
	//	evt.preventDefault();
		if($(this).attr("id") == "timerTouch") {
			$("#editable").blur();
			$("#entryTime").blur();
			$("#entryBody").blur();
		}
	});
	////////////////////////
	// QUICK FOCUS INPUTS //
	////////////////////////
	$('#entryBody').on(touchstart, function(evt) {
		//evt.preventDefault();
		evt.stopPropagation();
		//android keyboard focus
		$("#entryBody").focus();		
		if(!$("#entryBody").is(":focus") && !$(".delete").is(":visible")) {
			evt.preventDefault();
			$("#entryBody").focus();
		}
	});
	$('#entryTime').on(touchstart, function(evt) {
		if(!$("#entryTime").is(":focus") && !$(".delete").is(":visible")) {
			evt.preventDefault();
			$("#entryTime").focus();
		}
	});
	//SUPERBORDER FOCUS
	$('#entryTime').focus(function(evt) {
		$('#entryBody').removeClass("focusMy");
		$('#entryBody').addClass("focusMe");
	});
	$('#entryBody').focus(function(evt) {
		//evt.preventDefault();
		//evt.stopPropagation();
		//evt.stopImmediatePropagation();
		$('#entryBody').removeClass("focusMe");
		$('#entryBody').addClass("focusMy");
	});	
	$('#entryTime,#entryBody').blur(function(evt) {
		$('#entryBody').removeClass("focusMe");
		$('#entryBody').removeClass("focusMy");
	});
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
	//#///////////////#//
	//# RESIZE SLIDER #//
	//#///////////////#//
	function adjustPos(t) {
		var carpeTimer;
		function carpeLoad() {
			clearTimeout(carpeTimer);
			$('#sliderNum').css("left",((Number($(".carpe-slider-knob").css("left").replace("px",""))) - (22)) + "px");
		}
		function carpeShow(t) {
			carpeTimer = setTimeout(carpeLoad,t);
		}
		carpeShow(t);
	}
	adjustPos(200);
	///////////////////
	// WINDOW RESIZE // ++keyb
	///////////////////
	$(window).on("resize", function(evt) {
		//$('#entryListScroller').css("height","auto");
		//$('#entryListWrapper').css("height","auto");
		//$('#entryListScroller').css("height","100%");
		//$('#entryListWrapper').css("height","100%");
		//$('#entryListScroller').css("height",(Number($('#afterLoad').css("height").replace("px","")) - (51)) + "px");
		//$('#entryListWrapper').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - (279)) + "px");
		//NO WHITE FLICKE 
		//$('#entryListScroller').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - (($('#timer').height()))) + "px");
		//$('#entryListWrapper').css("min-height",($('#entryListScroller').height() - ((229 + $('#timer').height()))) + "px");
		//$('#pageSlideInfo').css("min-height",($('#entryListScroller').height()));		
		//$('#pageSlideCalc').css("min-height",($('#entryListScroller').height()));		
		//$('#pageSlideFood').css("min-height",($('#entryListScroller').height() - (61)) + "px");
		//$('#foodList').css("min-height",($('#entryListScroller').height()));		
		$('#pageSlideInfo').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		$('#pageSlideCalc').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		$('#pageSlideFood').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
	});
	////////////////////////
	// ORIENTATION CHANGE //
	////////////////////////
	if('ontouchstart' in document) {
		var mobileBrowserWindow = "orientationchange";
	} else {
		var mobileBrowserWindow = "resize";
	}
	$(window).on(mobileBrowserWindow, function(evt) {
//	$(window).on("orientationchange" + resizeDesktop, function(evt) {
		//update if different than stored
		if(getOrientation() != window.localStorage.getItem("absOrientation")) {
			window.localStorage.setItem("absOrientation",getOrientation());
			//switch values
			var prevHeight = window.localStorage.getItem("absWindowHeight");
			var prevWidth  = window.localStorage.getItem("absWindowWidth");
			window.localStorage.setItem("absWindowHeight",prevWidth);
			window.localStorage.setItem("absWindowWidth",prevHeight);
			//$("#entryBody").val(window.localStorage.getItem("absWindowHeight") + " x " + window.localStorage.getItem("absWindowWidth"));
		//reajust num
		adjustPos(0);
		//resize input
		$('#entryBody').css("left","16px");
		$('#entryBody').css("right","16px");
		$('#entryBody').css("borderColor","transparent");
		//main
		$('#entryListWrapper').css("height","auto");
		//RESIZE
		//RESIZE
		//suspend animation
		$('#entryListWrapper').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - ((234 + scrollPad + $('#timer').height()))) + "px");
		$('#entryListScroller').css("-webkit-transition-duration","0");
		$('#entryListScroller').css("height",(Number($('#afterLoad').css("height").replace("px","")) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#entryListScroller').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideInfo').css("-webkit-transition-duration","0");
		$('#pageSlideInfo').css("height",(Number($('#afterLoad').css("height").replace("px","")) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#pageSlideInfo').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideCalc').css("-webkit-transition-duration","0");
		$('#pageSlideCalc').css("height",(Number($('#afterLoad').css("height").replace("px","")) - ($('#timer').height())) + "px");
		setTimeout(function() { $('#pageSlideCalc').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		$('#pageSlideFood').css("-webkit-transition-duration","0");
		$('#pageSlideFood').css("height",($('#entryListScroller').height() - (61)) + "px");
		setTimeout(function() { $('#pageSlideFood').css("-webkit-transition-duration",".25s");},0);
			//adjust results scroller
		//$('#sideMenuFood').css("height",window.localStorage.getItem("absWindowHeight") - ($('#timer').height()) + "px");
		$('#foodList').css("height",($('#entryListScroller').height() - (61)) + "px");
		}
	//clearRepeater();
	//food input
	$('#foodSearch').css("left","0px");
	$('#foodSearch').css("right","0px");
	$('#foodSearch').css("margin-bottom","1px");
	/////////////////////////
	// fix scrolling delay //
	/////////////////////////
	scrollFix = setTimeout(function() {
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) + (1)) + "px");
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) - (1)) + "px");
		//$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",(Number($('#afterLoad').css("height").replace("px","")) - ((234 + scrollPad + $('#timer').height()))) + "px");
		$('#entryListScroller').css("height",(Number($('#afterLoad').css("height").replace("px","")) - ($('#timer').height())) + "px");
	},300);
});
////#//
} //#//
////#//


//#//////////////////#//
//# DYNAMIC HANDLERS #//
//#//////////////////#//
var eP = 0;
$(document).on("pageload", function(evt) {
	// PREVENT++ //
	if((evt.target.id) > 0) {
		var tgt = "#" + evt.target.id;
	} else {
		var tgt = "";
	}
	//////////////////
	// TAP DIV EDIT //
	//////////////////
	var ix  = 0;
	var meh = 0;
	var duh;
	// TOUCHSWIPE //
	//$("#entryList div" + tgt).on(tap, function(event) {
	$("#entryList div" + tgt).swipe({tap:function(event) {
		event.preventDefault();
		//////////////
		// TAP DATE //
		//////////////
		if(event.target.id.length == 13 && !$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
			$( "#" + event.target.id).html(dtFormat(Number(event.target.id)));
			setTimeout(function() {
				$("#" + event.target.id).html(dateDiff(event.target.id,(new Date()).getTime()));
			},1500);
		}
		//no delete
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
				//counting
				ix++;
				var shit = meh;
				var shot = this.id;
				meh = this.id;
				duh = new Date().getTime();
				//filter
				if(shit == shot && (duh - deh) < 400 && ix >= 1) {
					////////////////////////
					// START ENTRY UPDATE //
					////////////////////////
					if(eP != 0) { return; }
					eP++;
					if(!$('.editableInput').is(':visible')) {
						if(!$(this).has('input').length) {
							var value = $('.entriesBody',this).html();
							var kcals = $('.entriesTitle',this).html();
							$('.entriesTitle',this).attr('id', 'kcalsDiv');
							var input = $('<input/>', {
								'type':'text',
								'id':'editableInput',
								'class':'editableInput',
								'value':value,
								//ONCHANGE HANDLER
								blur: function() {
									var new_value = $(this).val();
									//VALIDATE
									if(this.value == "") {
                                               if(Number(document.getElementById('kcalsDiv').innerHTML) > 0) {
											new_value = LANG("FOOD");
										} else if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
											new_value = LANG("EXERCISE");
										} else {
											new_value = "";
										}
									}
									$(this).replaceWith(new_value);
									$('#kcalsAdjust').remove();
									$('#kcalsDiv').parent("div").removeClass("editing");
									$('#kcalsDiv').parent("div").animate({"backgroundColor": "#fff"},500,function() {
										eP = 0; 
									});
									$('#kcalsDiv').removeAttr('id');
									$("#sliderBlock").fadeOut(500);
									clearRepeaterBlock();
								},
								change: function() {
									//save changes
									var editableValue = $("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
									diary.saveEntry({body:editableValue,id:$(this).closest('div').data("id")}, function() {
										return false;
									});
									//set blur
									if(!$("#entryList div").is(':animated')) {
										$("#editableInput").blur();
									}
								}
							});
							//start edit
							$('.entriesBody',this).empty();
							$('.entriesBody',this).html(input);
							$('.entriesBody',this).after('<p id="kcalsAdjust"><span id="resetBlock"></span><span id="adjustNegBlock"><span id="adjustNeg"></span></span><span id="adjustPosBlock"><span id="adjustPos"></span></p>');
							$("#editableInput").focus();
							///////////////////////
							// RESET ENTRY VALUE //
							///////////////////////
							$('#resetBlock').on(touchstart, function(evt) {
								evt.preventDefault();
								var thisRowId = $(this).closest('div').data("id");
								//console.log("reset entry value");
								function intoTheVoid(button) {
									//ON CONFIRM
									if(button == 1) {
										document.getElementById('kcalsDiv').innerHTML = 0;
										document.getElementById('kcalsDiv').style.color = '#333';
										//save
										diary.saveEntry({title:'0',id:thisRowId});
										updateTimer();
									}
									return false;
								}
								//SHOW DIALOG
								if(hasTouch()) {
									navigator.notification.confirm(LANG("ARE_YOU_SURE"), intoTheVoid, LANG("RESET_ENTRY_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
								} else {
									if(confirm(LANG("RESET_ENTRY_DIALOG"))) { intoTheVoid(1); } else { }
								}
								return false;
							});
							/////////////////////
							// POSITIVE ADJUST //
							/////////////////////
							$("#adjustPosBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								if(Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
									//console.log("increase entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$(this).closest('div').data("id")}, function() {
										return false;
									});
									updateTimer();
								}
								return false;
							});
							/////////////////////
							// NEGATIVE ADJUST //
							/////////////////////
							$("#adjustNegBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								if(Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
									updateTimer();
								}
								return false;
							});
							///////////////////////
							// POSITIVE REPEATER //
							///////////////////////
							function clearRepeaterBlock() {
								clearTimeout(pressTimerNeg);
								clearTimeout(pressTimerPos);
								clearInterval(pressRepeatNeg);
								clearInterval(pressRepeatPos);
							}
							///////////////
							// AUTOCLEAR //
							///////////////
							$("#adjustPosBlock,#adjustNegBlock").on(touchend + "mouseout", function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
							});
							//
							var pressTimerPos;
							var pressRepeatPos;
							$("#adjustPosBlock").on(touchend, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
							});
							$("#adjustPosBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
								pressTimerPos  = window.setTimeout(function()  {
								pressRepeatPos = window.setInterval(function() {
								//ACTION
								if(Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},275);
								},275);
							});
							///////////////////////
							// NEGATIVE REPEATER //
							///////////////////////
							var pressTimerNeg;
							var pressRepeatNeg;
							$("#adjustNegBlock").on(touchend, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
							});
							$("#adjustNegBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
								pressTimerNeg  = window.setTimeout(function()  {
								pressRepeatNeg = window.setInterval(function() {
								//ACTION
								if(Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},275);
								},275);
							});
							//prevent empty list highlight
							if(!isNaN($(this).closest("div").attr("id"))) {
								var editableValue = $("#editableInput").val();
								if(editableValue == LANG("FOOD") || editableValue == LANG("EXERCISE")) { $("#editableInput").val(''); }
								//remove double spaces
								$("#editableInput").val($("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" "));
								// FOCUS, THEN SET VALUE
								//$("#editableInput").select();
								$("#editableInput").focus();
								$(this).closest("div").animate({"backgroundColor": "#ffffcc"},600);
								$(this).closest("div").addClass("editing");
								$("#sliderBlock").remove();
								$("#entryListForm").prepend("<div id='sliderBlock'></div>");
								//blur block
								$("#sliderBlock").on(touchstart, function(evt) {
									evt.preventDefault();
									evt.stopPropagation();
									if(!$("#entryList div").is(':animated')) {
										$("#editableInput").blur();
									}
								});
							}
						}
					}
					//////////////////////
					// END ENTRY UPDATE //
					//////////////////////
					var mi = "2";
					ix = -1;
					meh = "";
				}
				deh = duh;
			}
		}
	//}});
	//#///////////////#//
	//# IOS ROW SWIPE #//
	//#///////////////#//
	},
	//$("#entryList div").on("swipeLeft swipeRight",function(evt) {
		swipe:function(evt,direction) {
		//console.log("row " + $(this).parent('div').data("id") + " swipe");
		if(direction == 'left' || direction == 'right') {
		//HIDE ACTIVE
		if(!$('.delete').hasClass('busy')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(evt) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
		}
		//SHOW
		if(!$('#entryList div:animated').length > 0 && !$('.delete').hasClass('busy') && !$('.delete').hasClass('busy') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('.editableInput').is(':focus') && !$('#entryBody').is(':focus') && !$('#entryTime').is(':focus')) {
			$('.delete',this).addClass('active');
			$('.delete',this).addClass('busy');
			$('.delete',this).addClass('open');
			$('.delete',this).on('webkitTransitionEnd',function(evt) { $('.delete').removeClass('busy'); }); 
		}
		}
		}
	});
	$("#entryList div").swipe("option", "threshold", 32);
	$("#entryList div").swipe("option", "allowPageScroll", "vertical");
	/////////////////////
	// STOP ENTRY EDIT //
	/////////////////////
	$("#timerTouch,#entryListForm,#go,#sliderBlock,#entryList div").on(touchstart, function(evt) {
		if(!$('.editableInput').is(':visible')) { return; }
		if($('.editableInput').is(':visible') && $("#editableInput").is(":focus")) {
		//dismiss protection
		//if($("#entryList div" + tgt).is(':animated')) { return; }
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			evt.stopPropagation();
		//ID MATCH
		if(!$("#entryList div").is(':animated')) {
			if($(this).attr("id") != $("#editableInput").closest("div").attr("id")) {
				$("#editableInput").blur();
					evt.preventDefault();
					evt.stopPropagation();
				}
			}			
		}
	});
	//wrapper click
	$("#entryListWrapper").on(touchend, function(evt) {
		if($('.editableInput').is(':visible')) {
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			//evt.stopPropagation();
		}
		if(evt.target.id == "entryListWrapper") {
			if(!$("#entryList div").is(':animated')) {
				$("#editableInput").blur();
				//evt.stopImmediatePropagation();
				//evt.preventDefault();
			} 
		}
	});
	/////////////////
	// GLOBAL HIDE //
	/////////////////
	$("#timerTouch,#entryListForm,#go,#sliderBlock,#entryListWrapper").on(tap + "swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		if(!$('.active').hasClass('busy')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
		}
	});
	//////////////
	// SPAN TAP //
	//////////////
	$('div span.delete', this).on(tap, function(evt) {
		//evt.preventDefault();
		//console.log("entry " + $(this).parent('div').data("id") + " deleted");
		//UPDATE DB
		diary.deleteEntry($(this).parent('div').data("id"), function(evt) {
			evt.preventDefault();
			//return false;
		});
		//IF LAST ROW
		if(document.getElementById('entryList').innerHTML.match(/data/g).length == 1) {
			$('#entryList').html('<div id="noEntries"><span>' + LANG("NO_ENTRIES") + '</span></div>');
			updateTimer();
			updateEntriesTime();
		} else {
			//REMOVE CLICKED
			$(this).parent('div').remove();
			updateTimer();
			updateEntriesTime();
			//force error
			window.onscroll(scroll($('#entryListScroller')[0].scrollTop,0));
			//window.scroll($('#entryListScroller')[0].scrollTop,0);
		}
		//return false;
	});
//////#//
}); //#//
//////#//

//#//////////////////////#//
//# DYNAMIC HANDLERS 2.0 #//
//#//////////////////////#//
$(document).on("pageReload", function(evt) {
	///////////////
	// CREATE DB //
	///////////////
	var pSql = 0;
	$('#pageSlideFood').on('webkitTransitionEnd',function(evt) {
		// IMPORT //
		if(pSql == 0) {
			if(window.localStorage.getItem("foodDbLoaded") != "done") {
				pSql++;
				var demoRunning = false;
				var dbName = "mylivediet.app";
				if(!demoRunning) {
					//start
					spinner(45);
					demoRunning = true;
					try {
						html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
						//import sql
						$.get("searchdb_" + LANG("LANGUAGE") + ".sql",function(sql) {
							var startTime = new Date();
							setTimeout(function() {
							html5sql.process(
								sql,
								function(){
									//success
									window.localStorage.setItem("foodDbLoaded",'done');
									demoRunning = false;
									spinner();
								},
								function(error, failingQuery) {
									//failure
									//window.localStorage.setItem("foodDbLoaded","empty");
									demoRunning = false;
								});
							},200);
						});
					//try fail
					} catch(error) {
						demoRunning = false;
					}}
				}
			}
		});
		///////////////
		// FOOD HTML //
		///////////////
		$("#pageSlideFood").html('<div id="sideMenuFood"><input type="text" id="foodSearch" placeholder="' + LANG("FOOD_SEARCH") + '" /><span id="iconClear">×</span><span id="iconRefresh" class="icon-refresh"></span><div id="foodListWrapper"><div id="foodList"><span id="noMatches">' + LANG("NO_MATCHES") + '</span></div></div></div>');
		//PRE-ADJUST RESULTS HEIGHT
		getRecentList();
		$('#pageSlideFood').css("height",($('#entryListScroller').height() - (61)) + "px");
		$('#foodList').css("height",($('#entryListScroller').height() - (61)) + "px");
		//remember search type
		if(window.localStorage.getItem("searchType") == "exercise") {
			$("#foodSearch").attr('placeholder',LANG("EXERCISE_SEARCH"));
			$("#foodSearch").addClass("exerciseType");
		}
		////////////////////
		// RESULTS HEIGHT //
		////////////////////
		$('#foodList').css("height",window.localStorage.getItem("absWindowHeight") - ( ($('#timer').height() + 60) ) + "px");
		//#/////////////////#//
		//# CORE SQL SEARCH #//
		//#/////////////////#//
		Diary.prototype.searchFood = function(searchSQL,callback) {
			//console.log('Running getEntries');
			if(arguments.length == 1) { callback = arguments[0]; }
			//food-exercise
			if(window.localStorage.getItem("searchType") == "exercise") {
				var typeTerm = 'exercise';
			} else {
				var typeTerm = 'food';
			}
			//cases	
			var firstTerm = window.localStorage.getItem("lastSearchTerm").split(" ")[0];
			var caseStarts   = "'"  + firstTerm + "%'";
			var caseContains = "'%" + firstTerm + "%'";
			var caseEnds     = "'%" + firstTerm +  "'";
			//query
			this.db.transaction(
				function(t) {
					t.executeSql("SELECT * FROM diary_food WHERE type == '" + typeTerm + "' AND " + searchSQL + " ORDER BY CASE when term LIKE " + caseStarts + " THEN 0 ELSE 1 END, UPPER(term) LIMIT 50",[],
					function(t,results) {
						callback(that.fixResults(results));
				},this.dbErrorHandler);
			}, this.dbErrorHandler); 
		};
		//#///////////////////#//
		//# BUILD RECENT LIST #//
		//#///////////////////#//
		function getRecentList() {
			diary.getEntries(function(data) {
				//console.log('updating entrylist sum');
				var searchHistory = [];
				for(var i=0, len=data.length; i<len; i++) {
					if(data[i].body != "") {
						searchHistory.push(data[i].body);
					}
				}
				searchHistory = searchHistory.reverse();
				function sortByFrequencyAndFilter(myArray){
					var newArray = [];
					var freq = {};
					//count frequency of occurances
					var i=myArray.length-1;
					for (var i;i>-1;i--) {
						var value = myArray[i];
						freq[value]==null?freq[value]=1:freq[value]++;
					}
					//create array of filtered values
					for (var value in freq) {
						if(trim(value) != "") {
							newArray.push(value);
						}
					}
					//define sort function and return sorted results
					function compareFreq(a,b) {
						return freq[b]-freq[a];
					}
					return newArray.sort(compareFreq);
				}
				var sortedList = sortByFrequencyAndFilter(searchHistory);
				var recentHtml = "";
				if(sortedList == "") { recentHtml += '<div class="searcheable"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }

				for(q = 0; q < sortedList.length; q++) {
					//not null
					if(sortedList[q] != "" && q < 8) {
						recentHtml += '<div class="searcheable recentItem"><div class="foodName">' + sortedList[q] + '</div></div>';
					}
				}
				$("#foodList").html("<div id='recentBlock'><h3 class='recentItem'>" + LANG('ENTRY_HISTORY') + "</h3>" + recentHtml + "</div>");
				$(".searcheable").off(tap + touchstart);
				$(".searcheable").on(tap + touchstart, function(evt) {
				$("#activeOverflow").removeAttr("id");
				$(".foodName",this).attr("id","activeOverflow");
				$(".foodName").css("overflow","auto");
			});
			// PRE-FILL RECENT //
			var mr = 0;
			$(".recentItem").off("doubleTap");
			$(".recentItem").on("doubleTap",function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				if(mr == 0) {
					mr++;
					$("#entryBody").val($("#activeOverflow").html());
					$("#timerTouch").trigger(trim(tap));
					$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
				}
			});
			});
		}
		//#//////////////////////#//
		//# SEARCH CORE FUNCTION #//
		//#//////////////////////#//
		function doSearch(rawInput) {
			//ignore null searches
			if(rawInput == 0) {
				rawInput = "00000000";
			}
			//this.value = sval;
			/////////////////
			// FETCH INPUT //
			/////////////////	
			//var rawInput   = this.value;
			var timerStart = new Date().getTime();
			var lastSearch = window.localStorage.getItem("lastSearchTerm");
			//sanitize user input
			var searchQuery = trim(rawInput.split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("\\").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").toLowerCase());
			//partial sql syntax
			var searchSQL   = "term LIKE '%" + searchQuery.split(" ").join("%' AND term LIKE '%") + "%'";
			//prevent multiple identical searches
			window.localStorage.setItem("lastSearchTerm",searchQuery);
			//#/////////////////////#//
			//# BUILD KEYWORD ARRAY #//
			//#/////////////////////#//
			var keywordArray = [];
			searchArray = searchQuery;
			//check for multiple keywords
			if(searchQuery.search(' ') > -1) {
				searchQuery = searchQuery.split(" ");
				//loop each key into array
				for(i = 0; i < searchQuery.length; i++) {
					//not null
					if(searchQuery[i] != "") {
						keywordArray.push(trim(searchQuery[i]));
					}
				}
			} else {
				//single term array
				keywordArray.push(searchQuery);
			}
			///////////////////////////////////////////////////////////
			// PREVENT EMPTY STRING ON MULTIPLE KEYWORD SEARCH ARRAY //
			///////////////////////////////////////////////////////////
			if(keywordArray != "") {
				//#///////////////#//
				//# QUERY FOOD DB #//
				//#///////////////#//
				var foodList   = '';
				var countMatch = 0;
				//ADJUST SEARCH TYPE
				if(window.localStorage.getItem("searchType") == "exercise") {
					//get current weight			
					if(!window.localStorage.getItem("calcForm#pA3B")) {
						var totalWeight = 80;
					} else {
						var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
					}
					//convert to kg
					if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
						var totalWeight = Math.round( (totalWeight) / (2.2) );
					}
					//TYPES
					var searchType = 'exercise';
				} else {
					var searchType = 'food';
				}
				diary.searchFood(searchSQL,function(data) {
					// LOOP RESULTS //
					for(var s=0, len=data.length; s<len; s++) {
						//total results
						//countMatch++;
						//max results
						//if(s <= 100) {
							//organize relevant columuns
							var id   = data[s].id;
							var type = data[s].type;
							var code = data[s].code;
							var name = data[s].name;
							var term = data[s].term;
							var kcal = data[s].kcal;
							var pro  = data[s].pro;
							var car  = data[s].car;
							var fat  = data[s].fat;
							var fib  = data[s].fib;
							// SEARCH TYPE //
							var typeClass;
							if(searchType == "exercise") {
								typeClass = " hidden";
								//calculate weight proportion
								kcalBase = kcal;
								kcal = Math.round(((kcal * totalWeight)/60) * 30);
							} else {
								typeClass = "";
								kcalBase = kcal;
							}
							//html
							var foodLine = "<div class='searcheable' id='" + type + code + "' title='" + kcalBase + "'><div class='foodName'>" + name + "</div><span class='foodKcal'><span class='preSpan'>kcals</span>" + kcal + "</span><span class='foodPro " + typeClass + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + pro + "</span><span class='foodCar " + typeClass + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + car  + "</span><span class='foodFat " + typeClass + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + fat  + "</span></div>";
							//result list
							foodList += foodLine;
						//}
					} //end loop
					/////////////////////
					// DISPLAY RESULTS //
					/////////////////////
					//matches number
					//$("#iCounter").html(countMatch + " matches");
					//prevent overflow blinking
					$("#foodList").hide();
					$("#foodList").html('');
					//if empty
					if(foodList == "") {
						if($("#foodSearch").val() != "") {
							$("#foodList").html('<span id="noMatches"> ' + LANG("NO_MATCHES") +' </span>');
						} else {
							getRecentList();
						}
					} else {
						$("#foodList").html(foodList);
					}
					$("#foodList").show();
			////////////////////////
			// OVERFLOW ON-DEMAND //
			////////////////////////
			$(".searcheable").on(tap + touchstart, function(evt) {
				$("#activeOverflow").removeAttr("id");
				$(".foodName",this).attr("id","activeOverflow");
				$(".foodName").css("overflow","auto");
			});
			/////////////////////////////////
			// TAP FOOD-ENTRY EDIT (MODAL) //
			/////////////////////////////////
			var ix  = 0;
			var meh = 0;
			var duh;
			// TOUCHSWIPE //
			$("#foodList div.searcheable").swipe({
				tap:function(event) {
					event.preventDefault();
					//counting
					ix++;
					var shit = meh;
					var shot = $("#activeOverflow").html(); //this.id;
					meh      = $("#activeOverflow").html(); //this.id;
					duh      = new Date().getTime();
					//filter
					if(shit == shot && (duh - deh) < 400 && ix >= 1) {
						////////////////////////
						// FOODLIST DOUBLETAP //
						////////////////////////
						//insert frame
						$("body").prepend('<div id="modalOverlay"></div>');
						$("#entryListFix").prepend('<div id="modalWindow"></div>');
						//add content
						$("#modalWindow").html("<div id='modalContent'>" + $("#activeOverflow").html() + "&nbsp; <span>&nbsp;" + LANG('PRE_FILL') + "</span></div>");
						$("#modalWindow").append("<div id='modalButtons'><span id='modalOk'>" + LANG('ADD') + "</span><span id='modalCancel'>" + LANG('CANCEL') + "</span></div>");
						$("#modalWindow").append('<div id="modalAdjust"><span id="modalNegBlock"><span id="modalNeg" class="icon-chevron-sign-left"></span></span><span id="modalPosBlock"><span id="modalPos" class="icon-chevron-sign-right"></span></span><span id="modalAmmountBlock"><span id="modalAmmount">0</span><span id="modalAmmountType">' + LANG("GRAMS") + '</span></span><span id="modalTotalBlock"><span id="modalTotal">0</span><span id="modalTotalType">kcals</span></span></div>');
						//set shortcuts
						var kcalsBase = Number($("#activeOverflow").parent("div").attr("title"));
						//var kcalsList = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodKcal").text().split("kcals").join(""));
						//CONTENT TYPE ADJUST
						if(searchType == "food") { 
							$("#modalAmmountType").html(LANG('GRAMS'));
							$("#modalTotalType").after("<span id='proData'>0.0<span>g</span></span><span id='carData'>0.0<span>g</span></span><span id='fatData'>0.0<span>g</span></span><span id='proLabel'>" + LANG('PRO') + "</span><span id='carLabel'>" + LANG('CAR') + "</span><span id='fatLabel'>" + LANG('FAT') + "</span>");
						} else {
							$("#modalAmmountType").html(LANG('MINUTES'));
						}
						//SHOW MODAL
						$("#modalWindow,#modalOverlay").fadeIn(200);
						$('#modalWindow,#modalOverlay').addClass('show');
						//#/////////////////////////////////#//
						//# MODAL ADD/REMOVE CORE FUNCTIONS #//
						//#/////////////////////////////////#//
						///////////////////
						// NUTRIENT DATA //
						///////////////////
						function getNutriData() {
							if(searchType == "food") {
								var kcalsPro = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodPro").text().split(LANG("PRO")).join(""));
								var kcalsCar = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodCar").text().split(LANG("CAR")).join(""));
								var kcalsFat = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodFat").text().split(LANG("FAT")).join(""));
								//var kcalsFib = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodFib").text().split("fib").join(""));
								var kcalsTotalPro = (Math.round((((Number(kcalsPro))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var kcalsTotalCar = (Math.round((((Number(kcalsCar))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var kcalsTotalFat = (Math.round((((Number(kcalsFat))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								//var kcalsTotalFib = (Math.round((((Number(kcalsFib))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var proData = "" + kcalsTotalPro.toFixed(1) + "<span>g</span>";
								var carData = "" + kcalsTotalCar.toFixed(1) + "<span>g</span>";
								var fatData = "" + kcalsTotalFat.toFixed(1) + "<span>g</span>";
								//var fibData = "" + kcalsTotalFib.toFixed(1) + "<span>g</span>";
								$("#proData").html(proData);
								$("#carData").html(carData);
								$("#fatData").html(fatData);
								//$("#fibData").html(fibData);
							}
						}
						/////////
						// ADD //
						/////////
						function modalAdd() {
							//FOOD
							if(searchType == "food") {
								if($("#modalAmmount").html() < 750 && Math.round(((kcalsBase)/100) * (Number(document.getElementById('modalAmmount').innerHTML) + 25)) <= 9999) {
									$("#modalAmmount").html(Number($("#modalAmmount").html()) + (25));
									$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmmount').innerHTML)));
									getNutriData();
								}
							} else {
							//EXERCISE
								if($("#modalAmmount").html() < 360 && Math.round(((kcalsBase * totalWeight)/60) * (Number(document.getElementById('modalAmmount').innerHTML) + 5)) <= 9999) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) + (5));
									$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmmount').innerHTML)));
								}
							}
						}
						/////////
						// REM //
						/////////
						function modalRem() {
							//FOOD	
							if(searchType == "food") {
								if($("#modalAmmount").html() > 0) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) - (25));
									$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmmount').innerHTML)));
									getNutriData();
								}
							} else {
							//EXERCISE
								if($("#modalAmmount").html() > 0) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) - (5));
									$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmmount').innerHTML)));
								}
							}
						}
						/////////////////////
						// POSITIVE ADJUST //
						/////////////////////
						$("#modalPosBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							modalAdd();
							return false;
						});
						/////////////////////
						// NEGATIVE ADJUST //
						/////////////////////
						$("#modalNegBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							modalRem();
							return false;
						});
						///////////////////////
						// POSITIVE REPEATER //
						///////////////////////
						function clearRepeaterModal() {
							clearTimeout(pressTimerModalNeg);
							clearTimeout(pressTimerModalPos);
							clearInterval(pressRepeatModalNeg);
							clearInterval(pressRepeatModalPos);
						}
						///////////////
						// AUTOCLEAR //
						///////////////
						$("#modalPosBlock,#modalNegBlock").on(touchend + " mouseout", function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						//
						var pressTimerModalPos;
						var pressRepeatModalPos;
						$("#adjustPosBlock").on(touchend, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						$("#modalPosBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							pressTimerModalPos  = window.setTimeout(function()  {
							pressRepeatModalPos = window.setInterval(function() {
							modalAdd();
							return false;
							},275);
							},275);
						});
						///////////////////////
						// NEGATIVE REPEATER //
						///////////////////////
						var pressTimerModalNeg;
						var pressRepeatModalNeg;
						$("#modalNegBlock").on(touchend, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						$("#modalNegBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							pressTimerModalNeg  = window.setTimeout(function()  {
							pressRepeatModalNeg = window.setInterval(function() {
							modalRem();
							return false;
							},275);
							},275);
						});
						//#/////////////////////////#//
						//# SMALLER MODAL FUNCTIONS #//
						//#/////////////////////////#//
						////////////////////////////
						// MODAL QUICK ADD (SAVE) //
						////////////////////////////
						var im = 0;
						$("#modalOk").on(touchstart,function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							//ADJUST TYPE
							if(searchType == "food") { 
								var valueType = 1;
								var shortDesc = " (" + document.getElementById('modalAmmount').innerHTML + "g)";
							} else {
								var valueType = -1;
								var shortDesc = " (" + document.getElementById('modalAmmount').innerHTML + " min)";
							}
							//grab values
							var title     = ((document.getElementById('modalTotal').innerHTML) * (valueType));
							var body      = $("#activeOverflow").html() + shortDesc;
							var published = new Date().getTime();
							//hours ago
							if(Number($("#entryTime").val()) >= 1) {
								published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000) );
							}
							//SAVE (NOT NULL)
							if(title != 0 && im == 0) {
							im++;
								//console.log("new entry added (modal)");
								diary.saveEntry({title:title,body:body,published:published});
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								$(".searcheable").removeClass('fade');
								//CSS HIGHLIGHT
								$(".searcheable").removeClass('yellow');
								$(".searcheable").removeClass('trans');
								$("#activeOverflow").parent("div").addClass('yellow');
								var yellowFade = setTimeout(function() {
									$("#activeOverflow").parent("div").addClass('fade');
									$("#activeOverflow").parent("div").addClass('trans');
								},0);
								//SELF-REMOVE
								$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
									$("#modalOverlay,#modalWindow").remove();
								});
								var resetSlider = document.getElementById('slider').slider.resetValue();
								document.getElementById('entryBody').value = "";
								document.getElementById('entryTime').value = 0;
								//REFRESH DATA
								updateTimer();
								clearRepeaterModal();
								$("#activeOverflow").parent("div").on('webkitTransitionEnd',function(e) { 
									updateEntries(published);
									updateEntriesTime();
								});
							}
						});
						///////////////////
						// OVERLAY CLOSE //
						///////////////////
						$("#modalOverlay, #modalCancel").on(touchstart,function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							//fade (time protected)
							var deFade = new Date().getTime();
							if((deFade - duh > 350)) {
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								clearRepeaterModal();
								//SELF-REMOVE
								$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
									$("#modalOverlay,#modalWindow").remove();
								});
							}
						});
						///////////////////
						// PRE-FILL ONLY //
						///////////////////
						var mc = 0;
						$("#modalContent").on(touchstart,function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							clearRepeaterModal();
							if(mc == 0) {
							mc++;
								$("#entryBody").val($("#activeOverflow").html());
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								//SELF-REMOVE
								$('#modalWindow').on('webkitTransitionEnd',function(e) { 
									$("#modalWindow").remove();
									$("#modalOverlay").remove();
								});
								//$("#modalOverlay").trigger(trim(tap));
								$("#timerTouch").trigger(trim(tap));
								$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
							}
						});
						/////////////////////////////////////
						// END TAP FOOD-ENTRY EDIT (MODAL) //
						/////////////////////////////////////
						var mi = "2";
						ix     = -1;
						meh    = "";
					}
					deh = duh;
				}
			});
		}); // END QUERY CONTEXT
	}}
	//#/////////////////////////////////////#//
	//# KEYUP LISTENER SEARCH TIMER-LIMITER #//
	//#/////////////////////////////////////#//
	var timer;
	//$("#foodSearch").on("propertychange keyup input paste",function() {
	//$("#foodSearch").keyup(function() {
	document.getElementById('foodSearch').addEventListener('input', function() {
		//CLEAR ICON
		if(this.value.length == 0) {
			$('#iconClear').hide();
			$('#iconRefresh').show();
		} else {
			$('#iconRefresh').hide();
			$('#iconClear').show(); 
		}
		$('#iconClear').on(touchstart,function(evt) {
			$('#foodSearch').val('');
			$('#iconClear').hide();
			$('#iconRefresh').show();
			//$('#foodList').html('<span id="noMatches">no matches</span>');
			getRecentList();
		});
		//SET TIMER
		clearTimeout(timer);
		var ms  = 200; //275;
		var val = this.value;
		//DO SEARCH
		timer = setTimeout(function() {
			doSearch($("#foodSearch").val());
		}, ms);
	});
	///////////////////
	// HIDE KEYBOARD //
	///////////////////
	$("#foodList").on(tap, function(evt) {
		evt.preventDefault();
		$("#entryBody").blur();
		$("#foodSearch").blur();
	});
	//////////////////////
	// SEARCH TYPE ICON //
	//////////////////////
	$('#iconRefresh').on(touchstart,function(evt) {
		//toggle -if not animated
		if(!$("#foodSearch").hasClass('busy')) {
			$("#foodSearch").toggleClass("exerciseType");
			//update placeholder n' animate
			if($("#foodSearch").hasClass("exerciseType")) {
				window.localStorage.setItem("searchType","exercise");
				$("#foodSearch").attr('placeholder',LANG('EXERCISE_SEARCH'));
				$("#foodSearch").addClass('busy');
				$("#foodSearch").animate({ backgroundColor: "#555" }, 1).animate({ backgroundColor: "#151515" },600,function() { 
						$("#foodSearch").removeClass('busy');
					}
				);
			} else {
				window.localStorage.removeItem("searchType");
				$("#foodSearch").attr('placeholder',LANG('FOOD_SEARCH'));
				$("#foodSearch").addClass('busy');
				$("#foodSearch").animate({ backgroundColor: "#555" }, 1).animate({ backgroundColor: "#151515" },600,function() { 
						$("#foodSearch").removeClass('busy');
					}
				);
			}
		}
	});
	/////////////////////////////////////////
	// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
	/////////////////////////////////////////
	$("#foodSearch").on(touchstart, function(evt) {
		$(".foodName").css("overflow","hidden");
		$("#activeOverflow").removeAttr("id");
	});
//////#//
}); //#//
//////#//


//#############################################################//
//##                      CUSTOM CORE                        ##//
//#############################################################//
/////////////////////////////
// STATUS BAR REFRESH DATA //
/////////////////////////////
function replaceDivContent(id,content) {
		var kcalsType  = content[0];
		var kcalsInput = content[1];
		var currentDay = content[2];
		var currentDayName = content[3];
	if(kcalsType == "cyclic") {
		if(currentDay == "d") {
			var getKcalsKey  = "config_kcals_day_2";
			var getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
			var eqPerDay     = window.localStorage.getItem("config_kcals_day_2");
		} else {
			var getKcalsKey  = "config_kcals_day_1";		
			var getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
			var eqPerDay     = window.localStorage.getItem("config_kcals_day_1");
		}
	} else {
		var kcalsType    = content[0];		
		var kcalsInput   = content[1];
		var getKcalsKey  = "config_kcals_day_0";	
		var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
		var eqPerDay     = window.localStorage.getItem("config_kcals_day_0");
	}
	//STATUS BAR COLOR
	var status;
	var cssClass;
	var statusStop;
         if(kcalsInput >  9999) { status = LANG('SURPLUS');  statusStop = " " + LANG('ERROR'); cssClass = "surplus"; if($("#entryBody").val() != "devilim") { kcalsInput =  9999.99; }}
	else if(kcalsInput < -9999) { status = LANG('DEFICIT');  statusStop = " " + LANG('ERROR'); cssClass = "deficit"; if($("#entryBody").val() != "devilim") { kcalsInput = -9999.99; }}
	else if(kcalsInput >  600)  { status = LANG('SURPLUS');  statusStop = " " + LANG('STOP');  cssClass = "surplus";  }
	else if(kcalsInput < -600)  { status = LANG('DEFICIT');  statusStop = " " + LANG('STOP');  cssClass = "deficit";  }
	else if(kcalsInput >  300)  { status = LANG('SURPLUS');  statusStop = " ";                 cssClass = "surplus";  }
	else if(kcalsInput < -300)  { status = LANG('DEFICIT');  statusStop = " ";                 cssClass = "deficit";  }
	else                        { status = LANG('BALANCED'); statusStop = " ";                 cssClass = "balanced"; }
	//EQ TIME
	var eqTime;
	var eqStart  = Number(window.localStorage.getItem("config_start_time"));
	var eqCals   = kcalsInput;
	var eqDate   = Number((new Date()).getTime());
	var eqRatio  = (60*60*24 / eqPerDay);
	var eqDiff   = eqDate - Math.floor(Math.abs(kcalsInput*eqRatio));
	var eqTime   = dateDiff(eqDiff*1000,eqDate*1000).replace(" " + LANG("AGO"),"");
	////////////
	// OUTPUT //
	////////////
	var kcalsHtmlOutput = '';
	kcalsHtmlOutput += "<div id='" + cssClass + "' class='" + kcalsType + "'>";
	// SIMPLE DATA //
		kcalsHtmlOutput += "<span id='subStatusEq'>" + LANG('EQ_TIME') + ": <span class='bold'>" + eqTime + "</span></span>";
		kcalsHtmlOutput += "<span id='subKcalsDay'><span class='bold'>" + eqPerDay + " </span> kcals / " + LANG('DAY') + "</span>";
	// CYCLIC DATA //
	if(content[0] == "cyclic") {
		kcalsHtmlOutput += "<span id='subKcalsRange'><span>" + window.localStorage.getItem("config_kcals_day_1") + "~" + window.localStorage.getItem("config_kcals_day_2") + "</span> kcals " + LANG('RANGE') + "</span>";
		//kcalsHtmlOutput += "<span id='subDayName'><span>" + currentDayName + "</span></span>";
		//kcalsHtmlOutput += "<span id='subCurrentDay'>day <span>" + currentDay + "</span></span>";
		kcalsHtmlOutput += "<span id='subCurrentDay' class='currentDay" + currentDay.toUpperCase() + "'><span id='subDayA'>" + LANG('DAY') + " <span>a</span></span><span id='subDayB'>" + LANG('DAY') + " <span>b</span></span><span id='subDayC'>" + LANG('DAY') + " <span>c</span></span><span id='subDayD'>" + LANG('DAY') + " <span>d</span></span></span>";
	}
	//minus bump
	//if(kcalsInput == 0) { kcalsInput = "0.00"; }
		//insert
		kcalsHtmlOutput += "<span id='statusContent'>" + kcalsInput + " kcals</span>";
		kcalsHtmlOutput += "<span id='statusMain'>(" + status + ")</span>";
		kcalsHtmlOutput += "<span id='statusStop'>" + statusStop + "</span>";
		kcalsHtmlOutput += "</div>";
	//REPLACE
	//console.log('kcalsHtmlOutput');
	//$("#timer").hide();
	//$("#timer").html('');
	$("#timer").html(kcalsHtmlOutput);
	//$("#timer").show();
}
///////////////////
// TIME TO KCALS //
///////////////////
function timeToKcals(start) {
	var now             = (new Date()).getTime();
	var timeSinceStart  = (now - start) / 1000;
	var kcalsPerDay     = window.localStorage.getItem("config_kcals_day_0");
	var KcalsTimeRatio  = 60*60*24 / kcalsPerDay;
	//var kcalsSinceStart = Math.floor((timeSinceStart / KcalsTimeRatio)*31)*(-1);
	var kcalsSinceStart = ((timeSinceStart / KcalsTimeRatio)*1)*(-1);
	var kcalsEntrySum   = Number(window.localStorage.getItem("config_entry_sum"));

	var content = [];
		content.push("simple");
		//content.push(((kcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2));
		content.push(((kcalsSinceStart/1) + (kcalsEntrySum)).toFixed(2));
	return content; // ((kcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
}
//#//////////////////////#//
//# CYCLIC TIME TO KCALS #//
//#//////////////////////#//
//#////////////////////////#//
//# *CYCLIC* TIME TO KCALS #//
//#////////////////////////#//
function cyclicTimeToKcals(startTime) {
	//TIME VARS
	var now        = new Date().getTime();// - ((((new Date).getTimezoneOffset()) * 60 * 1000));
	var hour       = 60*60*1000;
	var day        = 60*60*24*1000;
	//DATE VARS
	var months     = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var monthName  = months[new Date().getMonth()];
	var todaysTime = Date.parse(new Date(monthName + " " +  new Date().getDate() + ", " + new Date().getFullYear()));
	//var todaysTime = Date.parse(moment().format("MMMM DD, YYYY"));
	//var todaysTime = Date.parse(moment().format('LL'));
	// IF (START DATE) < (TIME ELAPSED TODAY), DO NOT COUNT FROM TODAYS START TIME, BUT FROM DIET START TIME
	if((now - startTime) > (todaysTime - startTime) && (now - startTime) < day ) {
		var todaysTime = now;
	}
	//DAY NAMES
	var nameA      = "plateau in";
	var nameB      = "diet plateau";
	var nameC      = "plateau out";
	var nameD      = "carb up";
	//CALORIC INPUT
	var intakeA    = window.localStorage.getItem("config_kcals_day_1");
	var intakeB    = window.localStorage.getItem("config_kcals_day_1");
	var intakeC    = window.localStorage.getItem("config_kcals_day_1");
	var intakeD    = window.localStorage.getItem("config_kcals_day_2");
	//CALORIC INPUT
	//var intakeA    = 1440; 
	//var intakeB    = 1440;
	//var intakeC    = 1440;
	//var intakeD    = 1440*2; //2880;
	// DIET START DATE
	var dietStartTime         = startTime; //Date.parse("August 13, 2013") - (0*3600*1000) + (0*60*1000) - (((new Date().getTimezoneOffset()) * 60 * 1000));
	// CYCLE VARS
	var timeSinceStarted      = now - dietStartTime;
	var daysSinceStarted      = timeSinceStarted / day;
	var wholeDaysSinceStarted = Math.floor(daysSinceStarted);
	var partialDayTimeLeft    = daysSinceStarted - wholeDaysSinceStarted;
	var timeElapsedToday      = now - todaysTime;
	var timeElapsedFirstDay   = (timeSinceStarted) - (wholeDaysSinceStarted * day) - (timeElapsedToday);
	var timeElapsedWholeDays  = (wholeDaysSinceStarted * day);
	////////////////////////////////
	// ABSOLUTE CURRENT CYCLE DAY //
	//////////////////////////////// //DEFINE DAYS SINCE absolute 0, LOOPING ABCD (15930~ days)
	var cycleDay = "a";
	for(var dietDay = 0; dietDay < now; dietDay = dietDay + day) {
			 if(cycleDay == "a") { currentDay = "a"; /*PUSH TO NEXT*/ cycleDay = "b"; }
		else if(cycleDay == "b") { currentDay = "b"; /*PUSH TO NEXT*/ cycleDay = "c"; }
		else if(cycleDay == "c") { currentDay = "c"; /*PUSH TO NEXT*/ cycleDay = "d"; }
		else if(cycleDay == "d") { currentDay = "d"; /*PUSH TO NEXT*/ cycleDay = "a"; }
	}
	////////////////////////////////////
	// THE WHOLE-DAY *COUNTBACK* LOOP //
	////////////////////////////////////
	var currentCountDay = currentDay;
	var firstCycleDay   = "";
	// COUNT WHOLE DAYS OF EACH DAY
	var countCycleDaysA = 0;
	var countCycleDaysB = 0;
	var countCycleDaysC = 0;
	var countCycleDaysD = 0;
	// ONLY CYCLE *IF* WE HAVE BEEN DIETING FOR MORE THAN A DAY
	if(timeSinceStarted > timeElapsedFirstDay) {
		for(var countBack = 0; countBack < (wholeDaysSinceStarted); countBack++) {
				 if(currentCountDay == "a") { countCycleDaysD = countCycleDaysD+1; /*PUSH TO NEXT*/ currentCountDay = "d"; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = "d"; }
			else if(currentCountDay == "b") { countCycleDaysA = countCycleDaysA+1; /*PUSH TO NEXT*/ currentCountDay = "a"; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = "a"; }
			else if(currentCountDay == "c") { countCycleDaysB = countCycleDaysB+1; /*PUSH TO NEXT*/ currentCountDay = "b"; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = "b"; }
			else if(currentCountDay == "d") { countCycleDaysC = countCycleDaysC+1; /*PUSH TO NEXT*/ currentCountDay = "c"; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = "c"; }
		}
	}
	/////////////////////////////////////
	// TOTAL TIME FOR EACH *WHOLE* DAY //
	/////////////////////////////////////
	var totalTimeOnDayA = (countCycleDaysA * day);
	var totalTimeOnDayB = (countCycleDaysB * day);
	var totalTimeOnDayC = (countCycleDaysC * day);
	var totalTimeOnDayD = (countCycleDaysD * day);
	////////////////////////////////////
	// ADD PARTIAL TIME FROM LAST DAY //
	//////////////////////////////////// IF (START DATE) < (TIME ELAPSED TODAY), DO NOT COUNT FROM TODAYS START TIME, BUT FROM DIET START TIME
	if(timeSinceStarted > timeElapsedFirstDay) {
		StartTimeOrTimeElapsed = timeElapsedToday;
	} else {
		StartTimeOrTimeElapsed = timeSinceStarted;
	}
		 if(currentDay == "a") { totalTimeOnDayA = totalTimeOnDayA + StartTimeOrTimeElapsed; }
	else if(currentDay == "b") { totalTimeOnDayB = totalTimeOnDayB + StartTimeOrTimeElapsed; }
	else if(currentDay == "c") { totalTimeOnDayC = totalTimeOnDayC + StartTimeOrTimeElapsed; }
	else if(currentDay == "d") { totalTimeOnDayD = totalTimeOnDayD + StartTimeOrTimeElapsed; }
	/////////////////////////////////////
	// ADD PARTIAL TIME FROM FIRST DAY //
	/////////////////////////////////////
		 if(firstCycleDay == "a") { totalTimeOnDayA = totalTimeOnDayA + timeElapsedFirstDay; }
	else if(firstCycleDay == "b") { totalTimeOnDayB = totalTimeOnDayB + timeElapsedFirstDay; }
	else if(firstCycleDay == "c") { totalTimeOnDayC = totalTimeOnDayC + timeElapsedFirstDay; }
	else if(firstCycleDay == "d") { totalTimeOnDayD = totalTimeOnDayD + timeElapsedFirstDay; }
	////////////////////////////////
	// SUM TIME SPENT ON EACH DAY //
	////////////////////////////////
	//EACH RATIO
	var kcalsTimeRatioA  = day / intakeA;
	var kcalsTimeRatioB  = day / intakeB;
	var kcalsTimeRatioC  = day / intakeC;
	var kcalsTimeRatioD  = day / intakeD;
	//EACH TIME
	var kcalsSinceStartA = totalTimeOnDayA / kcalsTimeRatioA;
	var kcalsSinceStartB = totalTimeOnDayB / kcalsTimeRatioB;
	var kcalsSinceStartC = totalTimeOnDayC / kcalsTimeRatioC;
	var kcalsSinceStartD = totalTimeOnDayD / kcalsTimeRatioD;
	////////////////
	// SET OUTPUT //
	////////////////
	//var kcalsPerDay      = document.storeForm.storePerDay.value;
	var kcalsEntrySum      = Number(window.localStorage.getItem("config_entry_sum"));
	//var allKcalsSinceStart = Math.floor((kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD)*31) * (-1);
	var allKcalsSinceStart = ((kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD)) * (-1);
	/////////////////
	// BUILD ARRAY //
	/////////////////
	window.localStorage.setItem("config_kcals_day",currentDay);
	//var kcalsOutput = ((allKcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
	var kcalsOutput = ((allKcalsSinceStart) + (kcalsEntrySum)).toFixed(2);
	var content = [];
		content.push("cyclic");
		content.push(kcalsOutput);
		content.push(currentDay);
		content.push(currentDay);
	return content; //((allKcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
	
}
//##################//
//## CORE UPDATER ##//
//##################//
function updateTimer() {
	//update every ~
	if(new Date().getSeconds() == 30) { updateEntriesTime(); }
	//MAKE SUM
	diary.getEntries(function(data) {
		//console.log('updating entrylist sum');
		var ts = 0;
		for(var i=0, len=data.length; i<len; i++) {
			// EXPIRED
			if(window.localStorage.getItem("config_start_time") < Number(data[i].published)) {
				ts = Number(data[i].title) + ts;
			}
		}
		//console.log('refreshing timer');
		window.localStorage.setItem("config_entry_sum",ts);
		var day1 = window.localStorage.getItem("config_kcals_day_1");
		var day2 = window.localStorage.getItem("config_kcals_day_2");
		//READ SETTINGS
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			replaceDivContent("timer",cyclicTimeToKcals(window.localStorage.getItem("config_start_time")));
		} else {
			replaceDivContent("timer",timeToKcals(window.localStorage.getItem("config_start_time")));
		}
	});
}

