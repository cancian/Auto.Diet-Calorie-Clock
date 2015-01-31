<?php #################
## KCALS PHP BACKEND ##
#######################
header("cache-control: no-cache");
/////////////////////
// UNCOMPRESSED JS //
/////////////////////
if($_GET['type'] == 'md5') {
	$userdata = '';
	header('content-type: text/plain; charset=utf-8');
	$userdata .= file_get_contents('js/app_lib.js');
	$userdata .= file_get_contents('js/app_lang.js');
	$userdata .= file_get_contents('js/app_setup.js');
	$userdata .= file_get_contents('js/app_macro.js');
	$userdata .= file_get_contents('js/app_build.js');
	$userdata .= file_get_contents('js/app_static.js');
	$userdata .= file_get_contents('js/app_dynamic.js');
	$userdata .= file_get_contents('js/app_custom_core.js');
	$userdata .= file_get_contents('css/index.css');
	$userdata .= file_get_contents('css/fonts.css');
	$size = strlen(utf8_decode($userdata))-10;
	$pos1 = strpos($userdata,'appVersion');
	$line = substr($userdata,$pos1,40);
	preg_match('#\((.*?)\)#', $line, $match);
	print $match[1].','.$size;
	die();
}	
///////////////////
// COMPRESSED JS //
///////////////////
if($_GET['type'] == 'min') {
	$userdata = '';
	header('content-type: text/plain; charset=utf-8');
	$userdata .= file_get_contents('js/min/app_lib.js');
	$userdata .= file_get_contents('js/min/app_lang.js');
	$userdata .= file_get_contents('js/min/app_setup.js');
	$userdata .= file_get_contents('js/min/app_macro.js');
	$userdata .= file_get_contents('js/min/app_build.js');
	$userdata .= file_get_contents('js/min/app_static.js');
	$userdata .= file_get_contents('js/min/app_dynamic.js');
	$userdata .= file_get_contents('js/min/app_custom_core.js');
	$userdata .= file_get_contents('css/min/index.css');
	$userdata .= file_get_contents('css/min/fonts.css');
	$size = strlen(utf8_decode($userdata))-2;
	$pos1 = strpos($userdata,'appVersion');
	$line = substr($userdata,$pos1,40);
	preg_match('#\((.*?)\)#', $line, $match);
	print $match[1].','.$size;
	die();
}
?>