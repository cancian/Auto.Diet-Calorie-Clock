<?php ######################
## CHRONOBURN FOOD SEARCH ##
############################
header('Content-Type: text/html; charset=utf-8');
header('cache-control: no-cache');
////////////////
// ABORT NULL //
////////////////
if(!$_REQUEST['k']) { die(); }
/////////////////
// DATA SOURCE //
/////////////////
$url = "https://www.mynetdiary.com/openCatalogFindFoods.do?beanInputString=" . $_REQUEST['k'] . "&detailsExpected=true&pageNumber=1&pageSize=50&highlightedTermClassName=&findContributed=true";
//////////
// CURL //
//////////
$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)");
curl_setopt($ch, CURLOPT_URL, $url);
$output = curl_exec($ch);
//////////////////
// PARSE OUTPUT //
//////////////////
//remove meta data
$output = str_replace("OK `+`json", "", $output);
//no results
if(preg_match('/numberOfAvailableEntries":0/', $output)) {
	$output = '';
	print $output;
	curl_close($ch);
	exit();
}
/////////////////////
// JSON CONVERSION //
/////////////////////
$json   = ((json_decode($output, true)));
$json   = $json['entries'];
$length = count($json);
$datum  = '';
/////////////////////////
// LOOP/FORMAT RESULTS //
/////////////////////////
for ($i = 0; $i < $length; $i++) {
	$loopName = $json[$i]['desc'];
	$loopName = str_replace(" (contributed)", "", $loopName);
	$loopName = str_replace("'", "’", $loopName);
	//////////////////////
	// PUSH JSON OBJECT //
	//////////////////////
	$datum .= "{
 'id' : ". $json[$i]['beanId']   . ",
 'code' : ". $json[$i]['beanId'] . ",
 'name' : '". $loopName . "',
 'term' : '". $loopName . "',
 'type' : '". 'xxxx'    . "',
 'kcal' : '". $json[$i]['details'][1]['nutrValue'] . "',
 'pro' : '". $json[$i]['details'][4]['nutrValue']  . "',
 'car' : '". $json[$i]['details'][3]['nutrValue']  . "',
 'fat' : '". $json[$i]['details'][2]['nutrValue']  . "',
 'fib' : '". 'online' . "',
 'fii' : '". '0.00' . "',
 'sug' : '". '0.00' . "',
 'sod' : '". '0.00' . "'
 }";
}
//#////////////////////////////#//
//# OUTPUT FORMATED FOOD ARRAY #//
//#////////////////////////////#//
$datum = str_replace("}{", "},{", $datum);
$datum = str_replace("g',", "',", $datum);
$datum = str_replace("cals", "", $datum);
print "[" . $datum . "]";
/////////
// END //
/////////
curl_close($ch);
exit();
?>