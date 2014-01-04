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
	//////////////////
	// TAP DIV EDIT //
	//////////////////
	//var ix  = 0;
	//var meh = 0;
	var duh;
	// TOUCHSWIPE //
	$("#entryList div" + tgt).on(tap, function(event) {
	//$("#entryList div" + tgt).swipe({tap:function(event) {
	//	event.preventDefault();
		//////////////
		// TAP DATE //
		//////////////
		/*
		if(event.target.id.length == 13 && !$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
			$( "#" + event.target.id).html(dtFormat(Number(event.target.id)));
			setTimeout(function() {
				$("#" + event.target.id).html(dateDiff(event.target.id,(new Date()).getTime()));
			},1500);
		}*/
		//no delete
		if(!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on('webkitTransitionEnd',function(e) { $('.active').removeClass('busy'); });
			$('.active').removeClass('active');
			if($('.delete').hasClass('busy'))  { return; }
			if($('.delete').hasClass('busy'))  { return; }
			if($('#kcalsDiv').is(':visible'))  { return; }
			if($('#entryList div').is(':animated') || $('.editableInput').is(':visible')) { return; }
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
									$('#kcalsDiv').parent("div").animate({"backgroundColor": "#fff"},500,function() {
										eP = 0; 
									});
									$('#kcalsDiv').removeAttr('id');
									$("#sliderBlock").fadeOut(500);
									clearRepeaterBlock();
								},
								change: function() {
									//save changes
									var editableValue = $("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
									diary.saveEntry({body:editableValue,id:$(this).closest('div').data("id")}, function() {
										//return false;
									});
									//set blur
									if(!$("#entryList div").is(':animated')) {
										//$("#editableInput").blur();
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
								if(hasTouch() && !isMobile.Android()) {
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
							$("#adjustPosBlock,#adjustNegBlock").on(touchend + "mouseout", function(evt) {
								evt.preventDefault();
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
	//},
	$("#entryList div" + tgt).swipe({//tap:function(event) {
	//$("#entryList div").on("swipeLeft swipeRight",function(event) {
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
	$("#entryListWrapper").on(touchend, function(evt) {
		if($('.editableInput').is(':visible')) {
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			//evt.stopPropagation();
		}
		if(evt.target.id == "entryListWrapper") {
			if(!$("#entryList div").is(':animated')) {
				$("#editableInput").blur();
				//evt.stopImmediatePropagation();
				//evt.preventDefault();
			} 
		}
	});
	/////////////////
	// GLOBAL HIDE //
	/////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#entryListWrapper").on(tap + "swipeLeft swipeRight", function(evt) {
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
		$(this).hide();
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
		$("#pageSlideFood").html('<div id="sideMenuFood"><input type="text" id="foodSearch" placeholder="' + LANG("FOOD_SEARCH") + '" /><span id="iconClear">×</span><span id="iconRefresh" class="icon-refresh"></span><div id="foodListWrapper"><div id="foodList"><span id="noMatches">' + LANG("NO_MATCHES") + '</span></div></div></div>');
		//PRE-ADJUST RESULTS HEIGHT
		getRecentList();
		//$('#pageSlideFood').css("height",($('#entryListScroller').height() - (61)) + "px");
		//$('#foodList').css("height",($('#entryListScroller').height() - (61)) + "px");
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
		//$('#foodList').css("height",window.localStorage.getItem("absWindowHeight") - ( ($('#appHeader').height() + 60) ) + "px");
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
		//#///////////////////#//
		//# BUILD RECENT LIST #//
		//#///////////////////#//
		function getRecentList() {
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
					//define sort function and return sorted results
					function compareFreq(a,b) {
						return freq[b]-freq[a];
					}
					return newArray.sort(compareFreq);
				}
				var sortedList = sortByFrequencyAndFilter(searchHistory);
				var recentHtml = "";
				if(sortedList == "") { recentHtml += '<div class="searcheable"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>'; }

				for(q = 0; q < sortedList.length; q++) {
					//not null
					if(sortedList[q] != "" && q < 8) {
						
						//alert(sortedList[q].match( '###' ));
						//	userAgent.match(/Android [\d+\.]{3,5}/)[0].replace(
						var itemType = "food";
					if(sortedList[q].match( '##e##' )) {
						var itemType = "exercise";
						sortedList[q] = sortedList[q].replace("##e##","");
					}
						recentHtml += '<div class="searcheable recentItem ' + itemType + '"><div class="foodName ' + itemType + '">' + sortedList[q] + '</div></div>';
					}
				}
				$("#foodList").html("<div id='recentBlock'><h3 class='recentItem'>" + LANG('ENTRY_HISTORY') + "<span>(" + LANG('PRE_FILL') + ")</span></h3>" + recentHtml + "</div>");
				$(".searcheable").off(tap + touchstart);
				$(".searcheable").on(tap + touchstart, function(evt) {
				$("#activeOverflow").removeAttr("id");
				$(this).addClass("activeOverflow");
				$(".foodName",this).attr("id","activeOverflow");
				$(".foodName").css("overflow","auto");
			});
			// PRE-FILL RECENT //
			var mr = 0;
			//entrylist form propagation fix
			$(".recentItem").on(touchend,function(evt) {
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
						$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
					},preFillTimer);
				}
			});
			});
		}
		//#//////////////////////#//
		//# SEARCH CORE FUNCTION #//
		//#//////////////////////#//
		function doSearch(rawInput) {
			//ignore null searches
			if(rawInput == 0) {
				rawInput = "00000000";
			}
			//this.value = sval;
			/////////////////
			// FETCH INPUT //
			/////////////////	
			//var rawInput   = this.value;
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
							var kcal = data[s].kcal;
							var pro  = data[s].pro;
							var car  = data[s].car;
							var fat  = data[s].fat;
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
							var foodLine = "<div class='searcheable' id='" + type + code + "' title='" + kcalBase + "'><div class='foodName'>" + name + "</div><span class='foodKcal'><span class='preSpan'>kcal</span>" + kcal + "</span><span class='foodPro " + typeClass + "'><span class='preSpan'>" + LANG('PRO') + "</span>" + pro + "</span><span class='foodCar " + typeClass + "'><span class='preSpan'>" + LANG('CAR') + "</span>"  + car  + "</span><span class='foodFat " + typeClass + "'><span class='preSpan'>" + LANG('FAT') + "</span>"  + fat  + "</span></div>";
							//result list
							foodList += foodLine;
						//}
					} //end loop
					/////////////////////
					// DISPLAY RESULTS //
					/////////////////////
					//matches number
					//$("#iCounter").html(countMatch + " matches");
					//prevent overflow blinking
					$("#foodList").hide();
					$("#foodList").html('');
					//if empty
					if(foodList == "") {
						if($("#foodSearch").val() != "") {
							$("#foodList").html('<span id="noMatches"> ' + LANG("NO_MATCHES") +' </span>');
						} else {
							getRecentList();
						}
					} else {
						$("#foodList").html(foodList);
					}
					$("#foodList").show();
			////////////////////////
			// OVERFLOW ON-DEMAND //
			////////////////////////
			$(".searcheable").on(tap + touchstart, function(evt) {
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
			/////////////////////////////////
			// TAP FOOD-ENTRY EDIT (MODAL) //
			/////////////////////////////////
			//var ix  = 0;
			//var meh = 0;
			var duh;
			$("#foodList div.searcheable").on(singletap,function(event) {
			//$("#foodList div.searcheable").swipe({
			//	tap:function(event) {
					event.preventDefault();
					//counting
					//ix++;
					//var shit = meh;
					//var shot = $("#activeOverflow").html(); //this.id;
					//meh      = $("#activeOverflow").html(); //this.id;
					duh      = new Date().getTime();
					//filter
					//if(shit == shot && (duh - deh) < 400 && ix >= 1) {
					if(0 == 0) {
						////////////////////////
						// FOODLIST DOUBLETAP //
						////////////////////////
						//insert frame
						$("body").append('<div id="modalOverlay"></div>');
						$("body").append('<div id="modalWindow"></div>');
						//add content
						$("#modalWindow").html("<div id='modalContent'>" + $("#activeOverflow").html() + "&nbsp; <span>&nbsp;" + LANG('PRE_FILL') + "</span></div>");
						$("#modalWindow").append("<div id='modalButtons'><span id='modalOk'>" + LANG('ADD') + "</span><span id='modalCancel'>" + LANG('CANCEL') + "</span></div>");
						$("#modalWindow").append('<div id="modalAdjust"><span id="modalNegBlock"><span id="modalNeg" class="icon-chevron-sign-left"></span></span><span id="modalPosBlock"><span id="modalPos" class="icon-chevron-sign-right"></span></span><span id="modalAmmountBlock"><span id="modalAmmount">0</span><span id="modalAmmountType">' + LANG("GRAMS") + '</span></span><span id="modalTotalBlock"><span id="modalTotal">0</span><span id="modalTotalType">kcal</span></span></div>');
						//set shortcuts
						var kcalsBase = Number($("#activeOverflow").parent("div").attr("title"));
						//var kcalsList = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodKcal").text().split("kcals").join(""));
						//CONTENT TYPE ADJUST
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
								var kcalsPro = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodPro").text().split(LANG("PRO")).join(""));
								var kcalsCar = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodCar").text().split(LANG("CAR")).join(""));
								var kcalsFat = Number($("#" + $("#activeOverflow").parent("div").attr("id") + " .foodFat").text().split(LANG("FAT")).join(""));
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
								var shortDesc = ""; //" [" + document.getElementById('modalAmmount').innerHTML + "g]";
							} else {
								var valueType = -1;
								var shortDesc = ""; //" [" + document.getElementById('modalAmmount').innerHTML + " min]";
							}
							//grab values
							var title     = ((document.getElementById('modalTotal').innerHTML) * (valueType));
							var body      = $("#activeOverflow").text() + shortDesc;
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
								$("#activeOverflow").parent("div").addClass('yellow');
								var yellowFade = setTimeout(function() {
									$("#activeOverflow").parent("div").addClass('fade');
									$("#activeOverflow").parent("div").addClass('trans');
								},0);
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
								$("#activeOverflow").parent("div").on('webkitTransitionEnd',function(e) { 
									updateEntries(published);
									updateEntriesTime();
								});
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
									$("#entryBody").val($("#activeOverflow").text());
									//CSS FADE OUT
									$('#modalWindow').removeClass('show');
									$('#modalOverlay').removeClass('show');
									//SELF-REMOVE
									$('#modalWindow').on('webkitTransitionEnd',function(e) { 
										$("#modalWindow").remove();
										$("#modalOverlay").remove();
									});
									$("#appHeader").trigger(trim(touchstart));
									$("#entryBody").animate({ backgroundColor: "#ffff88" }, 1).animate({ backgroundColor: "rgba(255,255,255,0.36)"},1500);
								},preFillTimer);
							}
						});
						/////////////////////////////////////
						// END TAP FOOD-ENTRY EDIT (MODAL) //
						/////////////////////////////////////
						//var mi = "2";
						//ix     = -1;
						//meh    = "";
				//	}
					deh = duh;
				}
			});
		}); // END QUERY CONTEXT
	}}
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
			//$('#foodList').html('<span id="noMatches">no matches</span>');
			getRecentList();
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
	
	//#D90015  #0B7FFAapp blue > 0033CC & app red  > CC3300
/*
ios blue > 007EE5
add blue > 4B95DE
ios red  > F92E21 & ios blue > 0A60FF
*/
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
					$('#pageSlideFood').addClass("open");
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

