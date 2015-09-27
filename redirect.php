<?php #################
## KCALS PHP BACKEND ##
#######################
@require_once('cors.php');
#######################
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