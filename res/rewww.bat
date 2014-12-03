echo wwwing...
RD /S /Q K:\platforms\android\assets\www
MKDIR K:\platforms\android\assets\www
cd K:\platforms\android\assets\www
call reswww

RD /S /Q K:\platforms\android-gradle\kcals\src\main\assets\www
MKDIR K:\platforms\android-gradle\kcals\src\main\assets\www
cd K:\platforms\android-gradle\kcals\src\main\assets\www
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

del /q K:\platforms\android\res\xml\config.xml
del /q K:\platforms\android-gradle\kcals\src\main\res\xml\config.xml
del /q K:\platforms\ios\KCals\config.xml
del /q K:\platforms\windows8\config.xml
del /q K:\platforms\wp8\config.xml
mklink /h K:\platforms\android\res\xml\config.xml k:\www\config.xml
mklink /h K:\platforms\android-gradle\kcals\src\main\res\xml\config.xml k:\www\config.xml
mklink /h K:\platforms\ios\KCals\config.xml k:\www\config.xml
mklink /h K:\platforms\windows8\config.xml k:\www\config.xml
mklink /h K:\platforms\wp8\config.xml k:\www\config.xml

del /q K:\platforms\wp8\159.png
del /q K:\platforms\wp8\336.png
del /q K:\platforms\wp8\691x336.png
mklink /h K:\platforms\wp8\159.png K:\www\res\icon\wp8\159.png
mklink /h K:\platforms\wp8\336.png K:\www\res\icon\wp8\336.png
mklink /h K:\platforms\wp8\691x336.png K:\www\res\icon\wp8\691x336.png
sleep 10