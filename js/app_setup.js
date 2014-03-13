///////////////////
// DEBUG CONSOLE //
///////////////////
function CONSOLE(data,input) {
	//if(window.localStorage.getItem("config_debug") == "active") {
		console.log(data);
		if(input) {
			$("#entryBody").val(data);
		}
	//}
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
			//$("#loadingDiv").removeClass("updating");
			setTimeout(function() { NProgress.done(); spinner(); },6000);
			//setPush();
        }
    });
});
///////////////////
// ERROR HANDLER //
///////////////////
function dbErrorHandler(evt) {
	CONSOLE('DB Error: ' + JSON.stringify(evt));
}
/////////////
// INIT DB //
/////////////
function initDB(t) {
	CONSOLE('initDB');
	//iv not sql already, dont use sql
	//TABLE EXISTS
	if(hasSql) {
		t.executeSql('select * from diary_entry order by published desc',[],
	function(t,results) {
		//alert((fixResults(results)).length);
	},function(t) { 
	//alert('no nada');
	 });
//false hassql if empty
}



	if(hasSql) {
		t.executeSql('CREATE TABLE if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, title TEXT, body TEXT, published VARCHAR UNIQUE,info TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
		//t.executeSql('CREATE TABLE if not exists diary_food(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code VARCHAR UNIQUE,name TEXT,term TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
	} else {
		if(!lib.tableExists("diary_entry")) {
			lib.createTable("diary_entry", ["title", "body", "published", "info", "kcal", "pro", "car", "fat", "fib"]);
			lib.commit();
		}
		if(!lib.tableExists("diary_food")) {
			lib.createTable("diary_food",  ["type",  "code", "name", "term", "kcal", "pro", "car", "fat", "fib"]);
			lib.commit();
		}
		startApp();
	}
	////////////////////////////
	// GETTING STARTED DIALOG //
	////////////////////////////
	if(!window.localStorage.getItem("config_kcals_day_0")) {
		$("body").append("<div id='gettingStarted'>\
			<div id='appInfo'>" + LANG("START_APP") + "</div>\
			<div id='step1'><span>1</span>" + LANG("STEP_1") + "</div>\
			<div id='step2'><span>2</span>" + LANG("STEP_2") + "</div>\
			<div id='step3'><span>3</span>" + LANG("STEP_3") + "</div>\
			<div id='closeDiv'>" + LANG("CLOSE_INTRO") + "</div>\
		</div>");
		$("#closeDiv").on(touchend,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			$("#gettingStarted").fadeOut(200,function() {
				$("#gettingStarted").remove();
			});
		});
		$("#gettingStarted").on(touchstart,function(evt) {
			evt.stopPropagation();
		});
	}
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
	if(!window.localStorage.getItem("lastSync")) {
		window.localStorage.setItem("lastSync","never");
	}
	if(!window.localStorage.getItem("searchType")) {
		window.localStorage.setItem("searchType","food");
	}
	if(!window.localStorage.getItem("lastInfoTab")) {
		window.localStorage.setItem("lastInfoTab","topBarItem-1");
	}
};
/////////////////
// FIX RESULTS //
/////////////////
function fixResults(res) {
	//CONSOLE('fixResults');
	var result = [];
	if(res.rows) {
		for (var i=0; i<res.rows.length; i++) { 
			result.push(res.rows.item(i));
		}
	}
	return result;
};
////////////////////
// RESET DATA+SQL //
////////////////////
function deSetup(callback) {
	CONSOLE('deSetup');
	if(hasSql) {
		db.transaction(function(t) { t.executeSql('DROP TABLE IF EXISTS diary_entry'); return false; }, dbErrorHandler, function() { afterHide("clear"); return false; });
	} else {
		afterHide("clear");
	}
};
///////////////////
// CLEAR ENTRIES //
///////////////////
function clearEntries(callback) {
	CONSOLE('clearEntries');
	//db = window.openDatabase(dbName, 1, dbName + "DB", 1000000);
	if(hasSql) {
		db.transaction(function(t) { t.executeSql('DELETE FROM diary_entry'); return false; }, dbErrorHandler, function() { setPush(); return false; });
	} else {
		lib.deleteRows("diary_entry");
		lib.commit();
		setPush();
	}
};
//////////////////////////////
// SQL-ENCODE LOCAL STORAGE //
//////////////////////////////
function localStorageSql() {
	var keyList = "";
	/*start*/
	if(window.localStorage.getItem("config_start_time") && window.localStorage.getItem("appStatus") == "running")  {
		keyList = keyList + "#@@@#" + "config_start_time" + "#@@#" + window.localStorage.getItem("config_start_time");
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + window.localStorage.getItem("appStatus");
	} else {
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + "stopped";
	}
	/*daily*/
	if(window.localStorage.getItem("config_kcals_day_0")) { keyList = keyList + "#@@@#" + "config_kcals_day_0" + "#@@#" + window.localStorage.getItem("config_kcals_day_0"); }
	if(window.localStorage.getItem("config_kcals_day_1")) { keyList = keyList + "#@@@#" + "config_kcals_day_1" + "#@@#" + window.localStorage.getItem("config_kcals_day_1"); }
	if(window.localStorage.getItem("config_kcals_day_2")) { keyList = keyList + "#@@@#" + "config_kcals_day_2" + "#@@#" + window.localStorage.getItem("config_kcals_day_2"); }
	if(window.localStorage.getItem("config_measurement")) { keyList = keyList + "#@@@#" + "config_measurement" + "#@@#" + window.localStorage.getItem("config_measurement"); }
	/*notes*/
	if(window.localStorage.getItem("appNotes")) { 
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + window.localStorage.getItem("appNotes").replace(/(\n|\r\n)/g, "#@#").split("/*").join("/ *");
	} else {
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + "";
	}
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
///////////////////////////
// REBUILD LOCAL STORAGE //
///////////////////////////
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
			//update underlying value
			if(lsPart[0] == "config_kcals_day_0") {
				$("#editableDiv").html(lsPart[1]);
			}
		}
	}
}
///////////////////
// FETCH ENTRIES //
///////////////////
function fetchEntries(start,callback) {
	//CONSOLE('getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	db.transaction(
		function(t) {
			t.executeSql('select * from diary_entry order by published desc',[],
			function(t,results) {
				callback(fixResults(results));
			},dbErrorHandler);
	}, dbErrorHandler);
};
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries(userId) {
	if(isNaN(userId)) { return; }
	if(window.localStorage.getItem("pendingSync")) { return; }
	fetchEntries(function(data) {
		//NProgress.start();
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
			window.localStorage.setItem("lastEntryPush",Number(window.localStorage.getItem("lastEntryPush")) + 30000);
			$.post("http://mylivediet.com/sync.php", { "sql":fetchEntries,"uid":userId }, function(data) {
				//clear marker
				window.localStorage.removeItem("lastEntryPush");
				//NProgress.done();
			}, "text");
		}
	});
}
function setPush() {
	window.localStorage.setItem("lastEntryPush",new Date().getTime());
}
//#//////////////////////#//
//# ONLINE: SYNC ENTRIES #//
//#//////////////////////#//
function syncEntries(userId) {
	window.localStorage.setItem("pendingSync",new Date().getTime());
	if(isNaN(userId)) { return; }
	if(!window.localStorage.getItem("facebook_logged")) { return; }
	if(!window.localStorage.getItem("facebook_userid")) { return; }
	var demoRunning = false;
	var dbName = "mylivediet.app";
	if(!demoRunning) {
		//start
		//force food db
		//updateFoodDb();
		//spinner(45);
		//$("#loadingDiv").addClass("updating");
		NProgress.start();
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
					//$("#loadingDiv").removeClass("updating");	
					NProgress.done();
				}
				html5sql.process("DELETE FROM diary_entry;" + sql,
				//html5sql.process(sql,
					function() {
						//success
						demoRunning = false;
						//clear lock
						window.localStorage.removeItem("pendingSync");
						NProgress.done();
						if(window.localStorage.getItem("foodDbLoaded") != "done") {
							//force food db
							updateFoodDb();
						} else {
							//push local
							pushEntries(window.localStorage.getItem("facebook_userid"));
						}
						window.localStorage.setItem("lastSync",Number((new Date()).getTime()));
						if(window.localStorage.getItem("lastSync") != "never") { $("#optionLastSync span").html(dtFormat(Number(window.localStorage.getItem("lastSync")))); }
						//setPush();
						//$("#loadingDiv").removeClass("updating");
						//NProgress.inc();
						//if diary tab, auto refresh
						if(window.localStorage.getItem("app_last_tab") == "tab2") {
							updateEntries();
						}

						if(window.localStorage.getItem("app_last_tab") == "tab1" && !$("#pageSlideFood").is(":animated") && !$("#pageSlideFood").hasClass("open")) {
							$("#tab1").trigger(touchstart);
						}
						if(window.localStorage.getItem("app_last_tab") == "tab3" && !$("#pageSlideFood").is(":animated") && !$("#pageSlideFood").hasClass("open")) {
							$("#tab3").trigger(touchstart);
						}
						if(typeof updateFavList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
							updateFavList();	
							updateFoodList();	
							updateExerciseList();
						}
						/////////////
					},
					function(error, failingQuery) {
						//failure
						demoRunning = false;
						//$("#loadingDiv").removeClass("updating");
						NProgress.done();
						//spinner();
						if(window.localStorage.getItem("app_last_tab") == "tab2") {
							updateEntries();
						}
						if(window.localStorage.getItem("app_last_tab") == "tab1" && !$("#pageSlideFood").is(":animated") && !$("#pageSlideFood").hasClass("open")) {
							$("#tab1").trigger(touchstart);
						}
						if(window.localStorage.getItem("app_last_tab") == "tab3" && !$("#pageSlideFood").is(":animated") && !$("#pageSlideFood").hasClass("open")) {
							$("#tab3").trigger(touchstart);
						}
						if(typeof updateFavList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
							updateFavList();	
							updateFoodList();	
							updateExerciseList();
						}
					}
				);
//				}
			});
		//try fail
		} catch(error) {
			demoRunning = false;
			//$("#loadingDiv").removeClass("updating");
			NProgress.done();
			//spinner();
		}
	}
}
/////////////////
// GET ENTRIES //
/////////////////
function getEntries(start,callback) {
	//CONSOLE('getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(
			function(t) {
				t.executeSql('select id, title, body, published, pro, car, fat from diary_entry order by published desc',[],
				function(t,results) {
					callback(fixResults(results));
				},dbErrorHandler);
		}, dbErrorHandler);
	} else {
		callback(lib.query("diary_entry"));
	}
};
///////////////
// GET FOODS //
///////////////
function getFoods(start,callback) {
	CONSOLE('getFoods');
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
	db.transaction(
		function(t) {
			t.executeSql('select body from diary_food',[],
			function(t,results) {
				callback(fixResults(results));
			},dbErrorHandler);
	}, dbErrorHandler);
	} else {
		//	
	}
};
//////////////////
// DELETE ENTRY //
//////////////////
function deleteEntry(rid, callback) {
	CONSOLE('deleteEntry(' + rid + ')');
	if(hasSql) {
		db.transaction(
			function(t) {
				t.executeSql('delete from diary_entry where id = ?', [rid]);
				setPush();
			}
		);
	} else {
		lib.deleteRows("diary_entry", function(row) {
			if(row.id == rid) {
				return true;
			} else {
				return false;
			}
		});
		lib.commit();
		setPush();
	}
};
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data) {
	CONSOLE('saveEntry(' + data.published + ')');
	if(hasSql) {
		db.transaction(
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
	} else {
		//update body
		if(data.id && !data.title) {
			lib.update("diary_entry", {id: data.id}, function(row) {
				row.body = data.body;
				return row;
			});
			lib.commit();
			setPush();
		//update title
		} else if(data.id && data.title) {
			lib.update("diary_entry", {id: data.id}, function(row) {
				row.title = data.title;
				return row;
			});
			lib.commit();
			setPush();
		//insert full
		} else if(data.pro || data.car || data.fat) {
			lib.insert("diary_entry", {title: data.title, body: data.body, published: data.published, pro:data.pro, car:data.car, fat:data.fat});
			lib.commit();
			setPush();
		//insert quick
		} else {
			lib.insert("diary_entry", {title: data.title, body: data.body, published: data.published});
			lib.commit();
			setPush();
		}
	}
};
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	CONSOLE('setFood(' + data.act + ' ' + data.code + ")");
	db.transaction(
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
function getFood(fid,callback) {
	CONSOLE('getFood(' + fid + ")");
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
	db.transaction(
		function(t) {
			t.executeSql('select * from diary_food where CODE=?',[fid],
			function(t,results) {
				callback(fixResults(results));
			},dbErrorHandler);
	}, dbErrorHandler);
	} else {
		//	
		var callFood = lib.query("diary_food",function(row) {
				if(row.code == fid) { return true; } else { return false; }
			});	
		callback(callFood);
			
	}
};
/////////////////
// DELETE FOOD //
/////////////////
function delFood(code, callback) {
	CONSOLE('delFood(' + code + ")");
	db.transaction(
		function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [code],
				function(t, results) {
					//callback(fixResult(results));
			}, dbErrorHandler);
		}, dbErrorHandler);
};
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function getCustomList(rType,callback) {
	CONSOLE('getCustomList(' + rType + ")");
	//	
	function callbackOpen() {
		if(!$('#pageSlideFood').is(":animated")) {
			$('#pageSlideFood').addClass("open"); 
			if(!$('#appHeader').hasClass("open")) {
				$('#appHeader').removeClass("closer");
			}
		}
		//ls callback-ish
		setTimeout(function() {
			$('#tabMyFoodsBlock').css("min-height", ($('#foodList').height() - 128) + "px");
			$('#tabMyExercisesBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		},0);
		//CONSOLE('getCustomList(error open)');
	}
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(
			function(t) {
				// FAV LIST
				if(rType == "fav") {
					t.executeSql('select * from diary_food where FIB=? order by NAME COLLATE NOCASE ASC',[rType],
					function(t,results) {
					callback(fixResults(results));
						if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") { callbackOpen(); }
					},callbackOpen);
				// FOOD/EXERCISE LIST
				} else {
					t.executeSql('select * from diary_food where length(CODE)=14 AND TYPE=? order by NAME COLLATE NOCASE ASC',[rType],
					function(t,results) {
						callback(fixResults(results));
						if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
						if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
					});
				}
		}, callbackOpen);
	} else {
		// FAV LIST
		if(rType == "fav") {
			//t.executeSql('select * from diary_food where FIB=? order by NAME COLLATE NOCASE ASC',[rType],
			var resLs = lib.query("diary_food",function(row) {
				if(row.fib == "fav") { return true; }
			});	
			//console.log(JSON.stringify(resLs));
			callback(fixResults(resLs));
			if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") { callbackOpen(); }
		// FOOD/EXERCISE LIST
		} else {
			var resLs = lib.query("diary_food",function(row) {
				if(row.code.length == 14 && row.type == rType) { return true; }
			});
			//console.log(JSON.stringify(resLs));
			callback(fixResults(resLs));
			if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
			if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
		}
	}
};
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	CONSOLE('setFav(' + data.fib + ")");
	db.transaction(
		function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [data.code]);
			t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
		}
	);
};
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	CONSOLE('afterHide()');
	opaLock = 2;
	$("#appStatusReload").off();
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		//SET CSS TRANSITION
		$('body').css(prefix + "transition-timing-function","ease");
		$('body').css(prefix + "transition-duration",".25s");
		$("body").css("opacity","0");
		$('body').on(transitionend,function(e) { 
			//if logged, reload via callback
			if(window.localStorage.getItem("facebook_username") && window.localStorage.getItem("facebook_logged") && cmd == "clear") {
				$.post("http://mylivediet.com/sync.php", { "sql":" ","uid":window.localStorage.getItem("facebook_userid") }, function(data) {
					if(cmd == "clear") { window.localStorage.clear(); }
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload();
						}
					},250);
				}, "text");
			} else {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload();
						}
					},250);
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
		$("#modalOverlay").css("background-image",prefix + "linear-gradient(#fff,#fefefe)");	
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
		var xcenter = ((window.innerWidth) / 2) - ($("#spinner").width() / 2);
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
	if($("#tempHolder").html() != "") { 
		$(window).on("resize", function(evt) {
			var xcenter = ((window.innerWidth) / 2) - ($("#spinner").width() / 2);
			var ycenter = Math.round(((window.innerHeight) / 1.75));
			$("#spinnerWrapper").css("left",xcenter + "px");
			$("#spinnerWrapper").css("top",ycenter  + "px");
		});
	}
}
////////////////////
// FOOD DB IMPORT //
////////////////////
function updateFoodDb() {
	if(window.localStorage.getItem("foodDbLoaded") != "done" && !window.localStorage.getItem("startLock")) {
		//reset blocks
		$("#tabMyFavsBlock,#tabMyFoodsBlock,tabMyExercisesBlock").html('<div class="searcheable noContent"><div><em>' + LANG("NO_ENTRIES") + '</em></div></div>');
		var demoRunning = false;
		var dbName = "mylivediet.app";
		if(!demoRunning) {
			//start
			spinner(45);
			window.localStorage.setItem("startLock",true);
			demoRunning = true;
			try {
				if(hasSql) {
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
								window.localStorage.removeItem("startLock");
								syncEntries(window.localStorage.getItem("facebook_userid"));
								demoRunning = false;
								spinner();
							},
							function(error, failingQuery) {
								//failure
								demoRunning = false;
								window.localStorage.removeItem("startLock");
								spinner();
							});
						},200);
					});
				} else {
					$.get("searchdb_" + LANG("LANGUAGE") + ".ls",function(ls) {
						eval(ls);
						lib.commit();
						//success
						window.localStorage.setItem("foodDbLoaded",'done');
						window.localStorage.removeItem("startLock");
						spinner();
						syncEntries(window.localStorage.getItem("facebook_userid"));
						demoRunning = false;
					});			
				}
			//try fail
			} catch(error) {
				spinner();
				demoRunning = false;
				window.localStorage.removeItem("startLock");
			}
		}
	}
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
	getEntries(function(data) {
		var s = "";
		var p = "";
		var rowClass;
		var lastRow = "";
		var lastId  = "";
		var lastPub = 0;
		var langFood = LANG("FOOD");
		var langExer = LANG("EXERCISE");
		var langDel  = LANG("DELETE");
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
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='entryListRow " + rowClass + " day" + dayFormat(dataPublished).split("/").join("x") + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>kcal</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
			// ROW++ (sqlish sort)
			if(lastPub > Number(data[i].published)) {
				s = s + dataHandler;
			} else {
				s = dataHandler + s;
			}
			lastPub = Number(data[i].published);
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
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	//CONSOLE('updateEntriesTime()');	
	getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = Number(data[i].published);
			$("#" + dataPublished).html(dateDiff(dataPublished,(new Date()).getTime()));
		}
	});
}
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesSum() {
	//CONSOLE('updateEntriesSum()');
	var pushTitle = [];
	var lToday = LANG("TODAY");
	var lFood  = LANG("FOOD");
	var lExe   = LANG("EXERCISE");
	getEntries(function(data) {
		for(var m=0, men=data.length; m<men; m++) {
			pushTitle.push({ date: dayFormat(parseInt(data[m].published)).split("/").join("x"),val: data[m].title});
		}

		var eachDay  = [];
		for(var p=0, pen=pushTitle.length; p<pen; p++) {
			if(eachDay.indexOf(pushTitle[p].date) == -1) {
				eachDay.push(pushTitle[p].date);
			}
		}

		var totalDayF;
		var totalDayE;
		var reStyle = '';
		var thisDay;

		for(var d=0, den=eachDay.length; d<den; d++) {
			totalDayF = 0;
			totalDayE = 0;
			for(var x=0, xen=pushTitle.length; x<xen; x++) {
				if(eachDay[d] == pushTitle[x].date) {
					if(pushTitle[x].val > 0)  {
						totalDayF = totalDayF + parseInt(pushTitle[x].val);
					} else {
						totalDayE = totalDayE + parseInt(pushTitle[x].val);	
					}
				}
			}
			if(eachDay[d] == dayFormat(new Date().getTime()).split("/").join("x")) {
				thisDay = lToday;
			} else {
				thisDay = eachDay[d];
			}

			reStyle = reStyle + '\
			#entryList div.day' + eachDay[d] + ' { border-top: 21px solid #eee; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ' { margin-top: 0px; border-top: 0px solid #eee; }\
			#entryList div.day' + eachDay[d] + ':before { content: "' + lFood + ': ' + totalDayF + '  /  ' + lExe + ': ' + totalDayE + '"; color: #bbb; position: absolute; top: -18px; right: 9px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':before { content: "";  }\
			#entryList div.day' + eachDay[d] + ':after { content: "' + thisDay.split("x").join("/") +'"; color: #999; position: absolute; top: -18px; left: 15px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':after { content: "";  }\
			'; 
		}
		//OUTPUT
		$("#daySum").html(reStyle);
	});
}
///////////////////
// BALANCE METER //
///////////////////
function balanceMeter(kcalsInput) {
	var balancePos = 0;
	if(kcalsInput == 0) {
		balancePos = '50%';
	} else if(kcalsInput > 600) {
		balancePos = '0';
	} else if(kcalsInput < -600) {
		balancePos = '100%';
	} else {
		balancePos = 100 - (((parseFloat(kcalsInput)+600)/12) ) + "%";
	}
	$("#balanceBar").css("text-indent",balancePos);
}
/////////////////////
// BUILD HELP MENU //
/////////////////////
function buildHelpMenu() {
	//insert menu
	$("#optionHelp").addClass("activeRow");
	$("#appContent").append("<div id='appHelper'></div>");
	//STARTLOCK
	var startLock = 1;
	//BUILD CONTENT ARRAY
	var helpTopics = LANG("HELP_TOPICS_ARRAY");
	var helpHtml   = "";
	var topicId    = 0;
	$.each(helpTopics, function(key, value) {
		if(key && value) {
			topicId++;
			helpHtml = helpHtml + "<li id='topic" + topicId + "'>" + key + "<div class='topicTitle'>" + key + "</div><div class='topicContent'>" + value + "</div></li>";
		}
	});
	//INSERT TOPIC LIST
	$("#appHelper").html('<h2><span id="backButton"></span><div id="helpTitle">' + LANG("SETTINGS_HELP") + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$("#appHelper").css("opacity","1");
	},0);
	//SCROLLER
	setTimeout(function() {
		if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4) {
			$("#appHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
		}
		//UNLOCK TAP
		setTimeout(function() {
			startLock = 0;
		},50);
	},250);
	//LIST CLOSER HANDLER
	$("#backButton").on(touchend,function() {
		$("#appHelper").css("opacity",0);
		$('#appHelper').on(transitionend,function() {
			$('#appHelper').remove();
		});
	});
	//TOPIC HANDLERS
	$("#appHelper li").on(touchstart,function(evt) {
		evt.preventDefault();
		$(this).addClass("activeRow");
	});
	$("#appHelper,#appHelper li").on(touchend + " mouseout",function(evt) {
		$(".activeRow").removeClass("activeRow");
		evt.preventDefault();
	});
	//////////////////////////////////
	// content-builder self-handler //
	//////////////////////////////////
	$("#appHelper ul li").on(tap,function(evt) {
		if(startLock != 0) { return; }
		//reapply style
		$(this).addClass("activeRow");
		//PASS CONTENT
		var subTitle   = $("#" + $(this).attr("id") + " .topicTitle").html();
		var subContent = $("#" + $(this).attr("id") + " .topicContent").html();
		//BUILD SUB-CONTENT
		$("#appContent").append('<div id="appSubHelper"><h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2><div id="subHelpContent">' + subContent + '</div></div>');
		///////////////////////////////
		// SUB-CONTENT ANIMATION END //
		///////////////////////////////
		$('#appSubHelper').on(transitionend,function(e) { 
			niceResizer();
			//IF CLOSED
			if(!$('#appSubHelper').hasClass("open")) {
				$('#appSubHelper').remove();
				setTimeout(function() {
					$('#appHelper').css("width","100%");
					//restore visibility
					$(".nicescroll-rails").css("display","block");
				},100);
			//IF OPENED
			} else {
				$(".activeRow").removeClass("activeRow");
				//SCROLLER
				if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4) {
					setTimeout(function() {
						$("#appSubHelper").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
					},100);
				} else {
					//wp8 transision
					$("#appSubHelper").css("overflow","auto");
				}
			}
			setTimeout(function() {
				$('#appSubHelper').css("width","100%");
			},100);
		});
		//SUB-CONTENT HANDLERS
		$("#subBackButton").on(touchend,function() {
			//remove
			$("#appSubHelper").removeClass("open");
			$("#appHelper").removeClass("out");
			//hide on transision
			$(".nicescroll-rails").css("display","none");
		});
		//////////////////////
		// OPEN SUB-CONTENT //
		//////////////////////
		setTimeout(function() {
			//smooth transition (wp8)
			$("#appSubHelper").css("overflow","hidden");
			$("#appSubHelper").addClass("open");
			$("#appHelper").addClass("out");
			//$("#appContent").getNiceScroll().remove();
		},50);
	});
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer() {
	//CONSOLE('niceResizer()');
	if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4) {
		$("#appContent").getNiceScroll().resize();
		$("#foodList").getNiceScroll().resize();
		$("#appHelper").getNiceScroll().resize();
		$("#appSubHelper").getNiceScroll().resize();
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
	document.addEventListener("deviceready", onDeviceReady, false);
}
//////////////////////////
// REFRESH LOGIN STATUS //
//////////////////////////
function updateLoginStatus(sync) {
	FB.getLoginStatus(function(response) {
		if(response.status == 'connected') {
			//window.localStorage.setItem("facebook_logged",true);
			//$("#appFooter").addClass("appFacebook");
			//window.localStorage.setItem("facebook_userid",response.authResponse.userId);
			//alert(response.authResponse.userId);
			//alert(JSON.stringify(response));
			//alert('logged in');
			FB.api('/me', function(me) {
				if(me.id && me.name) {
					var facebook_userid   = me.id;
					var facebook_username = me.name;
					window.localStorage.setItem("facebook_logged",true);
					window.localStorage.setItem("facebook_userid",facebook_userid);
					window.localStorage.setItem("facebook_username",facebook_username);	
					$("#appFooter").addClass("appFacebook");
					$("body").addClass("appFacebook");
					$("#optionFacebook span").html(LANG("SETTINGS_FACEBOOK_LOGGED") + window.localStorage.getItem("facebook_username"));
					if(sync == 1) { syncEntries(window.localStorage.getItem("facebook_userid")); }
				}
			});
		} else {
			//alert('not logged in');
			$("#optionFacebook span").html(LANG("SETTINGS_FACEBOOK"));
			window.localStorage.removeItem("facebook_logged");
			window.localStorage.removeItem("facebook_userid");
			window.localStorage.removeItem("facebook_username");	
			$("#appFooter").removeClass("appFacebook");
			$("body").removeClass("appFacebook");
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
if(FB) {
	if(isCordova()) {
		document.addEventListener("deviceready",function() { FB.init({appId: '577673025616946', nativeInterface: CDV.FB, useCachedDialogs: false }); afterInit(); }, false);
		document.addEventListener("resume",function()      { afterInit(); }, false);
	} else {
		$(document).ready(function() { FB.init({appId: '577673025616946', status: true, cookie: true, xfbml: true}); afterInit(); });
	}
}

