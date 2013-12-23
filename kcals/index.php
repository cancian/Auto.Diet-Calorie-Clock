<?php ##################################
## KCALS - LIVE WEIGHT LOSS FRAMEWORK ##
########################################
if(isset($_GET['redirect'])) { header("Location: http://".$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'] ); }
define("KCALS",true);

## TIMEDIFF ##
function timediff($interval = 4, $starttime, $endtime) {	$timediff = $starttime - $endtime;$days=intval($timediff/86400);$remain=$timediff%86400;$hours=intval($remain/3600);$remain=$remain%3600;$mins=intval($remain/60);$secs=$remain%60;$pluraldays 	= ($days < 2) ? " day " : " days ";$pluralhours 	= ($hours < 2) ? " hour " : " hours ";$pluralmins 	= ($mins < 2) ? " minute " : " minutes ";$pluralsecs 	= ($secs < 2) ? " seconds " : " seconds ";$hourcount	= ($hours == 0) ? 1 : 0;$minscount	= ($mins == 0) ? 1 : 0;$secscount	= ($secs == 0) ? 1 : 0;if ($days > 1) { $timediff = " ".$days.$pluraldays; }elseif ($days == 1) {$timediff = " ".$days." $pluraldays and ".$hours.$pluralhours."";} else { if ($interval == 0) { 	$timediff = " ".$days.$pluraldays."";}elseif ($interval == 1) { $timediff = " ".$hours.$pluralhours."";}elseif ($interval == 2) { $timediff = " ".$mins.$pluralmins."";}elseif ($interval == 3) { $timediff = " ".$secs.$pluralsecs."";}elseif ($interval == 4) {if($hourcount) { $timediff = " ".$mins." ".$pluralmins.""; }else if ($minscount) { $timediff = " ".$hours." ".$pluralhours.""; }else{ $timediff = " ".$hours.$pluralhours." and ".$mins." ".$pluralmins.""; }}elseif ($interval == 5) {if ($hourscount) {	$timediff = " ".$secs." ".$pluralsecs.""; }	else if ($secscount) {	$timediff = " ".$hours." ".$pluralhours.""; }else {	$timediff = " ".$hours.$pluralhours." and ".$sec." ".$pluralsecs.""; }}elseif ($interval == 6) {if ($minscount == 1) {	$timediff = " ".$secs." ".$pluralsecs.""; }	else if ($secscount == 1 ) {	$timediff = " ".$mins." ".$pluralmins.""; }	else {	$timediff = " ".$mins.$pluralmins." and ".$secs." ".$pluralsecs.""; }}else {$timediff = " ".$hours.$pluralhours.", ".$mins." ".$pluralmins." and ".$secs." ".$pluralsecs."";}} return str_replace(" 0  minute"," 0  minutes",$timediff); }
## DELETE ENTRY ##
function cutline($filename,$line_no=-1) { $strip_return=FALSE;  $data=file($filename); $pipe=fopen($filename,'w'); $size=count($data); if($line_no==-1) { $skip=$size-1; } else { $skip=$line_no-1; } for($line=0;$line<$size;$line++) { if($line!=$skip) { fputs($pipe,$data[$line]); } else { $strip_return=TRUE; }} return $strip_return; }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head profile="http://gmpg.org/xfn/11">
<title>ateus.net</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<style type="text/css">
body     { min-height: 1000px; background-color: #fff !important; margin: 90px !important; line-height: 24px !important; margin: 32px; line-height: 24px; background: #fff !important; }
.wrapper { min-height: 1000px; background-color: #fff; }
.info	 { width: 600px !important; margin: 32px auto 32px auto !important; display: block; }
select   { border: 1px solid #ccc; background: #fdfdfd !important; padding: 2px; font-size: 11px; }
.digital { font-family: 'ds-digital'; border: 0; background: #fafafa; font-size: 13pt; font-weight: bold; }
.date	 { font-family: Verdana, Arial, Helvetica, sans-serif; border: 0; background: #fafafa; font-size: 13px; padding: 4px; }
</style>
<link rel="stylesheet" href="livecals.css" type="text/css" media="all" />
<link rel="stylesheet" href="http://homework.ateus.net/wp/wp-content/themes/ateusnet/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="http://homework.ateus.net/wp/wp-content/themes/ateusnet/style_wp.css" type="text/css" media="all" />
<link rel="icon" href="favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
</head>
<body>

<?php require_once("kcals_status.php"); ?>

<div class='box info round relative'>
<h2><strong>activity log</strong></h2>



<form id="form1" name="form1" method="post" action="<?php print 'http://'.$_SERVER["HTTP_HOST"].$_SERVER['SCRIPT_NAME'].'?redirect'; ?>">

<!--
&nbsp;what did you do? &nbsp;&nbsp;
<input type="radio" name="cals" value="eat" id="eat" checked /> eat &nbsp;&nbsp; <input type="radio" name="cals" value="use" id="use" /> use
<br />

<div style="background: #f5f5f5; border: 1px solid #f5f5f5; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 0px; float: left; ">

<input name="what" type="text" size="30" style="background: #fdfdfd; border: 1px solid #ccc; font-size: 14px; padding: 4px 5px 3px 4px; margin-top: 3px;" />
<select name="calories" id="calories" style="font-size: 13px; padding: 3px 3px 2px 3px;"><option value="0" selected="selected">0</option><?php $max = 1000; $i = 0; while($i < $max) { $i = $i+25; print '<option value="'.($i).'">'.($i).'</option>'; } ?></select>


&nbsp;<input type="radio" name="exe" value="custom" id="custom" checked="checked" />
</div>

<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; vertical-align: bottom;">
<input type="radio" name="exe" value="run" id="run" /> <span>running</span>
</div>

<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; ">
<input type="radio" name="exe" value="gym" id="gym" /> <span>weight lifting</span>
</div>

<br />
<br />

<br />
<br />-->
&nbsp;when was it?
<br />

<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; ">


<?php if( date("a",time()) == "am") { $AM = 'selected="selected"'; $PM = ""; $HOUR = "12"; } else { $AM = ""; $PM = 'selected="selected"'; $HOUR = "0"; } ?>
<table width="200" border="0" cellspacing="0" cellpadding="0" style="font-size: 9px; line-height: 11px;">
  <tr>
  
<?php
$i = 0; while($i < 12) { $i = $i+1; $chour = date('h'); if($i == $chour) { $selected = " checked='checked' "; $sborder = ' style="background: #ffcc33; -moz-border-radius: 3px; padding: 1px 2px 0 1px;" '; } else { $selected = ''; $sborder = ''; } if($i < 1) { $zero = "0"; } else { $zero = ''; }
print '<td align="center" valign="bottom" '.$sborder.'><input type="radio" name="hours" value="'.($i).'" id="'.($i).'" '.$selected.' /></td>
'; }
?> 

<td rowspan="2">
&nbsp;
<select name="AMPM" size="2"  style="font-size: 9px; height: 26px; margin: 0;">
<option value="AM" <?php print $AM; ?>>AM</option>
<option value="PM" <?php print $PM; ?>>PM</option>
</select>
</td>
  </tr>
  <tr>

<?php
$i = 0; while($i < 12) { $i = $i+1; $chour = date('h'); if($i == $chour) { $selected = " checked='checked' "; } else { $selected = ''; } if($i < 1) { $zero = "0"; } else { $zero = ''; }
print '<td align="center" valign="top">'.($i).'</td>
'; }
?>  
    </tr>
</table>

</div>

<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; ">
<select name="day" id="day" class="date"><?php $i = 0; while($i < 31) { $i = $i+1; $cday = date('d'); if($i == $cday) { $selected = " selected='selected' "; } else { $selected = ''; } print '<option value="'.($i).'"'.$selected.'>'.($i).'</option>'; } ?> </select>
<select name="month" id="month" class="date"><?php $i = 0; while($i < 12) { $i = $i+1; $cmonth = date('m'); if($i == $cmonth) { $selected = " selected='selected' "; } else { $selected = ''; }
$months = array(1 => 'january',2 => 'february',3 => 'march',4 => 'april',5 => 'may',6 => 'june',7 => 'july',8 => 'august',9 => 'september',10 => 'october',11 => 'november',12 => 'december'); print '<option value="'.($i).'"'.$selected.'>'.($months[$i]).'</option>'; } ?> </select>  
2010
</div> 

<script type="text/javascript">
<!--
	function calculate(food)
	{
		var nutri=food.split("|"); 

		var pro = nutri[0];
		var car = nutri[1];
		var fat = nutri[2];
		var fib = nutri[3];
		var nam = nutri[4];
		var tip = nutri[5];
		var cal = (pro*4)+(car*4)+(fat*9);
	
		document.form1.nam.value = nam;
		if(!tip) { var tip = ''; }
		document.form1.tip.value = tip; 
					
		document.form1.pro.value = pro;
		document.form1.car.value = car;
		document.form1.fat.value = fat;
		document.form1.fib.value = fib;
		
		document.form1.proX.value = pro;
		document.form1.carX.value = car;
		document.form1.fatX.value = fat;
		document.form1.fibX.value = fib;
		
		document.form1.cal.value = cal;

		var GRAMS = document.form1.GRAMS.value = "100";
		var RATIO = document.form1.RATIO.value = cal/100;
		var CALS  = document.form1.CALS.value = Math.ceil(GRAMS * RATIO);
}
-->
</script>

<style>
table#ohoho  span       { color: #777 !important; font-weight: bold; }
table#ohoho  span.label { color: #aaa !important; font-weight: bold; }

table#ohoho input.noshowc	 { border: 0; padding: 4px; background: transparent; color: #cc3300!important;; font-weight: bold; opacity: 1; font-size: 12pt; }
table#ohoho .noshowc		 { border: 0; padding: 4px; background: transparent; color: #cc3300!important;; font-weight: bold; opacity: 0.25; font-size: 12pt; }

table#ohoho input.noshowg	 { border: 0; padding: 4px; background: transparent; color: #0000cc !important; font-weight: bold; opacity: 1; font-size: 12pt; }
table#ohoho  span.noshowg	 { border: 0; padding: 4px; background: transparent; color: #0000cc !important;; font-weight: bold; opacity: .25; font-size: 12pt; }

table#ohoho #CALS,#GRAMS { width: 42px !important;   }
</style>

<table width="420" border="0" align="left" cellpadding="0" cellspacing="0" id='ohoho' style="display: block; clear: both; float: left; background: #fafafa; padding: 10px; -moz-border-radius: 6px; border: 1px solid #ccc; margin-top: 20px;">
  <tr>
    <td colspan="2" align="center">
    
    <div style='border: 1px solid #ccc; -moz-border-radius: 6px; padding: 1px; width: 100%; background: transparent; position: absolute; top: -150px; right: -485px; width: 460px;'>
   <select name="nutri" id="nutri" class="date" onchange="calculate(this.value)" style="width: 100%; background: transparent; border: 0; width: 450px;" size="35">
<!--<option selected="selected" value='0|0|0|0'>— pick food / exercise —</option>-->
<?php
//get food list....
$food_list  = file_get_contents('kcals_foods.txt');
$food_array = explode("\n",$food_list);

//print_r($food_array);

	foreach($food_array as $food_ldata)
	{
	$food_entry = explode("|",$food_ldata);
	//$fdata_id   = $food_entry[0];
	$fdata_name = $food_entry[0];
	$fdata_pro  = str_replace(',','.',$food_entry[1]);
	$fdata_car  = str_replace(',','.',$food_entry[2]);
	$fdata_fat  = str_replace(',','.',$food_entry[3]);
	$fdata_fib  = str_replace(',','.',$food_entry[4]);
	$fdata_tip  = $food_entry[5];
	
	$food_dropdown .= '<option style=\'###\' value="'.$fdata_pro.'|'.$fdata_car.'|'.$fdata_fat.'|'.$fdata_fib.'|'.$fdata_name.'|'.$fdata_tip.'">'.$fdata_name.'</option>\n';
	}

$farray = explode('\n',$food_dropdown);

//sort($farray);

	foreach($farray as $drop)
	{ 
		if(!preg_match("^//^",$drop)) {

		if(preg_match("^!^",$drop))
		{
			$drop = str_replace("!","",$drop);
			$drop = str_replace("###","color: #cc3300; padding: 3px; background: #fff;",$drop);
			print $drop;
		}
		else
		{
		
		if(!preg_match("^@@@^",$drop))
		{

		if($zi == 0)
		{ 
			$linec = "#fff"; 
			$zi = 1;
		}
		elseif($zi == 1)
		{
			$zi = 0;
			$linec = "#f5f5f5";
		}
			$drop = str_replace("###","color: #0000cc; padding: 3px; background: $linec;",$drop);
		}
		else
		{
			$drop = str_replace("###","color: #fff; font-weight: bold; padding: 3px; background: #000;",$drop);
			$drop = str_replace("@@@","&nbsp; > ",$drop);
			$drop = str_replace("%%%","",$drop);
		}
		print $drop; 
		
		
		}
	}}

//print $food_dropdown;
?>
</select>
</div>    </td>
    <td width="194" align="right" valign="middle"><span class='label'>proteínas:&nbsp;</span></td>
    <td width="33" align="left" valign="middle"><input type='text' name='pro' size='3' style='border: 0; background: none;' /></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><input type='text' name='nam' size='3' style='border: 0; background: none; text-align: center; width: 90%;' /><input type="hidden" name="RATIO" value="" />
    
    <input type='text' name='cal' style="display:none;" />
    
    </td>
    <td align="right" valign="middle"><span class='label'>carboidratos:&nbsp;</span></td>
    <td align="left" valign="middle"><input type='text' name='car'  size='3' style='border: 0; background: none;' /></td>
  </tr>
  <tr>
    <td width="110" align="right"><span class='noshowc'>calorias:</span></td>
    <td width="81" align="left"><input type="text" name="CALS" id='CALS' maxlength='8' size='4'   onChange="GRAMS.value = Math.ceil(this.value / RATIO.value);" class="noshowc"></td>
    <td align="right" valign="middle"><span class='label'>gorduras:&nbsp;</span></td>
    <td align="left" valign="middle"><input type='text' name='fat'  size='3' style='border: 0; background: none;' /></td>
  </tr>
  <tr>
    <td align="right"><span class='noshowg'>gramas:</span></td>
    
    
    <td align="left">
  <input type="text" id="GRAMS" name="GRAMS" maxlength='8' size='4' onChange="CALS.value = Math.ceil(this.value * RATIO.value); pro.value = Math.ceil((proX.value/100)*(this.value)); car.value = Math.ceil((carX.value/100)*(this.value)); fat.value = Math.ceil((fatX.value/100)*(this.value)); fib.value = Math.ceil((fibX.value/100)*(this.value));" class="noshowg"></td>
  <input type='text' name='proX' style="visibility:hidden;" />
  <input type='text' name='carX' style="visibility:hidden;" />
  <input type='text' name='fatX' style="visibility:hidden;" />
  <input type='text' name='fibX' style="visibility:hidden;" />


    <td align="right" valign="middle"><span class='label'>fibras:&nbsp;</span></td>
    <td align="left" valign="middle"><input type='text' name='fib'  size='3' style='border: 0; background: none;' /></td>
  </tr>
  <tr>
    <td colspan="2" align="left"><input type="text" name='tip' id='tip' size='18' value='' style="border: 0; width: 200px; text-align: center; background: transparent;" /></td>
    <td colspan="2" align="right">
     
     <div style='border: 1px solid #ccc; -moz-border-radius: 6px; padding: 3px 1px 1px 1px; background: #fefefe; width: 150px !important; margin-left: -120px;'>
    <input type="text" name='newname' size='14' value='' style="border: 0; width: 150px;  background: #fefefe;" />
    </div>    </td>
    </tr>
  <tr>
    <td align="center"><div class="text"><input class="submit" type="submit" name="entry" id="entry" value="add entry" /></div></td>
    <td>&nbsp;</td>
    <td colspan="2" align="right"><div class="text" style="padding-left: 50px;"><input class="submit" type="submit" name="newfood" id="newfood" value="new food" />
    </div></td>
    </tr>
</table>

<div style="clear: both;"></div>

  
  
<!--
<div style="background: #fafafa; border: 1px solid #ccc; -moz-border-radius: 6px; padding: 6px;  display: inline-block; float: left; ">
<select name="hour" id="hour" class='digital'><?php $i = -1; while($i < 23) { $i = $i+1; $chour = date('H'); if($i == $chour) { $selected = " selected='selected' "; } else { $selected = ''; } if($i < 1) { $zero = "0"; } else { $zero = ''; } print '<option value="'.$zero.($i).'"'.$selected.'>'.($i).'</option>'; }?> </select>
:
<select name="minute" id="minute" class='digital'><?php $i = -1; while($i < 59) { $i = $i+1; $cminute = date('i'); if($i == $cminute) { $selected = " selected='selected' "; } else { $selected = ''; } print '<option value="'.($i).'"'.$selected.'>'.($i).'</option>'; } ?></select>
</div>
-->
</p>


<br />
<br />
</form>

<?php 
$startt = file_get_contents("kcals_start.txt");
$diary  = file_get_contents('kcals_diary.txt');
$entries = explode("\n",$diary);
$line = 0;

/////////////////////////////
// TEMP TIME-SORTING ARRAY //
/////////////////////////////
$zentries = explode("\n",$diary);
	foreach($zentries as $zentry)
	{
		if($zentry)
		{
			$diary_zentry = explode("|",$zentry); $etime = $diary_zentry[1];
			
				if($etime > $startt)
				{
					$zarray .= $etime."\n";
				}
		}
	}
$sarray = explode("\n",$zarray);
#################
## THE LISTING ##
#################
	foreach($entries as $entry)
	{
		if(!empty($entry))
		{
			$line = $line+1;
			$diary_entry = explode("|",$entry);
			$ecals = $diary_entry[0];
			$etime = $diary_entry[1];
			$ewhat = $diary_entry[2];

				if($etime > $startt)
				{
					$centry = $centry+$ecals;
					$ncount = ($etime-time())/60;			
					if($ecals > 0) { $colour = "#0000CC"; } else { $colour = "#CC3300"; }
					$pday = date('H',$etime);

				    if($pday >= 18)     { $theday = "#F0F3F5";  } // night
					elseif($pday >= 12) { $theday = "#F7F2ED";  } // afternoon
					elseif($pday >= 6)  { $theday = "#FDFDF0";  } // morning
					elseif($pday >= 0)  { $theday = "#E6EAF6";  } // after hours
					##output					

					$stuff .= $etime."|".$ecals."|".$ewhat."|".$line."\n";
				}
		}
	}
#########################
## TIME-ORDERED OUTPUT ##
#########################
$relist = explode("\n",$lero);
$n      = 0;
$narray = $sarray;
array_multisort($narray,SORT_NUMERIC,SORT_DESC,$relist);
print "<table width='420' cellspacing='4' cellpadding='4' style='white-space: nowrap; border-top: 1px solid #ccc;'>";
	
	foreach($relist as $item)
	{
		$n = $n+1;
		$item = str_replace("###","<td style='opacity: 0.3; width: 30px;' width='30'>&nbsp;&nbsp;#".$n."&nbsp;&nbsp;</td>",$item);
		print $item;
	}
print "</table>";
#########################
## AUTO-DELETE EXPIRED ##
#########################
$restuff = explode("\n",$stuff);
$s       = 0;
array_multisort($sarray,SORT_NUMERIC,SORT_DESC,$restuff);

	foreach($restuff as $stuff)
	{
		if(!empty($stuff))
		{			
			$s = $s+1;
			$stuff_entry = explode("|",$stuff);
			$scals = $stuff_entry[1];
			$stime = $stuff_entry[0];
			$swhat = $stuff_entry[2];	
			$sline = $stuff_entry[3];
		}
	}
/////////////////
// removing... //
/////////////////
$calo_diff = $scals;
$line_diff = $s;
$time_diff = $stime;

## 48h timer...

//get the intake...
$filename    = 'kcals_intake.txt';
$checkit     = file_get_contents($filename);
$checkdata   = explode("|",$checkit);
$the_intake  = $checkdata[0];

$h48 = 60*60*1200;
if(time()-$time_diff > $h48+($calo_diff*60*$the_intake)) { cutline('kcals_diary.txt',$sline); $wadjust = file_get_contents("kcals_start.txt"); $newsum = $wadjust+($calo_diff*60); $fp = fopen("kcals_start.txt", "w"); if($fp) { fwrite ($fp,$newsum); fclose ($fp); print "<p>the start date has been automatically adjusted to <strong>".date("d/m/y - H:i",$newsum)."</strong></p>"; }}
//search for the oldest item...
$ddiary  = file_get_contents('kcals_diary.txt');
$dentries = explode("\n",$ddiary);
$deline = 0;

/////////////////////////////
// TEMP TIME-SORTING ARRAY //
/////////////////////////////
$dentries = explode("\n",$ddiary);
foreach($dentries as $dentry) { if($dentry) { $diary_dentry = explode("|",$dentry); $dtime = $diary_dentry[1]; if($dtime > $startt) { $narray .= $dtime."\n"; }}}

# calculate the total expenditure after START
## do the index.php sum...
$start   = file_get_contents("kcals_start.txt");
$now     = time();
$cal     = 1440;
$day     = 60*60*24;
$calsday = $cal/$day;
$count   = ceil(($start-$now)*$calsday);

if($_POST['cals'] == "use") { $_POST['calories'] = $_POST['calories']*-1; }
//if($_POST['exe'] == "run")  { $_POST['calories'] = -450; $_POST['what'] = "running"; }
//if($_POST['exe'] == "gym")  { $_POST['calories'] = -250; $_POST['what'] = "weight lifting"; }

#################
## WRITE ENTRY ##
################# > calories | time | food/exercise

//new foods...
	if(isset($_POST['newfood'])
		&& !empty($_POST['newname'])
		//&& !empty($_POST['pro'])
		//&& !empty($_POST['car'])
		//&& !empty($_POST['fat'])
		//&& !empty($_POST['fib'])
		)
	{
		$foodname = 'kcals_foods.txt';
		$new_ID   = substr(md5(rand(11111111111111,999999999999999)),4,16);
		$msg = $new_ID."|".$_POST['newname']."|".$_POST['pro']."|".$_POST['car']."|".$_POST['fat']."|".$_POST['fib']."\n";
		$fp  = fopen($foodname, "a");
	
			if($fp)
			{
				fwrite($fp,$msg);
				fclose($fp);
			}
	}

//add entries...
	elseif($_POST['CALS'])
	{
		$filename = 'kcals_diary.txt';

		//$when   = strtotime($_POST['month'].'/'.$_POST['day'].'/'.date("y").' '.$_POST['hour'].':'.$_POST['minute']);
		$when     = strtotime($_POST['month'].'/'.$_POST['day'].'/'.date("y").' '.$_POST['hours'].':'.date('i',time()+60).' '.$_POST['AMPM']);
		$what     = $_POST['nam'];
		$msg      = $_POST['CALS']."|".$when."|".$what."|".$_POST['GRAMS']."|".$_POST['pro']."|".$_POST['car']."|".$_POST['fat']."|".$_POST['fib']."\n";
		$fp       = fopen($filename, "a");
		if ($fp) { fwrite ($fp, $msg); fclose ($fp); }}

##################
## DELETE ENTRY ##
##################
if($_GET['del']) { cutline('kcals_diary.txt',$_GET['del']); }
?>

<?php
///////////////////////
// BUILD NUTRI INDEX //
///////////////////////
$kfilename   = 'kcals_cals.txt';
$kcheckit    = file_get_contents($kfilename);
$kcheckdata  = explode("|",$kcheckit);
$nutri_sum   = $kcheckdata[0];

//read consumed stuff from list
$_diary    = file_get_contents('kcals_diary.txt');
$_zentries = explode("\n",$_diary);
$_line     = 0;
 
	foreach($_zentries as $_zentry)
	{	
		$sutri = explode('|',$_zentry);
		$cata_time = $sutri[1];
		
		if($cata_time >= $startt)
			{	
				if($_zentry)
				{
					//RESET
					$zata_cals = '';
					$zata_time = '';
					$zata_name = '';
					$zata_gram = '';
					$zata_pro =  '';
					$zata_car =  '';
					$zata_fat =  '';
					$zata_fib =  '';
	
					$sutri = explode('|',$_zentry);
		
					$cata_cals = $sutri[0];
						if($cata_cals > 0)
						{
							$zata_cals = $sutri[0];
							$zata_time = $sutri[1];
							$zata_name = $sutri[2];
							$zata_gram = $sutri[3];
							$zata_pro =  $sutri[4];
							$zata_car =  $sutri[5];
							$zata_fat =  $sutri[6];
							$zata_fib =  $sutri[7];
						}
						else 
						{
							//add caloric usage to totals...
							$zata_cals = $sutri[0];
							$exercise_sum = $exercise_sum+$zata_cals;
						}
		
					$tot_pro = $tot_pro+$zata_pro;
					$tot_car = $tot_car+$zata_car;
					$tot_fat = $tot_fat+$zata_fat;

				}
			}
	}

	
//negative part of the exercises
//NUTRI BAR PRE-ROOM
$nutri_sum = $nutri_sum+$exercise_sum-600;

//ratios
$r_pro = 0.35;
$r_car = 0.40;
$r_fat = 0.25;

$spro = abs(round($nutri_sum*($r_pro)/4));
$scar = abs(round($nutri_sum*($r_car)/4));
$sfat = abs(round($nutri_sum*($r_fat)/9));

$nutri_pro = $tot_pro.' / '.$spro.'g';
$nutri_car = $tot_car.' / '.$scar.'g';
$nutri_fat = $tot_fat.' / '.$sfat.'g';

$pro_width = $tot_pro/($spro);
$car_width = $tot_car/($scar);
$fat_width = $tot_fat/($sfat);

$per_pro = abs($pro_width*200);
$per_car = abs($car_width*200);
$per_fat = abs($fat_width*200);

    if($per_pro > 300) { $red_pro = $per_pro; $per_pro = 200; $pro_color = '#ff3300'; } 
elseif($per_pro > 200) { $red_pro = $per_pro; $per_pro = 200; $pro_color = '#ffdd33'; } 
else                   { $pro_color = '#00ff00'; $red_pro = ''; }

    if($per_car > 300) { $red_car = $per_car; $per_car = 200; $car_color = '#ff3300'; } 
elseif($per_car > 200) { $red_car = $per_car; $per_car = 200; $car_color = '#ffdd33'; }
else                   { $car_color = '#00ff00'; $red_car = ''; }

    if($per_fat > 300) { $red_fat = $per_fat; $per_fat = 200; $fat_color = '#ff3300'; }
elseif($per_fat > 200) { $red_fat = $per_fat; $per_fat = 200; $fat_color = '#ffdd33'; }
 else                  { $fat_color = '#00ff00'; $red_fat = ''; }
?>

<div style="font-size: 10px; color: #fff; line-height: 14px; text-indent: 5px; white-space: nowrap; max-width: 100px; background: #ccc;">

	<div style="position:absolute; top: -80px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>
	<div style="position:absolute; top: -65px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>
	<div style="position:absolute; top: -50px; left: 150px; width: 200px; height: 12px; -moz-border-radius: 3px; background: #fff; border: 1px solid #ccc;"></div>

	<div style="position:absolute; top: -80px; left: 150px; width: <?php print round($per_pro); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $pro_color; ?>; border: 1px solid #888;"></div>
	<div style="position:absolute; top: -65px; left: 150px; width: <?php print round($per_car); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $car_color; ?>; border: 1px solid #888;"></div>
	<div style="position:absolute; top: -50px; left: 150px; width: <?php print round($per_fat); ?>px; height: 12px; -moz-border-radius: 3px; background: <?php print $fat_color; ?>; border: 1px solid #888;"></div>

	<div style="position:absolute; top: -80px; left: 350px; height: 11px; color: #666;">proteins (<?php print round($r_pro*100); ?>%)</div>
	<div style="position:absolute; top: -65px; left: 350px; height: 11px; color: #666;">carbs (<?php print round($r_car*100); ?>%)</div>
	<div style="position:absolute; top: -50px; left: 350px; height: 11px; color: #666;">fats (<?php print round($r_fat*100); ?>%)</div>

	<div style="position:absolute; top: -80px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_pro; ?></div>
	<div style="position:absolute; top: -65px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_car; ?></div>
	<div style="position:absolute; top: -50px; left: 150px; height: 12px; opacity: .6; color: #666;"><?php print $nutri_fat; ?></div>
		
</div>
</div>

<?php require_once("kcals_start.php"); ?>

</body>
</html>