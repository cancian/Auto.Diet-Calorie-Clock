//#//////////////////#//
//# DYNAMIC HANDLERS #//
//#//////////////////#//
//var eP = 0;
$(document).on("pageload", function(evt) {
	// PREVENT++ //
	if((evt.target.id) > 0) {
		var tgt = "#" + evt.target.id;
	} else {
		var tgt = "";
	}
	///////////////////
	// HOLD PRE-FILL //
	///////////////////
	var deKeyboard = 0;
	$("#entryList div" + tgt).on("longhold",function(evt) {
		if($('#entryList .entryListRow').length > 0 && !$("#kcalsDiv").is(":visible") && !$('.delete').hasClass('open') && deKeyboard == 0) {
			var holdPreText = $('.entriesBody',this).text();
			$("#entryBody").stop().animate({ backgroundColor: "#ffff88" }, 1,function() { $("#entryBody").val(holdPreText); }).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
			$('.entriesBody',this).stop().animate({ color: "#ffcc33" }, 1).animate({ color: "#666"},1500);
		}
	});
	$("#appContent").scroll(function() {
		deKeyboard = 1;
	});
	//////////////////
	// FORCE RETURN //
	//////////////////
	var entryReturn = false;
	$("#entryList div" + tgt).on(touchstart, function(evt) {
		if($('#entryTime').is(':focus')) { entryReturn = true; }
		if($('#entryBody').is(':focus')) { entryReturn = true; }
		deKeyboard = 0;
	});
	$("#entryList div" + tgt).on(tap, function(event) {
	//$("#entryList div" + tgt).swipe({tap:function(event) {
	//event.preventDefault();
		//////////////
		// TAP DATE //
		//////////////
		if(event.target.id.length == 13 && !$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
			$( "#" + event.target.id).html(dtFormat(Number(event.target.id)));
			setTimeout(function() {
				$("#" + event.target.id).html(dateDiff(event.target.id,(new Date()).getTime()));
			},2000);
			 entryReturn = true;
		}
		//////////////////
		// TAP DIV EDIT //
		//////////////////
		//no delete
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if($('.delete').hasClass('busy'))  { return; }
			if($('#kcalsDiv').is(':visible'))  { return; }
			if($('#entryList div').is(':animated') || $('.editableInput').is(':visible') || $('#entryBody').is(':animated') || entryReturn == true || deKeyboard != 0) { entryReturn = false; return; }
					////////////////////////
					// START ENTRY UPDATE //
					////////////////////////
					if(!$('.editableInput').is(':visible')) {
						if(!$(this).has('input').length) {
							var value = trim($('.entriesBody',this).text());
							var kcals = $('.entriesTitle',this).html();
							var timedBlur = new Date().getTime();
							$('.entriesTitle',this).attr('id', 'kcalsDiv');
							var input = $('<input/>', {
								'type':'text',
								'id':'editableInput',
								'class':'editableInput',
								'value':value,
								//ONCHANGE HANDLER
								blur: function() {
									////////////////
									// TIMED BLUR //
									////////////////
									var nowBlur = new Date().getTime();
									if(nowBlur - timedBlur < 600) {
										var blurVal = $("#editableInput").val();
										$("#editableInput").focus();
										$("#editableInput").val('');
										setTimeout( function() {
											$("#editableInput").val(blurVal);
										},0);
										return;
									}
									var new_value = $(this).val();
									//VALIDATE
									if(this.value == "") {
                                               if(Number(document.getElementById('kcalsDiv').innerHTML) > 0) {
											new_value = LANG("FOOD");
										} else if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
											new_value = LANG("EXERCISE");
										} else {
											new_value = "";
										}
									}
									$(this).replaceWith(new_value);
									$('#kcalsAdjust').remove();
									$('#kcalsDiv').parent("div").removeClass("editing");
									$('#kcalsDiv').parent("div").animate({"backgroundColor": "#fff"},500,function(evt) {
										eP = 0;
										deKeyboard = (new Date()).getTime();
										return false;
									});
									$('#kcalsDiv').removeAttr('id');
									$("#sliderBlock").fadeOut(500);
									clearRepeaterBlock();
									//whitegap fix
									//$("#entryListWrapper").off(touchmove);
									//$("#entryListWrapper").on(touchmove, function(evt) {
										window.scroll($('#appContent')[0].scrollTop,0,0);
										return false;
									//});
								},
								change: function() {
									//save changes
									var editableValue = $("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
									diary.saveEntry({body:editableValue,id:$(this).closest('div').data("id")}, function() {
										//return false;
									});
									//set blur
									if(!$("#entryList div").is(':animated')) {
										$("#editableInput").blur();
									}
								}
							});
							//start edit
							$('.entriesBody',this).empty();
							$('.entriesBody',this).html(input);
							$('.entriesBody',this).after('<p id="kcalsAdjust">\
							<span id="adjustNegBlock"><span id="adjustNeg"></span></span>\
							<span id="adjustPosBlock"><span id="adjustPos"></span></span>\
							</p>');
							$("#editableInput").focus();
							///////////////////////
							// RESET ENTRY VALUE //
							///////////////////////
							$("#kcalsDiv").off(touchstart);
							$("#kcalsDiv").on(touchstart, function(evt) {
								evt.preventDefault();
								//no reset block
								if(!$(this).parent('div').hasClass("editing")) {
									return;
								}
								var thisRowId = $(this).closest('div').data("id");
								//INTOTHEVOID//
								function intoTheVoid(button) {
									//ON CONFIRM
									if(button == 1) {
										document.getElementById('kcalsDiv').innerHTML = 0;
										document.getElementById('kcalsDiv').style.color = '#333';
										//save
										diary.saveEntry({title:'0',id:thisRowId});
										updateTimer();
									}
									return false;
								}
								//SHOW DIALOG
								if(hasTouch() && (!isMobile.Android() || androidVersion() >= 4.4)) {
									navigator.notification.confirm(LANG("ARE_YOU_SURE"), intoTheVoid, LANG("RESET_ENTRY_DIALOG"), [LANG("OK"),LANG("CANCEL")]);
									return false;
								} else {
									if(confirm(LANG("RESET_ENTRY_DIALOG"))) { intoTheVoid(1); } else { return false; }
								}
								return false;
							});
							/////////////////////
							// POSITIVE ADJUST //
							/////////////////////
							$("#adjustPosBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								$(this).addClass("activeBlock");
								if(Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
									//console.log("increase entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$(this).closest('div').data("id")}, function() {
										return false;
									});
									updateTimer();
								}
								return false;
							});
							/////////////////////
							// NEGATIVE ADJUST //
							/////////////////////
							$("#adjustNegBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								$(this).addClass("activeBlock");
								if(Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
									updateTimer();
								}
								return false;
							});
							///////////////////////
							// POSITIVE REPEATER //
							///////////////////////
							function clearRepeaterBlock() {
								clearTimeout(pressTimerNeg);
								clearTimeout(pressTimerPos);
								clearInterval(pressRepeatNeg);
								clearInterval(pressRepeatPos);
							}
							///////////////
							// AUTOCLEAR //
							///////////////
							$("#adjustPosBlock,#adjustNegBlock").on(touchend + " mouseout mouseup mouseleave", function(evt) {
								evt.preventDefault();
								$(".activeBlock").removeClass("activeBlock");
								clearRepeaterBlock();
							});
							//
							var pressTimerPos;
							var pressRepeatPos;
							$("#adjustPosBlock").on(touchend, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
							});
							$("#adjustPosBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
								pressTimerPos  = window.setTimeout(function()  {
								pressRepeatPos = window.setInterval(function() {
								//ACTION
								if(Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},275);
								},275);
							});
							///////////////////////
							// NEGATIVE REPEATER //
							///////////////////////
							var pressTimerNeg;
							var pressRepeatNeg;
							$("#adjustNegBlock").on(touchend, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
							});
							$("#adjustNegBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								clearRepeaterBlock();
								pressTimerNeg  = window.setTimeout(function()  {
								pressRepeatNeg = window.setInterval(function() {
								//ACTION
								if(Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (25);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									diary.saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},275);
								},275);
							});
							//prevent empty list highlight
							if(!isNaN($(this).closest("div").attr("id"))) {
								var editableValue = $("#editableInput").val();
								if(editableValue == LANG("FOOD") || editableValue == LANG("EXERCISE")) { $("#editableInput").val(''); }
								//remove double spaces
								$("#editableInput").val($("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" "));
								// FOCUS, THEN SET VALUE
								//$("#editableInput").select();
								$("#editableInput").focus();
								$(this).closest("div").animate({"backgroundColor": "#ffffcc"},600);
								$(this).closest("div").addClass("editing");
								$("#sliderBlock").remove();
								$("#entryListForm").prepend("<div id='sliderBlock'></div>");
								//blur block
								$("#sliderBlock").on(touchstart, function(evt) {
									evt.preventDefault();
									evt.stopPropagation();
									if(!$("#entryList div").is(':animated')) {
										$("#editableInput").blur();
									}
								});
							}
						}
					}
					//////////////////////
					// END ENTRY UPDATE //
					//////////////////////
		}
	});
	//#///////////////#//
	//# IOS ROW SWIPE #//
	//#///////////////#//
	//block hold prefill
	$("#entryList").swipe({
		swipe:function(event,direction) {
			deKeyboard = 1;
		}
	});
	$("#entryList div" + tgt).swipe({
		swipe:function(event,direction) {
			//console.log("row " + $(this).parent('div').data("id") + " swipe");
			if(direction == 'left' || direction == 'right') {
				//HIDE ACTIVE
				if(!$('.delete').hasClass('busy')) {
					$('.active').addClass('busy');
					$('.active').removeClass('open');
					$('.active').on('webkitTransitionEnd',function(evt) { $('.active').removeClass('busy'); });
					$('.active').removeClass('active');
				}
				//SHOW
				if(!$('#entryList div:animated').length > 0 && !$('.delete').hasClass('busy') && !$('.delete').hasClass('busy') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('.editableInput').is(':focus') && !$('#entryBody').is(':focus') && !$('#entryTime').is(':focus')) {
					$('.delete',this).addClass('active');
					$('.delete',this).addClass('busy');
					$('.delete',this).addClass('open');
					$('.delete',this).on('webkitTransitionEnd',function(evt) { $('.delete').removeClass('busy'); }); 
				}
			}
		}
	});
	$("#entryList div").swipe("option", "threshold", 32);
	$("#entryList div").swipe("option", "allowPageScroll", "vertical");
	/////////////////////
	// STOP ENTRY EDIT //
	/////////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#entryList div").on(touchstart, function(evt) {
		if(!$('.editableInput').is(':visible')) { return; }
		if($('.editableInput').is(':visible') && $("#editableInput").is(":focus")) {
		//dismiss protection
		//if($("#entryList div" + tgt).is(':animated')) { return; }
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			evt.stopPropagation();
		//ID MATCH
		if(!$("#entryList div").is(':animated')) {
			if($(this).attr("id") != $("#editableInput").closest("div").attr("id")) {
				$("#editableInput").blur();
					evt.preventDefault();
					evt.stopPropagation();
				}
			}			
		}
	});
	//wrapper click
	$("#entryListWrapper").on(touchstart, function(evt) {
		if($('.editableInput').is(':visible')) {
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			//evt.stopPropagation();
		}
		if(evt.target.id == "entryListWrapper") {
			if(!$("#entryList div").is(':animated')) {
				$("#editableInput").blur();
				//evt.stopImmediatePropagation();
				//whitegap mitigation
				if(isMobile.Android()) {
					return false;
				}
				//evt.preventDefault();
			} 
		}
	});
	/////////////////
	// GLOBAL HIDE //
	/////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#entryListWrapper").on(tap + " swipeLeft swipeRight", function(evt) {
		evt.preventDefault();
		if(!$('.active').hasClass('busy')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
		}
	});
	//////////////
	// SPAN TAP //
	//////////////
	$('div span.delete', this).on(tap, function(evt) {
		//evt.preventDefault();
		$(this).parent('div').hide();
		//UPDATE DB
		diary.deleteEntry($(this).parent('div').data("id"));
		//REMOVE CLICKED
		$(this).parent('div').remove();
		updateTimer();
		updateEntriesTime();
		//SCROLLBAR UPDATE
		clearTimeout(niceTimer);
		niceTimer = setTimeout(niceResizer, 200);
		//IF LAST ROW 
		if($('#entryList .entryListRow').length == 0) {
			$('#entryList').html('<div id="noEntries"><span>' + LANG("NO_ENTRIES") + '</span></div>');
			updateTimer();
			return false;
		}
		//force error
		window.scroll($('#appContent')[0].scrollTop,0,0);
		//window.onscroll(scroll($('#appContent')[0].scrollTop,0));
	});
//////#//
}); //#//
//////#//





//#//////////////////////#//
//# DYNAMIC HANDLERS 2.0 #//
//#//////////////////////#//
$(document).on("pageReload", function(evt) {
		evt.preventDefault();
		//evt.stopPropagation();
		//not while editing ~
		if(!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('#appStatusFix').hasClass('open')) {
		//NO SWIPE OVERLAP
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			//hide
			if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
				$('#pageSlideFood').addClass('busy');				
				//$('#pageSlideFood').removeClass("open");
				//$('#appHeader').removeClass("open");
				$('#pageSlideFood').on('webkitTransitionEnd',function(e) { $('#pageSlideFood').removeClass('busy'); /*$('#pageSlideFood').css("opacity","0");*/ $("#foodSearch").blur(); });
			} else {
				if(!$('#pageSlideFood').hasClass('busy')) {
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// PAGESLIDEFOOD DIV //
	///////////////////////
	$('#pageSlideFood').remove();
	$('body').append("<div id='pageSlideFood'></div>");
	$('#pageSlideFood').css("height",(window.innerHeight - $('#appHeader').height()) + "px");
	$('#pageSlideFood').css("top",$('#appHeader').height() + "px");
	///////////////
	// CREATE DB //
	///////////////
	var pSql = 0;
	$('#pageSlideFood').on('webkitTransitionEnd',function(evt) {
		// IMPORT //
		if(pSql == 0) {
			if(window.localStorage.getItem("foodDbLoaded") != "done") {
				//reset blocks
				$("#tabMyFavsBlock,#tabMyFoodsBlock,tabMyExercisesBlock").html('<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>');
				pSql++;
				var demoRunning = false;
				var dbName = "mylivediet.app";
				if(!demoRunning) {
					//start
					spinner(45);
					demoRunning = true;
					try {
						html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
						//import sql
						$.get("searchdb_" + LANG("LANGUAGE") + ".sql",function(sql) {
							var startTime = new Date();
							setTimeout(function() {
							html5sql.process(
								sql,
								function(){
									//success
									window.localStorage.setItem("foodDbLoaded",'done');
									demoRunning = false;
									spinner();

								},
								function(error, failingQuery) {
									//failure
									//window.localStorage.setItem("foodDbLoaded","empty");
									demoRunning = false;
								});
							},200);
						});
					//try fail
					} catch(error) {
						demoRunning = false;
					}}
				}
			}
		});
		///////////////
		// FOOD HTML //
		///////////////
		$("#pageSlideFood").html('<div id="sideMenuFood"><input tabindex="-2" type="text" id="foodSearch" placeholder="' + LANG("FOOD_SEARCH") + '" /><span id="iconClear">×</span><span id="iconRefresh" class="icon-refresh"></span><div id="foodListWrapper"><div id="foodList"><span id="noMatches">' + LANG("NO_MATCHES") + '</span></div></div></div>');
		//PRE-ADJUST RESULTS HEIGHT
		$('#foodSearch').width(window.innerWidth -55);	

		buildFoodMenu();
		
		//remember search type
		if(window.localStorage.getItem("searchType") == "exercise") {
			$("#foodSearch").attr('placeholder',LANG("EXERCISE_SEARCH"));
			$("#foodSearch,#pageSlideFood").addClass("exerciseType");
		}
		////////////////////
		// RESULTS HEIGHT //
		////////////////////
		$('#foodList').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#foodList').css("top",($('#appHeader').height()) + "px");
		if(!isMobile.iOS() && androidVersion() < 4.4) {
			$("#foodList").css("overflow","hidden");
			setTimeout(function(){
				$("#foodList").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder:"1px solid #fff",cursoropacitymax:0.2,cursorwidth:4,horizrailenabled:false,hwacceleration:true});
				$("body").trigger("resize");
			},300);
			//SCROLLBAR UPDATE	
			clearTimeout(niceTimer);
			niceTimer = setTimeout(niceResizer, 200);
		}

	//#/////////////////////////////////////#//
	//# KEYUP LISTENER SEARCH TIMER-LIMITER #//
	//#/////////////////////////////////////#//
	var timer;
	//$("#foodSearch").on("propertychange keyup input paste",function() {
	//$("#foodSearch").keyup(function() {
	document.getElementById('foodSearch').addEventListener('input', function() {
		//CLEAR ICON
		if(this.value.length == 0) {
			$('#iconClear').hide();
			$('#iconRefresh').show();
		} else {
			$('#iconRefresh').hide();
			$('#iconClear').show(); 
		}
		$('#iconClear').on(touchstart,function(evt) {
			$('#foodSearch').val('');
			$('#iconClear').hide();
			$('#iconRefresh').show();
			//buildFoodMenu();
			$('#searchContents').hide();
			$('#menuTopBar').show();
			$('#infoContents').show();		
		});
		//SET TIMER
		clearTimeout(timer);
		var ms  = 200; //275;
		var val = this.value;
		//DO SEARCH
		timer = setTimeout(function() {
			doSearch($("#foodSearch").val());
		}, ms);
	});
	///////////////////
	// HIDE KEYBOARD //
	///////////////////
	$("#foodList").on(tap, function(evt) {
		evt.preventDefault();
		$("#entryBody").blur();
		$("#foodSearch").blur();
		window.scroll($('#appContent')[0].scrollTop,0,0);
	});
	//////////////////////
	// SEARCH TYPE ICON //
	//////////////////////
	$('#iconRefresh').on(touchstart,function(evt) {
		//toggle -if not animated
		if(!$("#foodSearch").hasClass('busy')) {
			$("#foodSearch").toggleClass("exerciseType");
			$("#pageSlideFood").toggleClass("exerciseType");
			//update placeholder n' animate
			if($("#foodSearch").hasClass("exerciseType")) {
				window.localStorage.setItem("searchType","exercise");
				$("#foodSearch").attr('placeholder',LANG('EXERCISE_SEARCH'));
				$("#foodSearch").addClass('busy');
				$("#foodSearch").animate({ backgroundColor: "#FECEC6" }, 1).animate({ backgroundColor: "#fff" },600,function() { 
						$("#foodSearch").removeClass('busy');
					}
				);
			} else {
				window.localStorage.removeItem("searchType");
				$("#foodSearch").attr('placeholder',LANG('FOOD_SEARCH'));
				$("#foodSearch").addClass('busy');
				$("#foodSearch").animate({ backgroundColor: "#BBE4FF" }, 1).animate({ backgroundColor: "#fff" },600,function() { 
						$("#foodSearch").removeClass('busy');
					}
				);
			}
		}
	});
	/////////////////////////////////////////
	// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
	/////////////////////////////////////////
	$("#foodSearch").on(touchstart, function(evt) {
		$(".foodName").css("overflow","hidden");
		$("#activeOverflow").removeAttr("id");
		$(".activeOverflow").removeClass("activeOverflow");
	});


		
		
		
		
		
		
		
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//show
					$("#entryBody").blur();
					$("#entryTime").blur();
					//$('#pageSlideFood').css("opacity",".925");
					$('#pageSlideFood').addClass('busy');
					
					if(window.localStorage.getItem("foodDbLoaded") != "done") {
						$('#pageSlideFood').addClass("open");
					}
					
					$('#appHeader').addClass("open");
					$('#pageSlideFood').on('webkitTransitionEnd',function(e) { 
					$('#pageSlideFood').removeClass('busy');
					});
				}}
			}}
		}
//////#//
}); //#//
//////#//




//#/////////////////#//
//# CORE SQL SEARCH #//
//#/////////////////#//
Diary.prototype.searchFood = function(searchSQL,callback) {
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	//food-exercise
	if(window.localStorage.getItem("searchType") == "exercise") {
		var typeTerm = 'exercise';
	} else {
		var typeTerm = 'food';
	}
	//cases	
	var firstTerm = window.localStorage.getItem("lastSearchTerm").split(" ")[0];
	var caseStarts   = "'"  + firstTerm + "%'";
	var caseContains = "'%" + firstTerm + "%'";
	var caseEnds     = "'%" + firstTerm +  "'";
	//query
	this.db.transaction(
		function(t) {
			t.executeSql("SELECT * FROM diary_food WHERE type == '" + typeTerm + "' AND " + searchSQL + " ORDER BY CASE when term LIKE " + caseStarts + " THEN 0 ELSE 1 END, UPPER(term) LIMIT 50",[],
			function(t,results) {
				callback(that.fixResults(results));
		},this.dbErrorHandler);
	}, this.dbErrorHandler); 
};
//#////////////////////////#//
//# SUB FUNCION: DO SEARCH #//
//#////////////////////////#//
function doSearch(rawInput) {
	//ignore null searches
	if(rawInput == 0) {
		rawInput = "00000000";
	}
	//this.value = sval;
	/////////////////
	// FETCH INPUT //
	/////////////////	
	var timerStart = new Date().getTime();
	var lastSearch = window.localStorage.getItem("lastSearchTerm");
	//sanitize user input
	var searchQuery = trim(rawInput.split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("\\").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").toLowerCase());
	//partial sql syntax
	var searchSQL   = "term LIKE '%" + searchQuery.split(" ").join("%' AND term LIKE '%") + "%'";
	//prevent multiple identical searches
	window.localStorage.setItem("lastSearchTerm",searchQuery);
	//#/////////////////////#//
	//# BUILD KEYWORD ARRAY #//
	//#/////////////////////#//
	var keywordArray = [];
	searchArray = searchQuery;
	//check for multiple keywords
	if(searchQuery.search(' ') > -1) {
		searchQuery = searchQuery.split(" ");
		//loop each key into array
		for(i = 0; i < searchQuery.length; i++) {
			//not null
			if(searchQuery[i] != "") {
				keywordArray.push(trim(searchQuery[i]));
			}
		}
	} else {
		//single term array
		keywordArray.push(searchQuery);
	}
	///////////////////////////////////////////////////////////
	// PREVENT EMPTY STRING ON MULTIPLE KEYWORD SEARCH ARRAY //
	///////////////////////////////////////////////////////////
	if(keywordArray != "") {
		//#///////////////#//
		//# QUERY FOOD DB #//
		//#///////////////#//
		var foodList   = '';
		var countMatch = 0;
		//ADJUST SEARCH TYPE
		if(window.localStorage.getItem("searchType") == "exercise") {
			//get current weight			
			if(!window.localStorage.getItem("calcForm#pA3B")) {
				var totalWeight = 80;
			} else {
				var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
			}
			//convert to kg
			if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
				var totalWeight = Math.round( (totalWeight) / (2.2) );
			}
			//TYPES
			var searchType = 'exercise';
		} else {
			var searchType = 'food';
		}
		///////////////////
		// EXECUTE QUERY //
		///////////////////
		diary.searchFood(searchSQL,function(data) {
			// LOOP RESULTS //
			for(var s=0, len=data.length; s<len; s++) {
				//total results
				//countMatch++;
				//max results
				//if(s <= 100) {
				//organize relevant columuns
				var id   = data[s].id;
				var type = data[s].type;
				var code = data[s].code;
				var name = data[s].name;
				var term = data[s].term;
				var kcal = Math.round(data[s].kcal * 100) / 100;
				var pro  = Math.round(data[s].pro * 100) / 100;
				var car  = Math.round(data[s].car * 100) / 100;
				var fat  = Math.round(data[s].fat * 100) / 100;
				var fib  = data[s].fib;
				// SEARCH TYPE //
				var typeClass;
				if(searchType == "exercise") {
					typeClass = " hidden";
					//calculate weight proportion
					kcalBase = kcal;
					kcal = Math.round(((kcal * totalWeight)/60) * 30);
				} else {
					typeClass = "";
					kcalBase = kcal;
				}
				//html
				var foodLine = "<div class='searcheable' id='" + code + "' title='" + kcalBase + "'><div class='foodName'>" + name + "</div><span class='foodKcal'><span class='preSpan'>kcal</span>" + kcal + "</span><span class='foodPro " + typeClass + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + pro + "</span><span class='foodCar " + typeClass + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + car  + "</span><span class='foodFat " + typeClass + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + fat  + "</span></div>";
				//result list
				foodList += foodLine;
			//}
			} //end loop
			/////////////////////
			// DISPLAY RESULTS //
			/////////////////////
			//matches number
			//$("#iCounter").html(countMatch + " matches");
			$("#menuTopBar").hide();
			$("#infoContents").hide();
			//prevent overflow blinking
			$("#searchContents").hide();
			$("#searchContents").html('');
			//if empty
			if(foodList == "") {
				if($("#foodSearch").val() != "") {
					$("#searchContents").html('<span id="noMatches"> ' + LANG("NO_MATCHES") +' </span>');
				} else {
					//buildFoodMenu();
					$('#searchContents').hide();
					$('#menuTopBar').show();
					$('#infoContents').show();	
				}
			} else {
				$("#searchContents").html(foodList);
			}
			$("#searchContents").show();
			////////////////////////
			// OVERFLOW ON-DEMAND //
			////////////////////////
			$(".searcheable").on(tap + ' ' + touchstart, function(evt) {
				if($("#foodSearch").is(":focus")) { 
					$("#foodSearch").blur();
					window.scroll($('#appContent')[0].scrollTop,0,0);
					return false;
				}
				$("#activeOverflow").removeAttr("id");
				$(".activeOverflow").removeClass("activeOverflow");
				$(this).addClass("activeOverflow");
				$(".foodName",this).attr("id","activeOverflow");
				$(".foodName").css("overflow","auto");
			});
			/////////////////////////////////
			// TAP FOOD-ENTRY EDIT (MODAL) //
			/////////////////////////////////
			$("#searchContents div.searcheable").on(singletap,function(event) {
			//$("#foodList div.searcheable").swipe({
			//	tap:function(event) {
				event.preventDefault();
				getModalWindow($(this).attr("id"));
			});
		}); // END QUERY CONTEXT
	}
}














//#///////////////////////////////#//
//# SUB FUNCTION: UPDATE FAV LIST #//
//#///////////////////////////////#//
function updateFavList() {
	diary.getCustomList("fav",function(data) {
		// LOOP RESULTS //
		var customFavList = "";
		for(var c=0, len=data.length; c<len; c++) {
			//get current weight//
			if(!window.localStorage.getItem("calcForm#pA3B")) {
				var totalWeight = 80;
			} else {
				var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
			}
			//convert to kg
			if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
				var totalWeight = Math.round( (totalWeight) / (2.2) );
			}
			//ADJUST TO EXERCISE
			if(data[c].type == "exercise") {
				var cKcal = Math.round(((data[c].kcal * totalWeight) /60) * 30);
			} else {
				var cKcal = Math.round(data[c].kcal * 100) / 100;
			}
			//cKcal = Math.round(data[c].kcal * 100) / 100;
			cPro = Math.round(data[c].pro * 100) / 100;
			cCar = Math.round(data[c].car * 100) / 100;
			cFat = Math.round(data[c].fat * 100) / 100;

			var favLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + cKcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>kcal</span>" + cKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + cPro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + cCar  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + cFat  + "</span></div>";
			if(favLine != "") {
				customFavList += favLine;
			}
		}
		if(customFavList == "") { customFavList += '<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }
		//////////
		// HTML //
		//////////
		$("#tabMyFavsBlock").html(customFavList);
		//////////////
		// HANDLERS //
		//////////////
		$("#tabMyFavsBlock div.searcheable").on(singletap,function(evt) {
			evt.preventDefault();
			getModalWindow($(this).attr("id"));
		});
		$("#tabMyFavsBlock div.searcheable").on(tap + ' ' + touchstart, function(evt) {
			if($("#foodSearch").is(":focus")) { 
				$("#foodSearch").blur();
				window.scroll($('#appContent')[0].scrollTop,0,0);
				return false;
			}
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
			$(this).addClass("activeOverflow");
			$(".foodName",this).attr("id","activeOverflow");
			$(".foodName").css("overflow","auto");
		});
		/////////////////////////////////////////
		// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
		/////////////////////////////////////////
		$("#tabMyFavsBlock #foodSearch").on(touchstart, function(evt) {
			$(".foodName").css("overflow","hidden");
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
		});
	});
}
//#////////////////////////////////#//
//# SUB FUNCTION: UPDATE FOOD LIST #//
//#////////////////////////////////#//
function updateFoodList() {
	diary.getCustomList("food",function(data) {
		// LOOP RESULTS //
		var customFoodList = "";
		for(var c=0, len=data.length; c<len; c++) {
			
			cKcal = Math.round(data[c].kcal * 100) / 100;
			cPro = Math.round(data[c].pro * 100) / 100;
			cCar = Math.round(data[c].car * 100) / 100;
			cFat = Math.round(data[c].fat * 100) / 100;

			var foodLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + cKcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>kcal</span>" + cKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + cPro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + cCar  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + cFat  + "</span></div>";
			if(foodLine != "") {
				customFoodList += foodLine;
			}
		}
		if(customFoodList == "") { customFoodList += '<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }
		//////////
		// HTML //
		//////////
		$("#addNewFood").remove();
		$("#tabMyFoodsBlock").html(customFoodList + '<div id="addNewFood">' + LANG("ADD_NEW_FOOD") +'</div>');
		$('#tabMyFoodsBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		/////////////
		// ACTIONS //
		/////////////
		$("#addNewFood").on(touchstart, function(evt) {
			addNewItem({type:"food",act:"insert"});
		});
		
		$("#tabMyFoodsBlock div.searcheable").on(singletap,function(evt) {
			evt.preventDefault();
			getModalWindow($(this).attr("id"));
		});
		$("#tabMyFoodsBlock div.searcheable").on(tap + ' ' + touchstart, function(evt) {
			if($("#foodSearch").is(":focus")) { 
				$("#foodSearch").blur();
				window.scroll($('#appContent')[0].scrollTop,0,0);
				return false;
			}
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
			$(this).addClass("activeOverflow");
			$(".foodName",this).attr("id","activeOverflow");
			$(".foodName").css("overflow","auto");
		});
		/////////////////////////////////////////
		// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
		/////////////////////////////////////////
		$("#tabMyFoodsBlock #foodSearch").on(touchstart, function(evt) {
			$(".foodName").css("overflow","hidden");
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
		});
	});
}
//#////////////////////////////////////#//
//# SUB FUNCTION: UPDATE EXERCISE LIST #//
//#////////////////////////////////////#//
function updateExerciseList() {
diary.getCustomList("exercise",function(data) {
	// LOOP RESULTS //
	var customExerciseList = "";
	for(var c=0, len=data.length; c<len; c++) {

		//get current weight//
		if(!window.localStorage.getItem("calcForm#pA3B")) {
			var totalWeight = 80;
		} else {
			var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
		}
		//convert to kg
		if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
			var totalWeight = Math.round( (totalWeight) / (2.2) );
		}
		var excerciseKcal = Math.round(((data[c].kcal * totalWeight) / 60) * 30);
		var excerciseLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + data[c].kcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>kcal</span>" + excerciseKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + data[c].pro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + data[c].car  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + data[c].fat  + "</span></div>";
		if(excerciseLine != "") {
			customExerciseList += excerciseLine;
		}
	}
	if(customExerciseList == "") {customExerciseList += '<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }
	//////////
	// HTML //
	//////////
	$("#addNewExercise").remove();
	$("#tabMyExercisesBlock").html(customExerciseList + '<div id="addNewExercise">' + LANG("ADD_NEW_EXERCISE") +'</div>');
	$('#tabMyExercisesBlock').css("min-height", ($('#foodList').height() - 128) + "px");
	/////////////
	// ACTIONS //
	/////////////
	$("#addNewExercise").on(touchstart, function(evt) {
		addNewItem({type:"exercise",act:"insert"});
	});
	$("#tabMyExercisesBlock div.searcheable").on(singletap,function(evt) {
		evt.preventDefault();
		getModalWindow($(this).attr("id"));
	});
	$("#tabMyExercisesBlock div.searcheable").on(tap + ' ' + touchstart, function(evt) {
		if($("#foodSearch").is(":focus")) { 
			$("#foodSearch").blur();
			return false;
		}
		$("#activeOverflow").removeAttr("id");
		$(".activeOverflow").removeClass("activeOverflow");
		$(this).addClass("activeOverflow");
		$(".foodName",this).attr("id","activeOverflow");
		$(".foodName").css("overflow","auto");
	});
	/////////////////////////////////////////
	// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
	/////////////////////////////////////////
	$("#tabMyExercisesBlock #foodSearch").on(touchstart, function(evt) {
		$(".foodName").css("overflow","hidden");
		$("#activeOverflow").removeAttr("id");
		$(".activeOverflow").removeClass("activeOverflow");
	});
});
}
//#//////////////////////////////////#//
//# SUB FUNCTION: UPDATE RFCENT LIST #//
//#//////////////////////////////////#//
/*
function updateRecentList() {
	diary.getEntries(function(data) {
		//console.log('updating entrylist sum');
		var searchHistory = [];
		for(var i=0, len=data.length; i<len; i++) {
			if(data[i].body != "") {
				//set type
				var titleType = "";
				if(data[i].title < 0) {
					var titleType = "##e##";
				}
				//remove parenthesis
				//searchHistory.push(data[i].body.replace(/\[.*?\]/g, '') + titleType);
				searchHistory.push(data[i].body + titleType);
			}
		}
		searchHistory = searchHistory.reverse();
		//sortByFrequencyAndFilter
		function sortByFrequencyAndFilter(myArray){
			var newArray = [];
			var freq = {};
			//count frequency of occurances
			var i=myArray.length-1;
			for (var i;i>-1;i--) {
				var value = myArray[i];
				freq[value]==null?freq[value]=1:freq[value]++;
			}
			//create array of filtered values
			for (var value in freq) {
				if(trim(value) != "") {
					newArray.push(value);
				}
			}
			//(sub)define sort function and return sorted results
			function compareFreq(a,b) {
				return freq[b]-freq[a];
			}
			return newArray.sort(compareFreq);
		}
		// html //
		var sortedList = sortByFrequencyAndFilter(searchHistory);
		var recentHtml = "";
		if(sortedList == "") { recentHtml += '<div class="searcheable"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }
		for(q = 0; q < sortedList.length; q++) {
			//not null
			if(sortedList[q] != "" && q < 8) {
				var itemType = "food";
				if(sortedList[q].match( '##e##' )) {
					var itemType = "exercise";
					sortedList[q] = sortedList[q].replace("##e##","");
				}
				recentHtml += '<div class="searcheable recentItem ' + itemType + '"><div class="foodName ' + itemType + '">' + sortedList[q] + '</div></div>';
			}
		}
	});
}
*/
//##/////////////////////////////##//
//##    CORE: BUILD FOOD MENU    ##//
//##/////////////////////////////##//
function buildFoodMenu() {
var recentBlock = '\
<div id="infoContents" class="infoContents">\
	<div id="tabMyFavs">\
		<div id="tabMyFavsBlock"></div>\
	</div>\
	<div id="tabMyFoods">\
		<div id="tabMyFoodsBlock"></div>\
	</div>\
	<div id="tabMyExercises">\
		<div id="tabMyExercisesBlock"></div>\
	</div>\
</div>\
<div id="searchContents"></div>\
';

//////////////
// TOP MENU //
//////////////
$("#foodList").html("<div id='menuTopBar'><h3 id='topBarItem-1'><span>" + LANG('MY_FAVOURITES') + "</span></h3><h3 id='topBarItem-2'><span>" + LANG('MY_FOODS') + "</span></h3><h3 id='topBarItem-3'><span>" + LANG('MY_EXERCISES') + "</span></h3></div>\
" + recentBlock);
//first load db spinner
if(window.localStorage.getItem("foodDbLoaded") != "done") {
	//reset blocks
	$("#tabMyFavsBlock,#tabMyFoodsBlock,#tabMyExercisesBlock").html('<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>');

	$("#addNewFood").remove();
	$("#tabMyFoodsBlock").after('<div id="addNewFood">' + LANG("ADD_NEW_FOOD") +'</div>');
	$('#tabMyFoodsBlock').css("min-height", ($('#foodList').height() - 128) + "px");

	$("#addNewExercise").remove();
	$("#tabMyExercisesBlock").after('<div id="addNewExercise">' + LANG("ADD_NEW_EXERCISE") +'</div>');
	$('#tabMyExercisesBlock').css("min-height", ($('#foodList').height() - 128) + "px");
	//////////////
	// HANDLERS //
	//////////////
	$("#addNewFood").on(touchstart, function(evt) {
		addNewItem({type:"food",act:"insert"});
	});	
	$("#addNewExercise").on(touchstart, function(evt) {
		addNewItem({type:"exercise",act:"insert"});
	});

} else {
////////////////////
// CUSTOM FAV SQL //
////////////////////
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") {
	updateFavList();
	setTimeout(function() {
		updateFoodList();
		updateExerciseList();
	},300);
}
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2") {
	updateFoodList();
	setTimeout(function() {
		updateFavList();
		updateExerciseList();
	},300);
}
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3") {
	updateExerciseList();
	setTimeout(function() {
		updateFavList();
		updateFoodList();
	},300);
}
}

/////////////////////
// FIRST LOAD TABS //
/////////////////////
if(!window.localStorage.getItem("lastInfoTab")) {
	window.localStorage.setItem("lastInfoTab","topBarItem-1");
	$("#topBarItem-1").addClass("onFocus");
	$("#tabMyFavs").addClass("onFocus");
}
////////////
// TAB #1 //
////////////
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") {
	$("#topBarItem-1").addClass("onFocus");
	$("#tabMyFavs").addClass("onFocus");
}
////////////
// TAB #2 //
////////////
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2") {
	$("#topBarItem-2").addClass("onFocus");
	$("#tabMyFoods").addClass("onFocus");
}
////////////
// TAB #3 //
////////////
if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3") {
	$("#topBarItem-3").addClass("onFocus");
	$("#tabMyExercises").addClass("onFocus");
}
////////////////////////
// SWITCH VISIBLE TAB //
////////////////////////
$("#menuTopBar h3").on(touchstart,function(evt) {
	evt.preventDefault();
	$(".onFocus").removeClass("onFocus");
	$(".activeOverflow").removeClass("activeOverflow");	
	////////////
	// TAB #1 //
	////////////
	if($(this).attr("id") == "topBarItem-1") {
		$("#topBarItem-2,#topBarItem-3").removeClass("onFocus");
		$("#topBarItem-1,#tabMyFavs").addClass("onFocus");
		window.localStorage.setItem("lastInfoTab",$(this).attr("id"));
	}
	////////////
	// TAB #2 //
	////////////
	if($(this).attr("id") == "topBarItem-2") {
		$("#topBarItem-1,#topBarItem-3").removeClass("onFocus");
		$("#topBarItem-2,#tabMyFoods").addClass("onFocus");
		window.localStorage.setItem("lastInfoTab",$(this).attr("id"));
	}
	////////////
	// TAB #3 //
	////////////
	if($(this).attr("id") == "topBarItem-3") {
		$("#topBarItem-1,#topBarItem-2").removeClass("onFocus");
		$("#topBarItem-3,#tabMyExercises").addClass("onFocus");
		window.localStorage.setItem("lastInfoTab",$(this).attr("id"));		
	}
});



//end touchstart (black button)

			/////////////
			// ACTIONS //
			/////////////
//
			$(".searcheable").off(tap);
			$(".searcheable").on(tap + ' ' + touchstart, function(evt) {
				$("#activeOverflow").removeAttr("id");
				$(this).addClass("activeOverflow");
				$(".foodName",this).attr("id","activeOverflow");
				$(".foodName").css("overflow","auto");
			});
				
			// PRE-FILL RECENT //
/*
			var mr = 0;
			//entrylist form propagation fix (touchend > touchstart [android 2.x])
			$(".recentItem").on(touchstart,function(evt) {
				evt.preventDefault();
			});
			$(".recentItem").off(singletap);
			$(".recentItem").on(singletap,function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				//not if empty
				if(!$("#activeOverflow").html()) { return; }
				if(mr == 0) {
					mr++;
					///////////////
					// DIARY TAB //
					///////////////
					var preFillTimer = 0;
					if(window.localStorage.getItem("app_last_tab") != "tab2") {
						var preFillTimer = 150;
						$("ul#appFooter li").removeClass("selected");
						window.localStorage.setItem("app_last_tab","tab2");
						$("#tab2").addClass("selected");
						openDiary();
					}
					setTimeout(function(evt) {
						$("#entryBody").val( trim($("#activeOverflow").text()) );
						//CSS FADE OUT
						$('#modalWindow').removeClass('show');
						$('#modalOverlay').removeClass('show');
						//SELF-REMOVE
						$('#modalWindow').on('webkitTransitionEnd',function(e) { 
							$("#modalWindow").remove();
							$("#modalOverlay").remove();
						});
						$("#appHeader").trigger(trim(touchstart));
						$('#entryBody').width(window.innerWidth -58);
						$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
					},preFillTimer);
				}
			});
*/


}
















//##//////////////////////////##//
//##    CORE: ADD NEW ITEM    ##//
//##//////////////////////////##//
function addNewItem(opt) {
	///////////////
	// HTML FORM //
	///////////////
	$("#modalWindow").remove();

	if(!$("#modalOverlay").html()) { 
		var modalOverlay = '<div id="modalOverlay"></div>';
	} else {
		$("#modalOverlay").off();
		var modalOverlay = '';
	}

	if(!$("#tempHolder").html()) { 
		$("body").append('\
		<div id="tempHolder">\
			' + modalOverlay + '\
			<div id="addNewWrapper">\
				<ul id="addNewList">\
					<li id="addNewName">   <label>' + LANG("ADD_NAME") + ' </label>       <input tabindex="3" type="text"   id="inputNewName"                /> </li>\
					<li id="addNewAmmount"><label>' + LANG("ADD_AMMOUNT") + ' (g)</label> <input tabindex="3" type="number" id="inputNewAmmount" value="100" /> </li>\
					<li id="addNewKcal">   <label>kcal</label>                            <input tabindex="3" type="number" id="inputNewKcal"    value="0"   /> </li>\
					<li id="addNewPro">    <label>pro</label>                             <input tabindex="3" type="number" id="inputNewPro"     value="0"   /> </li>\
					<li id="addNewCar">    <label>car</label>                             <input tabindex="3" type="number" id="inputNewCar"     value="0"   /> </li>\
					<li id="addNewFat">    <label>' + LANG("FAT") + ' </label>            <input tabindex="3" type="number" id="inputNewFat"     value="0"   /> </li>\
				</ul>\
				<div id="addNewCancel">' + LANG("CANCEL") + '</div>\
				<div id="addNewConfirm">' + LANG("ADD_NEW") + '</div>\
			</div>\
		</div>\
		');
	}
////////////////
// IF EDITING //
////////////////
if(opt) {
	if(opt.act == "insert") {
		var vAct = "insert";
		var vType = opt.type;
	} else {
		var vAct = "update";
		var vType = opt.type;
	}
}
/////////////////////////////////////
// PRE-FILL IF EDITING (UPDATE DB) //
/////////////////////////////////////
if(vAct == "update") {
	$("#inputNewName").val(opt.name);
	$("#inputNewKcal").val(Math.round(opt.kcal))
	$("#inputNewPro").val(opt.pro);
	$("#inputNewCar").val(opt.car);
	$("#inputNewFat").val(opt.fat);
}
/////////////////////////////
// ADJUST FORM TO EXERCISE //
/////////////////////////////
if(opt.type == "exercise") {
	//get current weight
	if(!window.localStorage.getItem("calcForm#pA3B")) {
		var totalWeight = 80;
	} else {
		var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
	}
	//convert to kg
	if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
		var totalWeight = Math.round( (totalWeight) / (2.2) );
	}
	$("#addNewAmmount label").html(LANG("ADD_DURATION") + ' (min)');
	$("#inputNewAmmount").val(30);
	$("#addNewPro").hide();
	$("#addNewCar").hide();
	$("#addNewFat").hide();

	if(vAct == "update") {
		$("#inputNewKcal").val(Math.round(((opt.kcal * totalWeight)/60) * $("#inputNewAmmount").val()));
	}
}

	//$("#addNewWrapper").css("min-height",$("#addNewWrapper").height() + "px");
	//$('#addNewList li input').placeholder({force:true});
	//prevent tapping
	//$("#modalOverlay").css("z-index",9999999);
	$("#modalOverlay,#addNewWrapper").hide();
	$("#addNewWrapper").fadeIn(200);
	$("#modalOverlay").fadeIn(0);
	$('#modalOverlay,#addNewWrapper').addClass('show');

	//$("#modalOverlay").css("-webkit-transition-timing-function","linear");
	//setTimeout(function(evt) {
	//$("#entryBody").val( trim($("#activeOverflow").text()) );
	//CSS FADE OUT
	//$('#modalWindow').removeClass('show');
	//$('#modalOverlay').addClass('show');
	//$("#modalOverlay").css("-webkit-transition-duration",".25s");
	//$("#modalOverlay").css("background-image","-webkit-linear-gradient(#fff,#fefefe)");		
	//$("#modalOverlay,#spinner,#tempHolder").on(touchstart, function(evt) {

	//$(this).addClass("activeOverflow");
	//$(".foodName",this).attr("id","activeOverflow");
	//$(".foodName").css("overflow","auto");

///////////////////////////////////////////
// android input blur blank viewport bug //
///////////////////////////////////////////
if(isMobile.Android()) {
	//preset wrapper min-height
	$("#addNewWrapper").css("min-height",$("#addNewWrapper").height() + "px");
	//trigger on touchmove if not focused (closing-touch white gap)
	$("#addNewWrapper").on("touchmove",function(evt) {
		if(!$("#addNewWrapper input").is(":focus")) { 
			$(window).trigger("orientationchange");
		}
	});
	//trigger if not focused to another input
	var newBlurGap;
	$("#addNewWrapper input").on("blur",function(evt) {
		newBlurGap = setTimeout(function() {
			$(window).trigger("orientationchange");
		},100);
	});
	$("#addNewWrapper input").on("focus",function(evt) {
		clearTimeout(newBlurGap);
	});
}
///////////////////////////
// autohide keyboard tap //
///////////////////////////
$("#addNewWrapper").on("touchstart",function(evt) {
	if(evt.target.id == "addNewWrapper" || evt.target.id == "") {
		evt.preventDefault();
		evt.stopPropagation();		
		$("#addNewWrapper input").trigger("blur");
	}
});
/////////////////////
// AUTO EMPTY IF 0 //
/////////////////////
$('#addNewWrapper input[type="number"]').on("focus",function(evt) {
	if($(this).val() == 0) {
		$(this).val('');
	}
});
$('#addNewWrapper input[type="number"]').on("blur",function(evt) {
	if($(this).val() == '') {
		$(this).val('0');
	}
});
////////////////
// VALIDATION //
////////////////
$('#addNewWrapper input[type="number"]').on("keypress", function(evt) {
	//max
	if($(this).val().length > 7 || parseInt($(this).val()) >= 999) {
		return false;
	}
	//num only
	return isNumberKey(evt);
});
//#/////////////#//
//# CONFIRM ADD #//
//#/////////////#//
var lockAdd = 0;
$("#addNewConfirm").on(touchstart, function(evt) {
	if(lockAdd == 0) {
		lockAdd++;
		// INSERT NEW ? UPDATE EXISTING 
		if(vAct == "insert") {
			var vType = opt.type;
			var vCode = "c" + (new Date()).getTime();
			var vFib  = "custom";
		} else {
			var vType = opt.type;
			var vCode = opt.code;
			var vFib  = opt.fib;
		}
		// (RE)BUILD FROM FIELD VALUES //
		var vName = $("#inputNewName").val();
		var vTerm = sanitize($("#inputNewName").val());
		var vKcal = $("#inputNewKcal").val();
		var vPro  = $("#inputNewPro").val();
		var vCar  = $("#inputNewCar").val();
		var vFat  = $("#inputNewFat").val();
		//revert input to formula
		if(vType == "exercise") {
			var vKcal = Math.round(((($("#inputNewKcal").val() / totalWeight ) / $("#inputNewAmmount").val() )*60) * 100) / 100;
		}
///////////////////////
// VALIDATE ADD FORM //
///////////////////////
//clear previous
$("label").removeClass("error");
var doReturn = 0;
if(vName == "" || vName == 0)					{ $("#addNewName label").addClass("error"); doReturn = 1; }
if(vKcal == "" || vKcal == 0 || isNaN(vKcal))	{ $("#addNewKcal label").addClass("error"); doReturn = 1; }
if($("#inputNewAmmount").val() == "" || $("#inputNewAmmount").val() == 0 || isNaN($("#inputNewAmmount").val())) { $("#addNewAmmount label").addClass("error"); doReturn = 1; }
//parts > sum
if(parseFloat($("#inputNewPro").val()) + parseFloat($("#inputNewCar").val()) + parseFloat($("#inputNewFat").val()) > parseFloat($("#inputNewAmmount").val())) {
	$("#addNewAmmount label").addClass("error");
	$("#addNewPro label").addClass("error");
	$("#addNewCar label").addClass("error");
	$("#addNewFat label").addClass("error");
	doReturn = 1;
}
/////////////////////
// RETURN ON ERROR //
/////////////////////
if(doReturn == 1) { lockAdd = 0; return false; }

// IF NULL/EMPTY, JUST REVERT TO 0
if(vPro == "" || isNaN(vPro))	{ vPro = 0; }
if(vCar == "" || isNaN(vCar))	{ vCar = 0; }
if(vFat == "" || isNaN(vFat))	{ vFat = 0; }
//revert to 100g
if(vType == "food") {
vKcal = Math.round((vKcal / $("#inputNewAmmount").val()) *100 * 100) / 100;
vPro  = Math.round((vPro / $("#inputNewAmmount").val()) *100 * 100) / 100;
vCar  = Math.round((vCar / $("#inputNewAmmount").val()) *100 * 100) / 100;
vFat  = Math.round((vFat / $("#inputNewAmmount").val()) *100 * 100) / 100;
vKcal = Math.round(vKcal);
} else {
vKcal = Math.round(vKcal * 100) / 100;
}
//FORMAT
vPro = Math.round(vPro * 100) / 100;
vCar = Math.round(vCar * 100) / 100;
vFat = Math.round(vFat * 100) / 100;

		/////////////////
		// WRITE QUERY //
		/////////////////
		diary.setFood({
			type:vType,
			code:vCode,
			name:vName,
			term:vTerm,
			kcal:vKcal,
			pro:vPro,
			car:vCar,
			fat:vFat,
			fib:vFib,
			act:vAct
		});
		/////////////////////////
		// UPDATE HTML CONTENT //
		/////////////////////////
		if(vAct == "update") {
			if(vType == "exercise") {
				var vKcal = Math.round(((vKcal * totalWeight)/60) * 30);
			}
			//if also favourite, double check
			$(".activeOverflow .foodName").html(vName);
			$(".activeOverflow .foodKcal").html('<span class="preSpan">kcal</span>' + vKcal + '</span>');
			$(".activeOverflow .foodPro").html('<span class="preSpan">pro</span>' + vPro + '</span>');
			$(".activeOverflow .foodCar").html('<span class="preSpan">car</span>' + vCar + '</span>');
			$(".activeOverflow .foodFat").html('<span class="preSpan">' + LANG("FAT") + '</span>' + vFat + '</span>');
			//id update
			$("#" + vCode + " .foodName").html(vName);
			$("#" + vCode + " .foodKcal").html('<span class="preSpan">kcal</span>' + vKcal + '</span>');
			$("#" + vCode + " .foodPro").html('<span class="preSpan">pro</span>' + vPro + '</span>');
			$("#" + vCode + " .foodCar").html('<span class="preSpan">car</span>' + vCar + '</span>');
			$("#" + vCode + " .foodFat").html('<span class="preSpan">' + LANG("FAT") + '</span>' + vFat + '</span>');
			//highligh update
			//CSS FADE OUT
			//$('#addNewWrapper').removeClass('show');
			//$('#modalOverlay').removeClass('show');
			$(".searcheable").removeClass('fade');
			//CSS HIGHLIGHT
			$(".activeOverflow").removeClass("activeOverflow");
			$(".searcheable").removeClass('yellow');
			$(".searcheable").removeClass('trans');
			//$("#" + vCode).addClass('yellow');
			$("#activeOverflow").parent('div').addClass('yellow');
			var yellowFade = setTimeout(function() {
				//$("#" + vCode).addClass('fade');
				//$("#" + vCode).addClass('trans');
				$("#activeOverflow").parent('div').addClass('fade');
				$("#activeOverflow").parent('div').addClass('trans');
			},0);
			//SELF-REMOVE
			//$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
				$("#addNewCancel").trigger(trim(touchstart));
			//});
			//$("#" + vCode).animate({"backgroundColor": "#ffffcc"},600);
			return false;
		} else {
			/////////////////////
			// INSERT NEW ITEM //
			/////////////////////
			if(opt.type == "food") {
				updateFoodList();
			} else {
				updateExerciseList();
			}
			if(opt.fib == "fav") {
				updateFavList();
			}
			//highight new item
			var yellowFade = setTimeout(function() {
				//CSS FADE OUT
				//$('#addNewWrapper').removeClass('show');
				//$('#modalOverlay').removeClass('show');
				$(".searcheable").removeClass('fade');
				//CSS HIGHLIGHT
				$(".activeOverflow").removeClass("activeOverflow");
				$(".searcheable").removeClass('yellow');
				$(".searcheable").removeClass('trans');
		
				if(vAct == "update") {
					$("#activeOverflow").parent('div').addClass('yellow');
				} else {
					$("#" + vCode).addClass('yellow');
				}
				var yellowFade = setTimeout(function() {
					if(vAct == "update") {
						$("#activeOverflow").parent('div').addClass('fade');
						$("#activeOverflow").parent('div').addClass('trans');
					} else {
						$("#" + vCode).addClass('fade');
						$("#" + vCode).addClass('trans');
					}
				},0);
			//SELF-REMOVE
			//$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
				$("#addNewCancel").trigger(trim(touchstart));
			//});
			},600);
		}
	}
});
//#////////////#//
//# CANCEL ADD #//
//#////////////#//
//timed cancel (animation) ~ plus foodsearch propagation fix
setTimeout(function() {
	$("#modalOverlay").off();
	$("#addNewCancel").on(touchstart, function(evt) {
	//$("#addNewCancel,#modalOverlay").on(touchstart, function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//first tap blur, if focused
		if(evt.target.id == "modalOverlay" && $("#addNewWrapper input").is(":focus")) {
			$("#addNewWrapper input").trigger("blur");
			return false;
		}
		if(isMobile.Android()) {
			//$(window).trigger("orientationchange");
			window.scroll($('#appContent')[0].scrollTop,0,0);
		}
		if($("#tempHolder").html()) {
			$('#addNewWrapper').removeClass('show');
			$('#modalOverlay').removeClass('show');
			$('#modalOverlay').on('webkitTransitionEnd',function() { 
				$("#tempHolder").remove();
				$("#modalOverlay,#addNewWrapper").remove();
			});
		}
	});
},200);

}









//##////////////////////##//
//##    MODAL WINDOW    ##//
//##////////////////////##//
function getModalWindow(itemId) {
if(!itemId) { return; }	
	diary.getFood(itemId,function(data) {
		var mName = data[0].name;
		var mType = data[0].type;
		var mCode = data[0].code;
		var mTerm = data[0].term;
		var mKcal = Math.round(data[0].kcal * 100) / 100;
		var mPro  = Math.round(data[0].pro * 100) / 100;
		var mCar  = Math.round(data[0].car * 100) / 100;
		var mFat  = Math.round(data[0].fat * 100) / 100;
		var mFib  = data[0].fib;
///////////////////
// DEFINE WEIGHT //
///////////////////
if(mType == "exercise") {
	//get current weight
	if(!window.localStorage.getItem("calcForm#pA3B")) {
		var totalWeight = 80;
	} else {
		var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
	}
	//convert to kg
	if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
		var totalWeight = Math.round( (totalWeight) / (2.2) );
	}
/////////////////
// DEFINE TYPE //
/////////////////
	var searchType = 'exercise';
} else {
	var searchType = 'food';
}
						var duh      = new Date().getTime();
						////////////////////////
						// FOODLIST DOUBLETAP //
						////////////////////////
						//prevent flood
						$("#modalOverlay").remove();
						$("#modalWindow").remove();	
						//insert frame
						$("body").append('<div id="modalOverlay"></div>');
						$("body").append('<div id="modalWindow"></div>');
						//add content
						$("#modalWindow").html("<div id='modalDelete'></div><div id='modalEdit'></div><div id='modalFav'></div><div id='modalContent'>" + mName + "&nbsp; <span>&nbsp;" + LANG('PRE_FILL') + "</span></div>");
						$("#modalWindow").append("<div id='modalButtons'><span id='modalOk'>" + LANG('ADD') + "</span><span id='modalCancel'>" + LANG('CANCEL') + "</span></div>");
						$("#modalWindow").append('<div id="modalAdjust"><span id="modalNegBlock"><span id="modalNeg" class="icon-chevron-sign-left"></span></span><span id="modalPosBlock"><span id="modalPos" class="icon-chevron-sign-right"></span></span><span id="modalAmmountBlock"><span id="modalAmmount">0</span><span id="modalAmmountType">' + LANG("GRAMS") + '</span></span><span id="modalTotalBlock"><span id="modalTotal">0</span><span id="modalTotalType">kcal</span></span></div>');
						//set shortcuts
						var kcalsBase = mKcal;
						//var kcalsList = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodKcal").text().split("kcals").join(""));
						if(searchType == "food") { 
							$("#modalAmmountType").html(LANG('GRAMS'));
							$("#modalTotalType").after("<span id='proData'>0.0<span>g</span></span><span id='carData'>0.0<span>g</span></span><span id='fatData'>0.0<span>g</span></span><span id='proLabel'>" + LANG('PRO') + "</span><span id='carLabel'>" + LANG('CAR') + "</span><span id='fatLabel'>" + LANG('FAT') + "</span>");
						} else {
							$("#modalAmmountType").html(LANG('MINUTES'));
						}
						//SHOW MODAL
						$("#modalWindow,#modalOverlay").fadeIn(200);
						$('#modalWindow,#modalOverlay').addClass('show');
						//#/////////////////////////////////#//
						//# MODAL ADD/REMOVE CORE FUNCTIONS #//
						//#/////////////////////////////////#//
						///////////////////
						// NUTRIENT DATA //
						///////////////////
						function getNutriData() {
							if(searchType == "food") {
								var kcalsPro = mPro;
								var kcalsCar = mCar;
								var kcalsFat = mFat;
								//var kcalsFib = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodFib").text().split("fib").join(""));
								var kcalsTotalPro = (Math.round((((Number(kcalsPro))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var kcalsTotalCar = (Math.round((((Number(kcalsCar))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var kcalsTotalFat = (Math.round((((Number(kcalsFat))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								//var kcalsTotalFib = (Math.round((((Number(kcalsFib))/100) * Number(document.getElementById('modalAmmount').innerHTML)*100))/(100));
								var proData = "" + kcalsTotalPro.toFixed(1) + "<span>g</span>";
								var carData = "" + kcalsTotalCar.toFixed(1) + "<span>g</span>";
								var fatData = "" + kcalsTotalFat.toFixed(1) + "<span>g</span>";
								//var fibData = "" + kcalsTotalFib.toFixed(1) + "<span>g</span>";
								$("#proData").html(proData);
								$("#carData").html(carData);
								$("#fatData").html(fatData);
								//$("#fibData").html(fibData);
							}
						}
						/////////
						// ADD //
						/////////
						function modalAdd() {
							//FOOD
							if(searchType == "food") {
								if($("#modalAmmount").html() < 750 && Math.round(((kcalsBase)/100) * (Number(document.getElementById('modalAmmount').innerHTML) + 25)) <= 9999) {
									$("#modalAmmount").html(Number($("#modalAmmount").html()) + (25));
									$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmmount').innerHTML)));
									getNutriData();
								}
							} else {
							//EXERCISE
								if($("#modalAmmount").html() < 360 && Math.round(((kcalsBase * totalWeight)/60) * (Number(document.getElementById('modalAmmount').innerHTML) + 5)) <= 9999) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) + (5));
									$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmmount').innerHTML)));
								}
							}
						}
						/////////
						// REM //
						/////////
						function modalRem() {
							//FOOD	
							if(searchType == "food") {
								if($("#modalAmmount").html() > 0) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) - (25));
									$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmmount').innerHTML)));
									getNutriData();
								}
							} else {
							//EXERCISE
								if($("#modalAmmount").html() > 0) {
									$("#modalAmmount").html( Number($("#modalAmmount").html()) - (5));
									$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmmount').innerHTML)));
								}
							}
						}
						/////////////////////
						// POSITIVE ADJUST //
						/////////////////////
						$("#modalPosBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							modalAdd();
							return false;
						});
						/////////////////////
						// NEGATIVE ADJUST //
						/////////////////////
						$("#modalNegBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							modalRem();
							return false;
						});
						///////////////////////
						// POSITIVE REPEATER //
						///////////////////////
						function clearRepeaterModal() {
							clearTimeout(pressTimerModalNeg);
							clearTimeout(pressTimerModalPos);
							clearInterval(pressRepeatModalNeg);
							clearInterval(pressRepeatModalPos);
						}
						///////////////
						// AUTOCLEAR //
						///////////////
						$("#modalPosBlock,#modalNegBlock").on(touchend + " mouseout", function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						//
						var pressTimerModalPos;
						var pressRepeatModalPos;
						$("#adjustPosBlock").on(touchend, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						$("#modalPosBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							pressTimerModalPos  = window.setTimeout(function()  {
							pressRepeatModalPos = window.setInterval(function() {
							modalAdd();
							return false;
							},275);
							},275);
						});
						///////////////////////
						// NEGATIVE REPEATER //
						///////////////////////
						var pressTimerModalNeg;
						var pressRepeatModalNeg;
						$("#modalNegBlock").on(touchend, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
						});
						$("#modalNegBlock").on(touchstart, function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							pressTimerModalNeg  = window.setTimeout(function()  {
							pressRepeatModalNeg = window.setInterval(function() {
							modalRem();
							return false;
							},275);
							},275);
						});
						//#/////////////////////////#//
						//# SMALLER MODAL FUNCTIONS #//
						//#/////////////////////////#//
						////////////////////////////
						// MODAL QUICK ADD (SAVE) //
						////////////////////////////
						var im = 0;
						$("#modalOk").on(touchstart,function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							//ADJUST TYPE
							if(searchType == "food") { 
								var valueType = 1;
								var shortDesc = " (" + document.getElementById('modalAmmount').innerHTML + "g)";
							} else {
								var valueType = -1;
								var shortDesc = " (" + document.getElementById('modalAmmount').innerHTML + " min)";
							}
							//grab values
							var title     = ((document.getElementById('modalTotal').innerHTML) * (valueType));
							var body      = mName + shortDesc;
							var published = new Date().getTime();
							//hours ago
							if(Number($("#entryTime").val()) >= 1) {
								published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000) );
							}
							//SAVE (NOT NULL)
							if(title != 0 && im == 0) {
							im++;
								//console.log("new entry added (modal)");
								diary.saveEntry({title:title,body:body,published:published});
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								$(".searcheable").removeClass('fade');
								//CSS HIGHLIGHT
								$(".activeOverflow").removeClass("activeOverflow");
								$(".searcheable").removeClass('yellow');
								$(".searcheable").removeClass('trans');
								//$("#" + mCode).addClass('yellow');
								$("#activeOverflow").parent('div').addClass('yellow');
								var yellowFade = setTimeout(function() {
									//$("#" + mCode).addClass('fade');
									//$("#" + mCode).addClass('trans');
									$("#activeOverflow").parent('div').addClass('fade');
									$("#activeOverflow").parent('div').addClass('trans');
								},0);
								$(".activeOverflow").removeClass("activeOverflow");
								//SELF-REMOVE
								$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
									$("#modalOverlay,#modalWindow").remove();
								});
								if(document.getElementById('slider') && document.getElementById('entryBody')) {
									var resetSlider = document.getElementById('slider').slider.resetValue();
									document.getElementById('entryBody').value = "";
									document.getElementById('entryTime').value = 0;
								}
								//REFRESH DATA
								updateTimer();
								clearRepeaterModal();
								//$("#" + mCode).parent('div').on('webkitTransitionEnd',function(e) { 
								setTimeout(function(evt) {
									updateEntries(published);
									updateEntriesTime();
								},1000);
								//});
							}
						});
						///////////////////
						// OVERLAY CLOSE //
						///////////////////
						//fix foodlist scrolling
						$("#modalWindow").on("touchmove",function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
						});
						$("#modalOverlay, #modalCancel").on(touchstart,function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							//fade (time protected)
							var deFade = new Date().getTime();
							if((deFade - duh > 350)) {
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								clearRepeaterModal();
								//SELF-REMOVE
								$('#modalOverlay').on('webkitTransitionEnd',function(e) { 
									$("#modalOverlay,#modalWindow").remove();
								});
							}
						});
						///////////////////
						// PRE-FILL ONLY //
						///////////////////
						var mc = 0;
						$("#modalContent").on(touchstart,function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							clearRepeaterModal();
							if(mc == 0) {
								mc++;
								///////////////
								// DIARY TAB //
								///////////////
								var preFillTimer = 0;
								if(window.localStorage.getItem("app_last_tab") != "tab2") {
									var preFillTimer = 150;				
									$("ul#appFooter li").removeClass("selected");
									window.localStorage.setItem("app_last_tab","tab2");
									$("#tab2").addClass("selected");
									openDiary();
								}
								setTimeout(function(evt) {
									$("#entryBody").val(mName);
									//CSS FADE OUT
									$('#modalWindow').removeClass('show');
									$('#modalOverlay').removeClass('show');
									//SELF-REMOVE
									$('#modalWindow').on('webkitTransitionEnd',function(e) { 
										$("#modalWindow").remove();
										$("#modalOverlay").remove();
									});
									$("#appHeader").trigger(trim(touchstart));
									$('#entryBody').width(window.innerWidth -58);
									$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
								},preFillTimer);
							}
						});
						///////////////////
						// DELETE BUTTON //
						///////////////////						
						$("#modalDelete").on(tap, function(evt) {
							evt.stopPropagation();
							function removeItem(button) {
								if(button == 1) {			
									diary.delFood(itemId);
									//if last row
									if($('#' + $("#activeOverflow").parent('div').parent('div').attr("id") + " .searcheable").length == 1) {
										$("#activeOverflow").parent('div').parent('div').append('<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>');
									}
									$("#activeOverflow").parent('div').remove();
									//if last row (cross-check)
									if($('#' + $("#" + itemId).parent('div').attr("id") + " .searcheable").length == 1) {
										$("#" + itemId).parent('div').append('<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>');
									}
									$("#" + itemId).remove();
									//close
									$("#modalCancel").trigger(trim(touchstart));
									return false;
								}
							}
							//SHOW DIALOG
							if(hasTouch()) {
								navigator.notification.confirm(LANG("ARE_YOU_SURE"), removeItem, LANG("DELETE_ITEM"), [LANG("OK"),LANG("CANCEL")]);
								return false;
							} else {
								if(confirm(LANG("DELETE_ITEM"))) { removeItem(1); } else { return false; }
							}
						});
						/////////////////
						// EDIT BUTTON //
						/////////////////
						$("#modalEdit").on(tap, function(evt) {
							evt.stopPropagation();
							var modalOpt = {
								name:mName,
								type:mType,
								code:mCode,	
								kcal:mKcal,
								pro:mPro,
								car:mCar,
								fat:mFat,	
								fib:mFib			
							};
							addNewItem(modalOpt);
							return false;
						});
						////////////////
						// FAV BUTTON //
						////////////////
						if(mFib == "fav") { $("#modalFav").addClass("favourite"); }
						//mFib
						$("#modalFav").on(tap, function(evt) {
							$("#modalFav").toggleClass("favourite");
							if(mFib == "fav") { mFib = "nonFav"; } else {  mFib = "fav"; }
							evt.stopPropagation();
							var modalOpt = {
								name:mName,
								type:mType,
								code:mCode,	
								kcal:mKcal,
								pro:mPro,
								car:mCar,
								fat:mFat,	
								fib:mFib			
							};
							diary.setFav(modalOpt);
							updateFavList();
						});
						/////////////////////////////////////
						// END TAP FOOD-ENTRY EDIT (MODAL) //
						/////////////////////////////////////
	});
}

