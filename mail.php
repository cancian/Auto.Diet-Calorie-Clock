<?php #####################
## AUTO.DIET PHP BACKEND ##
###########################
@require_once('cors.php');
#######################
if(strlen($_REQUEST['msg']) > 0) {
	mail("cancian@auto.diet", "« Auto.Diet » Suggestion Box (".$_REQUEST['usr'].")","E-mail: " . htmlspecialchars($_REQUEST['mail']) . "<br /><br />Message: <br />" . htmlspecialchars($_REQUEST['msg']),
	"From: cancian@auto.diet \r\n"
	."Content-type: text/html; charset=utf-8 \r\n"
	."Reply-To:" . $_REQUEST['mail'] . "\r\n"
	."X-Mailer: PHP/" . phpversion()
	);
}
?>