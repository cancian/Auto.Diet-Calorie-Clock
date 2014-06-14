//##/////////////////##//
//## GET FULLHISTORY ##//
//##/////////////////##//
function getFullHistory() {
	var fullArray   = [];
	var oldestEntry = new Date().getTime();
	var now         = new Date().getTime();
	var day         = 60*60*24*1000;
	var week        = day*7;
	var month       = day*30;
	var months      = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var monthName   = months[new Date().getMonth()];
	var todaysTime  = Date.parse(new Date(monthName + " " +  new Date().getDate() + ", " + new Date().getFullYear()));
	/////////////////
	// GET ENTRIES //
	/////////////////
	getEntries(function(data) {
		for(var g=0, len=data.length; g<len; g++) {
			fullArray.push({ date: DayUtcFormat(parseInt(data[g].published)),val: data[g].title});
			//GET OLDEST
			if(oldestEntry > parseInt(data[g].published)) {
				oldestEntry = parseInt(data[g].published);
			}
		}
		//SORT
		fullArray = fullArray.sort(function(a, b) {
			return (a["date"] > b["date"]) ? 1 : ((a["date"] < b["date"]) ? -1 : 0);
		});
		// at least a week
		if(now - oldestEntry < week) {
			 oldestEntry = now - week;
		}
		//at most a month
		if(now - oldestEntry > month) {
			//oldestEntry = now - month;
		}
		//MORE THAN A DAY
		//if(DayUtcFormat(now) != DayUtcFormat(oldestEntry)) {
		var countBack = todaysTime;
		var dayArray  = [];
		/////////////////////
		// DAY INJECT LOOP //
		/////////////////////
		while(oldestEntry-(day*1) < countBack) {
			var daySum = 0;
			//dump all day data in date array
			for(var h=0, hen=fullArray.length; h<hen; h++) {
				if(fullArray[h]['date'] == DayUtcFormat(countBack)) {
					daySum = daySum + parseInt(fullArray[h]['val']);
				}
			}
			//insert
			dayArray.push([countBack,daySum]);
			//while
			countBack = countBack - day;
		}
		/////////////////
		// MANUAL TICK //
		/////////////////
		/*
		var upperTick = 0;
		var lowerTick = 0;
		//HIGHEST/LOWEST
		for(var i=0, ien=dayArray.length; i<ien; i++) {
			if(dayArray[i][1] > upperTick) {
				upperTick = dayArray[i][1]
			}
			if(dayArray[i][1] < lowerTick) {
				lowerTick = dayArray[i][1]
			}
		}
		lowerTick = lowerTick*1.5;
		upperTick = upperTick*1.5;
		// MID TICK
		midTick = parseInt(window.localStorage.getItem("config_kcals_day_0"));
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				midTick = parseInt(window.localStorage.getItem("config_kcals_day_2"));
			} else {
				midTick = parseInt(window.localStorage.getItem("config_kcals_day_1"));
			}
		}
		// CHECK
		if(upperTick < 600) {
			upperTick = midTick+600;
		}
		if(midTick >= upperTick) {
			upperTick = midTick*1.5;
		}
		*/
		//////////////
		// HANDLERS //
		//////////////
		var appHistoryHandlers = function () {
			//#/////////////////////////#//
			//# REBUILD HISTORY SNIPPET #//
			//#/////////////////////////#//
			rebuildHistory = function () {
				////////////////
				// LOCAL DATE //
				////////////////
				Highcharts.setOptions({
					lang : {
						shortMonths : LANG.MONTH_SHORT[lang].split(', '),
						weekdays : LANG.WEEKDAY_SHORT[lang].split(', '),
					}
				});
				///////////////
				// MIN WIDTH //
				///////////////
				var minWidth = $("#appContent").width() / dayArray.length;
				if (minWidth < 20) {
					minWidth = 20;
				}
				if (minWidth > 100) {
					minWidth = 100;
				}
				minWidth = dayArray.length * minWidth;
				if (minWidth < $("#appContent").width()) {
					minWidth = $("#appContent").width();
				}
				////////////////
				// STATISTICS //
				////////////////
				$('#appHistory').highcharts({
					chart : {
						reflow : false,
						spacingLeft : 0,
						spacingRight : 0,
						spacingTop : 0,
						spacingBottom : 9,
						height : $("#newWindow").height() - 9,
						width : minWidth,
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
					tooltip : {
						enabled : true,
					},
					subtitle : {
						text : ''
					},
					yAxis : {
						title : {
							text : ''
						},
						//tickPositions : [lowerTick, midTick, upperTick],
						gridLineColor : 'rgba(0,0,0,.12)',
						//gridLineDashStyle : 'longdash',
						labels : {
							enabled : true,
							align : 'left',
							x : 2, //31,
							y : -1,
							textSize : '9px',
						},
						showFirstLabel : false,
						showLastLabel : false,
					},
					xAxis : {
						type : 'datetime',
					},
					plotOptions : {
						series : {
							marker : {
								enabled : true,
								lineWidth : 2,
								lineColor : '#2F7ED8',
								fillColor : 'white',
								states : {
									hover : {
										lineWidth : 2,
									},
								},
							},
							allowPointSelect : false,
							lineWidth : 2,
							states : {
								hover : {
									lineWidth : 2
								},
							},
						},
						line : {
							dataLabels : {
								enabled : false,
								style : {
									textShadow : '0 0 3px white',
									fontSize : '12px',
								},
								y : -9,
							},
							enableMouseTracking : true,
						}
					},
					series : [{
							type : 'line',
							name : LANG.KCAL[lang],
							animation : false,
							data : dayArray.sort()
						}
					]
				});
			}
			/////////////
			// EXECUTE //
			/////////////
			rebuildHistory();
		}
		//////////
		// HTML //
		//////////
		var appHistoryHtml = "<div id='appHistory'></div>";
		/////////////
		// CONFIRM //
		/////////////
		var appHistoryConfirm = function() {
			return true;
		}
		/////////////////
		// CALL WINDOW //
		/////////////////
		getNewWindow(LANG.STATISTICS[lang],appHistoryHtml,appHistoryHandlers,appHistoryConfirm);
	});
}
//##////////////////##//
//## INTAKE HISTORY ##//
//##////////////////##//
function intakeHistory() {
	//check exists
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
	if(!$('#appStatusIntake').html())						  { return; } 
	//if($('#appStatusIntake div').length === 0) { return; }
	//go
	var firstTick = 0;
	var lastTick  = parseInt(window.localStorage.getItem("config_kcals_day_0")) * 1.5;
	var origTick  = parseInt(window.localStorage.getItem("config_kcals_day_0"));
	/////////////////
	// CYCLIC CASE //
	/////////////////
	if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
		if(window.localStorage.getItem("config_kcals_day") == "d") {
			lastTick = parseInt(window.localStorage.getItem("config_kcals_day_2")) * 1.5;
			origTick = parseInt(window.localStorage.getItem("config_kcals_day_2"));
		} else {
			lastTick = parseInt(window.localStorage.getItem("config_kcals_day_1")) * 1.5;
			origTick = parseInt(window.localStorage.getItem("config_kcals_day_1"));
		}
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
		//if(lastTick < 300) { lastTick = 300; }
		if(lastTick < 600) { lastTick = lastTick+600; }
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
				tickPositions : [firstTick, origTick, lastTick],
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
						lineColor : "rgba(0, 0, 0, 0)",
						fillColor : "rgba(0, 0, 0, 0)",
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
	///////////////////////
	// INDICATE ADDITION //
	///////////////////////
	if(Math.abs(parseInt(window.localStorage.getItem("config_tte")) != 0)) {
		$("#appStatusWeight span").html(LANG.TODAY[lang] + ' (+' + Math.abs(parseInt(window.localStorage.getItem("config_tte"))) + ')');
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
	var appModeHandlers = function() {	
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
			evt.stopPropagation();
			if($("#appCyclic1").is(':focus') || $("#appCyclic2").is(':focus')) {
				if(evt.target.id != "appCyclic1" && evt.target.id != "appCyclic2") {
					evt.preventDefault();
				}
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
	var appModeConfirm = function() {
		$("#appCyclic1").blur();
		$("#appCyclic2").blur();		
		updateTodayOverview();
		intakeHistory();
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
function balanceMeter(kcalsInput,update) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return false; }
	if(isNaN(parseInt(kcalsInput)))							  { return false; }
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
	if(roundedBar != roundedNum || update == 'now') {
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
			<div id='appLimit1Title'>" + LANG.LIMIT_LOWER[lang] + " <span>(" + LANG.DEFICIT[lang] + ")</span></div>\
			<input id='appLimit2' type='number' value='" + window.localStorage.getItem("config_limit_2") + "' />\
			<div id='appLimit2Title'>" + LANG.LIMIT_UPPER[lang] + " <span>(" + LANG.SURPLUS[lang] + ")</span></div>\
			<div id='appLimitInfo'><p>" + LANG.LIMIT_INFO[lang].split('. ').join('_').split('.').join('.</p><p>').split('_').join('. ') + "</p></div>\
		</div>\
	</div>";
	//////////////
	// HANDLERS //
	//////////////
	var appLimitHandlers = function() {	
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
			evt.stopPropagation();
			if($("#appLimit1").is(':focus') || $("#appLimit2").is(':focus')) {
				if(evt.target.id != "appLimit1" && evt.target.id != "appLimit2") {
					evt.preventDefault();
				}
			}
			if(evt.target.id != "appLimit1" && evt.target.id != "appLimit2") {
				$("#appLimit1").blur();
				$("#appLimit2").blur();
			}
		});
	}
	/////////////
	// CONFIRM //
	/////////////
	var appLimitConfirm = function() {
		$("#appLimit1").blur();
		$("#appLimit2").blur();
		return true;
	}
	/////////////////
	// CALL WINDOW //
	/////////////////
	getNewWindow(LANG.CALORIC_THRESHOLD[lang],appLimitHtml,appLimitHandlers,appLimitConfirm);
}
//##/////////////##//
//## GET ELAPSED ##//
//##/////////////##//
function getElapsed(swap) {
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return false; }
	////////////////
	// FIRST LOAD //
	////////////////
	if(!window.localStorage.getItem("config_swap")) {
		window.localStorage.setItem("config_swap",1);
	}
	//////////////
	// HOT SWAP //
	//////////////
	if(swap == "next") {
		     if(window.localStorage.getItem("config_swap") == 1) { window.localStorage.setItem("config_swap",2); swap = 2; }
		else if(window.localStorage.getItem("config_swap") == 2) { window.localStorage.setItem("config_swap",3); swap = 3; }
		else if(window.localStorage.getItem("config_swap") == 3) { window.localStorage.setItem("config_swap",1); swap = 1; }
	}
	//////////
	// VARS //
	//////////
	swap = window.localStorage.getItem("config_swap");
	var swapData;
	var swapSub;
	//////////////////
	// ELAPSED TIME //
	//////////////////
	if(swap == 1) {
		//DATA
		swapData = dateDiff(window.localStorage.getItem("config_start_time"),new Date().getTime());
		swapSub  = LANG.ELAPSED_TIME[lang];
	///////////////////
	// RELATIVE TIME //
	///////////////////
	} else if(swap == 2) {
		//PER DAY
		eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_0"));
		if(window.localStorage.getItem("config_kcals_type") == "cyclic") {
			if(window.localStorage.getItem("config_kcals_day") == "d") {
				eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_2"));
			} else {
				eqPerDay = parseInt(window.localStorage.getItem("config_kcals_day_1"));
			}
		}
		var nowDate = new Date().getTime();
		var eqRatio = (60*60*24*1000) / eqPerDay;
		var eqDiff  = nowDate - Math.floor(Math.abs(timerKcals*eqRatio));
		//DATA
		swapData = dateDiff(eqDiff,nowDate);
		swapSub  = LANG.RELATIVE_TIME[lang];
	/////////////////
	// WEIGHT LOSS //
	/////////////////
	} else if(swap == 3) {
		var weightLoss;
		var weightLossUnit = (window.localStorage.getItem("calcForm#pA6H") == "kilograms") ? LANG.KG[lang] : LANG.LB[lang];
		if(window.localStorage.getItem("appStatus") == "running") {
			weightLoss = ((((Number(window.localStorage.getItem("calcForm#pA6G"))) * ((Number(new Date().getTime()) - (Number(window.localStorage.getItem("config_start_time")))) / (60*60*24*7))) / 1000)).toFixed(7);
		} else {
			weightLoss = "0.0000000";
		}
		//DATA
		swapData = weightLoss + ' ' + weightLossUnit;
		swapSub  = LANG.WEIGHT_LOSS[lang];
	}
	////////////////////
	// SHRINK ELIPSIS //
	////////////////////
	if(swap == 1 || swap == 2) {
		//selective shrink
		if(swapData) {
			swapData = swapData.split(LANG.AGO[lang]).join('').split(LANG.PREAGO[lang]).join('');
			if(swapData.length > 20 && window.innerWidth <= 360) {
				swapData = swapData.replace(LANG.MINUTES[lang],LANG.MIN[lang]);
				swapData = swapData.replace(LANG.MINUTE[lang],LANG.MIN[lang]);
				swapData = trim(swapData.replace('.',''));
				if(swapData.match('min')) {
					swapData = swapData + '.';	
				}
			}
		}
	}
	/////////////////////
 	// UPDATE CONTENTS //
	/////////////////////
	if($("#appStatusElapsed div p").html() != swapData) {
		$("#appStatusElapsed div p").html(swapData);
	}
	if($("#appStatusElapsed div p").html() != swapSub) {
		$("#appStatusElapsed div span").html(swapSub);
		$('#elapsedIndicators div').removeClass('activeSwap');
		$('#ind' + swap).addClass('activeSwap');
	}
}
//##////////////////##//
//## GET ENTRY EDIT ##//
//##////////////////##//
function getEntryEdit(eid) {
	getEntry(eid,function(data) {
		//////////////
		// HANDLERS //
		//////////////
		var getEntryHandler = function() {
			//MOBISCROLL
			$('#getEntryDate').mobiscroll().datetime({
				preset: 'datetime',
				minDate: new Date((new Date().getFullYear() - 1),1,1, 0, 0),
				maxDate: new Date(),
				theme: 'android-ics light',
				lang: 'en',
		       	dateFormat: 'yyyy/mm/dd',
        		dateOrder:  'dd MM yy',
		        timeWheels: 'HH:ii',
		        timeFormat: 'HH:ii',
				setText: LANG.OK[lang],
				closeText: LANG.CANCEL[lang],
				cancelText: LANG.CANCEL[lang],
				display: 'modal',
				stepMinute: 1,
				animate: 'none',
				monthNames: LANG.MONTH_SHORT[lang].split(', '),
				monthNamesShort: LANG.MONTH_SHORT[lang].split(', '),
				mode: 'scroller'
			});
			//SET
			$('#getEntryDate').scroller('setDate',new Date(parseInt($('#getEntryDate').val())), true);
			//SAVE IF CHANGED
			$('#getEntryDate').on('change',function() {
				$('#getEntryDateHidden').val(Date.parse($(this).val()));
			});
			$('#getEntryDate').on(touchstart,function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				kickDown();
				setTimeout(function() {
					$("#getEntryWrapper input").blur();
					$('#getEntryDate').click();
				},100);
			});
			$('#getEntryDate').on('focus',function() {
				$('#getEntryDate').blur();
			});
			/////////////////////////
			// backport validation //
			/////////////////////////
			var defaultInputHeaderi = "keypress";
			if(androidVersion() == 4.1 || isMobile.Windows()) { defaultInputHeaderi = "keydown"; }
			$("#getEntryTitle,#getEntryPro,#getEntryCar,#getEntryFat").on(defaultInputHeaderi, function(evt) {
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
			$("#getEntryTitle,#getEntryPro,#getEntryCar,#getEntryFat").blur(defaultInputHeaderi, function(evt) {
				if($(this).val() == "")   { $(this).val(0); }
				if($(this).val() == 0)    { $(this).val(0); }
				if(isNaN($(this).val()))  { $(this).val(0); }
				if(evt.target.id != "getEntryTitle") {
					if($(this).val() < 0) { $(this).val(0); }
				}
				if($(this).val() > 9999)  { $(this).val(9999); }
			});
			//////////////
			// TAP BLUR //
			//////////////
			$('#newWindow').on(touchend,function(evt) {
				evt.stopPropagation();
				if($("#getEntryWrapper input").is(':focus')) {
					if((evt.target.id).indexOf('getEntry') === -1) {
						evt.preventDefault();
					}
				}
				if((evt.target.id).indexOf('getEntry') === -1) {
					kickDown();
					$("#getEntryWrapper input").blur();
				}
			});
		};
		/////////////
		// CONFIRM //
		/////////////
		var getEntrySave = function() {
			//WRITE
			updateEntry({
				id:parseInt($('#getEntryId').val()),
				title:$("#getEntryTitle").val() + '',
				body:$("#getEntryBody").val() + '',
				published:parseInt($('#getEntryDateHidden').val()) + '',
				pro:parseFloat($("#getEntryPro").val()) + '',
				car:parseFloat($("#getEntryCar").val()) + '',
				fat:parseFloat($("#getEntryFat").val()) + ''
			});
			//REFRESH DATA
			setTimeout(function() {
				//$('#' + $('#getEntryId').val()).remove();
				updateEntries(parseInt($('#getEntryDateHidden').val()));
			}, 0);
			return true;
		};
		//////////
		// HTML //
		//////////
		var pro = data[0].pro;
		var car = data[0].car;
		var fat = data[0].fat;
		if(!data[0].pro || isNaN(pro)) { pro = 0; }
		if(!data[0].car || isNaN(car)) { car = 0; }
		if(!data[0].fat || isNaN(fat)) { fat = 0; }
		var getEntryHtml = "\
			<div id='getEntryWrapper'>\
				<div id='divEntryBody'><span>"  + LANG.ADD_NAME[lang] + "</span><input type='text' id='getEntryBody' value='"    + data[0].body      + "' /></div>\
				<div id='divEntryTitle'><span>" + LANG.KCAL[lang]     + "</span><input type='number' id='getEntryTitle' value='" + data[0].title     + "' /></div>\
				<div id='divEntryPro'><span>"   + LANG.PRO[lang]      + "</span><input type='number' id='getEntryPro' value='"   + pro               + "' /></div>\
				<div id='divEntryCar'><span>"   + LANG.CAR[lang]      + "</span><input type='number' id='getEntryCar' value='"   + car               + "' /></div>\
				<div id='divEntryFat'><span>"   + LANG.FAT[lang]      + "</span><input type='number' id='getEntryFat' value='"   + fat               + "' /></div>\
				<div id='divEntryDate'><span>"  + LANG.DATE[lang]     + "</span><input type='text' id='getEntryDate' value='"    + data[0].published + "' /></div>\
				<input type='hidden' id='getEntryId'         value='" + data[0].id        + "' />\
				<input type='hidden' id='getEntryDateHidden' value='" + data[0].published + "' />\
			</div>";
		/////////////////
		// CALL WINDOW //
		/////////////////
		getNewWindow(LANG.EDIT[lang],getEntryHtml,getEntryHandler,getEntrySave);
	});
}


