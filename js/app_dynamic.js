//#//////////////////#//
//# DYNAMIC HANDLERS #//
//#//////////////////#//
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
			var holdPreText = trim($('.entriesBody',this).text());
			$("#entryBody").stop().animate({ backgroundColor: "#ffff88" }, 1,function() { $("#entryBody").val(holdPreText); $("#entryBody").trigger("change"); }).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
			$('.entriesBody',this).stop().animate({ color: "#ffcc33" }, 1).animate({ color: "#666"},900,function() { updateEntries(); } );
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
	event.preventDefault();
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
			$('.active').on(transitionend,function(e) { $('.active').removeClass('busy'); });
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
											new_value = LANG.FOOD[lang];
										} else if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
											new_value = LANG.EXERCISE[lang];
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
										updateEntriesSum();
										window.scroll($('#appContent')[0].scrollTop,0,0);
										return false;
									//});
								},
								change: function() {
									//save changes
									var editableValue = $("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
									saveEntry({body:editableValue,id:$(this).closest('div').data("id")}, function() {
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
								timedBlur = new Date().getTime() - 6*1000;
								//no reset block
								if(!$(this).parent('div').hasClass("editing")) {
									return;
								}
								var thisRowId = $(this).closest('div').data("id");
								//INTOTHEVOID//
								function intoTheVoid(button) {
									//ON CONFIRM
									timedBlur = new Date().getTime();
									if(button == 1) {
										$("#" + thisRowId + " " + ".entriesTitle").html("0");
										$("#" + thisRowId + " " + ".entriesTitle").css("color","#333");
										//save
										saveEntry({title:'0',id:thisRowId});
										updateTimer();
									}
									return false;
								}
								//SHOW DIALOG
								if(hasTouch() && (!isMobile.Android() || androidVersion() >= 4.4)) {
									navigator.notification.confirm(LANG.ARE_YOU_SURE[lang], intoTheVoid, LANG.RESET_ENTRY_TITLE[lang], [LANG.OK[lang],LANG.CANCEL[lang]]);
								} else {
									if(confirm(LANG.RESET_ENTRY_TITLE[lang])) { intoTheVoid(1); } else { intoTheVoid(0); }
								}
								return false;
							});
							/////////////////////
							// POSITIVE ADJUST //
							/////////////////////
							$("#adjustPosBlock").on(touchstart, function(evt) {
								evt.preventDefault();
								//prevent android click-blur
								timedBlur = new Date().getTime();
								$(this).addClass("activeBlock");
								if(Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
									//console.log("increase entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (1);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$(this).closest('div').data("id")}, function() {
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
								//prevent android click-blur
								timedBlur = new Date().getTime();
								$(this).addClass("activeBlock");
								if(Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
									//console.log("decrease entry value");
									//first click 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9975;
									} else {
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (1);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
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
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (1);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
										document.getElementById('kcalsDiv').innerHTML = 9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
										document.getElementById('kcalsDiv').style.color = '#333';
									}
									//save value
									saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},25);
								},400);
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
										document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (1);
									}
									//limit 9999
									if(Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
										document.getElementById('kcalsDiv').innerHTML = -9999;
									}
									if(Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										document.getElementById('kcalsDiv').style.color = '#C00';
									}
									//save value
									saveEntry({title:document.getElementById('kcalsDiv').innerHTML,id:$('#kcalsDiv').parent('div').data("id")}, function() {
										return false;
									});
								updateTimer();
								}
								return false;
								},25);
								},400);
							});
							//prevent empty list highlight
							if(!isNaN($(this).closest("div").attr("id"))) {
								var editableValue = $("#editableInput").val();
								if(editableValue == LANG.FOOD[lang] || editableValue == LANG.EXERCISE[lang]) { $("#editableInput").val(''); }
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
	$("#entryList").on("swipe",function(evt) {
		deKeyboard = 1;
	});
	$("#entryList div" + tgt).swipe({
		swipe:function(event,direction) {
			//console.log("row " + $(this).parent('div').data("id") + " swipe");
			if(direction == 'left' || direction == 'right') {
				//HIDE ACTIVE
				if(!$('.delete').hasClass('busy')) {
					$('.active').addClass('busy');
					$('.active').removeClass('open');
					$('.active').on(transitionend,function(evt) { $('.active').removeClass('busy'); });
					$('.active').removeClass('active');
				}
				//SHOW
				if(!$('#entryList div:animated').length > 0 && !$('.delete').hasClass('busy') && !$('.delete').hasClass('busy') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('.editableInput').is(':focus') && !$('#entryBody').is(':focus') && !$('#entryTime').is(':focus')) {
					$('.delete',this).addClass('active');
					$('.delete',this).addClass('busy');
					$('.delete',this).addClass('open');
					$('.delete',this).on(transitionend,function(evt) { $('.delete').removeClass('busy'); }); 
				}
			}
		}
	});
	$("#entryList div").swipe("option", "threshold", 32);
	$("#entryList div").swipe("option", "allowPageScroll", "vertical");
	/////////////////////
	// STOP ENTRY EDIT //
	/////////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#entryList div,#entryListBottomBar").on(touchstart, function(evt) {
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
				//rekeyboarding on entrywrapper tap dismiss
				if(isMobile.iOS()) {
					//evt.preventDefault();
					//evt.stopPropagation();
					$("#entryListForm").prepend("<div id='sliderBlock'></div>");
					$("#sliderBlock").fadeOut(700,function(evt) {
						$("#sliderBlock").remove();
					});
				}
				//whitegap mitigation
				if(isMobile.Android() && !$('.active').hasClass('open')) {
					return false;
				}
				//evt.preventDefault();
			}
		}
	});
	/////////////////
	// GLOBAL HIDE //
	/////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#editablediv,#entryListWrapper").on(tap + " swipeLeft swipeRight", function(evt) {
		if(!isMobile.Android()) {
			evt.preventDefault();
		}
		if(!$('.active').hasClass('busy')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on(transitionend,function(e) { $('.active').removeClass('busy'); });
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
		deleteEntry($(this).parent('div').data("id"));
		//REMOVE CLICKED
		$(this).parent('div').remove();
		updateTimer();
		updateEntriesTime();
		updateEntriesSum();
		//SCROLLBAR UPDATE
		//clearTimeout(niceTimer);
		//niceTimer = setTimeout(niceResizer, 200);
		//IF LAST ROW 
		if($('#entryList .entryListRow').length == 0) {
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
			updateTimer();
			return false;
		}
		//force error
		window.scroll($('#appContent')[0].scrollTop,0,0);
		//window.onscroll(scroll($('body')[0].scrollTop,0));
		clearTimeout(niceTimer);
		niceTimer = setTimeout(function() {
			niceResizer();
			return false;
		}, 100);
		return false;
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
			$('.active').on(transitionend,function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if(!$('.delete').hasClass('busy')) {
			//hide
			if($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
				$('#pageSlideFood').addClass('busy');				
				//$('#pageSlideFood').removeClass("open");
				//$('#appHeader').removeClass("open");
				$('#pageSlideFood').on(transitionend,function(e) { $('#pageSlideFood').removeClass('busy'); /*$('#pageSlideFood').css("opacity","0");*/ $("#foodSearch").blur(); });
			} else {
				if(!$('#pageSlideFood').hasClass('busy')) {
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
	$('#pageSlideFood').on(transitionend,function(evt) {
		updateFoodDb();
		$("#appHeader").addClass("closer");
	});
	///////////////
	// FOOD HTML //
	///////////////
	$("#pageSlideFood").html('<div id="sideMenuFood"><input tabindex="-2" type="text" id="foodSearch" placeholder="' + LANG.FOOD_SEARCH[lang] + '" /><span id="iconClear"></span><span id="iconRefresh" class="icon-refresh"></span><div id="foodListWrapper"><div id="foodList"><span id="noMatches">' + LANG.NO_MATCHES[lang] + '</span></div></div></div>');
	//PRE-ADJUST RESULTS HEIGHT
	$('#foodSearch').width(window.innerWidth -55);
	buildFoodMenu();
	//remember search type
	if(window.localStorage.getItem("searchType") == "exercise") {
		$("#foodSearch").attr('placeholder',LANG.EXERCISE_SEARCH[lang]);
		$("#foodSearch,#pageSlideFood").addClass("exerciseType");
	}
	////////////////////
	// RESULTS HEIGHT //
	////////////////////
	$('#foodList').css("height",(window.innerHeight - ($('#appHeader').height() + 61)) + "px");
	$('#foodList').css("top",($('#appHeader').height()) + "px");
	if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4) {
		$("#foodList").css("overflow","hidden");
		setTimeout(function(){
			$("#foodList").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder:"1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
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
			clearTimeout(timer);
			$('#foodSearch').val('');
			$('#iconClear').hide();
			$('#iconRefresh').show();
			//buildFoodMenu();
			$("#searchContents .foodName").css("overflow","hidden");
			$("#searchContents .foodName").hide();
			$('#searchContents').hide();
			$('#infoContents').show();			
			$('#menuTopBar').show();
		});
		//SET TIMER
		clearTimeout(timer);
		var ms = 200; //275;
		//faster desktop
		if(!isCordova) { var ms  = 50; }
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
			//enforce iconClear
			$('#searchContents').hide();
			$('#menuTopBar').show();
			$('#infoContents').show();
			//update placeholder n' animate
			if($("#foodSearch").hasClass("exerciseType")) {
				window.localStorage.setItem("searchType","exercise");
				$("#foodSearch").attr('placeholder',LANG.EXERCISE_SEARCH[lang]);
				$("#foodSearch").addClass('busy');
				$("#foodSearch").animate({ backgroundColor: "#FECEC6" }, 1).animate({ backgroundColor: "#fff" },600,function() { 
						$("#foodSearch").removeClass('busy');
					}
				);
			} else {
				window.localStorage.removeItem("searchType");
				$("#foodSearch").attr('placeholder',LANG.FOOD_SEARCH[lang]);
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//show
					$("#entryBody").blur();
					$("#entryTime").blur();
					//$('#pageSlideFood').css("opacity",".925");
					$('#pageSlideFood').addClass('busy');
					//open directly on first load
					if(window.localStorage.getItem("foodDbLoaded") != "done") {
						$('#pageSlideFood').addClass("open");
					}
					$('#loadingDiv').hide();
					$('#appHeader').addClass("open");
					$('#pageSlideFood').on(transitionend,function(e) { 
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
function searchFood(searchSQL,callback) {
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
	if(hasSql) {
	db.transaction(
		function(t) {
			t.executeSql("SELECT * FROM diary_food WHERE type == '" + typeTerm + "' AND " + searchSQL + " ORDER BY CASE when term LIKE " + caseStarts + " THEN 0 ELSE 1 END, UPPER(term) LIMIT 50",[],
			function(t,results) {
				callback(fixResults(results));
		},dbErrorHandler);
	}, dbErrorHandler); 
	} else {
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//	
		var datz = lib2.query("diary_food");	
		var dato = datz;
		var keyJunk = 0;
		var keyScore = 0;
		var mi = [];
		var limited = 0;
		/////////////////
		// GET FULL DB //
		/////////////////
		//lib2.query("diary_food",function(data) {
		//var searchTerm = "";
		
	
	//console.log(searchSQL);	

		var results = 0;
		for(var z=0, len=dato.length; z<len; z++) {

//if(results < 30) {

			keyScore = 0;
			keyJunk  = 0;

	if(dato[z].type == typeTerm) {

			for(var k=0, lenn=searchSQL.length; k<lenn; k++) {
				if(dato[z].term.indexOf(searchSQL[k]) != -1 && keyJunk == 0) {
					keyScore = keyScore + Math.abs(dato[z].term.match(searchSQL[k]).index);
				} else {
					keyJunk = 1;
				}
			}
		if(keyJunk == 0) {
			mi.push({id:keyScore,value:dato[z]});
			//results++;
		}
	}
		}
		var prop = 'id';
    mi = mi.sort(function(a, b) {
       // if (asc)
		return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
       // else 
	   //return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
		
		var mou = [];
		//for(var u=0, lenu=mi.length; u<lenu; u++) {
		for(var u=0, lenu=mi.length; u<30; u++) {
			if(mi[u]) {
		mou.push(mi[u].value);
		}
		}
		
		
		callback(mou);
		//console.log(JSON.stringify(mou));
	//	}		
		
		
		
		
	
	
	
	
	
	
	
	
	
	
		
		
		
		///var datz = lib2.query("diary_food");	
	}
	
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
	if(hasSql) {
		
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
	
	} else {
	
	
	
	
	
	
	
	
	
	
		
		
		
		
		var timerStart = new Date().getTime();
	var lastSearch = window.localStorage.getItem("lastSearchTerm");
	//sanitize user input
	var searchQuery = trim(rawInput.split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("\\").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").toLowerCase());
	//partial sql syntax
	var searchSQL   = searchQuery.split(" ");
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
				//filter duplicates			
				//if($.inArray(trim(searchQuery[i]), keywordArray )) { 
				if(keywordArray.indexOf(  trim(searchQuery[i])  ) == -1) {
					keywordArray.push(trim(searchQuery[i]));
				}
			}
		}
	} else {
		//single term array
		keywordArray.push(searchQuery);
	}
	





















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
		searchFood(searchSQL,function(data) {
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
				var fib  = 0;
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
				var foodLine = "<div class='searcheable' id='" + code + "' title='" + kcalBase + "'><div class='foodName'>" + name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + kcal + "</span><span class='foodPro " + typeClass + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + pro + "</span><span class='foodCar " + typeClass + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>"  + car  + "</span><span class='foodFat " + typeClass + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>"  + fat  + "</span></div>";
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
					$("#searchContents").html('<span id="noMatches"> ' + LANG.NO_MATCHES[lang] +' </span>');
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
			//enforce clearIcon display
			$('#iconRefresh').hide();
			$('#iconClear').show(); 
			////////////////////////
			// OVERFLOW ON-DEMAND //
			////////////////////////
			$(".searcheable").on(tap + ' ' + touchstart, function(evt) {


				//if($("#foodSearch").is(":focus")) { 

					//$("#foodSearch").blur();
					//window.scroll($('#appContent')[0].scrollTop,0,0);
					//return;

				//}
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
	getCustomList("fav",function(data) {
		// LOOP RESULTS //
		var customFavList = "";
		var customFavSql  = "";
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
			//////////
			// SYNC //
			//////////
			var id        = data[c].id;
			var type      = data[c].type;
			var code      = data[c].code;
			var name      = sanitizeSql(data[c].name);
			var term      = data[c].term;
			var kcal      = data[c].kcal;
			var pro       = data[c].pro;
			var car       = data[c].car;
			var fat       = data[c].fat;
			var fib       = data[c].fib;
			if(!name) { name = '0.00'; }
			if(!kcal) { kcal = '0.00'; }
			if(!pro)  { pro  = '0.00'; }
			if(!car)  { car  = '0.00'; }
			if(!fat)  { fat  = '0.00'; }
			if(!fib)  { fib  = '0.00'; }
			
			if(data[c].id) { var favSql = "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + id + ",'" + type + "','" + code + "','" + name + "','" + term + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n"; }

			var favLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + cKcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + cKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + cPro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>"  + cCar  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>"  + cFat  + "</span></div>";
			if(favLine != "") {
				customFavList += favLine;
			}

			if(favSql != "") {
				customFavSql += favSql;
			}			
		}
		if(customFavList == "") { customFavList += '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>'; }
		if(customFavSql  != "") { window.localStorage.setItem("customFavSql",customFavSql); } else { window.localStorage.setItem("customFavSql"," "); }
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
	getCustomList("food",function(data) {
		// LOOP RESULTS //
		var customFoodList = "";
		var customFoodSql  = "";		
		for(var c=0, len=data.length; c<len; c++) {
			
			cKcal = Math.round(data[c].kcal * 100) / 100;
			cPro = Math.round(data[c].pro * 100) / 100;
			cCar = Math.round(data[c].car * 100) / 100;
			cFat = Math.round(data[c].fat * 100) / 100;
			///////////////////////
			//////////
			// SYNC //
			//////////
			var id   = data[c].id;
			var type = data[c].type;
			var code = data[c].code;
			var name = sanitizeSql(data[c].name);
			var term = data[c].term;
			var kcal = data[c].kcal;
			var pro  = data[c].pro;
			var car  = data[c].car;
			var fat  = data[c].fat;
			var fib  = data[c].fib;
			if(!name) { name = '0.00'; }
			if(!kcal) { kcal = '0.00'; }
			if(!pro)  { pro  = '0.00'; }
			if(!car)  { car  = '0.00'; }
			if(!fat)  { fat  = '0.00'; }
			if(!fib)  { fib  = '0.00'; }
			if(data[c].id)			{ var foodSql = "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + id + ",'" + type + "','" + code + "','" + name + "','" + term + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n"; }
			if(foodSql != "")		{ customFoodSql += foodSql; }
			/////////////////////		
			var foodLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + cKcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + cKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + cPro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>"  + cCar  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>"  + cFat  + "</span></div>";
			if(foodLine != "") {
				customFoodList += foodLine;
			}
		}
		if(customFoodList == "") { customFoodList += '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>'; }
		if(customFoodSql  != "") { window.localStorage.setItem("customFoodSql",customFoodSql); } else { window.localStorage.setItem("customFoodSql"," "); }
		//////////
		// HTML //
		//////////
		$("#addNewFood").remove();
		$("#tabMyFoodsBlock").html(customFoodList + '<div id="addNewFood">' + LANG.ADD_NEW_FOOD[lang] +'</div>');
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
getCustomList("exercise",function(data) {
	// LOOP RESULTS //
	var customExerciseList = "";
	var customExerciseSql  = "";
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
		var excerciseLine = "<div class='searcheable " + data[c].type + "' id='" + data[c].code + "' title='" + data[c].kcal + "'><div class='foodName " + data[c].type + "'>" + data[c].name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + excerciseKcal + "</span><span class='foodPro " + data[c].type + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + data[c].pro + "</span><span class='foodCar " + data[c].type + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>"  + data[c].car  + "</span><span class='foodFat " + data[c].type + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>"  + data[c].fat  + "</span></div>";
		if(excerciseLine != "") {
			customExerciseList += excerciseLine;
		}
		///////////////////////
		//////////
		// SYNC //
		//////////
		var id   = data[c].id;
		var type = data[c].type;
		var code = data[c].code;
		var name = sanitizeSql(data[c].name);
		var term = data[c].term;
		var kcal = data[c].kcal;
		var pro  = data[c].pro;
		var car  = data[c].car;
		var fat  = data[c].fat;
		var fib  = data[c].fib;
		if(!name) { name = '0.00'; }
		if(!kcal) { kcal = '0.00'; }
		if(!pro)  { pro  = '0.00'; }
		if(!car)  { car  = '0.00'; }
		if(!fat)  { fat  = '0.00'; }
		if(!fib)  { fib  = '0.00'; }
		if(data[c].id)			{ var exerciseSql = "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + id + ",'" + type + "','" + code + "','" + name + "','" + term + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n"; }
		if(exerciseSql != "")	{ customExerciseSql += exerciseSql; }		
		/////////////////////		
	}
	if(customExerciseList == "") {customExerciseList += '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>'; }
	if(customExerciseSql  != "") { window.localStorage.setItem("customExerciseSql",customExerciseSql); } else { window.localStorage.setItem("customExerciseSql"," "); }
	//////////
	// HTML //
	//////////
	$("#addNewExercise").remove();
	$("#tabMyExercisesBlock").html(customExerciseList + '<div id="addNewExercise">' + LANG.ADD_NEW_EXERCISE[lang] +'</div>');
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
	getEntries(function(data) {
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
		if(sortedList == "") { recentHtml += '<div class="searcheable"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>'; }
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
$("#foodList").html("<div id='menuTopBar'><h3 id='topBarItem-1'><span>" + LANG.MY_FAVOURITES[lang] + "</span></h3><h3 id='topBarItem-2'><span>" + LANG.MY_FOODS[lang] + "</span></h3><h3 id='topBarItem-3'><span>" + LANG.MY_EXERCISES[lang] + "</span></h3></div>\
" + recentBlock);
//first load db spinner
if(window.localStorage.getItem("foodDbLoaded") != "done") {
	//reset blocks
	$("#tabMyFavsBlock,#tabMyFoodsBlock,#tabMyExercisesBlock").html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');

	$("#addNewFood").remove();
	$("#tabMyFoodsBlock").after('<div id="addNewFood">' + LANG.ADD_NEW_FOOD[lang] +'</div>');
	$('#tabMyFoodsBlock').css("min-height", ($('#foodList').height() - 128) + "px");

	$("#addNewExercise").remove();
	$("#tabMyExercisesBlock").after('<div id="addNewExercise">' + LANG.ADD_NEW_EXERCISE[lang] +'</div>');
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
	var tabTimer1 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-1") ? 0:300;
	var tabTimer2 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-2") ? 0:300;
	var tabTimer3 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-3") ? 0:300;
	setTimeout(function() { updateFavList();      },tabTimer1);
	setTimeout(function() { updateFoodList();     },tabTimer2);
	setTimeout(function() { updateExerciseList(); },tabTimer3);
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
	clearTimeout(niceTimer);
	niceTimer = setTimeout(function() {
		niceResizer();
		return false;
	}, 0);
	return false;
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
						$('#modalWindow').on(transitionend,function(e) { 
							$("#modalWindow").remove();
							$("#modalOverlay").remove();
						});
						$("#appHeader").trigger(touchstart);
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
		$("body").addClass("overlay");
		$("body").append('\
		<div id="tempHolder">\
			' + modalOverlay + '\
			<div id="addNewWrapper">\
				<ul id="addNewList">\
					<li id="addNewName">   <label>' + LANG.ADD_NAME[lang] + '</label>                           <input tabindex="3" type="text"   id="inputNewName"                /></li>\
					<li id="addNewAmount"><label>' + LANG.ADD_AMOUNT[lang] + ' (' + LANG.G[lang] + ')</label> <input tabindex="3" type="number" id="inputNewAmount" value="100" /></li>\
					<li id="addNewKcal">   <label>' + LANG.KCAL[lang] + '</label>                               <input tabindex="3" type="number" id="inputNewKcal"    value="0"   /></li>\
					<li id="addNewPro">    <label>' + LANG.PRO[lang]  + '</label>                               <input tabindex="3" type="number" id="inputNewPro"     value="0"   /></li>\
					<li id="addNewCar">    <label>' + LANG.CAR[lang]  + '</label>                               <input tabindex="3" type="number" id="inputNewCar"     value="0"   /></li>\
					<li id="addNewFat">    <label>' + LANG.FAT[lang]  + '</label>                               <input tabindex="3" type="number" id="inputNewFat"     value="0"   /></li>\
				</ul>\
				<div id="addNewCancel">'  + LANG.CANCEL[lang] + '</div>\
				<div id="addNewConfirm">' + LANG.SAVE[lang] + '</div>\
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
	$("#addNewAmount label").html(LANG.ADD_DURATION[lang] + ' (' + LANG.MIN[lang] + ')');
	$("#inputNewAmount").val(30);
	$("#addNewPro").hide();
	$("#addNewCar").hide();
	$("#addNewFat").hide();

	if(vAct == "update") {
		$("#inputNewKcal").val(Math.round(((opt.kcal * totalWeight)/60) * $("#inputNewAmount").val()));
	}
}

	//$("#addNewWrapper").css("min-height",$("#addNewWrapper").height() + "px");
	//$('#addNewList li input').placeholder({force:true});
	//prevent tapping
	//$("#modalOverlay").css("z-index",9999999);]
	$("ul#addNewList input").width(window.innerWidth - 180);
	$("#modalOverlay,#addNewWrapper").hide();
	$("#addNewWrapper").fadeIn(200);
	$("body").addClass("overlay");
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
			var vKcal = Math.round(((($("#inputNewKcal").val() / totalWeight ) / $("#inputNewAmount").val() )*60) * 100) / 100;
		}
///////////////////////
// VALIDATE ADD FORM //
///////////////////////
//clear previous
$("label").removeClass("error");
var doReturn = 0;
if(vName == "" || vName == 0)					{ $("#addNewName label").addClass("error"); doReturn = 1; }
if(vKcal == "" || vKcal == 0 || isNaN(vKcal))	{ $("#addNewKcal label").addClass("error"); doReturn = 1; }
if($("#inputNewAmount").val() == "" || $("#inputNewAmount").val() == 0 || isNaN($("#inputNewAmount").val())) { $("#addNewAmount label").addClass("error"); doReturn = 1; }
//parts > sum
if(parseFloat($("#inputNewPro").val()) + parseFloat($("#inputNewCar").val()) + parseFloat($("#inputNewFat").val()) > parseFloat($("#inputNewAmount").val())) {
	$("#addNewAmount label").addClass("error");
	$("#addNewPro label").addClass("error");
	$("#addNewCar label").addClass("error");
	$("#addNewFat label").addClass("error");
	doReturn = 1;
}
/////////////////////
// RETURN ON ERROR //
/////////////////////
if(doReturn == 1) {
	lockAdd = 0; 
	//info dialog
	if(hasTouch()) {
		navigator.notification.alert(LANG.BLANK_FIELD_DIALOG[lang], voidThis,LANG.BLANK_FIELD_TITLE[lang],LANG.OK[lang]);
	} else {
		if(alert(LANG.BLANK_FIELD_TITLE[lang] + "\n" + LANG.BLANK_FIELD_DIALOG[lang]));
	}
	return false;
}
// IF NULL/EMPTY, JUST REVERT TO 0
if(vPro == "" || isNaN(vPro))	{ vPro = 0; }
if(vCar == "" || isNaN(vCar))	{ vCar = 0; }
if(vFat == "" || isNaN(vFat))	{ vFat = 0; }
//revert to 100g
if(vType == "food") {
vKcal = Math.round((vKcal / $("#inputNewAmount").val()) *100 * 100) / 100;
vPro  = Math.round((vPro / $("#inputNewAmount").val()) *100 * 100) / 100;
vCar  = Math.round((vCar / $("#inputNewAmount").val()) *100 * 100) / 100;
vFat  = Math.round((vFat / $("#inputNewAmount").val()) *100 * 100) / 100;
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
		setFood({
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
			$(".activeOverflow .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
			$(".activeOverflow .foodPro").html('<span class="preSpan">'  + LANG.PRO[lang] + '</span>'  + vPro + '</span>');
			$(".activeOverflow .foodCar").html('<span class="preSpan">'  + LANG.CAR[lang] + '</span>'  + vCar + '</span>');
			$(".activeOverflow .foodFat").html('<span class="preSpan">'  + LANG.FAT[lang] + '</span>'  + vFat + '</span>');
			//id update
			$("#" + vCode + " .foodName").html(vName);
			$("#" + vCode + " .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
			$("#" + vCode + " .foodPro").html('<span class="preSpan">'  + LANG.PRO[lang] + '</span>'  + vPro + '</span>');
			$("#" + vCode + " .foodCar").html('<span class="preSpan">'  + LANG.CAR[lang] + '</span>'  + vCar + '</span>');
			$("#" + vCode + " .foodFat").html('<span class="preSpan">'  + LANG.FAT[lang] + '</span>'  + vFat + '</span>');
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
			//$('#modalOverlay').on(transitionend,function(e) { 
				$("#addNewCancel").trigger(touchstart);
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
			//$('#modalOverlay').on(transitionend,function(e) { 
				$("#addNewCancel").trigger(touchstart);
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
			$('#modalOverlay').on(transitionend,function() { 
				$("#tempHolder").remove();
				$("#modalOverlay,#addNewWrapper").remove();
				$("body").removeClass("overlay");
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
	getFood(itemId,function(data) {
		var mName = data[0].name;
		var mType = data[0].type;
		var mCode = data[0].code;
		var mTerm = data[0].term;
		var mKcal = Math.round(data[0].kcal * 100) / 100;
		var mPro  = Math.round(data[0].pro * 100)  / 100;
		var mCar  = Math.round(data[0].car * 100)  / 100;
		var mFat  = Math.round(data[0].fat * 100)  / 100;
		var mFib  = data[0].fib;
		////////////////////////
		// DEFINE TYPE/WEIGHT //
		////////////////////////
		var searchType  = (mType == "food") ? 'food' : 'exercise';
		var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
		//revert lb to kg
		if(window.localStorage.getItem("calcForm#pA3C") == "pounds") {
			totalWeight = Math.round( (totalWeight) / (2.2) );
		}
		var initTime = new Date().getTime();
		////////////////////////
		// FOODLIST MODAL-TAP //
		////////////////////////
		//prevent flood
		$("#modalOverlay").remove();
		$("#modalWindow").remove();
		//insert frame
		$("body").append('<div id="modalOverlay"></div>');
		$("body").append('<div id="modalWindow"></div>');
		$("body").addClass("overlay");
		//add content
		$("#modalWindow").html("<div id='modalDelete'></div><div id='modalEdit'></div><div id='modalFav'></div><div id='modalContent'>" + mName + "&nbsp; <span>&nbsp;" + LANG.PRE_FILL[lang] + "</span></div>");
		$("#modalWindow").append("<div id='modalButtons'><span id='modalOk'>" + LANG.ADD[lang] + "</span><span id='modalCancel'>" + LANG.CANCEL[lang] + "</span></div>");
		$("#modalWindow").append('<div id="modalAdjust"><span id="modalNegBlock"><span id="modalNeg" class="icon-chevron-sign-left"></span></span><span id="modalPosBlock"><span id="modalPos" class="icon-chevron-sign-right"></span></span><span id="modalAmountBlock"><span id="modalAmount">0</span><span id="modalAmountType">' + LANG.GRAMS[lang] + '</span></span><span id="modalTotalBlock"><span id="modalTotal">0</span><span id="modalTotalType">' + LANG.KCAL[lang] + '</span></span></div>');
		//set shortcuts
		var kcalsBase = mKcal;
		//modal mode min or g
		if(searchType == "food") { 
			$("#modalAmountType").html(LANG.GRAMS[lang]);
			$("#modalTotalType").after("<span id='proData'>0.0<span>" + LANG.G[lang] + "</span></span><span id='carData'>0.0<span>" + LANG.G[lang] + "</span></span><span id='fatData'>0.0<span>" + LANG.G[lang] + "</span></span><span id='proLabel'>" + LANG.PRO[lang] + "</span><span id='carLabel'>" + LANG.CAR[lang] + "</span><span id='fatLabel'>" + LANG.FAT[lang] + "</span>");
		} else {
			$("#modalAmountType").html(LANG.MINUTES[lang]);
		}
		//#////////////#//
		//# SHOW MODAL #//
		//#////////////#//
		$("#modalWindow,#modalOverlay").fadeIn(200);
		$('#modalWindow,#modalOverlay').addClass('show');
		//#/////////////////////////////////#//
		//# MODAL ADD/REMOVE CORE FUNCTIONS #//
		//#/////////////////////////////////#//
		var pressTimerModalNeg;
		var pressTimerModalPos;
		var pressRepeatModalNeg;
		var pressRepeatModalPos;
		//////////////////
		// GETNUTRIDATA //
		//////////////////
		function getNutriData() {
			if(searchType == "food") {
				var kcalsPro      = mPro;
				var kcalsCar      = mCar;
				var kcalsFat      = mFat;
				var kcalsTotalPro = (Math.round((((Number(kcalsPro))/100) * Number(document.getElementById('modalAmount').innerHTML)*100))/(100));
				var kcalsTotalCar = (Math.round((((Number(kcalsCar))/100) * Number(document.getElementById('modalAmount').innerHTML)*100))/(100));
				var kcalsTotalFat = (Math.round((((Number(kcalsFat))/100) * Number(document.getElementById('modalAmount').innerHTML)*100))/(100));
				var proData       = kcalsTotalPro.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
				var carData       = kcalsTotalCar.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
				var fatData       = kcalsTotalFat.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
				$("#proData").html(proData);
				$("#carData").html(carData);
				$("#fatData").html(fatData);
			}
		}
		//////////////
		// MODALADD //
		//////////////
		function modalAdd() {
			//FOOD
			if(searchType == "food") {
				if($("#modalAmount").html() < 750 && Math.round(((kcalsBase)/100) * (Number(document.getElementById('modalAmount').innerHTML) + 1)) <= 9999) {
					$("#modalAmount").html(Number($("#modalAmount").html()) + (1));
					$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmount').innerHTML)));
					getNutriData();
				}
			} else {
			//EXERCISE
				if($("#modalAmount").html() < 360 && Math.round(((kcalsBase * totalWeight)/60) * (Number(document.getElementById('modalAmount').innerHTML) + 1)) <= 9999) {
					$("#modalAmount").html( Number($("#modalAmount").html()) + (1));
					$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmount').innerHTML)));
				}
			}
		}
		//////////////
		// MODALREM //
		//////////////
		function modalRem() {
			//FOOD	
			if(searchType == "food") {
				if($("#modalAmount").html() > 0) {
					$("#modalAmount").html( Number($("#modalAmount").html()) - (1));
					$("#modalTotal").html(Math.round(((kcalsBase)/100) * Number(document.getElementById('modalAmount').innerHTML)));
					getNutriData();
				}
			} else {
			//EXERCISE
				if($("#modalAmount").html() > 0) {
					$("#modalAmount").html( Number($("#modalAmount").html()) - (1));
					$("#modalTotal").html(Math.round(((kcalsBase * totalWeight)/60) * Number(document.getElementById('modalAmount').innerHTML)));
				}
			}
		}
		/////////////////////
		// POSITIVE ADJUST //
		/////////////////////
		$("#modalPosBlock").on(touchstart, function(evt) {
			evt.preventDefault();
			modalAdd();
		});
		/////////////////////
		// NEGATIVE ADJUST //
		/////////////////////
		$("#modalNegBlock").on(touchstart, function(evt) {
			evt.preventDefault();
			modalRem();
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
		$("#modalPosBlock,#modalNegBlock").on(touchend + " mouseout mouseleave mouseup", function(evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#adjustPosBlock").on(touchend, function(evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#modalPosBlock").on(touchstart, function(evt) {
			evt.preventDefault();
			clearRepeaterModal();
			pressTimerModalPos = setTimeout(function() {
				pressRepeatModalPos = setInterval(function() { modalAdd(); },20);
			},400);
		});
		///////////////////////
		// NEGATIVE REPEATER //
		///////////////////////
		$("#modalNegBlock").on(touchend, function(evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#modalNegBlock").on(touchstart, function(evt) {
			evt.preventDefault();
			clearRepeaterModal();
			pressTimerModalNeg = setTimeout(function() {
				pressRepeatModalNeg = setInterval(function() { modalRem(); },20);
			},400);
		});
		//#/////////////////////////#//
		//# SMALLER MODAL FUNCTIONS #//
		//#/////////////////////////#//
		//////////////////////////////
		// MODAL QUICK ADD (SUBMIT) //
		//////////////////////////////
						var im = 0;
						$("#modalOk").on(touchstart,function(evt) {
							evt.preventDefault();
							clearRepeaterModal();
							//ADJUST TYPE
							if(searchType == "food") { 
								var valueType = 1;
								var shortDesc = " (" + document.getElementById('modalAmount').innerHTML + LANG.G[lang] + ")";
							} else {
								var valueType = -1;
								var shortDesc = " (" + document.getElementById('modalAmount').innerHTML + " " + LANG.MIN[lang] + ")";
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
								saveEntry({
									title:title,
									body:body,
									published:published,
									type:mType,									
									pro:parseFloat($("#proData").text()),
									car:parseFloat($("#carData").text()),
									fat:parseFloat($("#fatData").text())
								});
								//auto start
								function onConfirmStart(button) {
									if(button == 1) {
										window.localStorage.setItem("config_start_time",published);
										window.localStorage.setItem("appStatus","running");
										updateEntries();
									}
								}
								//SHOW START DIALOG
								if(window.localStorage.getItem("appStatus") != "running") {
									if(hasTouch()) {
										navigator.notification.confirm(LANG.NOT_RUNNING_DIALOG[lang], onConfirmStart, LANG.NOT_RUNNING_TITLE[lang], [LANG.OK[lang],LANG.CANCEL[lang]]);
									} else {
										if(confirm(LANG.NOT_RUNNING_TITLE[lang] + "\n" + LANG.NOT_RUNNING_DIALOG[lang])) { onConfirmStart(1); } else { }
									}
								}
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
								setTimeout(function() {
									//$("#" + mCode).addClass('fade');
									//$("#" + mCode).addClass('trans');
									$("#activeOverflow").parent('div').addClass('fade');
									$("#activeOverflow").parent('div').addClass('trans');
								},0);
								$(".activeOverflow").removeClass("activeOverflow");
								//SELF-REMOVE
								$('#modalOverlay').on(transitionend,function(e) { 
									$("#modalOverlay,#modalWindow").remove();
									$("body").removeClass("overlay");
								});
								if(document.getElementById('slider') && document.getElementById('entryBody')) {
									document.getElementById('slider').slider.setValue(0);
									//$("#entryTime").val('0');
									$("#entryTitle").val(0);
									$("#entryTitle").trigger("update");
 									//$("#entryBody").val('');
								}
								//REFRESH DATA
								updateTimer();
								clearRepeaterModal();
								//$("#" + mCode).parent('div').on(transitionend,function(e) { 
								setTimeout(function(evt) {
									updateEntries(published);
									updateEntriesTime();
									updateEntriesSum();
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
							if((deFade - initTime > 350)) {
								//CSS FADE OUT
								$('#modalWindow').removeClass('show');
								$('#modalOverlay').removeClass('show');
								clearRepeaterModal();
								//SELF-REMOVE
								$('#modalOverlay').on(transitionend,function(e) { 
									$("#modalOverlay,#modalWindow").remove();
									$("body").removeClass("overlay");
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
									$('#modalWindow').on(transitionend,function(e) { 
										$("#modalWindow").remove();
										$("#modalOverlay").remove();
										$("body").removeClass("overlay");
									});
									$("#appHeader").trigger(touchstart);
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
									delFood(itemId);
									//if last row
									if($('#' + $("#activeOverflow").parent('div').parent('div').attr("id") + " .searcheable").length == 1) {
										$("#activeOverflow").parent('div').parent('div').append('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
									}
									$("#activeOverflow").parent('div').remove();
									//if last row (cross-check)
									if($('#' + $("#" + itemId).parent('div').attr("id") + " .searcheable").length == 1) {
										$("#" + itemId).parent('div').append('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
									}
									$("#" + itemId).remove();
									//close
									$("#modalCancel").trigger(touchstart);
									return false;
								}
							}
							//SHOW DIALOG
							if(hasTouch()) {
								navigator.notification.confirm(LANG.ARE_YOU_SURE[lang], removeItem, LANG.DELETE_ITEM[lang], [LANG.OK[lang],LANG.CANCEL[lang]]);
								return false;
							} else {
								if(confirm(LANG.DELETE_ITEM[lang])) { removeItem(1); } else { return false; }
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
								term:mTerm,
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
								term:mTerm,
								kcal:mKcal,
								pro:mPro,
								car:mCar,
								fat:mFat,	
								fib:mFib			
							};
							setFav(modalOpt);
							//////////////////////////
							// IOS OVERFLOW FLICKER //
							//////////////////////////
							if(mFib == "nonFav") {
								$("#tabMyFavs #" + mCode).css("opacity",0);
								$("#tabMyFavs #" + mCode).remove();
								window.scroll($('#foodList')[0].scrollTop,0,0);
								return false;
							} else {
								if(isMobile.iOS()) {
									setTimeout(function() {
										updateFavList();
										window.scroll($('#foodList')[0].scrollTop,0,0);
									},50);
									window.scroll($('#foodList')[0].scrollTop,0,0);
									$("#tabMyFavs .foodName").css("opacity",0);
									$("#tabMyFavs .foodName").css("overflow","hidden");
									$("#tabMyFavs .foodName").css("opacity",1);
									window.scroll($('#foodList')[0].scrollTop,0,0);
								} else {
									updateFavList();
								}
							}
						/////////////////////////////////////
						// END TAP FOOD-ENTRY EDIT (MODAL) //
						/////////////////////////////////////
		});
	});
}

