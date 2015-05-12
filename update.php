<?php #################
## KCALS PHP BACKEND ##
#######################
header("cache-control: no-cache");
//////////////////
// USERS ONLINE //
//////////////////
$ip      = $_SERVER["REMOTE_ADDR"];
$time    = time();
$minutes = 240;
$found   = 0;
$users   = 0;
$user    = "";
$tmpdata = 'userdata';

if (!is_file("$tmpdata/visits_online.txt"))	{
	$s = fopen("$tmpdata/visits_online.txt","w");
	fclose($s);
	chmod("$tmpdata/visits_online.txt",0666);
}
$f = fopen("$tmpdata/visits_online.txt","r+");
flock($f,2);

while (!feof($f)) {
	$user[] = chop(fgets($f,65536));
}

fseek($f,0,SEEK_SET);
ftruncate($f,0);

foreach ($user as $line) {
	list($savedip,$savedtime) = split("\|",$line);
	if ($savedip == $ip) { 
		$savedtime = $time;$found = 1;
	}
	if ($time < $savedtime + ($minutes * 60)) {
		fputs($f,"$savedip|$savedtime\n");
		$users = $users + 1;
	}
}

if ($found == 0) {
	fputs($f,"$ip|$time\n");
	$users = $users + 1;
}
	
fclose ($f);
if($_GET['type'] == 'usr') {
	print $users;
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