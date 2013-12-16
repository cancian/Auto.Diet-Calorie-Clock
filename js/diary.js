var diary;
/////////////////
// GLOBAL VARS //
/////////////////
function Diary() {
	that = this;
}
//////////////
// SETUP DB //
//////////////
var dbName = "mylivediet.app";
Diary.prototype.setup = function(callback) {
	this.db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	this.db.transaction(this.initDB, this.dbErrorHandler, callback);
};
///////////////////
// ERROR HANDLER //
///////////////////
Diary.prototype.dbErrorHandler = function(evt) {
	//console.log('DB Error');
	//console.log(evt);
};
/////////////
// INIT DB //
/////////////
Diary.prototype.initDB = function(t) {
	//t.executeSql('drop table diary_entry');
	//t.executeSql('create table if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, published DATE)');
	t.executeSql('CREATE TABLE if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, published DATE,info TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT)');
	//INSERT INTO "diary_food" VALUES(2,'food','01002','Butter, whipped, with salt','butterwhippedwithsalt','717','0.85','0.06','81.11','0.00');
	//DROP TABLE IF EXISTS "diary_food";
	//t.executeSql('create table if not exists diary_food(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, published DATE)');
	//t.executeSql('create table if not exists diary_config(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, published DATE)');
	//t.executeSql('INSERT INTO diary_config (body,title) SELECT "2000","' + (new Date()).getTime() + '" WHERE NOT EXISTS (SELECT body FROM diary_config)');
	if(!window.localStorage.getItem("config_start_time")) {
		window.localStorage.setItem("config_start_time",Number(new Date().getTime()));
	}
	if(!window.localStorage.getItem("config_kcals_day_0")) {
		window.localStorage.setItem("config_kcals_day_0",2000);
	}
	if(!window.localStorage.getItem("config_kcals_day_1")) {
		window.localStorage.setItem("config_kcals_day_1",1600);
	}
	if(!window.localStorage.getItem("config_kcals_day_2")) {
		window.localStorage.setItem("config_kcals_day_2",2000);
	}
};
///////////////////
// DROP ENTRY DB //
///////////////////
Diary.prototype.deSetup = function(callback) {
	this.db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	this.db.transaction(this.dropDB, this.dbErrorHandler, callback);
};
//flush rows
Diary.prototype.dropDB = function(t) {
	// REVERT TO DEFAULT
	t.executeSql('DELETE FROM diary_entry');
	document.getElementById('pageSlideInfo').innerHTML = "";
	document.getElementById('pageSlideCalc').innerHTML = "";
	$.get("calc_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideCalc").html("<div id='sideMenuCalc'>" + data + "</div>"); });
	$.get("info_" + LANG("LANGUAGE") + ".html?"+new Date().getTime(), function(data) { $("#pageSlideInfo").html("<div id='sideMenuInfo'>" + data + "</div>"); });
	window.localStorage.clear();
	window.localStorage.setItem("absWindowHeight",window.innerHeight);
	window.localStorage.setItem("absWindowWidth",window.innerWidth);
	window.localStorage.setItem("absOrientation",Number(window.orientation));
	window.localStorage.setItem("config_start_time",Number(new Date().getTime()));
	window.localStorage.setItem("config_kcals_day_0",2000);	
	window.localStorage.setItem("config_kcals_day_1",1600);
	window.localStorage.setItem("config_kcals_day_2",2000);
	window.localStorage.setItem("foodDbLoaded","empty");
	$('#entryListForm').addClass("toolTip");
	//GET CURRENTS
	document.getElementById('editableDiv').innerHTML = window.localStorage.getItem("config_kcals_day_0");
	updateEntriesTime();
};
/////////////////
// GET ENTRIES //
/////////////////
Diary.prototype.getEntries = function(start,callback) {
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			t.executeSql('select id, title, body, published from diary_entry order by published desc',[],
			function(t,results) {
				callback(that.fixResults(results));
			},this.dbErrorHandler);
	}, this.dbErrorHandler);
};
///////////////
// GET FOODS //
///////////////
Diary.prototype.getFoods = function(start,callback) {
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			t.executeSql('select body from diary_food',[],
			function(t,results) {
				callback(that.fixResults(results));
			},this.dbErrorHandler);
	}, this.dbErrorHandler);
};
//////////////////
// DELETE ENTRY //
//////////////////
Diary.prototype.deleteEntry = function(id, callback) {
	this.db.transaction(
		function(t) {
			t.executeSql('delete from diary_entry where id = ?', [id],
				function(t, results) {
					//callback(that.fixResult(results));
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
};
/////////////////
// WRITE ENTRY //
/////////////////
Diary.prototype.saveEntry = function(data, callback) {
	this.db.transaction(
		function(t) {
			//update body
			if(data.id && !data.title) {
				t.executeSql('update diary_entry set body=? where id=' + data.id, [data.body]);
			//update title
			} else if(data.id && data.title) {
				t.executeSql('update diary_entry set title=? where id=' + data.id, [data.title]);
			//insert new
			} else {
				t.executeSql('insert into diary_entry(title,body,published) values(?,?,?)', [data.title,data.body,data.published]); 
			} 
		}
	);
};
///////////////
// IMPORT DB //
///////////////
var iCount = 1;
Diary.prototype.importDb = function(data,callback) {
	this.db.transaction(
		function(t) {
				t.executeSql('insert into diary_food(title,body,published) values(?,?,?)',[data.title,data.body,new Date().getTime()],
				function() {
					//feedback
					iCount++;
					getPercent(iCount,data.total,'#iCounter');
					return false;
					//callback();
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);
};
/////////////////
// FIX RESULTS //
/////////////////
Diary.prototype.fixResults = function(res) {
	var result = [];
	for (var i=0; i<res.rows.length; i++) { 
		result.push(res.rows.item(i));
	}
	return result;
};
/////////////////
// DATE FORMAT //
/////////////////
function dtFormat(input) {
    if(!input) return "";
	input = new Date(input);
    var res = (input.getMonth()+1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
    var hour = input.getHours(); //+1;
    var ampm = "AM";
	if(hour === 12) ampm = "PM";
    if(hour > 12){
        hour-=12;
        ampm = "PM";
    }
    var minute = input.getMinutes(); //+1;
    if(minute < 10) minute = "0" + minute;
    res += hour + ":" + minute + " " + ampm;
    return res;
}
//////////////
// DATEDIFF //
//////////////
function dateDiff(date1,date2) {
	//Get 1 day in milliseconds
	var one_day  = 1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = date1;
	var date2_ms = date2;
	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;
	//take out milliseconds
	difference_ms = difference_ms/1000;
	var seconds   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var minutes   = Math.floor(difference_ms % 60);
	difference_ms = difference_ms/60;
	var hours     = Math.floor(difference_ms % 24);
	var days      = Math.floor(difference_ms/24);

	var lMinutes = " " + LANG('MINUTES') + " ";
	var lHours   = " " + LANG('HOURS') + " ";
	var lDays    = " " + LANG('DAYS') + " ";

	if(minutes == 0) { var lMinutes = ""; minutes = ""; }
	if(hours   == 0) { var lHours   = ""; hours   = ""; }
	if(days    == 0) { var lDays    = ""; days    = ""; }

	if(minutes == 1) { var lMinutes = " " + LANG('MINUTE') + " "; }
	if(hours   == 1) { var lHours   = " " + LANG('HOUR') + " ";   }
	if(days    == 1) { var lDays    = " " + LANG('DAY') + " ";    }

	if(days    > 3)                             { var lHours   = ""; hours   = ""; }
	if(days    > 0)                             { var lMinutes = ""; minutes = ""; }
	if(days    > 0 && hours   > 0)              { var lDays    = lDays  + LANG('AND') + " "; }
	if(hours   > 0 && minutes > 0)              { var lHours   = lHours + LANG('AND') + " "; }
	if(days == 0 && hours == 0 && minutes == 0) { minutes = 0; var lMinutes = " " + LANG('MINUTES') + " "; }

	return days + lDays + hours + lHours + minutes + lMinutes + " " + LANG('AGO') + " ";
}
//////////
// TRIM //
//////////
function trim(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
////////////////////////////
// GET WINDOW ORIENTATION //
////////////////////////////
function getOrientation() {
	if(window.orientation == 90 || window.orientation == -90) { //Landscape Mode
		return "landscape";
	}
	else if (window.orientation == 0 || window.orientation == 180) {
		return "portrait";
	}
}
///////////////
// AFTERLOAD //
///////////////
var afterTimer;
function afterLoad() {
	$('body').css("-webkit-transition-timing-function","linear");
	$('body').css("-webkit-transition-duration",".1s");
	//UNHIDE
	$('body').css("opacity","1");
	setTimeout(function() { $('body').css("-webkit-transition-duration","0s"); },250);
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').show();
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("display","block");
	//document.getElementById('afterLoad').style.display = 'none';
	clearTimeout(afterTimer);
	//loaded();
	window.localStorage.setItem("absWindowHeight",window.innerHeight);
	window.localStorage.setItem("absWindowWidth",window.innerWidth);
	window.localStorage.setItem("absOrientation",getOrientation());
}
function afterShow(t) {
    afterTimer = setTimeout(afterLoad,t);
}
///////////////
// AFTERHIDE //
///////////////
function afterHide() {
	setTimeout(function() { window.location=''; },500);
	//SET CSS TRANSITION
	$('body').css("-webkit-transition-timing-function","linear");
	$('body').css("-webkit-transition-duration",".25s");
	$("body").css("opacity","0");
}
//afterShow(875);
/////////////
// SPINNER //
/////////////
function spinner(size) {
	//////////
	// STOP //
	//////////
	if(!size || size == "") {
		$("#tempHolder").fadeOut(125,function() {
			$("#tempHolder").remove();
			setTimeout(function() { $("#tempHolder").remove(); },150);
			setTimeout(function() { $("#tempHolder").remove(); },250);
			setTimeout(function() { $("#tempHolder").remove(); },500);
			setTimeout(function() { $("#modalOverlay").remove(); },150);
			setTimeout(function() { $("#modalOverlay").remove(); },250);
			setTimeout(function() { $("#modalOverlay").remove(); },500);
			setTimeout(function() { $("#spinner").remove(); },150);
			setTimeout(function() { $("#spinner").remove(); },250);
			setTimeout(function() { $("#spinner").remove(); },500);
			return;
		});
	}
	//////////
	// HTML //
	//////////
	if(!$("#tempHolder").html()) { 
		$("body").prepend('<div id="tempHolder"></div');
		$("#tempHolder").html('<div id="modalOverlay"><span id="spinnerMsg">' + LANG("PREPARING_DB") + '</span></div><div id="spinnerWrapper"><div id="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div>');
		$("#modalOverlay").css("opacity",.5);
		//prevent tapping
		$("#modalOverlay,#spinner,#tempHolder").on(touchstart, function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
		});
		/////////////////
		// FIND CENTER //
		/////////////////
		$("#spinner").width(size);
		$("#spinner").height(size);
		var xcenter = ((window.innerWidth)  / 2) - ($("#spinner").width()  / 2);
		var ycenter = ((window.innerHeight) / 2) - ($("#spinner").height() / 2);
		$("#spinnerWrapper").css("left",xcenter + "px");
		$("#spinnerWrapper").css("top",ycenter  + "px");
	}
	/////////////////
	// SELF ADJUST //
	/////////////////
	/*
	if(active == 1) {
		$(window).on("resize", function(evt) {
			var xcenter = ($("#afterLoad").width()  / 2) - ( $("#spinnerWrapper").width()  / 2);
			var ycenter = ($("#afterLoad").height() / 2) - ( $("#spinnerWrapper").height() / 2);
			$("#spinnerWrapper").css("left",xcenter + "px");
			$("#spinnerWrapper").css("top",ycenter + "px");
		});
	}*/
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	//if partial
	if(published) {
		//set row time array
		//var arr = new Array;
		var arr = [];		
		//push 'published' into array
		arr.push(published);
		//build array from time on 'name'
		$('#entryList').children().each(function() {
			if($(this).attr('name')) {
				arr.push($(this).attr('name'));
			}
		});
		//sort it
		var entryArr = arr.sort().reverse();
		//find new row position in current list
		for(var i=0, len=entryArr.length; i<len; i++) {
			if(entryArr[i] == published) {
				var entryPos = i;
			}
		}
		// INSERT PARTIAL //
		//overwrite 'no entries'
		if(i == 1) {
			$("#entryList").html($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
		//match div before
		} else if($("#entryList>div:eq(" + entryPos + ")").html()) {
			$("#entryList>div:eq(" + entryPos + ")").before($(content).animate({ backgroundColor: "#ffffcc" }, 1 ).animate({ backgroundColor: "#fff" },1000));
		} else {
		//append if none
			$("#entryList").append($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
		}
		//target [div#partial] ~time's parent div id as target
		var page = $('#entryList div' + '#' + $("#" + published).parent('div').attr('id'));
	// FULL DIV REPLACE //
	} else {
		//check existence
		if(document.getElementById(target.replace("#",""))) {
			document.getElementById(target.replace("#","")).innerHTML = content;
		}
		//$(target).html(content);
		//target [div#entrylist]
		var page = $('#entryList');
	}
	// RELOAD HANDLERS //
	var evt = document.createEvent('CustomEvent');
	evt.initCustomEvent("pageload",true,true,content);
	//var page = $('#entryList div');
	if(page[0]) {
		page[0].dispatchEvent(evt);
	}
	return;
}
///////////////
// FILL DATE //
///////////////
function fillDate(timestamp,element) {
	//time [ datetime-local / 2013-01-01T00:00 ]
	if(timestamp != "") {
		var d = new Date(Number(timestamp));
	} else {
		var d = new Date();
	}
	//fill
	if(element != "") {
		//document.getElementById(element).value = d.toISOString();
		document.getElementById(element).value = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + "T" + ("0" + (d.getHours() + 0)).slice(-2) + ":" + ("0" + (d.getMinutes() + 0)).slice(-2);
	}
	return;
}
//////////////////////
// UPDATE ENTRYLIST //
//////////////////////
var partial = "";
function updateEntries(partial) {
	diary.getEntries(function(data) {
		//console.log('updateEntries()');
		var s = "";
		var p = "";
		var lastRow = "";
		var lastId  = "";
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = Number(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = Number(data[i].published);
			// 0 : 1
			if(data[i].body == "") {
                       if(dataTitle > 0) {
					dataBody = LANG("FOOD");
				} else if(dataTitle < 0) {
					dataBody = LANG("EXERCISE");
				} else {
					dataBody = "";
				}
			}
			// row colors
			var rowDate = new Date(dataPublished);
			var rowHour = rowDate.getHours();
                 if(rowHour <  6) { rowClass = "rowAfterhours"; }
			else if(rowHour < 12) { rowClass = "rowMorning";    }
			else if(rowHour < 18) { rowClass = "rowAfternoon";  }
			else if(rowHour < 24) { rowClass = "rowNight";      }

			if(dataTitle < 0)	{ rowClass = "e-" + rowClass; }
			// EXPIRED
			if(window.localStorage.getItem("config_start_time") > dataPublished) { rowClass = rowClass + " expired"; }
			// CORE OUTPUT
			//<p class='entriesId'>#" + Number(i+1) + "</p>
			var dataHandler = "<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='" + rowClass + "' name='" + dataPublished + "'><p class='entriesTitle'>" + dataTitle + "</p><p class='entriesKcals'>kcals</p><p class='entriesBody'>" + dataBody + "</p><p id='" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p><span class='delete'>" + LANG('DELETE') + "</span></div>";
			// ROW++
			s += dataHandler;
			//partial == last row time
			if(partial == Number(data[i].published)) {
				lastRow = dataHandler;
				lastId  = data[i].id;
			}
		}
		// UPDATE DIV //
		//!EMPTY
		if(s != "") {
			if(partial) {
				//IF PARTIAL + nonRepeat
				if(!$("#" + lastId).html()) {
					pageLoad("#entryList",lastRow,partial);
				} else { return false; }
			} else {
				//FULL
				pageLoad("#entryList",s);
			}
		//EMPTY
		} else {
			//PRE-FILL
			//pageLoad('#entryList','<div id="noEntries"><span>no entries</span></div>');
			$('#entryList').html('<div id="noEntries"><span>' + LANG("NO_ENTRIES") + '</span></div>');
		}
	});
}
/////////////////
// NUMBER ONLY //
/////////////////
function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if(charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}
///////////////////
// TOUCH ? CLICK //
///////////////////
function hasTouch() {
	return ('ontouchstart' in document);
}
var touchstart = hasTouch() ? ' touchstart ' : ' mousedown ';
var touchend   = hasTouch() ? ' touchend '   : ' mouseup ';
var touchmove  = hasTouch() ? ' touchmove '  : ' mousemove ';
var tap        = hasTouch() ? ' tap '        : ' click ';
var longtap    = hasTouch() ? ' taphold '    : ' taphold ' ;
var taphold    = hasTouch() ? ' taphold '    : ' taphold ' ;
var doubletap  = hasTouch() ? ' doubleTap '  : ' dblclick ';
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	diary.getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = Number(data[i].published);
			$("#" + dataPublished).html(dateDiff(dataPublished,(new Date()).getTime()));
		}
	});
	//been dieting for
	$("#underscroll").html(LANG("BEEN_DIETING") + " " + dateDiff(window.localStorage.getItem("config_start_time"),(new Date()).getTime()).replace(" " + LANG('AGO'),""));
}

