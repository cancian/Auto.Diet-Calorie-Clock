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
		kcalsHtmlOutput += "<span id='subKcalsDay'><span class='bold'>" + eqPerDay + " </span></span>";
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
		kcalsHtmlOutput += "<span id='timerBalance'>" + kcalsInput + "</span>";
		kcalsHtmlOutput += "<span id='timerFood'>+1049</span>";
		kcalsHtmlOutput += "<span id='timerExercise'>-450</span>";
		
		
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

