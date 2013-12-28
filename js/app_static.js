////////////////////////
// DEVICE READY EVENT //
////////////////////////
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	document.addEventListener("deviceready", init, false);
	navigator.splashscreen.hide();
} else {
	init();
}
//$(document).ready(function() { init(); });
function init() {
	$("body").css("opacity","0");
	diary = new Diary();
	diary.setup(startApp);
}
//#///////////#//
//# START APP #//
//#///////////#//
function startApp() {
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$("body").html('\
<div id="appHeader"></div>\
<div id="appContent"></div>\
<ul id="appFooter">\
	<li id="tab1"></li>\
	<li id="tab2"></li>\
	<li id="tab3"></li>\
	<li id="tab4"></li>\
</ul>\
');
//#////////////#//
//# APP FOOTER #//
//#////////////#//
function appFooter(id) {
	$("ul#appFooter li").removeClass("selected");
	window.localStorage.setItem("app_last_tab",id);
	$("#" + id).addClass("selected");
	//RELOAD CONTAINER
	//$("#appContent").remove();
	//$("body").append("<div id='appContent'></div>");
	
	//DELAY CONTENT
	//$("#appContent").hide();
	//$('#appContent').css("-webkit-transition-timing-function","ease");
	//$('#appContent').css("-webkit-transition-duration",".09s");
	//$("#appContent").css("opacity","0");
	//setTimeout(function() {
	//$("#appContent").show();
	//},50);
	//setTimeout(function() {
	//	$("#appContent").css("opacity","1");
	//},0);
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
	//NO 50ms FLICKER
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
	e.preventDefault();
	e.stopPropagation();
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
		var wrapperMinH = (window.innerHeight) - (234 + $('#appHeader').height() + $('#appFooter').height());
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",wrapperMinH + "px");
		$('#pageslideFood').height(window.innerHeight - $('#appHeader').height());
		if(!isMobile.iOS()) { $("#appContent").getNiceScroll().onResize(); }
	 },time);
}
////////////
// ONLOAD //
////////////
appResizer(0);
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
	//ALWAYS RESIZE DESKTOP
	if(!hasTouch()) {
		appResizer(0);
	}
});
/////////////////////
// DEBUG INDICATOR //
/////////////////////
//ICONINFO GREEN
if(window.localStorage.getItem("config_debug") == "active") {
	//$("#iconInfo").css("color","#00cc00");
	$("#appFooter").addClass("appDebug");
}
//#########################//
//##    START WORKING    ##//
//#########################//
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
///////////////
// ANALYTICS //
///////////////
/*
if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
	var gaPlugin;
	gaPlugin = window.plugins.gaPlugin;
	gaPlugin.init(successHandler, errorHandler, "UA-46450510-1", 10);
	function successHandler(result) {}
	function errorHandler(error)	{}
}
*/
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
/////////////
$("#appHeader").after('<div class="editable" id="editableDiv">' + getKcalsItem + '</div>');
$("#editableDiv").css("height",$("#appHeader").height());
//$('#startDateBar').prepend("<div id='appVersion'>" + appVersion + "</div>");

//////////////////
// INTRO NOTICE //
//////////////////
	//$("#mailTo").on(touchstart,function(evt) {
	//	evt.preventDefault();
	//	evt.stopPropagation();
	//	window.location='mailto:support@mylivediet.com?Subject=MyLiveDiet%20-%20Support';
	//});
	//APP STORE ICONS ON DESKTOP
	//$('#entryListWrapper').append("<div id='appStore'><span class='ios'><img src='http://mylivediet.com/img/appstore_ios.png' /></span><span class='android'><img src='http://mylivediet.com/img/appstore_android.png' /></span></div");	
	//$(".ios img").on(touchstart,function(evt) {
	//	window.location='https://itunes.apple.com/us/app/mylivediet-realtime-calorie/id732382802?mt=8';
	//});
	//$(".android img").on(touchstart,function(evt) {
	//	window.location='https://play.google.com/store/apps/details?id=com.cancian.mylivediet';
	//});
	
	
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
			$('#entryListScroller').removeClass("food");
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

