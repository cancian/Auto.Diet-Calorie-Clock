echo wwwing...

k:

RD /S /Q K:\platforms\android\kcals\src\main\assets\www
MKDIR K:\platforms\android\kcals\src\main\assets\www
cd K:\platforms\android\kcals\src\main\assets\www
call reswww

RD /S /Q K:\platforms\android-eclipse\assets\www
MKDIR K:\platforms\android-eclipse\assets\www
cd K:\platforms\android-eclipse\assets\www
call reswww

RD /S /Q K:\platforms\ios\www
MKDIR K:\platforms\ios\www
cd K:\platforms\ios\www
call reswww

RD /S /Q K:\platforms\osx\public
MKDIR K:\platforms\osx\public
cd K:\platforms\osx\public
call reswww

RD /S /Q K:\platforms\windows8\www
MKDIR K:\platforms\windows8\www
cd K:\platforms\windows8\www
call reswww

RD /S /Q K:\platforms\wp8\www
MKDIR K:\platforms\wp8\www
cd K:\platforms\wp8\www
call reswww

del /q K:\platforms\android\kcals\src\main\res\xml\config.xml
del /q K:\platforms\android-eclipse\res\xml\config.xml
del /q K:\platforms\ios\KCals\config.xml
del /q K:\platforms\windows8\config.xml
del /q K:\platforms\wp8\config.xml
mklink /h K:\platforms\android\kcals\src\main\res\xml\config.xml k:\www\config.xml
mklink /h K:\platforms\android-eclipse\res\xml\config.xml k:\www\config.xml
mklink /h K:\platforms\ios\KCals\config.xml k:\www\config.xml
mklink /h K:\platforms\windows8\config.xml k:\www\config.xml
mklink /h K:\platforms\wp8\config.xml k:\www\config.xml

ECHO "WP8 assets"
del /q K:\platforms\wp8\159.png
del /q K:\platforms\wp8\336.png
del /q K:\platforms\wp8\691x336.png
mklink /h K:\platforms\wp8\159.png K:\www\res\icon\wp8\159.png
mklink /h K:\platforms\wp8\336.png K:\www\res\icon\wp8\336.png
mklink /h K:\platforms\wp8\691x336.png K:\www\res\icon\wp8\691x336.png

ECHO "Windows 8 assets"
RD /S /Q K:\platforms\windows8\images
MKDIR K:\platforms\windows8\images
mklink /h k:\platforms\windows8\images\smalllogo.targetsize-16.png k:\www\res\icon\windows8\16.png
mklink /h k:\platforms\windows8\images\smalllogo.scale-80.png k:\www\res\icon\windows8\24.png
mklink /h k:\platforms\windows8\images\smalllogo.scale-100.png k:\www\res\icon\windows8\30.png
mklink /h k:\platforms\windows8\images\smalllogo.targetsize-32.png k:\www\res\icon\windows8\32.png
mklink /h k:\platforms\windows8\images\smalllogo.scale-140.png k:\www\res\icon\windows8\42.png
mklink /h k:\platforms\windows8\images\square44x44logo.scale-100.png k:\www\res\icon\windows8\44.png
mklink /h k:\platforms\windows8\images\smalllogo.targetsize-48.png k:\www\res\icon\windows8\48.png
mklink /h k:\platforms\windows8\images\storelogo.scale-100.png k:\www\res\icon\windows8\50.png
mklink /h k:\platforms\windows8\images\smalllogo.scale-180.png k:\www\res\icon\windows8\54.png
mklink /h k:\platforms\windows8\images\square70x70logo.scale-80.png k:\www\res\icon\windows8\56.png
mklink /h k:\platforms\windows8\images\square44x44logo.scale-140.png k:\www\res\icon\windows8\62.png
mklink /h k:\platforms\windows8\images\square70x70logo.scale-100.png k:\www\res\icon\windows8\70.png
mklink /h k:\platforms\windows8\images\storelogo.scale-140.png k:\www\res\icon\windows8\70.png
mklink /h k:\platforms\windows8\images\square71x71logo.scale-100.png k:\www\res\icon\windows8\71.png
mklink /h k:\platforms\windows8\images\storelogo.scale-180.png k:\www\res\icon\windows8\90.png
mklink /h k:\platforms\windows8\images\square70x70logo.scale-140.png k:\www\res\icon\windows8\98.png
mklink /h k:\platforms\windows8\images\square71x71logo.scale-140.png k:\www\res\icon\windows8\99.png
mklink /h k:\platforms\windows8\images\square44x44logo.scale-240.png k:\www\res\icon\windows8\106.png
mklink /h k:\platforms\windows8\images\logo.scale-80.png k:\www\res\icon\windows8\120.png
mklink /h k:\platforms\windows8\images\square70x70logo.scale-180.png k:\www\res\icon\windows8\126.png
mklink /h k:\platforms\windows8\images\logo.scale-100.png k:\www\res\icon\windows8\150.png
mklink /h k:\platforms\windows8\images\square71x71logo.scale-240.png k:\www\res\icon\windows8\170.png
mklink /h k:\platforms\windows8\images\logo.scale-140.png k:\www\res\icon\windows8\210.png
mklink /h k:\platforms\windows8\images\wide310x150logo.scale-80.png k:\www\res\icon\windows8\210x120.png
mklink /h k:\platforms\windows8\images\square310x310logo.scale-80.png k:\www\res\icon\windows8\248.png
mklink /h k:\platforms\windows8\images\Wide310x150Logo.scale-80.png k:\www\res\icon\windows8\248x120.png
mklink /h k:\platforms\windows8\images\smalllogo.targetsize-256.png k:\www\res\icon\windows8\256.png
mklink /h k:\platforms\windows8\images\logo.scale-180.png k:\www\res\icon\windows8\270.png
mklink /h k:\platforms\windows8\images\wide310x150logo.scale-100.png k:\www\res\icon\windows8\210x150.png.png
mklink /h k:\platforms\windows8\images\square310x310logo.scale-100.png k:\www\res\icon\windows8\310.png
mklink /h k:\platforms\windows8\images\wide310x150logo.scale-100.png k:\www\res\icon\windows8\310x150.png
mklink /h k:\platforms\windows8\images\square150x150logo.scale-240.png k:\www\res\icon\windows8\360.png
mklink /h k:\platforms\windows8\images\wide310x150logo.scale-140.png k:\www\res\icon\windows8\434x210.png
mklink /h k:\platforms\windows8\images\square310x310logo.scale-140.png k:\www\res\icon\windows8\434.png
mklink /h k:\platforms\windows8\images\wide310x150logo.scale-180.png k:\www\res\icon\windows8\558x270.png
mklink /h k:\platforms\windows8\images\square310x310logo.scale-180.png k:\www\res\icon\windows8\558.png
mklink /h k:\platforms\windows8\images\splashscreen.scale-100.png k:\www\res\icon\windows8\620x300.png
mklink /h k:\platforms\windows8\images\splashscreen.scale-140.png k:\www\res\icon\windows8\868x420.png
mklink /h k:\platforms\windows8\images\splashscreen.scale-180.png k:\www\res\icon\windows8\1116x540.png
mklink /h k:\platforms\windows8\images\wp8_splashscreen.scale-100.png k:\www\res\icon\windows8\480x800.png
mklink /h k:\platforms\windows8\images\wp8_splashscreen.scale-140.png k:\www\res\icon\windows8\672x1120.png
mklink /h k:\platforms\windows8\images\wp8_splashscreen.scale-240.png k:\www\res\icon\windows8\1152x1920.png
mklink /h k:\platforms\windows8\images\storelogo.scale-240.png k:\www\res\icon\windows8\120.png
mklink /h k:\platforms\windows8\images\Square44x44Logo.scale-100.png k:\www\res\icon\windows8\44.png
mklink /h k:\platforms\windows8\images\StoreLogo.scale-100.png k:\www\res\icon\windows8\50.png
mklink /h k:\platforms\windows8\images\Square44x44Logo.scale-140.png k:\www\res\icon\windows8\62.png
mklink /h k:\platforms\windows8\images\StoreLogo.scale-140.png k:\www\res\icon\windows8\70.png
mklink /h k:\platforms\windows8\images\Square71x71Logo.scale-100.png k:\www\res\icon\windows8\71.png
mklink /h k:\platforms\windows8\images\Square71x71Logo.scale-140.png k:\www\res\icon\windows8\99.png
mklink /h k:\platforms\windows8\images\Square44x44Logo.scale-240.png k:\www\res\icon\windows8\106.png
mklink /h k:\platforms\windows8\images\StoreLogo.scale-240.png k:\www\res\icon\windows8\120.png
mklink /h k:\platforms\windows8\images\Square150x150Logo.scale-100.png k:\www\res\icon\windows8\150.png
mklink /h k:\platforms\windows8\images\Square71x71Logo.scale-240.png k:\www\res\icon\windows8\170.png
mklink /h k:\platforms\windows8\images\Square150x150Logo.scale-140.png k:\www\res\icon\windows8\210.png
mklink /h k:\platforms\windows8\images\Wide310x150Logo.scale-100.png k:\www\res\icon\windows8\310x150.png
mklink /h k:\platforms\windows8\images\Square150x150Logo.scale-240.png k:\www\res\icon\windows8\360.png
mklink /h k:\platforms\windows8\images\Wide310x150Logo.scale-140.png k:\www\res\icon\windows8\434x210.png
mklink /h k:\platforms\windows8\images\Wide310x150Logo.scale-240.png k:\www\res\icon\windows8\744x360.png

RD /S /Q K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset
mklink /j /d K:\platforms\ios\KCals\Images.xcassets\AppIcon.appiconset K:\www\res\icon\ios\AppIcon.appiconset

RD /S /Q K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset
mklink /j /d K:\platforms\osx\KCals\Images.xcassets\AppIcon.appiconset K:\www\res\icon\osx\AppIcon.appiconset

del /q K:\platforms\android\kcals\src\main\res\drawable\icon.png
del /q K:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png
del /q K:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png
del /q K:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png
del /q K:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png
del /q K:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png 
mklink /h K:\platforms\android\kcals\src\main\res\drawable\icon.png K:\www\res\icon\android\144.png
mklink /h K:\platforms\android\kcals\src\main\res\drawable-ldpi\icon.png K:\www\res\icon\android\36.png
mklink /h K:\platforms\android\kcals\src\main\res\drawable-mdpi\icon.png K:\www\res\icon\android\48.png
mklink /h K:\platforms\android\kcals\src\main\res\drawable-hdpi\icon.png K:\www\res\icon\android\72.png
mklink /h K:\platforms\android\kcals\src\main\res\drawable-xhdpi\icon.png K:\www\res\icon\android\96.png
mklink /h K:\platforms\android\kcals\src\main\res\drawable-xxhdpi\icon.png K:\www\res\icon\android\144.png

del /q K:\platforms\android-eclipse\res\drawable\icon.png
del /q K:\platforms\android-eclipse\res\drawable-ldpi\icon.png
del /q K:\platforms\android-eclipse\res\drawable-mdpi\icon.png
del /q K:\platforms\android-eclipse\res\drawable-hdpi\icon.png
del /q K:\platforms\android-eclipse\res\drawable-xhdpi\icon.png
del /q K:\platforms\android-eclipse\res\drawable-xxhdpi\icon.png 
mklink /h K:\platforms\android-eclipse\res\drawable\icon.png K:\www\res\icon\android\144.png
mklink /h K:\platforms\android-eclipse\res\drawable-ldpi\icon.png K:\www\res\icon\android\36.png
mklink /h K:\platforms\android-eclipse\res\drawable-mdpi\icon.png K:\www\res\icon\android\48.png
mklink /h K:\platforms\android-eclipse\res\drawable-hdpi\icon.png K:\www\res\icon\android\72.png
mklink /h K:\platforms\android-eclipse\res\drawable-xhdpi\icon.png K:\www\res\icon\android\96.png
mklink /h K:\platforms\android-eclipse\res\drawable-xxhdpi\icon.png K:\www\res\icon\android\144.png

K:\[bin]\embed K:\www\css\kcals.ttf

sleep 3
