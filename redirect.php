<?php #################
## KCALS PHP BACKEND ##
#######################
//if(!preg_match("^home|local|192.168.1.5|local^",$_SERVER['HTTP_HOST'])) {
	//header("access-control-allow-origin: *");
	header("cache-control: no-cache");
//}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Logging in...</title>
<script>
if((document.URL).match('access_token')) {
	var token = (document.URL).split('access_token=')[1].split('&expires_in=')[0];
	if (macgap) { macgap.userDefaults.setString('macgap_token', token); }
}
</script>
</head>
<body>
</body>
</html>