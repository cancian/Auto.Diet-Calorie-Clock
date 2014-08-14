$.support.cors = true;
////////////////
// SHOW INTRO //
////////////////
var myScroll;
function showIntro(isNew) {
	$("#gettingStarted").remove();
	$("body").append('\
	<div id="gettingStarted">\
		<div id="viewport">\
			<div id="wrapper">\
				<div id="scroller">\
					<div class="slide" id="slide1"><p>' + LANG.INTRO_SLIDE_1[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide2"><p>' + LANG.INTRO_SLIDE_2[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide3"><p>' + LANG.INTRO_SLIDE_3[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide4"><p>' + LANG.INTRO_SLIDE_4[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide5"><p>' + LANG.INTRO_SLIDE_5[lang].split(".").join(". ") + '</p></div>\
					<div class="slide" id="slide6"><p>' + LANG.INTRO_SLIDE_6[lang].split(".").join(". ") + '</p><div id="closeDiv">' + LANG.CLOSE_INTRO[lang] + '</div></div>\
				</div>\
			</div>\
		</div>\
		<div id="nextDiv"></div>\
		<div id="prevDiv"></div>\
		<div id="indicator">\
			<div id="dotty"></div>\
		</div>\
		<div id="appLang">'   + LANG.LANGUAGE_NAME[lang] + '</div>\
		<div id="skipIntro">' + LANG.SKIP[lang]          + '</div>\
	</div>');
	//////////////
	// HANDLERS //
	//////////////
	var skipAction = (isMobile.Android() && androidVersion() < 4.4) ? "click" : touchend;
	$("#skipIntro, #closeDiv").on(skipAction,function(evt) {
		evt.stopPropagation();
		$("#gettingStarted").fadeOut(200,function() {
			$("#gettingStarted").remove();
			if(isNew == true) {
				getAnalytics('newInstall');
			}
		});
		if(myScroll) {
			myScroll.destroy();
		}
		evt.preventDefault();
	});
	$("#gettingStarted").on(touchstart,function(evt) {
		evt.stopPropagation();
	});
	$("#appLang").on(touchstart,function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		buildLangMenu('intro');
	});
	///////////////
	// NEXT/PREV //
	///////////////	
	$("#nextDiv").on(touchstart,function(evt) {
		evt.stopPropagation();
		if(myScroll) {
			if(myScroll.currentPage.pageX == 5) {
				$("#skipIntro").trigger(skipAction);	
			}
			myScroll.next();
		}
	});
	$("#prevDiv").on(touchstart,function(evt) {
		evt.stopPropagation();
		if(myScroll) {
			myScroll.prev();
		}
	});
	///////////////
	// INDICATOR //
	///////////////
	$(window).on("resize",function() {
		$("#indicator").css("left",( ($("body").width() - $("#indicator").width()) / 2) + 'px');
	});
	$(window).trigger("resize");
	/////////////
	// ISCROLL //
	/////////////
	setTimeout(function() {
		if($("#gettingStarted").html()) {
			try {
				myScroll = new IScroll('#wrapper', {
					scrollX : true,
					scrollY : false,
					momentum : false,
					snap : 'div',
					snapSpeed : 600,
					snapThreshold : 1 / ($("body").width() * 0.01),
					keyBindings : true,
					//bindToWrapper: true,
					indicators : {
						el : document.getElementById('indicator'),
						resize : false
					}
				});
			} catch(e) {
				console.log('iscroll error');
			}
		}
	}, 500);
}
///////////////////
// INITIAL CACHE //
///////////////////
function loadDatabase() {
	localforage.getItem('diary_entry',function(rows) {
		if(!rows) { rows = []; }
		rowsEntry = rows;
		localforage.getItem('diary_food',function(rows) {
			if(!rows) { rows = []; }
			rowsFood = rows;
			setTimeout(function() {
				//INIT
				startApp();
			},0);
		});
	});
}
////////////////////
// IMPORT ENTRIES //
////////////////////
function importEntries(res) {
	if(!res) { return []; }
	var result = [];
	//FIX SQL RESULTS
	if(hasSql) {
		if(res.rows) {
			for (var i=0; i<res.rows.length; i++) { 
				result.push(res.rows.item(i));
			}
		}
	} else {
		result = res;
	}
	var rowsArray = [];
	for(var r=0, ren=result.length; r<ren; r++) {
		rowsArray.push({
			id:        result[r].id,
			title:     result[r].title,
			body:      result[r].body,
			published: result[r].published,
			info:      result[r].info,
			kcal:      result[r].kcal,
			pro:       result[r].pro,
			car:       result[r].car,
			fat:       result[r].fat,
			fib:       result[r].fib,
		});
	}
	localforage.setItem('diary_entry',rowsArray,function(rows) {
		rowsEntry = rows;
		window.localStorage.removeItem("foodDbLoaded");
		window.localStorage.removeItem("startLock");
		updateFoodDb();
		setTimeout(function() {
			//INIT
			startApp();
		},0);
	});
}
///////////////////
// UPDATE OLD DB //
///////////////////
function updateOldDatabase() {
	$('body').addClass('updtdb');
	try {
		if(hasSql) {
			db = window.openDatabase(dbName, 1, dbName + "DB", 5*1024*1024);
			db.transaction(function(t) {
				t.executeSql('SELECT id, title, body, published, pro, car, fat FROM "diary_entry" ORDER BY published desc',[],function(t,results) {
					importEntries(results);
				}, errorHandler);
			});
		} else {
			lib = new localStorageDB('mylivediet', localStorage);
			importEntries(lib.query('diary_entry'));
		}
	} catch(e) {
		errorHandler(e);
	}
}
/////////////
// INIT DB //
/////////////
function initDB(t) {
	////////////////////
	// IF NEW INSTALL //
	////////////////////
	if(!window.localStorage.getItem("config_kcals_day_0") || window.localStorage.getItem("config_debug") == "active") {
		if(!window.localStorage.getItem("config_install_time")) {
			showIntro(1);
		} else {
			showIntro(0);
		}
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
	if(!window.localStorage.getItem("totalEntries")) {
		window.localStorage.setItem("totalEntries",0);
	}	
	if(!window.localStorage.getItem("totalRecentEntries")) {
		window.localStorage.setItem("totalRecentEntries",0);
	}
	if(!window.localStorage.getItem("appNutrients")) {
		window.localStorage.setItem("appNutrients",'25|50|25');
	}
	if(!window.localStorage.getItem("appNutrientTimeSpan")) {
		window.localStorage.setItem("appNutrientTimeSpan",7);
	}
	if(!window.localStorage.getItem("config_ttf")) {
		window.localStorage.setItem("config_ttf",0);
	}	
	if(!window.localStorage.getItem("config_tte")) {
		window.localStorage.setItem("config_tte",0);
	}		
	if(!window.localStorage.getItem("config_limit_1")) {
		window.localStorage.setItem("config_limit_1",-600);
	}	
	if(!window.localStorage.getItem("config_limit_2")) {
		window.localStorage.setItem("config_limit_2",600);
	}
	if(!window.localStorage.getItem("foodDbVersion") && window.localStorage.getItem("foodDbLoaded") != "done") {
		window.localStorage.setItem("foodDbVersion",3);
	}	
	//////////////////
	// UPDATE CHECK //
	//////////////////
	//DETECT 2.0/1.0
	if(window.localStorage.getItem("foodDbVersion") == 2 || (window.localStorage.getItem("foodDbLoaded") == "done" && !window.localStorage.getItem("foodDbVersion"))) {
		updateOldDatabase();
	} else {
		loadDatabase();
	}
}
////////////////////
// RESET DATA+SQL //
////////////////////
function deSetup(callback) {
	blockAlerts = 1;
	localforage.clear(function() {
		afterHide("clear");
	});
}
///////////////////
// CLEAR ENTRIES //
///////////////////
function clearEntries(callback) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		rowsEntry[i].info = 'deleted';
	}
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		rowsEntry = rows;
		setPush();
		callback();
	});
}
//////////////////////////////
// SQL-ENCODE LOCAL STORAGE //
//////////////////////////////
function localStorageSql() {
	var keyList = "";
	//start
	if(window.localStorage.getItem("config_start_time") && window.localStorage.getItem("appStatus") == "running") {
		keyList = keyList + "#@@@#" + "config_start_time" + "#@@#" + window.localStorage.getItem("config_start_time");
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + window.localStorage.getItem("appStatus");
	} else {
		keyList = keyList + "#@@@#" + "appStatus" + "#@@#" + "stopped";
	}
	//daily
	if(window.localStorage.getItem("config_kcals_type"))  { keyList = keyList + "#@@@#" + "config_kcals_type"  + "#@@#" + window.localStorage.getItem("config_kcals_type");  }
	if(window.localStorage.getItem("config_kcals_day_0")) { keyList = keyList + "#@@@#" + "config_kcals_day_0" + "#@@#" + window.localStorage.getItem("config_kcals_day_0"); }
	if(window.localStorage.getItem("config_kcals_day_1")) { keyList = keyList + "#@@@#" + "config_kcals_day_1" + "#@@#" + window.localStorage.getItem("config_kcals_day_1"); }
	if(window.localStorage.getItem("config_kcals_day_2")) { keyList = keyList + "#@@@#" + "config_kcals_day_2" + "#@@#" + window.localStorage.getItem("config_kcals_day_2"); }
	if(window.localStorage.getItem("config_measurement")) { keyList = keyList + "#@@@#" + "config_measurement" + "#@@#" + window.localStorage.getItem("config_measurement"); }
	if(window.localStorage.getItem("config_limit_1"))     { keyList = keyList + "#@@@#" + "config_limit_1"     + "#@@#" + window.localStorage.getItem("config_limit_1");     }
	if(window.localStorage.getItem("config_limit_2"))     { keyList = keyList + "#@@@#" + "config_limit_2"     + "#@@#" + window.localStorage.getItem("config_limit_2");     }	
	//nutrients
	if(window.localStorage.getItem("appNutrients"))		  { keyList = keyList + "#@@@#" + "appNutrients" + "#@@#" + window.localStorage.getItem("appNutrients"); }
	//mode
	if(window.localStorage.getItem("config_mode"))	      { keyList = keyList + "#@@@#" + "config_mode"  + "#@@#" + window.localStorage.getItem("config_mode"); }
	//notes
	if(window.localStorage.getItem("appNotes")) { 
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + window.localStorage.getItem("appNotes").replace(/(\n|\r\n)/g, "#@#").split("/*").join("/ *");
	} else {
		keyList = keyList + "#@@@#" + "appNotes" + "#@@#" + "";
	}
	//form
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
	for(i=0; i<lsp.length; i++) {
		lsPart = lsp[i].split("#@@#");
		if(lsPart[0]) {
			if(lsPart[0] == "appNotes") {
				window.localStorage.setItem(lsPart[0],lsPart[1].split("#@#").join("\n"));
			} else if(lsPart[0] == "config_mode") {
				if(window.localStorage.getItem("config_mode") != "full") {
					window.localStorage.setItem(lsPart[0],lsPart[1]);
				}
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
function fetchEntries(callback) {
	callback(rowsEntry.sortbyattr('published','desc'));
}
//#//////////////////////#//
//# ONLINE: PUSH ENTRIES #//
//#//////////////////////#//
function pushEntries(userId) {
	if(isNaN(userId))                              { return; }
	if(window.localStorage.getItem("pendingSync")) { return; }
	fetchEntries(function(data) {
		var fetchEntries = '';
		var newLineFetch = '';
		var allFetchIds  = [];
		var id;
		var title;
		var body;
		var published;
		var info;
		var kcal;
		var pro;
		var car;
		var fat;
		var fib;
		if(data) {
		for(var i=0, len=data.length; i<len; i++) {
			id        = data[i].id;
			title     = data[i].title;
			body      = sanitizeSql(data[i].body);
			published = parseInt(data[i].published);
			info      = data[i].info;
			kcal      = data[i].kcal;
			pro       = data[i].pro;
			car       = data[i].car;
			fat       = data[i].fat;
			fib       = data[i].fib;
			
			if(!body) { body = ''; }
			if(!kcal) { kcal = ''; }
			if(!info) { info = ''; }
			if(!kcal) { kcal = ''; }
			if(!pro)  { pro  = ''; }
			if(!car)  { car  = ''; }
			if(!fat)  { fat  = ''; }
			if(!fib)  { fib  = ''; }

			if(id && published != '' && allFetchIds.indexOf('#' + id + '#') === -1) { 
				newLineFetch = "INSERT OR REPLACE INTO \"diary_entry\" VALUES(" + id + ",'" + title + "','" + body + "','" + published + "','" + info + "','" + kcal + "','" + pro + "','" + car + "','" + fat + "','" + fib + "');\n";
				fetchEntries += newLineFetch; 
				newLineFetch = '';
				allFetchIds.push('#' + id + '#');
				//empty loop
				id        = '';
				title     = '';
				body      = '';
				published = '';
				info      = '';
				kcal      = '';
				pro       = '';
				car       = '';
				fat       = '';
				fib       = '';
			}
		}
		}
		//insert custom diary_food
		if(window.localStorage.getItem("customItemsSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customItemsSql"));
		}
		if(window.localStorage.getItem("customFavSql")) {
			fetchEntries = fetchEntries + trim(window.localStorage.getItem("customFavSql"));
		}
		if(localStorageSql()) {
			fetchEntries = fetchEntries + "\n" + trim(localStorageSql());
		}	
		fetchEntries = fetchEntries.split("undefined").join("");
		fetchEntries = fetchEntries.split("NaN").join("");
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
//#///////////////////#//
//# AUX: SYNC ENTRIES #//
//#///////////////////#//
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
	//update entrylist sum
	updateEntriesSum();
	//update nutri pseudos
	updateNutriRatio();
	//refresh tabs
	appFooter(window.localStorage.getItem("app_last_tab"),1);
	//dump diary_food data
	if(typeof updateCustomList == 'function' && window.localStorage.getItem("foodDbLoaded") == "done") {
		updateCustomList('fav');
		updateCustomList('items');
		getCatList();
	}
	//update last sync date
	window.localStorage.setItem("lastSync",new Date().getTime());
	$("#optionLastSync span").html(dateDiff(window.localStorage.getItem("lastSync"),(new Date().getTime())));
}
///////////////
// ROWS LOOP //
///////////////
function rowsLoop(sqlEntry, hive, callback) {
	if (hive == 'diary_entry') {
		rows = rowsEntry;
	} else {
		rows = rowsFood;
		hive = 'diary_food';
	}
	//////////////////
	// ENTRIES LOOP //
	//////////////////
	for (var i = 0, len = sqlEntry.length; i < len; i++) {
		if (sqlEntry[i]) {
			var allRows = JSON.stringify(rows);
			var lookFor = (hive == 'diary_entry') ? sqlEntry[i][1] : sqlEntry[i][3];
			var rowIndex = (allRows).indexOf(lookFor);
			if (rowIndex !== -1) {
				//////////////
				// ON MATCH //
				//////////////
				for (var x = 0, xen = rows.length; x < xen; x++) {
					if (rows[x]) {
						var rowAttr = (hive == 'diary_entry') ? rows[x].id : rows[x].code;
						if (rowAttr == lookFor) {
							rows[x].id = sqlEntry[i][1];
							if (hive == 'diary_entry') {
								rows[x].title = sqlEntry[i][2];
								rows[x].body = sqlEntry[i][3];
								rows[x].published = parseInt(sqlEntry[i][4]);
								rows[x].info = sqlEntry[i][5];
							} else {
								rows[x].type = sqlEntry[i][2];
								rows[x].code = sqlEntry[i][3];
								rows[x].name = sqlEntry[i][4];
								rows[x].term = sqlEntry[i][5];
							}
							rows[x].kcal = sqlEntry[i][6];
							rows[x].pro = sqlEntry[i][7];
							rows[x].car = sqlEntry[i][8];
							rows[x].fat = sqlEntry[i][9];
							rows[x].fib = sqlEntry[i][10];
							break;
						}
					}
				}
			} else {
				////////////////
				// INSERT NEW //
				////////////////
				if (hive == 'diary_entry') {
					rows.push({
						id        : sqlEntry[i][1],
						title     : sqlEntry[i][2],
						body      : sqlEntry[i][3],
						published : parseInt(sqlEntry[i][4]),
						info      : sqlEntry[i][5],
						kcal      : sqlEntry[i][6],
						pro       : sqlEntry[i][7],
						car       : sqlEntry[i][8],
						fat       : sqlEntry[i][9],
						fib       : sqlEntry[i][10]
					});
				} else {
					rows.push({
						id   : sqlEntry[i][1],
						type : sqlEntry[i][2],
						code : sqlEntry[i][3],
						name : sqlEntry[i][4],
						term : sqlEntry[i][5],
						kcal : sqlEntry[i][6],
						pro  : sqlEntry[i][7],
						car  : sqlEntry[i][8],
						fat  : sqlEntry[i][9],
						fib  : sqlEntry[i][10]
					});
				}
			}
		}
	}
	//UPDATE CACHE
	if (hive == 'diary_entry') {
		rowsEntry = rows;
	} else {
		rowsFood  = rows;		
	}
	////////////////////
	// WRITE CALLBACK //
	////////////////////
	localforage.setItem(hive, rows, function (rows) {
		callback();
	});
}
//////////////////////
// INSERT OR UPDATE //
//////////////////////
function insertOrUpdate(sql, callback) {
	if (!sql || sql == '') {
		callback();
		return;
	}
	/////////////////////
	// POPULATE ARRAYS //
	/////////////////////
	if (sql.match('\n')) {
		sql = sql.split('\n');
	} else {
		var ctts = sql;
		sql = [];
		sql.push(ctts);
	}
	var sqlEntry = [];
	var sqlFood  = [];
	for (var s = 0, sen = sql.length; s < sen; s++) {
		if ((/diary_entry|diary_food/).test(sql[s])) {
			var addTo = (/diary_entry/).test(sql[s]) ? sqlEntry : sqlFood;
			addTo.push(sql[s].replace(",'", "','").split("');").join("").split('INSERT OR REPLACE INTO "').join('').split('" VALUES(').join("','").split("','"));
		}
	}
	//////////////////
	// ENTRIES LOOP //
	//////////////////
	rowsLoop(sqlEntry, 'diary_entry', function () {
		rowsLoop(sqlFood, 'diary_food', function () {
			callback();
		});
	});
}
//##//////////////##//
//## SYNC ENTRIES ##//
//##//////////////##//
function syncEntries(userId) {
	if(window.localStorage.getItem("facebook_logged")) { updateFoodDb(); }
	window.localStorage.setItem("pendingSync",new Date().getTime());
	if(isNaN(userId))                                   { return; }
	if(!window.localStorage.getItem("facebook_logged")) { return; }
	if(!window.localStorage.getItem("facebook_userid")) { return; }
	if($("#nprogress").html()) 							{ return; }
	var demoRunning = false;
	if(!demoRunning) {
		demoRunning = true;
		NProgress.start();
		//get remote sql
		$.get("http://kcals.net/sync.php?uid=" + userId,function(sql) {
			sql = sql.split("undefined").join("");
			//local storage slice
			if(sql.match('#@@@#')) {
				rebuildLocalStorage(sql.split("\n").pop());
				sql = sql.replace(/\r?\n?[^\r\n]*$/, "");
			}
			///////////////////////
			// FAKE VALID RESULT //
			///////////////////////empty but valid result ~ trigger success
			if(trim(sql) == "") {
				demoRunning = false;
				setComplete();
			} else {
				insertOrUpdate(sql,function() {
					demoRunning = false;
					setComplete();					
				});
			}
		});
	}
}
/////////////////
// GET ENTRIES //
/////////////////
function getEntries(callback) {
	var rowsArray = [];
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].info !== 'deleted') {
			rowsArray.push(rowsEntry[i]);
		}
	}
	callback(rowsArray);
}
///////////////
// GET ENTRY //
///////////////
function getEntry(eid,callback) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == eid) {
			callback(rowsEntry[i]);
			break;
		}
	}
}
//#//////////////////#//
//# DB: UPDATE ENTRY #//
//#//////////////////#//
function updateEntry(data,callback) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == data.id) {
			rowsEntry[i].id        = data.id;
			rowsEntry[i].title     = parseInt(data.title);
			rowsEntry[i].body      = data.body;
			rowsEntry[i].published = parseInt(data.published);
			rowsEntry[i].info      = '';
			rowsEntry[i].kcal      = '';
			rowsEntry[i].pro       = data.pro;
			rowsEntry[i].car       = data.car;
			rowsEntry[i].fat       = data.fat;
			rowsEntry[i].fib       = '';
			break;
		}
	}
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		rowsEntry = rows;
		setPush();
		callback();
	});
}
//#//////////////////#//
//# DB: DELETE ENTRY #//
//#//////////////////#//
function deleteEntry(entry) {
	for(var i=0, len=rowsEntry.length; i<len; i++) {
		if(rowsEntry[i].id == entry.id) {
			rowsEntry[i].info = 'deleted';
			break;
		}
	}
	localforage.setItem('diary_entry',rowsEntry,function(rows) {
		//rowsEntry = rows;
		setPush();
	});
}
////////////////
// SAVE ENTRY //
////////////////
function saveEntry(data,callback) {
	/////////////////
	// UPDATE BODY //
	/////////////////
	if(data.id && !data.title) {
		for(var i=0, len=rowsEntry.length; i<len; i++) {
			if(rowsEntry[i].id == data.id) {
				rowsEntry[i].body = data.body;
				break;
			}
		}
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	} else if(data.id && data.title) {
	//////////////////
	// UPDATE TITLE //
	//////////////////
		for(var i=0, len=rowsEntry.length; i<len; i++) {
			if(rowsEntry[i].id == data.id) {
				rowsEntry[i].title = data.title;
				break;
			}
		}
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			setPush();
			if(callback) {
				callback();
			}
		});
	} else if(data.pro || data.car || data.fat) {
	/////////////////
	// INSERT FULL //
	/////////////////
		rowsEntry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: '', kcal: '', pro: data.pro, car: data.car, fat: data.fat, fib: ''});
		//SAVE
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			getRateDialog();
			setPush();
			if(callback) {
				callback();
			}
		});
	} else {
	//////////////////
	// INSERT QUICK //
	//////////////////
		rowsEntry.push({id: parseInt(data.published), title: data.title, body: data.body, published: parseInt(data.published), info: '', kcal: '', pro: '', car: '', fat: '', fib: ''});
		//SAVE
		localforage.setItem('diary_entry',rowsEntry,function(rows) {
			rowsEntry = rows;
			getRateDialog();
			setPush();
			if(callback) {
				callback();
			}
		});
	}
}
//////////////
// SET FOOD //
//////////////
function setFood(data, callback) {
	if(data.act == "update") {
		// UPDATE
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i].code == data.code) {
				rowsFood[i].type = data.type;
				rowsFood[i].code = data.code;
				rowsFood[i].name = data.name;
				rowsFood[i].term = data.term;
				rowsFood[i].kcal = data.kcal;
				rowsFood[i].pro  = data.pro;
				rowsFood[i].car  = data.car;
				rowsFood[i].fat  = data.fat;																																			
				rowsFood[i].fib  = data.fib;
				break;
			}
		}
		localforage.setItem('diary_food',rowsFood,function(rows) {
			rowsFood = rows;
			callback();
		});
	} else {
		rowsFood.push({
			id: new Date().getTime(),
			type:data.type,
			code:data.code,
			name:data.name,
			term:sanitize(data.name),
			kcal:data.kcal,
			pro:data.pro,
			car:data.car,
			fat:data.fat,
			fib:data.fib
		});
		localforage.setItem('diary_food',rowsFood,function(rows) {
			rowsFood = rows;
			callback();
		});
	}
}
//////////////
// GET FOOD //
//////////////
function getFood(fCode,callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].code == fCode) {
			callback(rowsFood[i]);
			break;
		}
	}
}
/////////////////
// DELETE FOOD //
/////////////////
function delFood(fCode, callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].code == fCode) {
			rowsFood.splice(i,1);
			break;
		}
	}
	callback();
	localforage.setItem('diary_food',rowsFood,function(rows) {
		rowsFood = rows;
	});
}
/////////////////////
// GET CUSTOM LIST //
/////////////////////
function callbackOpen() {
	if(!$('#pageSlideFood').is(":animated")) {
		$('#pageSlideFood').addClass("open"); 
		if(!$('#appHeader').hasClass("open")) {
			$('#appHeader').removeClass("closer");
			$('body').removeClass("closer");
		}
	}
}
function getCustomList(listType,callback) {
	//////////////
	// FAV LIST //
	//////////////
	if(listType == "fav") {
		var rowsArray = [];
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i]) {
				if(rowsFood[i].fib == 'fav') {
					rowsArray.push(rowsFood[i]);
				}
			}
		}
		callback(rowsArray.sortbyattr('term'));
	////////////////////////
	// FOOD~EXERCISE LIST //
	////////////////////////
	} else {
		var rowsArray = [];
		for(var i=0, len=rowsFood.length; i<len; i++) {
			if(rowsFood[i]) {
				if(rowsFood[i].code.slice(0, 1) == "c") {
					rowsArray.push(rowsFood[i]);
				}
			}
		}
		callback(rowsArray.sortbyattr('term'));
	}
}
/////////////
// SET FAV //
/////////////
function setFav(data, callback) {
	for(var i=0, len=rowsFood.length; i<len; i++) {
		if(rowsFood[i].code == data.code) {
			rowsFood[i].fib = data.fib;
			break;
		}
	}
	callback();
	localforage.setItem('diary_food',rowsFood,function(rows) {
		rowsFood = rows;
	});
}
///////////////
// AFTERHIDE //
///////////////
var afterHidden;
function afterHide(cmd) {
	noTimer = 'active';
	opaLock = 2;
	clearTimeout(afterHidden);
	afterHidden = setTimeout(function() {
		$("*").off();
		$('*').css('pointer-events','none');
		blockAlerts = 1; 
		//preserve data
		if(window.localStorage.getItem("config_mode")) {
			var configMode = window.localStorage.getItem("config_mode");
		}
		if(window.localStorage.getItem("config_install_time")) {
			var installTime = window.localStorage.getItem("config_install_time");
		}
		//SET CSS TRANSITION
		$('body').css(prefix + "transition-timing-function","ease");
		$('body').css(prefix + "transition-duration",".25s");
		$("body").css("opacity","0");
		$('body').on(transitionend,function(e) { 
			if(isMobile.iOS && hasTouch() && navigator.splashscreen) {
				navigator.splashscreen.show();
			}		
			//
			if(window.localStorage.getItem("facebook_logged") && cmd == "clear") {
				$.post("http://kcals.net/sync.php", { "sql":" ","uid":window.localStorage.getItem("facebook_userid") }, function(data) {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
						}
					},250);
					///////////
					// CLEAR //
					///////////
					if(cmd == "clear") {
						window.localStorage.clear();
						if(configMode) {
							window.localStorage.setItem('config_mode',configMode);
						}
						if(installTime) {
							window.localStorage.setItem('config_install_time',installTime);
						}
					}
				}, "text");
			} else {
					setTimeout(function() { 
						if(androidVersion() >= 4 && window.MyReload) { 
							window.MyReload.reloadActivity();
						} else {
							window.location.reload(true);
						}
					},250);
					///////////
					// CLEAR //
					///////////
					if(cmd == "clear") { 
						window.localStorage.clear();
						if(configMode) {
							window.localStorage.setItem('config_mode',configMode);
						}
						if(installTime) {
							window.localStorage.setItem('config_install_time',installTime);
						}
					}
			}
		});
	},250);
}
/////////////
// SPINNER //
/////////////
function spinner(size) {
	if(!$("#loadMask").length) { $('body').prepend('<div id="loadMask"></div>'); }
	if(size == 'stop') {
		$('body').removeClass('spinnerMask');
		$('body').addClass('started');
		$('#loadMask').css('display','none');
		return;
	} else {
		$('body').addClass('spinnerMask');
		$('body').removeClass('started');
		$('#loadMask').css('display','block');
		$('#loadMask').css('pointer-events','auto');
		$("#loadMask").off().on(touchstart,function(evt) { 
			return false;
		});
	}
}
////////////////////
// FOOD DB IMPORT //
////////////////////
var demoRunning = false;
var foodDbTimer;
function updateFoodDb() {
	if(window.localStorage.getItem("foodDbLoaded") == "done" && !window.localStorage.getItem("foodDbVersion")) { window.localStorage.removeItem("foodDbLoaded"); }
	if(window.localStorage.getItem("foodDbLoaded") == "done") { return; }
	if(window.localStorage.getItem("foodDbLoaded") != "done" && window.localStorage.getItem("startLock") != "running") {
		//reset blocks
		$("#tabMyCatsBlock,#tabMyFavsBlock,#tabMyItemsBlock").html('<div class="searcheable noContent"><div><em>' + LANG.NO_ENTRIES[lang] + '</em></div></div>');
		if(demoRunning == false) {
			//start
			demoRunning = true;
			window.localStorage.setItem("startLock","running");
			clearTimeout(foodDbTimer);
			/////////////////////////
			// PING DEFINE DB PATH //
			/////////////////////////
			var langDB = (lang == "en" && window.localStorage.getItem("config_measurement") == "metric") ? 'em' : lang;
			////////////
			// IMPORT //
			////////////
			function doImport(dbExt) {
				spinner();
				foodDbTimer = setTimeout(function() {
					try{
						$.ajax({type: "GET", dataType: "text", url: hostLocal + "sql/searchdb_" + langDB + dbExt, success: function(ls) {
							var rowsArray = [];
							//PARSE
							ls = ls.split('lib2.insert("diary_food", ').join('');
							ls = ls.split(');').join('');
							ls = ls.split('\n');
							for(var l=0, llen=ls.length; l<llen; l++) {
								rowsArray.push(JSON.parse(ls[l]));
							}
							//REINSERT
							var postCustom = '';
							if(trim(window.localStorage.getItem("customItemsSql")) != '') { postCustom += trim(window.localStorage.getItem("customItemsSql")); }
							if(trim(window.localStorage.getItem("customFavSql"))   != '') { postCustom += trim(window.localStorage.getItem("customFavSql"));   }
							rowsFood = rowsArray;
							localforage.setItem('diary_food',rowsArray,function() {
								insertOrUpdate(postCustom,function() {
									//success
									demoRunning = false;
									window.localStorage.setItem("foodDbLoaded","done");
									window.localStorage.setItem("foodDbVersion",3);
									window.localStorage.removeItem("startLock");
									setTimeout(function() { niceResizer(); },300);
									spinner('stop');
									$('body').removeClass('updtdb');
									if(window.localStorage.getItem("facebook_userid")) {
										syncEntries(window.localStorage.getItem("facebook_userid"));
									} else {
										updateCustomList('fav');
										updateCustomList('items');	
										getCatList();
									}
								});
							});
						}});
					} catch(e) { 
					//failure
					demoRunning = false;
					window.localStorage.removeItem("foodDbLoaded");
					window.localStorage.removeItem("startLock");
					spinner('stop');
					errorHandler(e);
				}
			},100);
		}}
		//////////////////////
		// CALLBACK TRIGGER //
		//////////////////////
		if(isMobile.iOS()) {
			doImport('.db');
		} else {
			var ajaxAction = (isMobile.MSApp()) ? "GET" : "HEAD";
			setTimeout(function() {
				$.ajax({ url: hostLocal + "sql/searchdb_" + langDB + '.db', type: ajaxAction,
					success: function() { doImport('.db');  },
					error: function()   { doImport('.sql'); }
				});
			},100);
		}
	}
}
///////////////////
// PAGE LOAD MOD //
///////////////////
function pageLoad(target,content,published) {
	//if partial
	if(published) {
		var arr = [];		
		var entryPos;
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
				entryPos = i;
			}
		}
		// INSERT PARTIAL
		//overwrite 'no entries'
		if(i == 1) {
			safeExec(function() {
			$("#entryList").html($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
			});
		//match div before
		} else if($("#entryList>div:eq(" + entryPos + ")").html()) {
			safeExec(function() {
				$("#entryList>div:eq(" + entryPos + ")").before($(content).animate({ backgroundColor: "#ffffcc" }, 1 ).animate({ backgroundColor: "#fff" },1000));
			});
		} else {
			//append if none
			safeExec(function() {
				$("#entryList").append($(content).animate({ backgroundColor: "#ffffcc" }, 1).animate({ backgroundColor: "#fff" },1000));
			});
		}
		//target [div#partial] ~time's parent div id as target
		var page = $('#entryList div' + '#' + $("#t" + published).parent('div').attr('id'));
	// FULL DIV REPLACE //
	} else {
		//check existence
		if($(target).html(content)) {
			safeExec(function() {
				$(target).html(content);
			});
		}
		var page = $('#entryList');
	}
	// RELOAD HANDLERS //
	if(page[0]) {
		$(page).trigger("pageload");
	}
	return;
}
///////////////
// FILL DATE //
///////////////
function fillDate(timestamp,element) {
	//time [ datetime-local / 2013-01-01T00:00 ]
	var d = (timestamp != "") ? new Date(Number(timestamp)) : new Date();
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
var partial = '';
function updateEntries(partial,range,callback) {
	var totalEntryS       = parseInt(window.localStorage.getItem('totalEntries'));
	var totalRecentEntryS = parseInt(window.localStorage.getItem('totalRecentEntries'));
	//////////////
	// GET LOOP //
	//////////////
	getEntries(function(data) {
		var s = '';
		var p = '';
		var rowClass;
		var lastRow = '';
		var lastId  = '';
		var lastPub = 0;
		var totalArray = [];
		var langFood = LANG.FOOD[lang];
		var langExer = LANG.EXERCISE[lang];
		var langDel  = LANG.DELETE[lang];
		var langKcal = LANG.KCAL[lang];
		var totalEntries       = 0;
		var totalRecentEntries = 0;
		var totalEntried       = parseInt(window.localStorage.getItem('totalEntries'));
		var totalRecentEntried = parseInt(window.localStorage.getItem('totalRecentEntries'));
		for(var i=0, len=data.length; i<len; i++) {
			// description autofill
			var dataTitle     = parseInt(data[i].title);
			var dataBody      = data[i].body;
			var dataPublished = parseInt(data[i].published);
			// 0 : 1
			if(data[i].body == '') {
                       if(dataTitle > 0) {
					dataBody = langFood;
				} else if(dataTitle < 0) {
					dataBody = langExer;
				} else {
					dataBody = '';
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
			var dataHandler = "\
			<div data-id='" + data[i].id + "' id='" + data[i].id + "' class='entryListRow " + rowClass + " day" + dayFormat(dataPublished).split("/").join("x") + "' name='" + dataPublished + "'>\
				<p class='entriesTitle'>" + dataTitle + "</p>\
				<p class='entriesKcals'>" + langKcal + "</p>\
				<p class='entriesBody'>" + dataBody + "</p>\
				<p id='t" + dataPublished + "' class='entriesPublished'> " + dateDiff(dataPublished,(new Date()).getTime()) + "</p>\
				<span class='delete'>" + langDel + "</span>\
			</div>";
			///////////////////
			// ROW PRELOADER //
			///////////////////
			totalEntries++;
			if((new Date().getTime() - dataPublished) < 60*60*24*5*1000) {
				totalRecentEntries++;
			}
			if(((new Date().getTime() - dataPublished) < 60*60*24*5*1000) || totalEntried < 50 || totalRecentEntried < 20 || range == "full") {
				totalArray.push({dati:dataPublished , dato: dataHandler});
			}
			lastPub = parseInt(data[i].published);
			//partial == last row time
			if(partial == parseInt(data[i].published)) {
				lastRow = dataHandler;
				lastId  = data[i].id;
			}
		}
		///////////////////
		// ORDER BY DATE //
		///////////////////
		totalArray = totalArray.sortbyattr('dati','desc');
		//BUILD OUTPUT
		for(var t=0, ten=totalArray.length; t<ten; t++) {
			s += totalArray[t].dato;
		}
		//////////////
		// CALLBACK //
		//////////////
		if(callback) { 
			if(s != "") {
				openDiary(s);
			} else {
				openDiary('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
			}
		} else {
		////////////////////
		// RETURN CONTENT //
		////////////////////
		if(s != "") {
			if(partial) {
				//IF PARTIAL + nonRepeat
				if($("#" + lastId).html()) {
					$("#" + lastId).remove();
				}
				if(!$("#" + lastId).html()) {
					pageLoad("#entryList",lastRow,partial);
				} else { return false; }
			} else {
				//FULL
				pageLoad("#entryList",s);
				if(range == "full") { niceResizer(200); }
			}
		///////////
		// EMPTY //
		///////////
		} else {
			//PRE-FILL
			$('#entryList').html('<div id="noEntries"><span>' + LANG.NO_ENTRIES[lang] + '</span></div>');
		}}
		//N# OF ENTRIES
		window.localStorage.setItem('totalEntries',totalEntries);
		window.localStorage.setItem('totalRecentEntries',totalRecentEntries);
	});
}
/////////////////////////////
// UPDATE ENTRYLIST *TIME* //
/////////////////////////////
function updateEntriesTime() {
	getEntries(function(data) {
		for(var i=0, len=data.length; i<len; i++) {
			var dataPublished = parseInt(data[i].published);
			$("#t" + dataPublished).html(dateDiff(dataPublished,(new Date()).getTime()));
		}
	});
	//SIDEBAR TIME CLASS
	var currentHour = new Date().getHours();
         if(currentHour <  6) { rowClass = "afterhours"; }
	else if(currentHour < 12) { rowClass = "morning";    }
	else if(currentHour < 18) { rowClass = "afternoon";  }
	else if(currentHour < 24) { rowClass = "night";      }	
	$('body').removeClass(('morning afternoon night afterhours').replace(rowClass));
	$('body').addClass(rowClass);
}
//////////////////////////////
// UPDATE CSS HEADING *SUM* //
//////////////////////////////
function updateEntriesSum() {
	var pushTitle = [];
	var lToday    = LANG.TODAY[lang];
	var lFood     = LANG.FOOD[lang];
	var lExe      = LANG.EXERCISE[lang];
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
			#entryList div.day' + eachDay[d] + ' { border-top: 21px solid #eee;	}\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ' { margin-top: 0px; border-top: 0px solid #eee; }\
			#entryList div.day' + eachDay[d] + ':before { content: "' + lFood + ': ' + totalDayF + '  /  ' + lExe + ': ' + totalDayE + '"; color: #bbb; position: absolute; top: -22px; right: 0px; font-size: 12px; line-height: 16px; background-color: #eee; width: 100%; text-align: right; padding-top: 4px; padding-bottom: 2px; padding-right: 9px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':before { content: ""; padding-top: 0; padding-bottom: 0; }\
			#entryList div.day' + eachDay[d] + ':after { content: "' + thisDay.split("x").join("/") +'"; color: #999; position: absolute; top: -18px; left: 15px; font-size: 12px; line-height: 16px; }\
			#entryList div.day' + eachDay[d] + ' ~ div.day' + eachDay[d] + ':after { content: "";  }\
			'; 
		}
		//OUTPUT
		safeExec(function() {
			$("#daySum").html(reStyle);
		});
	});
}
//#////////////////////////////#//
//# UPDATE NUTRI RATIO PSEUDOS #//
//#////////////////////////////#//
function updateNutriRatio() {
	var appNutrients = window.localStorage.getItem('appNutrients').split('|');
	var proRatio = parseInt(appNutrients[0]);
	var carRatio = parseInt(appNutrients[1]);
	var fatRatio = parseInt(appNutrients[2]);

	var nutrientsStyle = "\
		#appStatusBarsPro span:after	{ content: ' (" + proRatio + "%)' !important; }\
		#appStatusBarsCar span:after	{ content: ' (" + carRatio + "%)' !important; }\
		#appStatusBarsFat span:after	{ content: ' (" + fatRatio + "%)' !important; }\
	";
	//////////
	// EXEC //
	//////////
	safeExec(function() {
		if(!$("#appNutrients").html()) {
			$("head").append("<style type='text/css' id='appNutrients'></style>");
		}
		if($("#appNutrients").html() != nutrientsStyle) {
			$("#appNutrients").html(nutrientsStyle);
		}
	});
}
//#/////////////////#//
//# NUTRI TIME SPAN #//
//#/////////////////#//
function getNutriTimeSpan(entryTime) {
	var now        = (new Date()).getTime();
	var day        = 60 * 60 * 24 * 1000;
	var todaysTime = (new Date(dayFormat(now))).getTime();
	var last7Time  = (new Date(dayFormat(todaysTime - (7*day)))).getTime();
	var last30Time = (new Date(dayFormat(todaysTime - (30*day)))).getTime();
	/////////
	// ALL //
	/////////
	if(window.localStorage.getItem("appNutrientTimeSpan") == 0)  {
		return true;
	}
	///////////
	// TODAY //
	///////////
	else if(window.localStorage.getItem("appNutrientTimeSpan") == 1)  {
		if(dayFormat(entryTime) == dayFormat(now)) {
			return true;
		} else {
			return false;
		}
	}
	////////////
	// LAST 7 //
	////////////
	else if(window.localStorage.getItem("appNutrientTimeSpan") == 7)  {
		if(entryTime > last7Time) {
			return true;
		} else {
			return false;
		}
	}
	/////////////
	// LAST 30 //
	/////////////
	else if(window.localStorage.getItem("appNutrientTimeSpan") == 30) { 
		if(entryTime > last30Time) {
			return true;
		} else {
			return false;
		}
	}
}
//##/////////////////##//
//## BUILD HELP MENU ##//
//##/////////////////##//
var subHelperTimer;
function buildHelpMenu() {
	//insert menu
	$("#optionHelp").addClass("activeRow");
	$("body").append("<div id='appHelper'></div>");
	
	$("#appHelper").hide();
	$("#appHelper").css("top",($("#appHeader").height()) + "px");
	$("#appHelper").height($("#appContent").height());
	$("#appHelper").css("bottom",($("#appFooter").height()) + "px");
	$("#appHelper").show();
	
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
	/////////////////////
	// RE-INSERT INTRO //
	/////////////////////
	var introValue = '<p>' + LANG.INTRO_SLIDE_1[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_2[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_3[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_4[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_5[lang].split(".").join(". ") + '</p>\
	<p>' + LANG.INTRO_SLIDE_6[lang].split(".").join(". ") + '</p>';
	helpHtml = "<li id='topic" + (topicId+1) + "'>" + LANG.INTRO[lang] + "<div class='topicTitle'>" + LANG.INTRO[lang] + "</div><div class='topicContent'>" + introValue + "</div></li>" + helpHtml;
	///////////////////////
	// INSERT TOPIC LIST //
	///////////////////////
	$("#appHelper").html('<h2><span id="backButton"></span><div id="helpTitle">' + LANG.SETTINGS_HELP[lang] + '</div></h2><ul>' + helpHtml + '</ul>');
	//FADE IN
	setTimeout(function() {
		$("#appHelper").css("opacity","1");
		//$("#appHelper").height($("#appContent").height());
	},0);
	//SCROLLER
	setTimeout(function() {
		getNiceScroll("#appHelper");
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
	var touchHelper = 0;
	//TOPIC HANDLERS
	$("#appHelper li").on(touchstart,function(evt) {
		touchHelper = 0;
		//evt.preventDefault();
		$(this).addClass("activeRow");
	});
	$("#appHelper, #appHelper li").on("mouseout mouseleave",function(evt) {
		$(".activeRow").removeClass("activeRow");
		//evt.preventDefault();
	});
	
	$("#appHelper, #appHelper li").on("scroll " + touchmove,function(evt) {
		touchHelper++;
		if(touchHelper > 5 || (touchHelper > 1 && isMobile.Android())) {
			$(".activeRow").removeClass("activeRow");
			touchHelper = 0;
		}
	});
	//////////////////////////////////
	// content-builder self-handler //
	//////////////////////////////////
	$("#appHelper ul li").on(tap,function(evt) {
		if(startLock != 0) { return; }
		if(!$(this).hasClass("activeRow")) { return; }
		//reapply style
		$(this).addClass("activeRow");
		//PASS CONTENT
		var subTitle   = $("#" + $(this).attr("id") + " .topicTitle").html();
		var subContent = $("#" + $(this).attr("id") + " .topicContent").html();
		//BUILD SUB-CONTENT
		$("body").append('<div id="appSubHelper"><h2><span id="subBackButton"></span><div id="subHelpTitle">' + subTitle + '</div></h2><div id="subHelpContent">' + subContent + '</div></div>');
		$("#appSubHelper").hide();
		$("#appSubHelper").css("top",($("#appHeader").height()) + "px");
		$("#appSubHelper").height($("#appContent").height());
		$("#appSubHelper").css("bottom",($("#appFooter").height()) + "px");		
		$("#appSubHelper").show();
		/////////////
		// SUBHIDE //
		/////////////
		$("#appSubHelper").on("scroll",function(evt) {
			$("#appContent").hide();
			clearTimeout(subHelperTimer);
			subHelperTimer = setTimeout(function() {
				$("#appContent").show();
			},100);
		});
		///////////////////////////////
		// SUB-CONTENT ANIMATION END //
		///////////////////////////////
		setTimeout(function() {
			//ios horiz-scrolling crazy bug
			$("#appSubHelper").height($("#appContent").height());
		},0);
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
				getNiceScroll("#appSubHelper");
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
		},50);
	});
}
//##//////////////##//
//## GETNEWwINDOW ##//
//##//////////////##//
function getNewWindow(title,content,handlers,save,closer,direction,bottom,top) {
	if($('#editable').is(':visible')) { $('#editable').trigger("blur"); return; }
	//FLOOD
	if($("#newWindowWrapper").html()) { return; }
	//////////
	// HTML //
	//////////
	$("#newWindowWrapper").remove();
	var newContent = "\
	<div id='newWindowWrapper'>\
		<div id='newWindowHeader'>\
			<div id='backButton'></div>\
			<div id='saveButton'>" + LANG.OK[lang] + "</div>\
			<div id='newWindowTitle'>" + title + "</div>\
			</div>\
		<div id='newWindow'>" + content + "</div>\
	</div>";
	safeExec(function() {
		$("#appContent").after(newContent);
	});
	$("#newWindowWrapper").hide();
	$("#newWindow").hide();
	//configure ui
	if(direction == "sideload") {
		$("#newWindowWrapper").addClass('sideload');
	}
	if(!save) { $("#saveButton").remove(); }

	$("#newWindowWrapper").css("top",($("#appHeader").height()) + "px");
	if(bottom != 'flush') {
		$("#newWindowWrapper").height($("#appContent").height());
		$("#newWindowWrapper").css("bottom",($("#appFooter").height()) + "px");
	} else {
		$("#newWindowWrapper").height($("#appContent").height() + $("#appFooter").height());
		$("#newWindowWrapper").css("bottom",'0px');		
	}
	
	$("#newWindowWrapper").show();
	$("#newWindow").show();
	//
	$("#newWindow").css("top",($("#newWindowHeader").height()+1) + "px");
	$('body').addClass('newwindow');
	$("#newWindowWrapper").addClass('open');
	$("#newWindowWrapper").addClass('busy');
	///////////////////
	// EXEC HANDLERS //
	///////////////////
	if(handlers) {
		safeExec(function() {
			handlers();
		});
	}
	////////////////////
	// TRANSISION END //
	////////////////////
	$("#newWindowWrapper").off().on(transitionend,function() {
		//scroller
		setTimeout(function() {
			if(!isMobile.iOS() && androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS()) {
				var horizScroll = $('#appHistory').html() ? true : false;
				var touchBeh = true;
				getNiceScroll("#newWindow");
				//if(isMobile.Android()) { touchBeh = false; }
				//$("#newWindow").css("overflow","hidden");
				//$("#newWindow").niceScroll({touchbehavior:touchBeh,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:horizScroll,hwacceleration:true});
			} else if(($.nicescroll && isMobile.Windows() || isMobile.MSApp()) && $('#appHistory').html()) {
				$("#newWindow").css("overflow","hidden");
				$("#newWindow").niceScroll({touchbehavior:true,cursorcolor:"#000",cursorborder: "1px solid transparent",cursoropacitymax:0.3,cursorwidth:3,horizrailenabled:true,hwacceleration:false});
			} else {
				$("#newWindow").css("overflow","auto");
			}
			//busy
			$("#newWindowWrapper").removeClass('busy');
		},250);
		///////////////////
		// GLOBAL CLOSER //
		///////////////////
		var timerCloser;
		function windowCloser() {
			if(closer) {
				safeExec(function() {
					closer();
				});
			}
			$('#appContent, #foodSearch, #newWindowWrapper').css('pointer-events','none');
			if($.nicescroll) {
				$("#newWindow").getNiceScroll().remove();
			}
			setTimeout(function() {
				$("#newWindowWrapper").removeClass('open');
				$("#newWindowWrapper").css('opacity',0);
			},50);
			$("#newWindowWrapper").off().on(transitionend,function() {
				$('#newWindowWrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass('newwindow');
				clearTimeout(timerCloser);
				setPush();	
			});	
			timerCloser = setTimeout(function() {
				$('#newWindowWrapper').remove();
				$('#appContent, #foodSearch').css('pointer-events','auto');
				$('body').removeClass('newwindow');
				setPush();				
			},500);
		}
		///////////////////////////////////
		// TRANSITION-PROTECTED HANDLERS //
		///////////////////////////////////
		// SAVE HANDLER //
		//////////////////
		$("#saveButton").off().on(touchend,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			//VALIDATION
			if(save() == true) {
				windowCloser();
			}
		});
		////////////////////
		// CLOSER HANDLER //
		////////////////////
		$("#backButton").off().on(touchend,function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			windowCloser();
		});
	});
}
//##/////////////////##//
//## BUILD LANG MENU ##//
//##/////////////////##//
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
		//$("#appContent").append("<div id='langSelect'></div>");
		$("body").append("<div id='langSelect'></div>");
		$("#langSelect").css("top",($("#appHeader").height()) + "px");
		$("#langSelect").height($("#appContent").height());
		$("#langSelect").css("bottom",($("#appFooter").height()) + "px");
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
		getNiceScroll("#langSelect");
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
				appFooter(window.localStorage.getItem("app_last_tab"),0);
				//start date
				$("#cssStartDate").html("#startDateSpan:before { content: '" + LANG.START_DATE[lang] + "'; }");
				//page title
				$("title").html(LANG.CALORIE_COUNTER_FULL_TITLE[lang]);
				//heading sum
				updateEntriesSum();
				//AUTO UPDATE CSS TITLES
				$("#cssAutoUpdate").html("\
					.loading #advancedAutoUpdate:before	 { content: '" + LANG.DOWNLOADING[lang]     + "';/**/}\
					.pending #advancedAutoUpdate:before	 { content: '" + LANG.RESTART_PENDING[lang] + "'; }\
					.uptodate #advancedAutoUpdate:before { content: '" + LANG.UP_TO_DATE[lang]      + "'; }\
					.spinnerMask #loadMask:before		 { content: '" + LANG.PREPARING_DB[lang]    + "'; }\
				");
				//remove
				//$("#langSelect").remove();
				//refresh intro
				if(opt == "intro") {
					$("#slide1 p").html(LANG.INTRO_SLIDE_1[lang].split(".").join(". "));
					$("#slide2 p").html(LANG.INTRO_SLIDE_2[lang].split(".").join(". "));
					$("#slide3 p").html(LANG.INTRO_SLIDE_3[lang].split(".").join(". "));
					$("#slide4 p").html(LANG.INTRO_SLIDE_4[lang].split(".").join(". "));
					$("#slide5 p").html(LANG.INTRO_SLIDE_5[lang].split(".").join(". "));
					$("#slide6 p").html(LANG.INTRO_SLIDE_6[lang].split(".").join(". "));
					$("#closeDiv").html(LANG.CLOSE_INTRO[lang]);
					$("#appLang").html(LANG.LANGUAGE_NAME[lang]);
					$("#skipIntro").html(LANG.SKIP[lang]);
					//showIntro();
				}
				},80);
			});
			//enforce
			setTimeout(function() { $("#langSelect").remove(); },600);
		});
	},450);
}
//////////////////
// NICE RESIZER //
//////////////////
var niceTimer;
function niceResizer() {
	if($.nicescroll && !isMobile.iOS() && !isMobile.Windows() && !isMobile.MSApp() && androidVersion() < 4.4 && !isMobile.FirefoxOS()) {
		$("#appContent").getNiceScroll().resize();
		$("#foodList").getNiceScroll().resize();
		$("#appHelper").getNiceScroll().resize();
		$("#appSubHelper").getNiceScroll().resize();
		$("#newWindow").getNiceScroll().resize();
		$("#langSelect").getNiceScroll().resize();
		$("#advancedMenuWrapper").getNiceScroll().resize();
	}
}
///////////////////
// GETNICESCROLL //
///////////////////
function getNiceScroll(target) {
	if(!$.nicescroll) { return; }
	var NSettings = { touchbehavior:true, cursorcolor:"rgba(0,0,0,1)", cursorborder: "1px solid rgba(0,0,0,0)", cursoropacitymax:.3, cursorwidth:3, horizrailenabled:false, hwacceleration:true };
	//
	if($('#appHistory').html()) {
		NSettings.horizrailenabled = true;
	}
	//NSettings.hwacceleration        = false;
	//NSettings.touchbehavior         = false;
	//NSettings.nativeparentscrolling = false;
	//NSettings.directionlockdeadzone = 9;	
	//NSettings.enabletranslate3d     = false;
	//NSettings.bouncescroll          = false;
	//NSettings.hwacceleration        = false;
	//NSettings.usetransition         = false;
	//NOTES
	if(target == "#diaryNotesInput") {			
		if(!isMobile.Windows() && !isMobile.MSApp()) {
			$(target).css("overflow","hidden");
			$(target).niceScroll(NSettings);
		} else {
			$(target).css("overflow","auto");
		}
	} else {
		if(!isMobile.iOS() && androidVersion() < 4.4 && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS()) {
			$(target).css("overflow","hidden");
			$(target).niceScroll(NSettings);
		} else {
			$(target).css("overflow","auto");
		}
	}
}
//#/////////////#//
//# APP RESIZER #//
//#/////////////#//
function appResizer(time) {
	setTimeout(function() {
		$('body').height(window.innerHeight);
		//unlock top white gap
		$('body').trigger("touchmove");
		//NO < 0
		var wrapperMinH = (window.innerHeight) - ($('#entryListForm').height() + $('#appHeader').height() + $('#appFooter').height() + $('#entryListBottomBar').height());
		//force scrolling ios
		if(isMobile.iOS()) { wrapperMinH = wrapperMinH + 1; }
		if(wrapperMinH < 0) {
			wrapperMinH = 0;
		}
		$('#entryListWrapper').css("height","auto");
		$('#entryListWrapper').css("min-height",wrapperMinH + "px");
		$("#appHelper").height($("#appContent").height());
		$("#appSubHelper").height($("#appContent").height());
		$("#newWindowWrapper").height($("#appContent").height());
		$("#langSelect").height($("#appContent").height());
		//$('#foodList').css("min-height",$('#foodList').height() + "px");
		//$('#foodList').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#advancedMenuWrapper').height($('#appContent').height());
		$('#foodList,#pageSlideFood').css("height",(window.innerHeight - ($('#appHeader').height() + 60)) + "px");
		$('#tabMyItemsBlock').css("min-height", ($('#foodList').height() - 128) + "px");
		//SCROLLBAR UPDATE	
		clearTimeout(niceTimer);
		niceTimer = setTimeout(niceResizer,20);
		//chrome v32 input width
		if(isDesktop() || isMobile.MSApp()) {
			$('#entryBody').width(window.innerWidth -58);
			$('#foodSearch').width(window.innerWidth -55);
			$("ul#addNewList input").width(window.innerWidth - 180);
		}
	 },time);
}
//////////////
// SANITIZE //
//////////////
function sanitize(str) {
	if(str != "") {
		var result = str.split(" ").join("").split("’").join("").split("”").join("").split("~").join("").split("*").join("").split("-").join("").split("(").join("").split(")").join("").split(":").join("").split("/").join("").split("\\").join("").split("&").join("").split("â").join("a").split("ê").join("e").split("ô").join("o").split("ã").join("a").split("ç").join("c").split("á").join("a").split("é").join("e").split("í").join("i").split("ó").join("o").split("ú").join("u").split("à").join("a").split("õ").join("o").split("%").join("").split("'").join("").split('"').join("").split(".").join("").split(";").join("").split(',').join(" ").split(' ').join("").toLowerCase();
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
	if(button == 1) {
		getAnalytics("vote");
             if(isMobile.iOS())       { window.open('https://itunes.apple.com/app/id732382802', '_system', 'location=yes');														}
		else if(isMobile.Android())   { window.open('market://details?id=com.cancian.mylivediet', '_system', 'location=yes');													}
		else if(isMobile.Windows())   { ref = window.open('http://www.windowsphone.com/s?appid=9cfeccf8-a0dd-43ca-b104-34aed9ae0d3e', '_blank', 'location=no');					}
		else if(isMobile.MSApp())     { Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri('ms-windows-store:REVIEW?PFN=27631189-ce9d-444e-a46b-31b8f294f14e'));	}
		else if(isMobile.FirefoxOS()) { ref = window.open('https://marketplace.firefox.com/app/kcals', '_system', 'location=yes');												}
		else if(isMobile.OSXApp())    { macgap.app.open('macappstores://itunes.apple.com/app/id898749118');																		}
	}
}
var rateTimer;
function getRateDialog() {
	//appstore enabled
	if(!isMobile.iOS() && !isMobile.Android() && !isMobile.Windows() && !isMobile.MSApp() && !isMobile.FirefoxOS() && !isMobile.OSXApp()) { return; }
	//first use
	if(!window.localStorage.getItem("getRate")) {
		window.localStorage.setItem("getRate", new Date().getTime());
	}
	//return
	if(window.localStorage.getItem("getRate") == 'locked') { return; }
	///////////////
	// IF 1 WEEK //
	///////////////
	var timeRate = 1 * 24 * 60 * 60 * 1000;
	if((new Date().getTime()) - parseInt(window.localStorage.getItem("getRate")) > (timeRate)) {
		clearTimeout(rateTimer);
		rateTimer = setTimeout(function() {
			if(window.localStorage.getItem("getRate") == 'locked') { return; }
			//SHOW DIALOG
			appConfirm(LANG.RATE_TITLE[lang], LANG.RATE_MSG[lang], getStoreUrl, LANG.RATE_TITLE[lang], LANG.NO_THANKS[lang]);
			window.localStorage.setItem("getRate","locked");
		},3500);
	}
}
///////////////////
// GET ANALYTICS //
///////////////////
var trackString;
function getAnalytics(target) {
	if(typeof ga_storage === 'undefined')								{ return; }
	//not dev
	if(window.localStorage.getItem("config_debug")    == "active")		{ return; }
	if(window.localStorage.getItem("facebook_userid") == 1051211303)	{ return; }
	if((/192.168.1.5/).test(document.URL))								{ return; }
	if((/home/).test(document.URL))										{ return; }
	if((/www.cancian/).test(document.URL))								{ return; }
	//////////
	// INIT //
	//////////
	if(target == "init") {
		ga_storage._setAccount('UA-46450510-2');
	} else {
		////////////////
		// TRACK VARS //
		////////////////
		var deviceType = isDesktop() ? 'desktop' : 'mobile';
		var appOS      = vendorClass;
		if(isMobile.iOS())		{ appOS = "ios";       deviceType = 'mobile';  }
		if(isMobile.Android())	{ appOS = "android";   deviceType = 'mobile';  }
		if(isMobile.Windows())	{ appOS = "windows";   deviceType = 'mobile';  }
		if(isMobile.MSApp())	{ appOS = "msapp";     deviceType = 'desktop'; }
		if(isMobile.FirefoxOS()){ appOS = "firefoxos"; deviceType = 'mobile';  }
		if(isMobile.OSXApp())   { appOS = "osxapp";    deviceType = 'desktop'; }
		//string
		trackString = appOS + "." + deviceType + "/#" + target + "(" + appBuild + ")" + "(" + lang + ")";
		//track page/event
		ga_storage._trackPageview(trackString,appOS + " (" + lang + ")");
		ga_storage._trackEvent(appOS, target, lang, appBuild);
	}
}
//#//////////////////////#//
//# FACEBOOK INTEGRATION #//
//#//////////////////////#//
///////////////////
// GET LOGOUT FB //
///////////////////
function getLogoutFB(button) {
	NProgress.done();
	if(button == 1) {
		window.localStorage.removeItem("facebook_logged");
		window.localStorage.removeItem("facebook_userid");
		window.localStorage.removeItem("facebook_username");	
		$("body").removeClass("appFacebook");
		$("#appFooter").removeClass("appFacebook");
		$("#optionFacebook span").html(LANG.SETTINGS_BACKUP_INFO[lang]);
	}
}
/////////////////////////
// UPDATE LOGIN STATUS //
/////////////////////////
function updateLoginStatus(sync) {
	if(window.localStorage.getItem("facebook_logged") && window.localStorage.getItem("facebook_userid") && window.localStorage.getItem("facebook_username")) {
		$("body").addClass("appFacebook");
		$("#appFooter").addClass("appFacebook");
		$("#optionFacebook span").html(LANG.LOGGED_IN_AS[lang] + ' ' + window.localStorage.getItem("facebook_username"));
		if(sync == 1) { syncEntries(window.localStorage.getItem("facebook_userid")); }
	} else {
		getLogoutFB(1);
	}
}
//////////////////
// GET TOKEN FB //
//////////////////
function getTokenFB(result) {
	try {
		var access_token;
		var expires_in;
		//msapp
		if(result.responseData) {
			var fullUrl      = (result.responseData).split('#');
			var responseData = fullUrl[1];
			var keyValPairs  = responseData.split("&");
			for(var i = 0; i < keyValPairs.length; i++) {
				var splits = keyValPairs[i].split("=");
				switch (splits[0]) {
					case "access_token":
						access_token = splits[1];
						break;
					case "expires_in":
						expires_in = splits[1];
						break;
				}
			}
		} else {
			access_token = result;
		}
		///////////////////
		// GET USER INFO //
		///////////////////
		$.get("https://graph.facebook.com/me?access_token=" + access_token,function(me) {
			if(me.id && me.name) {
				window.localStorage.setItem("facebook_logged",true);
				window.localStorage.setItem("facebook_userid",me.id);
				window.localStorage.setItem("facebook_username",me.name);
				updateLoginStatus(1);
			}
		});
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}
//////////////////
// GET LOGIN FB //
//////////////////
function getLoginFB() {
	try {
		/////////////////
		// IOS/ANDROID //
		/////////////////
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && (/(iPhone|iPod|iPad|Android)/).test(userAgent)) {
			if(typeof FB !== 'undefined' && typeof CDV !== 'undefined') {
				FB.init({ appId : '577673025616946', nativeInterface : CDV.FB, useCachedDialogs : false });
				FB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				}, { scope : "email" });
			}
		/////////
		// WP8 //
		/////////
		} else if (isMobile.Windows()) {
			if(typeof openFB !== 'undefined') {
				openFB.init('577673025616946');
				openFB.login('email',
					function() {
						getTokenFB(window.sessionStorage['fbtoken']);
					},
					function (error) {
						errorHandler(error);
				});
			}
		///////////
		// MSAPP //
		///////////
		} else if(isMobile.MSApp()) {
			if(Windows.Foundation) {
				var callbackURL = "https://www.facebook.com/connect/login_success.html";
				var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=" + encodeURIComponent(callbackURL);
				var startURI    = new Windows.Foundation.Uri(facebookURL);
				var endURI      = new Windows.Foundation.Uri(callbackURL);
				Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync('', startURI, endURI).then(getTokenFB, errorHandler);
			}
		////////////
		// OSXAPP //
		////////////			
		} else if(isMobile.OSXApp()) {
			if(typeof FB !== 'undefined' && typeof macgap !== 'undefined') {
				var pops;
				//callback listener
				$(document).off('userDefaultsChanged').on('userDefaultsChanged', function () {
					var macToken = macgap.userDefaults.getString('macgap_token');
					if(macToken != '') {
						getTokenFB(macToken);
						$(document).off('userDefaultsChanged');
						macgap.userDefaults.removeObjectForKey('macgap_token');
						pops.close();
					}
				});
				//window
				pops = window.open('https://www.facebook.com/dialog/oauth?client_id=577673025616946&scope=email&display=popup&response_type=token&redirect_uri=http://kcals.net/redirect.php','pops','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no, width=480,height=320');
			}
		////////////
		// JS SDK //
		////////////
		} else {
			if(typeof FB !== 'undefined') {
				FB.init({ appId : '577673025616946', status : true, cookie : true, xfbml : true });
				FB.login(function (response) {
					if(response.authResponse) {
						getTokenFB(response.authResponse.accessToken);
					}
				}, { scope : "email" });
				//redirect_uri:'where_to_go_when_login_ends'}
			}
		}
	///////////
	// CATCH //
	///////////
	} catch (err) {
		errorHandler(err);
	}
}

