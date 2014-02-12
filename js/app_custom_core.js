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
	var cssOver = "";
	var statusStop;
	var lDeficit  = LANG('DEFICIT');
	var lSurplus  = LANG('SURPLUS');
	var lBalanced = LANG('BALANCED');
	//STATUSES (RELATIVE)
         if(kcalsInput >  9999 )      { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; if($("#entryBody").val() != "devilim") { kcalsInput =  9999.99; }}
	else if(kcalsInput < -9999 )      { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; if($("#entryBody").val() != "devilim") { kcalsInput = -9999.99; }}
	else if(kcalsInput > eqPerDay * .50) { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; }
	else if(kcalsInput < eqPerDay *-.50) { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; }
	else if(kcalsInput > eqPerDay * .25) { status = lDeficit;  cssClass = "deficit";  }
	else if(kcalsInput < eqPerDay *-.25) { status = lSurplus;  cssClass = "surplus";  } 
	else                        { status = lBalanced; cssClass = "balanced"; }
	/////////////////
	// WEIGHT LOSS //
	/////////////////
	var startLoss    = Number(window.localStorage.getItem("config_start_time"));
	var numberLoss   = Number(window.localStorage.getItem("calcForm#pA6G"));
	var unitLoss     = Number(window.localStorage.getItem("calcForm#select"));
	var currentDaily = Number(window.localStorage.getItem("config_kcals_day_1"));
	// tempo passado
	// calorias por dia 
	// total de calorias necessarias - total de calorias usadas 
	// resto / 7700 = kg lost
	var week         = 60*60*24*7;
	var elapsedLoss  = Number(new Date().getTime()) - startLoss;
	// weeks elapsed
	var elapsedRatio = elapsedLoss / week;
	var weightLoss   = ((numberLoss * elapsedRatio) / 1000).toFixed(7);
	////////////
	// UPDATE HEADER //
	////////////
	//$("#timerKcals p").html(kcalsInput);
	//$("#timerDaily p").html(eqPerDay);
	var kcalsHtmlOutput = "";
	kcalsHtmlOutput    += "<div id='timerBlocks'>";
	kcalsHtmlOutput    += "<div id='timerKcals'>"   + kcalsInput + "<span>" + LANG('CALORIES_AVALIABLE') + "</span></div>";
	kcalsHtmlOutput    += "<div id='timerDaily'>"   + eqPerDay   + "<span>" + LANG('DAILY_CALORIES') + "</span></div>";
	kcalsHtmlOutput    += "</div>";
	$("#appHeader").html('');
	$("#appHeader").html(kcalsHtmlOutput);
	//plus~minus de-bump
	//if(kcalsInput > 0) { kcalsInput = "+" + kcalsInput; }
	//if(kcalsInput <= 0) { kcalsInput = "−" + Math.abs(kcalsInput).toFixed(2); }
	//STATUS
	if(!$("#appHeader").hasClass(cssClass) || !$("#appStatusBalance").hasClass(cssClass)) {
		$("#appHeader,#appStatusBalance").addClass(cssClass);
		if(cssClass != "balanced") { 
			$("#appHeader,#appStatusBalance").removeClass("balanced");
		}
		if(cssClass != "deficit") { 
			$("#appHeader,#appStatusBalance").removeClass("deficit");
		}
		if(cssClass != "surplus") { 
			$("#appHeader,#appStatusBalance").removeClass("surplus");
		}
		if(cssOver != "over") { 
			$("#appHeader,#appStatusBalance").removeClass("over");
		}
	}
	if(cssOver == "over") {
		if(!$("#appHeader").hasClass("over") || !$("#appStatusBalance").hasClass("over")) {
			$("#appHeader,#appStatusBalance").addClass("over");
		}
	}
	///////////////////////
	// UPDATE APP STATUS //
	///////////////////////
	window.localStorage.setItem("appBalance",status);
	window.localStorage.setItem("cssOver",cssOver);
	$("#appStatusElapsed div p").html(timeElapsed());
	$("#appStatusWeight div p strong").html(weightLoss);
	$("#appStatusBalance div p").html(window.localStorage.getItem("appBalance"));
	$("#entry_f-sum p").html(Number(window.localStorage.getItem("config_entry_f-sum")));
	$("#entry_e-sum p").html(Number(window.localStorage.getItem("config_entry_e-sum")));
	//////////////////////////////////////////////////
	// self adjust refresh rate based on perfomance //
	//////////////////////////////////////////////////
	var timeWait = timerDiff;
	timerDiff = (((new Date().getTime()) - timerPerf) * 2);
	timerDiff = Math.round((timerDiff/2) + (timerWait/2));
	if(timerDiff > 500) { timerDiff = 500; }
	if(timerDiff < 100) { timerDiff = 100; }
	/////////////////////
	// pre-show reward //
	/////////////////////
	if(opaLock < 2 && $("body").css("opacity") == 0) {
		opaLock++;
		if(opaLock == 2) {
			$("body").css("opacity","1");
			if(isMobile.iOS && hasTouch() && navigator.splashscreen) {
				navigator.splashscreen.hide();
			}
		}
	}
}
//#////////////////////////#//
//# *LINEAR* TIME TO KCALS #//
//#////////////////////////#//
function timeToKcals(start) {
	var now             = (new Date()).getTime();
	var timeSinceStart  = (now - start) / 1000;
	var kcalsPerDay     = window.localStorage.getItem("config_kcals_day_0");
	var KcalsTimeRatio  = 60*60*24 / kcalsPerDay;
	//var kcalsSinceStart = Math.floor((timeSinceStart / KcalsTimeRatio)*31)*(-1);
	var kcalsSinceStart = ((timeSinceStart / KcalsTimeRatio)*1);
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
		content.push(kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD);
		content.push(currentDay);
	return content; //((allKcalsSinceStart/31) + (kcalsEntrySum)).toFixed(2);
}
//#///////////////////#//
//# UPDATE NUTRI BARS #//
//#///////////////////#//
function updateNutriBars(tPro,tCar,tFat) {
	//total calories
	var nTotal  = (tPro*4) + (tCar*4) + (tFat*9);
	//return null
	if(window.localStorage.getItem("appStatus") != "running" || nTotal == 0) {
		$("#appStatusBars p").css("width",0);
		$("#appStatusBars span").html("0%");
		return false;
	}
	//ratios
	var proRatio = 25;
	var carRatio = 50;
	var fatRatio = 25;
	//relative total
	var nPerPro = ( (tPro*4) / nTotal ) * 100;
	var nPerCar = ( (tCar*4) / nTotal ) * 100;
	var nPerFat = ( (tFat*9) / nTotal ) * 100;
	//ratio-relative percent
	var nProPerRatio = Math.round( (nPerPro / proRatio) * 100 * 100) / 100;
	var nCarPerRatio = Math.round( (nPerCar / carRatio) * 100 * 100) / 100;
	var nFatPerRatio = Math.round( (nPerFat / fatRatio) * 100 * 100) / 100;
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
	//$("#appStatusBarsPro span").html(Math.round(nPerPro*10)/10 + " % (" + Math.round(tPro) + "g)");
	//$("#appStatusBarsCar span").html(Math.round(nPerCar*10)/10 + " % (" + Math.round(tCar) + "g)");
	//$("#appStatusBarsFat span").html(Math.round(nPerFat*10)/10 + " % (" + Math.round(tFat) + "g)");
	$("#appStatusBarsPro span").html(Math.round(nPerPro*1)/1 + "%");
	$("#appStatusBarsCar span").html(Math.round(nPerCar*1)/1 + "%");
	//$("#appStatusBarsFat span").html(Math.round(nPerFat*1)/1 + "%");
	//by exclusion
	$("#appStatusBarsFat span").html( (100 - parseFloat($("#appStatusBarsPro span").html()) - parseFloat($("#appStatusBarsCar span").html())) + "%");
}
//##################//
//## CORE UPDATER ##//
//##################//
var timeLock = 0;
function updateTimer() {
	//MAKE SUM
	diary.getEntries(function(data) {
		////////////////
		// TIMER LOCK //
		////////////////
		if(window.localStorage.getItem("appStatus") != "running") {
			window.localStorage.setItem("config_start_time",new Date().getTime());
			window.localStorage.removeItem("config_entry_sum");
			window.localStorage.removeItem("config_entry_f-sum");
			window.localStorage.removeItem("config_entry_e-sum");	
			$("#appStatusBars p").css("width",0);
			$("#appStatusBars span").html("0%");
		} else {
			//console.log('updating entrylist sum');
			var ts = 0;
			var tf = 0;
			var te = 0;
			var tPro = 0;
			var tCar = 0;
			var tFat = 0; 
			for(var i=0, len=data.length; i<len; i++) {
				// EXPIRED
				if(window.localStorage.getItem("config_start_time") <= Number(data[i].published)) {
					ts = Number(data[i].title) + ts;
					//total food/exercise										
					if(Number(data[i].title) > 0) {
						tf = tf + Number(data[i].title);
					} else {
						te = te + Number(data[i].title);
					}
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
			updateNutriBars(tPro,tCar,tFat);
			window.localStorage.setItem("tPro",tPro);
			window.localStorage.setItem("tCar",tCar);
			window.localStorage.setItem("tFat",tFat);	
			//console.log('refreshing timer');
			window.localStorage.setItem("config_entry_sum",ts*-1);
			window.localStorage.setItem("config_entry_f-sum",tf);
			window.localStorage.setItem("config_entry_e-sum",te);
			var day1 = window.localStorage.getItem("config_kcals_day_1");
			var day2 = window.localStorage.getItem("config_kcals_day_2");
		}
		///////////////////
		// READ SETTINGS //
		///////////////////
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			appTimer("appHeader",cyclicTimeToKcals(window.localStorage.getItem("config_start_time")));
		} else {
			appTimer("appHeader",timeToKcals(window.localStorage.getItem("config_start_time")));
		}
	});
}


/*
function updateTimer() {
	////////////////
	// TIMER LOCK //
	////////////////
	if(window.localStorage.getItem("appStatus") != "running") {
		window.localStorage.setItem("config_start_time",new Date().getTime());
		window.localStorage.removeItem("config_entry_sum");
		window.localStorage.removeItem("config_entry_f-sum");
		window.localStorage.removeItem("config_entry_e-sum");	
		$("#appStatusBars p").css("width",0);
		$("#appStatusBars span").html("0%");
	} else {
		//console.log('updating entrylist sum');
		var ts = 0;
		var tf = 0;
		var te = 0;
		var tPro = 0;
		var tCar = 0;
		var tFat = 0; 

		html5sql.process(["select * from diary_entry order by published desc;"],
			function(transaction, results, data){
				for(var i = 0; i < data.length; i++){
					// EXPIRED
					if(window.localStorage.getItem("config_start_time") <= Number(data[i].published)) {
						ts = Number(data[i].title) + ts;
						//total food/exercise										
						if(Number(data[i].title) > 0) {
							tf = tf + Number(data[i].title);
						} else {
							te = te + Number(data[i].title);
						}
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
				updateNutriBars(tPro,tCar,tFat);
				window.localStorage.setItem("tPro",tPro);
				window.localStorage.setItem("tCar",tCar);
				window.localStorage.setItem("tFat",tFat);	
				//console.log('refreshing timer');
				window.localStorage.setItem("config_entry_sum",ts*-1);
				window.localStorage.setItem("config_entry_f-sum",tf);
				window.localStorage.setItem("config_entry_e-sum",te);
				var day1 = window.localStorage.getItem("config_kcals_day_1");
				var day2 = window.localStorage.getItem("config_kcals_day_2");
			}
		},
		function(error, statement){
			//hande error here           
		});	
	}
}
*/

