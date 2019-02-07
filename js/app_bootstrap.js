//#///////////#//
//# BOOTSTRAP #//
//#///////////#//
if(typeof $ !== 'undefined' && typeof $.ajaxSetup !== 'undefined') {
	$.support.cors = true;
	$.ajaxSetup({cache: false, crossDomain: true, async: true, error: function(jqXHR, exception) {
		'use strict';
			 if(jqXHR.status  ==   0)        { console.log('Not connect. Verify Network.');          }
		else if (jqXHR.status == 404)        { console.log('Requested page not found. [404]');       }
		else if (jqXHR.status == 500)        { console.log('Internal Server Error [500].');          }
		else if (exception == 'parsererror') { console.log('Requested JSON parse failed.');          }
		else if (exception == 'timeout')     { console.log('Timeout error.');                        }
		else if (exception == 'abort')       { console.log('Ajax request aborted.');                 }
		else                                 { console.log('Uncaught Error: ' + jqXHR.responseText); }
		//AUTOCLEAN
		setTimeout(function() {
			if(typeof spinner === 'function') {
				$('body').removeClass('insync setpush loading uptodate pending corrupted');
				spinner('stop');
			}
		}, 6000);
	}});
}
//#//////////////////#//
//# LOCAL SUPERBLOCK #//
//#//////////////////#//
function InitializeLocalSuperBlock(opt) {
	'use strict';
	if(opt === 'cached') { return; }
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
	appStorage.setItem('app_autoupdate_hash',(dataJS + dataCSS).length);
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
				});
			}, 0);
		}
		setTimeout(function() {
			//WRITE RESULTS
			if(dataJS !== appStorage.getItem('remoteSuperBlockJS')) {
				appStorage.setItem('remoteSuperBlockJS',dataJS);
			}
			if(dataCSS !== appStorage.getItem('remoteSuperBlockCSS')) {
				appStorage.setItem('remoteSuperBlockCSS',dataCSS);
			}
		}, 0);
	} catch(err) { 
		///////////////////////////
		// DOM STORAGE AUTOLIMIT //
		///////////////////////////
		appStorage.removeItem('remoteSuperBlockCSS');
		appStorage.removeItem('remoteSuperBlockJS');
		//DISABLE AUTOUPDATE
		if(appStorage.getItem('config_autoupdate') === 'on') {
			appStorage.setItem('config_autoupdate','off');
			//REBOOT
			window.location.replace(window.location.href);
		}
	}
	//
	}});}});}});}});
	}});}});}});
	}});}});
	}});
}
//#///////////////////#//
//# REMOTE SUPERBLOCK #//
//#///////////////////#//
var remoteSuperBlockTimer;
function buildRemoteSuperBlock(opt) {
	'use strict';
	clearTimeout(remoteSuperBlockTimer);
	remoteSuperBlockTimer = setTimeout(function() {
		if($('body').hasClass('loading')) { return; }
		//
		var dataJS  = '';
		var dataCSS = '';
		var hostLocal2 = https + 'dietclock.net/';
		if(appStorage.getItem('config_debug') === 'active') {
			hostLocal2 = https + '192.168.1.5/';
		}
		//retrieve ajax check
		if(typeof cssLoadCount === 'undefined') { return; }
		cssLoadCount(0,0);
		$('body').removeClass('loading uptodate pending corrupted');
		////////////////
		// update.php //
		////////////////
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'update.php?type=min', error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(hash) {
		//null
		if(!hash || hash == '' || hash == null) { $('body').removeClass('loading'); $('body').addClass('corrupted'); isCurrentCacheValid = 0; return; }
		var hashObj = hash.split(',');
		//length
		if(parseInt(hashObj[1]) > 1000) {
			//diff
			if(parseInt(hashObj[0]) == appStorage.getItem('app_build') && appStorage.getItem('app_autoupdate_hash') == hashObj[1]) {
				if(appStorage.getItem('app_restart_pending')) {
					$('body').addClass('pending');
				} else {
					$('body').addClass('uptodate');
				}
				return;
			}
		}
		//////////////////
		// AJAX LOADING //
		//////////////////
		$('body').addClass('loading');
		cssLoadCount(0,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_lib.js',         error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(1,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_lang.js',        error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(2,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_setup.js',       error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(3,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_macro.js',       error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(4,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_build.js',       error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(5,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_static.js',      error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(6,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_dynamic.js',     error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(7,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'js/app_custom_core.js', error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
		cssLoadCount(8,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'css/index.css',         error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
		cssLoadCount(9,10);
		$.ajax({type: 'GET', dataType: 'text', url: hostLocal2 + 'css/fonts.css',         error: function(xhr, statusText) { $('body').removeClass('loading'); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
		cssLoadCount(10,10);
		/////////////////////
		// INTEGRITY CHECK //
		/////////////////////
		cssLoadCount(0,0);
		if(!isCacheValid(dataJS + dataCSS)) { $('body').removeClass('loading'); $('body').addClass('corrupted'); isCurrentCacheValid = 0; return; }
		//store original hash
		appStorage.setItem('app_autoupdate_hash',(dataJS + dataCSS).length);
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
		///////////////
		// QUOTA TRY //
		///////////////
		try {
			if (dataJS !== appStorage.getItem('remoteSuperBlockJS')) {
				appStorage.setItem('remoteSuperBlockJS', dataJS);
				updatePending = 1;
			}
			if (dataCSS !== appStorage.getItem('remoteSuperBlockCSS')) {
				appStorage.setItem('remoteSuperBlockCSS', dataCSS);
				updatePending = 1;
			}
		} catch(err) {
			///////////////////////////
			// DOM STORAGE AUTOLIMIT //
			///////////////////////////
			appStorage.removeItem('remoteSuperBlockCSS');
			appStorage.removeItem('remoteSuperBlockJS');
			//DISABLE AUTOUPDATE
			if(appStorage.getItem('config_autoupdate') === 'on') {
				appStorage.setItem('config_autoupdate','off');
				//DISABLE AUTOREBOOT FOR REMOTESUPERBLOCK
			}
		}
		////////////////////
		// RESTART DIALOG //
		////////////////////
		if (updatePending === 1) {
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
				appStorage.setItem('app_build', appBuild);
			}
			appStorage.setItem('app_restart_pending', true);
		} else {
			$('body').removeClass('loading');
			if (isCurrentCacheValid === 1) {
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
	/////////////////
	// END TIMEOUT //
	/////////////////
	}, 3000);
}
//#///////////////////#//
//# APPEND SUPERBLOCK #//
//#///////////////////#//
//DEFAULT ENABLE AUTOUPDATE
if(!appStorage.getItem('config_autoupdate')) {
	appStorage.setItem('config_autoupdate','on');
}
//DISABLED AUTOUPDATE REMOVES CACHE
if(appStorage.getItem('config_autoupdate') === 'off') {
	appStorage.removeItem('remoteSuperBlockCSS');
	appStorage.removeItem('remoteSuperBlockJS');
}
//LOCAL SUPERBLOCK SYNC READ ~ REMOTE ASYNC SUPERBLOCK DOWNLOAD
if(appStorage.getItem('config_autoupdate') === 'on') {
	//IF SUPERBLOCK MISSING
	if(isCurrentCacheValid !== 1) {
		//BUILD LOCAL SUPERBLOCK
		if(!document.getElementById('plainLoad')) {
			InitializeLocalSuperBlock();
		}
	}
	//CHECK UPDATES
	$(function() {
		'use strict';
		//AVOID WEB REQUEST IF UP TO DATE
		if(/http/i.test(window.location.protocol)) {
			if(!appStorage.getItem('remoteSuperBlockJS') || !appStorage.getItem('remoteSuperBlockCSS')) {
				setTimeout(function() {
					InitializeLocalSuperBlock();
				}, (appStorage.getItem('config_debug') === 'active') ? 200 : 2000);
			}
		}
		//CALL 
		setTimeout(function() {
			buildRemoteSuperBlock('cached');
		}, (appStorage.getItem('config_debug') === 'active') ? 500 : 5000);
	});
}
// BACKWARDS COMPAT //
$(function() {
	'use strict';
	setTimeout(function() {
		if(/http/i.test(window.location.protocol)) {
			$('body').addClass('started');
			$('body').removeClass('unloaded');
		}
	}, 9999);
});

