//#///////////#//
//# BOOTSTRAP #//
//#///////////#//
$.support.cors = true;
$.ajaxSetup({cache: false, crossDomain: true, async:true, error: function(jqXHR, exception) {
		 if(jqXHR.status === 0)           { console.log('Not connect.\n Verify Network.');         }
	else if (jqXHR.status == 404)         { console.log('Requested page not found. [404]');        }
	else if (jqXHR.status == 500)         { console.log('Internal Server Error [500].');           }
	else if (exception === 'parsererror') { console.log('Requested JSON parse failed.');           }
	else if (exception === 'timeout')     { console.log('Time out error.');                        }
	else if (exception === 'abort')       { console.log('Ajax request aborted.');                  }
	else                                  { console.log('Uncaught Error.\n' + jqXHR.responseText); }
	setTimeout(function() {
		if(typeof spinner !== 'undefined') {
			$('body').removeClass('insync');
			$('body').removeClass('setpush');
			spinner('stop');
			$('body').removeClass('loading');
			$('body').removeClass('uptodate');
			$('body').removeClass('pending');
			$('body').removeClass('corrupted');
		}
	},6000);
}});
//#//////////////////#//
//# LOCAL SUPERBLOCK #//
//#//////////////////#//
function InitializeLocalSuperBlock(opt) {
	if(opt == 'cached') { return; }
	var dataJS  = '';
	var dataCSS = '';
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_lib.js',         success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_lang.js',        success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_setup.js',       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_macro.js',       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_build.js',       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_static.js',      success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_dynamic.js',     success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'js/app_custom_core.js', success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'css/fonts.css',         success: function(raw) { dataCSS = dataCSS + raw;
	$.ajax({type: 'GET', dataType: 'text', url: 'css/index.css',         success: function(raw) { dataCSS = dataCSS + raw;
	//GET SIZE
	window.localStorage.setItem('app_autoupdate_hash',(dataJS + dataCSS).length);
	//MOZIE CSS CONVERT
	if((/Firefox/i).test(navigator.userAgent)) {
		dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
		dataCSS = dataCSS.split('-webkit-').join('-moz-');
	}
	if((/edge|trident|IEMobile/i).test(navigator.userAgent))	{ 
		dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
		dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
		dataCSS = dataCSS.split('-webkit-').join('-ms-');
	}
	//QUOTA
	try {
		/////////////////////////////////
		// APPEND IF USING SUPERBLOCKS //
		/////////////////////////////////
		if(!$('#plainLoad').length && !$('#superBlockCSS').length) {
			setTimeout(function() {
				safeExec(function() {		
					$('#coreCss,#coreFonts').remove();
					$('head').append('<style id="superBlockCSS">' + dataCSS + '<\/style>');
					$('head').append('<script id="superBlockJS">' + dataJS  + '<\/script>');
					//$.globalEval(dataJS);
				});
			},0);
		}
		setTimeout(function() {
			//WRITE RESULTS
			if(dataJS != window.localStorage.getItem('remoteSuperBlockJS')) {
				window.localStorage.setItem('remoteSuperBlockJS',dataJS);
			}
			if(dataCSS != window.localStorage.getItem('remoteSuperBlockCSS')) {
				window.localStorage.setItem('remoteSuperBlockCSS',dataCSS);
			}
		},0);
	} catch(e) { throw(e); }
	//
	}});}});}});}});
	}});}});}});
	}});}});
	}});
}
//#///////////////////#//
//# REMOTE SUPERBLOCK #//
//#///////////////////#//
var remoteBlockTimer;
function buildRemoteSuperBlock(opt) {
	clearTimeout(remoteBlockTimer);
	remoteBlockTimer = setTimeout(function() {
	if($('body').hasClass('loading')) { return; }
	//
	var https = /https/i.test(window.location.protocol) ? 'https://' : 'http://';
	var dataJS  = '';
	var dataCSS = '';
	var hostLocal2 = https + 'kcals.net/';
	if(window.localStorage.getItem('config_debug') == 'active') {
		hostLocal2 = 'http://192.168.1.5/';
	}
	//retrieve ajax check
	if(typeof cssLoadCount === 'undefined') { return; }
	cssLoadCount(0,0);
	$('body').removeClass('loading');
	$('body').removeClass('uptodate');
	$('body').removeClass('pending');
	$('body').removeClass('corrupted');
	//update.php
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'update.php?type=min', error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(hash) {
		//null
		if(hash == '') { $('body').removeClass('loading'); $('body').addClass('corrupted'); isCurrentCacheValid = 0; return; }
		var hashObj = hash.split(',');
		//length
		if(parseInt(hashObj[1]) > 1000) {
			//diff
			if(parseInt(hashObj[0]) == window.localStorage.getItem('app_build') && window.localStorage.getItem('app_autoupdate_hash') == hashObj[1]) {
				if(window.localStorage.getItem('app_restart_pending')) {
					$('body').addClass('pending');
				} else {
					$('body').addClass('uptodate');
				}
				return;
			}
		}
	$('body').addClass('loading');
	cssLoadCount(0,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_lib.js',         error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(1,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_lang.js',        error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(2,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_setup.js',       error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(3,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_macro.js',       error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(4,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_build.js',       error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(5,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_static.js',      error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(6,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_dynamic.js',     error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(7,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_custom_core.js', error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	cssLoadCount(8,10);
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'css/index.css',         error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	cssLoadCount(9,10);	
	$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'css/fonts.css',         error: function(xhr, statusText) { console.log('Error: '+statusText); $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	cssLoadCount(10,10);
	/////////////////////
	// INTEGRITY CHECK //
	/////////////////////
	cssLoadCount(0,0);
	if(!isCacheValid(dataJS + dataCSS)) { $('body').removeClass('loading'); $('body').addClass('corrupted'); isCurrentCacheValid = 0; return; }
	//store original hash
	window.localStorage.setItem('app_autoupdate_hash',(dataJS + dataCSS).length);	
	//MOZ~IE CSS
	if((/Firefox/i).test(navigator.userAgent)) {
		dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
		dataCSS = dataCSS.split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/i).test(navigator.userAgent))	{ 
		dataCSS = dataCSS.split('-webkit-box-shadow').join('box-shadow');
		dataCSS = dataCSS.split('-webkit-box-sizing').join('box-sizing');
		dataCSS = dataCSS.split('-webkit-').join('-ms-');
	}
	////////////////////
	// UPDATE PENDING //
	////////////////////
	var updatePending = 0;
	//QUOTA
	if (dataJS != window.localStorage.getItem('remoteSuperBlockJS')) {
		window.localStorage.setItem('remoteSuperBlockJS', dataJS);
		updatePending = 1;
	}
	if (dataCSS != window.localStorage.getItem('remoteSuperBlockCSS')) {
		window.localStorage.setItem('remoteSuperBlockCSS', dataCSS);
		updatePending = 1;
	}
	////////////////////
	// RESTART DIALOG //
	////////////////////
	if (updatePending == 1) {
		setTimeout(function () {
			if (typeof app !== 'undefined') {
				if (typeof app.analytics === 'function') {
					app.analytics('autoupdate');
				}
			}
		}, 5000);
		$('body').removeClass('loading');
		$('body').addClass('pending');
		if (typeof appBuild !== 'undefined') {
			window.localStorage.setItem('app_build', appBuild);
		}
		window.localStorage.setItem('app_restart_pending', true);
		if (window.localStorage.getItem('app_notify_update')) {
			setTimeout(function () {
				if (typeof appConfirm == 'function') {
					function quickReboot(button) {
						if (button === 2) {
							afterHide();
						} else {
							window.localStorage.setItem('app_restart_pending', true);
						}
					}
					appConfirm(LANG.APP_UPDATED[lang], LANG.RESTART_NOW[lang], quickReboot, LANG.OK[lang], LANG.CANCEL[lang]);
				}
			}, 2000);
		}
	} else {
		$('body').removeClass('loading');
		if (isCurrentCacheValid == 1) {
			$('body').addClass('uptodate');
		} else {
			$('body').addClass('corrupted');
		}
	}
	//
	}});}});
	}});}});}});
	}});}});}});
	}});}});
	}});
	},2000);
}
//#///////////////////#//
//# APPEND SUPERBLOCK #//
//#///////////////////#//
if(!window.localStorage.getItem('config_autoupdate')) {
	window.localStorage.setItem('config_autoupdate','on');
}
if(window.localStorage.getItem('config_autoupdate') == 'on') {
	//IF SUPERBLOCK MISSING
	if(isCurrentCacheValid != 1) {
		//BUILD LOCAL SUPERBLOCK
		if(!$('#plainLoad').length) {
			InitializeLocalSuperBlock();
		}
	}
	//CHECK UPDATES
	$(document).ready(function() {
		//SAVE REQUEST
		if(!window.localStorage.getItem('remoteSuperBlockJS') || !window.localStorage.getItem('remoteSuperBlockCSS')) {
			setTimeout(function() {
				if(/http/i.test(window.location.protocol)) {
					InitializeLocalSuperBlock();
				}
			},2500);
		}
		var cacheTimeout = window.localStorage.getItem('config_debug') == 'active' ? 500 : 6000;
		setTimeout(function() {
			buildRemoteSuperBlock('cached');
		},cacheTimeout);
	});
}
// BACKWARDS COMP
$(document).ready(function() {
	setTimeout(function() {
		if(/http/i.test(window.location.protocol)) {
			$('body').addClass('started');
			$('body').removeClass('unloaded');
		}
	},9999);
});

