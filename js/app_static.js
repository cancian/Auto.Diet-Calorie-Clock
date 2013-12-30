//////////////////
// DEVICE READY //
//////////////////
//ONREADY
isDeviceReady("init");
//READY TRIGGER
if(hasTouch()) {
	document.addEventListener("deviceready", onDeviceReady, false);
} else {
	$(document).ready(function() {  onDeviceReady(); });
}
function onDeviceReady() {
	window.deviceReady = true;
}
function isDeviceReady(action) {
	if(window.deviceReady == true) {
		if(action=="init") {
			if(hasTouch()) { $("body").css("opacity","0"); }
			diary = new Diary();
			diary.setup(startApp);
		} else if(action=="youraction2") {
		// do stuff
		}
	} else {
		window.setTimeout("isDeviceReady(\"" + action + "\");",100);
	}
}
//##///////////##//
//## START APP ##//
//##///////////##//
function startApp() {
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
/*
<div id="appHeader">\
	<div id="timerBlocks">\
		<div id="timerKcals"><p></p><span>' + LANG("CALORIES_AVALIABLE") + '</span></div>\
		<div id="timerDaily"><p></p><span>' + LANG("DAILY_CALORIES")     + '</span></div>\
	</div>\
</div>\
*/
$("body").html('\
<div id="appHeader"></div>\
<div id="appContent"></div>\
<ul id="appFooter">\
	<li id="tab1">' + LANG("STATUS")   + '</li>\
	<li id="tab2">' + LANG("DIARY")    + '</li>\
	<li id="tab3">' + LANG("PROFILE")  + '</li>\
	<li id="tab4">' + LANG("SETTINGS") + '</li>\
</ul>\
');
//#////////////#//
//# APP FOOTER #//
//#////////////#//
function appFooter(id) {
	$("ul#appFooter li").removeClass("selected");
	window.localStorage.setItem("app_last_tab",id);
	$("#" + id).addClass("selected");
	//SCROLLBAR
	if(!isMobile.iOS()) {
		//$("#appContent").css("overflow","hidden");
		setTimeout(function(){
			$("#appContent").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.4,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		},0);
	}
	//ACTION
	if(id == "tab1") { openStatus();   }
	if(id == "tab2") { openDiary();    }
	if(id == "tab3") { openProfile();  }
	if(id == "tab4") { openSettings(); }
	//NO 50ms FLICKER (android profile)
	appResizer(200);
}
//PRELOAD TAB1
if(!window.localStorage.getItem("app_last_tab")) {
	window.localStorage.setItem("app_last_tab","tab1");
}
//READ STORED
appFooter(window.localStorage.getItem("app_last_tab"));
//LISTEN FOR CLICKS
$("ul#appFooter li").on(touchstart, function(e) {
	window.location='#top';
	appFooter($(this).attr("id"));
});
//#////////////////////#//
//# RESIZE/ORIENTATION #//
//#////////////////////#//
function appResizer(time) {
	setTimeout(function() {
		$('body').height(window.innerHeight);
		//NO < 0
		var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height());
		//force scrolling ios
		if(isMobile.iOS()) { wrapperMinH = wrapperMinH + 1; }
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",wrapperMinH + "px");
		$('#pageslideFood').height(window.innerHeight - $('#appHeader').height());
		if(!isMobile.iOS()) { $("#appContent").getNiceScroll().onResize(); }
	 },time);
}
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
	//IF WINDOW > BODY (PREVENT KEYBOARD COLAPSE)
	if(window.innerHeight > $('body').height()) {
		//IOS re-scrolling bug
		$('#entryListWrapper').height( $('#entryListWrapper').height() + 1);
		$('#entryListWrapper').height( $('#entryListWrapper').height() - 1);
		appResizer(0);
	}
	//ALWAYS RESIZE NON-MOBILE BROWSER
	if(!hasTouch() && !isMobile.Android() && !isMobile.iOS()) {
		appResizer(0);
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
}
/////////////////////
// ADJUST ELEMENTS //
/////////////////////
var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
/*
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
$("#appHeader").after('<div class="editable" id="editableDiv">' + getKcalsItem + '</div>');
$("#editableDiv").css("height",$("#appHeader").height());
///////////
// IOS 7 //
///////////
if(/OS [7-9](.*) like Mac OS X/i.test(navigator.userAgent)) {
	$("body").addClass("ios7");
}
/////////////
// ANDROID //
/////////////
if(isMobile.Android()) {
	$("body").addClass("android");
}
////////////////////
// PRESET PROFILE //
////////////////////
if(!window.localStorage.getItem("#pA1B")) {
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
//############################//
//####    START WORKING   ####//
//############################//
afterShow(200);
//updateTimer();
//updateEntries();
//updateEntriesTime();
(function startTimer() {
	if(typeof updateTimer == 'function') {
		updateTimer();
		setTimeout(startTimer,99);
	}
})();
	//////////////////////
	// PAGESLIDE CLOSER //
	//////////////////////
	$("#appHeader,#editableDiv").on(touchstart, function(evt) {
		evt.preventDefault();
		//hide food
		if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
			$("#foodSearch").blur();
			$('#pageSlideFood').addClass('busy');
			$('#pageSlideFood').removeClass("open");
			$('#pageSlideFood').on('webkitTransitionEnd',function(e) {
				$('#pageSlideFood').removeClass('busy'); 
				//WIPE ON CLOSE
				$('#pageSlideFood').remove(); 
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
		$("#entryBody").blur();
	});
	$('#appHeader,#appContent,#entryListForm,#go,#entryListWrapper').on(tap, function(evt) {
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
				var timedBlur = new Date().getTime();
				var value = $(this).html();
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
						if(isNaN( $(this).val()) || $(this).val() == 0 || $(this).val() <= 1)    { this.value = resetValue; $("#editableDiv").html(resetValue); }
						if(this.value < 100 && !isNaN(this.value) && this.value > 1)             { this.value = 100;  $("#editableDiv").html(100);  }
						if(this.value > 9999)													{ this.value = 9999; $("#editableDiv").html(9999); }
						//filter zeros
						this.value = Math.round(Number(this.value));
						$("#editableDiv").html($(this).val());
						//IF ENTERED VALUE WAS OK, PASS IT
						window.localStorage.setItem(getKcalsKey,$(this).val());
						//IF MAIN VALUE IS SOMESHOW STILL BOGUS, RESET BOTH TO 2000
						if(isNaN(window.localStorage.getItem(getKcalsKey)) || window.localStorage.getItem(getKcalsKey) == 0 || window.localStorage.getItem(getKcalsKey) < 1) {
							window.localStorage.setItem(getKcalsKey,resetValue);
							$("#editableDiv").html(window.localStorage.getItem(getKcalsKey));
						}
						$(this).replaceWith(new_value);
						//update info inputs
						$("#CyclicInput1").val(window.localStorage.getItem("config_kcals_day_1"));
						$("#CyclicInput2").val(window.localStorage.getItem("config_kcals_day_2"));
						//WRITE TO DB
						window.localStorage.setItem(getKcalsKey,$(this).val());
						updateTimer();
						//updateEntriesTime();
						$("#editableBlock").remove();

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
////#//
} //#//
////#//

