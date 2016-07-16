<?php ######################
## CHRONOBURN PHP BACKEND ##
############################
@require_once('cors.php');
#######################
if(strlen($_REQUEST['msg']) > 0) {
	mail("cancian@chronoburn.com", "« ChronoBurn » Suggestion Box (".$_REQUEST['usr'].")","E-mail: " . htmlspecialchars($_REQUEST['mail']) . "<br /><br />Message: <br />" . htmlspecialchars($_REQUEST['msg']),
	"From: cancian@chronoburn.com \r\n"
	."Content-type: text/html; charset=utf-8 \r\n"
	."Reply-To:" . $_REQUEST['mail'] . "\r\n"
	."X-Mailer: PHP/" . phpversion()
	);
}
?>