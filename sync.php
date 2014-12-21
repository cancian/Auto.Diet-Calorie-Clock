<?php #################
## KCALS PHP BACKEND ##
#######################
//header('content-type: application/json; charset=utf-8');
//if(!preg_match("^home|local|192.168.1.5|local^",$_SERVER['HTTP_HOST'])) {
	//header("access-control-allow-origin: *");
	header("cache-control: no-cache");
//}
##
if($_GET && $_POST)   { die(); }
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
?>