@echo off
title GPASS Server Controller
cd /d "%~dp0"

echo ==========================
echo Szerverek inditasa...
echo ==========================

:: Apache
start "" /MIN cmd /c C:\xampp\apache_start.bat

:: MySQL
start "" /MIN cmd /c C:\xampp\mysql_start.bat

timeout /t 5 > nul


:: Backend inditas
echo Backend inditasa...
start "" cmd /k "cd /d "%~dp0gpass-app-backend" && npm start"

:: PID mentés
set BACKENDPID=%!


:: Frontend inditas
echo Frontend inditasa...
start "" cmd /k "cd /d "%~dp0gpass-app-frontend" && npm run dev"

set FRONTENDPID=%!


:menu

echo.
echo ==========================
echo VEZERLES
echo ==========================
echo X - Minden leallitasa
echo F - Frontend ujrainditas
echo B - Backend ujrainditas
echo ==========================

choice /c XFB /n /m "Valasztas: "

if errorlevel 3 goto backend
if errorlevel 2 goto frontend
if errorlevel 1 goto stop

goto menu



:frontend

echo Frontend ujrainditas...

taskkill /F /IM node.exe > nul 2>&1

timeout /t 2 > nul

start "" cmd /k "cd /d "%~dp0gpass-app-frontend" && npm run dev"

goto menu



:backend

echo Backend ujrainditas...

taskkill /F /IM node.exe > nul 2>&1

timeout /t 2 > nul

start "" cmd /k "cd /d "%~dp0gpass-app-backend" && npm start"

goto menu



:stop

echo.
echo Szerverek leallitasa...

taskkill /F /IM httpd.exe > nul 2>&1
taskkill /F /IM mysqld.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo Kesz.
timeout /t 2 > nul

exit