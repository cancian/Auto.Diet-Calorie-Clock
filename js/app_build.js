/*########################################
####    HTML BUILDS ~ OPEN SETTINGS   ####
##########################################*/
function openSettings(string) {
	//RAW HTML
	var settingsHtml = '\
	<a name="top"></a>\
	<div id="settingsWrapper">\
		<ul id="settingsList">\
			<li id="optionMeasure">\
				<div class="contentToggleTitle">\
					<p class="contentTitle" id="contentToggleTitle">System of measurement<span>(height, weight etc.)</span></p>\
					<div id="tapSwitch">\
						<div id="leftOption"><span>imperial</span></div>\
						<div id="rightOption"><span>metric</span></div>\
					</div>\
				</div>\
			</li>\
			<li id="optionContact"><div>Contact Us</div></li>\
			<li id="optionAbout"><div>About</div></li>\
		</ul>\
		<div id="optionReset">Reset settings</div>\
	</div>';
	//#////////#//
	//# OUTPUT #//
	//#////////#//
	$("#appContent").html(settingsHtml);
	////////////////
	// ACTIVE ROW //
	////////////////
	$("ul#settingsList li").on(touchstart,function(evt) {
		$(this).addClass("activeRow");
		$(this).next().addClass("nextChild");
	});
	$("ul#settingsList li").on(touchend + " mouseout",function(evt) {
		$("li.activeRow").removeClass("activeRow");
		$("li.nextChild").removeClass("nextChild");
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
			alert.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmWipe, LANG("WIPE_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
		} else {
			if(alert(LANG("WIPE_DIALOG"))) { onConfirmWipe(1); } else { return false; }
		}
	});
	/////////////////////
	// SETTINGS: RESET //
	/////////////////////
	function onConfirmWipe(button) {
		if(button == 1) {
			diary.deSetup();
			updateTimer();
		}
	}
	// WIPE DIALOG
	$("#optionReset").on(touchend, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if(hasTouch()) {
			navigator.notification.confirm(LANG("ARE_YOU_SURE"), onConfirmWipe, LANG("WIPE_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
		} else {
			if(confirm(LANG("WIPE_DIALOG"))) { onConfirmWipe(1); } else { return false; }
		}
	});
	///////////////////////////
	// SETTINGS: UNIT TOGGLE //
	///////////////////////////
	if(window.localStorage.getItem("config_measurement") == "metric") {
		$("#rightOption").addClass("toggle");
		window.localStorage.setItem("config_measurement","metric");	
	} else {
		//METRIC AS DEFAULT FOR PORTUGUESE
		if(LANG("LANGUAGE") == "pt") {
			$("#rightOption").addClass("toggle");
			window.localStorage.setItem("config_measurement","metric");	
		} else {
			$("#leftOption").addClass("toggle");
			window.localStorage.setItem("config_measurement","imperial");
		}
	}
	// TOGGLE ACTIVE //
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
	});
}
/*#######################################
####    HTML BUILDS ~ OPEN STATUS    ####
########################################*/
function openStatus(string) {
	//RAW HTML
	var statusHtml = '\
	<a name="top"></a>\
	<div id="statusWrapper">\
		<div id="appStatusElapsed"></div>\
		<div id="appStatusWeight"><div><p>0.0000000kg</p><span>weight loss</span></div></div>\
		<div id="appStatusBalance"></div>\
		<div id="appStatusIntake"></div>\
		<div id="appStatusAddLeft"><div>+ food</div></div>\
		<div id="appStatusAddRight"><div>+ exercise</div></div>\
		<div id="appStatusFix">\
			<div id="startDateBar"><span id="startDateSpan"><input id="startDate" tabindex="-1" readonly /></span></div>\
			<div id="appStatusToggle"></div>\
			<div id="appStatus">\
				<div id="appStatusTitle"></div>\
				<div id="appStatusReload"></div>\
				<div id="appStatusArrow"></div>\
			</div>\
		</div>\
	</div>';
	//#////////#//
	//# OUTPUT #//
	//#////////#//
	//HTML
	$("#appContent").html(statusHtml);
	//////////////
	// HANDLERS //
	//////////////
	$("#appStatusTitle").on(touchend,function(evt) {
		if(window.localStorage.getItem("appStatus") == "running") {
			function appReset(button) {
				//ON CONFIRM
				if(button == 1) {
					$("#appStatus").removeClass("reset");
					$("#appStatus").addClass("start");
					$("#appStatusTitle").html("start");
					window.localStorage.removeItem("appStatus");
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
			$("#appStatus").removeClass("start");
			$("#appStatus").addClass("reset");
			$("#appStatusTitle").html("reset");
			window.localStorage.setItem("appStatus","running");
		}
	});
	//#/////////////#//
	//# ADD BUTTONS #//
	//#/////////////#//
	$("#appStatusAddLeft").on(touchstart,function(evt) {
		evt.preventDefault();
		window.localStorage.setItem("searchType","food");		
		$(document).trigger("pageReload");
	});
	$("#appStatusAddRight").on(touchstart,function(evt) {
		evt.preventDefault();
		window.localStorage.setItem("searchType","exercise");
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
		display: 'modal',
		stepMinute: 1,
		animate: 'none',
		mode: 'scroller'
    });
	/////////////////
	// RELOAD ICON //
	/////////////////
	$("#appStatusReload").on(tap,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		$('#startDateBar').hide();
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

//fillDate((window.localStorage.getItem("config_start_time")),'startDate');
//$('#startDate').scroller('setDate',new Date($("#startDate").val()), true);
$('#startDate').scroller('setDate',new Date(Number(window.localStorage.getItem("config_start_time"))), true);
//$('#startDate').show();
return false;
//#appStatus
//#appStatusToggle		{ opacity: .075; display: inline-block; position: absolute; bottom: 0; right: 0; width: 48px; height: 45px; display: inline-block; color: #000; line-height: 49px; background-color: transparent; }
//$('#startDate').mobiscroll('show'); 
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
				//window.localStorage.setItem("config_start_time",Number(Date.parse($("#startDate").val()) + ((((new Date()).getTimezoneOffset()) * 60 * 1000))) );
			} else {
				//REVERT TO STORED
				//fillDate(Number(window.localStorage.getItem("config_start_time")),'startDate');
				//$('#startDate').scroller('setDate',new Date(Number(window.localStorage.getItem("config_start_time"))), true);
//fillDate((window.localStorage.getItem("config_start_time")),'startDate');
//$('#startDate').scroller('setDate',new Date($("#startDate").val()), true);
			}
		onChange = 0;
		updateTimer();
		updateEntries();
		//updateEntriesTime();
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
	// AUTOCLOSE WRAPPER //
	/*
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
*/

/*
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

*/	
	
	
	
	
	
	
	
	
	
	

	///////////////
	// PAGE LOAD //
	///////////////
	if(window.localStorage.getItem("appStatus") == "running") {
		$("#appStatus").removeClass("start");
		$("#appStatus").addClass("reset");
		$("#appStatusTitle").html("reset");
	} else {
		$("#appStatus").removeClass("reset");
		$("#appStatus").addClass("start");
		$("#appStatusTitle").html("start");
	}
}
/*############################
## HTML BUILDS ~ OPEN DIARY ##
############################*/
function openDiary(string) {
diary.getEntries(function(data) {
//RAW HTML
var diaryHtml = ""

diaryHtml += '\
<a name="top"></a>	\
<div id="entryListForm">\
<div id="sliderWrapper">\
<input id="slider" type="range" min="-750" max="750" step="25" value="0" data-carpe-targets="entryTitle" data-carpe-decimals="0" /></div>\
<div id="sliderNum"><input type="text" id="entryTitle" readonly value="0" />kcals</div>\
<div id="sliderNeg"><span></span>' + LANG('EXERCISE') + '</div>\
<div id="sliderPos">' + LANG('FOOD') + '<span></span></div>\
<input type="text" id="entryBody" placeholder="' + LANG('DESCRIPTION') + '" tabindex="-1" />\
<div id="entryBodySearch"><div></div></div>\
<select id="entryTime" name="entryTime" tabindex="-1">\
					<option value="0">' + LANG('NOW') + '</option>\
					<option value="1">1 ' + LANG('HOUR_AGO') + '</option>\
					<option value="2">2 ' + LANG('HOURS_AGO') + '</option>\
					<option value="3">3 ' + LANG('HOURS_AGO') + '</option>\
					<option value="4">4 ' + LANG('HOURS_AGO') + '</option>\
					<option value="5">5 ' + LANG('HOURS_AGO') + '</option>\
					<option value="6">6 ' + LANG('HOURS_AGO') + '</option>\
					<option value="7">7 ' + LANG('HOURS_AGO') + '</option>\
					<option value="8">8 ' + LANG('HOURS_AGO') + '</option>\
					<option value="9">9 ' + LANG('HOURS_AGO') + '</option>\
					<option value="10">10 ' + LANG('HOURS_AGO') + '</option>\
					<option value="11">11 ' + LANG('HOURS_AGO') + '</option>\
					<option value="12">12 ' + LANG('HOURS_AGO') + '</option>\
					<option value="13">13 ' + LANG('HOURS_AGO') + '</option>\
					<option value="14">14 ' + LANG('HOURS_AGO') + '</option>\
					<option value="15">15 ' + LANG('HOURS_AGO') + '</option>\
					<option value="16">16 ' + LANG('HOURS_AGO') + '</option>\
					<option value="17">17 ' + LANG('HOURS_AGO') + '</option>\
					<option value="18">18 ' + LANG('HOURS_AGO') + '</option>\
					<option value="19">19 ' + LANG('HOURS_AGO') + '</option>\
					<option value="20">20 ' + LANG('HOURS_AGO') + '</option>\
					<option value="21">21 ' + LANG('HOURS_AGO') + '</option>\
					<option value="22">22 ' + LANG('HOURS_AGO') + '</option>\
					<option value="23">23 ' + LANG('HOURS_AGO') + '</option>\
					<option value="24">1 ' + LANG('DAY_AGO') + '</option>\
					<option value="48">2 ' + LANG('DAYS_AGO') + '</option>\
					<option value="72">3 ' + LANG('DAYS_AGO') + '</option>\
				</select>\
<div id="entrySubmit">' + LANG('ADD_ENTRY') + '</div>\
			</div>\
<div id="entryListWrapper">\
<div class="heading" id="go">' + LANG('ACTIVITY_LOG') + '\
            </div>\
				<div id="entryList">';
		///////////////////////
		// updateEntries SQL //
		///////////////////////
		var s = "";
		var p = "";
		var rowClass;
		var lastRow = "";
		var lastId  = "";
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
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='" + rowClass + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>kcals</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
			// ROW++
			s += dataHandler;
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
		</div>\
	</div>\
';
//#////////#//
//# OUTPUT #//
//#////////#//
//HTML
pageLoad("#appContent",diaryHtml);
$(document).trigger("sliderInit");
//$(window).trigger("resize");
//$("#appContent").html('');
//$("#appContent").html();
//alert(diaryHtml);
///////////////////
// RESIZE HEIGHT //
///////////////////
//SLIDER
//$(window).trigger("orientationchange");

//ENTRYLIST
//alert(updateEntries('l'));
//#//////////#//
//# HANDLERS #//
//#//////////#//
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
			//SCROLLBAR UPDATE			
			if(!isMobile.iOS()) {
				$("#appContent").css("overflow","hidden");
				setTimeout(function(){
					$("#appContent").getNiceScroll().onResize();
				},200);
			}
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
		if(!document.getElementById('entryTitle')) { return; }
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
	//////////////////
	// DEV KEYCODES //
	//////////////////
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
	////////////////////////
	// QUICK FOCUS INPUTS //
	////////////////////////
	$('#entryBody').on(touchstart, function(evt) {
		//evt.preventDefault();
		evt.stopPropagation();
		//android keyboard focus
		//$("#entryBody").focus();		
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
	//SUPERBORDER FOCUS (IOS)
	if(isMobile.iOS()) {
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
			<label>Your gender</label>\
    		<span class="selectArrow">\
				<select id="pA1B" tabindex="1" onchange="recalc_onclick(&#39;pA1B&#39;)" size="1" name="pA1B">\
					<option value="Male" selected="selected">Male</option>\
					<option value="Female">Female</option>\
				</select>\
			</span>\
		</div>\
		<div class="calcRow">\
			<label>Your height</label>\
			<input type="hidden" class="ee101" id="pA2B" onblur="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA2B&#39;)" tabindex="2" size="8" value="70" name="pA2B" />\
			<input type="number" tabindex="2" id="feet" name="feet" value="5" onchange="document.getElementById(&#39;pA2B&#39;).value = (Number(document.getElementById(&#39;feet&#39;).value) * 12) + (Number(document.getElementById(&#39;inches&#39;).value));"><input tabindex="2" type="number" id="inches" name="inches" value="10" size="2" onchange="document.getElementById(&#39;pA2B&#39;).value = (Number(document.getElementById(&#39;feet&#39;).value) * 12) + (Number(document.getElementById(&#39;inches&#39;).value));">\
		    <span class="selectArrow">\
				<select id="pA2C" tabindex="3" onchange="recalc_onclick(&#39;pA2C&#39;)" name="pA2C">\
					<option value="centimetres">centimeters</option>\
					<option value="inches" selected="selected">feet/inches</option>\
				</select>\
			</span>\
			<input class="ee101" id="pA2D" type="hidden" readonly name="pA2D" />\
		</div>\
		<div class="calcRow">\
			<label>Your weight</label>\
			<input type="number" id="pA3B" onblur="this.value=eedisplayFloat(eeparseFloat(this.value));recalc_onclick(&#39;pA3B&#39;)" tabindex="4" size="8" value="160" name="pA3B" />\
		    <span class="selectArrow">\
				<select id="pA3C" tabindex="5" onchange="recalc_onclick(&#39;pA3C&#39;)" size="1" name="pA3C">\
					<option value="kilograms">kilograms</option>\
					<option value="pounds" selected="selected">pounds</option>\
				</select>\
			</span>\
		    <input class="ee101" id="pA3D" type="hidden" readonly size="4" value="0" name="pA3D" />\
		</div>\
		<div class="calcRow">\
			<label>Your age</label>\
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
	<label >Your activity</label><span class="selectArrow"><select id="pA5B" tabindex="7" onchange="recalc_onclick(&#39;pA5B&#39;)" size="1" name="pA5B">\
		<option selected="selected" value="Sedentary (little or no exercise, desk job)">Sedentary: Mostly sitting down (desk job, designer)</option>\
		<option value="Lightly active (light exercise/sports 1-3 days/wk)">Lightly Active: Occasionally sitting (teacher, salesman)</option>\
		<option value="Moderately active (moderate exercise/sports 3-5 days/wk)">Active: Walking most of the time (waitress, mailman)</option>\
		<option value="Very active (hard exercise/sports 6-7 days/wk)">Very Active: Physically hard work (construction worker)</option></select></span>\
</div>\
<div class="invisible"><input type="checkbox" checked="checked" value="ON" name="automatic_recalc" /><label>Automatic recalculation</label></div>\
<div class="invisible"><input onclick="recalc_onclick(&#39;&#39;)" type="button" value="Recalculate" name="do_recalc" id="do_recalc" /></div>\
<div class="invisible"><label>BMR</label><input class="ee101" id="pA6B" readonly size="8" value="0" name="pA6B" /></div>\
<div class="invisible"><h2>Nutrition requirements</h2></div>\
\
<h2 id="mantain"><span>A.</span> To maintain current weight:</h2>\
<div class="tapSelect"><input class="ee101" id="pA7B" readonly size="7" value="0" name="pA7B" /><span class="bold">kcals / day</span></div>\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8B" readonly size="7" value="0" name="pA8B" />cal =<input id="pA8D" readonly size="6" value="0" name="pA8D" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9B" readonly size="7" value="0" name="pA9B" />cal =<input id="pA9D2" readonly size="6" value="0" name="pA9D" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10B" readonly size="7" value="0" name="pA10B" />cal =<input class="ee101" id="pA10D2" readonly size="6" value="0" name="pA10D" />gm</div>\
\
<h2><span>B.</span> To lose weight by:</h2>\
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
		<option value="kilograms">kilograms</option>\
		<option value="pounds" selected="selected">pounds</option>\
	</select></span>\
	<span>per week</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7F" readonly size="7" value="0" name="pA7F" /><span class="bold">kcals / day</span></div>\
<div class="invisible">   Carbohydrates (55%)<input class="ee101" id="pA8F" readonly size="7" value="0" name="pA8F" />cal =<input class="ee101" id="pA8H2" readonly size="7" value="0" name="pA8H" />gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9F" readonly size="7" value="0" name="pA9F" />cal =<input class="ee101" id="pA9H2" readonly size="7" value="0" name="pA9H" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10F" readonly size="7" value="0" name="pA10F" />cal =<input class="ee101" id="pA10H2" readonly size="7" value="0" name="pA10H" />gm</div>\
\
<h2><span>C.</span> To gain weight by:</h2>\
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
		<option value="kilograms">kilograms</option>\
		<option value="pounds" selected="selected">pounds</option>\
	</select></span>\
	<span>per week</span>\
</div>\
<div class="tapSelect"><input class="ee101" id="pA7L" readonly size="7" value="0" name="pA7L" /><span class="bold">kcals / day</span></div>\
\
<div class="invisible">Carbohydrates (55%)<input class="ee101" id="pA8L" readonly size="7" value="0" name="pA8L" />cal =<input class="ee101" id="pA8N2" readonly size="7" value="0" name="pA8N" />\gm</div>\
<div class="invisible">Proteins (15%)<input class="ee101" id="pA9L" readonly size="7" value="0" name="pA9L" />cal =<input class="ee101" id="pA9N2" readonly size="7" value="0" name="pA9N" />gm</div>\
<div class="invisible">Fats (30%)<input class="ee101" id="pA10L" readonly size="7" value="0" name="pA10L" />cal =<input class="ee101" id="pA10N2" readonly size="7" value="0" name="pA10N" />gm</div>\
</form>\
</div>';
//#////////#//
//# OUTPUT #//
//#////////#//
$("#appContent").html(profileHtml);
//#//////////#//
//# HANDLERS #//
//#//////////#//
//input validate
$("#feet,#inches,#pA3B").on("keypress", function(evt) {
	//max
	if(parseInt($(this).val()) > 9000) {
		return false;
	}
	//num only
	return isNumberKey(evt);
});
///////////////
// TAP VALUE //
///////////////
$("#pA7B,#pA7F,#pA7L").on(touchend, function(evt) {
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
		$(this).stop().animate({ backgroundColor: "rgba(255,255,0,0.2)" }, 1).animate({ backgroundColor: "rgba(100,100,100,0.1)" },450);
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

$("#calcForm").on(touchend, function(evt) {
/*
	if(evt.target.id == "") {
		writeCalcValues();
		$("#formc input").blur();
		$("#formc select").blur();
		return;
	} else if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
		evt.preventDefault();
		evt.stopPropagation();
		$("#" + evt.target.id).focus();
	}
*/

	/*
	evt.preventDefault();
	//evt.stopPropagation();
	if(evt.target.id == "") {

//		$("#pA1B,#pA2B,#pA2C,#pA3B,#pA3C,#pA4B,#pA5B,#pA6G,#pA6H,#pA6M,#pA6N,#feet,#inches").blur();
		writeCalcValues();
		$("#formc input").blur();
		$("#formc select").blur();
//		$("input,select").blur();

	} else {
		$("#" + evt.target.id).focus();
	}	
*/


	if(evt.target.id == "") {
	//if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
		evt.preventDefault();
		evt.stopPropagation();
	//}
//		$("#pA1B,#pA2B,#pA2C,#pA3B,#pA3C,#pA4B,#pA5B,#pA6G,#select,#pA6M2,#pA6N,#feet,#inches").blur();

		writeCalcValues();
		$("#calcForm input").blur();
		$("#calcForm select").blur();
//		$("input,select").blur();

	} else {
	}
});
//////////////////////
// ONCHANGE TRIGGER //
//////////////////////
$("#formc").change(function() {
	writeCalcValues();
});
$("#formc").blur(function() {
	writeCalcValues();
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

////////////////////
// SWAP FEET/INCH //
////////////////////
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
}
$("#pA2C").on("change",function(evt) {
	feetInchesToMetric();
});

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
}

