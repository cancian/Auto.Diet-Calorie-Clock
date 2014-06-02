<?php #################
## KCALS PHP BACKEND ##
#######################
header('content-type: text/javascript; charset=utf-8');
header("access-control-allow-origin: *");
header("cache-control: no-cache");
##
$userdata  = file_get_contents('js/cordova.js');
$userdata .= file_get_contents('js/facebook-js-sdk.js');
$userdata .= file_get_contents('js/facebook-connect.js');
$userdata .= file_get_contents('js/openfb.js');
$userdata .= file_get_contents('js/facebook-js-sdk.min.js');
$userdata .= file_get_contents('js/iscroll.js');
$userdata .= file_get_contents('js/jquery.js');
$userdata .= file_get_contents('js/jquery.ui.js');
$userdata .= file_get_contents('js/jquery.color.js');
$userdata .= file_get_contents('js/jquery.nicescroll.js');
$userdata .= file_get_contents('js/jquery.touchswipe.js');
$userdata .= file_get_contents('js/jquery.spin.js');
$userdata .= file_get_contents('js/jquery.nprogress.js');
$userdata .= file_get_contents('js/quo.js');
$userdata .= file_get_contents('js/html5sql.js');
$userdata .= file_get_contents('js/localstoragedb.js');
$userdata .= file_get_contents('js/highcharts.js');
$userdata .= file_get_contents('js/mobiscroll.js');
$userdata .= file_get_contents('js/calculator.js');
$userdata .= file_get_contents('js/carpe_slider.js');
$userdata .= file_get_contents('js/galocalstorage.js');
$userdata .= file_get_contents('js/app_lib.js');
$userdata .= file_get_contents('js/app_lang.js');
$userdata .= file_get_contents('js/app_setup.js');
$userdata .= file_get_contents('js/app_build.js');
$userdata .= file_get_contents('js/app_static.js');
$userdata .= file_get_contents('js/app_dynamic.js');
$userdata .= file_get_contents('js/app_custom_core.js');


//$userdata += file_get_contents('js/index.js');
//$userdata += file_get_contents('js/fonts.js');

print $userdata;


/*if($_GET && $_POST)   { die(); }
if(!$_GET && !$_POST) { die(); }

if(!$_POST) {
	if($_GET && is_numeric($_GET['uid']))  { 
		if(file_exists('userdata/'.$_GET['uid'].'.sql')) {
			$userdata = file_get_contents('userdata/'.$_GET['uid'].'.sql');
			print($userdata);
		}
		die();
	} else {
		die();
	}
} else {
	if($_POST && !is_numeric($_POST['uid'])) { die(); }
	if($_POST && !$_POST['sql']) 			 { die(); }
	if($_GET) 								 { die(); }
	//vars
	$pushed_data = stripslashes($_POST['sql']);
	$userid      = $_POST['uid'];
	//fopen
	$file_handle = fopen('userdata/'.$userid.'.sql', 'w');
	fwrite($file_handle, $pushed_data);
	fclose($file_handle);
}
*/
?>