REM MINIFY JS/CSS
call K:\[bin]\minify.bat

REM UPDATE PROJECTS
K: 
CD\ 
attrib k:\platforms\*.* -r -h -a /s
attrib k:\www\*.* -r -h -a /s
 
K:\[bin]\embed K:\www\css\kcals.ttf 

REM "ANDROID"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\android\kcals\src\main\assets\www 
RD /S /Q K:\platforms\android\kcals\src\main\assets\www 
MKDIR K:\platforms\android\kcals\src\main\assets\www 
cd K:\platforms\android\kcals\src\main\assets\www 
call reswww 
 
REM "ANDROID-ECLIPSE" 
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\android-eclipse\assets\www 
RD /S /Q K:\platforms\android-eclipse\assets\www 
MKDIR K:\platforms\android-eclipse\assets\www 
cd K:\platforms\android-eclipse\assets\www 
call reswww 
 
REM "IOS"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\ios\www 
RD /S /Q K:\platforms\ios\www 
MKDIR K:\platforms\ios\www 
cd K:\platforms\ios\www 
call reswww 
 
REM "OSX"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\osx\public 
RD /S /Q K:\platforms\osx\public 
MKDIR K:\platforms\osx\public 
cd K:\platforms\osx\public 
call reswww 
 
REM "WINDOWS8"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\windows8\www 
RD /S /Q K:\platforms\windows8\www 
MKDIR K:\platforms\windows8\www 
cd K:\platforms\windows8\www 
call reswww 

REM "W8"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\wp8\www 
RD /S /Q K:\platforms\wp8\www 
MKDIR K:\platforms\wp8\www 
cd K:\platforms\wp8\www 
call reswww 

REM "BB10"
cd \ 
DELTREE /Y /Z /S /Q /T K:\platforms\bb10\www
RD /S /Q K:\platforms\bb10\www 
MKDIR K:\platforms\bb10\www
cd K:\platforms\bb10\www
call reswww 

REM "CONFIG.XML"
cd \ 
del /q K:\platforms\android\kcals\src\main\res\xml\config.xml 
del /q K:\platforms\android-eclipse\res\xml\config.xml 
del /q K:\platforms\ios\KCals\config.xml 
del /q K:\platforms\windows8\config.xml 
del /q K:\platforms\wp8\config.xml 
del /q K:\platforms\bb10\config.xml

copy /y k:\www\config.xml K:\platforms\android\kcals\src\main\res\xml\config.xml 
copy /y k:\www\config.xml K:\platforms\android-eclipse\res\xml\config.xml 
copy /y k:\www\config.xml K:\platforms\ios\KCals\config.xml 
copy /y k:\www\config.xml K:\platforms\windows8\config.xml 
copy /y k:\www\config.xml K:\platforms\wp8\config.xml 
copy /y k:\www\config.xml K:\platforms\bb10\config.xml 

REM "WP8 assets" 
del /q K:\platforms\wp8\159.png 
del /q K:\platforms\wp8\336.png 
del /q K:\platforms\wp8\691x336.png 
copy /y K:\www\res\icon\wp8\159.png K:\platforms\wp8\159.png 
copy /y K:\www\res\icon\wp8\336.png K:\platforms\wp8\336.png 
copy /y K:\www\res\icon\wp8\691x336.png K:\platforms\wp8\691x336.png 
 
cd\ 
REM "Windows 8 assets" 
DELTREE /Y /Z /S /Q /T K:\platforms\windows8\images 
RD /S /Q K:\platforms\windows8\images 
MKDIR K:\platforms\windows8\images 
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
copy /y k:\www\res\icon\windows8\248x120.png k:\platforms\windows8\images\Wide310x150Logo.scale-80.png 
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
copy /y k:\www\res\icon\windows8\44.png k:\platforms\windows8\images\Square44x44Logo.scale-100.png 
copy /y k:\www\res\icon\windows8\50.png k:\platforms\windows8\images\StoreLogo.scale-100.png 
copy /y k:\www\res\icon\windows8\62.png k:\platforms\windows8\images\Square44x44Logo.scale-140.png 
copy /y k:\www\res\icon\windows8\70.png k:\platforms\windows8\images\StoreLogo.scale-140.png 
copy /y k:\www\res\icon\windows8\71.png k:\platforms\windows8\images\Square71x71Logo.scale-100.png 
copy /y k:\www\res\icon\windows8\99.png k:\platforms\windows8\images\Square71x71Logo.scale-140.png 
copy /y k:\www\res\icon\windows8\106.png k:\platforms\windows8\images\Square44x44Logo.scale-240.png 
copy /y k:\www\res\icon\windows8\120.png k:\platforms\windows8\images\StoreLogo.scale-240.png 
copy /y k:\www\res\icon\windows8\150.png k:\platforms\windows8\images\Square150x150Logo.scale-100.png 
copy /y k:\www\res\icon\windows8\170.png k:\platforms\windows8\images\Square71x71Logo.scale-240.png 
copy /y k:\www\res\icon\windows8\210.png k:\platforms\windows8\images\Square150x150Logo.scale-140.png 
copy /y k:\www\res\icon\windows8\310x150.png k:\platforms\windows8\images\Wide310x150Logo.scale-100.png 
copy /y k:\www\res\icon\windows8\360.png k:\platforms\windows8\images\Square150x150Logo.scale-240.png 
copy /y k:\www\res\icon\windows8\434x210.png k:\platforms\windows8\images\Wide310x150Logo.scale-140.png 
copy /y k:\www\res\icon\windows8\744x360.png k:\platforms\windows8\images\Wide310x150Logo.scale-240.png 
 
 
cd\ 
DELTREE /Y /Z /S /Q /T K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset 
RD /S /Q K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset 
MKDIR K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset 
cp --recursive --verbose --force K:\www\res\icon\ios\AppIcon.appiconset\*.* K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset
 
 
cd\ 
DELTREE /Y /Z /S /Q /T K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset 
RD /S /Q K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset 
MKDIR K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset 
cp --recursive --verbose --force K:\www\res\icon\osx\AppIcon.appiconset\*.* K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset
 
 
cd\ 
del /q K:\platforms\android\kcals\src\main\res\drawable\icon.png 
del /q K:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png 
del /q K:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png 
del /q K:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png 
del /q K:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png 
del /q K:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png 
copy /y K:\www\res\icon\android\144.png K:\platforms\android\kcals\src\main\res\drawable\icon.png 
copy /y K:\www\res\icon\android\36.png K:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png 
copy /y K:\www\res\icon\android\48.png K:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png 
copy /y K:\www\res\icon\android\72.png K:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png 
copy /y K:\www\res\icon\android\96.png K:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png 
copy /y K:\www\res\icon\android\144.png K:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png 
 
 
del /q K:\platforms\android-eclipse\res\drawable\icon.png 
del /q K:\platforms\android-eclipse\res\drawable-ldpi\icon.png 
del /q K:\platforms\android-eclipse\res\drawable-mdpi\icon.png 
del /q K:\platforms\android-eclipse\res\drawable-hdpi\icon.png 
del /q K:\platforms\android-eclipse\res\drawable-xhdpi\icon.png 
del /q K:\platfo#rms\android-eclipse\res\drawable-xxhdpi\icon.png 
copy /y K:\www\res\icon\android\144.png K:\platforms\android-eclipse\res\drawable\icon.png 
copy /y K:\www\res\icon\android\36.png K:\platforms\android-eclipse\res\drawable-ldpi\icon.png 
copy /y K:\www\res\icon\android\48.png K:\platforms\android-eclipse\res\drawable-mdpi\icon.png 
copy /y K:\www\res\icon\android\72.png K:\platforms\android-eclipse\res\drawable-hdpi\icon.png 
copy /y K:\www\res\icon\android\96.png K:\platforms\android-eclipse\res\drawable-xhdpi\icon.png 
copy /y K:\www\res\icon\android\144.png K:\platforms\android-eclipse\res\drawable-xxhdpi\icon.png 

icacls K:\* /T /Q /C /RESET
attrib k:\*        -r /s
attrib k:\.*       +h +s +r /d /s
attrib k:\www\.*   -h -s -r /s
attrib k:\_gsdata_ +h +s +r /d /s
attrib k:\__MACOSX +h +s +r /d /s
REM attrib d:\_gsdata_ +h +s +r /d /s

