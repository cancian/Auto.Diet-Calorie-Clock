@echo off
K: 
cd k:\www\css 
RD /S /Q K:\www\css\min 
mkdir min 
echo #######################
echo ## COMPRESSING FILES ##
echo #######################
echo ## CSS ##
call jscompress index.css 
echo done: index.css
call jscompress fonts.css 
echo done: fonts.css
cp --force k:\www\css\kcals.ttf K:\www\css\min 
cp --force k:\www\css\openhand.cur K:\www\css\min 
 
K: 
cd k:\www\js 
RD /S /Q K:\www\js\min 
mkdir min
echo ## JS ##
call jscompress app_bootstrap.js 
echo done: app_bootstrap.js

call jscompress app_build.js 
echo done: app_build.js

call jscompress app_custom_core.js 
echo done: app_custom_core.js

call jscompress app_dynamic.js 
echo done: app_dynamic.js

call jscompress app_init.js 
echo done: app_init.js

call jscompress app_lang.js 
echo done: app_lang.js

call jscompress app_lib.js 
echo done: app_lib.js

call jscompress app_macro.js 
echo done: app_macro.js

call jscompress app_setup.js 
echo done: app_setup.js

call jscompress app_static.js 
echo done: app_static.js

echo ########################
echo ## PROCESS ALL FILES? ##
echo ########################
CHOICE /T 0 /D Y
IF ERRORLEVEL = 2  GOTO DONE
IF ERRORLEVEL = 1  GOTO ALL

:DONE
echo ################################
echo ## Compressed core files only ##
echo ################################
sleep 3
GOTO EXIT

:ALL
call jscompress calculator.js 
echo done: calculator.js

call jscompress carpe_slider.js 
echo done: carpe_slider.js

call jscompress cordova.js 
echo done: cordova.js

call jscompress cordova_plugins.js 
echo done: cordova_plugins.js

call jscompress facebook-connect.js 
echo done: facebook-connect.js

call jscompress facebook-js-sdk.js 
echo done: facebook-js-sdk.js

call jscompress facebook-js-sdk.min.js 
echo done: facebook-js-sdk.min.js

call jscompress galocalstorage.js 
echo done: galocalstorage.js

call jscompress highcharts.js 
echo done: highcharts.js

call jscompress iscroll.js 
echo done: iscroll.js

call jscompress jquery.color.js 
echo done: jquery.color.js

call jscompress jquery.js 
echo done: jquery.js

call jscompress jquery.nicescroll.js 
echo done: jquery.nicescroll.js

call jscompress jquery.touchswipe.js 
echo done: jquery.touchswipe.js

call jscompress jquery.ui.js 
echo done: jquery.ui.js

call jscompress localforage.js 
echo done: localforage.js

call jscompress mobiscroll.js 
echo done: mobiscroll.js

call jscompress openfb.js 
echo done: openfb.js

cp --recursive --force K:\www\js\plugins K:\www\js\min\plugins 
echo #####################################
echo ## Succefully compressed all files ##
echo #####################################

sleep 3

GOTO EXIT

:EXIT
