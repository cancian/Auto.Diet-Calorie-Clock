<?php #####################
## AUTO.DIET PHP BACKEND ##
###########################
@require_once('cors.php');
#######################
if($_GET && $_POST)   { die(); }
if(!$_GET && !$_POST) { die(); }

if(!$_POST) {
	if($_GET)  { 
		if(file_exists('userdata/'.$_GET['uid'].'.sql')) {
			$userdata = file_get_contents('userdata/'.$_GET['uid'].'.sql');
			print($userdata);
		}
		die();
	} else {
		die();
	}
} else {
	if($_POST && !$_POST['sql']) 			{ die(); }
	if($_GET) 								{ die(); }
	//vars
	$pushed_data = stripslashes($_POST['sql']);
	$userid      = $_POST['uid'];
	//fopen
	$file_handle = fopen('userdata/'.$userid.'.sql', 'w');
	fwrite($file_handle, $pushed_data);
	fclose($file_handle);
}
?>