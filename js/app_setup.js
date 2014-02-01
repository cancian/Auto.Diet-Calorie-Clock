/////////////////
// GLOBAL VARS //
/////////////////
var diary;
var AND = " ";
function Diary()	{ that = this; }
function voidThis() {}
///////////////////
// DEBUG CONSOLE //
///////////////////
function CONSOLE(data) {
	if(window.localStorage.getItem("config_debug") == "active") {
		console.log(data);
	}
	return false;
}
//////////////////////
// AJAX ERROR CODES //
//////////////////////
$(function() {
    $.ajaxSetup({
        error: function(jqXHR, exception) {
			//spinner();
            if (jqXHR.status === 0) {
                //alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                //alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                //alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //alert('Time out error.');
            } else if (exception === 'abort') {
                //alert('Ajax request aborted.');
            } else {
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
			//close progress/create file
			$("#loadingDiv").removeClass("updating");
			setPush();
        }
    });
});
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
	CONSOLE('DB Error');
	CONSOLE(evt);
};
/////////////
// INIT DB //
/////////////
Diary.prototype.initDB = function(t) {
	CONSOLE('Diary.prototype.initDB');
	t.executeSql('CREATE TABLE if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, title TEXT, body TEXT, published VARCHAR UNIQUE,info TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT)');
	///////////////
	// SQL RESET //
	///////////////
	/*
	if(window.localStorage.getItem("appReset") == "wipe") {
		window.localStorage.removeItem("appReset");
		t.executeSql('DELETE FROM "diary_entry"');
	}
	*/
	//config
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
////////////////////
// RESET DATA+SQL //
////////////////////
Diary.prototype.deSetup = function(callback) {
	CONSOLE('Diary.prototype.deSetup');
	this.db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	this.db.transaction(function(t) { t.executeSql('DELETE FROM diary_entry'); return false; }, this.dbErrorHandler, function() { pushEntries(window.localStorage.getItem("facebook_userid")); afterHide("clear"); return false; });
};
///////////////////
// CLEAR ENTRIES //
///////////////////
Diary.prototype.clearEntries = function(callback) {
	CONSOLE('Diary.prototype.clearEntries');
	this.db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	this.db.transaction(function(t) { t.executeSql('DELETE FROM diary_entry'); return false; }, this.dbErrorHandler, function() { setPush(); return false; });
};










///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////






//////////////////////////////
// ENCODE LOCAL STORAGE SQL //
//////////////////////////////
function localStorageSql() {
	var keyList = "";
	/*start*/
	if(window.localStorage.getItem("config_start_time") && window.localStorage.getItem("appStatus") == "running")  {
		keyList = keyList + "#@@@#" + "config_start_time" + "#@@#" + window.localStorage.getItem("config_start_time");
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + window.localStorage.getItem("appStatus");
	}
	/*daily*/
	if(window.localStorage.getItem("config_kcals_day_0")) { keyList = keyList + "#@@@#" + "config_kcals_day_0" + "#@@#" + window.localStorage.getItem("config_kcals_day_0"); }
	if(window.localStorage.getItem("config_kcals_day_1")) { keyList = keyList + "#@@@#" + "config_kcals_day_1" + "#@@#" + window.localStorage.getItem("config_kcals_day_1"); }
	if(window.localStorage.getItem("config_kcals_day_2")) { keyList = keyList + "#@@@#" + "config_kcals_day_2" + "#@@#" + window.localStorage.getItem("config_kcals_day_2"); }
	if(window.localStorage.getItem("config_measurement")) { keyList = keyList + "#@@@#" + "config_measurement" + "#@@#" + window.localStorage.getItem("config_measurement"); }
	/*notes*/
	if(window.localStorage.getItem("appNotes"))			{ keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + window.localStorage.getItem("appNotes").replace(/(\n|\r\n)/g, "#@#").split("/*").join("/ *"); }
	/*form*/
	if(window.localStorage.getItem("calcForm#feet"))	{ keyList = keyList + "#@@@#" + "calcForm#feet" + "#@@#" + window.localStorage.getItem("calcForm#feet"); }
	if(window.localStorage.getItem("calcForm#inches"))	{ keyList = keyList + "#@@@#" + "calcForm#inches" + "#@@#" + window.localStorage.getItem("calcForm#inches"); }
	if(window.localStorage.getItem("calcForm#pA1B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA1B" + "#@@#" + window.localStorage.getItem("calcForm#pA1B"); }
	if(window.localStorage.getItem("calcForm#pA2B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA2B" + "#@@#" + window.localStorage.getItem("calcForm#pA2B"); }
	if(window.localStorage.getItem("calcForm#pA2C"))	{ keyList = keyList + "#@@@#" + "calcForm#pA2C" + "#@@#" + window.localStorage.getItem("calcForm#pA2C"); }
	if(window.localStorage.getItem("calcForm#pA3B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA3B" + "#@@#" + window.localStorage.getItem("calcForm#pA3B"); }
	if(window.localStorage.getItem("calcForm#pA3C"))	{ keyList = keyList + "#@@@#" + "calcForm#pA3C" + "#@@#" + window.localStorage.getItem("calcForm#pA3C"); }
	if(window.localStorage.getItem("calcForm#pA4B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA4B" + "#@@#" + window.localStorage.getItem("calcForm#pA4B"); }
	if(window.localStorage.getItem("calcForm#pA5B"))	{ keyList = keyList + "#@@@#" + "calcForm#pA5B" + "#@@#" + window.localStorage.getItem("calcForm#pA5B"); }
	if(window.localStorage.getItem("calcForm#pA6G"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6G" + "#@@#" + window.localStorage.getItem("calcForm#pA6G"); }
	if(window.localStorage.getItem("calcForm#pA6H"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6H" + "#@@#" + window.localStorage.getItem("calcForm#pA6H"); }
	if(window.localStorage.getItem("calcForm#pA6M"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6M" + "#@@#" + window.localStorage.getItem("calcForm#pA6M"); }
	if(window.localStorage.getItem("calcForm#pA6N"))	{ keyList = keyList + "#@@@#" + "calcForm#pA6N" + "#@@#" + window.localStorage.getItem("calcForm#pA6N"); }
	//return
	if(keyList != "") { keyList = "/*" + keyList + "*/"; }
	return keyList;
}
//////////////////////////////
// DECODE LOCAL STORAGE SQL //
//////////////////////////////
function rebuildLocalStorage(lsp) {
	if(!lsp.match("#@@@#")) { return; }
	//comments
	lsp = lsp.split("/*").join("").split("*/").join("");
	lsp = lsp.split("#@@@#");
	var lsPart;
	for(i = 0; i < lsp.length; i++) {
		lsPart = lsp[i].split("#@@#");
		if(lsPart[0]) {
			if(lsPart[0] == "appNotes") {
				window.localStorage.setItem(lsPart[0],lsPart[1].split("#@#").join("\n"));
			} else { 
				window.localStorage.setItem(lsPart[0],lsPart[1]);
			}
		}
	}
}
/////////////////
// GET ENTRIES //
/////////////////
Diary.prototype.fetchEntries = function(start,callback) {
	//CONSOLE('Diary.prototype.getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			t.executeSql('select * from diary_entry order by published desc',[],
			function(t,results) {
				callback(that.fixResults(results));
			},this.dbErrorHandler);
	}, this.dbErrorHandler);
};


function pushEntries(userId) {
	if(isNaN(userId)) { return; }
	if(window.localStorage.getItem("pendingSync")) { return; }
	diary.fetchEntries(function(data) {
		var fetchEntries = "";
		for(var i=0, len=data.length; i<len; i++) {
			var id        = data[i].id;
			var title     = data[i].title;
			var body      = sanitizeSql(data[i].body);
			var published = data[i].published;
			var info      = data[i].info;
			var kcal      = data[i].kcal;
			var pro       = data[i].pro;
			var car       = data[i].car;
			var fat       = data[i].fat;
			var fib       = data[i].fib;
			
			if(!body) { body = ''; }
			if(!kcal) { kcal = ''; }
			if(!info) { info = ''; }
			if(!kcal) { kcal = ''; }
			if(!pro)  { pro  = ''; }
			if(!car)  { car  = ''; }
			if(!fat)  { fat  = ''; }
			if(!fib)  { fib  = ''; }

			if(data[i].id) {
				fetchEntries = fetchEntries + "INSERT OR REPLACE INTO \"diary_entry\" VALUES(" + id + ",'" + title + "','" + body + "','" + published + "','" + info + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n";
			}
		}
		//insert custom diary_food
		if(window.localStorage.getItem("customFoodSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customFoodSql"));
		}
		if(window.localStorage.getItem("customExerciseSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customExerciseSql"));
		}
		if(window.localStorage.getItem("customFavSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customFavSql"));
		}
		if(localStorageSql()) {
			fetchEntries = fetchEntries + "\n" + trim(localStorageSql());
		}		
		/////////////////
		// POST RESULT //
		/////////////////
		if(fetchEntries == " " || !fetchEntries) { fetchEntries = " "; }
		if(fetchEntries) {
			$.post("http://mylivediet.com/sync.php", { "sql":fetchEntries,"uid":userId }, function(data) {
				//clear marker
				window.localStorage.removeItem("lastEntryPush");
			}, "text");
		}
	});
}
function setPush() {
	window.localStorage.setItem("lastEntryPush",new Date().getTime());
}


function syncEntries(userId) {
	window.localStorage.setItem("pendingSync",new Date().getTime());
	if(isNaN(userId)) { return; }
	if(!window.localStorage.getItem("facebook_logged")) { return; }
	if(!window.localStorage.getItem("facebook_userid")) { return; }
	var demoRunning = false;
	var dbName = "mylivediet.app";
	if(!demoRunning) {
		//start
		//spinner(45);
		$("#loadingDiv").addClass("updating");
		demoRunning = true;
		try {
			html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
			//import sql
			$.get("http://mylivediet.com/sync.php?uid=" + userId,function(sql) {
				var startTime = new Date();
				//local storage slice
				if(sql.match('#@@@#')) {
					rebuildLocalStorage(sql.split("\n").pop());
					sql = sql.replace(/\r?\n?[^\r\n]*$/, "");
				}
				//empty valid result ~ trigger success
				if(trim(sql) == "") {
					window.localStorage.removeItem("pendingSync");
					setPush();
					$("#loadingDiv").removeClass("updating");	
				}
				//html5sql.process("DELETE FROM diary_entry;" + sql,
				html5sql.process(sql,
					function() {
						//success
						demoRunning = false;
						//clear lock
						window.localStorage.removeItem("pendingSync");
						//push local
						setPush();
						$("#loadingDiv").removeClass("updating");
						//if diary tab, auto refresh
						if(window.localStorage.getItem("app_last_tab") == "tab2") {
							updateEntries();
						}
						if(typeof updateFavList == 'function') {
							updateFavList();	
							updateFoodList();	
							updateExerciseList();
						}
						/////////////
					},
					function(error, failingQuery) {
						//failure
						demoRunning = false;
						$("#loadingDiv").removeClass("updating");
						//spinner();
						if(window.localStorage.getItem("app_last_tab") == "tab2") {
							updateEntries();
						}
					}
				);
//				}
			});
		//try fail
		} catch(error) {
			demoRunning = false;
			$("#loadingDiv").removeClass("updating");
			//spinner();
		}
	}
}



///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////













/////////////////
// GET ENTRIES //
/////////////////
Diary.prototype.getEntries = function(start,callback) {
	//CONSOLE('Diary.prototype.getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			t.executeSql('select id, title, body, published, pro, car, fat from diary_entry order by published desc',[],
			function(t,results) {
				callback(that.fixResults(results));
			},this.dbErrorHandler);
	}, this.dbErrorHandler);
};
///////////////
// GET FOODS //
///////////////
Diary.prototype.getFoods = function(start,callback) {
	CONSOLE('Diary.prototype.getFoods');
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
	CONSOLE('Diary.prototype.deleteEntry(' + id + ')');
	this.db.transaction(
		function(t) {
			t.executeSql('delete from diary_entry where id = ?', [id]);
			setPush();
		}
	);
};
////////////////
// SAVE ENTRY //
////////////////
Diary.prototype.saveEntry = function(data, callback) {
	CONSOLE('Diary.prototype.saveEntry(' + data.id + ')');
	this.db.transaction(
		function(t) {
			//update body
			if(data.id && !data.title) {
				t.executeSql('update diary_entry set body=? where id=' + data.id, [data.body]);
				setPush();
			//update title
			} else if(data.id && data.title) {
				t.executeSql('update diary_entry set title=? where id=' + data.id, [data.title]);
				setPush();
			//insert full
			} else if(data.pro || data.car || data.fat) {
				t.executeSql('insert into diary_entry(title,body,published,pro,car,fat) values(?,?,?,?,?,?)', [data.title,data.body,data.published,data.pro,data.car,data.fat]); 
				setPush();
			//insert quick
			} else {
				t.executeSql('insert into diary_entry(title,body,published) values(?,?,?)', [data.title,data.body,data.published]); 
				setPush();
			} 
		}
	);
};
//////////////
// SET FOOD //
//////////////
Diary.prototype.setFood = function(data, callback) {
	CONSOLE('setFood(' + data.act + ' ' + data.code + ")");
	this.db.transaction(
		function(t) {
			if(data.act == "update") {
				t.executeSql('delete from diary_food where CODE = ?', [data.code]);
				t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
			} else {
				t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
			} 
		}
	);
};
//////////////
// GET FOOD //
//////////////
Diary.prototype.getFood = function(id,callback) {
	CONSOLE('getFood(' + id + ")");
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			t.executeSql('select * from diary_food where CODE=?',[id],
			function(t,results) {
				callback(that.fixResults(results));
			},this.dbErrorHandler);
	}, this.dbErrorHandler);
};
/////////////////
// DELETE FOOD //
/////////////////
Diary.prototype.delFood = function(code, callback) {
	CONSOLE('delFood(' + code + ")");
	this.db.transaction(
		function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [code],
				function(t, results) {
					//callback(that.fixResult(results));
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
};
/////////////////////
// GET CUSTOM LIST //
/////////////////////
Diary.prototype.getCustomList = function(type,callback) {
	CONSOLE('getCustomList(' + type + ")");
	if(arguments.length == 1) { callback = arguments[0]; }
	this.db.transaction(
		function(t) {
			// FAV LIST //
			if(type == "fav") {
				t.executeSql('select * from diary_food where FIB=? order by NAME COLLATE NOCASE ASC',[type],
				function(t,results) {
					callback(that.fixResults(results));
					if(window.localStorage.getItem("foodDbLoaded") == "done" && !$('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
						$('#pageSlideFood').addClass("open");
					}
				},this.dbErrorHandler);
			// FOOD/EXERCISE LIST //
			} else {
				t.executeSql('select * from diary_food where length(CODE)=14 AND TYPE=? order by NAME COLLATE NOCASE ASC',[type],
				function(t,results) {
					callback(that.fixResults(results));
					if(window.localStorage.getItem("foodDbLoaded") == "done" && !$('#pageSlideFood').hasClass("open") && !$('#pageSlideFood').hasClass("busy")) {
						$('#pageSlideFood').addClass("open");
					}
				},this.dbErrorHandler);
			}
	}, this.dbErrorHandler);
};
/////////////
// SET FAV //
/////////////
Diary.prototype.setFav = function(data, callback) {
	CONSOLE('setFav(' + data.fib + ")");
	this.db.transaction(
		function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [data.code]);
			t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
		}
	);
};
/////////////////
// FIX RESULTS //
/////////////////
Diary.prototype.fixResults = function(res) {
	//CONSOLE('Diary.prototype.fixResults');
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
//////////////////
// TIME ELAPSED //
//////////////////
function timeElapsed() {
	var seconds = (new Date().getTime() - window.localStorage.getItem("config_start_time")) / 1000;
var date = new Date(seconds * 1000);
var dd   = Math.floor(seconds/86400);
var hh   = date.getUTCHours();
var mm   = date.getUTCMinutes();
var ss   = date.getSeconds();
//if (hh > 12) {hh = hh - 12;}
if (hh < 10) { hh = "0" + hh; }
if (mm < 10) { mm = "0" + mm; }
if (ss < 10) { ss = "0" + ss; }
// This formats your string to HH:MM:SS
if(dd > 0) { dd = dd + "d "; } else { dd = ""; }
return dd+hh+":"+mm+":"+ss;
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
	if(window.orientation == 90 || window.orientation == -90) {
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
	CONSOLE('afterLoad()');
	//$('body').css("-webkit-transition-timing-function","linear");
	//$('body').css("-webkit-transition-duration",".1s");
	//UNHIDE
	$('body').css("opacity","1");
	//setTimeout(function() { $('body').css("-webkit-transition-duration","0s"); },250);
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').show();
	//$('#pageSlideInfo,#pageSlideCalc,#pageSlideFood').css("display","block");
	//document.getElementById('afterLoad').style.display = 'none';
	clearTimeout(afterTimer);
	//loaded();
	//window.localStorage.setItem("absWindowHeight",window.innerHeight);
	//window.localStorage.setItem("absWindowWidth",window.innerWidth);
	//window.localStorage.setItem("absOrientation",getOrientation());
	//window.localStorage.setItem("absWindowHeight",window.innerHeight);
	//window.localStorage.setItem("absWindowWidth",window.innerWidth);
	//window.localStorage.setItem("absOrientation",Number(window.orientation));
	afterHidden = 0;
}
function afterShow(t) {
    afterTimer = setTimeout(afterLoad,t);
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	CONSOLE('afterHide()');
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		$("#appStatusReload").off();
		//SET CSS TRANSITION
		$('body').css("-webkit-transition-timing-function","ease");
		$('body').css("-webkit-transition-duration",".25s");
		$("body").css("opacity","0");
		$('body').on('webkitTransitionEnd',function(e) { 
			//if logged, reload via callback
			if(window.localStorage.getItem("facebook_username") && window.localStorage.getItem("facebook_logged")) {
				//window.localStorage.removeItem("customFavSql");
				//window.localStorage.removeItem("customFoodSql");
				//window.localStorage.removeItem("customExerciseSql");
				$.post("http://mylivediet.com/sync.php", { "sql":" ","uid":window.localStorage.getItem("facebook_userid") }, function(data) {
					if(cmd == "clear") { window.localStorage.clear(); }
					setTimeout(function() { window.location=''; },250);
				}, "text");
			} else {
				setTimeout(function() { window.location=''; },250);
				if(cmd == "clear") { window.localStorage.clear(); }
			}
		});
	},250);
}
/////////////
// SPINNER //
/////////////
function spinner(size) {
	CONSOLE('spinner()');
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
		$("#tempHolder").html('<div id="modalOverlay"></div><span id="spinnerMsg">' + LANG("PREPARING_DB") + '</span><div id="spinnerWrapper"><div id="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div>');
		$("#modalOverlay").css("opacity",.5);
		//prevent tapping
		$("#modalOverlay").css("z-index",99999);
		$("#modalOverlay").css("background-color","#fff");
		$("#modalOverlay").css("background-image","-webkit-linear-gradient(#fff,#fefefe)");		
		$("#modalOverlay,#spinner,#tempHolder").on(touchstart, function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		/////////////////
		// FIND CENTER //
		/////////////////
		$("#spinner").width(size);
		$("#spinner").height(size);
		var xcenter = ((window.innerWidth)  / 2) - ($("#spinner").width()  / 2);
		var ycenter = Math.round(((window.innerHeight) / 1.75));
		/* - ($("#spinner").height() / 2);*/
		$("#spinnerWrapper").css("left",xcenter + "px");
		$("#spinnerWrapper").css("top",ycenter  + "px");
	}
	//spin.js plugin
	$("#spinner").spin({ lines: 12, length: 9, width: 4, radius: 10,color: "#000" });
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
	CONSOLE('pageLoad(' + target + ')');	
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
	//var evt = document.createEvent('CustomEvent');
	//evt.initCustomEvent("pageload",true,true,content);
	//var page = $('#entryList div');
	if(page[0]) {
		$(page).trigger("pageload");
	//	page[0].dispatchEvent(evt);
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
	CONSOLE('pageLoad(' + partial + ')');	
	diary.getEntries(function(data) {
		var s = "";
		var p = "";
		var rowClass;
		var lastRow = "";
		var lastId  = "";
		var langFood = LANG("FOOD");
		var langExer = LANG("EXERCISE");
		var langDel = LANG("DELETE");
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = Number(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = Number(data[i].published);
			// 0 : 1
			if(data[i].body == "") {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
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
			if(window.localStorage.getItem("config_start_time") > dataPublished || window.localStorage.getItem("appStatus") != "running") { rowClass = rowClass + " expired"; }
			// CORE OUTPUT
			//<p class='entriesId'>#" + Number(i+1) + "</p>
			var dataHandler = "\
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='entryListRow " + rowClass + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>kcal</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
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
	if(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
/*
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if(charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;*/
}
///////////////////
// TOUCH ? CLICK //
///////////////////
function isCordova() {
	return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
}
function androidVersion() {
	if(navigator.userAgent.match(/Android/i) && document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
		return parseFloat(navigator.userAgent.match(/Android [\d+\.]{3,5}/)[0].replace('Android ',''));
	} else {
		return -1;
	}
}
function hasTouch() {
	return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
}
function hasTap() {
	return ("ontouchstart" in document.documentElement) || ("ontouchstart" in window);
}
var touchstart = hasTap() ? 'touchstart' : 'mousedown';
var touchend   = hasTap() ? 'touchend'   : 'mouseup';
var touchmove  = hasTap() ? 'touchmove'  : 'mousemove';
var tap        = hasTap() ? 'tap'        : 'click';
var longtap    = hasTap() ? 'taphold'    : 'taphold' ;
var taphold    = hasTap() ? 'taphold'    : 'taphold' ;
var singletap  = hasTap() ? 'singleTap'  : 'click';
var doubletap  = hasTap() ? 'doubleTap'  : 'dblclick';
//#///////////#//
//# MOBILE OS #//
//#///////////#//
var isMobile = {
	Cordova: function() {
		return (typeof cordova != 'undefined') || (typeof Cordova != 'undefined');
	},
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
		//return (navigator.userAgent.match(/Android/i) && document.URL.indexOf( 'http://' ) === -1 &&document.URL.indexOf( 'https://' ) === -1) ? true : false;
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		//return (navigator.userAgent.match(/iPhone|iPad|iPod/i) && document.URL.indexOf( 'http://' ) === -1 &&document.URL.indexOf( 'https://' ) === -1) ? true : false;
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	}
};
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	CONSOLE('updateEntriesTime()');	
	diary.getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = Number(data[i].published);
			$("#" + dataPublished).html(dateDiff(dataPublished,(new Date()).getTime()));
		}
	});
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer() {
	CONSOLE('niceResizer()');
	if(!isMobile.iOS() && androidVersion() < 4.4) {
		$("#appContent").getNiceScroll().resize();
		$("#foodList").getNiceScroll().resize();
	}
}
//////////////
// SANITIZE //
//////////////
function sanitize(str) {
	if(str != "") {
		var result = str.split(" ").join("").split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split("/").join("").split("\\").join("").split("&").join("").split("â").join("a").split("ê").join("e").split("ô").join("o").split("ã").join("a").split("ç").join("c").split("á").join("a").split("é").join("e").split("í").join("i").split("ó").join("o").split("ú").join("u").split("à").join("a").split("õ").join("o").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").split(' ').join("").toLowerCase();
		return result;
	}
}
//////////////////
// SANITIZE SQL //
//////////////////
function sanitizeSql(str) {
	if(str != "") {
		var result = str.split("'").join(" ").split('"').join(" ").split(";").join(" ").split("&").join(" ").split("\\").join(" ").split("/").join(" ").split("  ").join(" ").split("  ").join(" ");
		return result;
	}
}
///////////////
// ANALYTICS //
///////////////
if(window.localStorage.getItem("config_debug") != "active") {
	document.addEventListener("deviceready", onDeviceReady, false);
	var gaPlugin;
	function onDeviceReady() {
		CONSOLE('gaPlugin.init(UA-46450510-1)');
		gaPlugin = window.plugins.gaPlugin;
		gaPlugin.init(successHandler, errorHandler, "UA-46450510-1", 10);
		if(isMobile.Android())  { var appOS = "android"; }
		else if(isMobile.iOS()) { var appOS = "ios";     }
		else					{ var appOS = "www";     }
		gaPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, appOS + ".mylivediet.com/#" + "startApp(" + appVersion.slice(7,-1) + ")");
		function successHandler()			{}
		function errorHandler()			  {} 
		function nativePluginResultHandler() {}
		function nativePluginErrorHandler()  {}
	}
	//www
	/*
	if(gaPlugin != "") {
		$(document).ready(function() {
			$("body").append("<script type='text/javascript' src='js/GALocalStorage.js'></script>");
			setTimeout(function(evt) {
				ga_storage._setAccount('UA-46450510-2');
				ga_storage._trackPageview('www.mylivediet.com/#startApp(' + appVersion.slice(7,-1) + ')');
			},9999);
		});
	}
	*/
}
//////////////////////////
// REFRESH LOGIN STATUS //
//////////////////////////
function updateLoginStatus(sync) {
	FB.getLoginStatus(function(response) {
		if(response.status == 'connected') {
			window.localStorage.setItem("facebook_logged",true);
			$("#appFooter").addClass("appFacebook");
			//window.localStorage.setItem("facebook_userid",response.authResponse.userId);
			//alert(response.authResponse.userId);
			//alert(JSON.stringify(response));
			//alert('logged in');
			FB.api('/me', function(me) {
				if(me.id && me.name) {
					var facebook_userid   = me.id;
					var facebook_username = me.name;
					//alert(facebook_userid);
					//alert(facebook_username);
					window.localStorage.setItem("facebook_userid",facebook_userid);
					window.localStorage.setItem("facebook_username",facebook_username);
					if(sync == 1) { syncEntries(window.localStorage.getItem("facebook_userid")); }
				}
			});
		} else {
			//alert('not logged in');
			window.localStorage.removeItem("facebook_logged");
			window.localStorage.removeItem("facebook_userid");
			window.localStorage.removeItem("facebook_username");
			$("#appFooter").removeClass("appFacebook");
		}
	});
}
/////////////
// ON INIT //
/////////////
function afterInit()  {
	updateLoginStatus(1);
}
//#/////////#//
//# FB INIT #//
//#/////////#//
if(hasTouch()) {
	document.addEventListener("deviceready",function() { FB.init({appId: '577673025616946', nativeInterface: CDV.FB, useCachedDialogs: false }); afterInit(); }, false);
} else {
	$(document).ready(function() { FB.init({appId: '577673025616946', status: true, cookie: true, xfbml: true}); afterInit(); });
}

