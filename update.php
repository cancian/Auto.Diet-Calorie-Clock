<?php #################
## KCALS PHP BACKEND ##
#######################
header("cache-control: no-cache");
//////////////////
// USERS ONLINE //
//////////////////
if(!isset($_SESSION)) {
	session_start();
}
//VARS
$filetxt = 'userdata/_users_online.txt';
$timeon  = 900;
$sep     = '^^';
$vst_id  = '-vst-';
//GET IP
$uvon   = isset($_SESSION['nume']) ? $_SESSION['nume'] : $_SERVER['SERVER_ADDR']. $vst_id;
$rgxvst = '/^([0-9\.]*)'. $vst_id. '/i';
$nrvst  = 0;
// SET ROW
$addrow[] = $uvon. $sep. time();
// FILEEXISTS
if(is_writable($filetxt)) {
	$ar_rows = file($filetxt, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	$nrrows  = count($ar_rows);
	//if there is at least one line, parse
	if($nrrows>0) {
		for($i=0; $i<$nrrows; $i++) {
			$ar_line = explode($sep, $ar_rows[$i]);
			if($ar_line[0]!=$uvon && (intval($ar_line[1])+$timeon)>=time()) {
				$addrow[] = $ar_rows[$i];
			}
		}
	}
}
//VAR DATA
$nruvon = count($addrow);
$usron  = '';
// GET USER NUMBER
for($i=0; $i<$nruvon; $i++) {
	if(preg_match($rgxvst, $addrow[$i])) { 
		$nrvst++;
	} else {
	// STORE USERNAME
		$ar_usron = explode($sep, $addrow[$i]);
		$usron   .= '<br/> - <i>'. $ar_usron[0]. '</i>';
	}
}
//(TOTAL - VISITORS)
$nrusr = $nruvon - $nrvst;
	// WRITE
if(!file_put_contents($filetxt, implode("\n", $addrow))) {
	die();
}
//OUTPUT
if($_GET['type'] == 'usr') {
	print $nruvon;
	die();
}
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