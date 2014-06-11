//##////////////////##//
//## INTAKE HISTORY ##//
//##////////////////##//
function intakeHistory() {
	//check exists
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
	//if($('#appStatusIntake div').length === 0) { return; }
	//go
	var firstTick = 0;
	var lastTick  = window.localStorage.getItem("config_kcals_day_0") * 1.5;
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		lastTick  = window.localStorage.getItem("config_kcals_day_1") * 1.5;
	}
	///////////////////////////////////////
	// localized short weekday countback //
	///////////////////////////////////////
	var day = 60 * 60 * 24 * 1000;
	var now = new Date().getTime();
	//count back 7 days
	var past0days = DayUtcFormat(now);
	var past1days = DayUtcFormat(now - (day*1));
	var past2days = DayUtcFormat(now - (day*2));
	var past3days = DayUtcFormat(now - (day*3));
	var past4days = DayUtcFormat(now - (day*4));
	var past5days = DayUtcFormat(now - (day*5));
	var past6days = DayUtcFormat(now - (day*6));
	var past7days = DayUtcFormat(now - (day*7));
	//weekday lang array
	var weekdaysArray = LANG.WEEKDAY_SHORT[lang].split(", ");
	//parse date as time
	var past0daysTime = Date.parse(DayUtcFormat(past0days));
	var past1daysTime = Date.parse(DayUtcFormat(past1days));
	var past2daysTime = Date.parse(DayUtcFormat(past2days));
	var past3daysTime = Date.parse(DayUtcFormat(past3days));
	var past4daysTime = Date.parse(DayUtcFormat(past4days));
	var past5daysTime = Date.parse(DayUtcFormat(past5days));
	var past6daysTime = Date.parse(DayUtcFormat(past6days));
	var past7daysTime = Date.parse(DayUtcFormat(past7days));
	//get weekday n. from time
	var past0daysNumber = (new Date(past0daysTime)).getDay();
	var past1daysNumber = (new Date(past1daysTime)).getDay();
	var past2daysNumber = (new Date(past2daysTime)).getDay();
	var past3daysNumber = (new Date(past3daysTime)).getDay();
	var past4daysNumber = (new Date(past4daysTime)).getDay();
	var past5daysNumber = (new Date(past5daysTime)).getDay();
	var past6daysNumber = (new Date(past6daysTime)).getDay();
	var past7daysNumber = (new Date(past7daysTime)).getDay();
	///////////////////////////
	// usable weekday labels //
	///////////////////////////
	var past0daysLabel = weekdaysArray[past0daysNumber];
	var past1daysLabel = weekdaysArray[past1daysNumber];
	var past2daysLabel = weekdaysArray[past2daysNumber];
	var past3daysLabel = weekdaysArray[past3daysNumber];
	var past4daysLabel = weekdaysArray[past4daysNumber];
	var past5daysLabel = weekdaysArray[past5daysNumber];
	var past6daysLabel = weekdaysArray[past6daysNumber];
	var past7daysLabel = weekdaysArray[past7daysNumber];
	//////////////////////
	// WEEKDAY SUM LOOP //
	//////////////////////
	//sum vars
	var past0daysSum = 0;
	var past1daysSum = 0;
	var past2daysSum = 0;
	var past3daysSum = 0;
	var past4daysSum = 0;
	var past5daysSum = 0;
	var past6daysSum = 0;
	var past7daysSum = 0;
	//LOOP
	getEntries(function(data) {
		var dataPublished;
		var dataTitle;
		for(var i=0, len=data.length; i<len; i++) {
			dataPublished = DayUtcFormat(parseInt(data[i].published));
			dataTitle     = parseInt(data[i].title);
			if(dataPublished == past0days) { past0daysSum = past0daysSum + dataTitle; }
			if(dataPublished == past1days) { past1daysSum = past1daysSum + dataTitle; }
			if(dataPublished == past2days) { past2daysSum = past2daysSum + dataTitle; }
			if(dataPublished == past3days) { past3daysSum = past3daysSum + dataTitle; }
			if(dataPublished == past4days) { past4daysSum = past4daysSum + dataTitle; }
			if(dataPublished == past5days) { past5daysSum = past5daysSum + dataTitle; }
			if(dataPublished == past6days) { past6daysSum = past6daysSum + dataTitle; }
			if(dataPublished == past7days) { past7daysSum = past7daysSum + dataTitle; }
			//reset
			dataPublished = 0;
			dataTitle     = 0;
		}
		//null for zero
		//if(past0daysSum == 0) { past0daysSum = null; }
		//if(past1daysSum == 0) { past1daysSum = null; }
		//if(past2daysSum == 0) { past2daysSum = null; }
		//if(past3daysSum == 0) { past3daysSum = null; }
		//if(past4daysSum == 0) { past4daysSum = null; }
		//if(past5daysSum == 0) { past5daysSum = null; }
		//if(past6daysSum == 0) { past6daysSum = null; }
		//if(past7daysSum == 0) { past7daysSum = null; }
		//lastTick 500kcal buffer
		if(past0daysSum > lastTick-500)									{ lastTick = past0daysSum*1.5; }
		if(past1daysSum > lastTick-500 && past1daysSum > past0daysSum)	{ lastTick = past1daysSum*1.5; }
		if(past2daysSum > lastTick-500 && past2daysSum > past1daysSum)	{ lastTick = past2daysSum*1.5; }
		if(past3daysSum > lastTick-500 && past3daysSum > past2daysSum)	{ lastTick = past3daysSum*1.5; }
		if(past4daysSum > lastTick-500 && past4daysSum > past3daysSum)	{ lastTick = past4daysSum*1.5; }
		if(past5daysSum > lastTick-500 && past5daysSum > past4daysSum)	{ lastTick = past5daysSum*1.5; }
		if(past6daysSum > lastTick-500 && past6daysSum > past5daysSum)	{ lastTick = past6daysSum*1.5; }
		if(past7daysSum > lastTick-500 && past7daysSum > past6daysSum)	{ lastTick = past7daysSum*1.5; }
		//min lastTick val
		if(lastTick < 300) { lastTick = 300; }
		//firstTick -500kcal buffer
		if(past0daysSum < 0)								{ firstTick = past0daysSum*2; }
		if(past1daysSum < 0 && past1daysSum < past0daysSum)	{ firstTick = past1daysSum*2; }
		if(past2daysSum < 0 && past2daysSum < past1daysSum)	{ firstTick = past2daysSum*2; }
		if(past3daysSum < 0 && past3daysSum < past2daysSum)	{ firstTick = past3daysSum*2; }
		if(past4daysSum < 0 && past4daysSum < past3daysSum)	{ firstTick = past4daysSum*2; }
		if(past5daysSum < 0 && past5daysSum < past4daysSum)	{ firstTick = past5daysSum*2; }
		if(past6daysSum < 0 && past6daysSum < past5daysSum)	{ firstTick = past6daysSum*2; }
		if(past7daysSum < 0 && past7daysSum < past6daysSum)	{ firstTick = past7daysSum*2; }
		//min neg pad start at -500
		if(firstTick < 0 && firstTick > -500) { firstTick = -500; }
		//no null yesterday label
		var past1daysColor = 'rgba(0,0,0,1)';
		var past2daysColor = 'rgba(0,0,0,1)';
		var past3daysColor = 'rgba(0,0,0,1)';
		var past4daysColor = 'rgba(0,0,0,1)';
		//
		if(past1daysSum == 0) { past1daysColor = 'rgba(0,0,0,0)'; }
		if(past2daysSum == 0) { past2daysColor = 'rgba(0,0,0,0)'; }
		if(past3daysSum == 0) { past3daysColor = 'rgba(0,0,0,0)'; }
		if(past4daysSum == 0) { past4daysColor = 'rgba(0,0,0,0)'; }
		////////////////////
		// GENERATE CHART //
		////////////////////
		$('#appStatusIntake div').css("padding-top", "0px");
		var checkHeight = hasTap() ? 64 : 66;
		var catFontSize = "9px";
		if(lang == "fa") { catFontSize = "8px"; }
		//check exists
		if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
		if(!$('#appStatusIntake').html())						  { return; } 
		$('#appStatusIntake').highcharts({
			chart : {
				reflow: false,
				spacingLeft   : $("#appStatusIntake").width() / -6,
				spacingRight  : $("#appStatusIntake").width() / -9.2,
				spacingTop    : -1,
				spacingBottom : -12,
				height : checkHeight,
				width : $("#appStatusIntake").width(),
			},
			credits : {
				enabled : false
			},
			legend : {
				enabled : false
			},
			title : {
				text : ''
			},
			subtitle : {
				text : ''
			},
			xAxis : {
				categories : ['', past4daysLabel, past3daysLabel, past2daysLabel, past1daysLabel, ''],
				labels : {
					style : {
						color : "rgba(47, 126, 216, .45)",
						fontSize : catFontSize,
					},
					y : -2,
					x : 0,
				}
			},
			yAxis : {
				title : {
					text : ''
				},
				tickPositions : [firstTick, parseInt(window.localStorage.getItem("config_kcals_day_0")), lastTick],
				gridLineColor : 'rgba(0,0,0,.16)',
				gridLineDashStyle : 'longdash',
				labels : {
					enabled : false,
					align : 'left',
					x : 31,
					y : -1,
					textSize : '8px',
				},
				showFirstLabel : false,
				showLastLabel : false,
			},
			tooltip : {
				enabled : false,
				formatter : function () {
					return '<b>' + this.series.name + '</b><br/>' + this.x + ': ' + this.y + '°C';
				}
			},
			plotOptions : {
            series: {
				allowPointSelect: false,
                states: {
                    hover: {
                        lineWidth: 1
                    },
                },
            },
				line : {
					dataLabels : {
						enabled : true,
						style : {
							textShadow : '0 0 3px white',
							fontSize : '8px',
						},
					},
					enableMouseTracking : false
				}
			},
			series : [{
					type : 'area',
					name : 'solid filler',
					animation : false,
					data : [
						past5daysSum,
						past4daysSum,
						past3daysSum,
						past2daysSum,
						past1daysSum,
						past0daysSum
					],
					lineWidth : 1,
					lineColor : "rgba(47, 126, 216, .5)",
					fillColor : "rgba(47, 126, 216, .1)",
					marker : {
						enabled : false,
						lineWidth : 0,
						lineColor : "rgba(47, 126, 216, .5)",
						fillColor : 'white',
						states: {
							hover: {
								lineWidth : 1,
							},
						},
					},
				},
				{
					type : 'line',
					name : 'line with labels',
					animation : false,
					data : [
						{ y : past5daysSum, dataLabels : { x : 0, color : 'rgba(0,0,0,0)' } },
						{ y : past4daysSum, dataLabels : { x : 0, color : past4daysColor  } },
						{ y : past3daysSum, dataLabels : { x : 0, color : past3daysColor  } },
						{ y : past2daysSum, dataLabels : { x : 0, color : past2daysColor  } },
						{ y : past1daysSum, dataLabels : { x : 0, color : past1daysColor  } },
						{ y : past0daysSum, dataLabels : { x : 0, color : 'rgba(0,0,0,0)' } },
					],
					lineWidth : 0,
					lineColor : 'rgba(0,0,0,.2)',
					fillColor : 'rgba(0,0,0,.05)',
					marker : {
						enabled : false,
					},
					line : {
						dataLabels : {
							enabled : true,
							style : {
								textShadow : '0 0 3px white',
								fontSize : '8px',
							},
						},
					},
				}
			]
		});
		//write cache
		window.localStorage.setItem("appStatusIntake",$('#appStatusIntake').html());
		$('#appStatusIntake div').css("padding-top", "0px");
	});
	//wp8 nonstandand
	$('#appStatusIntake').on(touchend,function(){
		return false;
	});
}
//##///////////////////##//
//## GET NUTRI SLIDERS ##//
//##///////////////////##//
function getNutriSliders() {
	///////////////////
	// AUTOFIX RATIO //
	///////////////////
	if(isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[0])) || isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[1])) || isNaN(parseInt(window.localStorage.getItem('appNutrients').split('|')[2]))  ) {
		window.localStorage.setItem("appNutrients",'25|50|25');
	}
	///////////////////
	// SAVE CALLBACK //
	///////////////////
	var save = function() {
		if(parseInt(document.getElementById('sliderProInput').value) + parseInt(document.getElementById('sliderCarInput').value) + parseInt(document.getElementById('sliderFatInput').value) == 100) {
			window.localStorage.setItem('appNutrients',parseInt(document.getElementById('sliderProInput').value) + '|' + parseInt(document.getElementById('sliderCarInput').value) + '|' + parseInt(document.getElementById('sliderFatInput').value));
			updateNutriRatio();
			return true;
		} else {
			if(hasTouch()) {
				navigator.notification.alert(LANG.PLEASE_REVIEW[lang], voidThis,LANG.TOTAL_ERROR[lang],LANG.OK[lang]);
			} else {
				if(alert(LANG.TOTAL_ERROR[lang] + "\n" + LANG.PLEASE_REVIEW[lang]));
			}
			return false;
		}
	}
	///////////////////////
	// HANDLERS CALLBACK //
	///////////////////////
	var handlers = function() {
		///////////////////
		// PREVENT FOCUS //
		///////////////////
		$("#newWindow input").on(touchstart,function() {
			return false; 
		});
		///////////
		// CARPE //
		///////////
		if(document.getElementById('sliderProRange')) {
			$(document).trigger('carpeSlider');
			document.getElementById('sliderProRange').slider.setValue(0);
			document.getElementById('sliderCarRange').slider.setValue(0);
			document.getElementById('sliderFatRange').slider.setValue(0);
			document.getElementById('sliderProRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[0]));
			document.getElementById('sliderCarRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[1]));
			document.getElementById('sliderFatRange').slider.setValue(parseInt(window.localStorage.getItem('appNutrients').split('|')[2]));
		}
		////////////////
		// PRO.UPDATE //
		////////////////
		if(document.getElementById('sliderProInput')) {
		document.getElementById('sliderProInput').update = function() {
			if(document.getElementById('sliderProInput')) {
				document.getElementById('sliderProInput').value = parseInt(document.getElementById('sliderProRange').value)+ '%';
				if(parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value) + parseInt(document.getElementById('sliderFatRange').value) > 100) { 
					document.getElementById('sliderProInput').value = (100 - (parseInt(document.getElementById('sliderCarRange').value)) - (parseInt(document.getElementById('sliderFatRange').value))) + '%'; 
					document.getElementById('sliderProRange').slider.setValue(100 - (parseInt(document.getElementById('sliderCarRange').value)) - parseInt((document.getElementById('sliderFatRange').value)));
				}
				//update total
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		}}
		////////////////
		// CAR.UPDATE //
		////////////////
		if(document.getElementById('sliderCarInput')) {
		document.getElementById('sliderCarInput').update = function() {
			if(document.getElementById('sliderCarInput')) {
				document.getElementById('sliderCarInput').value = parseInt(document.getElementById('sliderCarRange').value)+ '%';
				if(parseInt(document.getElementById('sliderCarRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderFatRange').value) > 100) { 
					document.getElementById('sliderCarInput').value = (100 - (parseInt(document.getElementById('sliderProRange').value)) - (parseInt(document.getElementById('sliderFatRange').value))) + '%'; 
					document.getElementById('sliderCarRange').slider.setValue(100 - (parseInt(document.getElementById('sliderProRange').value)) - parseInt((document.getElementById('sliderFatRange').value)));
				}
				//update total	
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		}}
		////////////////
		// FAT.UPDATE //
		////////////////
		if(document.getElementById('sliderFatInput')) {
		document.getElementById('sliderFatInput').update = function() {
			if(document.getElementById('sliderFatInput')) {
				document.getElementById('sliderFatInput').value = parseInt(document.getElementById('sliderFatRange').value) + '%';
				if(parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value) > 100) { 
					document.getElementById('sliderFatInput').value = (100 - (parseInt(document.getElementById('sliderProRange').value)) - (parseInt(document.getElementById('sliderCarRange').value))) + '%'; 
					document.getElementById('sliderFatRange').slider.setValue(100 - (parseInt(document.getElementById('sliderProRange').value)) - parseInt((document.getElementById('sliderCarRange').value)));
				}
				//update total	
				document.getElementById('sliderTotalInput').value = LANG.TOTAL[lang] + ': ' + (parseInt(document.getElementById('sliderFatRange').value) + parseInt(document.getElementById('sliderProRange').value) + parseInt(document.getElementById('sliderCarRange').value)) + '%';
			}
		}}	
		/////////////////
		// INIT VALUES //
		/////////////////
		if(document.getElementById('sliderProRange')) {
			$("#sliderProInput").trigger('update');
			$("#sliderCarInput").trigger('update');
			$("#sliderFatInput").trigger('update');
		}
	}
	////////////////
	// HTML BLOCK //
	////////////////
	var htmlContent = '\
		<input type="text" id="sliderTotalInput" />\
		<div id="sliderPro">\
			<input type="text" id="sliderProInput" />\
			<div id="sliderProLabel">' + LANG.PROTEINS[lang] + '</div>\
			<div id="sliderProWrapper"><input id="sliderProRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderProInput" data-carpe-decimals="0" /></div>\
		</div>\
		<div id="sliderCar">\
			<input type="text" id="sliderCarInput" />\
			<div id="sliderCarLabel">' + LANG.CARBS[lang] + '</div>\
			<div id="sliderCarWrapper"><input id="sliderCarRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderCarInput" data-carpe-decimals="0" /></div>\
		</div>\
		<div id="sliderFat">\
			<input type="text" id="sliderFatInput" />\
			<div id="sliderFatLabel">' + LANG.FATS[lang] + '</div>\
			<div id="sliderFatWrapper"><input id="sliderFatRange" type="range" min="0" max="100" step="1" value="0" data-carpe-targets="sliderFatInput" data-carpe-decimals="0" /></div>\
		</div>\
	';
	/////////////////////
	// CALL NEW WINDOW //
	/////////////////////
	getNewWindow(LANG.NUTRIENT_TITLE[lang],htmlContent,handlers,save);
}
//##///////////////##//
//## TODAYOVERVIEW ##//
//##///////////////##//
function updateTodayOverview() {
	////////////
	// DEFINE //
	////////////
	var totalConsumed = parseInt(window.localStorage.getItem("config_ttf"));
	var totalIntake   = parseInt(window.localStorage.getItem("config_kcals_day_0")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
	var totalPercent  = totalConsumed / (totalIntake / 100);
	/////////////////////////
	// UPDATE BLOCK VALUES //
	/////////////////////////
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		if(window.localStorage.getItem("config_kcals_day") == "d") {
			totalIntake = parseInt(window.localStorage.getItem("config_kcals_day_2")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
			totalPercent  = totalConsumed / (totalIntake / 100);
			$("#appStatusWeight div p").html(totalConsumed + '<strong> / ' + window.localStorage.getItem("config_kcals_day_1") + '~<b>' + totalIntake + '</b></strong>');
		} else {
			totalIntake = parseInt(window.localStorage.getItem("config_kcals_day_1")) + Math.abs(parseInt(window.localStorage.getItem("config_tte")));
			totalPercent  = totalConsumed / (totalIntake / 100);
			$("#appStatusWeight div p").html(totalConsumed + '<strong> / <b>' + totalIntake + '</b>~' + window.localStorage.getItem("config_kcals_day_2") + '</strong>');
		}
	} else {
		$("#appStatusWeight div p").html(totalConsumed + '<strong> / ' + totalIntake + ' ' + LANG.KCAL[lang] + '</strong>');
	}
	/////////////////
	// PERCENT BAR //
	/////////////////
	$('#appStatusWeight em').css('width',totalPercent + "%");
	if(totalPercent >= 115) {
		$('#appStatusWeight em').addClass('exceed');
	} else {
		$('#appStatusWeight em').removeClass('exceed');
	}
	/////////////////////
	// SET CURRENT DAY //
	/////////////////////
	if(window.localStorage.getItem("config_kcals_day")) {
		$('.current').removeClass('current');
		$('#' + 'appDay' + window.localStorage.getItem("config_kcals_day").toUpperCase()).addClass('current');
	}
}
//##/////////////##//
//## CYCLIC MENU ##//
//##/////////////##//
function getCyclicMenu() {
	//////////
	// HTML //
	//////////
	var isCyclic = (window.localStorage.getItem("config_kcals_type") == "cyclic") ? 'checked' : '';
	var appModeHtml = "\
	<div id='appMode'>\
		<input id='appModeToggle' class='toggle' type='checkbox' " + isCyclic + ">\
		<label for='appModeToggle'></label>\
		<div id='appModeEnable'>\
			<input id='appCyclic1' type='number' value='" + window.localStorage.getItem("config_kcals_day_1") + "' />\
			<div id='appCyclic1Title'>" + LANG.DAYS[lang] + " A B C</div>\
			<input id='appCyclic2' type='number' value='" + window.localStorage.getItem("config_kcals_day_2") + "' />\
			<div id='appCyclic2Title'>" + LANG.DAY[lang] + " D</div>\
			<div id='appModeEnableInfo'><p>" + LANG.CYCLIC_INFO[lang].split('. ').join('_').split('.').join('.</p><p>').split('_').join('. ') + "</p></div>\
		</div>\
	</div>";
	//////////////
	// HANDLERS //
	//////////////
	appModeHandlers = function() {	
		/////////////////////////
		// backport validation //
		/////////////////////////
		var defaultInputHeaderi = "keypress";
		if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderi = "keydown"; }		
		$("#appCyclic1,#appCyclic2").on(defaultInputHeaderi, function(evt) {
			//no dots
			if((evt.which || evt.keyCode) == 46) { return false; }
			if((evt.which || evt.keyCode) == 8)  { return true; }
			if((evt.which || evt.keyCode) == 13) { return true; }
			//max
			if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
				$(this).val( parseInt($(this).val()) );
				$(this).val( $(this).val().slice(0,-1) );
			}
			//num only
			return isNumberKey(evt);
		});
		//////////////////////
		// BASIC VALIDATION //
		//////////////////////
		$("#appCyclic1").blur(defaultInputHeaderi, function(evt) {
			if($(this).val() == "")  { $(this).val(1600); }
			if($(this).val() == 0)   { $(this).val(1600); }
			if(isNaN($(this).val())) { $(this).val(1600); }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_kcals_day_1",$(this).val());
			if(window.localStorage.getItem("config_kcals_type") == "cyclic" && window.localStorage.getItem("config_kcals_day") != "d") {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_1")));
			}
			updateTodayOverview();
		});
		$("#appCyclic2").blur(defaultInputHeaderi, function(evt) {
			if($(this).val() == "")  { $(this).val(2000); }
			if($(this).val() == 0)   { $(this).val(2000); }
			if(isNaN($(this).val())) { $(this).val(2000); }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_kcals_day_2",$(this).val());
			if(window.localStorage.getItem("config_kcals_type") == "cyclic" && window.localStorage.getItem("config_kcals_day") == "d") {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_2")));
			}
			updateTodayOverview();
		});
		//////////////
		// TAP BLUR //
		//////////////
		$('#appMode').on(touchend,function(evt) {
			if($("#appCyclic1").is(':focus') || $("#appCyclic2").is(':focus')) {
				evt.preventDefault();
			}
			if(evt.target.id != "appCyclic1" && evt.target.id != "appCyclic2") {
				$("#appCyclic1").blur();
				$("#appCyclic2").blur();
			}
		});
		/////////////////////
		// SWITCH LISTENER //
		/////////////////////
		//set default
		if(!window.localStorage.getItem("config_kcals_type")) {
			window.localStorage.setItem("config_kcals_type","simple");
		}
		//read stored
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			$("#appModeToggle").prop('checked',true);
		}
		$('#appModeToggle + label').on(touchstart,function(obj) {
			$('#appModeToggle').trigger("change");
		});
		//read changes
		$('#appModeToggle').on("change",function(obj) {
			if($('#appModeToggle').prop('checked')) {
				appMode = "cyclic";
				window.localStorage.setItem("config_kcals_type","cyclic");
				$("body").removeClass("simple");
				$("body").addClass("cyclic");
			} else {
				appMode = "simple";
				window.localStorage.setItem("config_kcals_type","simple");
				$("body").removeClass("cyclic");
				$("body").addClass("simple");
			}
			//update underlying
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_2")));
				} else {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_1")));
				}
			} else {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_0")));
			}
		});
	}
	/////////////
	// CONFIRM //
	/////////////
	appModeConfirm = function() {
		updateTodayOverview();
		return true;
	}
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.CYCLIC_TITLE[lang],appModeHtml,appModeHandlers,appModeConfirm);
}
//##///////////////##//
//## BALANCE METER ##//
//##///////////////##//
function balanceMeter(kcalsInput) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return false; }
	if(isNaN(kcalsInput)) 									  { return false; }
	if(!kcalsInput)											  { return false; }
	kcalsInput = kcalsInput*-1;
	var balancePos = 0;
	//GET DEFINED
	var llim = parseInt(window.localStorage.getItem("config_limit_1"));
	var ulim = parseInt(window.localStorage.getItem("config_limit_2"));
	var ml = (Math.abs(llim));
	var pl = (ml*2)/100;
	var pu = (ulim*2)/100;
	// LIMITS 
	if(kcalsInput == 0) {
		balancePos = '50%';
	} else {
		////////////////////
		// SELF REFERENCE //
		////////////////////
		//balancePos = 100 - (((parseFloat(kcalsInput)+600)/12) ) + "%";
		if(parseInt(kcalsInput)*-1 > 0) {
			//postive
			balancePos = 100 - (((parseFloat(kcalsInput)+ulim)/pu) ) + "%";
		} else {
			//negative
			balancePos = 100 - (((parseFloat(kcalsInput)+ml)/pl) ) + "%";
		}
	}
	// LIMITS
	if(parseInt(balancePos) > 100) {
		balancePos = '100%';
	}
	if(parseInt(balancePos) < 0) {
		balancePos = '0';
	}
	//////////////////////
	// UPDATE NO-REPEAT //
	//////////////////////
	var roundedBar = (Math.round(parseFloat($("#balanceBar").css("text-indent")) * 100) / 100);
	var roundedNum = (Math.round(parseFloat(balancePos) * 100) / 100);
	if(roundedBar != roundedNum) {
		$("#balanceBar").css("text-indent",roundedNum + '%');
	}
}
//##/////////////##//
//## LIMIT MENU ##//
//##/////////////##//
function getLimitMenu() {
	//////////
	// HTML //
	//////////
	var appLimitHtml = "\
	<div id='appLimit'>\
		<div id='appLimitEnable'>\
			<input id='appLimit1' type='number' value='" + Math.abs(window.localStorage.getItem("config_limit_1")) + "' />\
			<div id='appLimit1Title'>" + LANG.LIMIT_LOWER[lang] + "</div>\
			<input id='appLimit2' type='number' value='" + window.localStorage.getItem("config_limit_2") + "' />\
			<div id='appLimit2Title'>" + LANG.LIMIT_UPPER[lang] + "</div>\
			<div id='appLimitInfo'><p>" + LANG.LIMIT_INFO[lang].split('. ').join('_').split('.').join('.</p><p>').split('_').join('. ') + "</p></div>\
		</div>\
	</div>";
	//////////////
	// HANDLERS //
	//////////////
	appLimitHandlers = function() {	
		/////////////////////////
		// backport validation //
		/////////////////////////
		var defaultInputHeaderl = "keypress";
		if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderl = "keydown"; }		
		$("#appLimit1,#appLimit2").on(defaultInputHeaderl, function(evt) {
			//no dots
			if((evt.which || evt.keyCode) == 46) { return false; }
			if((evt.which || evt.keyCode) == 8)  { return true; }
			if((evt.which || evt.keyCode) == 13) { return true; }
			//max
			if(parseInt($(this).val()) > 9999 || $(this).val().length > 3) {
				$(this).val( parseInt($(this).val()) );
				$(this).val( $(this).val().slice(0,-1) );
			}
			//num only
			return isNumberKey(evt);
		});
		//////////////////////
		// BASIC VALIDATION //
		//////////////////////
		$("#appLimit1").blur(defaultInputHeaderl, function(evt) {
			if($(this).val() == "")  { $(this).val(600);  }
			if($(this).val() == 0)   { $(this).val(600);  }
			if(isNaN($(this).val())) { $(this).val(600);  }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_limit_1",$(this).val()*-1);
		});
		$("#appLimit2").blur(defaultInputHeaderl, function(evt) {
			if($(this).val() == "")  { $(this).val(600);  }
			if($(this).val() == 0)   { $(this).val(600);  }
			if(isNaN($(this).val())) { $(this).val(600);  }
			if($(this).val() < 100)  { $(this).val(100);  }
			if($(this).val() > 9999) { $(this).val(9999); }
			window.localStorage.setItem("config_limit_2",$(this).val());
		});
		//////////////
		// TAP BLUR //
		//////////////
		$('#appLimit').on(touchend,function(evt) {
			if($("#appLimit1").is(':focus') || $("#appLimit2").is(':focus')) {
				evt.preventDefault();
			}
			if(evt.target.id != "appLimit1" && evt.target.id != "appLimit2") {
				$("#appLimit1").blur();
				$("#appLimit2").blur();
			}
		});
		/////////////////////
		// SWITCH LISTENER //
		/////////////////////
		//read stored
		/*
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			$("#appModeToggle").prop('checked',true);
		}
		$('#appModeToggle + label').on(touchstart,function(obj) {
			$('#appModeToggle').trigger("change");
		});
		//read changes
		$('#appModeToggle').on("change",function(obj) {
			if($('#appModeToggle').prop('checked')) {
				appMode = "cyclic";
				window.localStorage.setItem("config_kcals_type","cyclic");
				$("body").removeClass("simple");
				$("body").addClass("cyclic");
			} else {
				appMode = "simple";
				window.localStorage.setItem("config_kcals_type","simple");
				$("body").removeClass("cyclic");
				$("body").addClass("simple");
			}
			//update underlying
			if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
				if(window.localStorage.getItem("config_kcals_day") == "d") {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_2")));
				} else {
					$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_1")));
				}
			} else {
				$("#editableDiv").html(parseInt(window.localStorage.getItem("config_kcals_day_0")));
			}
		});*/
	}
	/////////////
	// CONFIRM //
	/////////////
	appLimitConfirm = function() {
		$("#appLimit1").blur();
		$("#appLimit2").blur();
		return true;
	}
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.CALORIC_THRESHOLD[lang],appLimitHtml,appLimitHandlers,appLimitConfirm);
}

//inappbilling.getPurchases(function(e) { alert(JSON.stringify('list: ' + e)); }, function(e) { alert(JSON.stringify('error: ' + e)); });
//inappbilling.init(function(e) { 
//alert(JSON.stringify('success: ' + e)); 
//inappbilling.getPurchases(function(e) { alert(JSON.stringify('list: ' + e)); }, function(e) { alert(JSON.stringify('error: ' + e)); });
//inappbilling.buy(function(e) { alert(JSON.stringify('list: ' + e)); }, function(e) { alert(JSON.stringify('list: ' + e)); }, 'com.cancian.syncservice');
//android.test.purchased
//}, function(e) { alert(JSON.stringify('error: ' + e)); }, true);
