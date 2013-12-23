<?php #####################
## KCALS - START COUNTER ##
###########################
function KCAL_START() {

//if(isset($_GET['redirect'])) { header("Location: http://".$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'] ); }

$start = file_get_contents("kcals_start.txt");

if(empty($start)) { $start = time(); }

print "<div class='box info round'>";

//print "<div class='box subinfo round'>the current date is ".date("d-m-y - H:i",$start)."</div>";


## started form select
$started_form .= '<form id="form" name="form" method="post" action="http://'.$_SERVER["HTTP_HOST"].$_SERVER['SCRIPT_NAME'].'?redirect">';




$started_form .=  '<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; ">';

#days
$started_form .= '<select class="date" name="_day" id="_day">';

$i = 0;
	while($i < 31)
	{
		$i = $i+1;
		$cday = round(date('d',$start));

			if($i == $cday)
			{
				$selected = " selected='selected' ";
			}
			else
			{
				$selected = '';
			}
				
	$started_form .= '<option value="'.($i).'"'.$selected.'>'.($i).'</option>';
	}
$started_form .= '</select> ';



$started_form .= '<select class="date" name="_month" id="_month">';
#months
$i = 0; 
while($i < 12) 
{
	$i = $i+1;
	$cmonth = date('m',$start);
		if($i == $cmonth)
		{
			$selected = " selected='selected' ";
		}
		else
		{
		$selected = '';
		}

	$months = array(1 => 'january',2 => 'february',3 => 'march',4 => 'april',5 => 'may',6 => 'june',7 => 'july',8 => 'august',9 => 'september',10 => 'october',11 => 'november',12 => 'december');

	$started_form .= '<option value="'.($i).'"'.$selected.'>'.($months[$i]).'</option>';
}

$started_form .= '</select> 2010 ';


$started_form .=  "</div>";






$started_form .=  '<div style="background: #fafafa; border: 1px solid #ccc; display: inline-block; margin-right: 20px; -moz-border-radius: 6px; padding: 6px; float: left; ">';


#hours
$started_form .= '<select class="digital" name="_hour" id="_hour">';

$i = -1;
	while($i < 23)
	{
		$i = $i+1;
		$chour = round(date('H',$start));

			if($i == $chour)
			{
				$selected = " selected='selected' ";
			}
			else
			{
				$selected = '';
			}
	
	#fix 0 hour			
	if($i < 1)
	{
		$zero = "0";
	}
	else
	{
	$zero = '';
	}
	
	$started_form .= '<option value="'.$zero.($i).'"'.$selected.'>'.($i).'</option>';
	
	
	}
$started_form .= '</select>';


#minutes
$started_form .= ' : <select  class="digital" name="_minute" id="_minute">';

$i = -1;
	while($i < 59)
	{
		$i = $i+1;
		$cminute = round(date('i',$start));

			if($i == $cminute)
			{
				$selected = " selected='selected' ";
			}
			else
			{
				$selected = '';
			}
				
	$started_form .= '<option value="'.($i).'"'.$selected.'>'.($i).'</option>';
	}
$started_form .= '</select>';
$started_form .=  "</div>";


$started_form .= '
<div class="text">
<input type="submit" name="_set" id="_set" value="set"  class="submit" />
<input type="submit" name="_now" id="_now" value="now"  class="submit" />
</div>
</form>';



print $started_form;


//foreach ($_POST as $key => $value)
//{
//print ucfirst ($key) ." : ". $value . "\n";
//}

//strtotime



## if we have a date set via $_POST, write it
	if(!empty($_POST['_day']) && !empty($_POST['_hour']))
	{
	
	$start_time = strtotime($_POST['_month'].'/'.$_POST['_day'].'/'.date("y").' '.$_POST['_hour'].':'.$_POST['_minute']);
	
		#if clicked on reset...
		if(isset($_POST['_now']))
		{
			$start_time = time();
		}
			
	$get_start = file_get_contents("kcals_start.txt");

	$fp = fopen("kcals_start.txt", "w");
		if ($fp)
		{		
			fwrite ($fp,$start_time);
			fclose ($fp);
		}

	print "the start date has been set to ".date("d-m-y - H:i",$start_time);	
	}




//print date("d/m/y - H:i",$start_time);
//print "<br /><br />";


print "</div>";

}
KCAL_START();
?>