<?php ##################################
## KCALS - LIVE WEIGHT LOSS FRAMEWORK ##
########################################
function KCAL_STATUS() {

function timediffo($interval = 4,$starttime, $endtime) {	$timediff = $starttime - $endtime;$days=intval($timediff/86400);$remain=$timediff%86400;$hours=intval($remain/3600);$remain=$remain%3600;$mins=intval($remain/60);$secs=$remain%60;$pluraldays 	= ($days < 2) ? " day " : " days ";$pluralhours 	= ($hours < 2) ? " hour " : " hours ";$pluralmins 	= ($mins < 2) ? " minute " : " minutes ";$pluralsecs 	= ($secs < 2) ? " seconds " : " seconds ";$hourcount	= ($hours == 0) ? 1 : 0;$minscount	= ($mins == 0) ? 1 : 0;$secscount	= ($secs == 0) ? 1 : 0;if ($days > 1) { $timediff = " ".$days.$pluraldays; }elseif ($days == 1) {$timediff = " ".$days." $pluraldays and ".$hours.$pluralhours."";} else { if ($interval == 0) { 	$timediff = " ".$days.$pluraldays."";}elseif ($interval == 1) { $timediff = " ".$hours.$pluralhours."";}elseif ($interval == 2) { $timediff = " ".$mins.$pluralmins."";}elseif ($interval == 3) { $timediff = " ".$secs.$pluralsecs."";}elseif ($interval == 4) {if($hourcount) { $timediff = " ".$mins." ".$pluralmins.""; }else if ($minscount) { $timediff = " ".$hours." ".$pluralhours.""; }else{ $timediff = " ".$hours.$pluralhours." and ".$mins." ".$pluralmins.""; }}elseif ($interval == 5) {if ($hourscount) {	$timediff = " ".$secs." ".$pluralsecs.""; }	else if ($secscount) {	$timediff = " ".$hours." ".$pluralhours.""; }else {	$timediff = " ".$hours.$pluralhours." and ".$sec." ".$pluralsecs.""; }}elseif ($interval == 6) {if ($minscount == 1) {	$timediff = " ".$secs." ".$pluralsecs.""; }	else if ($secscount == 1 ) {	$timediff = " ".$mins." ".$pluralmins.""; }	else {	$timediff = " ".$mins.$pluralmins." and ".$secs." ".$pluralsecs.""; }}else {$timediff = " ".$hours.$pluralhours.", ".$mins." ".$pluralmins." and ".$secs." ".$pluralsecs."";}} return str_replace(" 0  minute"," 0  minutes",$timediff); }

###############
## SHORTCUTS ##
###############
$start   = file_get_contents("kcals_start.txt");
$now     = time();
$hour    = 60*60;
$day     = 60*60*24;

######################
## CREATE THE CYCLE ##
######################
$na = "plateau in";
$nb = "diet plateau";
$nc = "plateau out";
$nd = "carb up";

$ia = 1440/1440;
$ib = 1440/1440;
$ic = 1440/1440;
$id = 2400/1440;

	$dday = 0+($hour*3);
	$type = "c";

	while($dday < $now)
	{
		$dday = $dday+$day;
		## SET CALS...
		    if($type == "a") { $curr = "a"; $type = "b"; $intake = $ia; $dname = $na; }
		elseif($type == "b") { $curr = "b"; $type = "c"; $intake = $ib; $dname = $nb; }
		elseif($type == "c") { $curr = "c"; $type = "d"; $intake = $ic; $dname = $nc; }
		elseif($type == "d") { $curr = "d"; $type = "a"; $intake = $id; $dname = $nd; }
	}

////////////////////////
$cal = 1440; //*$intake; 
////////////////////////

###########################
## GET THE START OF cDAY ##
###########################
$dow   = date("m/d/Y",time());
$scday = strtotime($dow);
// calculate proporcions
$spassed = $now-$scday;
$sadd    = $spassed/$day;
$sdrop   = 1-$sadd;

###//////////////////////###
###////// DIET WHILE ////###
###//////////////////////###
//seconds ago the diet stared
$elapsed_diet = $now - $start;
//the start of the day in seconds (date)
$cur_day_start = strtotime(date("m/d/Y",time()));
//seconds ago the day started
$elapsed_today = $now - $cur_day_start;

	############### *current*
	## FIRST DAY ## 
	###############
	//check if we've been dieting past one day...
	if($elapsed_diet > $elapsed_today)
	{

		$elapsed_diet_past = $elapsed_diet - $elapsed_today;

	}
		$diet_day = 0;
		$current_day_label = $curr;
	
		    if($current_day_label == "a") { $diet_day = $diet_day+1; $intake = $ia; $day_name = $na; }
		elseif($current_day_label == "b") { $diet_day = $diet_day+1; $intake = $ib; $day_name = $nb; }
		elseif($current_day_label == "c") { $diet_day = $diet_day+1; $intake = $ic; $day_name = $nc; }
		elseif($current_day_label == "d") { $diet_day = $diet_day+1; $intake = $id; $day_name = $nd; }

		$today_intake = $intake;
		$today_label  = $current_day_label;
		$today_name   = $day_name;

		// alldays: label|intake|day_name|seconds //
		$alldays .= "$diet_day|$current_day_label|$elapsed_today|$intake|$day_name\n";


	//////////////////////
	// WHOLE DAYS WHILE //
	//////////////////////
	// time left divided by seconds in a day... to see how many whole days we have left...
	if(($elapsed_diet_past/$day) >= 1)
	{
		$elapsed_diet_whole = floor($elapsed_diet_past/$day);
		$total_wdays = 0;

			while($total_wdays < $elapsed_diet_whole)
			{
				//////////////////////////////
				// THE CYCLE WHOLE-DAY LOOP //
				//////////////////////////////
				$total_wdays = $total_wdays+1;
				        if($current_day_label == "b") { $diet_day = $diet_day+1; $curr = "a"; $current_day_label = "a"; $intake = $ia; $day_name = $na; }
					elseif($current_day_label == "c") { $diet_day = $diet_day+1; $curr = "b"; $current_day_label = "b"; $intake = $ib; $day_name = $nb; }
					elseif($current_day_label == "d") { $diet_day = $diet_day+1; $curr = "c"; $current_day_label = "c"; $intake = $ic; $day_name = $nc; }
					elseif($current_day_label == "a") { $diet_day = $diet_day+1; $curr = "d"; $current_day_label = "d"; $intake = $id; $day_name = $nd; }

				$alldays .= "$diet_day|$current_day_label|$day|$intake|$day_name\n";
			}
	}
############## *first*
## LAST DAY ##
##############
	//seconds elapsed in the first day
	//if there was more than today, there was a last...
	if($elapsed_diet > $elapsed_today)
	{

		$elapsed_diet_first_day = ($elapsed_diet) - (($elapsed_diet_whole*$day)+($elapsed_today));

		    if($current_day_label == "b") { $diet_day = $diet_day+1; $current_day_label = "a"; $intake = $ia; $day_name = $na; }
		elseif($current_day_label == "c") { $diet_day = $diet_day+1; $current_day_label = "b"; $intake = $ib; $day_name = $nb; }
		elseif($current_day_label == "d") { $diet_day = $diet_day+1; $current_day_label = "c"; $intake = $ic; $day_name = $nc; }
		elseif($current_day_label == "a") { $diet_day = $diet_day+1; $current_day_label = "d"; $intake = $id; $day_name = $nd; }

		// alldays: label|intake|day_name|seconds
		$alldays .= "$diet_day|$current_day_label|$elapsed_diet_first_day|$intake|$day_name";
	}
###########################
## THE ALLDAYS ARRAY SUM ##
###########################
$alldays_array = explode("\n",$alldays);

	$data_sum = 0;
	
	foreach($alldays_array as $dieting_day)
	{	
		$diet_data    = explode("|",$dieting_day);
		$data_day     = $diet_data[0];
		$data_label   = $diet_data[1];
		$data_elapsed = $diet_data[2];
		$data_intake  = $diet_data[3];
		$data_name    = $diet_data[4];
		
		if($elapsed_diet < $elapsed_today)
		{
			$data_elapsed = $elapsed_diet;
		}
		
		$data_sum = $data_sum+(($data_elapsed/60)*$data_intake);
	}
	
## subtract the caloric usage...
$count = -$data_sum;

print '<div id="livestats">';
print '<div class="box info round" id="livestats" style="position:relative;">';
print "<a href='index.php' style='position: absolute; top: 13px; right: 22px; text-align: right; display: block; width: 625px; height: 32px; '><img src='http://".$_SERVER['HTTP_HOST']."/wp/wp-content/themes/ateusnet/images/refresh.png' /></a>";
## calories déficit or superávit
$diary   = file_get_contents('kcals_diary.txt');
$entries = explode("\n",$diary);

foreach($entries as $entry)
	{
		if(!empty($entry))
		{
		$line = $line+1;
		
			//shortcuts
			$diary_entry = explode("|",$entry);
		
			$ecals = $diary_entry[0];
			$etime = $diary_entry[1];
			$ewhat = $diary_entry[2];
		
				## CALC the total
				//add if it was consumed after the START				
				if($etime > $start)
				{
					$centry = $centry+$ecals;
					## calories in time
					$ncount = ($etime-time())/60;						
					if($ecals > 0) { $colour = "#0000CC"; } else { $colour = "#CC3300"; }
					$xcals = $xcals+$ecals;				
				}		
		}	
	}
	
    if(abs($count+$xcals) < 300)  { $cal_status = "balanced";  $cal_colour = "#0000cc"; }
elseif(ceil($count+$xcals) > 100) { $cal_status = "superavit"; $cal_colour = "#008800"; }
  else                            { $cal_status = "deficit";   $cal_colour = "#cc3300"; }

if(abs($count+$xcals) > 600) { $action = "<strong style='color: #cc3300;'>STOP!</strong>"; }

$live = ceil($count+$xcals);
$live = number_format($count+$xcals,2,'.','');
print "<h2 style='font-size: 18pt; padding-bottom: 0; margin-bottom: 0px; color: $cal_colour; border-bottom: 1px solid $cal_colour; '>caloric status: <strong>".$live." cals </strong><span style='opacity: 0.2; color: $cal_colour; '> (".$cal_status.")</span> ".$action."</h2>";
$ctime = time() - ((ceil(($count+$xcals))*60)/$today_intake);
?>

<div style="padding-left: 6px;">

<div style="padding: 16px 0 3px 0;"><strong><?php print strtoupper($dname).$rep; ?></strong></div>
<div><strong><?php print $today_intake*$cal; ?></strong> cals</div>

<div style="position:absolute; top: 42px; right: 24px; opacity: 0.25; ">eq. time: <strong><?php if(time()-$ctime > 0) { print timediffo(4,time(),$ctime); } else { print timediffo(4,$ctime,time()); } ?></strong></div>
<div style="position:absolute; top: 59px; right: 24px; opacity: 0.50; ">day <strong><?php print $today_label; ?></strong></div>
<div style="position:absolute; top: 97px; right: 5px; color: #bbb; font-size: 10px;">been dieting for <strong><?php print timediffo(4,time(),$start); ?></strong></div>

<div style="position:absolute; top: 170px; right: 21px; z-index: 1; color: #5B9F35; font-size: 9pt;">
<?php 
////////////////
// PT-BR DATE //
////////////////
$dia_num = date("w");
$dia_port = $dia_num;

	    if($dia_port == 0) { print("domingo"); }
	elseif($dia_port == 1) { print("segunda"); }
	elseif($dia_port == 2) { print("terça");   }
	elseif($dia_port == 3) { print("quarta");  }
	elseif($dia_port == 4) { print("quinta");  }
	elseif($dia_port == 5) { print("sexta");   }
	else                   { print("sábado");  }

$dia_mes = date("d");
print(", $dia_mes de ");
$mes_num = date("m");
$mes_port = $mes_num;

        if($mes_port == '01') { print("janeiro");   }
	elseif($mes_port == '02') { print("fevereiro"); }
	elseif($mes_port == '03') { print("março");     }
	elseif($mes_port == '04') { print("abril");     }
	elseif($mes_port == '05') { print("maio");      }
	elseif($mes_port == '06') { print("junho");     }
	elseif($mes_port == '07') { print("julho");     }
	elseif($mes_port == '08') { print("agosto");    }
	elseif($mes_port == '09') { print("setembro");  }
	elseif($mes_port == '10') { print("outubro");   }
	elseif($mes_port == '11') { print("novembro");  }
	else{ print("Dezembro"); }

$ano = date("Y");
print(" de $ano");
?>
</div>

<div style="position:absolute; top: 187px; right: 21px; z-index: 1; color: #407326; font-size: 9pt;">
<?php 
print date("h:i A",time());
?>
</div>


</div>
</div>
</div>

<?php 
///////////////////////////////
// WRITE DOWN TODAY'S INTAKE //
///////////////////////////////
$filename    = 'kcals_intake.txt';
$checkit     = file_get_contents($filename);
$checkdata   = explode("|",$checkit);
$the_intake  = $checkdata[0];
$data_intake = $checkdata[1];
$today_date  = date("d/m/y");

	if($data_intake != $today_date)
	{ 
		$msg = $today_intake."|".$today_date;
		$fp = fopen($filename, "w");
			if($fp)
			{
				fwrite($fp,$msg);
				fclose($fp);
			}
}

//////////////////////////////
// WRITE DOWN HOURLY'S CALS //
//////////////////////////////
$kfilename   = 'kcals_cals.txt';
$kcheckit    = file_get_contents($kfilename);
$kcheckdata  = explode("|",$kcheckit);
$kthe_cals   = $kcheckdata[0];
$kdata_cals  = $kcheckdata[1];
$ktoday_date = date("d/m/y - H");

	if($kdata_cals != $ktoday_date)
	{		
		// cals elapsed
		$kmsg = $count."|".$ktoday_date;
		$kfp = fopen($kfilename, "w");
			if($kfp)
			{
				fwrite($kfp,$kmsg);
				fclose($kfp);
			}
}

###############
## REFRESHER ##
###############
$refresh  = '1000';
$outputo .= '
<script type="text/javascript">
function onlineFETCH(fetch,div)     { if(window.XMLHttpRequest) { GETurl = new XMLHttpRequest(); } else if (window.ActiveXObject) { GETurl = new ActiveXObject("Microsoft.XMLHTTP"); } if (GETurl != undefined) { GETurl.onreadystatechange = function() {onlineFETCHDone(fetch, div); }; GETurl.open("GET", fetch, true); GETurl.send(""); }}
function onlineFETCHDone(fetch,div) { if (GETurl.readyState == 4) { if (GETurl.status == 200) { document.getElementById(div).innerHTML = GETurl.responseText; } else {}}}
function online(name,div)           { if(!name) { return; } onlineFETCH(name,div); return false; }
</script>';
$outputo .= "<script type='text/javascript'> function onlinelist() { onlinefetch = 'kcals_status.php'; online(onlinefetch,'livestats'); } setInterval('onlinelist()',$refresh); </script> \n";
print $outputo; }

KCAL_STATUS();
?>