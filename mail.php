<?php #####################
## DIETCLOCK PHP BACKEND ##
###########################
@require_once('cors.php');
#######################
if(strlen($_REQUEST['msg']) > 0) {
	mail("cancian@dietclock.net", "« Diet Clock » Suggestion Box (".$_REQUEST['usr'].")","E-mail: " . htmlspecialchars($_REQUEST['mail']) . "<br /><br />Message: <br />" . htmlspecialchars($_REQUEST['msg']),
	"From: cancian@dietclock.net \r\n"
	."Content-type: text/html; charset=utf-8 \r\n"
	."Reply-To:" . $_REQUEST['mail'] . "\r\n"
	."X-Mailer: PHP/" . phpversion()
	);
}
?>