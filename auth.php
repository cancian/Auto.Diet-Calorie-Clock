<?php ####################
## DIETCLOCK EMAIL AUTH ##
##########################
@require_once('cors.php');
//header('Content-Type: text/html; charset=utf-8');
################
//CREATE FILE
if(!file_exists('userdata/userlist.txt')) { 
	touch('userdata/userlist.txt'); 
}
//#//////////#//
//# GET LINE #//
//#//////////#//
function getLineWithString($str) {
	if(!$str) { return -1; }
	$lines = file('userdata/userlist.txt');
	foreach ($lines as $lineNumber => $line) {
		if (strpos($line, $str) !== false) {
			return $line;
		}
	}
	return -1;
}
//#///////////#//
//# SAVE USER #//
//#///////////#//
function addUser($usrMail,$usrHash) {
	if(strlen($usrHash) != 32)  { return; }
	$fh = fopen('userdata/userlist.txt', 'a');
	$string = '@###'.$usrMail."###".$usrHash."\n";
	fwrite($fh, $string);
	fclose($fh);
	return $string;
}
//##///////////////////##//
//## GET REDEFINE POST ##//
//##///////////////////##//
if(strlen($_REQUEST['pass1']) > 1) {
	$userName  = trim(htmlentities($_REQUEST['reset']));
	$userExists = getLineWithString('@###'.$userName.'###');
	if($userExists !== -1) {
		/////////////////////
		// SEND RESET MAIL //
		/////////////////////
		$userExists = explode('###',$userExists);
		$resetMail = $userExists[1];
		$resetHash = $userExists[2];
		//WRITE NEW HASH
		$file = 'userdata/userlist.txt';
		$oldLine = '###'.$resetMail.'###'.trim($resetHash);
		$newLine = '###'.$resetMail.'###'.trim(md5($_REQUEST['pass1']));
		file_put_contents($file, str_replace($oldLine, $newLine, file_get_contents($file)));
		echo "password changed";
		die();
	}
}
//#///////////////////#//
//# REDEFINE PASSWORD #//
//#///////////////////#//
if(strlen($_GET['reset']) > 1) {
	$userName   = trim(htmlentities($_GET['reset']));
	$userExists = getLineWithString('@###'.$userName.'###');
	if($userExists !== -1) {
		$userExists = explode('###',$userExists);
		$resetMail  = $userExists[1];
		$resetHash  = $userExists[2];
		if(trim($_GET['key']) == trim($resetHash)) {
			////////////////////
			// SHOW HTML FORM //
			////////////////////
			include("auth.html");
		} else {
			echo 'invalid request';
		}
	} else {
		////////////////////
		// USER NOT FOUND //
		////////////////////
		echo "invalid request";
	}
	die();
}
//#/////////////#//
//# USER EXISTS #//
//#/////////////#//
if(strlen($_GET['user']) > 1) {
	$userName  = trim(htmlentities($_GET['user']));
	$userExists = getLineWithString('@###'.$userName.'###');
	if($userExists !== -1) {
		/////////////////////
		// SEND RESET MAIL //
		/////////////////////	
		$userExists = explode('###',$userExists);
		$resetMail = $userExists[1];
		$resetHash = $userExists[2];
		$resetLink = "https://dietclock.net/auth.php?reset=".$resetMail."&key=".$resetHash;
		$resetBody  = "<p>We have received a password reset request for your Diet Clock account <strong>".$resetMail."</strong>.</p>";
		$resetBody .= "<p>If you made this request, then please click on the link below:</p>";
		$resetBody .= "<p><a href='".$resetLink."'>".$resetLink."</a></p>";
		mail($resetMail, "« Diet Clock » Password Reset", $resetBody,
		"From: cancian@dietclock.net\r\n"
		."Content-type: text/html; charset=utf-8\r\n"
		."Reply-To: dietclock.net\r\n"
		."X-Mailer: PHP/" . phpversion());
		echo "sent";
	} else {
		////////////////////
		// USER NOT FOUND //
		////////////////////
		echo "error";
	}
	die();
}
//#////////////////#//
//# CALLBACK TO JS #//
//#////////////////#//
if(strlen($_GET['mail']) > 1 && strlen($_GET['hash']) > 1) {
	$getMail = htmlentities($_GET['mail']);
	$getHash = htmlentities($_GET['hash']);
	$getData = getLineWithString('@###'.$getMail.'###');
	if($getData !== -1) {
		$usrData = explode('###',$getData);
		$usrMail = $usrData[1];
		$usrHash = $usrData[2];
		if(trim($getHash) == trim($usrHash)) {
			echo 'logged';
		} else {
			echo 'error';
		}
	} else {
		//NOT FOUND
		addUser($getMail,trim($getHash));
		echo 'created';
	}
}
?>