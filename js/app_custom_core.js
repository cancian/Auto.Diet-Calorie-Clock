//#############################################################//
//##                      CUSTOM CORE                        ##//
//#############################################################//
////////////////////////////
// APP TIMER REFRESH DATA //
////////////////////////////
function appTimer(id,content) {
	var kcalsType  = content[0];
	var kcalsInput = content[1];
	var kcalsAll   = content[2];
	var currentDay = content[3];
	var getKcalsKey  = "config_kcals_day_0";	
	var getKcalsItem = window.localStorage.getItem("config_kcals_day_0");
	var eqPerDay     = window.localStorage.getItem("config_kcals_day_0");
	if(kcalsType == "cyclic") {
		if(currentDay == "d") {
			getKcalsKey  = "config_kcals_day_2";
			getKcalsItem = window.localStorage.getItem("config_kcals_day_2");
			eqPerDay     = window.localStorage.getItem("config_kcals_day_2");
		} else {
			getKcalsKey  = "config_kcals_day_1";		
			getKcalsItem = window.localStorage.getItem("config_kcals_day_1");
			eqPerDay     = window.localStorage.getItem("config_kcals_day_1");
		}
	}
	//STATUS BAR COLOR
	var status;
	var cssClass;
	var cssOver = "";
	var statusStop;
	var lDeficit  = LANG.DEFICIT[lang];
	var lSurplus  = LANG.SURPLUS[lang];
	var lBalanced = LANG.BALANCED[lang];
	var limit1    = parseInt(window.localStorage.getItem("config_limit_1"));
	var limit2    = parseInt(window.localStorage.getItem("config_limit_2"));
	//STATUSES (RELATIVE)
         if(kcalsInput >  9999 )      { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; kcalsInput =  9999.99; }
	else if(kcalsInput < -9999 )      { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; kcalsInput = -9999.99; }
//	else if(kcalsInput > eqPerDay * .50) { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; }
//	else if(kcalsInput < eqPerDay *-.50) { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; }
//	else if(kcalsInput > eqPerDay * .25) { status = lDeficit;  cssClass = "deficit";  }
//	else if(kcalsInput < eqPerDay *-.25) { status = lSurplus;  cssClass = "surplus";  } 
	else if(kcalsInput > limit2)   { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; }
	else if(kcalsInput < limit1)   { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; }
	else if(kcalsInput > limit2/2) { status = lSurplus;  cssClass = "surplus";  }
	else if(kcalsInput < limit1/2) { status = lDeficit;  cssClass = "deficit";  }
	else                           { status = lBalanced; cssClass = "balanced"; }
	///////////////////
	// UPDATE HEADER //
	///////////////////
	//global
	timerKcals = kcalsInput;
	//$("#timerKcals p").html(kcalsInput);
	//$("#timerDaily p").html(eqPerDay);  
	var kcalsHtmlOutput = "";
	kcalsHtmlOutput     += "<div id='timerBlocks'>";
	kcalsHtmlOutput     += "<div id='timerKcals'>"   + kcalsInput + "<span>" + LANG.CALORIC_BALANCE[lang] + "</span></div>";
	kcalsHtmlOutput     += "<div id='timerDaily'>"   + eqPerDay   + "<span>" + LANG.DAILY_CALORIES[lang] + "</span></div>"; //" + LANG.KCAL[lang] + " / " + LANG.DAY[lang] + "
	//trial notice
	if(!isPaid()) {
		if(daysLeft == 0) {
			if(noteContent == '') {
				noteContent = LANG.EVALUATION_EXPIRED[lang];
			}
		} else {
			if(noteContent == '') {
				noteContent = LANG.EVALUATION_VERSION[lang];
			}
		}
		kcalsHtmlOutput += "<div id='timerTrial'>" + noteContent + "</div>";
	}
	kcalsHtmlOutput     += "</div>";
	//REPLACE
	appHeader = kcalsHtmlOutput;
	//STATUS
	if(!$("body").hasClass(cssClass) || !$("#appHeader").hasClass(cssClass) || !$("#appStatusBalance").hasClass(cssClass)) {
		$("body,#appHeader,#appStatusBalance").addClass(cssClass);
		if(cssClass != "balanced") { 
			$("body,#appHeader,#appStatusBalance").removeClass("balanced");
		}
		if(cssClass != "deficit") { 
			$("body,#appHeader,#appStatusBalance").removeClass("deficit");
		}
		if(cssClass != "surplus") { 
			$("body,#appHeader,#appStatusBalance").removeClass("surplus");
		}
		if(cssOver != "over") { 
			$("body,#appHeader,#appStatusBalance").removeClass("over");
		}
	}
	if(cssOver == "over") {
		if(!$("body").hasClass("over") || !$("#appHeader").hasClass("over") || !$("#appStatusBalance").hasClass("over")) {
			$("body,#appHeader,#appStatusBalance").addClass("over");
		}
	}
	//ERROR CSS
	if(Math.abs(kcalsInput) >= 9999) {
		if(!$("body").hasClass("error")) {
		$("body").addClass("error");
		}
	} else {
		if($("body").hasClass("error")) {
			$("body").removeClass("error");	
		}
	}
	///////////////////////
	// UPDATE APP STATUS //
	///////////////////////
	if(window.localStorage.getItem("appBalance") != status) {
		appBalance = status;
		window.localStorage.setItem("appBalance",status);
	}
	if(appBalanceOver != cssOver) {		
		appBalanceOver = cssOver;
		window.localStorage.setItem("cssOver",cssOver);
	}
	function updateStatus() {
		if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
		if($("#appStatusBalance div p").html() != window.localStorage.getItem("appBalance")) {
			$("#appStatusBalance div p").html(window.localStorage.getItem("appBalance"));
		}
		balanceMeter(kcalsInput);
		getElapsed();
	}
	//ios flicker, who knows why
	if(isMobile.iOS()) {
		setTimeout(updateStatus,0);
	} else {
		updateStatus();
	}
	/////////////////////////////////////
	// CHECK DAY CHANGE, ADJUST INTAKE //
	/////////////////////////////////////
	if(!window.localStorage.getItem("lastToday")) {
		window.localStorage.setItem("lastToday",DayUtcFormat(new Date().getTime()));
	}
	if(window.localStorage.getItem("lastToday") != DayUtcFormat(new Date().getTime())) {
		if(window.localStorage.getItem("config_kcals_type") == "cyclic")  {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				$("#editableDiv").html(window.localStorage.getItem("config_kcals_day_2"));
			} else {
				$("#editableDiv").html(window.localStorage.getItem("config_kcals_day_1"));
			}
		}
		window.localStorage.setItem("lastToday",DayUtcFormat(new Date().getTime()));
		updateTodayOverview();
		intakeHistory();
	}
	//////////////////////////////////////////////////
	// self adjust refresh rate based on perfomance //
	//////////////////////////////////////////////////
	var timeWait = timerDiff;
	timerDiff = (((new Date().getTime()) - timerPerf) * 2);
	timerDiff = Math.round((timerDiff/2) + (timerWait/2));
	
	if(isMobile.Windows()) {
		timerDiff = timerDiff*5;
	} else {
		timerDiff = timerDiff*1.54321;		
	}
	if(timerDiff > 800) { timerDiff = 800; }
	if(timerDiff < 200) { timerDiff = 200; }
	/////////////////////
	// pre-show reward //
	/////////////////////
	if(opaLock < 2) {
		opaLock++;
		if(opaLock == 2) {
			$('body').addClass('started');
			$('body').removeClass('unloaded');
			$('body').css("opacity","1");
			if(isMobile.iOS() && typeof navigator.splashscreen !== 'undefined') {
				navigator.splashscreen.hide();
			}
		}
	}
}
//#////////////////////////#//
//# *LINEAR* TIME TO KCALS #//
//#////////////////////////#//
function timeToKcals(startTime) {
	var now             = (new Date()).getTime();
	var timeSinceStart  = (now - startTime) / 1000;
	var kcalsPerDay     = window.localStorage.getItem("config_kcals_day_0");
	var KcalsTimeRatio  = 60*60*24 / kcalsPerDay;
	//var kcalsSinceStart = Math.floor((timeSinceStart / KcalsTimeRatio)*31)*(-1);
	//var kcalsSinceStart = ((timeSinceStart / KcalsTimeRatio)*-1);	
	var kcalsSinceStart = ((timeSinceStart / KcalsTimeRatio)*-1);
	if(window.localStorage.getItem("appStatus") != "running") {
		kcalsSinceStart = 0;
	}
	
	var kcalsEntrySum   = Number(window.localStorage.getItem("config_entry_sum"));

	var content = [];
		content.push("simple");
		//content.push(((kcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2));
		content.push(((kcalsSinceStart/1) + (kcalsEntrySum)).toFixed(2));
		content.push(kcalsSinceStart);
	return content; // ((kcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
}
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
	//var todaysTime = Date.parse(DayUtcFormat(new Date())); //Date.parse(new Date(monthName + " " +  new Date().getDate() + ", " + new Date().getFullYear()));
	var todaysTime = Date.UTC(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
	//var todaysTime = Date.parse(moment().format("MMMM DD, YYYY"));
	//var todaysTime = Date.parse(moment().format('LL'));
	// IF (START DATE) < (TIME ELAPSED TODAY), DO NOT COUNT FROM TODAYS START TIME, BUT FROM DIET START TIME
	if((now - startTime) > (todaysTime - startTime) && (now - startTime) < day ) {
		todaysTime = now;
	}
	//DAY NAMES
	var nameA      = "plateau in";
	var nameB      = "diet plateau";
	var nameC      = "plateau out";
	var nameD      = "carb up";
	//CALORIC INPUT
	var intakeA    = window.localStorage.getItem("config_kcals_day_1");
	var intakeB    = intakeA;
	var intakeC    = intakeA;
	var intakeD    = window.localStorage.getItem("config_kcals_day_2");
	//CALORIC INPUT
	//var intakeA    = 1440; 
	//var intakeB    = 1440;
	//var intakeC    = 1440;
	//var intakeD    = 1440*2; //2880;
	// DIET START DATE
	var dietStartTime         = startTime; //window.localStorage.getItem("config_start_time"); //startTime; //Date.parse("August 13, 2013") - (0*3600*1000) + (0*60*1000) - (((new Date().getTimezoneOffset()) * 60 * 1000));
	// CYCLE VARS
	var timeSinceStarted      = now - dietStartTime;
	var daysSinceStarted      = timeSinceStarted / day;
	var wholeDaysSinceStarted = Math.floor(daysSinceStarted);
	var partialDayTimeLeft    = daysSinceStarted - wholeDaysSinceStarted;
	var timeElapsedToday      = now - todaysTime;
	var timeElapsedFirstDay   = (timeSinceStarted) - (wholeDaysSinceStarted * day) - (timeElapsedToday);
	var timeElapsedWholeDays  = (wholeDaysSinceStarted * day);
	////////////////////////////////
	// ABSOLUTE CURRENT CYCLE DAY // ~ absolute 0 messes offset, use equivalent date parse
	//////////////////////////////// //DEFINE DAYS SINCE absolute 0, LOOPING ABCD (15930~ days)
	var cycleDay = "a";
	//console.log(new Date(Date.UTC(2012,1,5)));
	//console.log(new Date(Date.parse("January 05, 2012")));	
	for(var dietDay = Date.UTC(2009,1,1) + ((((new Date()).getTimezoneOffset()) * 60 * 1000)); dietDay < now; dietDay = dietDay + day) {
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
	// CYCLE *IF* WE HAVE BEEN DIETING FOR MORE THAN A DAY
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
	var kcalsOutput = (allKcalsSinceStart) + (kcalsEntrySum);
	
	kcalsOutput = (Math.round(kcalsOutput * 100) / 100).toFixed(2);
	
	var content = [];
		content.push("cyclic");
		content.push(kcalsOutput);
		content.push(kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD);
		content.push(currentDay);
	return content; //((allKcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
}
//#///////////////////#//
//# UPDATE NUTRI BARS #//
//#///////////////////#//
function updateNutriBars(tPro,tCar,tFat) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
	if(!$('#appStatusBars').html())						      { return; } 	
	//total calories
	var nTotal  = (tPro*4) + (tCar*4) + (tFat*9);
	//return null
	if(window.localStorage.getItem("appStatus") != "running" || nTotal == 0) {
		$("#appStatusBarsPro p").html(LANG.PROTEINS[lang].toUpperCase());
		$("#appStatusBarsCar p").html(LANG.CARBS[lang].toUpperCase());
		$("#appStatusBarsFat p").html(LANG.FATS[lang].toUpperCase());
		$("#appStatusBars p").css("width",0);
		$("#appStatusBars span").html("0%");
		return false;
	}
	//ratios
	var appNutrients = window.localStorage.getItem('appNutrients').split('|');
	var proRatio = parseInt(appNutrients[0]);
	var carRatio = parseInt(appNutrients[1]);
	var fatRatio = parseInt(appNutrients[2]);
	//css pseudos
	updateNutriRatio();
	//relative total
	var nPerPro = ( (tPro*4) / nTotal ) * 100;
	var nPerCar = ( (tCar*4) / nTotal ) * 100;
	var nPerFat = ( (tFat*9) / nTotal ) * 100;
	//ratio-relative percent
	var nProPerRatio = Math.round( (nPerPro / proRatio) * 100); // * 100) / 100;
	var nCarPerRatio = Math.round( (nPerCar / carRatio) * 100); // * 100) / 100;
	var nFatPerRatio = Math.round( (nPerFat / fatRatio) * 100); // * 100) / 100;
	//pro bar css
	if(nProPerRatio > 200) {
		nProPerWidth = 100;
		nProPerClass = "danger";
	} else if(nProPerRatio > 150) {
		nProPerWidth = 100;
		nProPerClass = "warn";
	} else if(nProPerRatio > 100) {
		nProPerWidth = 100;
		nProPerClass = "over";
	} else {
		nProPerWidth = nProPerRatio;
		nProPerClass = "normal";
	}
	$("#appStatusBarsPro p").removeClass("danger warn over normal");
	$("#appStatusBarsPro p").addClass(nProPerClass);
	$("#appStatusBarsPro p").css("width",Math.round(nProPerWidth) + "%");
	//car bar css
	if(nCarPerRatio > 200) {
		nCarPerWidth = 100;
		nCarPerClass = "danger";
	} else if(nCarPerRatio > 150) {
		nCarPerWidth = 100;
		nCarPerClass = "warn";
	} else if(nCarPerRatio > 100) {
		nCarPerWidth = 100;
		nCarPerClass = "over";
	} else {
		nCarPerWidth = nCarPerRatio;
		nCarPerClass = "normal";
	}
	$("#appStatusBarsCar p").removeClass("danger warn over normal");
	$("#appStatusBarsCar p").addClass(nCarPerClass);
	$("#appStatusBarsCar p").css("width",Math.round(nCarPerWidth) + "%");
	//fat bar css
	if(nFatPerRatio > 200) {
		nFatPerWidth = 100;
		nFatPerClass = "danger";
	} else if(nFatPerRatio > 150) {
		nFatPerWidth = 100;
		nFatPerClass = "warn";
	} else if(nFatPerRatio > 100) {
		nFatPerWidth = 100;
		nFatPerClass = "over";
	} else {
		nFatPerWidth = nFatPerRatio;
		nFatPerClass = "normal";
	}
	$("#appStatusBarsFat p").removeClass("danger warn over normal");
	$("#appStatusBarsFat p").addClass(nFatPerClass);
	$("#appStatusBarsFat p").css("width",Math.round(nFatPerWidth) + "%");
	//relative percentage
	
	$("#appStatusBarsPro p").html(LANG.PROTEINS[lang].toUpperCase() + " (" + Math.round(tPro) + LANG.G[lang] + ")");
	$("#appStatusBarsCar p").html(LANG.CARBS[lang].toUpperCase()    + " (" + Math.round(tCar) + LANG.G[lang] + ")");
	$("#appStatusBarsFat p").html(LANG.FATS[lang].toUpperCase()     + " (" + Math.round(tFat) + LANG.G[lang] + ")");
	
	$("#appStatusBarsPro span").html(Math.round(nPerPro*1)/1 + "%");
	$("#appStatusBarsCar span").html(Math.round(nPerCar*1)/1 + "%");
	//$("#appStatusBarsFat span").html(Math.round(nPerFat*1)/1 + "%");
	//by exclusion
	$("#appStatusBarsFat span").html( (100 - parseFloat($("#appStatusBarsPro span").html()) - parseFloat($("#appStatusBarsCar span").html())) + "%");
}
//##################//
//## UPDATE TIMER ##//
//##################//
var timeLock = 0;
function updateTimer() {
	if(noTimer == "active") { return; }
	//MAKE SUM
	today = dayFormat(new Date().getTime());
	getEntries(function(data) {
		////////////////
		// TIMER LOCK //
		////////////////
		if(window.localStorage.getItem("appStatus") != "running") {
			/*
			window.localStorage.setItem("config_start_time",new Date().getTime());
			window.localStorage.removeItem("config_entry_sum");
			window.localStorage.removeItem("config_entry_f-sum");
			window.localStorage.removeItem("config_entry_e-sum");	
			$("#appStatusBars p").css("width",0);
			$("#appStatusBars span").html("0%");
			*/
		} else {
			//console.log('updating entrylist sum');
			var ts   = 0;
			var tf   = 0;
			var te   = 0;
			var ttf  = 0;
			var tte  = 0;
			var tPro = 0;
			var tCar = 0;
			var tFat = 0; 
			for(var i=0, len=data.length; i<len; i++) {
				//today's totals
				if(dayFormat(parseInt(data[i].published)) == today) {
					if(Number(data[i].title) > 0) {
						ttf += parseInt(data[i].title);
					} else {
						tte += parseInt(data[i].title);
					}
				}
				// EXPIRED
				if(window.localStorage.getItem("config_start_time") <= Number(data[i].published)) {
					ts = Number(data[i].title) + ts;
					//total food/exercise										
					if(Number(data[i].title) > 0) {
						tf = tf + Number(data[i].title);
					} else {
						te = te + Number(data[i].title);
					}
					if(getNutriTimeSpan(Number(data[i].published))) {
						//total pro/car/fat
						if(Number(data[i].pro) > 0) {
							tPro = tPro + parseFloat(data[i].pro);
						}
						if(Number(data[i].car) > 0) {
							tCar = tCar + parseFloat(data[i].car);
						}
						if(Number(data[i].fat) > 0) {
							tFat = tFat + parseFloat(data[i].fat);
						}
					}
				}
			}
			//simultaneous windows flicker ~
			updateNutriBars(tPro,tCar,tFat);
			if(tPro != window.localStorage.getItem("tPro"))				{ window.localStorage.setItem("tPro",tPro); }
			if(tCar != window.localStorage.getItem("tCar"))				{ window.localStorage.setItem("tCar",tCar); }
			if(tFat != window.localStorage.getItem("tFat"))				{ window.localStorage.setItem("tFat",tFat); }
			//console.log('refreshing timer');
			if(ts != window.localStorage.getItem("config_entry_sum"))	{ window.localStorage.setItem("config_entry_sum",ts); }
			if(tf != window.localStorage.getItem("config_entry_f"))		{ window.localStorage.setItem("config_entry_f",tf); }
			if(te != window.localStorage.getItem("config_entry_e"))		{ window.localStorage.setItem("config_entry_e",te); }
			if(ttf != window.localStorage.getItem("config_ttf"))		{ window.localStorage.setItem("config_ttf",ttf); updateTodayOverview(); }
			if(tte != window.localStorage.getItem("config_tte"))		{ window.localStorage.setItem("config_tte",tte); updateTodayOverview(); }
		}
		///////////////////
		// READ SETTINGS //
		///////////////////
		var appStartTime = (window.localStorage.getItem("appStatus") == "running") ?  window.localStorage.getItem("config_start_time") : new Date().getTime();
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			appTimer("appHeader",cyclicTimeToKcals(appStartTime));
		} else {
			appTimer("appHeader",timeToKcals(appStartTime));
		}
	});
}

