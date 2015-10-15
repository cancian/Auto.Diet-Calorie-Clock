rem batch minifier-updater
k:
cd\

rem rebuild junctions
call k:\[bin]\resgradle.bat 

rem minify js/css
call k:\[bin]\minify.bat

attrib k:\platforms\*.* -r -h -a /s
attrib k:\www\*.* -r -h -a /s
k:\[bin]\embed k:\www\css\kcals.ttf 

rem "android-gradle" 
rem cd\ 
rem deltree /y /z /s /q /t k:\platforms\android\assets\www 
rem rd /s /q k:\platforms\android\assets\www 
rem mkdir k:\platforms\android\assets\www 
rem cd k:\platforms\android\assets\www 
rem call reswww 

rem "android-imported-gradle"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\android\kcals\src\main\assets\www 
rd /s /q k:\platforms\android\kcals\src\main\assets\www 
mkdir k:\platforms\android\kcals\src\main\assets\www 
cd k:\platforms\android\kcals\src\main\assets\www 
call reswww 
 
rem "android-eclipse" 
cd\ 
deltree /y /z /s /q /t k:\platforms\android-eclipse\assets\www 
rd /s /q k:\platforms\android-eclipse\assets\www 
mkdir k:\platforms\android-eclipse\assets\www 
cd k:\platforms\android-eclipse\assets\www 
call reswww 
 
rem "ios"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\ios\www 
rd /s /q k:\platforms\ios\www 
mkdir k:\platforms\ios\www 
cd k:\platforms\ios\www 
call reswww 
 
rem "osx"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\osx\public 
rd /s /q k:\platforms\osx\public 
mkdir k:\platforms\osx\public 
cd k:\platforms\osx\public 
call reswww 

rem "windows10"
rem cd\ 
REM deltree /y /z /s /q /t k:\platforms\windows10\www 
REM rd /s /q k:\platforms\windows10\www 
REM mkdir k:\platforms\windows10\www 
REM cd k:\platforms\windows10\www 
REM call reswww 
 
rem "windows8"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\windows8\www 
rd /s /q k:\platforms\windows8\www 
mkdir k:\platforms\windows8\www 
cd k:\platforms\windows8\www 
call reswww 

rem "w8"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\wp8\www 
rd /s /q k:\platforms\wp8\www 
mkdir k:\platforms\wp8\www 
cd k:\platforms\wp8\www 
call reswww 

REM PLAYBOOK
deltree /y /z /s /q /t K:\platforms\playbook\www
rd /s /q K:\platforms\playbook\www
mkdir K:\platforms\playbook\www
cd K:\platforms\playbook\www
call reswww 
cp -R K:\platforms\playbook\lib\cordova.2.9.0\ext-air K:\platforms\playbook\www

REM CP OVER CDVJS
REM del /q K:\platforms\playbook\www\js\cordova.js
REM copy /y K:\platforms\playbook\lib\cordova.2.9.0\javascript\cordova.js K:\platforms\playbook\www\js\cordova.js

rem "bb10"
rem cd\ 
deltree /y /z /s /q /t k:\platforms\bb10\www
rd /s /q k:\platforms\bb10\www 
mkdir k:\platforms\bb10\www
cd k:\platforms\bb10\www
call reswww 

rem cd\ 
deltree /y /z /s /q /t k:\platforms\bb10\platforms\blackberry10\www
rd /s /q k:\platforms\bb10\platforms\blackberry10\www
mkdir k:\platforms\bb10\platforms\blackberry10\www
cd k:\platforms\bb10\platforms\blackberry10\www
call reswww 
deltree /y /z /s /q /t k:\platforms\bb10\platforms\blackberry10\build
rd /s /q k:\platforms\bb10\platforms\blackberry10\build

rem "config.xml"
rem cd\ 
del /q k:\platforms\android\kcals\src\main\res\xml\config.xml 
del /q k:\platforms\android-eclipse\res\xml\config.xml 
del /q k:\platforms\ios\kcals\config.xml 
del /q k:\platforms\windows10\config.xml 
del /q k:\platforms\windows8\config.xml 
del /q k:\platforms\wp8\config.xml 
del /q k:\platforms\bb10\config.xml
del /q K:\platforms\playbook\www\config.xml

copy /y k:\www\config.xml k:\platforms\android\kcals\src\main\res\xml\config.xml 
copy /y k:\www\config.xml k:\platforms\android-eclipse\res\xml\config.xml 
copy /y k:\www\config.xml k:\platforms\ios\kcals\config.xml 
REM copy /y k:\www\config.xml k:\platforms\windows10\config.xml 
copy /y k:\www\config.xml k:\platforms\windows8\config.xml 
copy /y k:\www\config.xml k:\platforms\wp8\config.xml 
copy /y k:\www\config.xml k:\platforms\bb10\config.xml 
copy /y K:\platforms\playbook\config.playbook.xml k:\platforms\playbook\www\config.xml 


REM "PLAYBOOK ASSETS" 
del /q K:\platforms\playbook\www\80.png 
del /q K:\platforms\playbook\www\225.png 
copy /y k:\www\res\icon\playbook\80.png K:\platforms\playbook\www\80.png 
copy /y k:\www\res\icon\playbook\225.png K:\platforms\playbook\www\225.png

rem "wp8 assets" 
del /q k:\platforms\wp8\159.png 
del /q k:\platforms\wp8\336.png 
del /q k:\platforms\wp8\691x336.png 
copy /y k:\www\res\icon\wp8\159.png k:\platforms\wp8\159.png 
copy /y k:\www\res\icon\wp8\336.png k:\platforms\wp8\336.png 
copy /y k:\www\res\icon\wp8\691x336.png k:\platforms\wp8\691x336.png 
 
rem cd\ 
rem "windows 8 assets" 
deltree /y /z /s /q /t k:\platforms\windows8\images 
rd /s /q k:\platforms\windows8\images 
mkdir k:\platforms\windows8\images 
copy /y k:\www\res\icon\windows8\16.png k:\platforms\windows8\images\smalllogo.targetsize-16.png 
copy /y k:\www\res\icon\windows8\24.png k:\platforms\windows8\images\smalllogo.scale-80.png 
copy /y k:\www\res\icon\windows8\30.png k:\platforms\windows8\images\smalllogo.scale-100.png 
copy /y k:\www\res\icon\windows8\32.png k:\platforms\windows8\images\smalllogo.targetsize-32.png 
copy /y k:\www\res\icon\windows8\42.png k:\platforms\windows8\images\smalllogo.scale-140.png 
copy /y k:\www\res\icon\windows8\44.png k:\platforms\windows8\images\square44x44logo.scale-100.png 
copy /y k:\www\res\icon\windows8\48.png k:\platforms\windows8\images\smalllogo.targetsize-48.png 
copy /y k:\www\res\icon\windows8\50.png k:\platforms\windows8\images\storelogo.scale-100.png 
copy /y k:\www\res\icon\windows8\54.png k:\platforms\windows8\images\smalllogo.scale-180.png 
copy /y k:\www\res\icon\windows8\56.png k:\platforms\windows8\images\square70x70logo.scale-80.png 
copy /y k:\www\res\icon\windows8\62.png k:\platforms\windows8\images\square44x44logo.scale-140.png 
copy /y k:\www\res\icon\windows8\70.png k:\platforms\windows8\images\square70x70logo.scale-100.png 
copy /y k:\www\res\icon\windows8\70.png k:\platforms\windows8\images\storelogo.scale-140.png 
copy /y k:\www\res\icon\windows8\71.png k:\platforms\windows8\images\square71x71logo.scale-100.png 
copy /y k:\www\res\icon\windows8\90.png k:\platforms\windows8\images\storelogo.scale-180.png 
copy /y k:\www\res\icon\windows8\98.png k:\platforms\windows8\images\square70x70logo.scale-140.png 
copy /y k:\www\res\icon\windows8\99.png k:\platforms\windows8\images\square71x71logo.scale-140.png 
copy /y k:\www\res\icon\windows8\106.png k:\platforms\windows8\images\square44x44logo.scale-240.png 
copy /y k:\www\res\icon\windows8\120.png k:\platforms\windows8\images\logo.scale-80.png 
copy /y k:\www\res\icon\windows8\126.png k:\platforms\windows8\images\square70x70logo.scale-180.png 
copy /y k:\www\res\icon\windows8\150.png k:\platforms\windows8\images\logo.scale-100.png 
copy /y k:\www\res\icon\windows8\170.png k:\platforms\windows8\images\square71x71logo.scale-240.png 
copy /y k:\www\res\icon\windows8\210.png k:\platforms\windows8\images\logo.scale-140.png 
copy /y k:\www\res\icon\windows8\210x120.png k:\platforms\windows8\images\wide310x150logo.scale-80.png 
copy /y k:\www\res\icon\windows8\248.png k:\platforms\windows8\images\square310x310logo.scale-80.png 
copy /y k:\www\res\icon\windows8\248x120.png k:\platforms\windows8\images\wide310x150logo.scale-80.png 
copy /y k:\www\res\icon\windows8\256.png k:\platforms\windows8\images\smalllogo.targetsize-256.png 
copy /y k:\www\res\icon\windows8\270.png k:\platforms\windows8\images\logo.scale-180.png 
copy /y k:\www\res\icon\windows8\210x150.png k:\platforms\windows8\images\wide310x150logo.scale-100.png 
copy /y k:\www\res\icon\windows8\310.png k:\platforms\windows8\images\square310x310logo.scale-100.png 
copy /y k:\www\res\icon\windows8\310x150.png k:\platforms\windows8\images\wide310x150logo.scale-100.png 
copy /y k:\www\res\icon\windows8\360.png k:\platforms\windows8\images\square150x150logo.scale-240.png 
copy /y k:\www\res\icon\windows8\434x210.png k:\platforms\windows8\images\wide310x150logo.scale-140.png 
copy /y k:\www\res\icon\windows8\434.png k:\platforms\windows8\images\square310x310logo.scale-140.png 
copy /y k:\www\res\icon\windows8\558x270.png k:\platforms\windows8\images\wide310x150logo.scale-180.png 
copy /y k:\www\res\icon\windows8\558.png k:\platforms\windows8\images\square310x310logo.scale-180.png 
copy /y k:\www\res\icon\windows8\620x300.png k:\platforms\windows8\images\splashscreen.scale-100.png 
copy /y k:\www\res\icon\windows8\868x420.png k:\platforms\windows8\images\splashscreen.scale-140.png 
copy /y k:\www\res\icon\windows8\1116x540.png k:\platforms\windows8\images\splashscreen.scale-180.png 
copy /y k:\www\res\icon\windows8\480x800.png k:\platforms\windows8\images\wp8_splashscreen.scale-100.png 
copy /y k:\www\res\icon\windows8\672x1120.png k:\platforms\windows8\images\wp8_splashscreen.scale-140.png 
copy /y k:\www\res\icon\windows8\1152x1920.png k:\platforms\windows8\images\wp8_splashscreen.scale-240.png 
copy /y k:\www\res\icon\windows8\120.png k:\platforms\windows8\images\storelogo.scale-240.png 
copy /y k:\www\res\icon\windows8\44.png k:\platforms\windows8\images\square44x44logo.scale-100.png 
copy /y k:\www\res\icon\windows8\50.png k:\platforms\windows8\images\storelogo.scale-100.png 
copy /y k:\www\res\icon\windows8\62.png k:\platforms\windows8\images\square44x44logo.scale-140.png 
copy /y k:\www\res\icon\windows8\70.png k:\platforms\windows8\images\storelogo.scale-140.png 
copy /y k:\www\res\icon\windows8\71.png k:\platforms\windows8\images\square71x71logo.scale-100.png 
copy /y k:\www\res\icon\windows8\99.png k:\platforms\windows8\images\square71x71logo.scale-140.png 
copy /y k:\www\res\icon\windows8\106.png k:\platforms\windows8\images\square44x44logo.scale-240.png 
copy /y k:\www\res\icon\windows8\120.png k:\platforms\windows8\images\storelogo.scale-240.png 
copy /y k:\www\res\icon\windows8\150.png k:\platforms\windows8\images\square150x150logo.scale-100.png 
copy /y k:\www\res\icon\windows8\170.png k:\platforms\windows8\images\square71x71logo.scale-240.png 
copy /y k:\www\res\icon\windows8\210.png k:\platforms\windows8\images\square150x150logo.scale-140.png 
copy /y k:\www\res\icon\windows8\310x150.png k:\platforms\windows8\images\wide310x150logo.scale-100.png 
copy /y k:\www\res\icon\windows8\360.png k:\platforms\windows8\images\square150x150logo.scale-240.png 
copy /y k:\www\res\icon\windows8\434x210.png k:\platforms\windows8\images\wide310x150logo.scale-140.png 
copy /y k:\www\res\icon\windows8\744x360.png k:\platforms\windows8\images\wide310x150logo.scale-240.png 
 
 
rem cd\ 
deltree /y /z /s /q /t k:\platforms\ios\kcals\images.xcassets\AppIcon.appiconset 
rm -r k:\platforms\ios\kcals\images.xcassets\AppIcon.appiconset 
mkdir k:\platforms\ios\kcals\images.xcassets\AppIcon.appiconset 
cd k:\www\res\icon\ios\AppIcon.appiconset
copy *.* k:\platforms\ios\kcals\images.xcassets\AppIcon.appiconset
 
rem cd\ 
deltree /y /z /s /q /t k:\platforms\osx\kcals\images.xcassets\AppIcon.appiconset 
rm -r k:\platforms\osx\kcals\images.xcassets\AppIcon.appiconset 
mkdir k:\platforms\osx\kcals\images.xcassets\AppIcon.appiconset 
cd K:\www\res\icon\osx\AppIcon.appiconset
copy *.* k:\platforms\osx\kcals\images.xcassets\AppIcon.appiconset
 
rem cd\ 
del /q k:\platforms\android\kcals\src\main\res\drawable\icon.png 
del /q k:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png 
del /q k:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png 
del /q k:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png 
del /q k:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png 
del /q k:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png 
copy /y k:\www\res\icon\android\144.png k:\platforms\android\kcals\src\main\res\drawable\icon.png 
copy /y k:\www\res\icon\android\36.png k:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png 
copy /y k:\www\res\icon\android\48.png k:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png 
copy /y k:\www\res\icon\android\72.png k:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png 
copy /y k:\www\res\icon\android\96.png k:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png 
copy /y k:\www\res\icon\android\144.png k:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png 
 
 
del /q k:\platforms\android-eclipse\res\drawable\icon.png 
del /q k:\platforms\android-eclipse\res\drawable-ldpi\icon.png 
del /q k:\platforms\android-eclipse\res\drawable-mdpi\icon.png 
del /q k:\platforms\android-eclipse\res\drawable-hdpi\icon.png 
del /q k:\platforms\android-eclipse\res\drawable-xhdpi\icon.png 
del /q k:\platfo#rms\android-eclipse\res\drawable-xxhdpi\icon.png 
copy /y k:\www\res\icon\android\144.png k:\platforms\android-eclipse\res\drawable\icon.png 
copy /y k:\www\res\icon\android\36.png k:\platforms\android-eclipse\res\drawable-ldpi\icon.png 
copy /y k:\www\res\icon\android\48.png k:\platforms\android-eclipse\res\drawable-mdpi\icon.png 
copy /y k:\www\res\icon\android\72.png k:\platforms\android-eclipse\res\drawable-hdpi\icon.png 
copy /y k:\www\res\icon\android\96.png k:\platforms\android-eclipse\res\drawable-xhdpi\icon.png 
copy /y k:\www\res\icon\android\144.png k:\platforms\android-eclipse\res\drawable-xxhdpi\icon.png 

rem start /realtime takeown /r /d y /f d:\
rem start /realtime takeown /r /d y /f d:\home
rem start /realtime  icacls k:\* /t /q /c /reset
rem start /realtime  attrib k:\*        -r -a /s
rem attrib k:\.*       +h +s +r /d /s
rem attrib k:\www\.*   -h -s -r /s
rem attrib k:\_gsdata_ +h +s +r /d /s
rem attrib k:\__macosx +h +s +r /d /s
rem attrib d:\_gsdata_ +h +s +r /d /s

