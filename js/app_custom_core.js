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
         if(kcalsInput >  9999) { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; if($("#entryBody").val() != "devilim") { kcalsInput =  9999.99; }}
	else if(kcalsInput < -9999) { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; if($("#entryBody").val() != "devilim") { kcalsInput = -9999.99; }}
	else if(kcalsInput > eqPerDay * .50) { status = lDeficit;  cssClass = "deficit"; cssOver = "over"; }
	else if(kcalsInput < eqPerDay *-.50) { status = lSurplus;  cssClass = "surplus"; cssOver = "over"; }
	else if(kcalsInput > eqPerDay * .25) { status = lDeficit;  cssClass = "deficit";  }
	else if(kcalsInput < eqPerDay *-.25) { status = lSurplus;  cssClass = "surplus";  } 
	else                        { status = lBalanced; cssClass = "balanced"; }
	//EQ TIME
	/*
	var eqTime;
	var eqStart  = Number(window.localStorage.getItem("config_start_time"));
	var eqCals   = kcalsInput;
	var eqDate   = Number((new Date()).getTime());
	var eqRatio  = (60*60*24 / eqPerDay);
	var eqDiff   = eqDate - Math.floor(Math.abs(kcalsInput*eqRatio));
	var eqTime   = dateDiff(eqDiff*1000,eqDate*1000).replace(" " + LANG("AGO"),"");
	*/
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
	$("#timerKcals p").html(kcalsInput);
	$("#timerDaily p").html(eqPerDay);
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
//##################//
//## CORE UPDATER ##//
//##################//
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
		} else {
			//update every ~
			if(new Date().getSeconds() == 30) { updateEntriesTime(); }
			//console.log('updating entrylist sum');
			var ts = 0;
			var tf = 0;
			var te = 0;
			for(var i=0, len=data.length; i<len; i++) {
				// EXPIRED
				if(window.localStorage.getItem("config_start_time") < Number(data[i].published)) {
					ts = Number(data[i].title) + ts;
					//total food/exercise
					if(Number(data[i].title) > 0) {
						tf = tf + Number(data[i].title);
					} else {
						te = te + Number(data[i].title);
					}
				}

			}
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

<?php
///////////////////////
// BUILD NUTRI INDEX //
///////////////////////
$kfilename   = 'kcals_cals.txt';
$kcheckit    = file_get_contents($kfilename);
$kcheckdata  = explode("|",$kcheckit);
$nutri_sum   = $kcheckdata[0];

//read consumed stuff from list
$_diary    = file_get_contents('kcals_diary.txt');
$_zentries = explode("\n",$_diary);
$_line     = 0;
 
	foreach($_zentries as $_zentry)
	{	
		$sutri = explode('|',$_zentry);
		$cata_time = $sutri[1];
		
		if($cata_time >= $startt)
			{	
				if($_zentry)
				{
					//RESET
					$zata_cals = '';
					$zata_time = '';
					$zata_name = '';
					$zata_gram = '';
					$zata_pro =  '';
					$zata_car =  '';
					$zata_fat =  '';
					$zata_fib =  '';
	
					$sutri = explode('|',$_zentry);
		
					$cata_cals = $sutri[0];
						if($cata_cals > 0)
						{
							$zata_cals = $sutri[0];
							$zata_time = $sutri[1];
							$zata_name = $sutri[2];
							$zata_gram = $sutri[3];
							$zata_pro =  $sutri[4];
							$zata_car =  $sutri[5];
							$zata_fat =  $sutri[6];
							$zata_fib =  $sutri[7];
						}
						else 
						{
							//add caloric usage to totals...
							$zata_cals = $sutri[0];
							$exercise_sum = $exercise_sum+$zata_cals;
						}
		
					$tot_pro = $tot_pro+$zata_pro;
					$tot_car = $tot_car+$zata_car;
					$tot_fat = $tot_fat+$zata_fat;

				}
			}
	}

	
//negative part of the exercises
//NUTRI BAR PRE-ROOM
$nutri_sum = $nutri_sum+$exercise_sum-600;

//ratios
$r_pro = 0.35;
$r_car = 0.40;
$r_fat = 0.25;

$spro = abs(round($nutri_sum*($r_pro)/4));
$scar = abs(round($nutri_sum*($r_car)/4));
$sfat = abs(round($nutri_sum*($r_fat)/9));

$nutri_pro = $tot_pro.' / '.$spro.'g';
$nutri_car = $tot_car.' / '.$scar.'g';
$nutri_fat = $tot_fat.' / '.$sfat.'g';

$pro_width = $tot_pro/($spro);
$car_width = $tot_car/($scar);
$fat_width = $tot_fat/($sfat);

$per_pro = abs($pro_width*200);
$per_car = abs($car_width*200);
$per_fat = abs($fat_width*200);

    if($per_pro > 300) { $red_pro = $per_pro; $per_pro = 200; $pro_color = '#ff3300'; } 
elseif($per_pro > 200) { $red_pro = $per_pro; $per_pro = 200; $pro_color = '#ffdd33'; } 
else                   { $pro_color = '#00ff00'; $red_pro = ''; }

    if($per_car > 300) { $red_car = $per_car; $per_car = 200; $car_color = '#ff3300'; } 
elseif($per_car > 200) { $red_car = $per_car; $per_car = 200; $car_color = '#ffdd33'; }
else                   { $car_color = '#00ff00'; $red_car = ''; }

    if($per_fat > 300) { $red_fat = $per_fat; $per_fat = 200; $fat_color = '#ff3300'; }
elseif($per_fat > 200) { $red_fat = $per_fat; $per_fat = 200; $fat_color = '#ffdd33'; }
 else                  { $fat_color = '#00ff00'; $red_fat = ''; }
?>

<div style="font-size: 10px; color: #fff; line-height: 14px; text-indent: 5px; white-space: nowrap; max-width: 100px; background: #ccc;">

	<div style="position:absolute; top: -80px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>
	<div style="position:absolute; top: -65px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>
	<div style="position:absolute; top: -50px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>

	<div style="position:absolute; top: -80px; left: 150px; width: <?php print round($per_pro); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $pro_color; ?>; border: 1px solid #888;"></div>
	<div style="position:absolute; top: -65px; left: 150px; width: <?php print round($per_car); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $car_color; ?>; border: 1px solid #888;"></div>
	<div style="position:absolute; top: -50px; left: 150px; width: <?php print round($per_fat); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $fat_color; ?>; border: 1px solid #888;"></div>

	<div style="position:absolute; top: -80px; left: 350px; height: 11px; color: #666;">proteins (<?php print round($r_pro*100); ?>%)</div>
	<div style="position:absolute; top: -65px; left: 350px; height: 11px; color: #666;">carbs (<?php print round($r_car*100); ?>%)</div>
	<div style="position:absolute; top: -50px; left: 350px; height: 11px; color: #666;">fats (<?php print round($r_fat*100); ?>%)</div>

	<div style="position:absolute; top: -80px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_pro; ?></div>
	<div style="position:absolute; top: -65px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_car; ?></div>
	<div style="position:absolute; top: -50px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_fat; ?></div>
		
</div>
</div>
*/