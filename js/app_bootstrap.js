//#///////////#//
//# BOOTSTRAP #//
//#///////////#//
// Our simplified "load" function accepts a URL and CALLBACK parameter.
/*
function load(url, callback)
{
	var xhr;
	if (typeof XMLHttpRequest !== 'undefined')
		xhr = new XMLHttpRequest();
	else
	{
		var versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"]
		for (var i = 0, len = versions.length; i < len; i++)
		{
			try
			{
				xhr = new ActiveXObject(versions[i]);
				break;
			}
			catch (e)
			{}

		}
	}
	xhr.onreadystatechange = ensureReadiness;
	function ensureReadiness()
	{
		if (xhr.readyState < 4)
		{
			return;
		}
		if (xhr.status !== 200)
		{
			return;
		}
		if (xhr.readyState === 4)
		{
			callback(xhr);
		}
	}
	xhr.open('GET', url, true);
	xhr.send('');
}

//load('test.txt', function(xhr) {
//	document.getElementById('container').innerHTML = xhr.responseText;
//});
	
//function InitializeLocalSuperBlock(opt) {
	//if(opt == "cached") { return; }
	//cors issue
	
	//$("head").append("<link type='text/css' rel='stylesheet' href='" + hostLocal + "css/index.css' id='coreCss' />");
	//$("head").append("<link type='text/css' rel='stylesheet' href='" + hostLocal + "css/fonts.css' id='coreFonts' />");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_lib.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_build.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_static.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js'><\/script>");
	
	var dataJS  = '';
	var dataCSS = '';
	load("js/app_lib.js",function(raw) { 

	if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	
	load("js/app_lang.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("js/app_setup.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("js/app_build.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("js/app_static.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("js/app_dynamic.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("js/app_custom_core.js",function(raw) { if(raw.status == 200) { dataJS  = dataJS  + raw.response;
	load("css/index.css",function(raw) { if(raw.status == 200) { dataCSS = dataCSS + raw.response;
	load("css/fonts.css",function(raw) { if(raw.status == 200) { dataCSS = dataCSS + raw.response;
	//MOZIE CSS
	if((/firefox/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('box-sizing').join('-moz-box-sizing').split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('-webkit-backface-visibility: hidden;').join('').split('-webkit-').join('-ms-');
	}
	//APPEND
	$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");
	//$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
// Create the element

var script = document.createElement("script");

// Add script content

script.innerHTML = "...";

// Append

document.head.appendChild(script);	
	//
	}});}});}});
	}});}});}});
	}});}});
	}});
//}

	*/
	


function InitializeLocalSuperBlock(opt) {
	if(opt == "cached") { return; }
	//cors issue
	
	//$("head").append("<link type='text/css' rel='stylesheet' href='" + hostLocal + "css/index.css' id='coreCss' />");
	//$("head").append("<link type='text/css' rel='stylesheet' href='" + hostLocal + "css/fonts.css' id='coreFonts' />");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_lib.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_lang.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_setup.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_build.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_static.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_dynamic.js'><\/script>");
	//$("head").append("<script type='text/javascript' src='" + hostLocal + "js/app_custom_core.js'><\/script>");
	
	var dataJS  = '';
	var dataCSS = '';
	$.ajax({type: "GET", dataType: "text", url: "js/app_lib.js",         success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_lang.js",        success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_setup.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_build.js",       success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_static.js",      success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_dynamic.js",     success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "js/app_custom_core.js", success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: "css/index.css",         success: function(raw) { dataCSS = dataCSS + raw;
	$.ajax({type: "GET", dataType: "text", url: "css/fonts.css",         success: function(raw) { dataCSS = dataCSS + raw;
	//MOZIE CSS
	if((/firefox/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('box-sizing').join('-moz-box-sizing').split('-webkit-').join('-moz-');
	}
	if((/trident|IEMobile/).test(navigator.userAgent.toLowerCase())) {
		dataCSS = dataCSS.split('-webkit-backface-visibility: hidden;').join('').split('-webkit-').join('-ms-');
	}
	//APPEND
	$("head").append("<script id='superBlockJS'>" + dataJS  + "</script>");
	$("head").append("<style id='superBlockCSS'>" + dataCSS + "</style>");
	//
	}});}});}});
	}});}});}});
	}});}});
	}});
}
///////////////////////
// REMOTE SUPERBLOCK //
///////////////////////
function buildRemoteSuperBlock(opt) {
	var dataJS  = '';
	var dataCSS = '';
	var hostLocal2 = "http://kcals.net/";
	if(window.localStorage.getItem("config_debug") == "active") {
		hostLocal2 = "http://192.168.1.5/com.cancian.mylivediet/www/";
	}
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_lib.js",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_lang.js",        error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_setup.js",       error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_build.js",       error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_static.js",      error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_dynamic.js",     error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "js/app_custom_core.js", error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataJS  = dataJS  + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "css/index.css",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	$.ajax({type: "GET", dataType: "text", url: hostLocal2 + "css/fonts.css",         error: function(xhr, statusText) { console.log("Error: "+statusText); InitializeLocalSuperBlock(opt); }, success: function(raw) { dataCSS = dataCSS + raw;
	//MOZIE CSS
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
	if(dataJS != window.localStorage.getItem("remoteSuperBlockJS")) {
		window.localStorage.setItem("remoteSuperBlockJS",dataJS);
	}
	if(dataCSS != window.localStorage.getItem("remoteSuperBlockCSS")) {
		window.localStorage.setItem("remoteSuperBlockCSS",dataCSS);
	}
	//
	}});}});}});
	}});}});}});
	}});}});
	}});
}
/////////////////////
// READ SUPERBLOCK //
/////////////////////
if(window.localStorage.getItem("config_debug") == "active") {
	window.localStorage.removeItem("remoteSuperBlockJS");
	window.localStorage.removeItem("remoteSuperBlockCSS");
}
if(!window.localStorage.getItem("remoteSuperBlockJS") || !window.localStorage.getItem("remoteSuperBlockCSS")) {
	buildRemoteSuperBlock('load');
} else {
	$("head").append("<script id='superBlockJS'>" + window.localStorage.getItem("remoteSuperBlockJS") + "</script>");
	$("head").append("<style id='superBlockCSS'>" + window.localStorage.getItem("remoteSuperBlockCSS") + "</style>");
	buildRemoteSuperBlock('cached');
}
