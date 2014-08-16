//##//////////////////##//
//## DYNAMIC HANDLERS ##//
//##//////////////////##//
$(document).on("pageload", function (evt) {
	// PREVENT++ //
	if ((evt.target.id) > 0) {
		var tgt = "#" + evt.target.id;
	} else {
		var tgt = "";
	}
	var entryReturn = false;
	//#///////////#//
	//# HOLD EDIT #//
	//#///////////#//
	var deMove = 0;
	var cancelEdit = 0;
	$("#entryList div" + tgt).on("longhold", function (evt) {
		if (!$("#entryList div" + tgt + " .entriesTitle").html()) {
			return;
		}
		if ($("#editableInput").is(":visible")) {
			return;
		}
		entryReturn = true;
		deKeyboard = 1;
		if (cancelEdit == 0) {
			getEntryEdit($(this).attr('id'));
		}
	});
	$("#entryList div, #appContent").on(touchmove + ' mouseleave mouseout mouseup ' + touchend, function (evt) {
		deMove++;
		if (deMove > 20 || (isMobile.Android() && deMove > 1)) {
			cancelEdit = 1;
		}
	});
	$("#appContent").scroll(function () {
		deKeyboard = 1;
		deMove++;
		//cancelEdit = 1;
	});
	//////////////////
	// FORCE RETURN //
	//////////////////
	$("#entryList div" + tgt).on(touchstart, function (evt) {
		if ($('#entryTime').is(':focus')) {
			entryReturn = true;
		}
		if ($('#entryBody').is(':focus')) {
			entryReturn = true;
		}
		deKeyboard = 0;
		deMove = 0;
		cancelEdit = 0;
	});
	$("#entryList div" + tgt).on(tap, function (event) {
		//$("#entryList div" + tgt).swipe({tap:function(event) {
		event.preventDefault();
		//////////////
		// TAP DATE //
		//////////////
		if (event.target.id.length == 14 && !$('#entryList div').is(':animated') && !$('.editableInput').is(':visible')) {
			$("#" + event.target.id).html(dtFormat(Number(event.target.id.replace("t", ""))));
			setTimeout(function () {
				$("#" + event.target.id).html(dateDiff(event.target.id.replace("t", ""), (new Date()).getTime()));
			}, 2000);
			entryReturn = true;
		}
		//////////////////
		// TAP DIV EDIT //
		//////////////////
		//no delete
		if (!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on(transitionend, function (e) {
				$('.active').removeClass('busy');
			});
			$('.active').removeClass('active');
			if ($('.delete').hasClass('busy')) {
				return;
			}
			if ($('#kcalsDiv').is(':visible')) {
				return;
			}
			if ($('#entryList div').is(':animated') || $('.editableInput').is(':visible') || $('#entryBody').is(':animated') || entryReturn == true || deKeyboard != 0 || blockModal == true) {
				entryReturn = false;
				return;
			}
			////////////////////////
			// START ENTRY UPDATE //
			////////////////////////
			if (!$('.editableInput').is(':visible')) {
				if (!$(this).has('input').length) {
					var value = trim($('.entriesBody', this).text());
					var kcals = $('.entriesTitle', this).html();
					var timedBlur = new Date().getTime();
					$('.entriesTitle', this).attr('id', 'kcalsDiv');
					var input = $('<input/>', {
							'type' : 'text',
							'id' : 'editableInput',
							'class' : 'editableInput',
							'value' : value,
							//ONCHANGE HANDLER
							blur : function () {
								////////////////
								// TIMED BLUR //
								////////////////
								var nowBlur = new Date().getTime();
								if (isMobile.Android() || isMobile.FirefoxOS()) {
									if (nowBlur - timedBlur < 600) {
										var blurVal = $("#editableInput").val();
										$("#editableInput").focus();
										//$("#editableInput").val('');
										setTimeout(function () {
											$("#editableInput").focus();
											//$("#editableInput").val(blurVal);
										}, 0);
										return;
									}
								}
								var new_value = $(this).val();
								//VALIDATE
								if (this.value == "") {
									if (Number(document.getElementById('kcalsDiv').innerHTML) > 0) {
										new_value = LANG.FOOD[lang];
									} else if (Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
										new_value = LANG.EXERCISE[lang];
									} else {
										new_value = "";
									}
								}
								$(this).replaceWith(new_value);
								$('#kcalsAdjust').remove();
								$('#kcalsDiv').parent("div").removeClass("editing");
								$('#kcalsDiv').parent("div").animate({
									"backgroundColor" : "#fff"
								}, 500, function (evt) {
									eP = 0;
									deKeyboard = (new Date()).getTime();
									return false;
								});
								$('#kcalsDiv').removeAttr('id');
								$("#sliderBlock").fadeOut(500);
								clearRepeaterBlock();
								//whitegap fix
								setTimeout(function () {
									updateEntriesSum();
								}, 0);
								kickDown();
								return false;
							},
							change : function () {
								//save changes
								var editableValue = $("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
								saveEntry({
									body : editableValue,
									id : $(this).closest('div').data("id")
								});
								//set blur
								if (!$("#entryList div").is(':animated')) {
									$("#editableInput").blur();
								}
							}
						});
					//start edit
					$('.entriesBody', this).empty();
					$('.entriesBody', this).html(input);
					$('.entriesBody', this).after('<p id="kcalsAdjust">\
						<span id="adjustNegBlock"><span id="adjustNeg"></span></span>\
						<span id="adjustPosBlock"><span id="adjustPos"></span></span>\
						</p>');
					$("#editableInput").focus();
					///////////////////////
					// RESET ENTRY VALUE //
					///////////////////////
					$("#kcalsDiv").off(touchstart);
					$("#kcalsDiv").on(touchstart, function (evt) {
						evt.preventDefault();
						timedBlur = new Date().getTime() - 6 * 1000;
						//no reset block
						if (!$(this).parent('div').hasClass("editing")) {
							return;
						}
						var thisRowId = $(this).closest('div').data("id");
						//INTOTHEVOID
						function intoTheVoid(button) {
							//ON CONFIRM
							timedBlur = new Date().getTime();
							if (button == 1) {
								$("#" + thisRowId + " " + ".entriesTitle").html("0");
								$("#" + thisRowId + " " + ".entriesTitle").css("color", "#333");
								//save
								saveEntry({
									title : '0',
									id : thisRowId
								});
								updateTimer();
							}
							return false;
						}
						//SHOW DIALOG
						appConfirm(LANG.RESET_ENTRY_TITLE[lang], LANG.ARE_YOU_SURE[lang], intoTheVoid, LANG.OK[lang], LANG.CANCEL[lang]);
						return false;
					});
					/////////////////////
					// POSITIVE ADJUST //
					/////////////////////
					var adjustPosBlockSave;
					$("#adjustPosBlock").on(touchstart, function (evt) {
						evt.preventDefault();
						//prevent android click-blur
						timedBlur = new Date().getTime();
						$(this).addClass("activeBlock");
						if (Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
							//first click 9999
							if (Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
								document.getElementById('kcalsDiv').innerHTML = -9975;
							} else {
								document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (1);
							}
							//limit 9999
							if (Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
								document.getElementById('kcalsDiv').innerHTML = 9999;
							}
							if (Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
								document.getElementById('kcalsDiv').style.color = '#333';
							}
							//save value
							var idVal = $('#kcalsDiv').parent('div').data("id");
							var titleVal = document.getElementById('kcalsDiv').innerHTML;
							var bodyVal = document.getElementById('editableInput').value;
							clearTimeout(adjustPosBlockSave);
							adjustPosBlockSave = setTimeout(function () {
									saveEntry({
										title : titleVal,
										body : bodyVal,
										id : idVal
									});
									updateTimer();
								}, 450);
						}
						return false;
					});
					/////////////////////
					// NEGATIVE ADJUST //
					/////////////////////
					var adjustNegBlockSave;
					$("#adjustNegBlock").on(touchstart, function (evt) {
						evt.preventDefault();
						//prevent android click-blur
						timedBlur = new Date().getTime();
						$(this).addClass("activeBlock");
						if (Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
							//first click 9999
							if (Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
								document.getElementById('kcalsDiv').innerHTML = 9975;
							} else {
								document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (1);
							}
							//limit 9999
							if (Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
								document.getElementById('kcalsDiv').innerHTML = -9999;
							}
							if (Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
								document.getElementById('kcalsDiv').style.color = '#C00';
							}
							//save value
							var idVal = $('#kcalsDiv').parent('div').data("id");
							var titleVal = document.getElementById('kcalsDiv').innerHTML;
							var bodyVal = document.getElementById('editableInput').value;
							clearTimeout(adjustNegBlockSave);
							adjustNegBlockSave = setTimeout(function () {
									saveEntry({
										title : titleVal,
										body : bodyVal,
										id : idVal
									});
									updateTimer();
								}, 450);
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
					$("#adjustPosBlock,#adjustNegBlock").on(touchend + " mouseout mouseup mouseleave", function (evt) {
						evt.preventDefault();
						$(".activeBlock").removeClass("activeBlock");
						clearRepeaterBlock();
					});
					//
					var pressTimerPos;
					var pressRepeatPos;
					$("#adjustPosBlock").on(touchend, function (evt) {
						evt.preventDefault();
						clearRepeaterBlock();
					});
					$("#adjustPosBlock").on(touchstart, function (evt) {
						evt.preventDefault();
						clearRepeaterBlock();
						pressTimerPos = setTimeout(function () {
								pressRepeatPos = setInterval(function () {
										//ACTION
										if (Number(document.getElementById('kcalsDiv').innerHTML) <= 9999) {
											//first click 9999
											if (Number(document.getElementById('kcalsDiv').innerHTML) == -9999) {
												document.getElementById('kcalsDiv').innerHTML = -9975;
											} else {
												document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) + (1);
											}
											//limit 9999
											if (Number(document.getElementById('kcalsDiv').innerHTML) >= 9999) {
												document.getElementById('kcalsDiv').innerHTML = 9999;
											}
											if (Number(document.getElementById('kcalsDiv').innerHTML) >= 0) {
												document.getElementById('kcalsDiv').style.color = '#333';
											}
											//save value
											var idVal = $('#kcalsDiv').parent('div').data("id");
											var titleVal = document.getElementById('kcalsDiv').innerHTML;
											var bodyVal = document.getElementById('editableInput').value;
											clearTimeout(adjustPosBlockSave);
											adjustPosBlockSave = setTimeout(function () {
													saveEntry({
														title : titleVal,
														body : bodyVal,
														id : idVal
													});
													updateTimer();
												}, 450);
										}
										return false;
									}, 25);
							}, 400);
					});
					///////////////////////
					// NEGATIVE REPEATER //
					///////////////////////
					var pressTimerNeg;
					var pressRepeatNeg;
					$("#adjustNegBlock").on(touchend, function (evt) {
						evt.preventDefault();
						clearRepeaterBlock();
					});
					$("#adjustNegBlock").on(touchstart, function (evt) {
						evt.preventDefault();
						clearRepeaterBlock();
						pressTimerNeg = setTimeout(function () {
								pressRepeatNeg = setInterval(function () {
										//ACTION
										if (Number(document.getElementById('kcalsDiv').innerHTML) >= -9999) {
											//first click 9999
											if (Number(document.getElementById('kcalsDiv').innerHTML) == 9999) {
												document.getElementById('kcalsDiv').innerHTML = 9975;
											} else {
												document.getElementById('kcalsDiv').innerHTML = Number(document.getElementById('kcalsDiv').innerHTML) - (1);
											}
											//limit 9999
											if (Number(document.getElementById('kcalsDiv').innerHTML) < -9999) {
												document.getElementById('kcalsDiv').innerHTML = -9999;
											}
											if (Number(document.getElementById('kcalsDiv').innerHTML) < 0) {
												document.getElementById('kcalsDiv').style.color = '#C00';
											}
											//save value
											var idVal = $('#kcalsDiv').parent('div').data("id");
											var titleVal = document.getElementById('kcalsDiv').innerHTML;
											var bodyVal = document.getElementById('editableInput').value;
											clearTimeout(adjustNegBlockSave);
											adjustNegBlockSave = setTimeout(function () {
													saveEntry({
														title : titleVal,
														body : bodyVal,
														id : idVal
													});
													updateTimer();
												}, 450);
										}
										return false;
									}, 25);
							}, 400);
					});
					//prevent empty list highlight
					if (!isNaN($(this).closest("div").attr("id"))) {
						var editableValue = $("#editableInput").val();
						if (editableValue == LANG.FOOD[lang] || editableValue == LANG.EXERCISE[lang]) {
							$("#editableInput").val('');
						}
						//remove double spaces
						$("#editableInput").val($("#editableInput").val().split("  ").join(" ").split("  ").join(" ").split("  ").join(" "));
						// FOCUS, THEN SET VALUE
						//$("#editableInput").select();
						$("#editableInput").focus();
						$(this).closest("div").animate({
							"backgroundColor" : "#ffffcc"
						}, 600);
						$(this).closest("div").addClass("editing");
						$("#sliderBlock").remove();
						$("#entryListForm").prepend("<div id='sliderBlock'></div>");
						//blur block
						$("#sliderBlock").on(touchstart, function (evt) {
							evt.preventDefault();
							evt.stopPropagation();
							if (!$("#entryList div").is(':animated')) {
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
	var swippen;
	$("#entryList div" + tgt).swipe({
		swipe : function (event, direction) {
			swippen = this;
			if (direction == 'left' || direction == 'right') {
				//HIDE ACTIVE
				if (!$('.delete').hasClass('busy')) {
					$('.active').addClass('busy');
					$('.active').removeClass('open');
					$('.active').on(transitionend, function (evt) {
						$('.active').removeClass('busy');
					});
					$('.active').removeClass('active');
				}
				//SHOW
				if (!$('#entryList div:animated').length > 0 && !$('.delete').hasClass('busy') && !$('.delete').hasClass('busy') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('.editableInput').is(':focus') && !$('#entryBody').is(':focus') && !$('#entryTime').is(':focus')) {
					$('.delete', swippen).addClass('busy');
					setTimeout(function () {
						$('.delete', swippen).addClass('active');
						$('.delete', swippen).addClass('open');
						$('.delete', swippen).on(transitionend, function (evt) {
							$('.delete').removeClass('busy');
						});
						//ffos
						setTimeout(function () {
							$('.delete').removeClass('busy');
						}, 200);
					}, 0);
				}
			}
		}
	});
	$("#entryList div").swipe("option", "threshold", 32);
	$("#entryList div").swipe("option", "allowPageScroll", "vertical");
	/////////////////////
	// STOP ENTRY EDIT //
	/////////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#entryList div,#entryListBottomBar").on(touchstart, function (evt) {
		if (!$('.editableInput').is(':visible')) {
			return;
		}
		if ($('.editableInput').is(':visible') && ($("#editableInput").is(":focus") || isMobile.Windows())) {
			//dismiss protection
			//if($("#entryList div" + tgt).is(':animated')) { return; }
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			evt.stopPropagation();
			//ID MATCH
			if (!$("#entryList div").is(':animated')) {
				if ($(this).attr("id") != $("#editableInput").closest("div").attr("id")) {
					$("#editableInput").blur();
					evt.preventDefault();
					evt.stopPropagation();
				}
			}
		}
	});
	//wrapper click
	$("#entryListWrapper").on(touchstart, function (evt) {
		if ($('.editableInput').is(':visible')) {
			//ALLOW ENTRY INPUT RETINA FOCUS
			//evt.preventDefault();
			//evt.stopPropagation();
		}

		if (evt.target.id == "entryListWrapper") {
			if (!$("#entryList div").is(':animated')) {
				$("#editableInput").blur();
				//rekeyboarding on entrywrapper tap dismiss
				if (isMobile.iOS()) {
					//evt.preventDefault();
					//evt.stopPropagation();
					$("#entryListForm").prepend("<div id='sliderBlock'></div>");
					$("#sliderBlock").fadeOut(700, function (evt) {
						$("#sliderBlock").remove();
					});
				}
				//whitegap mitigation
				if (isMobile.Android() && !$('.active').hasClass('open')) {
					return false;
				}
				//evt.preventDefault();
			}
		}
	});
	/////////////////
	// GLOBAL HIDE //
	/////////////////
	$("#appHeader,#entryListForm,#go,#sliderBlock,#editablediv,#entryListWrapper").on(tap + " swipeLeft swipeRight", function (evt) {
		if (!isMobile.Android()) {
			evt.preventDefault();
		}
		if (!$('.active').hasClass('busy')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on(transitionend, function (e) {
				$('.active').removeClass('busy');
			});
			$('.active').removeClass('active');
		}
	});
	//////////////
	// SPAN TAP //
	//////////////
	var delGesture = isMobile.FirefoxOS() ? touchend : tap;
	$('div span.delete', this).on(delGesture, function (evt) {
		//evt.preventDefault();
		$(this).parent('div').hide();
		//UPDATE DB
		deleteEntry({
			id : $(this).parent('div').data("id"),
			published : $(this).parent('div').attr("name")
		});
		//REMOVE CLICKED
		$(this).parent('div').remove();
		updateTimer();
		updateEntriesTime();
		updateEntriesSum();
		//SCROLLBAR UPDATE
		//clearTimeout(niceTimer);
		//niceTimer = setTimeout(niceResizer, 200);
		//IF LAST ROW
		if ($('#entryList .entryListRow').length == 0) {
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
			updateTimer();
			return false;
		}
		//force error
		//kickDown();
		clearTimeout(niceTimer);
		niceTimer = setTimeout(function () {
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
$(document).on("pageReload", function (evt) {
	evt.preventDefault();
	//PREVENT DOUBLE LOAD
	if($("#pageSlideFood").html()) {
		if($("#pageSlideFood").is(":animated")) {
			return;
		} else {
			$("#pageSlideFood").remove();
		}
	}
	//evt.stopPropagation();
	//not while editing ~
	if (!$('#entryList div').is(':animated') && !$('.editableInput').is(':visible') && !$('#editable').is(':visible') && !$('#appStatusFix').hasClass('open')) {
		//NO SWIPE OVERLAP
		if (!$('.active').hasClass('open')) {
			$('.active').addClass('busy');
			$('.active').removeClass('open');
			$('.active').on(transitionend, function (e) {
				$('.active').removeClass('busy');
			});
			$('.active').removeClass('active');
			if (!$('.delete').hasClass('busy')) {
				//hide
				if ($('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
					$('#pageSlideFood').addClass('busy');
					$('#pageSlideFood').on(transitionend, function (e) {
						$('#pageSlideFood').removeClass('busy');
						$("#foodSearch").blur();
					});
				} else {
					if (!$('#pageSlideFood').hasClass('busy')) {
						//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						// PAGESLIDEFOOD DIV //
						///////////////////////
						$('#pageSlideFood').remove();
						$('body').append("<div id='pageSlideFood'></div>");
						$('#pageSlideFood').css("height", (window.innerHeight - $('#appHeader').height()) + "px");
						$('#pageSlideFood').css("top", $('#appHeader').height() + "px");
						///////////////
						// CREATE DB //
						///////////////
						var pageSlideTimer;
						pageSlideTimer = setTimeout(function () {
								clearTimeout(pageSlideTimer);
								$('#pageSlideFood').on(transitionend, function (evt) {
									updateFoodDb();
									$("#appHeader").addClass("closer");
									$("body").addClass("closer");
									$('#pageSlideFood').off(transitionend);
								});
							}, 50);
						///////////////
						// FOOD HTML //
						///////////////
						$("#pageSlideFood").html('<div id="sideMenuFood"><input tabindex="-2" type="text" id="foodSearch" placeholder="' + LANG.FOOD_SEARCH[lang] + '" /><span id="iconClear"></span><span id="iconRefresh" class="icon-refresh"></span><div id="foodListWrapper"><div id="foodList"><span id="noMatches">' + LANG.NO_MATCHES[lang] + '</span></div></div></div>');
						//PRE-ADJUST RESULTS HEIGHT
						$('#foodSearch').width(window.innerWidth - 55);
						buildFoodMenu();
						//remember search type
						if (window.localStorage.getItem("searchType") == "exercise") {
							$("#foodSearch").attr('placeholder', LANG.EXERCISE_SEARCH[lang]);
							$("#foodSearch,#pageSlideFood").addClass("exerciseType");
						}
						////////////////////
						// RESULTS HEIGHT //
						////////////////////
						$('#menuTopBar').css("top", "61px");
						//$('#foodList').css("margin-top","61px");
						$('#foodList').css("min-height", (window.innerHeight - ($('#appHeader').height() + 61)) + "px");
						$('#foodList').css("height", (window.innerHeight - ($('#appHeader').height() + 61)) + "px");
						//$('#foodList').css("top",($('#appHeader').height()) + "px");
						setTimeout(function () {
							getNiceScroll("#foodList");
							$("body").trigger("resize");
						}, 300);
						//SCROLLBAR UPDATE
						clearTimeout(niceTimer);
						niceTimer = setTimeout(niceResizer, 200);
						/////////////
						// handler //
						/////////////
						$("#foodList").scroll(function () {
							//$("body").addClass("closer");
							blockModal = true;
							clearTimeout(modalTimer);
							modalTimer = setTimeout(function () {
									blockModal = false;
								}, 300);
						});
						//#/////////////////////////////////////#//
						//# KEYUP LISTENER SEARCH TIMER-LIMITER #//
						//#/////////////////////////////////////#//
						var timer;
						//$("#foodSearch").on("propertychange keyup input paste",function() {
						//$("#foodSearch").keyup(function() {
						var inputEvent = isMobile.Windows() ? 'keyup' : 'input';
						document.getElementById('foodSearch').addEventListener(inputEvent, function () {
							//CLEAR ICON
							if ($("#foodSearch").val().length == 0) {
								$('#iconClear').hide();
								$('#iconRefresh').show();
							} else {
								$('#iconRefresh').hide();
								$('#iconClear').show();
							}
							$('#iconClear').on(touchstart, function (evt) {
								clearTimeout(timer);
								$('#foodSearch').val('');
								$('#iconClear').hide();
								$('#iconRefresh').show();
								//buildFoodMenu();
								$("#searchContents .foodName").css("overflow", "hidden");
								$("#searchContents .foodName").hide();
								$('#searchContents').hide();
								$('#infoContents').show();
								$('#menuTopBar').show();
								return false;
							});
							//SET TIMER
							clearTimeout(timer);
							var ms = 200; //275;
							//faster desktop
							if (!isCordova) {
								ms = 50;
							}
							var val = this.value;
							//DO SEARCH
							timer = setTimeout(function () {
									doSearch($("#foodSearch").val());
									//CLEAR ICON
									if ($("#foodSearch").val().length == 0) {
										$('#iconClear').hide();
										$('#iconRefresh').show();
									} else {
										$('#iconRefresh').hide();
										$('#iconClear').show();
									}
								}, ms);
						});
						///////////////////
						// HIDE KEYBOARD //
						///////////////////
						$("#foodList").on(tap, function (evt) {
							evt.preventDefault();
							$("#entryBody").blur();
							$("#foodSearch").blur();
						});
						//////////////////////
						// SEARCH TYPE ICON //
						//////////////////////
						$('#iconRefresh').on(touchstart, function (evt) {
							//toggle -if not animated
							if (!$("#foodSearch").hasClass('busy')) {
								$("#foodSearch").toggleClass("exerciseType");
								$("#pageSlideFood").toggleClass("exerciseType");
								//enforce iconClear
								$('#searchContents').hide();
								$('#menuTopBar').show();
								$('#infoContents').show();
								//update placeholder n' animate
								if ($("#foodSearch").hasClass("exerciseType")) {
									window.localStorage.setItem("searchType", "exercise");
									$("#foodSearch").attr('placeholder', LANG.EXERCISE_SEARCH[lang]);
									$("#foodSearch").addClass('busy');
									$("#foodSearch").animate({
										backgroundColor : "#FECEC6"
									}, 1).animate({
										backgroundColor : "#fff"
									}, 600, function () {
										$("#foodSearch").removeClass('busy');
									});
								} else {
									window.localStorage.removeItem("searchType");
									$("#foodSearch").attr('placeholder', LANG.FOOD_SEARCH[lang]);
									$("#foodSearch").addClass('busy');
									$("#foodSearch").animate({
										backgroundColor : "#BBE4FF"
									}, 1).animate({
										backgroundColor : "#fff"
									}, 600, function () {
										$("#foodSearch").removeClass('busy');
									});
								}
							}
							return false;
						});
						/////////////////////////////////////////
						// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
						/////////////////////////////////////////
						$("#foodSearch").on(touchstart, function (evt) {
							$(".foodName").css("overflow", "hidden");
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
						if (window.localStorage.getItem("foodDbLoaded") != "done") {
							$('#pageSlideFood').addClass("open");
						}
						$('#loadingDiv').hide();
						$('#appHeader').addClass("open");
						$('#pageSlideFood').on(transitionend, function (e) {
							$('#pageSlideFood').removeClass('busy');
						});
					}
				}
			}
		}
	}
	//#//
}); //#//
//////#//
//#/////////////////#//
//# CORE SQL SEARCH #//
//#/////////////////#//
function searchFood(searchSQL, callback) {
	if (window.localStorage.getItem("searchType") == "exercise") {
		var typeTerm = 'exercise';
	} else {
		var typeTerm = 'food';
	}
	var dato = rowsFood;
	var keyJunk = 0;
	var keyScore = 0;
	var mi = [];
	var limited = 0;
	
	var results = 0;
	var z = dato.length;
	while(z--) {
	//for (var z = 0, len = dato.length; z < len; z++) {
		keyScore = 0;
		keyJunk = 0;
		if (((dato[z].type === "0000" || dato[z].type === "exercise") && typeTerm === "exercise") || ((dato[z].type !== "0000" && dato[z].type !== "exercise") && typeTerm === "food")) {
			var k = searchSQL.length;
			while(k--) {
			//for (var k = 0, lenn = searchSQL.length; k < lenn; k++) {
				if (dato[z].term.indexOf(searchSQL[k]) !== -1 && keyJunk == 0) {
					keyScore = keyScore + Math.abs(dato[z].term.match(searchSQL[k]).index);
				} else {
					keyJunk = 1;
				}
			}
			if (keyJunk === 0) {
				mi.push({
					id : keyScore,
					value : dato[z]
				});
			}
		}
	}
	//SORT
	mi = mi.sortbyattr('id');

	var mou = [];
	for (var u = 0, lenu = mi.length; u < 120; u++) {
		if (mi[u]) {
			mou.push(mi[u].value);
		}
	}
	callback(mou);
}
//#////////////////////////#//
//# SUB FUNCION: DO SEARCH #//
//#////////////////////////#//
function doSearch(rawInput) {
	//ignore null searches
	if (rawInput == 0) {
		rawInput = "00000000";
	}
	/////////////////
	// FETCH INPUT //
	/////////////////
	var timerStart = new Date().getTime();
	var lastSearch = window.localStorage.getItem("lastSearchTerm");
		//sanitize user input
		var searchQuery = trim(rawInput.split("~").join("").split("’").join("").split("”").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split(":").join("").split("/").join("").split("\\").join("").split("&").join("").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").toLowerCase());
		//partial sql syntax
		var searchSQL = searchQuery.split(" ");
		//prevent multiple identical searches
		window.localStorage.setItem("lastSearchTerm", searchQuery);
		//#/////////////////////#//
		//# BUILD KEYWORD ARRAY #//
		//#/////////////////////#//
		var keywordArray = [];
		searchArray = searchQuery;
		//check for multiple keywords
		if (searchQuery.search(' ') > -1) {
			searchQuery = searchQuery.split(" ");
			//loop each key into array
			for (i = 0; i < searchQuery.length; i++) {
				//not null
				if (searchQuery[i] != "") {
					//filter duplicates
					//if($.inArray(trim(searchQuery[i]), keywordArray )) {
					if (keywordArray.indexOf(trim(searchQuery[i])) == -1) {
						keywordArray.push(trim(searchQuery[i]));
					}
				}
			}
		} else {
			//single term array
			keywordArray.push(searchQuery);
		}
	///////////////////////////////////////////////////////////
	// PREVENT EMPTY STRING ON MULTIPLE KEYWORD SEARCH ARRAY //
	///////////////////////////////////////////////////////////
	if (keywordArray != "") {
		//#///////////////#//
		//# QUERY FOOD DB #//
		//#///////////////#//
		var foodList = '';
		var countMatch = 0;
		//ADJUST SEARCH TYPE
		if (window.localStorage.getItem("searchType") == "exercise") {
			//get current weight
			if (!window.localStorage.getItem("calcForm#pA3B")) {
				var totalWeight = 80;
			} else {
				var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
			}
			//convert to kg
			if (window.localStorage.getItem("calcForm#pA3C") == "pounds") {
				var totalWeight = Math.round((totalWeight) / (2.2));
			}
			//TYPES
			var searchType = 'exercise';
		} else {
			var searchType = 'food';
		}
		///////////////////
		// EXECUTE QUERY //
		///////////////////
		searchFood(searchSQL, function (data) {
			// LOOP RESULTS //
			for (var s = 0, len = data.length; s < len; s++) {
				//total results
				//organize relevant columuns
				var id = data[s].id;
				var type = data[s].type;
				var code = data[s].code;
				var name = data[s].name;
				var term = data[s].term;
				var kcal = Math.round(data[s].kcal * 100) / 100;
				var pro = Math.round(data[s].pro * 100) / 100;
				var car = Math.round(data[s].car * 100) / 100;
				var fat = Math.round(data[s].fat * 100) / 100;
				var fib = 0;
				// SEARCH TYPE //
				var typeClass;
				var favClass = (data[s].fib == "fav") ? 'favItem' : '';
				if (searchType == "exercise") {
					typeClass = " hidden";
					//calculate weight proportion
					kcalBase = kcal;
					kcal = Math.round(((kcal * totalWeight) / 60) * 30);
				} else {
					typeClass = "";
					kcalBase = kcal;
				}
				//html
				var foodLine = "<div class='searcheable " + favClass + "' id='" + code + "' title='" + kcalBase + "'><div class='foodName'>" + name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + kcal + "</span><span class='foodPro " + typeClass + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + pro + "</span><span class='foodCar " + typeClass + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>" + car + "</span><span class='foodFat " + typeClass + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>" + fat + "</span></div>";
				//result list
				foodList += foodLine;
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
			if (foodList == "") {
				if ($("#foodSearch").val() != "") {
					$("#searchContents").html('<span id="noMatches"> ' + LANG.NO_MATCHES[lang] + ' </span>');
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
			setTimeout(niceResizer, 200);
			//enforce clearIcon display
			if ($("#foodSearch").val().length != 0) {
				$('#iconRefresh').hide();
				$('#iconClear').show();
			} else {
				$('#iconRefresh').show();
				$('#iconClear').hide();
			}
			////////////////////////
			// OVERFLOW ON-DEMAND //
			////////////////////////
			$(".searcheable").on(tap + ' ' + touchstart, function (evt) {
				if (blockModal == true) {
					return;
				}
				if ($("#addNewWrapper").html()) {
					return;
				}
				if ($("#foodSearch").is(":focus") && !isDesktop()) {
					//evt.preventDefault();
					//return;
				}
				$("#activeOverflow").removeAttr("id");
				$(".activeOverflow").removeClass("activeOverflow");
				$(this).addClass("activeOverflow");
				$(".foodName", this).attr("id", "activeOverflow");
				$(".foodName").css("overflow", "auto");
			});
			/////////////////////////////////
			// TAP FOOD-ENTRY EDIT (MODAL) //
			/////////////////////////////////
			$("#searchContents div.searcheable").on(singletap, function (event) {
				event.preventDefault();
				if (blockModal == true) {
					return;
				}
				getModalWindow($(this).attr("id"));
			});
		});//END QUERY CONTEXT
	}
}
//#//////////////////////#//
//#  UPDATE CUSTOM LIST  #//
//#//////////////////////#//
function updateCustomList(filter, callback) {
	getCustomList(filter, function (data) {
		// LOOP RESULTS //
		var customFavList = "";
		var customFavSql = "";
		var favSql;
		var favLine;
		var favLastId = '';
		var c = len = data.length;
		data = data.reverse();
		while(c--) {
		//for (var c = 0, len = data.length; c < len; c++) {
			//get current weight//
			if (!window.localStorage.getItem("calcForm#pA3B")) {
				var totalWeight = 80;
			} else {

				var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
			}
			//convert to kg
			if (window.localStorage.getItem("calcForm#pA3C") == "pounds") {
				var totalWeight = Math.round((totalWeight) / (2.2));
			}
			//ADJUST TO EXERCISE
			if (data[c].type == "0000" || data[c].type == "exercise") {
				var cKcal = Math.round(((data[c].kcal * totalWeight) / 60) * 30);
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
			var id = data[c].id;
			var type = data[c].type;
			var code = data[c].code;
			var name = sanitizeSql(data[c].name);
			var term = data[c].term;
			var kcal = data[c].kcal;
			var pro = data[c].pro;
			var car = data[c].car;
			var fat = data[c].fat;
			var fib = data[c].fib;

			if (!name) {
				name = '0.00';
			}
			if (!kcal) {
				kcal = '0.00';
			}
			if (!pro) {
				pro = '0.00';
			}
			if (!car) {
				car = '0.00';
			}
			if (!fat) {
				fat = '0.00';
			}
			if (!fib) {
				fib = '0.00';
			}

			type = (type == '0000' || type == 'exercise') ? 'exercise' : 'food';
			var favClass = (data[c].fib == "fav") ? 'favItem' : '';

			fib = fib.split("diary_food").join("");

			if (!hasSql && !id) {
				id = data[c].ID;
				if (!data[c].ID) {
					id = 'null';
				}
			}
			///////////////////////////
			if (id && favLastId != id) {
				favSql = "INSERT OR REPLACE INTO \"diary_food\" VALUES(" + id + ",'" + type + "','" + code + "','" + name + "','" + term + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n";
				customFavSql += favSql;
				favSql = '';
				favLine = "<div class='searcheable " + favClass + " " + type + "' id='" + code + "' title='" + cKcal + "'><div class='foodName " + type + "'>" + name + "</div><span class='foodKcal'><span class='preSpan'>" + LANG.KCAL[lang] + "</span>" + cKcal + "</span><span class='foodPro " + type + "'><span class='preSpan'>" + LANG.PRO[lang] + "</span>" + cPro + "</span><span class='foodCar " + type + "'><span class='preSpan'>" + LANG.CAR[lang] + "</span>" + cCar + "</span><span class='foodFat " + type + "'><span class='preSpan'>" + LANG.FAT[lang] + "</span>" + cFat + "</span></div>";
				customFavList += favLine;
				favLine = ''
					favLastId = id;
			}
		}
		var sqlKey = (filter == "fav") ? 'customFavSql' : 'customItemsSql';
		if (customFavList == "") {
			customFavList += '<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>';
		}
		if (customFavSql != "") {
			window.localStorage.setItem(sqlKey, customFavSql.split('undefined').join(''));
		} else {
			window.localStorage.setItem(sqlKey, " ");
		}
		//////////
		// HTML //
		//////////
		var menuBlock = (filter == "fav") ? '#tabMyFavsBlock' : '#tabMyItemsBlock';
		//////////
		// HTML //
		//////////
		if (filter != "fav") {
			customFavList += '<div id="addNewFood">' + LANG.NEW_FOOD[lang] + '</div><div id="addNewExercise">' + LANG.NEW_EXERCISE[lang] + '</div>';
		}
		$(menuBlock).css("min-height", ($('#foodList').height() - 128) + "px");
		$(menuBlock).html(customFavList);
		/////////////
		// ACTIONS //
		/////////////
		$("#addNewFood").on(touchstart, function (evt) {
			addNewItem({
				type : "food",
				act : "insert"
			});
		});
		$("#addNewExercise").on(touchstart, function (evt) {
			addNewItem({
				type : "exercise",
				act : "insert"
			});
		});
		//////////////
		// HANDLERS //
		//////////////
		$(menuBlock + " div.searcheable").on(singletap, function (evt) {
			evt.preventDefault();
			if (blockModal == true) {
				return;
			}
			getModalWindow($(this).attr("id"));
		});
		$(menuBlock + " div.searcheable").on(tap, function (evt) {
			if ($("#foodSearch").is(":focus")) {
				//$("#foodSearch").blur();
				//window.scroll($('#appContent')[0].scrollTop,0,0);
				//return false;
			}
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
			$(this).addClass("activeOverflow");
			$(".foodName", this).attr("id", "activeOverflow");
			$(".foodName").css("overflow", "auto");
		});
		/////////////////////////////////////////
		// FOODSEARCH (QUICKFOCUS) SETOVERFLOW //
		/////////////////////////////////////////
		$(menuBlock + " #foodSearch").on(touchstart, function (evt) {
			if (blockModal == true) {
				return;
			}
			$(".foodName").css("overflow", "hidden");
			$("#activeOverflow").removeAttr("id");
			$(".activeOverflow").removeClass("activeOverflow");
		});
		///////////////////
		// CALLBACK OPEN //
		///////////////////
		if (callback == "open" && window.localStorage.getItem("lastInfoTab") !== "topBarItem-1") {
			setTimeout(function() {
				callbackOpen();
			},0);
		}
	});
}
//##/////////////////////////////##//
//##    CORE: BUILD FOOD LAYER   ##//
//##/////////////////////////////##//
function buildFoodMenu() {
	var recentBlock = '\
		<div id="infoContents" class="infoContents">\
		<div id="tabMyCats">\
		<div id="tabMyCatsBlock"></div>\
		</div>\
		<div id="tabMyFavs">\
		<div id="tabMyFavsBlock"></div>\
		</div>\
		<div id="tabMyItems">\
		<div id="tabMyItemsBlock"></div>\
		</div>\
		</div>\
		<div id="searchContents"></div>';
	//////////////
	// TOP MENU //
	//////////////
	$("#foodList").before("<div id='menuTopBar'>\
		<h3 id='topBarItem-1'><span>" + LANG.CATEGORIES[lang] + "</span></h3>\
		<h3 id='topBarItem-2'><span>" + LANG.FAVORITES[lang] + "</span></h3>\
		<h3 id='topBarItem-3'><span>" + LANG.MY_ITEMS[lang] + "</span></h3>\
		</div>\
		");
	$("#foodList").html(recentBlock);
	//first load db spinner
	if (window.localStorage.getItem("foodDbLoaded") != "done") {
		//reset blocks
		$("#tabMyCatsBlock,#tabMyFavsBlock,#tabMyItemsBlock").html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		$("#addNewFood").remove();
		$("#addNewExercise").remove();
		$("#tabMyItemsBlock").after('<div id="addNewFood">' + LANG.NEW_FOOD[lang] + '</div><div id="addNewExercise">' + LANG.NEW_EXERCISE[lang] + '</div>');
		$('#tabMyItemsBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		//////////////
		// HANDLERS //
		//////////////
		$("#addNewFood").on(touchstart, function (evt) {
			addNewItem({
				type : "food",
				act : "insert"
			});
		});
		$("#addNewExercise").on(touchstart, function (evt) {
			addNewItem({
				type : "exercise",
				act : "insert"
			});
		});
	} else {
		////////////////////
		// CUSTOM FAV SQL //
		////////////////////
		var tabTimer1 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-1") ? 100 : 200;
		var tabTimer2 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-2") ? 100 : 200;
		var tabTimer3 = (window.localStorage.getItem("lastInfoTab") == "topBarItem-3") ? 100 : 200;
		setTimeout(function () {
			getCatList('open');
		}, tabTimer1);
		setTimeout(function () {
			updateCustomList('fav', 'open');
		}, tabTimer2);
		setTimeout(function () {
			updateCustomList('items', 'open');
		}, tabTimer3);
	}
	/////////////////////
	// FIRST LOAD TABS //
	/////////////////////
	if (!window.localStorage.getItem("lastInfoTab")) {
		window.localStorage.setItem("lastInfoTab", "topBarItem-1");
	}
	////////////
	// TAB #1 //
	////////////
	if (window.localStorage.getItem("lastInfoTab") == "topBarItem-1") {
		$("#tabMyCats, #topBarItem-1").addClass("onFocus");
	}
	////////////
	// TAB #2 //
	////////////
	if (window.localStorage.getItem("lastInfoTab") == "topBarItem-2") {
		$("#tabMyFavs, #topBarItem-2").addClass("onFocus");
	}
	////////////
	// TAB #3 //
	////////////
	if (window.localStorage.getItem("lastInfoTab") == "topBarItem-3") {
		$("#tabMyItems, #topBarItem-3").addClass("onFocus");
	}
	////////////////////////
	// SWITCH VISIBLE TAB //
	////////////////////////
	$("#menuTopBar h3").on(touchstart, function (evt) {
		evt.preventDefault();
		$('#foodList').scrollTop(0);
		window.localStorage.setItem("lastInfoTab", $(this).attr("id"));
		//$(".onFocus").removeClass("onFocus");
		$("#activeOverflow").removeAttr("id");
		$(".activeOverflow").removeClass("activeOverflow");
		$("#foodList .foodName").css("overflow", "hidden");
		////////////
		// TAB #1 //
		////////////
		if (window.localStorage.getItem("lastInfoTab") == "topBarItem-1") {
			$("#topBarItem-2,#topBarItem-3,#tabMyFavs,#tabMyItems").removeClass("onFocus");
			$("#topBarItem-1,#tabMyCats").addClass("onFocus");
		}
		////////////
		// TAB #2 //
		////////////
		else if (window.localStorage.getItem("lastInfoTab") == "topBarItem-2") {
			$("#topBarItem-1,#topBarItem-3,#tabMyCats,#tabMyItems").removeClass("onFocus");
			$("#topBarItem-2,#tabMyFavs").addClass("onFocus");
		}
		////////////
		// TAB #3 //
		////////////
		else if (window.localStorage.getItem("lastInfoTab") == "topBarItem-3") {
			$("#topBarItem-1,#topBarItem-2,#tabMyCats,#tabMyFavs").removeClass("onFocus");
			$("#topBarItem-3,#tabMyItems").addClass("onFocus");
		}
		clearTimeout(niceTimer);
		niceTimer = setTimeout(function () {
				niceResizer();
				return false;
			}, 0);
		return false;
	});
	/////////////
	// ACTIONS //
	/////////////
	$(".searcheable").off(tap);
	$(".searcheable").on(tap + ' ' + touchstart, function (evt) {
		$("#activeOverflow").removeAttr("id");
		$(this).addClass("activeOverflow");
		$(".foodName", this).attr("id", "activeOverflow");
		$(".foodName").css("overflow", "auto");
	});
}
//##//////////////////////////##//
//##    CORE: ADD NEW ITEM    ##//
//##//////////////////////////##//
function addNewItem(opt) {
	///////////////
	// HTML FORM //
	///////////////
	$("#tempHolder,#modalWindow,#addNewWrapper").remove();
	//$("#modalWindow").remove();

	if (!$("#modalOverlay").html()) {
		var modalOverlay = '<div id="modalOverlay"></div>';
	} else {
		$("#modalOverlay").off();
		var modalOverlay = '';
	}

	if (!$("#tempHolder").html()) {
		$("body").addClass("overlay");
		$("body").append('\
			<div id="tempHolder">\
			' + modalOverlay + '\
			<div id="addNewWrapper">\
			<ul id="addNewList">\
			<li id="addNewName">   <label>' + LANG.ADD_NAME[lang] + '</label>                          <input tabindex="3" type="text"   id="inputNewName"                /></li>\
			<li id="addNewAmount"><label>' + LANG.ADD_AMOUNT[lang] + ' (' + LANG.G[lang] + ')</label>  <input tabindex="3" type="number" id="inputNewAmount"  value="100" /></li>\
			<li id="addNewKcal">   <label>' + LANG.KCAL[lang] + '</label>                              <input tabindex="3" type="number" id="inputNewKcal"    value="0"   /></li>\
			<li id="addNewPro">    <label>' + LANG.PRO[lang] + '</label>                               <input tabindex="3" type="number" id="inputNewPro"     value="0"   /></li>\
			<li id="addNewCar">    <label>' + LANG.CAR[lang] + '</label>                               <input tabindex="3" type="number" id="inputNewCar"     value="0"   /></li>\
			<li id="addNewFat">    <label>' + LANG.FAT[lang] + '</label>                               <input tabindex="3" type="number" id="inputNewFat"     value="0"   /></li>\
			</ul>\
			<div id="addNewCancel">' + LANG.CANCEL[lang] + '</div>\
			<div id="addNewConfirm">' + LANG.SAVE[lang] + '</div>\
			</div>\
			</div>\
			');
	}
	////////////////
	// IF EDITING //
	////////////////
	if (opt) {
		if (opt.act == "insert") {
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
	if (vAct == "update") {
		$("#inputNewName").val(opt.name);
		$("#inputNewKcal").val(Math.round(opt.kcal))
		$("#inputNewPro").val(opt.pro);
		$("#inputNewCar").val(opt.car);
		$("#inputNewFat").val(opt.fat);
	}
	/////////////////////////////
	// ADJUST FORM TO EXERCISE //
	/////////////////////////////
	if (opt.type == "0000" || opt.type == "exercise") {
		//get current weight
		if (!window.localStorage.getItem("calcForm#pA3B")) {
			var totalWeight = 80;
		} else {
			var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
		}
		//convert to kg
		if (window.localStorage.getItem("calcForm#pA3C") == "pounds") {
			var totalWeight = Math.round((totalWeight) / (2.2));
		}
		$("#addNewAmount label").html(LANG.ADD_DURATION[lang] + ' (' + LANG.MIN[lang] + ')');
		$("#inputNewAmount").val(30);
		$("#addNewPro").hide();
		$("#addNewCar").hide();
		$("#addNewFat").hide();

		if (vAct == "update") {
			$("#inputNewKcal").val(Math.round(((opt.kcal * totalWeight) / 60) * $("#inputNewAmount").val()));
		}
	}
	//
	$("ul#addNewList input").width(window.innerWidth - 180);
	$("#modalOverlay,#addNewWrapper").hide();
	$("#addNewWrapper").fadeIn(200);
	$("body").addClass("overlay");
	$("#modalOverlay").fadeIn(0);
	$('#modalOverlay,#addNewWrapper').addClass('show');
	///////////////////////////////////////////
	// android input blur blank viewport bug //
	///////////////////////////////////////////
	if (isMobile.Android()) {
		//preset wrapper min-height
		$("#addNewWrapper").css("min-height", $("#addNewWrapper").height() + "px");
		//trigger on touchmove if not focused (closing-touch white gap)
		$("#addNewWrapper").on("touchmove", function (evt) {
			if (!$("#addNewWrapper input").is(":focus")) {
				$(window).trigger("orientationchange");
			}
		});
		//trigger if not focused to another input
		var newBlurGap;
		$("#addNewWrapper input").on("blur", function (evt) {
			newBlurGap = setTimeout(function () {
					$(window).trigger("orientationchange");
				}, 100);
		});
		$("#addNewWrapper input").on("focus", function (evt) {
			clearTimeout(newBlurGap);
		});
	}
	///////////////////////////
	// autohide keyboard tap //
	///////////////////////////
	$("#addNewWrapper").on(touchstart, function (evt) {
		if (evt.target.id == "addNewWrapper" || evt.target.id == "") {
			evt.preventDefault();
			evt.stopPropagation();
			$("#addNewWrapper input").trigger("blur");
		}
	});
	/////////////////////
	// AUTO EMPTY IF 0 //
	/////////////////////
	$('#addNewWrapper input[type="number"]').on("focus", function (evt) {
		if ($(this).val() == 0) {
			$(this).val('');
		}
	});
	$('#addNewWrapper input[type="number"]').on("blur", function (evt) {
		if ($(this).val() == '') {
			$(this).val('0');
		}
	});
	////////////////
	// VALIDATION //
	////////////////
	$('#addNewWrapper input[type="number"]').attr("maxlength", "8");
	var defaultInputAddNew = "keypress";
	if (androidVersion() == 4.1 || isMobile.Windows()) {
		defaultInputAddNew = "keydown";
	}
	$('#addNewWrapper input[type="number"]').on(defaultInputAddNew, function (evt) {
		if ((evt.which || evt.keyCode) == 8) {
			return true;
		}
		//max
		if ($(this).val().length > 7 || $(this).val() > 9999 && isNumberKey(evt)) {
			$(this).val($(this).val().slice(0, -1));
		}
		//num only
		return isNumberKey(evt);
	});
	//#/////////////#//
	//# CONFIRM ADD #//
	//#/////////////#//
	var lockAdd = 0;
	$("#addNewConfirm").off().on(touchstart, function (evt) {
		if (lockAdd == 0) {
			lockAdd++;
			// INSERT NEW ? UPDATE EXISTING
			if (vAct == "insert") {
				var vType = opt.type;
				var vCode = "c" + (new Date()).getTime();
				var vFib = "custom";
			} else {
				var vType = opt.type;
				var vCode = opt.code;
				var vFib = opt.fib;
			}
			// (RE)BUILD FROM FIELD VALUES //
			var vName = $("#inputNewName").val();
			var vTerm = sanitize($("#inputNewName").val());
			var vKcal = $("#inputNewKcal").val();
			var vPro = $("#inputNewPro").val();
			var vCar = $("#inputNewCar").val();
			var vFat = $("#inputNewFat").val();
			//revert input to formula
			if (vType == "exercise" || vType == "0000") {
				vKcal = Math.round(((($("#inputNewKcal").val() / totalWeight) / $("#inputNewAmount").val()) * 60) * 100) / 100;
			}
			///////////////////////
			// VALIDATE ADD FORM //
			///////////////////////
			//clear previous
			$("label").removeClass("error");
			var doReturn = 0;
			var setFoodtimer;
			if (vName == "" || vName == 0) {
				$("#addNewName label").addClass("error");
				doReturn = 1;
			}
			if (vKcal == "" || vKcal == 0 || isNaN(vKcal)) {
				$("#addNewKcal label").addClass("error");
				doReturn = 1;
			}
			if ($("#inputNewAmount").val() == "" || $("#inputNewAmount").val() == 0 || isNaN($("#inputNewAmount").val())) {
				$("#addNewAmount label").addClass("error");
				doReturn = 1;
			}
			//parts > sum
			if (parseFloat($("#inputNewPro").val()) + parseFloat($("#inputNewCar").val()) + parseFloat($("#inputNewFat").val()) > parseFloat($("#inputNewAmount").val())) {
				$("#addNewAmount label").addClass("error");
				$("#addNewPro label").addClass("error");
				$("#addNewCar label").addClass("error");
				$("#addNewFat label").addClass("error");
				doReturn = 1;
			}
			/////////////////////
			// RETURN ON ERROR //
			/////////////////////
			if (doReturn == 1) {
				lockAdd = 0;
				//info dialog
				if (hasTouch()) {
					navigator.notification.alert(LANG.BLANK_FIELD_DIALOG[lang], voidThis, LANG.BLANK_FIELD_TITLE[lang], LANG.OK[lang]);
				} else {
					if (alert(LANG.BLANK_FIELD_TITLE[lang] + "\n" + LANG.BLANK_FIELD_DIALOG[lang]));
				}
				return false;
			}
			// IF NULL/EMPTY, JUST REVERT TO 0
			if (vPro == "" || isNaN(vPro)) {
				vPro = 0;
			}
			if (vCar == "" || isNaN(vCar)) {
				vCar = 0;
			}
			if (vFat == "" || isNaN(vFat)) {
				vFat = 0;
			}
			//revert to 100g
			if (vType == "food") {
				vKcal = Math.round((vKcal / $("#inputNewAmount").val()) * 100 * 100) / 100;
				vPro = Math.round((vPro / $("#inputNewAmount").val()) * 100 * 100) / 100;
				vCar = Math.round((vCar / $("#inputNewAmount").val()) * 100 * 100) / 100;
				vFat = Math.round((vFat / $("#inputNewAmount").val()) * 100 * 100) / 100;
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
			clearTimeout(setFoodtimer);
			setFoodtimer = setTimeout(function () {
					setFood({
						type : vType,
						code : vCode,
						name : vName,
						term : vTerm,
						kcal : vKcal,
						pro : vPro,
						car : vCar,
						fat : vFat,
						fib : vFib,
						act : vAct
					}, function () {
						//clearTimeout(setFoodtimer);
						/////////////////////////
						// UPDATE HTML CONTENT //
						/////////////////////////
						if (vAct == "update") {
							if (vType == "exercise" || vType == "0000") {
								vKcal = Math.round(((vKcal * totalWeight) / 60) * 30);
							}
							//if also favorite, double check
							$(".activeOverflow .foodName").html(vName);
							$(".activeOverflow .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
							$(".activeOverflow .foodPro").html('<span class="preSpan">' + LANG.PRO[lang] + '</span>' + vPro + '</span>');
							$(".activeOverflow .foodCar").html('<span class="preSpan">' + LANG.CAR[lang] + '</span>' + vCar + '</span>');
							$(".activeOverflow .foodFat").html('<span class="preSpan">' + LANG.FAT[lang] + '</span>' + vFat + '</span>');
							//id update
							$("#" + vCode + " .foodName").html(vName);
							$("#" + vCode + " .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
							$("#" + vCode + " .foodPro").html('<span class="preSpan">' + LANG.PRO[lang] + '</span>' + vPro + '</span>');
							$("#" + vCode + " .foodCar").html('<span class="preSpan">' + LANG.CAR[lang] + '</span>' + vCar + '</span>');
							$("#" + vCode + " .foodFat").html('<span class="preSpan">' + LANG.FAT[lang] + '</span>' + vFat + '</span>');
							//id update
							$("#tabMyFavsBlock #" + vCode + " .foodName").html(vName);
							$("#tabMyFavsBlock #" + vCode + " .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
							$("#tabMyFavsBlock #" + vCode + " .foodPro").html('<span class="preSpan">' + LANG.PRO[lang] + '</span>' + vPro + '</span>');
							$("#tabMyFavsBlock #" + vCode + " .foodCar").html('<span class="preSpan">' + LANG.CAR[lang] + '</span>' + vCar + '</span>');
							$("#tabMyFavsBlock #" + vCode + " .foodFat").html('<span class="preSpan">' + LANG.FAT[lang] + '</span>' + vFat + '</span>');
							//id update
							$("#tabMyItemsBlock #" + vCode + " .foodName").html(vName);
							$("#tabMyItemsBlock #" + vCode + " .foodKcal").html('<span class="preSpan">' + LANG.KCAL[lang] + '</span>' + vKcal + '</span>');
							$("#tabMyItemsBlock #" + vCode + " .foodPro").html('<span class="preSpan">' + LANG.PRO[lang] + '</span>' + vPro + '</span>');
							$("#tabMyItemsBlock #" + vCode + " .foodCar").html('<span class="preSpan">' + LANG.CAR[lang] + '</span>' + vCar + '</span>');
							$("#tabMyItemsBlock #" + vCode + " .foodFat").html('<span class="preSpan">' + LANG.FAT[lang] + '</span>' + vFat + '</span>');
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
							var yellowFade = setTimeout(function () {
									//$("#" + vCode).addClass('fade');
									//$("#" + vCode).addClass('trans');
									$("#activeOverflow").parent('div').addClass('fade');
									$("#activeOverflow").parent('div').addClass('trans');
								}, 0);
							//SELF-REMOVE
							//$('#modalOverlay').on(transitionend,function(e) {
							$("#addNewCancel").trigger(touchstart);
							//});
							//$("#" + vCode).animate({"backgroundColor": "#ffffcc"},600);
							//return false;
						} else {
							/////////////////////
							// INSERT NEW ITEM //
							/////////////////////
							if (opt.fib == "fav") {
								updateCustomList('fav');
							} else {
								updateCustomList('items');
							}
							//highight new item
							var yellowFade = setTimeout(function () {
									//CSS FADE OUT
									//$('#addNewWrapper').removeClass('show');
									//$('#modalOverlay').removeClass('show');
									$(".searcheable").removeClass('fade');
									//CSS HIGHLIGHT
									$(".activeOverflow").removeClass("activeOverflow");
									$(".searcheable").removeClass('yellow');
									$(".searcheable").removeClass('trans');

									if (vAct == "update") {
										$("#activeOverflow").parent('div').addClass('yellow');
									} else {
										$("#" + vCode).addClass('yellow');
									}
									var yellowFade = setTimeout(function () {
											if (vAct == "update") {
												$("#activeOverflow").parent('div').addClass('fade');
												$("#activeOverflow").parent('div').addClass('trans');
											} else {
												$("#" + vCode).addClass('fade');
												$("#" + vCode).addClass('trans');
											}
										}, 0);
									$("#addNewCancel").trigger(touchstart);
								}, 600);
						}
					});
				}, 300);
		}
	});
	//#////////////#//
	//# CANCEL ADD #//
	//#////////////#//
	//timed cancel (animation) ~ plus foodsearch propagation fix
	setTimeout(function () {
		$("#modalOverlay").off();
		$("#addNewCancel").on(touchstart, function (evt) {
			//$("#addNewCancel,#modalOverlay").on(touchstart, function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			//first tap blur, if focused
			if (evt.target.id == "modalOverlay" && $("#addNewWrapper input").is(":focus")) {
				$("#addNewWrapper input").trigger("blur");
				return false;
			}
			if (isMobile.Android()) {
				kickDown();
			}
			if ($("#tempHolder").html()) {
				$('#addNewWrapper').removeClass('show');
				$('#modalOverlay').removeClass('show');
				$('#modalOverlay').on(transitionend, function () {
					$("#tempHolder").remove();
					$("#modalOverlay,#addNewWrapper").remove();
					$("body").removeClass("overlay");
				});
			}
		});
	}, 200);
}
//#////////////////////#//
//#    MODAL WINDOW    #//
//#////////////////////#//
var pressTimerModalNeg;
var pressTimerModalPos;
var pressRepeatModalNeg;
var pressRepeatModalPos;
function getModalWindow(itemId) {
	if (!itemId) {
		return;
	}
	if ($("#addNewWrapper").html()) {
		return;
	}
	////////////////////
	// RESET REPEATER //
	////////////////////
	clearTimeout(pressTimerModalNeg);
	clearTimeout(pressTimerModalPos);
	clearInterval(pressRepeatModalNeg);
	clearInterval(pressRepeatModalPos);
	///////////
	// QUERY //
	///////////
	getFood(itemId, function (data) {
		var mName = data.name;
		var mType = data.type;
		var mCode = data.code;
		var mTerm = data.term;
		var mKcal = Math.round(data.kcal * 100) / 100;
		var mPro = Math.round(data.pro * 100) / 100;
		var mCar = Math.round(data.car * 100) / 100;
		var mFat = Math.round(data.fat * 100) / 100;
		var mFib = data.fib;
		////////////////////////
		// DEFINE TYPE/WEIGHT //
		////////////////////////
		var searchType = (mType != "0000" && mType != "exercise") ? 'food' : 'exercise';
		var totalWeight = Number(window.localStorage.getItem("calcForm#pA3B"));
		//revert lb to kg
		if (window.localStorage.getItem("calcForm#pA3C") == "pounds") {
			totalWeight = Math.round((totalWeight) / (2.2));
		}
		var initTime = new Date().getTime();
		////////////////////////
		// FOODLIST MODAL-TAP //
		////////////////////////
		//prevent flood
		$("#tempHolder,#modalWindow,#modalOverlay,#addNewWrapper").remove();
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
		if (searchType == "food") {
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

		//////////////////
		// GETNUTRIDATA //
		//////////////////
		function getNutriData() {
			if (searchType == "food") {
				var kcalsPro = mPro;
				var kcalsCar = mCar;
				var kcalsFat = mFat;
				var kcalsTotalPro = (Math.round((((Number(kcalsPro)) / 100) * Number(document.getElementById('modalAmount').innerHTML) * 100)) / (100));
				var kcalsTotalCar = (Math.round((((Number(kcalsCar)) / 100) * Number(document.getElementById('modalAmount').innerHTML) * 100)) / (100));
				var kcalsTotalFat = (Math.round((((Number(kcalsFat)) / 100) * Number(document.getElementById('modalAmount').innerHTML) * 100)) / (100));
				var proData = kcalsTotalPro.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
				var carData = kcalsTotalCar.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
				var fatData = kcalsTotalFat.toFixed(1) + "<span>" + LANG.G[lang] + "</span>";
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
			if (searchType == "food") {
				if ($("#modalAmount").html() < 750 && Math.round(((kcalsBase) / 100) * (Number(document.getElementById('modalAmount').innerHTML) + 5)) <= 9999) {
					$("#modalAmount").html(Number($("#modalAmount").html()) + (5));
					$("#modalTotal").html(Math.round(((kcalsBase) / 100) * Number(document.getElementById('modalAmount').innerHTML)));
					getNutriData();
				}
			} else {
				//EXERCISE
				if ($("#modalAmount").html() < 360 && Math.round(((kcalsBase * totalWeight) / 60) * (Number(document.getElementById('modalAmount').innerHTML) + 1)) <= 9999) {
					$("#modalAmount").html(Number($("#modalAmount").html()) + (1));
					$("#modalTotal").html(Math.round(((kcalsBase * totalWeight) / 60) * Number(document.getElementById('modalAmount').innerHTML)));
				}
			}
		}
		//////////////
		// MODALREM //
		//////////////
		function modalRem() {
			//FOOD
			if (searchType == "food") {
				if ($("#modalAmount").html() > 0) {
					$("#modalAmount").html(Number($("#modalAmount").html()) - (5));
					$("#modalTotal").html(Math.round(((kcalsBase) / 100) * Number(document.getElementById('modalAmount').innerHTML)));
					getNutriData();
				}
			} else {
				//EXERCISE
				if ($("#modalAmount").html() > 0) {
					$("#modalAmount").html(Number($("#modalAmount").html()) - (1));
					$("#modalTotal").html(Math.round(((kcalsBase * totalWeight) / 60) * Number(document.getElementById('modalAmount').innerHTML)));
				}
			}
		}
		/////////////////////
		// POSITIVE ADJUST //
		/////////////////////
		$("#modalPosBlock").on(touchstart, function (evt) {
			evt.preventDefault();
			modalAdd();
		});
		/////////////////////
		// NEGATIVE ADJUST //
		/////////////////////
		$("#modalNegBlock").on(touchstart, function (evt) {
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
		$("#modalPosBlock,#modalNegBlock").on(touchend + " mouseout mouseleave mouseup", function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#adjustPosBlock").on(touchend, function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#modalPosBlock").on(touchstart, function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
			pressTimerModalPos = setTimeout(function () {
					pressRepeatModalPos = setInterval(function () {
							modalAdd();
						}, 50);
				}, 400);
		});
		///////////////////////
		// NEGATIVE REPEATER //
		///////////////////////
		$("#modalNegBlock").on(touchend, function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
		});
		$("#modalNegBlock").on(touchstart, function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
			pressTimerModalNeg = setTimeout(function () {
					pressRepeatModalNeg = setInterval(function () {
							modalRem();
						}, 50);
				}, 400);
		});
		//#/////////////////////////#//
		//# SMALLER MODAL FUNCTIONS #//
		//#/////////////////////////#//
		//////////////////////////////
		// MODAL QUICK ADD (SUBMIT) //
		//////////////////////////////
		var im = 0;
		$("#modalOk").on(touchstart, function (evt) {
			evt.preventDefault();
			clearRepeaterModal();
			//ADJUST TYPE
			if (searchType == "food") {
				var valueType = 1;
				var shortDesc = " (" + document.getElementById('modalAmount').innerHTML + LANG.G[lang] + ")";
			} else {
				var valueType = -1;
				var shortDesc = " (" + document.getElementById('modalAmount').innerHTML + " " + LANG.MIN[lang] + ")";
			}
			//grab values
			var title = ((document.getElementById('modalTotal').innerHTML) * (valueType));
			var body = mName + shortDesc;
			var published = new Date().getTime();
			//hours ago
			if (Number($("#entryTime").val()) >= 1) {
				published = published - (Number($("#entryTime").val()) * (60 * 60 * 1000));
			}
			//SAVE (NOT NULL)
			if (title != 0 && im == 0) {
				im++;
				//console.log("new entry added (modal)");
				saveEntry({
					title : title,
					body : body,
					published : published,
					type : mType,
					pro : parseFloat($("#proData").text()),
					car : parseFloat($("#carData").text()),
					fat : parseFloat($("#fatData").text())
				});
				//auto start
				function onConfirmStart(button) {
					if (button == 1) {
						window.localStorage.setItem("config_start_time", published);
						window.localStorage.setItem("appStatus", "running");
						updateEntries();
						setPush();
						$("#appStatus").removeClass("start");
						$("#appStatus").addClass("reset");
						$("#appStatusTitle").html(LANG.RESET[lang]);
					}
				}
				//SHOW START DIALOG
				if (window.localStorage.getItem("appStatus") != "running") {
					appConfirm(LANG.NOT_RUNNING_TITLE[lang], LANG.NOT_RUNNING_DIALOG[lang], onConfirmStart, LANG.OK[lang], LANG.CANCEL[lang]);
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
				setTimeout(function () {
					//$("#" + mCode).addClass('fade');
					//$("#" + mCode).addClass('trans');
					$("#activeOverflow").parent('div').addClass('fade');
					$("#activeOverflow").parent('div').addClass('trans');
				}, 0);
				$(".activeOverflow").removeClass("activeOverflow");
				//SELF-REMOVE
				$('#modalOverlay').on(transitionend, function (e) {
					$("#modalOverlay,#modalWindow").remove();
					$("body").removeClass("overlay");
				});
				if (document.getElementById('slider') && document.getElementById('entryBody')) {
					document.getElementById('slider').slider.setValue(0);
					//$("#entryTime").val('0');
					$("#entryTitle").val(0);
					$("#entryTitle").trigger("update");
					//$("#entryBody").val('');
				}
				//REFRESH DATA
				updateTimer();
				clearRepeaterModal();
				//update intake graph
				intakeHistory();
				setTimeout(function (evt) {
					updateEntries(published);
					updateEntriesTime();
					updateEntriesSum();
				}, 1000);
			}
		});
		///////////////////
		// OVERLAY CLOSE //
		///////////////////
		//fix foodlist scrolling
		$("#modalWindow").on(touchmove, function (evt) {
			evt.preventDefault();
			evt.stopPropagation();
		});
		$("#modalWindow").on(touchstart, function (evt) {
			if (isMobile.Windows()) {
				evt.stopPropagation();
			}
		});
		$("#modalOverlay, #modalCancel").on(touchstart, function (evt) {
			evt.preventDefault();
			evt.stopPropagation();
			//fade (time protected)
			var deFade = new Date().getTime();
			if ((deFade - initTime > 350)) {
				//CSS FADE OUT
				$('#modalWindow').removeClass('show');
				$('#modalOverlay').removeClass('show');
				clearRepeaterModal();
				//SELF-REMOVE
				$('#modalOverlay').on(transitionend, function (e) {
					$("#modalOverlay,#modalWindow").remove();
					$("body").removeClass("overlay");
				});
			}
		});
		///////////////////
		// PRE-FILL ONLY //
		///////////////////
		var mc = 0;
		$("#modalContent").on(touchstart, function (evt) {
			evt.preventDefault();
			evt.stopPropagation();
			clearRepeaterModal();
			if (mc == 0) {
				mc++;
				///////////////
				// DIARY TAB //
				///////////////
				var preFillTimer = 0;
				if (window.localStorage.getItem("app_last_tab") != "tab2") {
					var preFillTimer = 150;
					$("#appFooter li").removeClass("selected");
					window.localStorage.setItem("app_last_tab", "tab2");
					$("#tab2").addClass("selected");
					updateEntries('', '', 'callback');
				}
				setTimeout(function (evt) {
					$("#entryBody").val(mName);
					//CSS FADE OUT
					$('#modalWindow').removeClass('show');
					$('#modalOverlay').removeClass('show');
					//SELF-REMOVE
					$('#modalWindow').on(transitionend, function (e) {
						$("#modalWindow").remove();
						$("#modalOverlay").remove();
						$("body").removeClass("overlay");
					});
					$("#appHeader").trigger(touchstart);
					setTimeout(function () {
						$("#appHeader").trigger(touchstart);
					}, 400)
					$('#entryBody').width(window.innerWidth - 58);
					$("#entryBody").animate({
						backgroundColor : "#ffff88"
					}, 1).animate({
						backgroundColor : "rgba(255,255,255,0.36)"
					}, 1500);
				}, preFillTimer);
			}
		});
		///////////////////
		// DELETE BUTTON //
		///////////////////
		$("#modalDelete").on(tap, function (evt) {
			evt.stopPropagation();
			function removeItem(button) {
				if (button == 1) {
					delFood(itemId,function() {
						//if last row
						if ($('#' + $("#activeOverflow").parent('div').parent('div').attr("id") + " .searcheable").length == 1) {
							$("#activeOverflow").parent('div').parent('div').append('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
						}
						$("#activeOverflow").parent('div').remove();
						//if last row (cross-check)
						if ($('#' + $("#" + itemId).parent('div').attr("id") + " .searcheable").length == 1) {
							$("#" + itemId).parent('div').append('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
						}
						$("#" + itemId).remove();
						//close
						$("#modalCancel").trigger(touchstart);
					});
					return false;
				}
			}
			//SHOW DIALOG
			appConfirm(LANG.DELETE_ITEM[lang], LANG.ARE_YOU_SURE[lang], removeItem, LANG.OK[lang], LANG.CANCEL[lang]);
			return false;
		});
		/////////////////
		// EDIT BUTTON //
		/////////////////
		$("#modalEdit").on(tap, function (evt) {
			evt.stopPropagation();
			var modalOpt = {
				name : mName,
				type : mType,
				code : mCode,
				term : mTerm,
				kcal : mKcal,
				pro : mPro,
				car : mCar,
				fat : mFat,
				fib : mFib
			};
			addNewItem(modalOpt);
			return false;
		});
		////////////////
		// FAV BUTTON //
		////////////////
		if (mFib == "fav") {
			$("#modalFav").addClass("favorite");
		}
		//mFib
		$("#modalFav").on(tap, function (evt) {
			$("#modalFav").toggleClass("favorite");
			if (mFib == "fav") {
				mFib = "nonFav";
				$(".activeOverflow").removeClass("favItem");
				$("#tabMyItemsBlock #" + mCode).removeClass("favItem");
			} else {
				mFib = "fav";
				$(".activeOverflow").addClass("favItem");
				$("#tabMyItemsBlock #" + mCode).addClass("favItem");
			}
			evt.stopPropagation();
			var modalOpt = {
				name : mName,
				type : mType,
				code : mCode,
				term : mTerm,
				kcal : mKcal,
				pro : mPro,
				car : mCar,
				fat : mFat,
				fib : mFib
			};
			setFav(modalOpt,function() {
				//////////////////////////
				// IOS OVERFLOW FLICKER //
				//////////////////////////
				if (mFib == "nonFav") {
					$("#tabMyFavs #" + mCode).css("opacity", 0);
					$("#tabMyFavs #" + mCode).remove();
					kickDown();
					return false;
				} else {
					if (isMobile.iOS()) {
						setTimeout(function () {
							updateCustomList('fav');
							kickDown();
						}, 50);
						kickDown();
						$("#tabMyFavs .foodName").css("opacity", 0);
						$("#tabMyFavs .foodName").css("overflow", "hidden");
						$("#tabMyFavs .foodName").css("opacity", 1);
						kickDown();
					} else {
						updateCustomList('fav');
					}
				}
			});
		});
	});
}

