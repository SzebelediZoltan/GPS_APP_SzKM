@echo off
title GPASS Starter
setlocal

echo =====================================
echo GPASS PROJECT STARTING...
echo =====================================

:: === Apache inditas (ablak nelkul) ===
echo Apache inditasa...
start "" /B C:\xampp\apache\bin\httpd.exe

timeout /t 3 > nul

:: === MySQL inditas (ablak nelkul) ===
echo MySQL inditasa...
start "" /B C:\xampp\mysql\bin\mysqld.exe

timeout /t 5 > nul

:: === Backend inditas (hatterben) ===
echo Backend inditasa...
cd /d "%~dp0gpass-app-backend"
start "" /B npm start

timeout /t 3 > nul

:: === Frontend inditas (hatterben) ===
echo Frontend inditasa...
cd /d "%~dp0gpass-app-frontend"
start "" /B npm run dev

timeout /t 5 > nul

:: === Chrome megnyitasa ===
start chrome http://localhost:3000

echo.
echo =====================================
echo MINDEN FUT!
echo Nyomj egy gombot a leallitashoz...
echo =====================================
pause

echo Leallitas...

:: Node processzek leallitasa
taskkill /IM node.exe /F > nul 2>&1

:: Apache leallitasa
taskkill /IM httpd.exe /F > nul 2>&1

:: MySQL leallitasa
taskkill /IM mysqld.exe /F > nul 2>&1

echo Minden leallitva.
timeout /t 2 > nul
exit