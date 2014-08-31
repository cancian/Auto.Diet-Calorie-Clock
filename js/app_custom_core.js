//#############################################################//
//##                      CUSTOM CORE                        ##//
//#############################################################//
////////////////////////////
// APP TIMER REFRESH DATA //
////////////////////////////
function appTimer(content) {
	var kcalsType  = content[0];
	var kcalsInput = content[1];
	var kcalsAll   = content[2];
	var currentDay = content[3];
	var getKcalsKey  = 'config_kcals_day_0';
	var getKcalsItem = app.read('config_kcals_day_0');
	var eqPerDay     = app.read('config_kcals_day_0');
	if(kcalsType == 'cyclic') {
		if(currentDay == 'd') {
			getKcalsKey  = 'config_kcals_day_2';
			getKcalsItem = app.read('config_kcals_day_2');
			eqPerDay     = app.read('config_kcals_day_2');
		} else {
			getKcalsKey  = 'config_kcals_day_1';
			getKcalsItem = app.read('config_kcals_day_1');
			eqPerDay     = app.read('config_kcals_day_1');
		}
	}
	//STATUS BAR COLOR
	var status;
	var cssClass;
	var cssOver = '';
	var statusStop;
	var lDeficit  = LANG.DEFICIT[lang];
	var lSurplus  = LANG.SURPLUS[lang];
	var lBalanced = LANG.BALANCED[lang];
	var limit1    = app.read('config_limit_1');
	var limit2    = app.read('config_limit_2');
	//STATUSES
         if(kcalsInput >  9999 )   { status = lSurplus;  cssClass = 'surplus'; cssOver = 'over'; kcalsInput =  9999.99; }
	else if(kcalsInput < -9999 )   { status = lDeficit;  cssClass = 'deficit'; cssOver = 'over'; kcalsInput = -9999.99; }
	else if(kcalsInput > limit2)   { status = lSurplus;  cssClass = 'surplus'; cssOver = 'over'; }
	else if(kcalsInput < limit1)   { status = lDeficit;  cssClass = 'deficit'; cssOver = 'over'; }
	else if(kcalsInput > limit2/2) { status = lSurplus;  cssClass = 'surplus';  }
	else if(kcalsInput < limit1/2) { status = lDeficit;  cssClass = 'deficit';  }
	else                           { status = lBalanced; cssClass = 'balanced'; }
	///////////////////
	// UPDATE HEADER //
	///////////////////
	if($('#timerKcalsInput').val() != kcalsInput) {
		$('#timerKcalsInput').val(kcalsInput);
		timerKcals = kcalsInput;
	}
	if($('#timerDaily p').html() != eqPerDay) {
		$('#timerDaily p').html(eqPerDay);
	}
	//STATUS
	if(!$('body').hasClass(cssClass) || !$('#appHeader').hasClass(cssClass) || !$('#appStatusBalance').hasClass(cssClass)) {
		$('body,#appHeader,#appStatusBalance').addClass(cssClass);
		if(cssClass != 'balanced') {
			$('body,#appHeader,#appStatusBalance').removeClass('balanced');
		}
		if(cssClass != 'deficit') {
			$('body,#appHeader,#appStatusBalance').removeClass('deficit');
		}
		if(cssClass != 'surplus') { 
			$('body,#appHeader,#appStatusBalance').removeClass('surplus');
		}
		if(cssOver != 'over') { 
			$('body,#appHeader,#appStatusBalance').removeClass('over');
		}
	}
	if(cssOver == 'over') {
		if(!$('body').hasClass('over') || !$('#appHeader').hasClass('over') || !$('#appStatusBalance').hasClass('over')) {
			$('body,#appHeader,#appStatusBalance').addClass('over');
		}
	}
	//ERROR CSS
	if(Math.abs(kcalsInput) >= 9999) {
		if(!$('body').hasClass('error')) {
			$('body').addClass('error');
		}
	} else {
		if($('body').hasClass('error')) {
			$('body').removeClass('error');	
		}
	}
	///////////////////////
	// UPDATE APP STATUS //
	///////////////////////
	if(!app.read('appBalance',status)) {
		appBalance = status;
		app.save('appBalance',status);
	}
	if(appBalanceOver != cssOver) {		
		appBalanceOver = cssOver;
		app.save('cssOver',cssOver);
	}
	//UPDATE BLOCKS
	if(!app.read('app_last_tab','tab1') && $('#appStatusBalance div p').html() != app.read('appBalance')) { 
		$('#appStatusBalance div p').html(app.read('appBalance'));
	}
	balanceMeter(kcalsInput);
	getElapsed();
	/////////////////////////////////////
	// CHECK DAY CHANGE, ADJUST INTAKE //
	/////////////////////////////////////
	app.define('lastToday',DayUtcFormat(app.now()));
	if(!app.read('lastToday',DayUtcFormat(app.now()))) {
		if(app.read('config_kcals_type','cyclic')) {
			if(app.read('config_kcals_day','d')) {
				$('#editableDiv').html(app.read('config_kcals_day_2'));
			} else {
				$('#editableDiv').html(app.read('config_kcals_day_1'));
			}
		}
		app.save('lastToday',DayUtcFormat(app.now()));
		updateTodayOverview();
		intakeHistory();
	}
	//////////////////////////////////////////////////
	// self adjust refresh rate based on perfomance //
	//////////////////////////////////////////////////
	var timeWait = timerDiff;
	timerDiff = (((new Date().getTime()) - timerPerf) * 2);
	timerDiff = Math.round((timerDiff/2) + (timerWait/2));
	
	if(app.device.wp8) {
		timerDiff = timerDiff*5;
	} else {
		timerDiff = timerDiff*1.5;
	}
	if(timerDiff > 800) { timerDiff = 800; }
	if(timerDiff < 200) { timerDiff = 200; }
	/////////////////////
	// pre-show reward //
	/////////////////////
	if(opaLock < 3) {
		opaLock++;
		if(opaLock == 3) {
			$('body').removeClass('unloaded');
			$('body').addClass('started');
			if(app.device.ios && typeof navigator.splashscreen !== 'undefined') {
				navigator.splashscreen.hide();
			}
		}
	}
}
//#////////////////////////#//
//# *LINEAR* TIME TO KCALS #//
//#////////////////////////#//
function timeToKcals(startTime) {
	var timeSinceStart  = (app.now() - startTime) / 1000;
	var kcalsPerDay     = app.read('config_kcals_day_0');
	var KcalsTimeRatio  = 60*60*24 / kcalsPerDay;
	var kcalsSinceStart = ((timeSinceStart / KcalsTimeRatio)*-1);
	if(!app.read('appStatus','running')) {
		kcalsSinceStart = 0;
	}
	var content = [];
		content.push('simple');
		content.push(((kcalsSinceStart/1) + (app.read('config_entry_sum'))).toFixed(2));
		content.push(kcalsSinceStart);
	return content;
}
//#////////////////////////#//
//# *CYCLIC* TIME TO KCALS #//
//#////////////////////////#//
function cyclicTimeToKcals(startTime) {
	//TIME VARS
	var now        = new Date().getTime();
	var hour       = 60*60*1000;
	var day        = 60*60*24*1000;
	var todaysTime = Date.UTC(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
	// IF (START DATE) < (TIME ELAPSED TODAY), DO NOT COUNT FROM TODAYS START TIME, BUT FROM DIET START TIME
	if((now - startTime) > (todaysTime - startTime) && (now - startTime) < day ) {
		todaysTime = now;
	}
	//DAY NAMES
	var nameA      = 'plateau in';
	var nameB      = 'diet plateau';
	var nameC      = 'plateau out';
	var nameD      = 'carb up';
	//CALORIC INPUT
	var intakeA    = app.read('config_kcals_day_1');
	var intakeB    = intakeA;
	var intakeC    = intakeA;
	var intakeD    = app.read('config_kcals_day_2');
	// DIET START DATE
	var dietStartTime         = startTime;
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
	var cycleDay = 'a';
	for(var dietDay = Date.UTC(2009,1,1) + ((((new Date()).getTimezoneOffset()) * 60 * 1000)); dietDay < now; dietDay = dietDay + day) {
			 if(cycleDay == 'a') { currentDay = 'a'; /*PUSH TO NEXT*/ cycleDay = 'b'; }
		else if(cycleDay == 'b') { currentDay = 'b'; /*PUSH TO NEXT*/ cycleDay = 'c'; }
		else if(cycleDay == 'c') { currentDay = 'c'; /*PUSH TO NEXT*/ cycleDay = 'd'; }
		else if(cycleDay == 'd') { currentDay = 'd'; /*PUSH TO NEXT*/ cycleDay = 'a'; }
	}
	////////////////////////////////////
	// THE WHOLE-DAY *COUNTBACK* LOOP //
	////////////////////////////////////
	var currentCountDay = currentDay;
	var firstCycleDay   = '';
	// COUNT WHOLE DAYS OF EACH DAY
	var countCycleDaysA = 0;
	var countCycleDaysB = 0;
	var countCycleDaysC = 0;
	var countCycleDaysD = 0;
	// CYCLE *IF* WE HAVE BEEN DIETING FOR MORE THAN A DAY
	if(timeSinceStarted > timeElapsedFirstDay) {
		for(var countBack = 0; countBack < (wholeDaysSinceStarted); countBack++) {
				 if(currentCountDay == 'a') { countCycleDaysD = countCycleDaysD+1; /*PUSH TO NEXT*/ currentCountDay = 'd'; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = 'd'; }
			else if(currentCountDay == 'b') { countCycleDaysA = countCycleDaysA+1; /*PUSH TO NEXT*/ currentCountDay = 'a'; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = 'a'; }
			else if(currentCountDay == 'c') { countCycleDaysB = countCycleDaysB+1; /*PUSH TO NEXT*/ currentCountDay = 'b'; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = 'b'; }
			else if(currentCountDay == 'd') { countCycleDaysC = countCycleDaysC+1; /*PUSH TO NEXT*/ currentCountDay = 'c'; /*(LAST DAY OVERCOUNT)*/ firstCycleDay = 'c'; }
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
		 if(currentDay == 'a') { totalTimeOnDayA = totalTimeOnDayA + StartTimeOrTimeElapsed; }
	else if(currentDay == 'b') { totalTimeOnDayB = totalTimeOnDayB + StartTimeOrTimeElapsed; }
	else if(currentDay == 'c') { totalTimeOnDayC = totalTimeOnDayC + StartTimeOrTimeElapsed; }
	else if(currentDay == 'd') { totalTimeOnDayD = totalTimeOnDayD + StartTimeOrTimeElapsed; }
	/////////////////////////////////////
	// ADD PARTIAL TIME FROM FIRST DAY //
	/////////////////////////////////////
		 if(firstCycleDay == 'a') { totalTimeOnDayA = totalTimeOnDayA + timeElapsedFirstDay; }
	else if(firstCycleDay == 'b') { totalTimeOnDayB = totalTimeOnDayB + timeElapsedFirstDay; }
	else if(firstCycleDay == 'c') { totalTimeOnDayC = totalTimeOnDayC + timeElapsedFirstDay; }
	else if(firstCycleDay == 'd') { totalTimeOnDayD = totalTimeOnDayD + timeElapsedFirstDay; }
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
	var kcalsEntrySum      = app.read('config_entry_sum');
	var allKcalsSinceStart = ((kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD)) * (-1);
	/////////////////
	// BUILD ARRAY //
	/////////////////
	app.save('config_kcals_day',currentDay);
	var kcalsOutput = (Math.round(((allKcalsSinceStart) + (kcalsEntrySum)) * 100) / 100).toFixed(2);
	var content = [];
		content.push('cyclic');
		content.push(kcalsOutput);
		content.push(kcalsSinceStartA + kcalsSinceStartB + kcalsSinceStartC + kcalsSinceStartD);
		content.push(currentDay);
	return content;
}
//#///////////////////#//
//# UPDATE NUTRI BARS #//
//#///////////////////#//
function updateNutriBars(tPro,tCar,tFat) {
	if(!app.read('app_last_tab','tab1')) { return; }
	if(!$('#appStatusBars').length)		 { return; } 	
	//total calories
	var nTotal  = (tPro*4) + (tCar*4) + (tFat*9);
	//return null
	if(!app.read('appStatus','running') || nTotal == 0) {
		$('#appStatusBarsPro p').html(LANG.PROTEINS[lang].toUpperCase());
		$('#appStatusBarsCar p').html(LANG.CARBS[lang].toUpperCase());
		$('#appStatusBarsFat p').html(LANG.FATS[lang].toUpperCase());
		$('#appStatusBars p').css('width',0);
		$('#appStatusBars span').html('0%');
		return false;
	}
	//ratios
	var appNutrients = app.read('appNutrients').split('|');
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
	var nProPerRatio = Math.round( (nPerPro / proRatio) * 100);
	var nCarPerRatio = Math.round( (nPerCar / carRatio) * 100);
	var nFatPerRatio = Math.round( (nPerFat / fatRatio) * 100);
	//pro bar css
	if(nProPerRatio > 200) {
		nProPerWidth = 100;
		nProPerClass = 'danger';
	} else if(nProPerRatio > 150) {
		nProPerWidth = 100;
		nProPerClass = 'warn';
	} else if(nProPerRatio > 100) {
		nProPerWidth = 100;
		nProPerClass = 'over';
	} else {
		nProPerWidth = nProPerRatio;
		nProPerClass = 'normal';
	}
	$('#appStatusBarsPro p').removeClass('danger warn over normal');
	$('#appStatusBarsPro p').addClass(nProPerClass);
	$('#appStatusBarsPro p').css('width',Math.round(nProPerWidth) + '%');
	//car bar css
	if(nCarPerRatio > 200) {
		nCarPerWidth = 100;
		nCarPerClass = 'danger';
	} else if(nCarPerRatio > 150) {
		nCarPerWidth = 100;
		nCarPerClass = 'warn';
	} else if(nCarPerRatio > 100) {
		nCarPerWidth = 100;
		nCarPerClass = 'over';
	} else {
		nCarPerWidth = nCarPerRatio;
		nCarPerClass = 'normal';
	}
	$('#appStatusBarsCar p').removeClass('danger warn over normal');
	$('#appStatusBarsCar p').addClass(nCarPerClass);
	$('#appStatusBarsCar p').css('width',Math.round(nCarPerWidth) + '%');
	//fat bar css
	if(nFatPerRatio > 200) {
		nFatPerWidth = 100;
		nFatPerClass = 'danger';
	} else if(nFatPerRatio > 150) {
		nFatPerWidth = 100;
		nFatPerClass = 'warn';
	} else if(nFatPerRatio > 100) {
		nFatPerWidth = 100;
		nFatPerClass = 'over';
	} else {
		nFatPerWidth = nFatPerRatio;
		nFatPerClass = 'normal';
	}
	$('#appStatusBarsFat p').removeClass('danger warn over normal');
	$('#appStatusBarsFat p').addClass(nFatPerClass);
	$('#appStatusBarsFat p').css('width',Math.round(nFatPerWidth) + '%');
	//relative percentage
	
	$('#appStatusBarsPro p').html(LANG.PROTEINS[lang].toUpperCase() + ' (' + Math.round(tPro) + LANG.G[lang] + ')');
	$('#appStatusBarsCar p').html(LANG.CARBS[lang].toUpperCase()    + ' (' + Math.round(tCar) + LANG.G[lang] + ')');
	$('#appStatusBarsFat p').html(LANG.FATS[lang].toUpperCase()     + ' (' + Math.round(tFat) + LANG.G[lang] + ')');
	
	$('#appStatusBarsPro span').html(Math.round(nPerPro*1)/1 + '%');
	$('#appStatusBarsCar span').html(Math.round(nPerCar*1)/1 + '%');
	//$('#appStatusBarsFat span').html(Math.round(nPerFat*1)/1 + '%');
	//by exclusion
	$('#appStatusBarsFat span').html( (100 - parseFloat($('#appStatusBarsPro span').html()) - parseFloat($('#appStatusBarsCar span').html())) + '%');
}
//##################//
//## UPDATE TIMER ##//
//##################//
var timeLock = 0;
function updateTimer() {
	if(noTimer == 'active') { return; }
	//MAKE SUM
	today = dayFormat(app.now());
	getEntries(function(data) {
		////////////////
		// TIMER LOCK //
		////////////////
		if(app.read('appStatus','running')) {
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
				if(app.read('config_start_time') <= Number(data[i].published)) {
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
			app.save('tPro',tPro);
			app.save('tCar',tCar);
			app.save('tFat',tFat);
			app.save('config_entry_sum',ts);
			app.save('config_entry_f',tf);
			app.save('config_entry_e',te);
			app.save('config_ttf',ttf);
			app.save('config_tte',tte);
			if(!app.read('config_ttf',ttf) || !app.read('config_tte',tte)) {
				updateTodayOverview();	
			}
		}
		///////////////////
		// READ SETTINGS //
		///////////////////
		var appStartTime = app.read('appStatus','running') ? app.read('config_start_time') : app.now();
		if(app.read('config_kcals_type','cyclic')) {
			appTimer(cyclicTimeToKcals(appStartTime));
		} else {
			appTimer(timeToKcals(appStartTime));
		}
	});
}

