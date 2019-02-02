<?php ######################
## AUTO.DIET UUID CHECKER ##
############################
@require_once('cors.php');
########################
##
if($_GET && $_POST)   { die(); }
if(!$_GET && !$_POST) { die(); }
//#//////////#//
//# GET LINE #//
//#//////////#//
function getLineWithString($str) {
	if(!$str) { return -1; }
	$lines = file('userdata/uuid.txt');
	foreach ($lines as $lineNumber => $line) {
		if (strpos($line, $str) !== false) {
			return $line;
		}
	}
	return -1;
}
//#///////////#//
//# SAVE UUID #//
//#///////////#//
function saveUUID($strUUID,$strTime) {
	if(strlen($strUUID) < 10)  { return; }
	if(strlen($strTime) != 13) { $strTime = time() . "000"; }
	$fh = fopen('userdata/uuid.txt', 'a') or touch('userdata/uuid.txt');
	$string = $strUUID."#".$strTime."\n";
	fwrite($fh, $string);
	fclose($fh);
	return $strTime;
}
//#//////#//
//# VARS #//
//#//////#//
$getTime = htmlentities($_GET['time']);
$getUUID = htmlentities($_GET['uuid']);
$gotUUID = getLineWithString($getUUID);
if($gotUUID !== -1) {
	//FOUND
	//echo 0;
	echo substr($gotUUID, strlen($gotUUID)-14);
} else {
	//NOT FOUND
	//echo 0;
	echo saveUUID($getUUID,$getTime);
}
?>