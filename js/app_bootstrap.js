//#///////////#//
//# BOOTSTRAP #//
//#///////////#//
if(typeof $ !== 'undefined' && typeof $.ajaxSetup !== 'undefined') {
	$.support.cors = true;
	$.ajaxSetup({cache: false, crossDomain: true, async: true, error: function(jqXHR, exception) {
		'use strict';
			 if(jqXHR.status === 0)           { console.log('Not connect.\n Verify Network.');         }
		else if (jqXHR.status == 404)         { console.log('Requested page not found. [404]');        }
		else if (jqXHR.status == 500)         { console.log('Internal Server Error [500].');           }
		else if (exception === 'parsererror') { console.log('Requested JSON parse failed.');           }
		else if (exception === 'timeout')     { console.log('Time out error.');                        }
		else if (exception === 'abort')       { console.log('Ajax request aborted.');                  }
		else                                  { console.log('Uncaught Error.\n' + jqXHR.responseText); }
		setTimeout(function() {
			if(typeof spinner === 'function') {
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
	} catch(err) { throw(err); }
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
		var hostLocal2 = https + 'chronoburn.com/';
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
		if(hash === '') { $('body').removeClass('loading'); $('body').addClass('corrupted'); isCurrentCacheValid = 0; return; }
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
		//QUOTA
		if (dataJS !== appStorage.getItem('remoteSuperBlockJS')) {
			appStorage.setItem('remoteSuperBlockJS', dataJS);
			updatePending = 1;
		}
		if (dataCSS !== appStorage.getItem('remoteSuperBlockCSS')) {
			appStorage.setItem('remoteSuperBlockCSS', dataCSS);
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
				appStorage.setItem('app_build', appBuild);
			}
			appStorage.setItem('app_restart_pending', true);
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
	/////////////////
	// END TIMEOUT //
	/////////////////
	}, 3000);
}
//#///////////////////#//
//# APPEND SUPERBLOCK #//
//#///////////////////#//
if(!appStorage.getItem('config_autoupdate')) {
	appStorage.setItem('config_autoupdate','on');
}
//LOCAL
if(appStorage.getItem('config_autoupdate') === 'on') {
	//IF SUPERBLOCK MISSING
	if(isCurrentCacheValid != 1) {
		//BUILD LOCAL SUPERBLOCK
		if(!document.getElementById('plainLoad')) {
			InitializeLocalSuperBlock();
		}
	}
	//CHECK UPDATES
	$(function() {
		'use strict';
		//SAVE WEB REQUEST IF UP TO DATE
		if(/http/i.test(window.location.protocol)) {
			if(!appStorage.getItem('remoteSuperBlockJS') || !appStorage.getItem('remoteSuperBlockCSS')) {
				setTimeout(function() {
					InitializeLocalSuperBlock();
				}, 2000);
			}
		}
		//
		var cacheTimeout = appStorage.getItem('config_debug') === 'active' ? 0 : 6000;
		setTimeout(function() {
			buildRemoteSuperBlock('cached');
		}, cacheTimeout);
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

