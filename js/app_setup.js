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
			setTimeout(function() { NProgress.done(); spinner('stop'); },6000);
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

function loaded () {
	myScroll = new IScroll('#wrapper', {
		scrollX: true,
		scrollY: false,
		momentum: false,
		snap: true,
		snapSpeed: 600,
		snapThreshold:.2,
		keyBindings: true,
		//bindToWrapper: true,
		indicators: {
			el: document.getElementById('indicator'),
			resize: false
		}
	});
}	

function showIntro() {
	$("#gettingStarted").remove();
	$("body").append("<div id='gettingStarted'>\
		<div id='appInfo'>" + LANG.APP_INTRO[lang] + "</div>\
		<div id='step1'><span>1</span>" + LANG.STEP_1[lang] + "</div>\
		<div id='step2'><span>2</span>" + LANG.STEP_2[lang] + "</div>\
		<div id='step3'><span>3</span>" + LANG.STEP_3[lang] + "</div>\
		<div id='closeDiv'>" + LANG.CLOSE_INTRO[lang] + "</div>\
		<div id='appLang'>" + LANG.LANGUAGE_NAME[lang] + "</div>\
	</div>");
	$("#closeDiv").on(touchend,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		$("#gettingStarted").fadeOut(200,function() {
			$("#gettingStarted").remove();
			getAnalytics('newInstall');
		});
	});
	$("#gettingStarted").on(touchstart,function(evt) {
		evt.stopPropagation();
	});
	$("#appLang").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		buildLangMenu('intro');
	});

$("#appInfo").remove();
$("#step1").remove();
$("#step2").remove();
$("#step3").remove();
//$("#closeDiv").remove();

$("#gettingStarted").prepend('\
<div id="viewport">\
	<div id="wrapper">\
		<div id="scroller">\
			<div class="slide" id="slide1">\
				<div class="painting giotto"></div>\
			</div>\
			<div class="slide" id="slide2">\
				<div class="painting leonardo"></div>\
			</div>\
			<div class="slide" id="slide3">\
				<div class="painting gaugin"></div>\
			</div>\
			<div class="slide" id="slide4">\
				<div class="painting warhol"></div>\
			</div>\
		</div>\
	</div>\
</div>\
<div id="indicator">\
	<div id="dotty"></div>\
</div>')

$("#slide1").html(LANG.STEP_1[lang]);
$("#slide2").html(LANG.STEP_2[lang]);
$("#slide3").html(LANG.STEP_3[lang]);
$("#slide4").html(LANG.CLOSE_INTRO[lang]);

	$("#slide4").on(touchstart + " click",function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
			$("#gettingStarted").fadeOut(200,function() {
			$("#gettingStarted").remove();
			getAnalytics('newInstall');
		});
		return false;
	});


	$(window).on("resize",function() {
		$("#indicator").css("left",( ($("body").width() - $("#indicator").width()) / 2) + 'px');
	});
	$(window).trigger("resize");


setTimeout(function() {	
loaded();
},100);


}




function initDB(t) {
	////////////////////////////
	// GETTING STARTED DIALOG //
	////////////////////////////
	if(!window.localStorage.getItem("config_kcals_day_0") || window.localStorage.getItem("config_debug") == "active") {
		showIntro();
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
	//CONSOLE('initDB');
/////////////////////////////////////////
//	//if not sql already, dont use sql //
/////////////////////////////////////////
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
	///////////////////
	// CREATE TABLES //
	///////////////////
	if(hasSql) {
		t.executeSql('CREATE TABLE if not exists diary_entry(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, title TEXT, body TEXT, published VARCHAR UNIQUE,info TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
		//t.executeSql('CREATE TABLE if not exists diary_food(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,code VARCHAR UNIQUE,name TEXT,term TEXT,kcal TEXT,pro TEXT,car TEXT,fat TEXT,fib TEXT);');
	} else {
		if(!lib.tableExists("diary_entry")) {
			lib.createTable("diary_entry", ["title", "body", "published", "info", "kcal", "pro", "car", "fat", "fib"]);
			lib.commit();
		}
		if(!lib2.tableExists("diary_food")) {
			lib2.createTable("diary_food",  ["type",  "code", "name", "term", "kcal", "pro", "car", "fat", "fib"]);
			lib2.commit();
		}
		startApp();
	}
};
/////////////////
// FIX RESULTS //
/////////////////
function fixResults(res) {
	//CONSOLE('fixResults');
	if(!res) { return; }
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
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('select * from diary_entry order by published desc',[],
			function(t,results) {
				callback(fixResults(results));
			},dbErrorHandler);
		});
	} else {
		callback(lib.query("diary_entry"));
	}
}
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries(userId) {
	if(isNaN(userId)) { return; }
	if(window.localStorage.getItem("pendingSync")) { return; }
	fetchEntries(function(data) {
		//NProgress.done();
		//NProgress.start();
		//$("#nprogress .bar").css("background-color","rgba(0, 0, 0, .15)");
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
			$.post("http://kcals.net/sync.php", { "sql":fetchEntries,"uid":userId }, function(data) {
				//clear marker
				window.localStorage.removeItem("lastEntryPush");
				NProgress.done();
			}, "text");
		}
	});
}
function setPush() {
	if(window.localStorage.getItem("facebook_logged")) { updateFoodDb(); }
	window.localStorage.setItem("lastEntryPush",new Date().getTime());
}
//#//////////////////////#//
//# ONLINE: SYNC ENTRIES #//
//#//////////////////////#//
function setComplete() {
	//nprogress
	NProgress.done();
	//set complete
	window.localStorage.removeItem("pendingSync");
	if(window.localStorage.getItem("foodDbLoaded") != "done") {
		updateFoodDb();
	} else {
		setPush();
	}
	//refresh tabs
	if(!$("#pageSlideFood").is(":animated") && !$("#pageSlideFood").hasClass("open")) {
		if(window.localStorage.getItem("app_last_tab") == "tab1") { $("#tab1").trigger(touchstart); }
		if(window.localStorage.getItem("app_last_tab") == "tab2") { updateEntries();                }
		if(window.localStorage.getItem("app_last_tab") == "tab3") { $("#tab3").trigger(touchstart); }	
		if(window.localStorage.getItem("app_last_tab") == "tab4") { $("#tab4").trigger(touchstart); }
	}
	//dump diary_food data
	if(typeof updateFavList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
		updateFavList();
		updateFoodList();
		updateExerciseList();
	}
	//update last sync date
	window.localStorage.setItem("lastSync",Number((new Date()).getTime()));
	$("#optionLastSync span").html(dtFormat(Number(window.localStorage.getItem("lastSync")))); 
}
function syncEntries(userId) {
	if(window.localStorage.getItem("facebook_logged")) { updateFoodDb(); }
	window.localStorage.setItem("pendingSync",new Date().getTime());
	if(isNaN(userId)) { return; }
	if(!window.localStorage.getItem("facebook_logged")) { return; }
	if(!window.localStorage.getItem("facebook_userid")) { return; }
	var demoRunning = false;
	if(!demoRunning) {
		demoRunning = true;
		NProgress.start();
		//get remote sql
		$.get("http://kcals.net/sync.php?uid=" + userId,function(sql) {
			//local storage slice
			if(sql.match('#@@@#')) {
				rebuildLocalStorage(sql.split("\n").pop());
				sql = sql.replace(/\r?\n?[^\r\n]*$/, "");
			}
			//empty but valid result ~ trigger success
			if(trim(sql) == "") {
				window.localStorage.removeItem("pendingSync");
				demoRunning = false;
				NProgress.done();
				setPush();
			} else if(hasSql) {
				//SQL
				html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
				html5sql.process("DELETE FROM diary_entry;" + sql,function() {
					//success
					demoRunning = false;
					setComplete();
				});
			} else {
				//LOCALSTORAGE 
				lib.deleteRows("diary_entry");
				//lib.commit();
				//sqlToJson
				lsql  = sql.split('\n');
				lasql = [];
				for(var s=0, sen=lsql.length; s<sen; s++) {
					lasql.push(lsql[s].replace(",'","','").split("');").join("").split('INSERT OR REPLACE INTO "').join('').split('" VALUES(').join("','"));
				}
				for(var a=0, aen=lasql.length; a<aen; a++) {
					var keyName = lasql[a].split("','");
					//WRITE
					if(keyName[0] == "diary_entry") {
						//lib.insertOrUpdate("diary_entry", {published: keyName[4]},{"id":keyName[1],"title":keyName[2],"body":keyName[3],"published":keyName[4],"info":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
						lib.insert("diary_entry",{"id":keyName[1],"title":keyName[2],"body":keyName[3],"published":keyName[4],"info":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
					}
					if(keyName[0] == "diary_food") {
						lib2.insertOrUpdate("diary_food", {code: keyName[3]},{"id":keyName[1],"type":keyName[2],"code":keyName[3],"name":keyName[4],"term":keyName[5],"kcal":keyName[6],"pro":keyName[7],"car":keyName[8],"fat":keyName[9],"fib":keyName[10]});
					}
				}
				//success
				lib.commit();
				lib2.commit();
				demoRunning = false;
				setComplete();
			}
		});
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
}
//////////////////
// DELETE ENTRY //
//////////////////
function deleteEntry(rid, callback) {
	CONSOLE('deleteEntry(' + rid + ')');
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('delete from diary_entry where id = ?', [rid]);
			setPush();
		});
	} else {
		lib.deleteRows("diary_entry",{id: rid});
		lib.commit();
		setPush();
	}
}
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data) {
	getRateDialog();
	//if(!data.published) { data.published = 'quicksave'; }
	//CONSOLE('saveEntry(' + data.published + ')');
	if(hasSql) {
		db.transaction(function(t) {
			//UPDATE BODY
			if(data.id && !data.title) {
				t.executeSql('update diary_entry set body=? where id=' + data.id, [data.body]);
				setPush();
			//UPDATE TITLE
			} else if(data.id && data.title) {
				t.executeSql('update diary_entry set title=? where id=' + data.id, [data.title]);
				setPush();
			//INSERT FULL
			} else if(data.pro || data.car || data.fat) {
				t.executeSql('insert into diary_entry(title,body,published,pro,car,fat) values(?,?,?,?,?,?)', [data.title,data.body,data.published,data.pro,data.car,data.fat]); 
				setPush();
			//INSERT QUICK
			} else {
				t.executeSql('insert into diary_entry(title,body,published) values(?,?,?)', [data.title,data.body,data.published]); 
				setPush();
			} 
		});
	} else {
		//UPDATE BODY
		if(data.id && !data.title) {
			lib.update("diary_entry", {"id": data.id}, function(row) {
				row.body = data.body;
				return row;
			});
			lib.commit();
			setPush();
		//UPDATE TITLE
		} else if(data.id && data.title) {
			lib.update("diary_entry", {"id": data.id}, function(row) {
				row.title = data.title;
				return row;
			});
			lib.commit();
			setPush();
		//INSERT FULL
		} else if(data.pro || data.car || data.fat) {
			lib.insert("diary_entry", {"title": data.title, "body": data.body, "published": data.published, "pro":data.pro, "car":data.car, "fat":data.fat});
			lib.commit();
			setPush();
		//INSERT QUICK
		} else {
			lib.insert("diary_entry", {"title": data.title, "body": data.body, "published": data.published});
			lib.commit();
			setPush();
		}
	}
}
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	CONSOLE('setFood(' + data.act + ' ' + data.code + ")");
	if(hasSql) {
		db.transaction(function(t) {
			if(data.act == "update") {
				t.executeSql('delete from diary_food where CODE = ?', [data.code]);
				t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
			} else {
				t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
			}
		});
	} else {
		if(data.act == "update") {
			lib2.update("diary_food",{code: data.code}, function(row) {
				return {"type":data.type,"code":data.code,"name":data.name,"term":sanitize(data.name),"kcal":data.kcal,"pro":data.pro,"car":data.car,"fat":data.fat,"fib":data.fib};
			});
			lib2.commit();
		} else {
			lib2.insert("diary_food", {"type":data.type,"code":data.code,"name":data.name,"term":sanitize(data.name),"kcal":data.kcal,"pro":data.pro,"car":data.car,"fat":data.fat,"fib":data.fib});
			lib2.commit();
		}
	}
}
//////////////
// GET FOOD //
//////////////
function getFood(fCode,callback) {
	CONSOLE('getFood(' + fCode + ")");
	//console.log('Running getEntries');
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('select * from diary_food where CODE=?', [fCode], function(t,results) { callback(fixResults(results)); });
		});
	} else {
		callback(lib2.query("diary_food", {code: fCode}));
	}
};
/////////////////
// DELETE FOOD //
/////////////////
function delFood(fCode, callback) {
	CONSOLE('delFood(' + fCode + ")");
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [fCode]); 
		});
	} else {
		lib2.deleteRows("diary_food",{code: fCode});
		lib2.commit();
	}
};
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function getCustomList(rType,callback) {
	function callbackOpen() {
		if(!$('#pageSlideFood').is(":animated")) {
			$('#pageSlideFood').addClass("open"); 
			if(!$('#appHeader').hasClass("open")) {
				$('#appHeader').removeClass("closer");
				$('body').removeClass("closer");
			}
		}
	}
	if(arguments.length == 1) { callback = arguments[0]; }
	if(hasSql) {
		db.transaction(function(t) {
			//FAV LIST
			if(rType == "fav") {
				t.executeSql('select * from diary_food where FIB=? order by NAME COLLATE NOCASE ASC',[rType],
				function(t,results) {
					callback(fixResults(results));
					if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1") { callbackOpen(); }
				});
			//FOOD/EXERCISE LIST
			} else {
				t.executeSql('select * from diary_food where length(CODE)=14 AND TYPE=? order by NAME COLLATE NOCASE ASC',[rType],
				function(t,results) {
					callback(fixResults(results));
					if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
					if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
				});
			}
		});
	} else {
		//FAV LIST
		if(rType == "fav") {
			callback(lib2.query("diary_food",{fib: "fav"}));
		//FOOD/EXERCISE LIST
		} else {
			var customItems = lib2.query("diary_food", function(row) { if(row.type == rType && row.code.slice(0, 1) == "c") { return true; }});
			callback(customItems);
		}
			 if(window.localStorage.getItem("lastInfoTab") == "topBarItem-1")							{ callbackOpen(); }
		else if(window.localStorage.getItem("lastInfoTab") == "topBarItem-2" && rType == "food")		{ callbackOpen(); }
		else if(window.localStorage.getItem("lastInfoTab") == "topBarItem-3" && rType == "exercise")	{ callbackOpen(); }
	}
}
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	//CONSOLE('setFav(' + data.fib + ")");
	if(hasSql) {
		db.transaction(function(t) {
			t.executeSql('delete from diary_food where CODE = ?', [data.code]);
			t.executeSql('insert into diary_food(type,code,name,term,kcal,pro,car,fat,fib) values(?,?,?,?,?,?,?,?,?)', [data.type,data.code,data.name,sanitize(data.name),data.kcal,data.pro,data.car,data.fat,data.fib]);
		});
	} else {
		lib2.update("diary_food", {code: data.code}, function(row) {
			row.fib = data.fib;
			return row;
		});
		lib2.commit();
	}
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	CONSOLE('afterHide()');
	noTimer = 'active';
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
			if(window.localStorage.getItem("facebook_logged") && cmd == "clear") {
				$.post("http://kcals.net/sync.php", { "sql":" ","uid":window.localStorage.getItem("facebook_userid") }, function(data) {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
						}
					},250);
					if(cmd == "clear") { window.localStorage.clear(); }
				}, "text");
			} else {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
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
	if(size == 'stop') {
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
		});
		return;
	}
	//////////
	// HTML //
	//////////
	if(!$("#tempHolder").html()) { 
		$("body").prepend('<div id="tempHolder"></div');
		$("#tempHolder").html('<div id="modalOverlay"></div><span id="spinnerMsg">' + LANG.PREPARING_DB[lang] + '</span><div id="spinnerWrapper"><div id="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div>');
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
	if(window.localStorage.getItem("foodDbLoaded") == "done") { return; }
	if(window.localStorage.getItem("foodDbLoaded") != "done" && window.localStorage.getItem("startLock") != "running") {
		//reset blocks
		$("#tabMyFavsBlock,#tabMyFoodsBlock,#tabMyExercisesBlock").html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		var demoRunning = false;
		//var dbName = "mylivediet.app";
		if(!demoRunning) {
			//start
			demoRunning = true;
			window.localStorage.setItem("startLock","running");
			spinner(45);
			//WEBSQL
			if(hasSql) {
				html5sql.openDatabase(dbName, dbName + "DB", 5*1024*1024);
				//import sql
				var dbLang = (LANG.LANGUAGE[lang] == "pt") ? "pt" : "en";
				$.get("searchdb_" + dbLang + ".sql",function(sql) {
					html5sql.process(sql,function() {
						//success
						demoRunning = false;
						window.localStorage.setItem("foodDbLoaded","done");
						window.localStorage.removeItem("startLock");
						setTimeout(function() { spinner('stop'); },0);
						setTimeout(function() { spinner('stop'); },100);
						syncEntries(window.localStorage.getItem("facebook_userid"));
					},
					function(error, failingQuery) {
						//failure
						demoRunning = false;
						window.localStorage.removeItem("foodDbLoaded");
						window.localStorage.removeItem("startLock");
						setTimeout(function() { spinner('stop'); },0);
						setTimeout(function() { spinner('stop'); },100);
					});
				});
			//LOCALSTORAGE
			} else {
				var dbLang = (LANG.LANGUAGE[lang] == "pt") ? "pt" : "en";
				$.get("searchdb_" + dbLang + ".ls",function(ls) {
					eval(ls);
					lib2.commit();
					//success
					demoRunning = false;
					window.localStorage.setItem("foodDbLoaded","done");
					window.localStorage.removeItem("startLock");
					setTimeout(function() { spinner('stop'); },0);
					setTimeout(function() { spinner('stop'); },100);
					syncEntries(window.localStorage.getItem("facebook_userid"));
				});			
			}
		}
	}
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	//CONSOLE('pageLoad(' + target + ')');	
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
		var langFood = LANG.FOOD[lang];
		var langExer = LANG.EXERCISE[lang];
		var langDel  = LANG.DELETE[lang];
		var langKcal = LANG.KCAL[lang];
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
				<p class='entriesKcals'>" + langKcal + "</p>\
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
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
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
//////////////////////////////
// UPDATE CSS HEADING *SUM* //
//////////////////////////////
function updateEntriesSum() {
	//CONSOLE('updateEntriesSum()');
	var pushTitle = [];
	var lToday = LANG.TODAY[lang];
	var lFood  = LANG.FOOD[lang];
	var lExe   = LANG.EXERCISE[lang];
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
	kcalsInput = kcalsInput*-1;
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
	var helpTopics = LANG.HELP_TOPICS_ARRAY[lang];
	var helpHtml   = "";
	var topicId    = 0;
	$.each(helpTopics, function(key, value) {
		if(key && value) {
			topicId++;
			helpHtml = helpHtml + "<li id='topic" + topicId + "'>" + key + "<div class='topicTitle'>" + key + "</div><div class='topicContent'>" + value + "</div></li>";
		}
	});
	//INSERT TOPIC LIST
	$("#appHelper").html('<h2><span id="backButton"></span><div id="helpTitle">' + LANG.SETTINGS_HELP[lang] + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$("#appHelper").css("opacity","1");
	},0);
	//SCROLLER
	setTimeout(function() {
		if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
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
				if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
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
/////////////////////////
// BUILD ADVANCED MENU //
/////////////////////////
function buildAdvancedMenu() {
	//evt.preventDefault();
	$("#advancedMenuWrapper").remove();
	$("#appContent").append("\
	<div id='advancedMenuWrapper'>\
		<div id='advancedMenuHeader'>\
			<div id='backButton'></div>\
			<div id='advancedMenuTitle'>" + LANG.SETTINGS_ADDITIONAL[lang] + "</div>\
			</div>\
		<div id='advancedMenu'></div>\
	</div>");
	
//
	$("#advancedMenu").html("<ul id='advancedMenuList'>\
		<li id='appMode'><input id='appModeToggle' type='checkbox' /></li>\
		<li id='setms'>Bahasa Melayu</li>\
		<li id='setcs'>Čeština</li>\
		<li id='setda'>Dansk</li>\
		<li id='setde'>Deutsch</li>\
		<li id='setet'>Eesti</li>\
		<li id='seten'>English</li>\
		<li id='setes'>Español</li>\
		<li id='setfr'>Français</li>\
		<li id='setga'>Gaeilge</li>\
		<li id='sethr'>Hrvatski</li>\
		<li id='setit'>Italiano</li>\
		<li id='sethu'>Magyar</li>\
		<li id='setnl'>Nederlands</li>\
		<li id='setnb'>Norsk</li>\
		<li id='setpl'>Polski</li>\
		<li id='setpt'>Português</li>\
		<li id='setro'>Română</li>\
	</ul>\
	<ul>\
		<li id='setid'>Contat</li>\
		<li id='setid'>About</li>\
	</ul>\
	<ul>\
		<li id='listReset'>Reset settings</li>\
	</ul>\
	");


	//set default
	if(!window.localStorage.getItem("appMode")) {
		window.localStorage.setItem("appMode","direct");
	}
		

	//read stored
	if(window.localStorage.getItem("appMode") == "inverted") {
		$("#appModeToggle").prop('checked',true);
	}

	//read changes
	$('#appModeToggle').on("change",function(obj) {
		if($('#appModeToggle').prop('checked')) {
			appMode = "inverted";
			window.localStorage.setItem("appMode","inverted");
			$("body").removeClass("direct");
			$("body").addClass("inverted");
		} else {
			appMode = "direct";
			window.localStorage.setItem("appMode","direct");
			$("body").removeClass("inverted");
			$("body").addClass("direct");
		}
	});




//	$('input[type=checkbox]').on("change",function(obj) {
//		alert( $(this).prop('checked') );
//		$(this).prop('checked')
		//alert( $(obj).parent('div').attr('id') );
//	});

	

	//set css
	$("#advancedMenu").css("top",$("#advancedMenuHeader").height() + "px");	
	//show content
	$("#advancedMenuWrapper").hide();
	$("#advancedMenuWrapper").fadeIn(200,function() {
		//scroller
		if(!isMobile.iOS() || opt == "intro") {
			if(androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.FirefoxOS()) {
				$("#advancedMenu").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
			} else {
				$("#advancedMenu").css("overflow","auto");
			}
		}
	});
	/////////////
	// handler //
	/////////////
	//LIST CLOSER HANDLER
	$("#backButton").on(touchend,function() {
		$("#advancedMenuWrapper").fadeOut(200,function() {
			$('#advancedMenuWrapper').remove();
		});
	});


	//checkbox toggle handler
	$("#advancedMenu li").on(tap,function(evt) {
		if(!isMobile.iOS()) {
		//	evt.preventDefault();
		}
		//toggle class if !checkbox
		if((/checkbox/).test($(this).html())) {
			$('input[type=checkbox]', this).trigger('click');
			//evt.preventDefault();
		//	evt.stopPropagation();
		}
	});
	//TOPIC HANDLERS	
	$("#advancedMenu li").on(touchstart,function(evt) {
		if(!isMobile.iOS()) {
			//evt.preventDefault();
		}
		//toggle class if !checkbox
		if(!(/checkbox/).test($(this).html())) {
			$(this).addClass("activeRow");
		}
	});
	$("#advancedMenu,#advancedMenu li").on(touchend + " " + touchmove + "mouseout scroll",function(evt) {
		$(".activeRow").removeClass("activeRow");
		//evt.preventDefault();
		//evt.stopPropagation();
	});

	$("#advancedMenu").on("scroll",function(evt) {
//		$(".activeRow").removeClass("activeRow");
		//evt.preventDefault();
		//evt.stopPropagation();
	});

/*
	$("#langSelect").remove();
	//intro
	if(opt == "intro") {
		$("body").append("<div id='langSelect'></div>");
	} else {
		$("#appContent").append("<div id='langSelect'></div>");
	}
	$("#langSelect").html("<ul id='langSelectList'>\
		<li id='setid'>Bahasa Indonesia</li>\
		<li id='setms'>Bahasa Melayu</li>\
		<li id='setcs'>Čeština</li>\
		<li id='setda'>Dansk</li>\
		<li id='setde'>Deutsch</li>\
		<li id='setet'>Eesti</li>\
		<li id='seten'>English</li>\
		<li id='setes'>Español</li>\
		<li id='setfr'>Français</li>\
		<li id='setga'>Gaeilge</li>\
		<li id='sethr'>Hrvatski</li>\
		<li id='setit'>Italiano</li>\
		<li id='sethu'>Magyar</li>\
		<li id='setnl'>Nederlands</li>\
		<li id='setnb'>Norsk</li>\
		<li id='setpl'>Polski</li>\
		<li id='setpt'>Português</li>\
		<li id='setro'>Română</li>\
		<li id='setsk'>Slovenčina</li>\
		<li id='setsl'>Slovenščina</li>\
		<li id='setfi'>Suomi</li>\
		<li id='setsv'>Svenska</li>\
		<li id='setvi'>Tiếng Việt</li>\
		<li id='settr'>Türkçe</li>\
		<li id='setel'>Ελληνικά</li>\
		<li id='setbg'>Български</li>\
		<li id='setru'>Русский</li>\
		<li id='setuk'>Українська</li>\
		<li id='setar'>العربية</li>\
		<li id='sethi'>हिन्दी</li>\
		<li id='sethy'>հայերեն</li>\
		<li id='setth'>ไทย</li>\
		<li id='setko'>한국어</li>\
		<li id='setzh'>中文（简体中文）</li>\
		<li id='setja'>日本語</li>\
	</ul>");
	//intro
	if(opt == "intro") { 
	$("#langSelect").css("z-index",100);
		//pad
		if($("body").hasClass("ios7")) {
			$("#langSelect").css("padding-top","20px");
		}
	}
	//mark current
	$("#set" + window.localStorage.getItem("devSetLang")).addClass("set");
	//show content
	$("#langSelect").hide();
	$("#langSelect").fadeIn(200,function() {
		//scroller
		if(!isMobile.iOS() || opt == "intro") {
			if(androidVersion() < 4.4 && !isMobile.Windows()) {
				$("#langSelect").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
			}
		}
	});
	/////////////
	// handler //
	/////////////
	$("#langSelect li").on(tap,function(evt) {
		window.localStorage.setItem("devSetLang",$(this).attr("id").replace("set",""));
		//remark
		$(".set").removeClass("set");
		$(this).addClass("set");
		//////////////
		// fade out //
		//////////////
		$("#langSelect").fadeOut(200,function() {
			setTimeout(function() {
			$("body").removeClass("appLang-" + lang);
			lang = window.localStorage.getItem("devSetLang");
			$("body").addClass("appLang-" + lang);
			if(lang != "en" && lang != "pt") { 
				LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
			}
			$("#tab1").html(LANG.MENU_STATUS[lang]);
			$("#tab2").html(LANG.MENU_DIARY[lang]);
			$("#tab3").html(LANG.MENU_PROFILE[lang]);
			$("#tab4").html(LANG.MENU_SETTINGS[lang]);
			if(window.localStorage.getItem("app_last_tab") == "tab1") { $("#tab1").trigger(touchstart); }
			if(window.localStorage.getItem("app_last_tab") == "tab2") { $("#tab2").trigger(touchstart); }
			if(window.localStorage.getItem("app_last_tab") == "tab3") { $("#tab3").trigger(touchstart); }
			if(window.localStorage.getItem("app_last_tab") == "tab4") { $("#tab4").trigger(touchstart); }
			//remove
			$("#langSelect").remove();
			//refresh intro
			if(opt == "intro") { 
				showIntro();
			}
			},80);
		});
		//enforce
		setTimeout(function() { $("#langSelect").remove(); },600);
	});
	*/
//	});
}

/////////////////////
// BUILD LANG MENU //
/////////////////////
//dump lang
/*
var langListString = [];
$.each(LANG, function(i, langCode) {
	langListString.push(langCode[lang]);
});
window.localStorage.setItem("langDump",JSON.stringify(langListString));
*/
//pre-process
var langListArray = [];
$.each(LANG.LANGUAGE, function(i, langCode) {
	langListArray.push("<li id='set" + langCode + "'>"+ LANG.LANGUAGE_NAME[langCode] +"</li>");
});
//BUILD ORDERED HTML
langListArray.sort();
var langListCore  = '';
$.each(langListArray, function(l, Langline) {
	langListCore = langListCore + Langline;
});
var langSelectTap;
function buildLangMenu(opt) {
	$("#langSelect").remove();
	//intro
	if(opt == "intro") {
		$("body").append("<div id='langSelect'></div>");
	} else {
		$("#appContent").append("<div id='langSelect'></div>");
	}
	//add auto detect
	langListAutoCore = "<li id='setAuto'>" + LANG.AUTO_DETECT[lang] + " (" + LANG.LANGUAGE_NAME[defaultLang] + ")</li>" + langListCore;
	$("#langSelect").html("<ul id='langSelectList'>" + langListAutoCore + "</ul>");
	//intro
	if(opt == "intro") { 
		$("#langSelect").css("z-index",100);
		//pad
		if($("body").hasClass("ios7")) {
			$("#langSelect").css("padding-top","24px");
		}
	}
	//mark current
	//window.localStorage.setItem("devSetLang",lang);
	if(window.localStorage.getItem("devSetLang")) {
		$("#set" + lang).addClass("set");
	} else {
		$("#setAuto").addClass("set");
	}
	//show content
	$("#langSelect").hide();
	$("#langSelect").stop().fadeIn(200,function() {
		//scroller
		if(!isMobile.iOS() || opt == "intro") {
			if(androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.FirefoxOS()) {
				$("#langSelect").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:false,hwacceleration:true});
			} else {
				$("#langSelect").css("overflow","auto");	
			}
		}
	});
	/////////////
	// handler //
	/////////////
	var blockTap = false;
	var blockTimer;
	$("#langSelect").scroll(function() {
		blockTap = true;
		clearTimeout(blockTimer);
		blockTimer = setTimeout(function() { blockTap = false; },150);
	});
	//FLOOD PROTECTION
	clearTimeout(langSelectTap);	
	langSelectTap = setTimeout(function() {
		$("#langSelect li").on(tap,function(evt) {
			if(blockTap == true) { return; }
			if($(this).attr("id") == "setAuto") {
				window.localStorage.removeItem("devSetLang");
			} else {
				window.localStorage.setItem("devSetLang",$(this).attr("id").replace("set",""));
			}
			//remark
			$(".set").removeClass("set");
			$(this).addClass("set");
			//////////////
			// fade out //
			//////////////
			$("#langSelect").stop().fadeOut(200,function() {
				setTimeout(function() {
				$("body").removeClass("appLang-" + lang);
				if(window.localStorage.getItem("devSetLang")) {
					lang = window.localStorage.getItem("devSetLang");
				} else {
					lang = defaultLang;	
				}
				$("body").addClass("appLang-" + lang);
				if(lang != "en" && lang != "pt") { 
					LANG.HELP_TOPICS_ARRAY[lang] = LANG.HELP_TOPICS_ARRAY['en'];
				}
				$("#tab1").html(LANG.MENU_STATUS[lang]);
				$("#tab2").html(LANG.MENU_DIARY[lang]);
				$("#tab3").html(LANG.MENU_PROFILE[lang]);
				$("#tab4").html(LANG.MENU_SETTINGS[lang]);
				if(window.localStorage.getItem("app_last_tab") == "tab1") { $("#tab1").trigger(touchstart); }
				if(window.localStorage.getItem("app_last_tab") == "tab2") { $("#tab2").trigger(touchstart); }
				if(window.localStorage.getItem("app_last_tab") == "tab3") { $("#tab3").trigger(touchstart); }
				if(window.localStorage.getItem("app_last_tab") == "tab4") { $("#tab4").trigger(touchstart); }
				//start date
				$("#cssStartDate").html("#startDateSpan:before { content: '" + LANG.START_DATE[lang] + "'; }");
				//page title
				$("title").html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
				//heading sum
				updateEntriesSum();
				//remove
				//$("#langSelect").remove();
				//refresh intro
				if(opt == "intro") {
					showIntro();
				}
				},80);
			});
			//enforce
			setTimeout(function() { $("#langSelect").remove(); },600);
		});
	},450);
}
////////////////////
// INTAKE HISTORY //
////////////////////
function intakeHistory() {
	//check exists
	if(window.localStorage.getItem("app_last_tab") != "tab1") { return; }
	//if($('#appStatusIntake div').length === 0) { return; }
	//go
	var firstTick = 0;
	var lastTick  = window.localStorage.getItem("config_kcals_day_0") * 1.5;
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
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer() {
	//CONSOLE('niceResizer()');
	if(!isMobile.iOS() && !isMobile.Windows() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
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
/////////////////////
// GET RATE DIALOG //
/////////////////////
// store url //
///////////////
function getStoreUrl(button) {
	getAnalytics("rate");
	window.localStorage.setItem("getRate","locked");
	if(button == 1) {
             if(isMobile.iOS())       { window.open('https://itunes.apple.com/us/app/mylivediet-realtime-calorie/id732382802?mt=8', '_system', 'location=yes'); }
		else if(isMobile.Android())   { window.open('https://market.android.com/details?id=com.cancian.mylivediet', '_system', 'location=yes');                 }
		else if(isMobile.Windows())   { window.open('http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e', '_system', 'location=yes');     }
		else if(isMobile.FirefoxOS()) { window.open('https://marketplace.firefox.com/app/mylivediet', '_system', 'location=yes');                               }
	}
}
function getRateDialog() {
	//first use
	if(!window.localStorage.getItem("getRate")) {
		window.localStorage.setItem("getRate", new Date().getTime());
	}
	//return
	if(window.localStorage.getItem("getRate") == 'locked' || isDesktop()) { return; }
	///////////////
	// IF 1 WEEK //
	///////////////
	if((new Date().getTime()) - parseInt(window.localStorage.getItem("getRate")) > (60 * 60 * 24 * 7 * 1000)) {
		setTimeout(function() {
			if(isMobile.Cordova()) {
				navigator.notification.confirm(LANG.RATE_MSG[lang], getStoreUrl, LANG.RATE_TITLE[lang], [LANG.RATE_IT[lang],LANG.NO_THANKS[lang]]);
			} else {
				if(confirm(LANG.RATE_MSG[lang])) { getStoreUrl(1); } else { getStoreUrl(0); }
			}
		},3000);
	}
}
///////////////////
// GET ANALYTICS //
///////////////////
var trackString;
var gaPlugin;
function getAnalytics(target) {
	//not dev
	if(window.localStorage.getItem("config_debug")    == "active")		{ return; }
	if(window.localStorage.getItem("facebook_userid") == 1051211303)	{ return; }
	if((/192.168.1.5/).test(document.URL))								{ return; }
	if((/home/).test(document.URL))										{ return; }
	if((/www.cancian/).test(document.URL))								{ return; }
	if(isMobile.OSX() && !isDesktop()) 									{ return; }
	//////////
	// INIT //
	//////////
	function successHandler() {}
	function errorHandler()   {}
	if(target == "init") {
		//ga plugin
		gaPlugin = window.plugins.gaPlugin;
		if(gaPlugin) {
			gaPlugin.init(successHandler, errorHandler, "UA-46450510-1", 10);
		}
		//ga web
		if(ga_storage) {
			ga_storage._setAccount('UA-46450510-2');
		}
	} else {
		////////////////
		// TRACK VARS //
		////////////////
		var deviceType = isDesktop()        ? 'desktop' : 'mobile' ;
		var Cordoving  = isMobile.Cordova() ? 'app' : 'web' ;
		var appOS      = vendorClass;
		if(isMobile.iOS())		{ appOS = "ios";       }
		if(isMobile.Android())	{ appOS = "android";   }
		if(isMobile.Windows())	{ appOS = "windows";   }
		if(isMobile.FirefoxOS()){ appOS = "firefoxos"; }
		if(isMobile.OSX())		{ appOS = "osx";       }
		//track domain/string
		trackString = appOS + "." + deviceType + "." + Cordoving + "/#" + target + "(" + appBuild + ")" + "(" + lang + ")";
		///////////////
		// TRACK EVT //
		///////////////
		//ga plugin
		if(gaPlugin) {
			gaPlugin.trackPage(successHandler, errorHandler, trackString);
			gaPlugin.trackEvent(successHandler, errorHandler, appOS, target, lang, appBuild);
		}
		//ga storage
		if(ga_storage) {
			ga_storage._trackPageview(trackString);
			ga_storage._trackEvent(appOS, target, lang, appBuild);
		}
	}
}
//////////////////////////
// REFRESH LOGIN STATUS //
//////////////////////////
function updateLoginStatus(sync) {
	if(typeof FB !== 'undefined') {
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
					$("#optionFacebook span").html(LANG.SETTINGS_BACKUP_INFO_LOGGED_AS[lang] + window.localStorage.getItem("facebook_username"));
					if(sync == 1) { syncEntries(window.localStorage.getItem("facebook_userid")); }
				}
			});
		} else {
			//alert('not logged in');
			$("#optionFacebook span").html(LANG.SETTINGS_BACKUP_INFO[lang]);
			window.localStorage.removeItem("facebook_logged");
			window.localStorage.removeItem("facebook_userid");
			window.localStorage.removeItem("facebook_username");
			$("#appFooter").removeClass("appFacebook");
			$("body").removeClass("appFacebook");
		}
	});
	}
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
if(isCordova()) {
	document.addEventListener("resume",function()      { afterInit(); getAnalytics('resume'); }, false);
	document.addEventListener("deviceready",function() { 
		if(typeof FB !== 'undefined' && typeof CDV !== 'undefined') { FB.init({appId: '577673025616946', nativeInterface: CDV.FB, useCachedDialogs: false }) };
		afterInit();
		getAnalytics('init');
	}, false);
} else {
	$(document).ready(function() {
		if(typeof FB !== 'undefined') { FB.init({appId: '577673025616946', status: true, cookie: true, xfbml: true}); }
		afterInit(); 
		getAnalytics('init');
	 });
}

