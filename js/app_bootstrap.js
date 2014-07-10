//#///////////#//
//# BOOTSTRAP #//
//#///////////#///////
// AJAX ERROR CODES //
//////////////////////
$.support.cors = true;
$.ajaxSetup({cache: false, error: function(jqXHR, exception) {
		 if(jqXHR.status === 0)           { errorHandler('Not connect.\n Verify Network.');         }
	else if (jqXHR.status == 404)         { errorHandler('Requested page not found. [404]');        }
	else if (jqXHR.status == 500)         { errorHandler('Internal Server Error [500].');           }
	else if (exception === 'parsererror') { errorHandler('Requested JSON parse failed.');           }
	else if (exception === 'timeout')     { errorHandler('Time out error.');                        }
	else if (exception === 'abort')       { errorHandler('Ajax request aborted.');                  }
	else                                  { errorHandler('Uncaught Error.\n' + jqXHR.responseText); }
	setTimeout(function() {
		NProgress.done();
		spinner('stop');
	},6000);
}});
//#//////////////////#//
//# LOCAL SUPERBLOCK #//
//#//////////////////#//
function InitializeLocalSuperBlock(opt) {
	if(opt == "cached") { return; }
	var dataJS  = '';
	var dataCSS = '';
	$.ajax({type: "GET", dataType: "text", url: "js/app_lib.js",         success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_lang.js",        success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_setup.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_macro.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_build.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_static.js",      success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_dynamic.js",     success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_custom_core.js", success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "css/index.css",         success: function(raw) { dataCSS = dataCSS + raw;
	$.ajax({type: "GET", dataType: "text", url: "css/fonts.css",         success: function(raw) { dataCSS = dataCSS + raw;
	//GET SIZE
	window.localStorage.setItem("app_autoupdate_hash",(dataJS + dataCSS).length);
	//MOZIE CSS CONVERT
	if((/firefox/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('box-sizing').join('-moz-box-sizing').split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('-webkit-backface-visibility: hidden;').join('').split('-webkit-').join('-ms-');
	}
	//WRITE RESULTS
	if(dataJS != window.localStorage.getItem("remoteSuperBlockJS")) {
		window.localStorage.setItem("remoteSuperBlockJS",dataJS);
	}
	if(dataCSS != window.localStorage.getItem("remoteSuperBlockCSS")) {
		window.localStorage.setItem("remoteSuperBlockCSS",dataCSS);
	}
	/////////////////////////////////
	// APPEND IF USING SUPERBLOCKS //
	/////////////////////////////////
	if(!$("#plainLoad").length) {
		safeExec(function() {		
			$("#coreCss,#coreFonts").remove();
			$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
			$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");
		});
	}
	}});}});}});}});
	}});}});}});
	}});}});
	}});
}
//#///////////////////#//
//# REMOTE SUPERBLOCK #//
//#///////////////////#//
function buildRemoteSuperBlock(opt) {
	var dataJS  = '';
	var dataCSS = '';
	var hostLocal2 = "http://kcals.net/";
	if(window.localStorage.getItem("config_debug") == "active") {
		hostLocal2 = "http://192.168.1.5/com.cancian.mylivediet/www/";
	}
	//retrieve ajax check
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "update.php?type=md5", error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(hash) {
		//null
		if(hash == '') { return; }
		var hashObj = hash.split(',');
		//length
		if(parseInt(hashObj[1]) > 1000) {
			//diff
			if(parseInt(hashObj[0]) == window.localStorage.getItem("app_build") && window.localStorage.getItem("app_autoupdate_hash") == hashObj[1]) {
				//console.log('up to date\n local: ' + appBuild + ',' + window.localStorage.getItem("app_autoupdate_hash") + '\n remote:' + hash);
				return;
			} else {
				//console.log('starting update.\n local: ' + appBuild + ',' + window.localStorage.getItem("app_autoupdate_hash") + '\n remote:' + hash);			
			}
		}
	//NProgress.start();
	//$("#nprogress .bar").css("background-color","#fff");
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_lib.js",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.1);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_lang.js",        error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.2);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_setup.js",       error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.3);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_macro.js",       error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.4);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_build.js",       error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.5);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_static.js",      error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.6);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_dynamic.js",     error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.7);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_custom_core.js", error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	//NProgress.set(0.8);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "css/index.css",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	//NProgress.set(0.9);
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "css/fonts.css",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	//NProgress.done();
	/////////////////////
	// INTEGRITY CHECK //
	/////////////////////
	var isValid = 1;
	//APP_LIB
	if(dataJS.indexOf('var isMobile')        === -1)			{ isValid = 0 }
	if(dataJS.indexOf('function appConfirm') === -1)			{ isValid = 0 }
	//APP_LANG
	if(dataJS.indexOf('var appName')     === -1)				{ isValid = 0 }
	if(dataJS.indexOf('FOOD_CATEGORIES') === -1)				{ isValid = 0 }
	//APP_SETUP
	if(dataJS.indexOf('function showIntro')  === -1)			{ isValid = 0 }
	if(dataJS.indexOf('function getLoginFB') === -1)			{ isValid = 0 }
	//APP_MACRO
	if(dataJS.indexOf('function getFullHistory') === -1)		{ isValid = 0 }
	if(dataJS.indexOf('function getCatList')     === -1)		{ isValid = 0 }
	//APP_BUILD
	if(dataJS.indexOf('function openSettings')       === -1)	{ isValid = 0 }
	if(dataJS.indexOf('function feetInchesToMetric') === -1)	{ isValid = 0 }
	//APP_STATIC
	if(dataJS.indexOf('function startApp')   === -1)			{ isValid = 0 }
	if(dataJS.indexOf('var editableTimeout') === -1)			{ isValid = 0 }
	//APP_DYNAMIC
	if(dataJS.indexOf('$(document).on("pageload"') === -1)		{ isValid = 0 }
	if(dataJS.indexOf('function getModalWindow')   === -1)		{ isValid = 0 }
	//APP_CUSTOM_CORE
	if(dataJS.indexOf('function appTimer')    === -1)			{ isValid = 0 }
	if(dataJS.indexOf('function updateTimer') === -1)			{ isValid = 0 }
	//INDEX.CSS
	if(dataCSS.indexOf('html,body') === -1)						{ isValid = 0 }
	if(dataCSS.indexOf('#cat9999')  === -1)						{ isValid = 0 }
	//FONTS.CSS
	if(dataCSS.indexOf('@font-face') === -1)					{ isValid = 0 }
	if(dataCSS.indexOf('.msie-png')  === -1)					{ isValid = 0 }
	//ISVALID
	//console.log(isValid);
	if(isValid != 1) { return; }
	//store original hash
	window.localStorage.setItem("app_autoupdate_hash",(dataJS + dataCSS).length);	
	//MOZ~IE CSS
	if((/firefox/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('box-sizing').join('-moz-box-sizing').split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase()))	{ 
		dataCSS = dataCSS.split('-webkit-backface-visibility: hidden;').join('').split('-webkit-').join('-ms-');
	}
	//APPEND
	if(opt == "load") {
		$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");
		$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
	}
	////////////////////
	// UPDATE PENDING //
	////////////////////
	var updatePending = 0;
	//
	if(dataJS != window.localStorage.getItem("remoteSuperBlockJS")) {
		window.localStorage.setItem("remoteSuperBlockJS",dataJS);
		updatePending = 1;
	}
	if(dataCSS != window.localStorage.getItem("remoteSuperBlockCSS")) {
		window.localStorage.setItem("remoteSuperBlockCSS",dataCSS);
		updatePending = 1;
	}
	////////////////////
	// RESTART DIALOG //
	////////////////////
	if(updatePending == 1) {
		getAnalytics('autoupdate');
		window.localStorage.setItem("app_build",appBuild);
		window.localStorage.setItem("app_restart_pending",true);
		if(window.localStorage.getItem("app_notify_update")) {
			setTimeout(function() {
				if(typeof appConfirm == "function") {
					appConfirm(LANG.APP_UPDATED[lang], LANG.RESTART_NOW[lang], function(ok) {
						if(ok == 1) {
							afterHide();
						} else {
							window.localStorage.setItem("app_restart_pending",true);
						}
					});
				}
			},2000);
		}
	}
	//
	}});}});
	}});}});}});
	}});}});}});
	}});}});
	}});
}
//#///////////////////#//
//# APPEND SUPERBLOCK #//
//#///////////////////#//
if(!window.localStorage.getItem("config_autoupdate")) {
	window.localStorage.setItem("config_autoupdate","on");
}
if(window.localStorage.getItem("config_autoupdate") == "on") {
	//IF SUPERBLOCK MISSING
	if(!window.localStorage.getItem("remoteSuperBlockJS") || !window.localStorage.getItem("remoteSuperBlockCSS")) {
		//BUILD LOCAL SUPERBLOCK
		if(!$("#plainLoad").length) {
			InitializeLocalSuperBlock();
		}
		//CHECK UPDATES
		setTimeout(function() {
			buildRemoteSuperBlock('cached');
		},5000);
	} else {
		//APPEND SUPERBLOCK
		safeExec(function() {
			$("#coreCss,#coreFonts").remove();
			$("head").append("<style id='superBlockCSS'>" + window.localStorage.getItem("remoteSuperBlockCSS") + "</style>");
			$("head").append("<script id='superBlockJS'>" + window.localStorage.getItem("remoteSuperBlockJS")  + "</script>");
		});
		//CHECK UPDATES
		setTimeout(function() {
			buildRemoteSuperBlock('cached');
		},5000);
	}
}

