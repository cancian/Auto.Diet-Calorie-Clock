<?php 
/*
$file = 'paypalPost.php'; 
$arr= $_POST; 
$fp = fopen($file, 'w') or die('Could not open file!');  
foreach ($arr as $key => $value) { 
    $toFile = "Key: $key; Value: $value \n"; 
// write to file  
fwrite($fp, "$toFile") or die('Could not write to file');  
// close file  
} 
fclose($fp); 
*/
//if($_POST) { foreach($_POST as $key => $value) { $_POST[$key] = utf8_decode($_POST[$key]); }} 


$json_string = utf8_decode(stripslashes($_POST['sql']));
$userid      = $_POST['uid'];
$file_handle = fopen('userdata/'.$userid.'_diary_entry.sql', 'w');
fwrite($file_handle, $json_string);
fclose($file_handle);
?>