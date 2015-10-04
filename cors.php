<?php ###########
## ENABLE CORS ##
#################
header('Content-Type: text/html; charset=utf-8');
header('cache-control: no-cache');
#header('Access-Control-Allow-Origin: *');
#header('Access-Control-Allow-Credentials: true ');
#header('Access-Control-Allow-Methods: OPTIONS, GET, POST');
#header('Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control');
/////////
// W3C //
/////////
// Allow from any origin
#if (isset($_SERVER['HTTP_ORIGIN'])) {
#	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
#	header('Access-Control-Allow-Credentials: true');
#}
// Access-Control headers are received during OPTIONS requests
#if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
#	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))  { header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); }
#	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) { header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}"); }
#}
?>