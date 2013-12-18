////////////////////////
// DEVICE READY EVENT //
////////////////////////
$(document).ready(function() {
	//$("body").css("opacity","0");
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
//#////////////#//
//# INDEX.HTML #//
//#////////////#//
$("body").html('\
<ul id="appFooter">\
	<li id="tab1"></li>\
	<li id="tab2"></li>\
	<li id="tab3"></li>\
	<li id="tab4"></li>\
	<li id="tab5"></li>\
</ul>\
<div id="appHeader"></div>\
<div id="appContent"></div>\
');
//#////////////////////#//
//# RESIZE/ORIENTATION #//
//#////////////////////#//
//FIX BODY HEIGHT
$('body').height(window.innerHeight);
//RECALC ON ORIENTATION CHANGE (keyboard focus)
$(window).on("orientationchange", function(evt) {
	$('body').height(window.innerHeight);
	setTimeout(function() {
		$('body').height(window.innerHeight);
	},200);
});
//ALWAYS RESIZE DESKTOP
$(window).on("resize", function(evt) {
	if(!hasTouch()) {
		$('body').height(window.innerHeight);
	}
});



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
		//$('#pageSlideInfo').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		//$('#pageSlideCalc').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
		//$('#pageSlideFood').css("height",(window.localStorage.getItem("absWindowHeight") - ($('#timer').height())) + "px");
	//});

	//$(window).on(mobileBrowserWindow, function(evt) {
//	$(window).on("orientationchange" + resizeDesktop, function(evt) {
		//update if different than stored
	//	if(getOrientation() != window.localStorage.getItem("absOrientation")) {
	//		window.localStorage.setItem("absOrientation",getOrientation());
			//switch values
	//		var prevHeight = window.localStorage.getItem("absWindowHeight");
	//		var prevWidth  = window.localStorage.getItem("absWindowWidth");
	//		window.localStorage.setItem("absWindowHeight",prevWidth);
	//		window.localStorage.setItem("absWindowWidth",prevHeight);
			//$("#entryBody").val(window.localStorage.getItem("absWindowHeight") + " x " + window.localStorage.getItem("absWindowWidth"));
		//reajust num
//		adjustPos(0);
		//resize input
//		$('#entryBody').css("left","16px");
//		$('#entryBody').css("right","16px");
//		$('#entryBody').css("borderColor","transparent");
		//main
		//$('#entryListWrapper').css("height","auto");
		//RESIZE
		//RESIZE
		//suspend animation
		//$('#entryListWrapper').css("min-height",((window.innerHeight) - ((234 + scrollPad + $('#timer').height()))) + "px");
		//$('#entryListScroller').css("-webkit-transition-duration","0");
		//$('#entryListScroller').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		//setTimeout(function() { $('#entryListScroller').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		//$('#pageSlideInfo').css("-webkit-transition-duration","0");
		//$('#pageSlideInfo').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		//setTimeout(function() { $('#pageSlideInfo').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		//$('#pageSlideCalc').css("-webkit-transition-duration","0");
		//$('#pageSlideCalc').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
		//setTimeout(function() { $('#pageSlideCalc').css("-webkit-transition-duration",".25s");},0);
		//suspend animation
		//$('#pageSlideFood').css("-webkit-transition-duration","0");
		//$('#pageSlideFood').css("height",($('#entryListScroller').height() - (61)) + "px");
		//setTimeout(function() { $('#pageSlideFood').css("-webkit-transition-duration",".25s");},0);
		//adjust results scroller
		//$('#foodList').css("height",($('#entryListScroller').height() - (61)) + "px");
	//	}
	//food input
	//$('#foodSearch').css("left","0px");
	//$('#foodSearch').css("right","0px");
	//$('#foodSearch').css("margin-bottom","1px");

	/////////////////////////
	// fix scrolling delay //
	/////////////////////////
	/*
	scrollFix = setTimeout(function() {
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) + (1)) + "px");
		$('#entryListWrapper').css("min-height",(Number($('#entryListWrapper').css("height").replace("px","")) - (1)) + "px");
		//$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",((window.innerHeight) - ((234 + scrollPad + $('#timer').height()))) + "px");
		$('#entryListScroller').css("height",((window.innerHeight) - ($('#timer').height())) + "px");
	},300);
	*/
//});




//#///////////////#//
//# DEFINE LAYOUT #//
//#///////////////#//
$("#appHeader").append('<div id="timer"></div>');
//#////////////#//
//# APP FOOTER #//
//#////////////#//
function openSettings() { $("#appContent").html('openSettings '); }
function openInfo()	 { $("#appContent").html('openInfo ');     }
function appFooter(id) {
	$("ul#appFooter li").removeClass("selected");
	window.localStorage.setItem("app_last_tab",id);
	$("#" + id).addClass("selected");
	//RELOAD CONTAINER
	$("#appContent").remove();
	$("body").append("<div id='appContent'></div>");
	//SCROLLBAR
	if(!isMobile.iOS()) {
		$("#appContent").css("overflow","hidden");
		setTimeout(function(){
			$("#appContent").niceScroll({touchbehavior:true,cursorcolor:"#000",cursoropacitymax:0.4,cursorwidth:4,horizrailenabled:false,hwacceleration:true});
		},200);
	}
	//ACTION
	if(id == "tab1") { openDiary();    }
	if(id == "tab2") { openProfile();  }
	if(id == "tab3") { openSettings(); }
	if(id == "tab4") { openInfo();	  }
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
	appFooter($(this).attr("id"));
});











///////////////////
// START WORKING //
///////////////////
afterShow(0);
updateTimer();
//updateEntries();
//updateEntriesTime();
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

	var scrollPad = 0;
	/////////////////
	// IOS VERSION //
	/////////////////
/*
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
//			document.getElementById('entryListScroller').style.WebkitOverflowScrolling = 'touch';
			//stuff...
		}
*/
if(hasTouch()) {
	////////////
	// MOBILE //
	////////////
	//set fixed height
	//$('#entryListWrapper').css("min-height",                       ((window.innerHeight) - (234 + scrollPad + $('#timer').height())) + "px");
	//$('#entryListScroller').css("height",                          ((window.innerHeight) - (      $('#timer').height())) + "px");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",((window.innerHeight) - (      $('#timer').height())) + "px");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
	/////////////
	// ANDROID //
	/////////////
	if(isMobile.Android()) {
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","absolute");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");
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
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("position","fixed");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top","0");	
	//set fixed height  
	//$('#entryListWrapper').css("min-height",                       ((window.innerHeight) - (234 + scrollPad + $('#timer').height())) + "px");
	//$('#entryListScroller').css("height",                          ((window.innerHeight) - (      $('#timer').height())) + "px");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("height",((window.innerHeight) - (      $('#timer').height())) + "px");
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("top",   ($('#timer').height()) + "px");
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
	//$('#entryListWrapper').append("<div id='appStore'><span class='ios'><img src='http://mylivediet.com/img/appstore_ios.png' /></span><span class='android'><img src='http://mylivediet.com/img/appstore_android.png' /></span></div");	
	//$(".ios img").on(touchstart,function(evt) {
	//	window.location='https://itunes.apple.com/us/app/mylivediet-realtime-calorie/id732382802?mt=8';
	//});
	//$(".android img").on(touchstart,function(evt) {
	//	window.location='https://play.google.com/store/apps/details?id=com.cancian.mylivediet';
	//});
	}
//}
// PRELOAD SIDE MENUS
setTimeout(function(){
	//$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	//$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
	//$.get("calc_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	//$.get("info_" + LANG("LANGUAGE") + ".html", function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
},1000);
//$.get("food.html", function(data) { $("#pageSlideFood").html("<div id='sideMenuFood'>" + data + "</div>"); });







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




////#//
} //#//
////#//

